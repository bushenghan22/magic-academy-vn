/**
 * MagicCircle - 魔法阵动画 SVG 组件
 *
 * 可复用的旋转魔法阵，用于标题画面和战斗系统。
 * 支持自定义尺寸、颜色、速度和激活状态。
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Props ─────────────────────────────────────────────────────────────────

interface MagicCircleProps {
  size?: number;
  color?: string;
  speed?: number;
  active?: boolean;
}

// ─── 组件 ──────────────────────────────────────────────────────────────────

export const MagicCircle: React.FC<MagicCircleProps> = ({
  size = 300,
  color = '#a060ff',
  speed = 1,
  active = true,
}) => {
  const cx = size / 2;
  const cy = size / 2;

  const outerDuration = useMemo(() => 60 / speed, [speed]);
  const innerDuration = useMemo(() => 45 / speed, [speed]);
  const outerReverseDuration = useMemo(() => 120 / speed, [speed]);

  const colorAlt = useMemo(() => {
    // 生成互补色 (简单偏移)
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgb(${Math.min(255, b + 60)}, ${Math.min(255, r + 40)}, ${Math.min(255, g + 80)})`;
  }, [color]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ width: size, height: size, position: 'relative' }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`mc-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colorAlt} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={`mc-inner-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorAlt} stopOpacity="0.6" />
            <stop offset="50%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colorAlt} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`mc-glow-${size}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`mc-soft-${size}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外圈旋转组 */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: outerDuration, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {/* 主外圈 */}
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.44}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.006}
            filter={`url(#mc-glow-${size})`}
            opacity="0.7"
          />
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.42}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.003}
            opacity="0.4"
          />
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.46}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.002}
            opacity="0.3"
            strokeDasharray={`${size * 0.03} ${size * 0.04}`}
          />

          {/* 外圈符文 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = size * 0.43;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const symbols = ['✦', '◆', '✧', '◇'];
            return (
              <text
                key={`rune-${i}`}
                x={x}
                y={y}
                fill={`url(#mc-grad-${size})`}
                fontSize={size * 0.035}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'Cinzel', serif"
                opacity="0.7"
                transform={`rotate(${i * 30}, ${x}, ${y})`}
                filter={`url(#mc-glow-${size})`}
              >
                {symbols[i % 4]}
              </text>
            );
          })}

          {/* 三角形 */}
          <polygon
            points={`${cx},${cy - size * 0.33} ${cx - size * 0.28},${cy + size * 0.16} ${cx + size * 0.28},${cy + size * 0.16}`}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.004}
            opacity="0.5"
            filter={`url(#mc-glow-${size})`}
          />
          <polygon
            points={`${cx},${cy + size * 0.33} ${cx - size * 0.28},${cy - size * 0.16} ${cx + size * 0.28},${cy - size * 0.16}`}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.004}
            opacity="0.5"
            filter={`url(#mc-glow-${size})`}
          />

          {/* 六芒星连线 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a1 = (i * 60 * Math.PI) / 180;
            const a2 = ((i * 60 + 180) * Math.PI) / 180;
            const r = size * 0.36;
            return (
              <line
                key={`star-${i}`}
                x1={cx + r * Math.cos(a1)}
                y1={cy + r * Math.sin(a1)}
                x2={cx + r * Math.cos(a2)}
                y2={cy + r * Math.sin(a2)}
                stroke={`url(#mc-grad-${size})`}
                strokeWidth={size * 0.002}
                opacity="0.3"
              />
            );
          })}
        </motion.g>

        {/* 内圈反向旋转 */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: innerDuration, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.27}
            fill="none"
            stroke={`url(#mc-inner-${size})`}
            strokeWidth={size * 0.005}
            opacity="0.6"
            filter={`url(#mc-glow-${size})`}
          />
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.25}
            fill="none"
            stroke={`url(#mc-inner-${size})`}
            strokeWidth={size * 0.002}
            opacity="0.35"
          />

          {/* 内圈多边形 */}
          <polygon
            points={Array.from({ length: 8 })
              .map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                return `${cx + size * 0.22 * Math.cos(angle)},${cy + size * 0.22 * Math.sin(angle)}`;
              })
              .join(' ')}
            fill="none"
            stroke={`url(#mc-inner-${size})`}
            strokeWidth={size * 0.003}
            opacity="0.4"
          />

          {/* 内部辐射线 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            return (
              <line
                key={`il-${i}`}
                x1={cx}
                y1={cy}
                x2={cx + size * 0.25 * Math.cos(angle)}
                y2={cy + size * 0.25 * Math.sin(angle)}
                stroke={`url(#mc-inner-${size})`}
                strokeWidth={size * 0.002}
                opacity="0.25"
              />
            );
          })}
        </motion.g>

        {/* 核心区域 - 不旋转 */}
        <g>
          <motion.circle
            cx={cx}
            cy={cy}
            r={size * 0.12}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.005}
            opacity="0.5"
            filter={`url(#mc-soft-${size})`}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
          <motion.circle
            cx={cx}
            cy={cy}
            r={size * 0.09}
            fill="none"
            stroke={`url(#mc-inner-${size})`}
            strokeWidth={size * 0.003}
            opacity="0.4"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* 中心光点 */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={size * 0.02}
            fill={`url(#mc-grad-${size})`}
            opacity="0.6"
            filter={`url(#mc-soft-${size})`}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* 最外层装饰圈 */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: outerReverseDuration, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.48}
            fill="none"
            stroke={`url(#mc-grad-${size})`}
            strokeWidth={size * 0.002}
            opacity="0.2"
            strokeDasharray={`${size * 0.015} ${size * 0.025}`}
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = size * 0.475;
            return (
              <circle
                key={`dot-${i}`}
                cx={cx + r * Math.cos(angle)}
                cy={cy + r * Math.sin(angle)}
                r={i % 3 === 0 ? size * 0.006 : size * 0.003}
                fill={`url(#mc-grad-${size})`}
                opacity={i % 3 === 0 ? 0.6 : 0.3}
              />
            );
          })}
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default MagicCircle;
