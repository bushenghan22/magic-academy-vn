/**
 * MenuOverlay - 游戏内菜单覆盖层
 *
 * 全屏半透明覆盖层，展示游戏菜单选项。
 * 包含保存、读取、设置、返回标题等功能。
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Props ─────────────────────────────────────────────────────────────────

interface MenuOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
  onTitle: () => void;
  onGallery?: () => void;
  onHelp?: () => void;
}

// ─── 样式 ──────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Noto Sans SC', sans-serif",
};

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(6px)',
};

const panelStyle: React.CSSProperties = {
  position: 'relative',
  width: '340px',
  padding: '32px 28px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.92) 0%, rgba(8, 4, 20, 0.96) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(120, 80, 220, 0.25)',
  boxShadow: '0 8px 60px rgba(60, 30, 120, 0.35), inset 0 0 40px rgba(80, 40, 160, 0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #c0a0ff, #80d0ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '4px',
};

const menuBtnStyle: React.CSSProperties = {
  position: 'relative',
  padding: '14px 24px',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '2px',
  borderRadius: '10px',
  border: '1px solid rgba(120, 80, 220, 0.25)',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, rgba(20, 10, 45, 0.6) 0%, rgba(12, 6, 30, 0.8) 100%)',
  color: 'rgba(210, 200, 240, 0.9)',
  fontFamily: "'Noto Sans SC', sans-serif",
  textAlign: 'left' as const,
  transition: 'all 0.25s ease',
  overflow: 'hidden',
};

const resumeBtnStyle: React.CSSProperties = {
  ...menuBtnStyle,
  border: '1px solid rgba(200, 140, 255, 0.4)',
  background: 'linear-gradient(135deg, rgba(60, 30, 100, 0.6) 0%, rgba(30, 15, 60, 0.8) 100%)',
  color: 'rgba(230, 215, 255, 0.95)',
  boxShadow: '0 0 15px rgba(140, 80, 255, 0.15)',
};

const dangerBtnStyle: React.CSSProperties = {
  ...menuBtnStyle,
  border: '1px solid rgba(255, 80, 80, 0.2)',
  color: 'rgba(255, 160, 150, 0.8)',
};

const separatorStyle: React.CSSProperties = {
  height: '1px',
  margin: '8px 0',
  background: 'linear-gradient(90deg, transparent, rgba(120, 80, 220, 0.2), transparent)',
};

const menuItems = [
  { label: '📖 读取存档', key: 'load' },
  { label: '⚙️ 设置', key: 'settings' },
  { label: '🎨 CG鉴赏', key: 'gallery' },
  { label: '❓ 帮助', key: 'help' },
] as const;

// ─── 组件 ──────────────────────────────────────────────────────────────────

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  visible,
  onClose,
  onSave,
  onLoad,
  onSettings,
  onTitle,
  onGallery,
  onHelp,
}) => {
  const handleAction = (key: string) => {
    switch (key) {
      case 'load':
        onLoad();
        break;
      case 'settings':
        onSettings();
        break;
      case 'gallery':
        onGallery?.();
        break;
      case 'help':
        onHelp?.();
        break;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* 遮罩层（点击关闭） */}
          <motion.div
            style={backdropStyle}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 菜单面板 */}
          <motion.div
            style={panelStyle}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* 顶部装饰线 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(160, 120, 255, 0.3), transparent)',
              }}
            />

            {/* 标题 */}
            <div style={titleStyle}>游戏菜单</div>

            {/* 继续游戏 */}
            <motion.button
              style={resumeBtnStyle}
              whileHover={{
                borderColor: 'rgba(200, 160, 255, 0.6)',
                boxShadow: '0 0 25px rgba(140, 100, 255, 0.3), inset 0 0 15px rgba(140, 100, 255, 0.08)',
                x: 4,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
            >
              ▶ 继续游戏
            </motion.button>

            {/* 保存存档 */}
            <motion.button
              style={menuBtnStyle}
              whileHover={{
                borderColor: 'rgba(80, 200, 140, 0.4)',
                color: 'rgba(180, 255, 210, 0.95)',
                x: 4,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onSave}
            >
              💾 保存存档
            </motion.button>

            <div style={separatorStyle} />

            {/* 其他菜单项 */}
            {menuItems.map((item, idx) => (
              <motion.button
                key={item.key}
                style={menuBtnStyle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                whileHover={{
                  borderColor: 'rgba(160, 120, 255, 0.4)',
                  boxShadow: '0 0 15px rgba(120, 80, 255, 0.15), inset 0 0 10px rgba(120, 80, 255, 0.05)',
                  x: 4,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAction(item.key)}
              >
                {item.label}
              </motion.button>
            ))}

            <div style={separatorStyle} />

            {/* 返回标题 */}
            <motion.button
              style={dangerBtnStyle}
              whileHover={{
                borderColor: 'rgba(255, 100, 100, 0.4)',
                color: 'rgba(255, 180, 170, 1)',
                background: 'linear-gradient(135deg, rgba(50, 15, 15, 0.6), rgba(30, 10, 10, 0.8))',
                x: 4,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onTitle}
            >
              🏠 返回标题
            </motion.button>

            {/* 底部装饰 */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '10px',
                color: 'rgba(120, 100, 180, 0.3)',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '3px',
                marginTop: '12px',
              }}
            >
              ESC TO CLOSE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;
