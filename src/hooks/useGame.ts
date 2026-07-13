// ============================================================
// 星辉魔法学院 - 游戏逻辑 Hooks
// 提供对话、战斗、好感度、卡牌等核心功能
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { Character, Card, GameState, BattleState } from '../types';

/** 好感度数据接口 */
interface AffectionData {
  characterId: string;
  value: number;
  maxAffection: number;
  level: string;
  events: { type: string; amount: number; reason: string; timestamp: number }[];
}
import { GAME_CONFIG } from '../data';

// ============================================================
// 对话管理 Hook
// ============================================================

/** 对话状态接口 */
interface DialogueState {
  currentText: string;         // 当前显示的文字
  displayedText: string;       // 已显示的文字（打字机效果）
  isTyping: boolean;           // 是否正在打字
  speaker: string | null;      // 当前说话角色
  choices: string[] | null;    // 可选项列表
  canAdvance: boolean;         // 是否可推进
}

/**
 * 对话管理 Hook
 * 处理文字打字机效果、对话推进、选项选择等
 */
export function useDialogue() {
  const [state, setState] = useState<DialogueState>({
    currentText: '',
    displayedText: '',
    isTyping: false,
    speaker: null,
    choices: null,
    canAdvance: true,
  });

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textSpeedRef = useRef(GAME_CONFIG.defaultSettings.textSpeed);

  // 打字机效果
  const startTyping = useCallback((text: string, speaker?: string) => {
    // 清除之前的定时器
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    setState(prev => ({
      ...prev,
      currentText: text,
      displayedText: '',
      isTyping: true,
      speaker: speaker || null,
      choices: null,
      canAdvance: false,
    }));

    let index = 0;
    typingTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setState(prev => ({
          ...prev,
          displayedText: text.slice(0, index + 1),
        }));
        index++;
      } else {
        clearInterval(typingTimerRef.current!);
        setState(prev => ({
          ...prev,
          isTyping: false,
          canAdvance: true,
        }));
      }
    }, textSpeedRef.current);
  }, []);

  // 跳过打字效果，直接显示完整文字
  const skipTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }
    setState(prev => ({
      ...prev,
      displayedText: prev.currentText,
      isTyping: false,
      canAdvance: true,
    }));
  }, []);

  // 推进到下一句对话
  const advance = useCallback(() => {
    setState(prev => {
      if (prev.isTyping) {
        skipTyping();
        return prev;
      }
      return { ...prev, canAdvance: true };
    });
  }, [skipTyping]);

  // 显示选项
  const showChoices = useCallback((choices: string[]) => {
    setState(prev => ({
      ...prev,
      choices,
      canAdvance: false,
    }));
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  return { ...state, startTyping, skipTyping, advance, showChoices };
}

// ============================================================
// 战斗状态管理 Hook
// ============================================================

/** 战斗状态接口 */
interface BattleStatus {
  isInBattle: boolean;         // 是否在战斗中
  playerHP: number;            // 玩家生命值
  playerMaxHP: number;         // 玩家最大生命值
  playerMP: number;            // 玩家魔力值
  playerMaxMP: number;         // 玩家最大魔力值
  enemyHP: number;             // 敌人生命值
  enemyMaxHP: number;          // 敌人最大生命值
  currentTurn: 'player' | 'enemy';  // 当前回合
  playerHand: Card[];          // 玩家手牌
  playerDeck: Card[];          // 玩家牌组
  discardPile: Card[];         // 弃牌堆
  turnCount: number;           // 回合数
  battleLog: string[];         // 战斗日志
}

/**
 * 战斗状态管理 Hook
 * 处理回合制卡牌战斗逻辑
 */
export function useBattle() {
  const [battle, setBattle] = useState<BattleStatus>({
    isInBattle: false,
    playerHP: 100,
    playerMaxHP: 100,
    playerMP: 50,
    playerMaxMP: 50,
    enemyHP: 100,
    enemyMaxHP: 100,
    currentTurn: 'player',
    playerHand: [],
    playerDeck: [],
    discardPile: [],
    turnCount: 0,
    battleLog: [],
  });

  // 初始化战斗
  const startBattle = useCallback((playerDeck: Card[], enemyHP: number) => {
    const shuffled = [...playerDeck].sort(() => Math.random() - 0.5);
    const hand = shuffled.splice(0, 5);

    setBattle({
      isInBattle: true,
      playerHP: 100,
      playerMaxHP: 100,
      playerMP: 50,
      playerMaxMP: 50,
      enemyHP,
      enemyMaxHP: enemyHP,
      currentTurn: 'player',
      playerHand: hand,
      playerDeck: shuffled,
      discardPile: [],
      turnCount: 1,
      battleLog: ['战斗开始！'],
    });
  }, []);

  // 出牌
  const playCard = useCallback((cardIndex: number) => {
    setBattle(prev => {
      if (prev.currentTurn !== 'player') return prev;

      const card = prev.playerHand[cardIndex];
      if (!card || prev.playerMP < card.cost) return prev;

      const newHand = [...prev.playerHand];
      newHand.splice(cardIndex, 1);

      const newLog = [...prev.battleLog, `使用了 ${card.name}！`];
      let newEnemyHP = prev.enemyHP;
      let newPlayerHP = prev.playerHP;
      let newPlayerMP = prev.playerMP - card.cost;

      // 根据卡牌类型执行效果
      if (card.type === 'attack') {
        newEnemyHP = Math.max(0, newEnemyHP - card.damage);
        newLog.push(`造成 ${card.damage} 点伤害！`);
      } else if (card.type === 'heal') {
        newPlayerHP = Math.min(prev.playerMaxHP, newPlayerHP + card.damage);
        newLog.push(`恢复 ${card.damage} 点生命！`);
      } else if (card.type === 'defense') {
        newLog.push(`获得 ${card.damage} 点护甲！`);
      }

      return {
        ...prev,
        playerHand: newHand,
        playerHP: newPlayerHP,
        playerMP: newPlayerMP,
        enemyHP: newEnemyHP,
        discardPile: [...prev.discardPile, card],
        battleLog: newLog,
      };
    });
  }, []);

  // 结束回合
  const endTurn = useCallback(() => {
    setBattle(prev => {
      const newDeck = [...prev.playerDeck];
      const newHand = [...prev.playerHand];

      // 抽牌
      if (newDeck.length > 0) {
        newHand.push(newDeck.shift()!);
      }

      return {
        ...prev,
        currentTurn: 'enemy',
        playerHand: newHand,
        playerDeck: newDeck,
        turnCount: prev.turnCount + 1,
        battleLog: [...prev.battleLog, '对手的回合...'],
      };
    });
  }, []);

  // 结束战斗
  const endBattle = useCallback(() => {
    setBattle(prev => ({ ...prev, isInBattle: false }));
  }, []);

  return { ...battle, startBattle, playCard, endTurn, endBattle };
}

// ============================================================
// 角色好感度 Hook
// ============================================================

/**
 * 角色好感度管理 Hook
 * 追踪和更新与各个角色的好感度
 */
export function useAffection(characterId: string) {
  const [affection, setAffection] = useState<AffectionData>({
    characterId,
    value: 0,
    maxAffection: 100,
    level: 'stranger',  // stranger -> acquaintance -> friend -> close -> romantic
    events: [],
  });

  // 增加好感度
  const addAffection = useCallback((amount: number, reason?: string) => {
    setAffection(prev => {
      const newValue = Math.min(prev.maxAffection, prev.value + amount);
      let newLevel = prev.level;

      // 根据好感度值更新关系等级
      if (newValue >= 80) newLevel = 'romantic';
      else if (newValue >= 60) newLevel = 'close';
      else if (newValue >= 40) newLevel = 'friend';
      else if (newValue >= 20) newLevel = 'acquaintance';

      return {
        ...prev,
        value: newValue,
        level: newLevel,
        events: reason
          ? [...prev.events, { type: 'gain', amount, reason, timestamp: Date.now() }]
          : prev.events,
      };
    });
  }, []);

  // 减少好感度
  const decreaseAffection = useCallback((amount: number, reason?: string) => {
    setAffection(prev => {
      const newValue = Math.max(0, prev.value - amount);
      let newLevel = prev.level;

      if (newValue < 20) newLevel = 'stranger';
      else if (newValue < 40) newLevel = 'acquaintance';
      else if (newValue < 60) newLevel = 'friend';
      else if (newValue < 80) newLevel = 'close';

      return {
        ...prev,
        value: newValue,
        level: newLevel,
        events: reason
          ? [...prev.events, { type: 'loss', amount: -amount, reason, timestamp: Date.now() }]
          : prev.events,
      };
    });
  }, []);

  return { ...affection, addAffection, decreaseAffection };
}

// ============================================================
// 卡牌管理 Hook
// ============================================================

/**
 * 卡牌背包管理 Hook
 * 管理玩家的卡牌收集、组牌等
 */
export function useCards() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [collection, setCollection] = useState<Card[]>([]);

  // 添加卡牌到收藏
  const addCard = useCallback((card: Card) => {
    setCollection(prev => [...prev, card]);
  }, []);

  // 将卡牌加入牌组
  const addToDeck = useCallback((card: Card) => {
    setDeck(prev => {
      // 检查牌组上限
      if (prev.length >= 30) return prev;
      // 检查同名卡牌数量限制
      const sameCardCount = prev.filter(c => c.id === card.id).length;
      if (sameCardCount >= 3) return prev;
      return [...prev, card];
    });
  }, []);

  // 从牌组移除卡牌
  const removeFromDeck = useCallback((cardId: string) => {
    setDeck(prev => {
      const index = prev.findIndex(c => c.id === cardId);
      if (index === -1) return prev;
      const newDeck = [...prev];
      newDeck.splice(index, 1);
      return newDeck;
    });
  }, []);

  return { deck, collection, addCard, addToDeck, removeFromDeck };
}

// ============================================================
// 自动保存 Hook
// ============================================================

/**
 * 自动保存 Hook
 * 按指定间隔自动保存游戏状态
 */
export function useAutoSave(gameState: GameState, interval: number = 60000) {
  const lastSaveRef = useRef<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const saveData = {
          ...gameState,
          savedAt: new Date().toISOString(),
          version: GAME_CONFIG.version,
        };
        localStorage.setItem('autosave', JSON.stringify(saveData));
        lastSaveRef.current = Date.now();
        console.log('[自动保存] 游戏已保存');
      } catch (error) {
        console.error('[自动保存] 保存失败:', error);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [gameState, interval]);

  // 手动保存
  const saveGame = useCallback((slot: number = 0) => {
    try {
      const saveData = {
        ...gameState,
        savedAt: new Date().toISOString(),
        version: GAME_CONFIG.version,
      };
      localStorage.setItem(`save_${slot}`, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('[保存] 保存失败:', error);
      return false;
    }
  }, [gameState]);

  // 读取存档
  const loadGame = useCallback((slot: number = 0) => {
    try {
      const data = localStorage.getItem(`save_${slot}`);
      if (data) {
        return JSON.parse(data) as GameState;
      }
      return null;
    } catch (error) {
      console.error('[读取] 读取失败:', error);
      return null;
    }
  }, []);

  return { saveGame, loadGame };
}

// ============================================================
// 键盘快捷键 Hook
// ============================================================

/**
 * 键盘快捷键管理 Hook
 * 处理游戏中的键盘输入
 */
export function useKeyboardShortcuts(handlers: {
  onAdvance?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onMenu?: () => void;
  onAuto?: () => void;
  onSkip?: () => void;
  onToggleFullscreen?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的按键
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          handlers.onAdvance?.();
          break;
        case 'Escape':
          handlers.onMenu?.();
          break;
        case 's':
        case 'S':
          if (e.ctrlKey) {
            e.preventDefault();
            handlers.onSave?.();
          }
          break;
        case 'l':
        case 'L':
          if (e.ctrlKey) {
            e.preventDefault();
            handlers.onLoad?.();
          }
          break;
        case 'a':
        case 'A':
          handlers.onAuto?.();
          break;
        case 't':
        case 'T':
          handlers.onSkip?.();
          break;
        case 'f':
        case 'F':
          handlers.onToggleFullscreen?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

// ============================================================
// 音频管理 Hook
// ============================================================

/**
 * 音频播放管理 Hook
 * 控制BGM、音效、语音的播放
 */
export function useAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  // 播放背景音乐
  const playBGM = useCallback((src: string, loop: boolean = true) => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
    bgmRef.current = new Audio(src);
    bgmRef.current.loop = loop;
    bgmRef.current.volume = GAME_CONFIG.defaultSettings.bgmVolume;
    bgmRef.current.play().catch(console.error);
  }, []);

  // 停止背景音乐
  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  // 播放音效
  const playSFX = useCallback((src: string) => {
    sfxRef.current = new Audio(src);
    sfxRef.current.volume = GAME_CONFIG.defaultSettings.sfxVolume;
    sfxRef.current.play().catch(console.error);
  }, []);

  // 设置音量
  const setVolume = useCallback((type: 'bgm' | 'sfx' | 'voice', value: number) => {
    const volume = Math.max(0, Math.min(1, value));
    if (type === 'bgm' && bgmRef.current) {
      bgmRef.current.volume = volume;
    }
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      bgmRef.current?.pause();
      sfxRef.current?.pause();
    };
  }, []);

  return { playBGM, stopBGM, playSFX, setVolume };
}
