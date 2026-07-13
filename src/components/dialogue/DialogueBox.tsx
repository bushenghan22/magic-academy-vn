/**
 * DialogueBox - 对话显示组件
 *
 * 底部定位的玻璃面板，展示角色对话。
 * 支持打字机效果、点击推进、说话人标签等功能。
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Props ─────────────────────────────────────────────────────────────────

interface DialogueBoxProps {
  speaker: string;
  text: string;
  emotion: string;
  isTyping: boolean;
  onAdvance: () => void;
  textSpeed: number;
  speakerColor: string;
}

// ─── 样式 ──────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '200px',
  zIndex: 50,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '0 40px 24px',
  pointerEvents: 'auto',
};

const panelStyle: React.CSSProperties = {
  position: 'relative',
  padding: '20px 28px 16px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(12, 6, 30, 0.88) 0%, rgba(6, 3, 20, 0.92) 100%)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(120, 80, 220, 0.25)',
  boxShadow: '0 -4px 40px rgba(80, 40, 160, 0.15), inset 0 0 30px rgba(100, 60, 200, 0.03)',
  minHeight: '130px',
  cursor: 'pointer',
  userSelect: 'none',
  overflow: 'hidden',
};

const speakerBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-14px',
  left: '28px',
  padding: '4px 20px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '3px',
  fontFamily: "'Noto Sans SC', sans-serif",
  border: '1px solid rgba(160, 120, 255, 0.4)',
  boxShadow: '0 0 20px rgba(120, 80, 255, 0.3), inset 0 0 15px rgba(120, 80, 255, 0.1)',
  zIndex: 2,
};

const textStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.8,
  color: 'rgba(220, 210, 250, 0.95)',
  fontFamily: "'Noto Sans SC', sans-serif",
  letterSpacing: '1px',
  marginTop: '8px',
  minHeight: '60px',
};

const emotionBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  fontSize: '12px',
  color: 'rgba(160, 140, 200, 0.5)',
  fontFamily: "'Orbitron', sans-serif",
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
};

// ─── 打字速度映射 ──────────────────────────────────────────────────────────

function getCharDelay(textSpeed: number): number {
  // textSpeed: 1 (slow) ~ 5 (fast), 映射到毫秒
  const speeds = [80, 50, 30, 15, 0];
  return speeds[Math.min(Math.max(Math.round(textSpeed), 1), 5) - 1] ?? 30;
}

// ─── 组件 ──────────────────────────────────────────────────────────────────

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  emotion,
  isTyping,
  onAdvance,
  textSpeed,
  speakerColor,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const charIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTextRef = useRef('');

  // 当文本内容变化时，重置打字状态
  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      charIndexRef.current = 0;
      setDisplayedText('');
      setIsComplete(false);
    }
  }, [text]);

  // 打字机效果
  useEffect(() => {
    if (!isTyping || isComplete) return;

    const delay = getCharDelay(textSpeed);

    // 速度为最快时直接显示全部
    if (delay === 0) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    const typeNext = () => {
      if (charIndexRef.current < text.length) {
        charIndexRef.current += 1;
        setDisplayedText(text.slice(0, charIndexRef.current));

        // 标点符号后额外停顿
        const char = text[charIndexRef.current - 1];
        const extraDelay = '，。！？…、；：'.includes(char) ? 120 : 0;

        timerRef.current = setTimeout(typeNext, delay + extraDelay);
      } else {
        setIsComplete(true);
      }
    };

    timerRef.current = setTimeout(typeNext, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, isTyping, textSpeed, isComplete]);

  // 点击处理
  const handleClick = useCallback(() => {
    if (!isComplete) {
      // 如果还在打字，立即显示完整文本
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedText(text);
      charIndexRef.current = text.length;
      setIsComplete(true);
    } else {
      // 文本已完成，推进对话
      onAdvance();
    }
  }, [isComplete, text, onAdvance]);

  // 键盘支持
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClick]);

  // 情绪映射
  const emotionLabels: Record<string, string> = {
    happy: '开心',
    sad: '难过',
    angry: '愤怒',
    surprised: '惊讶',
    embarrassed: '害羞',
    neutral: '平静',
    thinking: '思考',
    determined: '坚定',
    worried: '担忧',
    gentle: '温柔',
    serious: '严肃',
    excited: '兴奋',
    confident: '自信',
    smug: '得意',
    crying: '哭泣',
    blushing: '脸红',
  };

  return (
    <AnimatePresence>
      <motion.div
        style={containerStyle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <motion.div
          style={panelStyle}
          onClick={handleClick}
          whileHover={{
            borderColor: 'rgba(160, 120, 255, 0.4)',
            boxShadow: '0 -4px 50px rgba(100, 60, 200, 0.25), inset 0 0 30px rgba(120, 80, 255, 0.05)',
          }}
          transition={{ duration: 0.2 }}
        >
          {/* 顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '28px',
              right: '28px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(160, 120, 255, 0.3), transparent)',
            }}
          />

          {/* 说话人标签 */}
          {speaker && (
            <motion.div
              style={{
                ...speakerBadgeStyle,
                background: `linear-gradient(135deg, ${speakerColor}dd, ${speakerColor}88)`,
                color: '#fff',
                textShadow: `0 0 12px ${speakerColor}`,
              }}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {speaker}
            </motion.div>
          )}

          {/* 情绪标签 */}
          {emotion && emotion !== 'neutral' && (
            <div style={emotionBadgeStyle}>
              {emotionLabels[emotion] || emotion}
            </div>
          )}

          {/* 对话文本 */}
          <div style={textStyle}>
            {displayedText}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ color: 'rgba(160, 120, 255, 0.8)' }}
              >
                ▎
              </motion.span>
            )}
          </div>

          {/* 完成指示器 - 闪烁三角形 */}
          {isComplete && (
            <motion.div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '20px',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid rgba(160, 140, 255, 0.7)',
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                y: [0, 3, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* 底部装饰 */}
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: 'rgba(120, 100, 180, 0.3)',
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '3px',
            }}
          >
            {isComplete ? 'CLICK ▸' : 'SKIP ▸'}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DialogueBox;
