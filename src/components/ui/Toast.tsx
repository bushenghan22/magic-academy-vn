/**
 * Toast - 通知提示系统
 *
 * 在游戏右上角展示浮动通知，支持多种类型和自动消失。
 * 使用 framer-motion 实现滑入/淡出动画。
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, type Notification } from '../../systems/store';

// ─── 类型配色 ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  Notification['type'],
  { bg: string; border: string; icon: string; glow: string }
> = {
  success: {
    bg: 'linear-gradient(135deg, rgba(20, 60, 30, 0.9), rgba(10, 40, 20, 0.95))',
    border: 'rgba(80, 220, 120, 0.5)',
    icon: '✓',
    glow: 'rgba(80, 220, 120, 0.2)',
  },
  error: {
    bg: 'linear-gradient(135deg, rgba(60, 15, 15, 0.9), rgba(40, 10, 10, 0.95))',
    border: 'rgba(255, 80, 80, 0.5)',
    icon: '✕',
    glow: 'rgba(255, 80, 80, 0.2)',
  },
  info: {
    bg: 'linear-gradient(135deg, rgba(15, 30, 60, 0.9), rgba(10, 20, 40, 0.95))',
    border: 'rgba(80, 140, 255, 0.5)',
    icon: 'ℹ',
    glow: 'rgba(80, 140, 255, 0.2)',
  },
  warning: {
    bg: 'linear-gradient(135deg, rgba(60, 45, 10, 0.9), rgba(40, 30, 10, 0.95))',
    border: 'rgba(255, 200, 60, 0.5)',
    icon: '⚠',
    glow: 'rgba(255, 200, 60, 0.2)',
  },
  achievement: {
    bg: 'linear-gradient(135deg, rgba(50, 20, 60, 0.9), rgba(30, 10, 40, 0.95))',
    border: 'rgba(200, 140, 255, 0.5)',
    icon: '★',
    glow: 'rgba(200, 140, 255, 0.2)',
  },
};

// ─── 单个 Toast 组件 ──────────────────────────────────────────────────────

interface ToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onDismiss }) => {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        minWidth: '260px',
        maxWidth: '380px',
        borderRadius: '12px',
        background: config.bg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${config.border}`,
        boxShadow: `0 4px 24px ${config.glow}, 0 0 40px ${config.glow}`,
        fontFamily: "'Noto Sans SC', sans-serif",
        color: 'rgba(230, 220, 255, 0.95)',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => onDismiss(notification.id)}
      whileHover={{ scale: 1.02 }}
    >
      {/* 图标 */}
      <span
        style={{
          fontSize: '18px',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: `${config.border}`,
          color: '#fff',
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {config.icon}
      </span>

      {/* 消息文本 */}
      <span style={{ flex: 1, lineHeight: 1.4 }}>{notification.message}</span>

      {/* 自动消失进度条 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: config.border,
          borderRadius: '0 0 12px 12px',
        }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: notification.duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

// ─── Toast 容器组件 ────────────────────────────────────────────────────────

export const ToastContainer: React.FC = () => {
  const notifications = useGameStore((s) => s.notifications);
  const removeNotification = useGameStore((s) => s.removeNotification);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <div key={n.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem notification={n} onDismiss={removeNotification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
