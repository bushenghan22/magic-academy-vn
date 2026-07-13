/**
 * AudioManager - 星辉魔法学院音频管理系统
 *
 * 使用 Web Audio API 进行音效合成，支持 BGM、SFX、Voice 独立音量控制。
 * 支持 Howler.js 作为实际音频播放后端，无音频文件时自动回退到合成音效。
 */

// ===== 类型定义 =====

/** 音效名称类型 */
type SFXName =
  | 'click'
  | 'hover'
  | 'magic_cast'
  | 'hit'
  | 'heal'
  | 'card_play'
  | 'victory'
  | 'defeat'
  | 'notification'
  | 'text_advance'
  | 'choice_select'
  | 'transition'
  | 'battle_start'
  | 'affection_up'
  | 'unlock';

/** BGM 名称类型 */
type BGMName =
  | 'title_bgm'
  | 'school_bgm'
  | 'battle_bgm'
  | 'emotional_bgm'
  | 'tension_bgm'
  | 'bgm_main_theme'
  | 'bgm_peaceful_daily'
  | 'bgm_mysterious'
  | 'bgm_battle'
  | 'bgm_boss_battle'
  | 'bgm_awakening'
  | 'bgm_school_life'
  | 'bgm_romantic'
  | 'bgm_sad'
  | 'bgm_festival';

/** 音量设置 */
interface VolumeSettings {
  bgm: number;   // 0.0 ~ 1.0
  sfx: number;
  voice: number;
}

/** 音效合成参数 */
interface SFXSynthConfig {
  frequencies: number[];
  durations: number[];
  type: OscillatorType;
  volume: number;
  fadeOut: boolean;
}

/** BGM 合成参数 */
interface BGMSynthConfig {
  baseFreqs: number[];
  modFreq: number;
  modDepth: number;
  type: OscillatorType;
  volume: number;
}

// ===== AudioManager 主类 =====

export class AudioManager {
  // ---- 单例 ----
  private static instance: AudioManager | null = null;

  /** 获取单例实例 */
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // ---- Web Audio 核心节点 ----
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  // ---- 音量 ----
  private volume: VolumeSettings = { bgm: 0.5, sfx: 0.7, voice: 0.8 };

  // ---- BGM 状态 ----
  private currentBGM: BGMName | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGainNodes: GainNode[] = [];
  private bgmCrossfadeDuration = 2.0; // 淡入淡出秒数
  private bgmFadeTimeouts: ReturnType<typeof setTimeout>[] = [];

  // ---- 初始化状态 ----
  private initialized = false;

  // ---- 私有构造函数（单例） ----
  private constructor() {}

  // ================================================================
  //  初始化 / 清理
  // ================================================================

  /** 初始化音频系统 */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.audioContext = new AudioContext();

      // 创建主增益节点层级
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);

      this.bgmGain = this.audioContext.createGain();
      this.bgmGain.gain.value = this.volume.bgm;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = this.volume.sfx;
      this.sfxGain.connect(this.masterGain);

      this.voiceGain = this.audioContext.createGain();
      this.voiceGain.gain.value = this.volume.voice;
      this.voiceGain.connect(this.masterGain);

      // 尝试恢复被浏览器挂起的 AudioContext
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 若在 await 期间 cleanup() 已被调用，则中止初始化
      if (!this.audioContext) return;

      this.initialized = true;
    } catch (err) {
      console.error('[AudioManager] 初始化失败:', err);
    }
  }

  /** 清理所有音频资源 */
  public cleanup(): void {
    // 清除所有待执行的定时器
    for (const t of this.bgmFadeTimeouts) {
      clearTimeout(t);
    }
    this.bgmFadeTimeouts = [];

    // 立即停止所有 BGM 振荡器
    for (const osc of this.bgmOscillators) {
      try { osc.stop(); osc.disconnect(); } catch { /* 忽略 */ }
    }
    this.bgmOscillators = [];
    for (const gain of this.bgmGainNodes) {
      try { gain.disconnect(); } catch { /* 忽略 */ }
    }
    this.bgmGainNodes = [];
    this.currentBGM = null;

    // 关闭 AudioContext
    if (this.audioContext) {
      try { this.audioContext.close(); } catch { /* 忽略 */ }
      this.audioContext = null;
    }

    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.voiceGain = null;
    this.initialized = false;
  }

  // ================================================================
  //  音量控制
  // ================================================================

  /** 设置 BGM 音量 (0.0 ~ 1.0) */
  public setBGMVolume(value: number): void {
    this.volume.bgm = Math.max(0, Math.min(1, value));
    if (this.bgmGain && this.audioContext) {
      this.bgmGain.gain.setTargetAtTime(
        this.volume.bgm,
        this.audioContext.currentTime,
        0.1
      );
    }
  }

  /** 设置 SFX 音量 (0.0 ~ 1.0) */
  public setSFXVolume(value: number): void {
    this.volume.sfx = Math.max(0, Math.min(1, value));
    if (this.sfxGain && this.audioContext) {
      this.sfxGain.gain.setTargetAtTime(
        this.volume.sfx,
        this.audioContext.currentTime,
        0.1
      );
    }
  }

  /** 设置语音音量 (0.0 ~ 1.0) */
  public setVoiceVolume(value: number): void {
    this.volume.voice = Math.max(0, Math.min(1, value));
    if (this.voiceGain && this.audioContext) {
      this.voiceGain.gain.setTargetAtTime(
        this.volume.voice,
        this.audioContext.currentTime,
        0.1
      );
    }
  }

  /** 获取当前音量设置 */
  public getVolume(): Readonly<VolumeSettings> {
    return { ...this.volume };
  }

  // ================================================================
  //  BGM 播放
  // ================================================================

  /**
   * 播放 BGM，支持与当前 BGM 交叉淡入淡出
   * @param name BGM 名称
   */
  public playBGM(name: BGMName): void {
    if (!this.initialized || !this.audioContext || !this.bgmGain) return;

    // 如果正在播放同一首 BGM，忽略
    if (this.currentBGM === name) return;

    const config = this.getBGMSynthConfig(name);
    if (!config || !config.baseFreqs) {
      console.warn(`[AudioManager] Unknown BGM: ${name}, falling back to school_bgm`);
      return this.playBGM('school_bgm');
    }
    const now = this.audioContext.currentTime;

    // 淡出旧 BGM
    this.fadeOutCurrentBGM(now);

    // 创建新的 BGM 振荡器组
    const newOscillators: OscillatorNode[] = [];
    const newGainNodes: GainNode[] = [];

    // 主音振荡器
    for (const freq of config.baseFreqs) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = config.type;
      osc.frequency.value = freq;

      // 添加轻微频率调制，让音色更丰富
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = config.modFreq;
      lfoGain.gain.value = config.modDepth;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      // 淡入
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(
        config.volume / config.baseFreqs.length,
        now + this.bgmCrossfadeDuration
      );

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      newOscillators.push(osc, lfo);
      newGainNodes.push(gain);
    }

    this.bgmOscillators = newOscillators;
    this.bgmGainNodes = newGainNodes;
    this.currentBGM = name;
  }

  /** 停止当前 BGM */
  public stopBGM(): void {
    if (!this.audioContext) return;
    this.fadeOutCurrentBGM(this.audioContext.currentTime);
    this.currentBGM = null;
  }

  /**
   * 淡出 BGM
   * @param duration 淡出时长（秒），默认 1.5
   */
  public fadeOutBGM(duration: number = 1.5): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;

    for (const gain of this.bgmGainNodes) {
      gain.gain.setTargetAtTime(0, now, duration / 3);
    }

    // 在淡出结束后停止振荡器
    const timeoutId = setTimeout(() => {
      this.destroyCurrentBGM();
      this.bgmFadeTimeouts = this.bgmFadeTimeouts.filter(t => t !== timeoutId);
    }, duration * 1000 + 200);
    this.bgmFadeTimeouts.push(timeoutId);

    this.currentBGM = null;
  }

  // ================================================================
  //  SFX 播放
  // ================================================================

  /**
   * 播放音效（Web Audio API 合成）
   * @param name 音效名称
   */
  public playSFX(name: SFXName): void {
    if (!this.initialized || !this.audioContext || !this.sfxGain) return;

    const config = this.getSFXSynthConfig(name);
    const now = this.audioContext.currentTime;

    this.synthesizeSFX(config, now);
  }

  // ================================================================
  //  内部方法 - 音效合成
  // ================================================================

  /**
   * 使用 OscillatorNode 合成音效
   */
  private synthesizeSFX(config: SFXSynthConfig, startTime: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const ctx = this.audioContext;
    let totalDuration = 0;

    for (let i = 0; i < config.frequencies.length; i++) {
      const freq = config.frequencies[i];
      const dur = config.durations[i] || 0.1;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.type;
      osc.frequency.setValueAtTime(freq, startTime + totalDuration);

      const noteVol = config.volume / config.frequencies.length;
      gain.gain.setValueAtTime(noteVol, startTime + totalDuration);

      if (config.fadeOut) {
        gain.gain.setTargetAtTime(
          0,
          startTime + totalDuration + dur * 0.6,
          dur * 0.2
        );
      } else {
        gain.gain.setTargetAtTime(0, startTime + totalDuration + dur * 0.9, dur * 0.05);
      }

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime + totalDuration);
      osc.stop(startTime + totalDuration + dur + 0.1);

      totalDuration += dur;
    }
  }

  /**
   * 获取音效合成配置
   */
  private getSFXSynthConfig(name: SFXName): SFXSynthConfig {
    const configs: Record<SFXName, SFXSynthConfig> = {
      click: { frequencies: [800], durations: [0.06], type: 'sine', volume: 0.3, fadeOut: true },
      hover: { frequencies: [400, 500], durations: [0.05, 0.04], type: 'sine', volume: 0.15, fadeOut: true },
      magic_cast: { frequencies: [300, 400, 500, 600, 800, 1000], durations: [0.1, 0.1, 0.08, 0.08, 0.1, 0.2], type: 'sine', volume: 0.4, fadeOut: true },
      hit: { frequencies: [150, 100, 80], durations: [0.05, 0.08, 0.1], type: 'sawtooth', volume: 0.5, fadeOut: true },
      heal: { frequencies: [523, 659, 784, 1047], durations: [0.12, 0.12, 0.12, 0.3], type: 'sine', volume: 0.35, fadeOut: true },
      card_play: { frequencies: [600, 400, 300], durations: [0.05, 0.08, 0.1], type: 'triangle', volume: 0.35, fadeOut: true },
      victory: { frequencies: [523, 523, 523, 784, 659, 784, 1047], durations: [0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.5], type: 'square', volume: 0.3, fadeOut: false },
      defeat: { frequencies: [500, 450, 400, 350, 300, 250], durations: [0.2, 0.2, 0.2, 0.2, 0.2, 0.5], type: 'sine', volume: 0.3, fadeOut: true },
      notification: { frequencies: [880, 1100, 880], durations: [0.1, 0.15, 0.2], type: 'sine', volume: 0.25, fadeOut: true },
      text_advance: { frequencies: [600], durations: [0.04], type: 'sine', volume: 0.2, fadeOut: true },
      choice_select: { frequencies: [600, 900], durations: [0.08, 0.15], type: 'sine', volume: 0.3, fadeOut: true },
      transition: { frequencies: [200, 600, 1200], durations: [0.15, 0.2, 0.25], type: 'sawtooth', volume: 0.2, fadeOut: true },
      battle_start: { frequencies: [80, 100, 80, 120, 80], durations: [0.1, 0.05, 0.1, 0.05, 0.2], type: 'sawtooth', volume: 0.5, fadeOut: false },
      affection_up: { frequencies: [100, 100, 800, 1200, 800, 1400], durations: [0.08, 0.08, 0.06, 0.06, 0.06, 0.2], type: 'sine', volume: 0.35, fadeOut: true },
      unlock: { frequencies: [440, 554, 659, 880, 1100], durations: [0.08, 0.08, 0.08, 0.12, 0.3], type: 'triangle', volume: 0.35, fadeOut: true },
    };
    return configs[name];
  }

  // ================================================================
  //  内部方法 - BGM 合成配置
  // ================================================================

  private getBGMSynthConfig(name: BGMName): BGMSynthConfig {
    const configs: Record<string, BGMSynthConfig> = {
      title_bgm: { baseFreqs: [130.81, 164.81, 196.0, 261.63], modFreq: 0.3, modDepth: 2.0, type: 'sine', volume: 0.25 },
      school_bgm: { baseFreqs: [261.63, 329.63, 392.0, 523.25], modFreq: 0.5, modDepth: 3.0, type: 'triangle', volume: 0.2 },
      battle_bgm: { baseFreqs: [110.0, 130.81, 164.81, 220.0], modFreq: 2.0, modDepth: 8.0, type: 'sawtooth', volume: 0.15 },
      emotional_bgm: { baseFreqs: [220.0, 261.63, 329.63, 440.0], modFreq: 0.2, modDepth: 1.5, type: 'sine', volume: 0.2 },
      tension_bgm: { baseFreqs: [73.42, 82.41, 98.0, 110.0], modFreq: 0.8, modDepth: 5.0, type: 'sawtooth', volume: 0.12 },
      bgm_main_theme: { baseFreqs: [146.83, 185.00, 220.00, 293.66], modFreq: 0.4, modDepth: 2.5, type: 'sine', volume: 0.25 },
      bgm_peaceful_daily: { baseFreqs: [261.63, 329.63, 392.00, 523.25], modFreq: 0.6, modDepth: 2.0, type: 'triangle', volume: 0.18 },
      bgm_mysterious: { baseFreqs: [98.00, 130.81, 146.83, 196.00], modFreq: 0.7, modDepth: 4.0, type: 'sine', volume: 0.2 },
      bgm_battle: { baseFreqs: [110.00, 138.59, 164.81, 220.00], modFreq: 2.5, modDepth: 10.0, type: 'sawtooth', volume: 0.18 },
      bgm_boss_battle: { baseFreqs: [82.41, 110.00, 130.81, 164.81], modFreq: 3.0, modDepth: 12.0, type: 'square', volume: 0.15 },
      bgm_awakening: { baseFreqs: [196.00, 261.63, 329.63, 392.00, 523.25], modFreq: 0.5, modDepth: 3.0, type: 'sine', volume: 0.22 },
      bgm_school_life: { baseFreqs: [293.66, 349.23, 440.00, 523.25], modFreq: 0.8, modDepth: 2.5, type: 'triangle', volume: 0.2 },
      bgm_romantic: { baseFreqs: [220.00, 277.18, 329.63, 440.00], modFreq: 0.3, modDepth: 1.5, type: 'sine', volume: 0.2 },
      bgm_sad: { baseFreqs: [164.81, 196.00, 246.94, 329.63], modFreq: 0.2, modDepth: 2.0, type: 'sine', volume: 0.18 },
      bgm_festival: { baseFreqs: [261.63, 329.63, 392.00, 523.25, 659.25], modFreq: 1.0, modDepth: 3.0, type: 'triangle', volume: 0.2 },
    };
    return configs[name] || configs['school_bgm'];
  }

  // ================================================================
  //  内部方法 - BGM 管理
  // ================================================================

  /** 淡出当前正在播放的 BGM */
  private fadeOutCurrentBGM(now: number): void {
    for (const gain of this.bgmGainNodes) {
      gain.gain.setTargetAtTime(0, now, this.bgmCrossfadeDuration / 3);
    }

    // 淡出完成后销毁振荡器
    const oldOscillators = [...this.bgmOscillators];
    const oldGainNodes = [...this.bgmGainNodes];

    const timeoutId = setTimeout(() => {
      for (const osc of oldOscillators) {
        try { osc.stop(); osc.disconnect(); } catch { /* 已停止的振荡器忽略 */ }
      }
      for (const g of oldGainNodes) {
        try { g.disconnect(); } catch { /* 忽略 */ }
      }
      this.bgmFadeTimeouts = this.bgmFadeTimeouts.filter(t => t !== timeoutId);
    }, this.bgmCrossfadeDuration * 1000 + 500);
    this.bgmFadeTimeouts.push(timeoutId);

    this.bgmOscillators = [];
    this.bgmGainNodes = [];
  }

  /** 销毁当前 BGM 的所有节点 */
  private destroyCurrentBGM(): void {
    for (const osc of this.bgmOscillators) {
      try { osc.stop(); } catch { /* 忽略 */ }
    }
    this.bgmOscillators = [];
    this.bgmGainNodes = [];
  }
}

export type { SFXName, BGMName, VolumeSettings };
