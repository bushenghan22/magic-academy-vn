import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../systems/store';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface SettingsScreenProps {
  onBack: () => void;
}

// ─── 文字速度映射 ─────────────────────────────────────────────────────────

const TEXT_SPEED_OPTIONS = ['slow', 'medium', 'fast', 'instant'] as const;
const TEXT_SPEED_LABELS = ['慢', '中', '快', '瞬间'];

const AUTO_SPEED_OPTIONS = [3000, 2500, 2000, 1500, 1000];
const AUTO_SPEED_LABELS = ['极慢', '慢', '中', '快', '极快'];

const RESOLUTION_OPTIONS = [
  { value: '1080p', label: '1920 × 1080' },
  { value: '1440p', label: '2560 × 1440' },
  { value: '720p', label: '1280 × 720' },
];

// ─── 样式 ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 40%, rgba(20,5,50,0.92) 0%, rgba(5,0,15,0.97) 100%)',
    backdropFilter: 'blur(8px)',
  },
  panel: {
    position: 'relative',
    width: '720px',
    maxHeight: '85vh',
    background: 'linear-gradient(145deg, rgba(25,10,55,0.85) 0%, rgba(10,5,30,0.95) 100%)',
    border: '1px solid rgba(120,80,220,0.25)',
    borderRadius: '16px',
    padding: '40px 48px',
    overflowY: 'auto',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 0 60px rgba(100,60,200,0.15), 0 0 120px rgba(60,30,150,0.08)',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    fontFamily: "'Cinzel', 'Orbitron', serif",
    background: 'linear-gradient(135deg, #e0c0ff, #a080ff, #80c0ff)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: '32px',
    letterSpacing: '8px',
  },
  section: {
    marginBottom: '28px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(30,12,60,0.5) 0%, rgba(15,8,35,0.6) 100%)',
    border: '1px solid rgba(120,80,220,0.15)',
    borderRadius: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(200,170,255,0.9)',
    marginBottom: '16px',
    letterSpacing: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    gap: '16px',
  },
  settingLabel: {
    fontSize: '14px',
    color: 'rgba(200,190,230,0.85)',
    minWidth: '80px',
    letterSpacing: '1px',
  },
  sliderContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  slider: {
    flex: 1,
    height: '6px',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    background: 'rgba(60,30,120,0.5)',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
  },
  sliderValue: {
    fontSize: '13px',
    color: 'rgba(160,200,255,0.8)',
    minWidth: '36px',
    textAlign: 'right' as const,
    fontFamily: "'Orbitron', sans-serif",
  },
  volumeIcon: {
    fontSize: '18px',
    minWidth: '24px',
    textAlign: 'center' as const,
  },
  toggle: {
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    border: '1px solid rgba(120,80,220,0.3)',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.3s ease',
    padding: 0,
  },
  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '2px',
    transition: 'all 0.3s ease',
  },
  select: {
    padding: '8px 16px',
    background: 'rgba(20,8,45,0.8)',
    border: '1px solid rgba(120,80,220,0.3)',
    borderRadius: '8px',
    color: 'rgba(200,190,230,0.9)',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
    gap: '16px',
  },
  backButton: {
    padding: '12px 32px',
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '2px',
    border: '1px solid rgba(180,140,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(30,10,60,0.6), rgba(15,5,40,0.8))',
    color: 'rgba(220,200,255,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
  },
  resetButton: {
    padding: '12px 32px',
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '2px',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(60,15,15,0.6), rgba(40,10,10,0.8))',
    color: 'rgba(255,180,180,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
  },
};

// ─── 自定义 CSS ──────────────────────────────────────────────────────────

const sliderCSS = `
  .settings-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a080ff, #60c0ff);
    box-shadow: 0 0 8px rgba(160,120,255,0.6);
    cursor: pointer;
  }
  .settings-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a080ff, #60c0ff);
    box-shadow: 0 0 8px rgba(160,120,255,0.6);
    cursor: pointer;
    border: none;
  }
  .settings-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(160,100,255,0.3);
  }
  .settings-btn:active {
    transform: translateY(0);
  }
`;

// ─── 获取音量图标 ────────────────────────────────────────────────────────

function getVolumeIcon(value: number): string {
  if (value === 0) return '🔇';
  if (value < 33) return '🔈';
  if (value < 66) return '🔉';
  return '🔊';
}

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { settings, updateSettings, resetSettings } = useGameStore();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(2); // 1=小, 2=中, 3=大

  // 将 store 的 textSpeed 映射到 slider 值 (1-4)
  const textSpeedIdx = TEXT_SPEED_OPTIONS.indexOf(settings.textSpeed);
  const textSpeedSlider = textSpeedIdx >= 0 ? textSpeedIdx + 1 : 2;

  // 将 store 的 autoSpeed 映射到 slider 值 (1-5)
  const autoSpeedIdx = AUTO_SPEED_OPTIONS.indexOf(settings.autoSpeed);
  const autoSpeedSlider = autoSpeedIdx >= 0 ? autoSpeedIdx + 1 : 3;

  // 音量转为 0-100 显示
  const bgmDisplay = Math.round(settings.bgmVolume * 100);
  const sfxDisplay = Math.round(settings.sfxVolume * 100);
  const voiceDisplay = Math.round(settings.voiceVolume * 100);

  // 字体大小标签
  const fontSizeLabels = ['小', '中', '大'];

  const handleTextSpeedChange = (val: number) => {
    const idx = Math.max(0, Math.min(3, val - 1));
    updateSettings({ textSpeed: TEXT_SPEED_OPTIONS[idx] });
  };

  const handleAutoSpeedChange = (val: number) => {
    const idx = Math.max(0, Math.min(4, val - 1));
    updateSettings({ autoSpeed: AUTO_SPEED_OPTIONS[idx] });
  };

  const handleReset = () => {
    resetSettings();
    setHighContrast(false);
    setFontSizeLevel(2);
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{sliderCSS}</style>
      <div style={styles.backdrop} onClick={onBack} />

      <motion.div
        style={styles.panel}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        <h1 style={styles.title}>设 置</h1>

        {/* ── 音频设置 ────────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🎵</span> 音频设置
          </div>

          {/* BGM 音量 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>BGM</span>
            <div style={styles.sliderContainer}>
              <span style={styles.volumeIcon}>{getVolumeIcon(bgmDisplay)}</span>
              <input
                type="range"
                className="settings-slider"
                min={0}
                max={100}
                value={bgmDisplay}
                onChange={(e) => updateSettings({ bgmVolume: Number(e.target.value) / 100 })}
                style={styles.slider}
              />
              <span style={styles.sliderValue}>{bgmDisplay}</span>
            </div>
          </div>

          {/* SFX 音量 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>音效</span>
            <div style={styles.sliderContainer}>
              <span style={styles.volumeIcon}>{getVolumeIcon(sfxDisplay)}</span>
              <input
                type="range"
                className="settings-slider"
                min={0}
                max={100}
                value={sfxDisplay}
                onChange={(e) => updateSettings({ sfxVolume: Number(e.target.value) / 100 })}
                style={styles.slider}
              />
              <span style={styles.sliderValue}>{sfxDisplay}</span>
            </div>
          </div>

          {/* 语音音量 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>语音</span>
            <div style={styles.sliderContainer}>
              <span style={styles.volumeIcon}>{getVolumeIcon(voiceDisplay)}</span>
              <input
                type="range"
                className="settings-slider"
                min={0}
                max={100}
                value={voiceDisplay}
                onChange={(e) => updateSettings({ voiceVolume: Number(e.target.value) / 100 })}
                style={styles.slider}
              />
              <span style={styles.sliderValue}>{voiceDisplay}</span>
            </div>
          </div>
        </div>

        {/* ── 文字设置 ────────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>📝</span> 文字设置
          </div>

          {/* 文字速度 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>文字速度</span>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                className="settings-slider"
                min={1}
                max={4}
                step={1}
                value={textSpeedSlider}
                onChange={(e) => handleTextSpeedChange(Number(e.target.value))}
                style={styles.slider}
              />
              <span style={{ ...styles.sliderValue, minWidth: '48px' }}>
                {TEXT_SPEED_LABELS[textSpeedSlider - 1]}
              </span>
            </div>
          </div>

          {/* 自动播放速度 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>自动速度</span>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                className="settings-slider"
                min={1}
                max={5}
                step={1}
                value={autoSpeedSlider}
                onChange={(e) => handleAutoSpeedChange(Number(e.target.value))}
                style={styles.slider}
              />
              <span style={{ ...styles.sliderValue, minWidth: '48px' }}>
                {AUTO_SPEED_LABELS[autoSpeedSlider - 1]}
              </span>
            </div>
          </div>

          {/* 跳过已读 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>跳过已读</span>
            <button
              style={{
                ...styles.toggle,
                background: settings.skipRead
                  ? 'linear-gradient(135deg, #6040c0, #4080ff)'
                  : 'rgba(30,15,50,0.8)',
              }}
              onClick={() => updateSettings({ skipRead: !settings.skipRead })}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  left: settings.skipRead ? '24px' : '2px',
                  background: settings.skipRead
                    ? 'linear-gradient(135deg, #c0a0ff, #80c0ff)'
                    : 'rgba(120,100,160,0.6)',
                  boxShadow: settings.skipRead ? '0 0 8px rgba(120,180,255,0.5)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* ── 显示设置 ────────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🖥️</span> 显示设置
          </div>

          {/* 全屏 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>全屏模式</span>
            <button
              style={{
                ...styles.toggle,
                background: settings.isFullscreen
                  ? 'linear-gradient(135deg, #6040c0, #4080ff)'
                  : 'rgba(30,15,50,0.8)',
              }}
              onClick={() => updateSettings({ isFullscreen: !settings.isFullscreen })}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  left: settings.isFullscreen ? '24px' : '2px',
                  background: settings.isFullscreen
                    ? 'linear-gradient(135deg, #c0a0ff, #80c0ff)'
                    : 'rgba(120,100,160,0.6)',
                  boxShadow: settings.isFullscreen ? '0 0 8px rgba(120,180,255,0.5)' : 'none',
                }}
              />
            </button>
          </div>

          {/* 分辨率 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>分辨率</span>
            <select
              style={styles.select}
              value={settings.resolution}
              onChange={(e) => updateSettings({ resolution: e.target.value as '720p' | '1080p' | '1440p' })}
            >
              {RESOLUTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── 无障碍设置 ──────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>♿</span> 无障碍
          </div>

          {/* 高对比度 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>高对比度</span>
            <button
              style={{
                ...styles.toggle,
                background: highContrast
                  ? 'linear-gradient(135deg, #6040c0, #4080ff)'
                  : 'rgba(30,15,50,0.8)',
              }}
              onClick={() => setHighContrast(!highContrast)}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  left: highContrast ? '24px' : '2px',
                  background: highContrast
                    ? 'linear-gradient(135deg, #c0a0ff, #80c0ff)'
                    : 'rgba(120,100,160,0.6)',
                  boxShadow: highContrast ? '0 0 8px rgba(120,180,255,0.5)' : 'none',
                }}
              />
            </button>
          </div>

          {/* 字体大小 */}
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>字体大小</span>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                className="settings-slider"
                min={1}
                max={3}
                step={1}
                value={fontSizeLevel}
                onChange={(e) => setFontSizeLevel(Number(e.target.value))}
                style={styles.slider}
              />
              <span style={{ ...styles.sliderValue, minWidth: '36px' }}>
                {fontSizeLabels[fontSizeLevel - 1]}
              </span>
            </div>
          </div>
        </div>

        {/* ── 按钮行 ──────────────────────────────────────────── */}
        <div style={styles.buttonRow}>
          <button
            className="settings-btn"
            style={styles.backButton}
            onClick={onBack}
          >
            ← 返回
          </button>
          <button
            className="settings-btn"
            style={styles.resetButton}
            onClick={handleReset}
          >
            恢复默认
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsScreen;
