import React from 'react';
import { motion } from 'framer-motion';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

export type ScreenEffectType =
  | 'shake'
  | 'flash'
  | 'darken'
  | 'light_rays'
  | 'chromatic'
  | 'blood'
  | 'glitch'
  | 'zoom_in'
  | 'blur'
  | 'red_alert';

export interface ScreenEffectConfig {
  type: ScreenEffectType;
  duration?: number;
  intensity?: number;
}

interface ScreenEffectsProps {
  effects: ScreenEffectConfig[];
  onComplete?: (type: ScreenEffectType) => void;
}

// ─── 震动效果 ─────────────────────────────────────────────────────────────

const ShakeEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 8,
  duration = 500,
  onComplete,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 998,
        pointerEvents: 'none',
      }}
      animate={{
        x: [
          0,
          intensity * (Math.random() > 0.5 ? 1 : -1),
          -intensity * 0.7 * (Math.random() > 0.5 ? 1 : -1),
          intensity * 0.5 * (Math.random() > 0.5 ? 1 : -1),
          -intensity * 0.3,
          intensity * 0.2,
          0,
        ],
        y: [
          0,
          intensity * 0.5 * (Math.random() > 0.5 ? 1 : -1),
          -intensity * 0.4,
          intensity * 0.3 * (Math.random() > 0.5 ? 1 : -1),
          -intensity * 0.1,
          0,
        ],
      }}
      transition={{
        duration: duration / 1000,
        ease: 'easeInOut',
        times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
      }}
    />
  );
};

// ─── 闪白效果 ─────────────────────────────────────────────────────────────

const FlashEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 0.8,
  duration = 300,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 997,
      pointerEvents: 'none',
      background: '#ffffff',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, intensity, intensity * 0.5, 0] }}
    transition={{ duration: duration / 1000, times: [0, 0.2, 0.4, 1] }}
    onAnimationComplete={onComplete}
  />
);

// ─── 暗角/变暗效果 ─────────────────────────────────────────────────────────

const DarkenEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 0.7,
  duration = 800,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 997,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.9) 100%)',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, intensity, intensity, 0] }}
    transition={{ duration: duration / 1000, times: [0, 0.3, 0.7, 1] }}
    onAnimationComplete={onComplete}
  />
);

// ─── 光线效果 ─────────────────────────────────────────────────────────────

const LightRaysEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 0.6,
  duration = 1500,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 997,
      pointerEvents: 'none',
      background: `
        conic-gradient(from 0deg at 50% 50%,
          transparent 0deg,
          rgba(255,255,200,${intensity * 0.3}) 30deg,
          transparent 60deg,
          rgba(255,255,200,${intensity * 0.2}) 90deg,
          transparent 120deg,
          rgba(255,255,200,${intensity * 0.25}) 150deg,
          transparent 180deg,
          rgba(255,255,200,${intensity * 0.2}) 210deg,
          transparent 240deg,
          rgba(255,255,200,${intensity * 0.3}) 270deg,
          transparent 300deg,
          rgba(255,255,200,${intensity * 0.2}) 330deg,
          transparent 360deg
        )
      `,
      mixBlendMode: 'screen',
    }}
    initial={{ opacity: 0, rotate: 0, scale: 1.5 }}
    animate={{
      opacity: [0, intensity, intensity, 0],
      rotate: [0, 30, -15, 0],
      scale: [1.5, 2, 1.8, 1.5],
    }}
    transition={{ duration: duration / 1000, times: [0, 0.2, 0.8, 1] }}
    onAnimationComplete={onComplete}
  />
);

// ─── 色差效果 ─────────────────────────────────────────────────────────────

const ChromaticEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 1,
  duration = 400,
  onComplete,
}) => (
  <>
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 997,
        pointerEvents: 'none',
        background: 'rgba(255,0,0,0.15)',
        mixBlendMode: 'screen',
      }}
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: [0, intensity * 4, -intensity * 3, intensity * 2, 0],
        opacity: [0, intensity * 0.3, intensity * 0.2, intensity * 0.1, 0],
      }}
      transition={{ duration: duration / 1000, ease: 'easeInOut' }}
    />
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 997,
        pointerEvents: 'none',
        background: 'rgba(0,255,255,0.15)',
        mixBlendMode: 'screen',
      }}
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: [0, -intensity * 4, intensity * 3, -intensity * 2, 0],
        opacity: [0, intensity * 0.3, intensity * 0.2, intensity * 0.1, 0],
      }}
      transition={{ duration: duration / 1000, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    />
  </>
);

// ─── 血色效果 ─────────────────────────────────────────────────────────────

const BloodEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 0.5,
  duration = 1000,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 997,
      pointerEvents: 'none',
      boxShadow: `inset 0 0 ${intensity * 100}px ${intensity * 60}px rgba(139,0,0,${intensity * 0.6})`,
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, intensity, intensity * 0.7, intensity * 0.3, 0] }}
    transition={{ duration: duration / 1000, times: [0, 0.15, 0.4, 0.7, 1] }}
    onAnimationComplete={onComplete}
  />
);

// ─── 故障效果 ─────────────────────────────────────────────────────────────

const GlitchEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 1,
  duration = 600,
  onComplete,
}) => {
  const [bars, setBars] = React.useState<Array<{ top: string; height: string; offset: number }>>([]);

  React.useEffect(() => {
    const newBars = Array.from({ length: Math.floor(8 * intensity) }, () => ({
      top: `${Math.random() * 100}%`,
      height: `${2 + Math.random() * 8}px`,
      offset: (Math.random() - 0.5) * 20 * intensity,
    }));
    setBars(newBars);
  }, [intensity]);

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 997, pointerEvents: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: duration / 1000, times: [0, 0.1, 0.9, 1] }}
      onAnimationComplete={onComplete}
    >
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: bar.top,
            height: bar.height,
            background: `rgba(${Math.random() > 0.5 ? '255,0,255' : '0,255,255'},0.3)`,
            mixBlendMode: 'screen',
          }}
          animate={{
            x: [0, bar.offset, -bar.offset * 0.5, bar.offset * 0.3, 0],
          }}
          transition={{
            duration: 0.1 + Math.random() * 0.2,
            repeat: Math.floor(duration / 200),
            repeatType: 'reverse',
          }}
        />
      ))}
    </motion.div>
  );
};

// ─── 缩放效果 ─────────────────────────────────────────────────────────────

const ZoomInEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 1.1,
  duration = 800,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: -20,
      zIndex: 996,
      pointerEvents: 'none',
    }}
  >
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(0px)',
      }}
      animate={{
        scale: [1, intensity, intensity, 1],
        backdropFilter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
      }}
      transition={{ duration: duration / 1000, times: [0, 0.3, 0.7, 1] }}
      onAnimationComplete={onComplete}
    />
  </motion.div>
);

// ─── 模糊效果 ─────────────────────────────────────────────────────────────

const BlurEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 8,
  duration = 600,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 996,
      pointerEvents: 'none',
      backdropFilter: 'blur(0px)',
    }}
    animate={{
      backdropFilter: [
        'blur(0px)',
        `blur(${intensity}px)`,
        `blur(${intensity}px)`,
        'blur(0px)',
      ],
    }}
    transition={{ duration: duration / 1000, times: [0, 0.3, 0.7, 1] }}
    onAnimationComplete={onComplete}
  />
);

// ─── 红色警报 ─────────────────────────────────────────────────────────────

const RedAlertEffect: React.FC<{ intensity: number; duration: number; onComplete?: () => void }> = ({
  intensity = 0.4,
  duration = 1200,
  onComplete,
}) => (
  <motion.div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 997,
      pointerEvents: 'none',
    }}
  >
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(255,0,0,${intensity * 0.3})`,
        border: `${intensity * 8}px solid rgba(255,0,0,${intensity * 0.5})`,
        boxShadow: `inset 0 0 ${intensity * 60}px rgba(255,0,0,${intensity * 0.4})`,
      }}
      animate={{
        opacity: [0, 1, 0.3, 1, 0.5, 1, 0],
      }}
      transition={{
        duration: duration / 1000,
        times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 1],
        ease: 'easeInOut',
      }}
      onAnimationComplete={onComplete}
    />
  </motion.div>
);

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const ScreenEffects: React.FC<ScreenEffectsProps> = ({ effects, onComplete }) => {
  const [activeEffects, setActiveEffects] = React.useState<ScreenEffectConfig[]>([]);

  React.useEffect(() => {
    if (effects.length > 0) {
      setActiveEffects(effects);
    }
  }, [effects]);

  const handleEffectComplete = React.useCallback((type: ScreenEffectType) => {
    setActiveEffects((prev) => prev.filter((e) => e.type !== type));
    onComplete?.(type);
  }, [onComplete]);

  const renderEffect = (effect: ScreenEffectConfig) => {
    const { type, duration = 500, intensity = 1 } = effect;
    const key = `${type}-${Date.now()}-${Math.random()}`;

    switch (type) {
      case 'shake':
        return (
          <ShakeEffect
            key={key}
            intensity={intensity * 10}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'flash':
        return (
          <FlashEffect
            key={key}
            intensity={intensity * 0.8}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'darken':
        return (
          <DarkenEffect
            key={key}
            intensity={intensity * 0.7}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'light_rays':
        return (
          <LightRaysEffect
            key={key}
            intensity={intensity * 0.6}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'chromatic':
        return (
          <ChromaticEffect
            key={key}
            intensity={intensity}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'blood':
        return (
          <BloodEffect
            key={key}
            intensity={intensity * 0.5}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'glitch':
        return (
          <GlitchEffect
            key={key}
            intensity={intensity}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'zoom_in':
        return (
          <ZoomInEffect
            key={key}
            intensity={1 + intensity * 0.15}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'blur':
        return (
          <BlurEffect
            key={key}
            intensity={intensity * 10}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      case 'red_alert':
        return (
          <RedAlertEffect
            key={key}
            intensity={intensity * 0.5}
            duration={duration}
            onComplete={() => handleEffectComplete(type)}
          />
        );
      default:
        return null;
    }
  };

  return <>{activeEffects.map(renderEffect)}</>;
};

// ─── 预设特效组合 ─────────────────────────────────────────────────────────

export const EFFECT_PRESETS: Record<string, ScreenEffectConfig[]> = {
  // 普通攻击命中
  hit_light: [
    { type: 'shake', intensity: 0.5, duration: 200 },
    { type: 'flash', intensity: 0.3, duration: 150 },
  ],
  // 重击
  hit_heavy: [
    { type: 'shake', intensity: 1, duration: 400 },
    { type: 'flash', intensity: 0.6, duration: 200 },
    { type: 'chromatic', intensity: 0.5, duration: 300 },
  ],
  // 暴击
  critical_hit: [
    { type: 'shake', intensity: 1.2, duration: 500 },
    { type: 'flash', intensity: 0.9, duration: 250 },
    { type: 'chromatic', intensity: 1, duration: 400 },
    { type: 'zoom_in', intensity: 1.2, duration: 500 },
  ],
  // 受伤
  damage_taken: [
    { type: 'shake', intensity: 0.8, duration: 350 },
    { type: 'blood', intensity: 0.4, duration: 600 },
  ],
  // 魔法释放
  magic_cast: [
    { type: 'light_rays', intensity: 0.8, duration: 800 },
    { type: 'flash', intensity: 0.4, duration: 300 },
  ],
  // 治愈
  heal: [
    { type: 'light_rays', intensity: 0.5, duration: 1000 },
    { type: 'flash', intensity: 0.3, duration: 400 },
  ],
  // 暗影出现
  shadow_appear: [
    { type: 'darken', intensity: 0.6, duration: 600 },
    { type: 'glitch', intensity: 0.5, duration: 400 },
    { type: 'shake', intensity: 0.6, duration: 400 },
  ],
  // 危机警报
  danger: [
    { type: 'red_alert', intensity: 0.6, duration: 1000 },
    { type: 'shake', intensity: 0.4, duration: 800 },
  ],
  // 力量觉醒
  awakening: [
    { type: 'light_rays', intensity: 1, duration: 1500 },
    { type: 'flash', intensity: 0.8, duration: 500 },
    { type: 'zoom_in', intensity: 1.1, duration: 1000 },
    { type: 'shake', intensity: 0.8, duration: 800 },
  ],
  // 告白/心动
  romantic: [
    { type: 'light_rays', intensity: 0.4, duration: 1200 },
    { type: 'flash', intensity: 0.3, duration: 400 },
    { type: 'blur', intensity: 0.3, duration: 800 },
  ],
  // Boss登场
  boss_appear: [
    { type: 'shake', intensity: 1.5, duration: 800 },
    { type: 'darken', intensity: 0.8, duration: 1000 },
    { type: 'blood', intensity: 0.5, duration: 800 },
    { type: 'glitch', intensity: 1, duration: 600 },
  ],
  // 死亡/失败
  death: [
    { type: 'darken', intensity: 1, duration: 1500 },
    { type: 'blood', intensity: 0.8, duration: 1200 },
    { type: 'blur', intensity: 0.8, duration: 1500 },
  ],
  // 胜利
  victory: [
    { type: 'light_rays', intensity: 1, duration: 1200 },
    { type: 'flash', intensity: 0.5, duration: 400 },
  ],
};

export default ScreenEffects;
