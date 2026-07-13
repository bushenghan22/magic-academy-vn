import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface TransitionEffectProps {
  isActive: boolean;
  type: string;
}

// ─── 过渡动画类型 ─────────────────────────────────────────────────────────

type TransitionType = 'fade' | 'magic-circle' | 'dissolve' | 'slide' | 'iris';

// ─── 样式 ─────────────────────────────────────────────────────────────────

const baseOverlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 999,
  pointerEvents: 'none',
};

// ─── 魔法阵 SVG ──────────────────────────────────────────────────────────

const MagicCircleSVG: React.FC<{ progress: number }> = ({ progress }) => {
  const size = 800;
  const cx = size / 2;
  const cy = size / 2;
  const scale = progress;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: Math.min(1, progress * 1.5),
      }}
    >
      <defs>
        <linearGradient id="transGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a060ff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#60a0ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a060ff" stopOpacity="0.9" />
        </linearGradient>
        <filter id="transGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 外圈 */}
      <circle cx={cx} cy={cy} r={350} fill="none" stroke="url(#transGrad)" strokeWidth="3" filter="url(#transGlow)" />
      <circle cx={cx} cy={cy} r={340} fill="none" stroke="url(#transGrad)" strokeWidth="1" opacity="0.5" />

      {/* 六芒星 */}
      <polygon
        points={`${cx},${cy - 280} ${cx - 242},${cy + 140} ${cx + 242},${cy + 140}`}
        fill="none"
        stroke="url(#transGrad)"
        strokeWidth="2"
        filter="url(#transGlow)"
      />
      <polygon
        points={`${cx},${cy + 280} ${cx - 242},${cy - 140} ${cx + 242},${cy - 140}`}
        fill="none"
        stroke="url(#transGrad)"
        strokeWidth="2"
        filter="url(#transGlow)"
      />

      {/* 内圈 */}
      <circle cx={cx} cy={cy} r={200} fill="none" stroke="url(#transGrad)" strokeWidth="2" opacity="0.7" />

      {/* 符文装饰 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const r = 320;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r={4} fill="url(#transGrad)" opacity="0.6" />
        );
      })}

      {/* 中心填充 - 用于 wipe 效果 */}
      <circle
        cx={cx}
        cy={cy}
        r={350 * progress}
        fill="rgba(5,0,15,0.95)"
        opacity={progress > 0.5 ? (progress - 0.5) * 2 : 0}
      />
    </svg>
  );
};

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const TransitionEffect: React.FC<TransitionEffectProps> = ({ isActive, type }) => {
  const transitionType = type as TransitionType;

  // ── 淡入淡出 ──────────────────────────────────────────────────────────
  if (transitionType === 'fade') {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div
            style={{
              ...baseOverlay,
              background: 'rgba(5,0,15,1)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    );
  }

  // ── 魔法阵擦除 ────────────────────────────────────────────────────────
  if (transitionType === 'magic-circle') {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div style={baseOverlay}>
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5,0,15,0.01)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* 魔法阵扩展动画 */}
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                initial={{}}
                animate={{}}
              >
                <MagicCircleSVG progress={1} />
              </motion.div>

              {/* 黑幕覆盖 */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(5,0,15,1)',
                }}
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                animate={{
                  clipPath: [
                    'circle(0% at 50% 50%)',
                    'circle(60% at 50% 50%)',
                    'circle(100% at 50% 50%)',
                    'circle(100% at 50% 50%)',
                    'circle(60% at 50% 50%)',
                    'circle(0% at 50% 50%)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.25, 0.4, 0.6, 0.75, 1],
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── 像素溶解 ──────────────────────────────────────────────────────────
  if (transitionType === 'dissolve') {
    const gridCols = 12;
    const gridRows = 8;

    return (
      <AnimatePresence>
        {isActive && (
          <motion.div style={baseOverlay}>
            {Array.from({ length: gridCols * gridRows }).map((_, i) => {
              const col = i % gridCols;
              const row = Math.floor(i / gridCols);
              const delay = (col + row) * 0.03 + Math.random() * 0.05;

              return (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${(col / gridCols) * 100}%`,
                    top: `${(row / gridRows) * 100}%`,
                    width: `${100 / gridCols}%`,
                    height: `${100 / gridRows}%`,
                    background: 'rgba(5,0,15,1)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.0,
                    delay,
                    times: [0, 0.3, 0.7, 1],
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── 滑动过渡 ──────────────────────────────────────────────────────────
  if (transitionType === 'slide') {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div style={baseOverlay}>
            {/* 左侧幕布 */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(5,0,15,1) 80%, rgba(20,5,40,0.95) 100%)',
              }}
              initial={{ x: '-100%' }}
              animate={{
                x: ['-100%', '0%', '0%', '-100%'],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.3, 0.7, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            />
            {/* 右侧幕布 */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(-90deg, rgba(5,0,15,1) 80%, rgba(20,5,40,0.95) 100%)',
              }}
              initial={{ x: '100%' }}
              animate={{
                x: ['100%', '0%', '0%', '100%'],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.3, 0.7, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            />
            {/* 中间光线装饰 */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '2px',
                height: '100%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(180deg, transparent, rgba(160,120,255,0.6), rgba(100,180,255,0.6), transparent)',
                boxShadow: '0 0 20px rgba(120,100,255,0.4)',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scaleY: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── 虹膜（圆形开闭，类似动漫场景转换）──────────────────────────────
  if (transitionType === 'iris') {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div style={baseOverlay}>
            {/* 黑幕层 */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5,0,15,1)',
              }}
              initial={{
                clipPath: 'circle(100% at 50% 50%)',
              }}
              animate={{
                clipPath: [
                  'circle(100% at 50% 50%)', // 完全可见（全黑）
                  'circle(0% at 50% 50%)',    // 关闭到中心
                  'circle(0% at 50% 50%)',    // 保持关闭
                  'circle(100% at 50% 50%)',  // 再次打开
                ],
              }}
              transition={{
                duration: 1.4,
                times: [0, 0.35, 0.65, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* 虹膜边缘光效 */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'transparent',
                boxShadow: 'inset 0 0 60px rgba(160,120,255,0.3)',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0, 0.8, 0],
              }}
              transition={{
                duration: 1.4,
                times: [0, 0.3, 0.5, 0.7],
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── 默认淡入淡出（类型不匹配时的兜底）───────────────────────────────
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          style={{
            ...baseOverlay,
            background: 'rgba(5,0,15,1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.0, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
  );
};

export default TransitionEffect;
