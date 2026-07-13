import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../systems/store';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  onLoad: () => void;
  onGallery: () => void;
  onCharacters: () => void;
  onAchievements: () => void;
  onHelp: () => void;
}

interface MenuItem {
  label: string;
  onClick: () => void;
  primary?: boolean;
  show?: boolean;
}

// ─── 样式对象 ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Cinzel', 'Orbitron', 'Noto Sans SC', sans-serif",
    userSelect: 'none',
  },
  background: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 25%, #0d0025 50%, #05001a 75%, #0a0015 100%)',
    backgroundSize: '400% 400%',
    animation: 'bgShift 20s ease infinite',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
    zIndex: 1,
  },
  magicCircleWrapper: {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    width: '520px',
    height: '520px',
    zIndex: 2,
    pointerEvents: 'none',
  },
  titleArea: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  menuContainer: {
    position: 'absolute',
    left: '8%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    zIndex: 10,
    padding: '28px 24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.65) 0%, rgba(5,0,25,0.75) 100%)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(120,80,220,0.25)',
  },
  menuButton: {
    position: 'relative',
    padding: '14px 40px',
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '3px',
    border: '1px solid rgba(180,140,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(30,10,60,0.6) 0%, rgba(15,5,40,0.8) 100%)',
    color: 'rgba(220,200,255,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
    textAlign: 'left' as const,
    overflow: 'hidden',
    minWidth: '200px',
  },
  primaryButton: {
    padding: '16px 44px',
    fontSize: '19px',
    fontWeight: 700,
    letterSpacing: '4px',
    border: '1px solid rgba(255,200,80,0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(60,30,0,0.5) 0%, rgba(40,20,0,0.7) 100%)',
    color: '#ffd866',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
    textAlign: 'left' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(255,200,60,0.15), inset 0 0 20px rgba(255,200,60,0.05)',
    minWidth: '200px',
  },
  titleText: {
    position: 'absolute',
    top: '12%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    zIndex: 5,
    pointerEvents: 'none',
  },
  mainTitle: {
    fontSize: '72px',
    fontWeight: 700,
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    background: 'linear-gradient(135deg, #e0c0ff 0%, #a080ff 25%, #ffccaa 50%, #a0c0ff 75%, #e0c0ff 100%)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 4s ease infinite',
    textShadow: 'none',
    filter: 'drop-shadow(0 0 30px rgba(160,120,255,0.5)) drop-shadow(0 0 60px rgba(160,120,255,0.2))',
    letterSpacing: '8px',
    lineHeight: 1.2,
    margin: 0,
  },
  subtitle: {
    fontSize: '18px',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '12px',
    color: 'rgba(160,180,255,0.7)',
    marginTop: '16px',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
  },
  version: {
    position: 'fixed',
    bottom: '20px',
    right: '24px',
    fontSize: '13px',
    fontFamily: "'Orbitron', sans-serif",
    color: 'rgba(120,130,180,0.5)',
    letterSpacing: '2px',
    zIndex: 10,
  },
  particleContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 3,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  borderGlow: {
    position: 'absolute',
    inset: -1,
    borderRadius: '16px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(160,100,255,0.4), rgba(80,200,255,0.2), rgba(255,180,100,0.2), rgba(160,100,255,0.4))',
    backgroundSize: '300% 300%',
    animation: 'borderShift 6s ease infinite',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    pointerEvents: 'none',
  },
};

// ─── 魔法阵 SVG 组件 ────────────────────────────────────────────────────

const MagicCircle: React.FC = () => {
  const size = 520;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a060ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60a0ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a060ff" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff80c0" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#80a0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c080ff" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 外圈旋转组 */}
      <g style={{ animation: 'rotate60 60s linear infinite', transformOrigin: `${cx}px ${cy}px` }}>
        {/* 主外圈 */}
        <circle cx={cx} cy={cy} r={230} fill="none" stroke="url(#circleGrad)" strokeWidth="2" filter="url(#glow)" opacity="0.7" />
        <circle cx={cx} cy={cy} r={220} fill="none" stroke="url(#circleGrad)" strokeWidth="1" opacity="0.4" />
        <circle cx={cx} cy={cy} r={240} fill="none" stroke="url(#circleGrad)" strokeWidth="0.8" opacity="0.3" />

        {/* 外圈符文 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const r = 225;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <text
              key={`rune-${i}`}
              x={x}
              y={y}
              fill="url(#circleGrad)"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Cinzel', serif"
              opacity="0.7"
              transform={`rotate(${i * 30}, ${x}, ${y})`}
              filter="url(#glow)"
            >
              {['✦', '◆', '✧', '◇', '✦', '◆', '✧', '◇', '✦', '◆', '✧', '◇'][i]}
            </text>
          );
        })}

        {/* 三角形 */}
        <polygon
          points={`${cx},${cy - 170} ${cx - 147},${cy + 85} ${cx + 147},${cy + 85}`}
          fill="none"
          stroke="url(#circleGrad)"
          strokeWidth="1.2"
          opacity="0.5"
          filter="url(#glow)"
        />
        <polygon
          points={`${cx},${cy + 170} ${cx - 147},${cy - 85} ${cx + 147},${cy - 85}`}
          fill="none"
          stroke="url(#circleGrad)"
          strokeWidth="1.2"
          opacity="0.5"
          filter="url(#glow)"
        />

        {/* 六芒星连线 */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle1 = (i * 60 * Math.PI) / 180;
          const angle2 = ((i * 60 + 180) * Math.PI) / 180;
          const r = 190;
          return (
            <line
              key={`star-${i}`}
              x1={cx + r * Math.cos(angle1)}
              y1={cy + r * Math.sin(angle1)}
              x2={cx + r * Math.cos(angle2)}
              y2={cy + r * Math.sin(angle2)}
              stroke="url(#circleGrad)"
              strokeWidth="0.6"
              opacity="0.3"
            />
          );
        })}

        {/* 外部装饰弧线 */}
        {Array.from({ length: 6 }).map((_, i) => {
          const startAngle = i * 60;
          const r = 205;
          const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = cx + r * Math.cos(((startAngle + 40) * Math.PI) / 180);
          const y2 = cy + r * Math.sin(((startAngle + 40) * Math.PI) / 180);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke="url(#innerGrad)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}
      </g>

      {/* 内圈反向旋转组 */}
      <g style={{ animation: 'rotateReverse45 45s linear infinite', transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={140} fill="none" stroke="url(#innerGrad)" strokeWidth="1.5" opacity="0.6" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r={130} fill="none" stroke="url(#innerGrad)" strokeWidth="0.8" opacity="0.35" />

        {/* 内圈十二边形 */}
        <polygon
          points={Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return `${cx + 120 * Math.cos(angle)},${cy + 120 * Math.sin(angle)}`;
          }).join(' ')}
          fill="none"
          stroke="url(#innerGrad)"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* 内部连接线 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={`inner-line-${i}`}
              x1={cx}
              y1={cy}
              x2={cx + 130 * Math.cos(angle)}
              y2={cy + 130 * Math.sin(angle)}
              stroke="url(#innerGrad)"
              strokeWidth="0.5"
              opacity="0.25"
            />
          );
        })}

        {/* 内圈符文环 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const r = 115;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <text
              key={`inner-rune-${i}`}
              x={x}
              y={y}
              fill="url(#innerGrad)"
              fontSize="11"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Cinzel', serif"
              opacity="0.6"
            >
              {['✧', '⟡', '✧', '⟡', '✧', '⟡', '✧', '⟡'][i]}
            </text>
          );
        })}
      </g>

      {/* 核心区域 - 不旋转 */}
      <g>
        <circle cx={cx} cy={cy} r={60} fill="none" stroke="url(#circleGrad)" strokeWidth="1.5" opacity="0.5" filter="url(#softGlow)" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <circle cx={cx} cy={cy} r={45} fill="none" stroke="url(#innerGrad)" strokeWidth="1" opacity="0.4" style={{ animation: 'pulse 4s ease-in-out infinite 1s' }} />
        <circle cx={cx} cy={cy} r={30} fill="none" stroke="url(#circleGrad)" strokeWidth="0.8" opacity="0.35" style={{ animation: 'pulse 4s ease-in-out infinite 2s' }} />

        {/* 中心光点 */}
        <circle cx={cx} cy={cy} r={6} fill="url(#circleGrad)" opacity="0.6" filter="url(#softGlow)" style={{ animation: 'pulse 3s ease-in-out infinite' }} />

        {/* 中心小六芒星 */}
        <polygon
          points={`${cx},${cy - 22} ${cx - 19},${cy + 11} ${cx + 19},${cy + 11}`}
          fill="none"
          stroke="url(#circleGrad)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <polygon
          points={`${cx},${cy + 22} ${cx - 19},${cy - 11} ${cx + 19},${cy - 11}`}
          fill="none"
          stroke="url(#circleGrad)"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      {/* 最外层装饰圈 - 缓慢旋转 */}
      <g style={{ animation: 'rotate60 120s linear infinite reverse', transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={250} fill="none" stroke="url(#circleGrad)" strokeWidth="0.5" opacity="0.2" strokeDasharray="8 12" />
        {/* 外围点装饰 */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const r = 248;
          return (
            <circle
              key={`dot-${i}`}
              cx={cx + r * Math.cos(angle)}
              cy={cy + r * Math.sin(angle)}
              r={i % 3 === 0 ? 2.5 : 1.2}
              fill="url(#circleGrad)"
              opacity={i % 3 === 0 ? 0.6 : 0.3}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ─── 浮动粒子组件（CSS-only approach）──────────────────────────────────

const FloatingParticles: React.FC = () => {
  const particleCount = 30;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: `${(i * 3.33) % 100}%`,
      animDelay: `${(i * 0.7) % 15}s`,
      animDuration: `${12 + (i * 1.3) % 10}s`,
      size: 1.5 + (i % 4) * 0.8,
      opacity: 0.15 + (i % 5) * 0.08,
      color: i % 3 === 0
        ? 'rgba(160,120,255,VAR)'
        : i % 3 === 1
        ? 'rgba(100,180,255,VAR)'
        : 'rgba(255,160,200,VAR)',
    }));
  }, []);

  return (
    <div style={styles.particleContainer}>
      {/* 使用内联样式 keyframes 通过 <style> 标签 */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: var(--p-opacity); transform: translateY(90vh) scale(1); }
          90% { opacity: var(--p-opacity); }
          100% { transform: translateY(-10vh) scale(0.5); opacity: 0; }
        }
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rotate60 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateReverse45 {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: var(--base-opacity, 0.5); transform: scale(1); }
          50% { opacity: calc(var(--base-opacity, 0.5) * 1.5); transform: scale(1.04); }
        }
        @keyframes borderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes menuGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(160,100,255,0.1), inset 0 0 15px rgba(160,100,255,0.03); }
          50% { box-shadow: 0 0 25px rgba(160,100,255,0.2), inset 0 0 25px rgba(160,100,255,0.06); }
        }
        .menu-area {
          animation: menuGlow 5s ease-in-out infinite;
        }
        .menu-btn:hover {
          background: linear-gradient(135deg, rgba(60,20,100,0.7) 0%, rgba(30,10,60,0.9) 100%) !important;
          border-color: rgba(200,160,255,0.6) !important;
          color: rgba(240,220,255,1) !important;
          transform: translateX(6px) !important;
          box-shadow: 0 0 20px rgba(160,120,255,0.3), inset 0 0 15px rgba(160,120,255,0.1) !important;
        }
        .menu-btn-primary:hover {
          background: linear-gradient(135deg, rgba(100,50,0,0.6) 0%, rgba(60,30,0,0.8) 100%) !important;
          border-color: rgba(255,220,120,0.7) !important;
          color: #ffe088 !important;
          transform: translateX(6px) !important;
          box-shadow: 0 0 30px rgba(255,200,60,0.4), inset 0 0 20px rgba(255,200,60,0.1) !important;
        }
        .menu-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .menu-btn:hover::before {
          transform: translateX(100%);
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color.replace('VAR', String(p.opacity)),
            boxShadow: `0 0 ${p.size * 3}px ${p.color.replace('VAR', String(p.opacity * 0.6))}`,
            animation: `floatUp ${p.animDuration} linear infinite`,
            animationDelay: p.animDelay,
            ['--p-opacity' as string]: p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onNewGame,
  onContinue,
  onSettings,
  onLoad,
  onGallery,
  onCharacters,
  onAchievements,
  onHelp,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { saveSlots, gameState } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 检查是否有存档
  const hasSave = useMemo(() => {
    return saveSlots.some((s) => !s.isEmpty) || gameState !== null;
  }, [saveSlots, gameState]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const menuItems: MenuItem[] = useMemo(() => [
    { label: '开始游戏', onClick: onNewGame, primary: true },
    { label: '继续游戏', onClick: onContinue, show: hasSave },
    { label: '读取存档', onClick: onLoad },
    { label: '设置', onClick: onSettings },
    { label: 'CG鉴赏', onClick: onGallery },
    { label: '角色图鉴', onClick: onCharacters },
    { label: '成就', onClick: onAchievements },
    { label: '帮助', onClick: onHelp },
  ].filter((item) => item.show !== false), [onNewGame, onContinue, onLoad, onSettings, onGallery, onCharacters, onAchievements, onHelp, hasSave]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: 'easeOut', delay: 0.3 },
    },
  };

  const circleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut', delay: 0.2 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.8 + i * 0.12,
      },
    }),
  };

  return (
    <motion.div
      ref={containerRef}
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate={isReady ? 'visible' : 'hidden'}
    >
      {/* 动态背景 */}
      <div style={styles.background} />
      <div style={styles.overlay} />

      {/* 浮动粒子 */}
      <FloatingParticles />

      {/* 魔法阵 */}
      <motion.div
        style={styles.magicCircleWrapper}
        variants={circleVariants}
        initial="hidden"
        animate="visible"
      >
        <MagicCircle />
      </motion.div>

      {/* 标题区域 */}
      <motion.div
        style={styles.titleArea}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={styles.titleText}>
          <h1 style={styles.mainTitle}>星辉魔法学院</h1>
          <p style={styles.subtitle}>Stellar Magic Academy</p>
        </div>
      </motion.div>

      {/* 菜单区域 */}
      <div className="menu-area" style={styles.menuContainer}>
        {/* 渐变边框效果 */}
        <div style={styles.borderGlow} />

        {menuItems.map((item, idx) => (
          <motion.button
            key={item.label}
            className={item.primary ? 'menu-btn menu-btn-primary' : 'menu-btn'}
            style={item.primary ? styles.primaryButton : styles.menuButton}
            variants={menuItemVariants}
            custom={idx}
            initial="hidden"
            animate="visible"
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            whileTap={{ scale: 0.97 }}
          >
            {/* 按钮光效 */}
            {hoveredIdx === idx && (
              <motion.div
                layoutId="hoverGlow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '8px',
                  background: item.primary
                    ? 'radial-gradient(ellipse at center, rgba(255,200,60,0.08), transparent 70%)'
                    : 'radial-gradient(ellipse at center, rgba(160,120,255,0.08), transparent 70%)',
                  pointerEvents: 'none',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* 版本号 */}
      <div style={styles.version}>v1.0.0</div>
    </motion.div>
  );
};

export default TitleScreen;
