/**
 * @file BattleSystem - 星辉魔法学院 卡牌战斗系统
 * @description 完整的卡牌战斗系统实现，包含科技魔法融合风格的视觉效果
 * 支持元素克制、护盾、治疗、增减益、敌方AI等完整战斗机制
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import {
  Card,
  Element,
  Rarity,
  CardType,
  getCardById,
  ELEMENT_RELATIONS,
  RARITY_COLORS,
  ELEMENT_NAMES,
  CARD_TYPE_NAMES,
} from '../../data/cards';

// ─── Props ────────────────────────────────────────────────────────────────

interface BattleSystemProps {
  onBattleEnd: (victory: boolean) => void;
  enemyData: {
    name: string;
    element: string;
    maxHP: number;
    cards: string[];
    sprite: string;
  };
  playerCards: string[];
}

// ─── 内部类型 ─────────────────────────────────────────────────────────────

type BattlePhase = 'draw' | 'play' | 'enemy' | 'result';

interface Buff {
  id: string;
  name: string;
  icon: string;
  duration: number;
  value: number;
  type: 'atk_up' | 'def_up' | 'regen' | 'speed_up' | 'poison' | 'burn' | 'frozen';
  isBuff: boolean;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

interface BattleUnit {
  hp: number;
  maxHP: number;
  mp: number;
  maxMP: number;
  shield: number;
  buffs: Buff[];
  element: Element;
}

interface EnemyAI {
  lastAction: string | null;
  priority: 'aggressive' | 'defensive' | 'balanced';
}

// ─── 元素配置 ─────────────────────────────────────────────────────────────

const ELEMENT_COLORS: Record<Element, string> = {
  fire: '#FF4500',
  ice: '#00BFFF',
  water: '#1E90FF',
  wind: '#7CFC00',
  earth: '#CD853F',
  lightning: '#FFD700',
  light: '#FFFAF0',
  dark: '#8B008B',
  neutral: '#A0A0A0',
};

const ELEMENT_ICONS: Record<Element, string> = {
  fire: '🔥',
  ice: '❄️',
  water: '💧',
  wind: '🌪️',
  earth: '🪨',
  lightning: '⚡',
  light: '✨',
  dark: '🌑',
  neutral: '◇',
};

const CARD_TYPE_ICONS: Record<CardType, string> = {
  attack: '⚔️',
  defense: '🛡️',
  magic: '🔮',
  heal: '💚',
  special: '⭐',
};

// ─── 辅助函数 ─────────────────────────────────────────────────────────────

function getElementMultiplier(atk: Element, def: Element): number {
  return ELEMENT_RELATIONS[atk]?.[def] ?? 1.0;
}

function getEffectivenessLabel(mult: number): string {
  if (mult >= 1.5) return 'SUPER EFFECTIVE!';
  if (mult > 1.0) return '效果拔群！';
  if (mult <= 0.75) return 'Not very effective...';
  return '';
}

function getEffectivenessColor(mult: number): string {
  if (mult >= 1.5) return '#FF4500';
  if (mult > 1.0) return '#FFA500';
  if (mult <= 0.75) return '#4169E1';
  return '#FFFFFF';
}

function getRarityGlow(rarity: Rarity): string {
  const glows: Record<Rarity, string> = {
    N: 'none',
    R: '0 0 12px rgba(33,150,243,0.6)',
    SR: '0 0 15px rgba(156,39,176,0.7)',
    SSR: '0 0 20px rgba(255,215,0,0.8)',
    UR: '0 0 25px rgba(255,64,129,0.9), 0 0 50px rgba(255,165,0,0.4)',
  };
  return glows[rarity];
}

function getRarityBorder(rarity: Rarity): string {
  const borders: Record<Rarity, string> = {
    N: '1px solid rgba(158,158,158,0.3)',
    R: '1px solid rgba(33,150,243,0.5)',
    SR: '1.5px solid rgba(156,39,176,0.6)',
    SSR: '2px solid rgba(255,215,0,0.7)',
    UR: '2px solid rgba(255,64,129,0.8)',
  };
  return borders[rarity];
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── 样式 ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'linear-gradient(180deg, #05001a 0%, #0d0025 40%, #1a0030 100%)',
    fontFamily: "'Noto Sans SC', 'Cinzel', sans-serif",
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden', userSelect: 'none',
  },
  bgGrid: {
    position: 'absolute', inset: 0, opacity: 0.04,
    backgroundImage:
      'linear-gradient(rgba(160,120,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(160,120,255,0.3) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  topSection: {
    flex: '0 0 auto', padding: '16px 24px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'flex-start',
    position: 'relative', zIndex: 5,
  },
  midSection: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 3, overflow: 'hidden',
  },
  bottomSection: {
    flex: '0 0 auto', padding: '12px 20px 16px',
    display: 'flex', flexDirection: 'column', gap: '10px',
    position: 'relative', zIndex: 5,
    background: 'linear-gradient(0deg, rgba(10,0,30,0.95) 0%, rgba(10,0,30,0.6) 80%, transparent 100%)',
  },
  infoPanel: {
    background: 'linear-gradient(135deg, rgba(15,5,40,0.8), rgba(5,0,20,0.9))',
    backdropFilter: 'blur(10px)', borderRadius: '12px',
    padding: '12px 18px', border: '1px solid rgba(120,80,220,0.2)',
    minWidth: '220px',
  },
  nameText: {
    fontSize: '16px', fontWeight: 700, color: 'rgba(220,200,255,0.95)',
    letterSpacing: '2px', marginBottom: '6px',
  },
  barOuter: {
    height: '14px', borderRadius: '7px', overflow: 'hidden',
    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const, marginBottom: '4px',
  },
  turnBadge: {
    position: 'absolute' as const, top: '16px', left: '50%',
    transform: 'translateX(-50%)', zIndex: 10,
    background: 'linear-gradient(135deg, rgba(20,5,50,0.85), rgba(10,0,30,0.9))',
    backdropFilter: 'blur(8px)', borderRadius: '20px',
    padding: '6px 24px', border: '1px solid rgba(120,80,220,0.3)',
    color: 'rgba(180,160,255,0.9)', fontSize: '14px', fontWeight: 600,
    letterSpacing: '2px', whiteSpace: 'nowrap' as const,
  },
  handRow: {
    display: 'flex', justifyContent: 'center', gap: '10px',
    padding: '4px 0', minHeight: '180px', alignItems: 'flex-end',
  },
  card: {
    width: '120px', height: '170px', borderRadius: '10px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column' as const, position: 'relative' as const,
    overflow: 'hidden', transition: 'transform 0.2s ease',
    backdropFilter: 'blur(12px)',
  },
  enemySpriteArea: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '120px', filter: 'drop-shadow(0 0 30px rgba(160,80,255,0.4))',
  },
  btnRow: {
    display: 'flex', justifyContent: 'center', gap: '12px', padding: '4px 0 8px',
  },
  actionBtn: {
    padding: '10px 36px', borderRadius: '8px', border: '1px solid rgba(180,140,255,0.4)',
    background: 'linear-gradient(135deg, rgba(40,15,80,0.8), rgba(20,5,50,0.9))',
    color: 'rgba(220,200,255,0.95)', fontSize: '15px', fontWeight: 600,
    letterSpacing: '3px', cursor: 'pointer', fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.25s ease',
  },
  phaseOverlay: {
    position: 'absolute' as const, inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
    zIndex: 20,
  },
  effectText: {
    fontSize: '28px', fontWeight: 800, letterSpacing: '4px',
    textShadow: '0 0 30px currentColor, 0 0 60px currentColor',
  },
  resultOverlay: {
    position: 'fixed' as const, inset: 0, zIndex: 2000,
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
  },
};

// ─── 子组件：HP / MP 条 ─────────────────────────────────────────────────

const StatusBar: React.FC<{
  current: number; max: number; color: string;
  label: string; height?: number;
}> = ({ current, max, color, label, height = 14 }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = pct > 60 ? color : pct > 30 ? '#F5A623' : '#FF3B30';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(180,160,255,0.7)', marginBottom: '2px' }}>
        <span>{label}</span>
        <span>{Math.ceil(current)}/{max}</span>
      </div>
      <div style={{ ...s.barOuter, height: `${height}px` }}>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: '7px',
            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            boxShadow: `0 0 8px ${barColor}88`,
          }}
        />
      </div>
    </div>
  );
};

// ─── 子组件：增益图标 ────────────────────────────────────────────────────

const BuffIcons: React.FC<{ buffs: Buff[] }> = ({ buffs }) => (
  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
    {buffs.map((b) => (
      <div
        key={b.id}
        title={`${b.name} (${b.duration}回合) - ${b.isBuff ? '增益' : '减益'}`}
        style={{
          width: '24px', height: '24px', borderRadius: '6px', fontSize: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          background: b.isBuff
            ? 'linear-gradient(135deg, rgba(40,180,80,0.4), rgba(20,100,50,0.6))'
            : 'linear-gradient(135deg, rgba(200,40,40,0.4), rgba(120,20,20,0.6))',
          border: b.isBuff
            ? '1px solid rgba(80,220,120,0.4)'
            : '1px solid rgba(220,60,60,0.4)',
        }}
      >
        {b.icon}
        <span style={{ fontSize: '8px', position: 'absolute', bottom: '1px', right: '2px', color: 'rgba(255,255,255,0.7)' }}>
          {b.duration}
        </span>
      </div>
    ))}
  </div>
);

// ─── 子组件：战斗卡牌 ────────────────────────────────────────────────────

const BattleCardView: React.FC<{
  card: Card; index: number; selected: boolean; disabled: boolean;
  onSelect: () => void; enemyElement: Element;
}> = ({ card, index, selected, disabled, onSelect, enemyElement }) => {
  const [hovered, setHovered] = useState(false);
  const elemColor = ELEMENT_COLORS[card.element] || '#AAA';
  const rarityColor = RARITY_COLORS[card.rarity];
  const canAfford = !disabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateZ: (index - 2) * 3 }}
      animate={{
        opacity: 1, y: 0, rotateZ: (index - 2) * 3,
        scale: hovered ? 1.12 : selected ? 1.06 : 1,
      }}
      transition={{ duration: 0.4, delay: index * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => canAfford && onSelect()}
      style={{
        ...s.card,
        background: `linear-gradient(160deg, rgba(20,10,50,0.92) 0%, rgba(10,5,30,0.96) 100%)`,
        border: selected
          ? `2px solid ${elemColor}`
          : getRarityBorder(card.rarity),
        boxShadow: selected
          ? `0 0 20px ${elemColor}88, 0 0 40px ${elemColor}44, inset 0 0 20px ${elemColor}11`
          : getRarityGlow(card.rarity),
        opacity: canAfford ? 1 : 0.5,
        cursor: canAfford ? 'pointer' : 'not-allowed',
        transformOrigin: 'bottom center',
      }}
    >
      {/* 顶部 - 消耗和元素 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px 2px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${elemColor}44, ${elemColor}22)`,
          borderRadius: '6px', padding: '2px 6px', fontSize: '11px',
          color: elemColor, fontWeight: 700,
        }}>
          {ELEMENT_ICONS[card.element]} {ELEMENT_NAMES[card.element]}
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(60,20,120,0.7), rgba(30,10,70,0.8))',
          borderRadius: '50%', width: '26px', height: '26px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 800, color: '#80D0FF',
          border: '1px solid rgba(100,180,255,0.4)',
        }}>
          {card.cost}
        </div>
      </div>

      {/* 稀有度宝石 */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <div style={{
          display: 'inline-block', width: '8px', height: '8px',
          borderRadius: '50%', background: rarityColor,
          boxShadow: `0 0 6px ${rarityColor}, 0 0 12px ${rarityColor}88`,
        }} />
        <span style={{ fontSize: '9px', color: rarityColor, marginLeft: '4px', fontWeight: 600 }}>
          {card.rarity}
        </span>
      </div>

      {/* 卡名 */}
      <div style={{
        textAlign: 'center', fontSize: '13px', fontWeight: 700,
        color: 'rgba(235,220,255,0.95)', padding: '0 6px',
        lineHeight: '1.3',
      }}>
        {card.name}
      </div>

      {/* 类型图标 */}
      <div style={{ textAlign: 'center', fontSize: '12px', margin: '3px 0' }}>
        {CARD_TYPE_ICONS[card.type]}
        <span style={{ fontSize: '9px', color: 'rgba(180,160,255,0.6)', marginLeft: '3px' }}>
          {CARD_TYPE_NAMES[card.type]}
        </span>
      </div>

      {/* 数值 */}
      <div style={{
        textAlign: 'center', fontSize: '16px', fontWeight: 800,
        color: card.type === 'attack' || card.type === 'magic' ? '#FF6B6B'
          : card.type === 'heal' ? '#6BFF8B'
          : card.type === 'defense' ? '#6BB5FF'
          : '#FFD76B',
        textShadow: `0 0 8px currentColor`,
      }}>
        {card.type === 'attack' || card.type === 'magic' ? card.damage
          : card.type === 'heal' ? `+${card.damage}`
          : card.type === 'defense' ? card.damage
          : '★'}
      </div>

      {/* 效果文本 */}
      <div style={{
        fontSize: '9px', color: 'rgba(180,160,255,0.6)',
        textAlign: 'center', padding: '2px 6px 6px', lineHeight: '1.3',
        flex: 1, overflow: 'hidden',
      }}>
        {card.effect}
      </div>

      {/* 底部装饰线 */}
      <div style={{
        height: '3px', borderRadius: '0 0 10px 10px',
        background: `linear-gradient(90deg, transparent, ${elemColor}66, ${rarityColor}88, ${elemColor}66, transparent)`,
      }} />

      {/* 选中指示 */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute', top: '4px', right: '4px',
            background: elemColor, borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF',
          }}
        >✓</motion.div>
      )}

      {/* Hover 完整描述 tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(20,10,50,0.95), rgba(5,0,20,0.98))',
              border: `1px solid ${elemColor}44`, borderRadius: '8px',
              padding: '8px 12px', minWidth: '180px', maxWidth: '220px',
              backdropFilter: 'blur(12px)', zIndex: 100, pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
              {card.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(200,180,255,0.75)', lineHeight: '1.5' }}>
              {card.description}
            </div>
            <div style={{ fontSize: '9px', color: elemColor, marginTop: '4px' }}>
              {card.effect}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── 子组件：浮动数字 ────────────────────────────────────────────────────

const FloatingNumbers: React.FC<{ items: FloatingText[] }> = ({ items }) => (
  <AnimatePresence>
    {items.map((item) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 0, scale: 0.6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: -16, scale: 1.1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -110, scale: 0.9, filter: 'blur(6px)' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'absolute', left: `${item.x}%`, top: `${item.y}%`,
          color: item.color, fontSize: `${item.fontSize}px`,
          fontWeight: 900, pointerEvents: 'none', zIndex: 50,
          textShadow: `0 0 10px ${item.color}, 0 0 24px ${item.color}88`,
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {item.text}
      </motion.div>
    ))}
  </AnimatePresence>
);

// ─── 子组件：元素粒子 ────────────────────────────────────────────────────

const ElementParticles: React.FC<{ element: Element; active: boolean }> = ({ element, active }) => {
  const color = ELEMENT_COLORS[element];
  const particles = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      angle: (i * 30 * Math.PI) / 180,
      dist: 60 + Math.random() * 100,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.5,
    })), []);

  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
          }}
          transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  );
};

// ─── 子组件：屏幕震动 ────────────────────────────────────────────────────

const ScreenShake: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <motion.div
    animate={active ? {
      x: [0, -6, 6, -4, 4, 0],
      y: [0, 4, -4, 2, -2, 0],
    } : { x: 0, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    style={{ width: '100%', height: '100%' }}
  >
    {children}
  </motion.div>
);

// ─── 主组件 ───────────────────────────────────────────────────────────────

export const BattleSystem: React.FC<BattleSystemProps> = ({
  onBattleEnd, enemyData, playerCards,
}) => {
  const { addNotification } = useGameStore();

  // ── 战斗状态 ──────────────────────────────────────────────────────────
  const [player, setPlayer] = useState<BattleUnit>({
    hp: 100, maxHP: 100, mp: 10, maxMP: 10, shield: 0, buffs: [], element: 'light',
  });
  const [enemy, setEnemy] = useState<BattleUnit>({
    hp: enemyData.maxHP, maxHP: enemyData.maxHP, mp: 10, maxMP: 10,
    shield: 0, buffs: [], element: enemyData.element as Element,
  });

  const [deck, setDeck] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [discard, setDiscard] = useState<string[]>([]);
  const [phase, setPhase] = useState<BattlePhase>('draw');
  const [turn, setTurn] = useState(1);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [damageFlash, setDamageFlash] = useState(false);
  const [healFlash, setHealFlash] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [vfxElement, setVfxElement] = useState<Element | null>(null);
  const [effectivenessText, setEffectivenessText] = useState('');
  const [effectivenessColor, setEffectivenessColor] = useState('#FFF');
  const [showEffectiveness, setShowEffectiveness] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [enemyActionText, setEnemyActionText] = useState('');
  const [showEnemyAction, setShowEnemyAction] = useState(false);
  const [drawPhaseText, setDrawPhaseText] = useState('');
  const [showDrawPhase, setShowDrawPhase] = useState(false);
  const [cardPlayAnim, setCardPlayAnim] = useState<Card | null>(null);

  const aiRef = useRef<EnemyAI>({ lastAction: null, priority: 'balanced' });
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const turnRef = useRef(turn);
  turnRef.current = turn;

  // ── 初始化牌组 ────────────────────────────────────────────────────────
  useEffect(() => {
    const shuffled = shuffleArray([...playerCards]);
    setDeck(shuffled);
    setHand([]);
    setDiscard([]);
    setTurn(1);
  }, [playerCards]);

  // ── 添加浮动文字 ──────────────────────────────────────────────────────
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string, fontSize = 32) => {
    const id = generateId();
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color, fontSize }]);
    setTimeout(() => setFloatingTexts((prev) => prev.filter((t) => t.id !== id)), 1300);
  }, []);

  // ── 抽牌阶段 ──────────────────────────────────────────────────────────
  const executeDrawPhase = useCallback(() => {
    setPhase('draw');
    setShowDrawPhase(true);
    setDrawPhaseText(`第 ${turnRef.current} 回合 - 抽牌阶段`);

    setTimeout(() => {
      setShowDrawPhase(false);
      let currentDeck = [...deck];
      let currentDiscard = [...discard];
      const drawn: string[] = [];

      for (let i = 0; i < 5; i++) {
        if (currentDeck.length === 0 && currentDiscard.length > 0) {
          currentDeck = shuffleArray(currentDiscard);
          currentDiscard = [];
        }
        if (currentDeck.length > 0) {
          drawn.push(currentDeck.shift()!);
        }
      }

      setDeck(currentDeck);
      setDiscard(currentDiscard);

      drawn.forEach((cardId, index) => {
        setTimeout(() => {
          setHand((prev) => [...prev, cardId]);
        }, index * 120);
      });

      setTimeout(() => {
        setPhase('play');
        setSelectedCardIdx(null);

        // 每回合恢复 2 MP
        setPlayer((prev) => ({
          ...prev,
          mp: Math.min(prev.maxMP, prev.mp + 2),
          shield: 0, // 护盾不累积
        }));
      }, drawn.length * 120 + 80);
    }, 1200);
  }, [deck, discard]);

  // ── 首次抽牌 ──────────────────────────────────────────────────────────
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && playerCards.length > 0) {
      initializedRef.current = true;
      executeDrawPhase();
    }
  }, [playerCards, executeDrawPhase]);

  // ── 计算伤害（含元素克制） ────────────────────────────────────────────
  const calcDamage = useCallback((card: Card, attackerElement: Element, defenderElement: Element) => {
    const mult = getElementMultiplier(card.element as Element, defenderElement);
    const atkBuff = 1.0; // 可扩展 buff 加成
    return Math.floor(card.damage * mult * atkBuff);
  }, []);

  // ── 使用卡牌 ──────────────────────────────────────────────────────────
  const playCard = useCallback(() => {
    if (phaseRef.current !== 'play' || selectedCardIdx === null) return;

    const cardId = hand[selectedCardIdx];
    const card = getCardById(cardId);
    if (!card) return;

    if (card.cost > player.mp) {
      addNotification('MP不足！', 'warning', 1500);
      return;
    }

    // 扣除 MP
    setPlayer((prev) => ({ ...prev, mp: prev.mp - card.cost }));

    // 移除手牌
    setHand((prev) => prev.filter((_, i) => i !== selectedCardIdx));
    setDiscard((prev) => [...prev, cardId]);
    setSelectedCardIdx(null);

    // 播放卡牌动画
    setCardPlayAnim(card);
    setVfxElement(card.element as Element);
    setTimeout(() => { setCardPlayAnim(null); setVfxElement(null); }, 1200);

    // 应用效果
    const enemyCenterX = 50;
    const playerCenterY = 80;

    switch (card.type) {
      case 'attack':
      case 'magic': {
        const dmg = calcDamage(card, player.element, enemy.element);
        const mult = getElementMultiplier(card.element as Element, enemy.element);

        setEnemy((prev) => ({
          ...prev,
          hp: Math.max(0, prev.hp - Math.max(1, dmg - prev.shield)),
          shield: Math.max(0, prev.shield - dmg),
        }));

        addFloatingText(`-${Math.max(1, dmg - enemy.shield)}`, enemyCenterX, 30, '#FF4444', 38);

        // 元素克制提示
        const label = getEffectivenessLabel(mult);
        if (label) {
          setEffectivenessText(label);
          setEffectivenessColor(getEffectivenessColor(mult));
          setShowEffectiveness(true);
          setTimeout(() => setShowEffectiveness(false), 1500);
        }

        setScreenShake(true);
        setDamageFlash(true);
        setTimeout(() => { setScreenShake(false); setDamageFlash(false); }, 500);
        break;
      }
      case 'defense': {
        setPlayer((prev) => ({ ...prev, shield: prev.shield + card.damage }));
        setShieldActive(true);
        addFloatingText(`+${card.damage} 🛡️`, 50, playerCenterY, '#6BB5FF', 28);
        setTimeout(() => setShieldActive(false), 1500);
        break;
      }
      case 'heal': {
        setPlayer((prev) => ({
          ...prev,
          hp: Math.min(prev.maxHP, prev.hp + card.damage),
        }));
        setHealFlash(true);
        addFloatingText(`+${card.damage} HP`, 50, playerCenterY, '#6BFF8B', 28);
        setTimeout(() => setHealFlash(false), 800);
        break;
      }
      case 'special': {
        // 特殊卡牌 - 根据伤害值判断效果类型
        if (card.damage > 0) {
          const dmg = calcDamage(card, player.element, enemy.element);
          setEnemy((prev) => ({
            ...prev,
            hp: Math.max(0, prev.hp - Math.max(1, dmg - prev.shield)),
            shield: Math.max(0, prev.shield - dmg),
          }));
          addFloatingText(`-${dmg}`, enemyCenterX, 30, '#FFD700', 34);
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 500);
        }
        // 特殊效果粒子
        addFloatingText('★ SPECIAL ★', 50, 50, '#FFD700', 24);
        break;
      }
    }
  }, [selectedCardIdx, hand, player, enemy, calcDamage, addFloatingText, addNotification]);

  // ── 检查战斗结束 ──────────────────────────────────────────────────────
  useEffect(() => {
    if (enemy.hp <= 0 && phase !== 'result') {
      setPhase('result');
      setTimeout(() => setBattleResult('victory'), 800);
    }
    if (player.hp <= 0 && phase !== 'result') {
      setPhase('result');
      setTimeout(() => setBattleResult('defeat'), 800);
    }
  }, [enemy.hp, player.hp, phase]);

  // ── 敌方 AI ───────────────────────────────────────────────────────────
  const enemyTurn = useCallback(() => {
    setPhase('enemy');
    setShowEnemyAction(true);

    const enemyCardIds = enemyData.cards;
    const availableCards = enemyCardIds
      .map((id) => getCardById(id))
      .filter((c): c is Card => c !== undefined);

    if (availableCards.length === 0) {
      setEnemyActionText('敌人无法行动！');
      setTimeout(() => {
        setShowEnemyAction(false);
        setTurn((t) => t + 1);
        executeDrawPhase();
      }, 1200);
      return;
    }

    // AI 优先级
    const ai = aiRef.current;
    const hpPct = enemy.hp / enemy.maxHP;

    if (hpPct < 0.3) ai.priority = 'defensive';
    else if (player.shield > 10) ai.priority = 'aggressive';
    else ai.priority = 'balanced';

    let chosen: Card;
    if (ai.priority === 'defensive') {
      const healOrDef = availableCards.filter((c) => c.type === 'heal' || c.type === 'defense');
      chosen = healOrDef.length > 0 ? healOrDef[Math.floor(Math.random() * healOrDef.length)] : availableCards[0];
    } else if (ai.priority === 'aggressive') {
      const attacks = availableCards.filter((c) => c.type === 'attack' || c.type === 'magic');
      chosen = attacks.length > 0 ? attacks.sort((a, b) => b.damage - a.damage)[0] : availableCards[0];
    } else {
      chosen = availableCards[Math.floor(Math.random() * availableCards.length)];
    }

    setEnemyActionText(`${enemyData.name} 使用了 ${chosen.name}！`);
    setVfxElement(chosen.element as Element);

    setTimeout(() => {
      setShowEnemyAction(false);
      setVfxElement(null);

      // 应用敌方卡牌效果
      const mult = getElementMultiplier(chosen.element as Element, player.element);

      switch (chosen.type) {
        case 'attack':
        case 'magic': {
          const dmg = Math.floor(chosen.damage * mult);
          const actualDmg = Math.max(1, dmg - player.shield);
          setPlayer((prev) => ({
            ...prev,
            hp: Math.max(0, prev.hp - actualDmg),
            shield: Math.max(0, prev.shield - dmg),
          }));
          addFloatingText(`-${actualDmg}`, 50, 70, '#FF2222', 34);
          setScreenShake(true);
          setDamageFlash(true);
          setTimeout(() => { setScreenShake(false); setDamageFlash(false); }, 500);
          break;
        }
        case 'defense': {
          setEnemy((prev) => ({ ...prev, shield: prev.shield + chosen.damage }));
          addFloatingText(`+${chosen.damage} 🛡️`, 50, 25, '#6BB5FF', 24);
          break;
        }
        case 'heal': {
          setEnemy((prev) => ({
            ...prev,
            hp: Math.min(prev.maxHP, prev.hp + chosen.damage),
          }));
          addFloatingText(`+${chosen.damage} HP`, 50, 25, '#6BFF8B', 24);
          setHealFlash(true);
          setTimeout(() => setHealFlash(false), 800);
          break;
        }
        case 'special': {
          if (chosen.damage > 0) {
            const dmg = Math.floor(chosen.damage * mult);
            setPlayer((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - Math.max(1, dmg - prev.shield)),
              shield: Math.max(0, prev.shield - dmg),
            }));
            addFloatingText(`-${dmg}`, 50, 70, '#FFD700', 30);
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 500);
          }
          break;
        }
      }

      // 处理 buff 持续伤害/回血 (burn / regen)
      setEnemy((prev) => {
        let hpDelta = 0;
        const updated = prev.buffs
          .map((b) => ({ ...b, duration: b.duration - 1 }))
          .filter((b) => {
            if (b.type === 'burn') hpDelta -= b.value;
            if (b.type === 'regen') hpDelta += b.value;
            return b.duration > 0;
          });
        return { ...prev, hp: Math.max(0, Math.min(prev.maxHP, prev.hp + hpDelta)), buffs: updated };
      });

      // 回合推进
      setTimeout(() => {
        setTurn((t) => {
          turnRef.current = t + 1;
          return t + 1;
        });
        executeDrawPhase();
      }, 600);
    }, 1800);
  }, [enemyData, enemy, player.element, player.shield, addFloatingText, executeDrawPhase]);

  // ── 结束回合 ──────────────────────────────────────────────────────────
  const endTurn = useCallback(() => {
    if (phase !== 'play') return;
    setSelectedCardIdx(null);
    enemyTurn();
  }, [phase, enemyTurn]);

  // ── 结算按钮 ──────────────────────────────────────────────────────────
  const handleBattleEnd = useCallback((victory: boolean) => {
    onBattleEnd(victory);
  }, [onBattleEnd]);

  // ── 玩家元素颜色 ──────────────────────────────────────────────────────
  const playerElementColor = ELEMENT_COLORS[player.element] || '#AAA';

  // ── 渲染 ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={s.overlay}
    >
      <div style={s.bgGrid} />

      {/* 屏幕震动 */}
      <ScreenShake active={screenShake}>
        {/* 伤害闪红 / 治疗闪绿 */}
        <AnimatePresence>
          {damageFlash && (
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.25), rgba(200,0,0,0.1) 60%, transparent)',
              }}
            />
          )}
          {healFlash && (
            <motion.div
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(0,255,100,0.2), transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ─── 顶部：敌方信息 ─────────────────────────────────── */}
        <div style={s.topSection}>
          <div style={s.infoPanel}>
            <div style={s.nameText}>
              {ELEMENT_ICONS[enemy.element]} {enemyData.name}
            </div>
            <StatusBar current={enemy.hp} max={enemy.maxHP} color="#FF3B30" label="HP" />
            <StatusBar current={enemy.mp} max={enemy.maxMP} color="#5B7FFF" label="MP" height={10} />
            <BuffIcons buffs={enemy.buffs} />
          </div>

          {/* 敌方精灵 */}
          <div style={s.enemySpriteArea}>
            <motion.div
              animate={damageFlash ? { x: [0, -8, 8, -5, 5, 0], scale: [1, 0.94, 1.04, 0.98, 1.02, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
              style={{ filter: damageFlash ? 'brightness(1.6)' : 'brightness(1)', transition: 'filter 0.15s ease' }}
            >
              {enemyData.sprite || '👹'}
            </motion.div>
            {damageFlash && (
              <motion.div
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)', borderRadius: '16px', pointerEvents: 'none' }}
              />
            )}
          </div>

          {/* 玩家信息（右上角） */}
          <div style={s.infoPanel}>
            <div style={{ ...s.nameText, color: playerElementColor }}>
              {ELEMENT_ICONS[player.element]} 魔法学徒
            </div>
            <StatusBar current={player.hp} max={player.maxHP} color="#4ADE80" label="HP" />
            <StatusBar current={player.mp} max={player.maxMP} color="#60A5FA" label="MP" height={10} />
            {player.shield > 0 && (
              <div style={{ fontSize: '12px', color: '#6BB5FF', marginTop: '2px' }}>
                🛡️ 护盾: {player.shield}
              </div>
            )}
            <BuffIcons buffs={player.buffs} />
          </div>
        </div>

        {/* 回合指示 */}
        <div style={s.turnBadge}>
          ⚔ 回合 {turn} · {phase === 'play' ? '行动阶段' : phase === 'enemy' ? '敌方回合' : phase === 'draw' ? '抽牌中' : '结算'}
        </div>

        {/* ─── 中间：战场区域 ────────────────────────────────── */}
        <div style={s.midSection}>
          {/* 元素粒子特效 */}
          {vfxElement && <ElementParticles element={vfxElement} active={!!vfxElement} />}

          {/* 护盾特效 */}
          <AnimatePresence>
            {shieldActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute', left: '50%', bottom: '30%',
                  transform: 'translateX(-50%)', width: '200px', height: '200px',
                  pointerEvents: 'none',
                }}
              >
                <svg viewBox="0 0 200 200" width="200" height="200">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="100,10 180,55 180,145 100,190 20,145 20,55"
                    fill="none" stroke="url(#shieldGrad)" strokeWidth="3"
                    style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                  />
                  <polygon
                    points="100,30 160,62 160,138 100,170 40,138 40,62"
                    fill="url(#shieldGrad)" opacity="0.15"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 卡牌播放动画 */}
          <AnimatePresence>
            {cardPlayAnim && (
              <motion.div
                initial={{ y: 200, opacity: 1, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.8, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', left: '50%', top: '40%',
                  transform: 'translateX(-50%)', zIndex: 30, pointerEvents: 'none',
                }}
              >
                <div style={{
                  width: '100px', height: '140px', borderRadius: '10px',
                  background: `linear-gradient(160deg, ${ELEMENT_COLORS[cardPlayAnim.element as Element]}44, rgba(10,5,30,0.95))`,
                  border: `2px solid ${ELEMENT_COLORS[cardPlayAnim.element as Element]}`,
                  boxShadow: `0 0 30px ${ELEMENT_COLORS[cardPlayAnim.element as Element]}66`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '8px',
                }}>
                  <div style={{ fontSize: '11px', color: ELEMENT_COLORS[cardPlayAnim.element as Element] }}>
                    {ELEMENT_ICONS[cardPlayAnim.element as Element]} {cardPlayAnim.name}
                  </div>
                  <div style={{ fontSize: '20px', margin: '4px 0' }}>
                    {CARD_TYPE_ICONS[cardPlayAnim.type]}
                  </div>
                  <div style={{
                    fontSize: '18px', fontWeight: 800,
                    color: RARITY_COLORS[cardPlayAnim.rarity],
                    textShadow: `0 0 10px ${RARITY_COLORS[cardPlayAnim.rarity]}`,
                  }}>
                    {cardPlayAnim.damage}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 元素克制提示 */}
          <AnimatePresence>
            {showEffectiveness && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 400 }}
                style={{
                  position: 'absolute', top: '20%', left: '50%',
                  transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none',
                  ...s.effectText, color: effectivenessColor,
                }}
              >
                {effectivenessText}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 敌方行动提示 */}
          <AnimatePresence>
            {showEnemyAction && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute', top: '15%', left: '50%',
                  transform: 'translateX(-50%)', zIndex: 40,
                  background: 'linear-gradient(135deg, rgba(200,40,40,0.3), rgba(100,20,20,0.5))',
                  backdropFilter: 'blur(8px)', borderRadius: '10px',
                  padding: '10px 24px', border: '1px solid rgba(255,60,60,0.3)',
                  color: 'rgba(255,200,200,0.95)', fontSize: '15px', fontWeight: 600,
                  letterSpacing: '1px', whiteSpace: 'nowrap' as const,
                }}
              >
                {enemyActionText}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 抽牌阶段提示 */}
          <AnimatePresence>
            {showDrawPhase && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute', top: '30%', left: '50%',
                  transform: 'translateX(-50%)', zIndex: 45,
                  ...s.effectText, color: 'rgba(160,180,255,0.9)',
                  fontSize: '22px',
                }}
              >
                {drawPhaseText}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 浮动数字 */}
          <FloatingNumbers items={floatingTexts} />
        </div>

        {/* ─── 底部：玩家信息 + 手牌 ─────────────────────────── */}
        <div style={s.bottomSection}>
          {/* MP 水晶指示 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>💎</span>
            <span style={{
              fontSize: '16px', fontWeight: 700, color: '#60A5FA',
              textShadow: '0 0 8px rgba(96,165,250,0.5)',
            }}>
              MP: {player.mp} / {player.maxMP}
            </span>
          </div>

          {/* 手牌 */}
          <div style={s.handRow}>
            <AnimatePresence>
              {hand.map((cardId, idx) => {
                const card = getCardById(cardId);
                if (!card) return null;
                return (
                  <BattleCardView
                    key={`${cardId}_${idx}`}
                    card={card}
                    index={idx}
                    selected={selectedCardIdx === idx}
                    disabled={card.cost > player.mp || phase !== 'play'}
                    onSelect={() => {
                      if (phase === 'play') {
                        setSelectedCardIdx(selectedCardIdx === idx ? null : idx);
                      }
                    }}
                    enemyElement={enemy.element}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* 操作按钮 */}
          <div style={s.btnRow}>
            {selectedCardIdx !== null && phase === 'play' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playCard}
                style={{
                  ...s.actionBtn,
                  background: `linear-gradient(135deg, ${ELEMENT_COLORS[getCardById(hand[selectedCardIdx])?.element || 'neutral']}44, rgba(20,5,50,0.9))`,
                  borderColor: ELEMENT_COLORS[getCardById(hand[selectedCardIdx])?.element || 'neutral'],
                }}
              >
                使用卡牌
              </motion.button>
            )}
            {phase === 'play' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endTurn}
                style={{
                  ...s.actionBtn,
                  background: 'linear-gradient(135deg, rgba(80,20,20,0.6), rgba(40,10,10,0.8))',
                  borderColor: 'rgba(255,100,100,0.4)',
                }}
              >
                结束回合
              </motion.button>
            )}
          </div>

          {/* 牌库/弃牌堆计数 */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px',
            fontSize: '12px', color: 'rgba(140,120,200,0.6)',
          }}>
            <span>📚 牌库: {deck.length}</span>
            <span>♻️ 弃牌堆: {discard.length}</span>
          </div>
        </div>
      </ScreenShake>

      {/* ─── 胜利 / 失败画面 ─────────────────────────────────── */}
      <AnimatePresence>
        {battleResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={s.resultOverlay}
          >
            {battleResult === 'victory' ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200, delay: 0.2 }}
                  style={{
                    fontSize: '72px', fontWeight: 900, letterSpacing: '12px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 3s ease infinite',
                    filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.6)) drop-shadow(0 0 80px rgba(255,215,0,0.3))',
                    marginBottom: '16px',
                  }}
                >
                  VICTORY
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    fontSize: '16px', color: 'rgba(255,215,0,0.8)',
                    letterSpacing: '3px', marginBottom: '30px',
                  }}
                >
                  战斗胜利！
                </motion.div>
                {/* 奖励展示 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(40,20,0,0.6), rgba(20,10,0,0.8))',
                    borderRadius: '12px', padding: '16px 28px',
                    border: '1px solid rgba(255,215,0,0.3)', marginBottom: '30px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '14px', color: 'rgba(255,215,0,0.7)', marginBottom: '8px' }}>
                    ★ 奖励 ★
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(200,180,150,0.8)', lineHeight: '1.8' }}>
                    经验值 +{Math.floor(enemyData.maxHP * 1.5)}<br />
                    魔晶 +{Math.floor(enemyData.maxHP * 0.5)}
                  </div>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBattleEnd(true)}
                  style={{
                    padding: '14px 48px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(200,150,0,0.3))',
                    border: '1px solid rgba(255,215,0,0.5)',
                    color: '#FFD700', fontSize: '17px', fontWeight: 700,
                    letterSpacing: '4px', cursor: 'pointer',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    boxShadow: '0 0 20px rgba(255,215,0,0.2)',
                  }}
                >
                  继续
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200, delay: 0.2 }}
                  style={{
                    fontSize: '72px', fontWeight: 900, letterSpacing: '12px',
                    color: '#FF3B30',
                    textShadow: '0 0 40px rgba(255,59,48,0.6), 0 0 80px rgba(255,59,48,0.3)',
                    marginBottom: '16px',
                  }}
                >
                  DEFEAT
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    fontSize: '16px', color: 'rgba(255,100,100,0.8)',
                    letterSpacing: '3px', marginBottom: '30px',
                  }}
                >
                  战斗失败…
                </motion.div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBattleResult(null);
                      setPlayer({ hp: 100, maxHP: 100, mp: 10, maxMP: 10, shield: 0, buffs: [], element: 'light' });
                      setEnemy({ hp: enemyData.maxHP, maxHP: enemyData.maxHP, mp: 10, maxMP: 10, shield: 0, buffs: [], element: enemyData.element as Element });
                      const reshuffled = shuffleArray([...playerCards]);
                      setDeck(reshuffled);
                      setHand([]);
                      setDiscard([]);
                      setTurn(1);
                      setPhase('draw');
                      initializedRef.current = false;
                    }}
                    style={{
                      padding: '14px 36px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(80,20,20,0.5), rgba(40,10,10,0.7))',
                      border: '1px solid rgba(255,100,100,0.4)',
                      color: 'rgba(255,180,180,0.9)', fontSize: '16px', fontWeight: 600,
                      letterSpacing: '3px', cursor: 'pointer',
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}
                  >
                    重新挑战
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBattleEnd(false)}
                    style={{
                      padding: '14px 36px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(40,20,60,0.5), rgba(20,10,40,0.7))',
                      border: '1px solid rgba(160,120,255,0.3)',
                      color: 'rgba(200,180,255,0.9)', fontSize: '16px', fontWeight: 600,
                      letterSpacing: '3px', cursor: 'pointer',
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}
                  >
                    返回
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS 动画 */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
      `}</style>
    </motion.div>
  );
};

export default BattleSystem;
