/**
 * AffectionDisplay - 好感度显示组件
 *
 * 以心形图标展示角色好感度等级和进度。
 * 支持详细面板展开和好感度增加时的粒子特效。
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import {
  CHARACTERS,
  type AffectionLevel,
  type Character,
} from '../../data/characters';

// ─── Props ─────────────────────────────────────────────────────────────────

interface AffectionDisplayProps {
  characterId: string;
  showDetail?: boolean;
}

// ─── 好感度等级配置 ────────────────────────────────────────────────────────

function getLevelInfo(
  character: Character,
  affection: number,
): { level: AffectionLevel; levelIndex: number; progress: number } {
  const levels = character.affectionLevels;
  let levelIndex = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (affection >= levels[i].min) {
      levelIndex = i;
      break;
    }
  }
  const level = levels[levelIndex];
  const rangeSize = level.max - level.min + 1;
  const progress = rangeSize > 0 ? (affection - level.min) / rangeSize : 0;
  return { level, levelIndex, progress: Math.min(1, Math.max(0, progress)) };
}

// ─── 样式 ──────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  fontFamily: "'Noto Sans SC', sans-serif",
  userSelect: 'none',
};

const compactStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 14px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.8), rgba(8, 4, 20, 0.85))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(160, 120, 255, 0.2)',
};

const detailPanelStyle: React.CSSProperties = {
  padding: '20px 24px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.9), rgba(8, 4, 20, 0.95))',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(160, 120, 255, 0.25)',
  boxShadow: '0 4px 40px rgba(80, 40, 160, 0.2), inset 0 0 30px rgba(100, 60, 200, 0.03)',
  minWidth: '280px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontFamily: "'Orbitron', sans-serif",
  color: 'rgba(160, 140, 200, 0.6)',
  letterSpacing: '2px',
  marginBottom: '8px',
};

// ─── 粒子特效 ──────────────────────────────────────────────────────────────

const SparkleParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const x = Math.random() * 60 - 30;
  const colors = ['#ff80c0', '#c0a0ff', '#80d0ff', '#ffd080'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 4 + Math.random() * 4,
        height: 4 + Math.random() * 4,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        x: x,
        y: -(30 + Math.random() * 40),
        scale: [0, 1.2, 0],
      }}
      transition={{
        duration: 0.8 + Math.random() * 0.4,
        delay: delay,
        ease: 'easeOut',
      }}
    />
  );
};

// ─── 心形组件 ──────────────────────────────────────────────────────────────

const HeartIcon: React.FC<{ filled: boolean; color: string; index: number }> = ({
  filled,
  color,
  index,
}) => (
  <motion.span
    style={{
      fontSize: '16px',
      display: 'inline-block',
      filter: filled ? `drop-shadow(0 0 4px ${color})` : 'none',
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.08, type: 'spring', stiffness: 400, damping: 15 }}
  >
    {filled ? '❤️' : '🤍'}
  </motion.span>
);

// ─── 主组件 ────────────────────────────────────────────────────────────────

export const AffectionDisplay: React.FC<AffectionDisplayProps> = ({
  characterId,
  showDetail = false,
}) => {
  const affection = useGameStore((s) => s.getAffection(characterId));
  const [prevAffection, setPrevAffection] = useState(affection);
  const [showSparkles, setShowSparkles] = useState(false);
  const sparkleKeyRef = useRef(0);

  const character = useMemo(() => CHARACTERS[characterId], [characterId]);

  const { level, levelIndex, progress } = useMemo(
    () => (character ? getLevelInfo(character, affection) : { level: null, levelIndex: 0, progress: 0 }),
    [character, affection],
  );

  // 好感度增加时触发粒子
  useEffect(() => {
    if (affection > prevAffection) {
      setShowSparkles(true);
      sparkleKeyRef.current += 1;
      const timer = setTimeout(() => setShowSparkles(false), 1200);
      setPrevAffection(affection);
      return () => clearTimeout(timer);
    }
    setPrevAffection(affection);
  }, [affection, prevAffection]);

  if (!character || !level) return null;

  const totalHearts = 5;
  const filledHearts = Math.round((levelIndex / (character.affectionLevels.length - 1)) * totalHearts);
  const accentColor = character.element.color;

  // ── 紧凑模式 ──
  if (!showDetail) {
    return (
      <div style={containerStyle}>
        <div style={compactStyle}>
          {/* 心形图标组 */}
          <div style={{ display: 'flex', gap: '2px', position: 'relative' }}>
            {Array.from({ length: totalHearts }).map((_, i) => (
              <HeartIcon key={i} filled={i < filledHearts} color={accentColor} index={i} />
            ))}
            {showSparkles && (
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SparkleParticle key={`${sparkleKeyRef.current}-${i}`} delay={i * 0.08} />
                ))}
              </div>
            )}
          </div>
          {/* 等级名称 */}
          <span
            style={{
              fontSize: '13px',
              color: accentColor,
              fontWeight: 600,
              textShadow: `0 0 8px ${accentColor}50`,
            }}
          >
            {level.displayName}
          </span>
          {/* 数值 */}
          <span style={{ fontSize: '12px', color: 'rgba(180, 160, 220, 0.7)' }}>
            {affection}
          </span>
        </div>
      </div>
    );
  }

  // ── 详细模式 ──
  return (
    <AnimatePresence>
      <motion.div
        style={containerStyle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={detailPanelStyle}>
          {/* 角色名称 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>{character.element.icon}</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(230, 220, 250, 0.95)' }}>
                {character.name}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(160, 140, 200, 0.6)' }}>
                {character.title}
              </div>
            </div>
          </div>

          {/* 好感度等级 */}
          <div style={labelStyle}>好感度</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: accentColor,
                textShadow: `0 0 12px ${accentColor}40`,
              }}
            >
              {level.displayName}
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(180, 160, 220, 0.6)' }}>
              Lv.{levelIndex}
            </span>
          </div>

          {/* 心形图标组 */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', position: 'relative' }}>
            {Array.from({ length: totalHearts }).map((_, i) => (
              <HeartIcon key={i} filled={i < filledHearts} color={accentColor} index={i} />
            ))}
            {showSparkles && (
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SparkleParticle key={`detail-${sparkleKeyRef.current}-${i}`} delay={i * 0.06} />
                ))}
              </div>
            )}
          </div>

          {/* 进度条 */}
          <div style={labelStyle}>升级进度</div>
          <div
            style={{
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(40, 20, 80, 0.6)',
              overflow: 'hidden',
              marginBottom: '8px',
              border: '1px solid rgba(100, 70, 180, 0.2)',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                boxShadow: `0 0 10px ${accentColor}40`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(160, 140, 200, 0.5)', textAlign: 'right' as const }}>
            {affection} / {level.max}
          </div>

          {/* 称呼方式 */}
          <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(40, 20, 80, 0.3)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(160, 140, 200, 0.5)' }}>当前称呼： </span>
            <span style={{ fontSize: '13px', color: 'rgba(220, 200, 255, 0.8)' }}>
              {level.addressForm}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AffectionDisplay;
