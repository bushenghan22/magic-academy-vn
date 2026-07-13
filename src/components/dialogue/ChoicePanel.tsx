/**
 * ChoicePanel - 选择面板组件
 *
 * 居中展示玩家可交互的剧情选项。
 * 支持交错入场动画、条件锁定、元素配色等。
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Props ─────────────────────────────────────────────────────────────────

interface Choice {
  id: string;
  text: string;
  conditions?: any[];
}

interface ChoicePanelProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  visible: boolean;
}

// ─── 元素配色方案 ──────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { border: 'rgba(160, 120, 255, 0.5)', glow: 'rgba(160, 120, 255, 0.2)', text: '#c8b0ff' },
  { border: 'rgba(100, 200, 255, 0.5)', glow: 'rgba(100, 200, 255, 0.2)', text: '#a0d8ff' },
  { border: 'rgba(255, 180, 100, 0.5)', glow: 'rgba(255, 180, 100, 0.2)', text: '#ffd0a0' },
  { border: 'rgba(100, 255, 180, 0.5)', glow: 'rgba(100, 255, 180, 0.2)', text: '#a0ffd0' },
  { border: 'rgba(255, 120, 180, 0.5)', glow: 'rgba(255, 120, 180, 0.2)', text: '#ffa0c0' },
];

// ─── 样式 ──────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 40,
  pointerEvents: 'auto',
};

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.85) 0%, rgba(8, 4, 22, 0.9) 100%)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(120, 80, 220, 0.2)',
  boxShadow: '0 8px 60px rgba(60, 30, 120, 0.3), inset 0 0 40px rgba(80, 40, 160, 0.05)',
  minWidth: '420px',
  maxWidth: '560px',
};

const choiceBtnStyle: React.CSSProperties = {
  position: 'relative',
  padding: '16px 24px',
  fontSize: '15px',
  fontWeight: 500,
  fontFamily: "'Noto Sans SC', sans-serif",
  letterSpacing: '1px',
  lineHeight: 1.6,
  borderRadius: '12px',
  border: '1px solid',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, rgba(20, 10, 45, 0.7) 0%, rgba(12, 6, 30, 0.85) 100%)',
  color: 'rgba(220, 210, 250, 0.95)',
  textAlign: 'left' as const,
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  backdropFilter: 'blur(8px)',
};

const lockedBtnStyle: React.CSSProperties = {
  ...choiceBtnStyle,
  cursor: 'not-allowed',
  opacity: 0.45,
  background: 'linear-gradient(135deg, rgba(15, 10, 25, 0.6) 0%, rgba(8, 5, 15, 0.7) 100%)',
  color: 'rgba(140, 130, 170, 0.6)',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '13px',
  fontFamily: "'Orbitron', sans-serif",
  color: 'rgba(160, 140, 200, 0.6)',
  letterSpacing: '4px',
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
};

// ─── 组件 ──────────────────────────────────────────────────────────────────

export const ChoicePanel: React.FC<ChoicePanelProps> = ({
  choices,
  onSelect,
  visible,
}) => {
  // 检查选项是否有条件（简化判断，显示为锁定状态）
  const isLocked = (choice: Choice): boolean => {
    return !!(choice.conditions && choice.conditions.length > 0);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={containerStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            style={panelStyle}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* 面板标题 */}
            <div style={headerStyle}>Choose Your Path</div>

            {/* 选项按钮列表 */}
            {choices.map((choice, index) => {
              const locked = isLocked(choice);
              const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

              return (
                <motion.button
                  key={choice.id}
                  style={
                    locked
                      ? { ...lockedBtnStyle, borderColor: 'rgba(80, 70, 100, 0.3)' }
                      : {
                          ...choiceBtnStyle,
                          borderColor: accent.border,
                          boxShadow: `0 0 15px ${accent.glow}, inset 0 0 15px ${accent.glow}`,
                        }
                  }
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: locked ? 0.45 : 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.1,
                    ease: 'easeOut',
                  }}
                  whileHover={
                    locked
                      ? {}
                      : {
                          borderColor: accent.border.replace('0.5', '0.8'),
                          boxShadow: `0 0 30px ${accent.glow.replace('0.2', '0.4')}, inset 0 0 20px ${accent.glow}`,
                          x: 6,
                        }
                  }
                  whileTap={locked ? {} : { scale: 0.98 }}
                  onClick={() => !locked && onSelect(choice.id)}
                  disabled={locked}
                >
                  {/* 选项序号 */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      fontFamily: "'Orbitron', sans-serif",
                      color: locked ? 'rgba(100, 90, 130, 0.4)' : accent.text,
                      opacity: 0.7,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* 选项文本 */}
                  <span style={{ marginLeft: '30px' }}>{choice.text}</span>

                  {/* 锁定图标 */}
                  {locked && (
                    <span
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '14px',
                        opacity: 0.5,
                      }}
                    >
                      🔒
                    </span>
                  )}

                  {/* 悬浮光效 */}
                  {!locked && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '12px',
                        background: `radial-gradient(ellipse at 20% 50%, ${accent.glow}, transparent 70%)`,
                        pointerEvents: 'none',
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* 底部装饰 */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '10px',
                color: 'rgba(120, 100, 180, 0.3)',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '3px',
                marginTop: '8px',
              }}
            >
              SELECT ▸
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChoicePanel;
