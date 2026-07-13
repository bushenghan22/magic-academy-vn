import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getBattleCardById, BATTLE_RARITY_COLORS, BATTLE_ELEMENT_COLORS } from '../../systems/store';
import { AudioManager } from '../../systems/audio/AudioManager';
import { CHARACTERS, getSpeakerDisplayName } from '../../data/characters';
import { CHAPTERS } from '../../data/stories';
import { getCharacterSprite, getBackgroundImage } from '../../data/spriteAssets';
import { TransitionEffect } from '../effects/TransitionEffect';
import { ScreenEffects, EFFECT_PRESETS, type ScreenEffectConfig } from '../effects/ScreenEffects';

// ─── Props ─────────────────────────────────────────────────────────────────

interface GameScreenProps {
  onTitle: () => void;
  onSettings: () => void;
  onFlow: () => void;
  onSave: () => void;
}

// ─── 内部扩展类型 ──────────────────────────────────────────────────────────

interface SpriteState {
  characterId: string;
  position: 'left' | 'center' | 'right';
  emotion: string;
  visible: boolean;
  entering: boolean;
  exiting: boolean;
}

interface ExtendedNode {
  id: string;
  chapter: number;
  text: string;
  speaker?: string;
  portrait?: string;
  background?: string;
  music?: string;
  choices?: { id: string; text: string; nextNode: string; conditions?: unknown[]; effects?: unknown[] }[];
  nextNode?: string;
  effects?: unknown[];
  type?: 'dialogue' | 'choice' | 'cutscene' | 'battle' | 'branch' | 'ending';
  emotion?: string;
  characterSprites?: { characterId: string; position: 'left' | 'center' | 'right'; emotion: string }[];
  bgm?: string;
  animation?: string;
  next?: string;
  flags?: Record<string, boolean>;
  enemyId?: string;
}

// ─── 背景预设渐变 ──────────────────────────────────────────────────────────

const BACKGROUND_PRESETS: Record<string, string> = {
  school:
    'linear-gradient(180deg, #1a1040 0%, #2d1b69 30%, #4a2c8a 60%, #1a1040 100%)',
  forest:
    'linear-gradient(180deg, #0a1f0a 0%, #1a3a1a 30%, #2d5a2d 60%, #0a1f0a 100%)',
  library:
    'linear-gradient(180deg, #1a1520 0%, #2a1f35 30%, #3d2d55 60%, #1a1520 100%)',
  dorm:
    'linear-gradient(180deg, #1a1830 0%, #2a2545 30%, #3d3565 60%, #1a1830 100%)',
  classroom:
    'linear-gradient(180deg, #1a2040 0%, #2a3560 30%, #3d4a7a 60%, #1a2040 100%)',
  night_sky:
    'linear-gradient(180deg, #05051a 0%, #0a0a30 30%, #101050 60%, #05051a 100%)',
  garden:
    'linear-gradient(180deg, #0a1a10 0%, #1a3020 30%, #2d4a35 60%, #0a1a10 100%)',
  training:
    'linear-gradient(180deg, #1a1010 0%, #351a1a 30%, #5a2d2d 60%, #1a1010 100%)',
  shrine:
    'linear-gradient(180deg, #1a1520 0%, #301a35 30%, #4a2d50 60%, #1a1520 100%)',
  battle:
    'linear-gradient(180deg, #1a0a0a 0%, #3a1515 30%, #5a2020 60%, #1a0a0a 100%)',
  prologue:
    'linear-gradient(180deg, #0a0a20 0%, #1a1a40 30%, #2a2a60 60%, #0a0a20 100%)',
  festival:
    'linear-gradient(180deg, #1a1030 0%, #3a1a50 30%, #5a2a70 60%, #1a1030 100%)',
  // 章节数据使用的 bg_ 前缀背景
  'bg_city_sunset':
    'linear-gradient(180deg, #2a1508 0%, #4a2510 30%, #6a3518 60%, #2a1508 100%)',
  'bg_starry_sky_bright':
    'linear-gradient(180deg, #050520 0%, #0a0a40 30%, #151560 60%, #050520 100%)',
  'bg_starry_sky':
    'linear-gradient(180deg, #050510 0%, #0a0a25 30%, #101040 60%, #050510 100%)',
  'bg_academy_gate':
    'linear-gradient(180deg, #1a1040 0%, #2d1b60 30%, #4a2c80 60%, #1a1040 100%)',
  'bg_academy_hall':
    'linear-gradient(180deg, #1a1530 0%, #2a2550 30%, #3d3570 60%, #1a1530 100%)',
  'bg_classroom':
    'linear-gradient(180deg, #1a2040 0%, #2a3560 30%, #3d4a7a 60%, #1a2040 100%)',
  'bg_library':
    'linear-gradient(180deg, #1a1520 0%, #2a1f35 30%, #3d2d55 60%, #1a1520 100%)',
  'bg_dormitory':
    'linear-gradient(180deg, #1a1830 0%, #2a2545 30%, #3d3565 60%, #1a1830 100%)',
  'bg_forest':
    'linear-gradient(180deg, #0a1f0a 0%, #1a3a1a 30%, #2d5a2d 60%, #0a1f0a 100%)',
  'bg_forest_deep':
    'linear-gradient(180deg, #051505 0%, #0a2a0a 30%, #154015 60%, #051505 100%)',
  'bg_cafeteria':
    'linear-gradient(180deg, #1a1820 0%, #2a2535 30%, #3d3550 60%, #1a1820 100%)',
  'bg_garden':
    'linear-gradient(180deg, #0a1a10 0%, #1a3020 30%, #2d4a35 60%, #0a1a10 100%)',
  'bg_training_ground':
    'linear-gradient(180deg, #1a1010 0%, #351a1a 30%, #5a2d2d 60%, #1a1010 100%)',
  'bg_night':
    'linear-gradient(180deg, #020208 0%, #050515 30%, #080820 60%, #020208 100%)',
  'bg_rooftop':
    'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #2a2a5a 60%, #0a0a1a 100%)',
  'bg_shrine':
    'linear-gradient(180deg, #1a1520 0%, #301a35 30%, #4a2d50 60%, #1a1520 100%)',
  'bg_corridor':
    'linear-gradient(180deg, #15121a 0%, #251f30 30%, #352d45 60%, #15121a 100%)',
  'bg_auditorium':
    'linear-gradient(180deg, #1a1030 0%, #2a1848 30%, #3a2060 60%, #1a1030 100%)',
  'bg_music_room':
    'linear-gradient(180deg, #151828 0%, #252a48 30%, #353c68 60%, #151828 100%)',
  'bg_lake':
    'linear-gradient(180deg, #051525 0%, #0a2a40 30%, #154055 60%, #051525 100%)',
  'bg_rooftop_garden':
    'linear-gradient(180deg, #0a1a15 0%, #1a3025 30%, #2a4535 60%, #0a1a15 100%)',
  'bg_workshop':
    'linear-gradient(180deg, #1a1208 0%, #2a1d10 30%, #3a2818 60%, #1a1208 100%)',
  'bg_star_tower':
    'linear-gradient(180deg, #0a0a25 0%, #151545 30%, #252565 60%, #0a0a25 100%)',
  default:
    'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #2a2a5a 60%, #0a0a1a 100%)',
};

// ─── 角色颜色映射 ─────────────────────────────────────────────────────────

const CHARACTER_COLORS: Record<string, string> = {
  hoshino_sakura: '#ff6b9d',
  sakura: '#ff6b9d',
  kishima_rin: '#c0c8e8',
  rin: '#c0c8e8',
  kazane_rin: '#a78bfa',
  suzu: '#a78bfa',
  ishigami_aoi: '#4dc9ff',
  aoi: '#4dc9ff',
  amane_yuzu: '#ffaa4d',
  yuzu: '#ffaa4d',
  shiraishi_mashiro: '#e8f0ff',
  mashiro: '#e8f0ff',
  protagonist: '#b090e0',
  '???': '#888888',
  professor_helios: '#FFA500',
  helios: '#FFA500',
  helio: '#FFA500',
  elder_helios: '#FF8C00',
  shadow_king: '#8B008B',
  voice_of_stars: '#FFD700',
  kurosaki_soma: '#FFD23F',
  soma: '#FFD23F',
  shiratori_yuma: '#7EC8E3',
  yuma: '#7EC8E3',
  enomori: '#A0522D',
  旁白: '#a080ff',
  narrator: '#a080ff',
};

// ─── 文字速度映射（毫秒/字符） ─────────────────────────────────────────────

const TEXT_SPEED_MAP: Record<string, number> = {
  slow: 80,
  medium: 40,
  fast: 15,
  instant: 0,
};

// ─── 静态样式对象 ──────────────────────────────────────────────────────────

const STYLES: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    fontFamily: "'Noto Sans SC', 'Cinzel', sans-serif",
    userSelect: 'none',
    cursor: 'pointer',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    transition: 'background 1.2s ease',
    zIndex: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 80%, transparent 40%, rgba(0,0,0,0.5) 100%)',
    zIndex: 1,
  },
  characterLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    pointerEvents: 'none',
  },
  characterSprite: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    transition: 'opacity 0.6s ease',
  },
  characterSpriteInner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  spritePlaceholder: {
    width: '200px',
    height: '380px',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  dialogueLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 40px 30px',
  },
  dialogueBox: {
    width: '100%',
    maxWidth: '1100px',
    minHeight: '180px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.75) 0%, rgba(5,0,25,0.85) 100%)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(120,80,220,0.3)',
    padding: '20px 32px',
    position: 'relative',
    boxShadow: '0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(100,60,200,0.1)',
  },
  speakerTag: {
    position: 'absolute',
    top: '-16px',
    left: '28px',
    padding: '6px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '2px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  dialogueText: {
    fontSize: '18px',
    lineHeight: 1.8,
    color: 'rgba(230,220,255,0.95)',
    marginTop: '8px',
    letterSpacing: '1px',
    minHeight: '80px',
    whiteSpace: 'pre-wrap',
  },
  dialogueAdvanceHint: {
    position: 'absolute',
    bottom: '12px',
    right: '24px',
    fontSize: '12px',
    color: 'rgba(160,140,200,0.5)',
    animation: 'gs-blink 1.2s ease-in-out infinite',
  },
  choiceLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
  },
  choiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '600px',
    width: '90%',
  },
  choiceButton: {
    padding: '18px 32px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.8) 0%, rgba(5,0,25,0.9) 100%)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(120,80,220,0.35)',
    color: 'rgba(220,200,255,0.95)',
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '2px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    fontFamily: "'Noto Sans SC', sans-serif",
    display: 'flex',
    alignItems: 'center',
  },
  hudLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 24px',
    pointerEvents: 'none',
  },
  hudLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pointerEvents: 'auto',
  },
  chapterBadge: {
    padding: '6px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.7) 0%, rgba(5,0,25,0.8) 100%)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(120,80,220,0.25)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(200,180,255,0.8)',
    letterSpacing: '1px',
  },
  hudRight: {
    display: 'flex',
    gap: '10px',
    pointerEvents: 'auto',
  },
  hudButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.7) 0%, rgba(5,0,25,0.8) 100%)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(120,80,220,0.25)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(200,180,255,0.8)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  hudButtonActive: {
    border: '1px solid rgba(255,200,100,0.5)',
    color: '#ffd866',
    boxShadow: '0 0 12px rgba(255,200,60,0.2)',
  },
  affectionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },
  affectionChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '12px',
    color: 'rgba(200,180,255,0.75)',
  },
  battleLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
  },
  battleContainer: {
    width: '90%',
    maxWidth: '1000px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(20,5,5,0.9) 0%, rgba(10,0,0,0.95) 100%)',
    border: '1px solid rgba(200,50,50,0.3)',
    boxShadow: '0 0 60px rgba(200,30,30,0.15)',
  },
  battleTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ff6b6b',
    textAlign: 'center' as const,
    marginBottom: '24px',
    letterSpacing: '4px',
    textShadow: '0 0 20px rgba(255,100,100,0.5)',
  },
  battleHpBar: {
    width: '100%',
    height: '24px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,100,100,0.3)',
    overflow: 'hidden',
    marginBottom: '12px',
    position: 'relative' as const,
  },
  battleHpFill: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.5s ease',
    background: 'linear-gradient(90deg, #ff4444, #ff6b6b)',
  },
  battleHpLabel: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'white',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
  },
  battleActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px',
    flexWrap: 'wrap' as const,
  },
  battleCard: {
    padding: '12px 20px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(40,10,10,0.8) 0%, rgba(20,5,5,0.9) 100%)',
    border: '1px solid rgba(200,100,100,0.3)',
    color: 'rgba(255,200,200,0.9)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
    minWidth: '120px',
    textAlign: 'center' as const,
  },
  cutsceneLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(12px)',
  },
  cutsceneText: {
    maxWidth: '800px',
    textAlign: 'center' as const,
    padding: '40px',
  },
  cutsceneTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: 'rgba(220,200,255,0.95)',
    letterSpacing: '6px',
    marginBottom: '24px',
    textShadow: '0 0 30px rgba(160,120,255,0.4)',
    lineHeight: 1.4,
  },
  cutsceneBody: {
    fontSize: '20px',
    color: 'rgba(200,180,240,0.85)',
    lineHeight: 2,
    letterSpacing: '2px',
  },
  menuOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(12px)',
  },
  menuPanel: {
    width: '380px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(15,5,40,0.9) 0%, rgba(5,0,25,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(120,80,220,0.35)',
    padding: '32px 28px',
    boxShadow: '0 8px 60px rgba(0,0,0,0.5), 0 0 40px rgba(100,60,200,0.1)',
  },
  menuTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'rgba(220,200,255,0.95)',
    textAlign: 'center' as const,
    marginBottom: '28px',
    letterSpacing: '4px',
  },
  menuButton: {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    marginBottom: '10px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(30,10,60,0.6) 0%, rgba(15,5,40,0.8) 100%)',
    border: '1px solid rgba(120,80,220,0.2)',
    color: 'rgba(200,180,255,0.85)',
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'left' as const,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  menuCloseButton: {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    marginTop: '16px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(60,30,0,0.5) 0%, rgba(40,20,0,0.7) 100%)',
    border: '1px solid rgba(255,200,80,0.3)',
    color: '#ffd866',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center' as const,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  transitionOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 40,
    background: 'rgba(0,0,0,1)',
    pointerEvents: 'none',
  },
};

// ─── 工具函数 ─────────────────────────────────────────────────────────────

function getBackgroundStyle(background?: string): { isImage: boolean; value: string } {
  if (!background) return { isImage: false, value: BACKGROUND_PRESETS.default };
  // 优先使用真实背景图片
  const realBg = getBackgroundImage(background);
  if (realBg) return { isImage: true, value: realBg };
  // 回退到CSS渐变
  const key = background.toLowerCase().replace(/[\s_-]/g, '');
  for (const [presetKey, gradient] of Object.entries(BACKGROUND_PRESETS)) {
    if (key.includes(presetKey.replace(/[\s_-]/g, ''))) {
      return { isImage: false, value: gradient };
    }
  }
  return { isImage: false, value: BACKGROUND_PRESETS[background] ?? BACKGROUND_PRESETS.default };
}

function getCharacterColor(speaker?: string): string {
  if (!speaker) return CHARACTER_COLORS['旁白'];
  const key = speaker.toLowerCase();
  for (const [charKey, color] of Object.entries(CHARACTER_COLORS)) {
    if (key.includes(charKey)) return color;
  }
  return CHARACTER_COLORS['旁白'];
}

function getCharacterName(speaker?: string): string {
  if (!speaker) return '旁白';
  if (speaker === 'narrator' || speaker === '旁白') return '旁白';
  if (speaker === 'protagonist' || speaker === 'player') return '你';
  if (speaker === '???') return '???';
  const displayName = getSpeakerDisplayName(speaker);
  if (displayName) return displayName;
  return speaker;
}

function getNodeSpritePosition(
  index: number,
  total: number,
): 'left' | 'center' | 'right' {
  if (total === 1) return 'center';
  if (total === 2) return index === 0 ? 'left' : 'right';
  if (index === 0) return 'left';
  if (index === 1) return 'center';
  return 'right';
}

// ─── 主组件 ────────────────────────────────────────────────────────────────

export const GameScreen: React.FC<GameScreenProps> = React.memo(
  ({ onTitle, onSettings, onFlow, onSave }) => {
    // ── Store ──
    const {
      gameState,
      settings,
      isAutoMode,
      isSkipping,
      isMenuOpen,
      textDisplayProgress,
      advanceDialogue,
      selectChoice,
      setTextProgress,
      setAutoMode,
      setSkipping,
      toggleMenu,
      saveGame,
      autoSave,
      getCurrentNode,
      getAvailableChoices,
      initBattle,
      playCard,
      endTurn,
      getBattleState,
    } = useGameStore();

    // ── 内部状态 ──
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typewriterActive, setTypewriterActive] = useState(false);
    const [sceneTransitioning, setSceneTransitioning] = useState(false);
    const [transitionType, setTransitionType] = useState<'fade' | 'magic-circle' | 'slide' | 'iris' | 'dissolve'>('fade');
    const [battleVisible, setBattleVisible] = useState(false);
    const [cutsceneVisible, setCutsceneVisible] = useState(false);
    const [backlogVisible, setBacklogVisible] = useState(false);
    const [rewardVisible, setRewardVisible] = useState(false);
    const [rewardCards, setRewardCards] = useState<Array<{ id: string; name: string; desc: string; rarity: string; element: string }>>([]);
    const [characterSprites, setCharacterSprites] = useState<SpriteState[]>([]);
    const [screenEffects, setScreenEffects] = useState<ScreenEffectConfig[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastNodeIdRef = useRef<string>('');
    const sceneTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const parallaxLayersRef = useRef<HTMLDivElement[]>([]);

    // ── 派生数据 ──
    const currentNode = getCurrentNode() as ExtendedNode | null;
    const availableChoices = getAvailableChoices();
    const battleState = getBattleState();

    const chapterInfo = useMemo(() => {
      if (!currentNode) return null;
      const currentChapter = currentNode.chapter ?? 1;
      const chapterMeta = CHAPTERS.find(c => c.id === currentChapter);
      if (!chapterMeta) return { chapter: currentChapter, chapterTitle: '', partTitle: '' };
      const part = chapterMeta.parts.find((p) =>
        currentNode.id.startsWith(`ch${currentChapter}_${p.id}`),
      );
      return {
        chapter: currentChapter,
        chapterTitle: chapterMeta.title,
        partTitle: part?.title ?? '',
      };
    }, [currentNode]);

    const isChoiceNode = useMemo(() => {
      return (
        currentNode?.type === 'choice' ||
        (currentNode?.choices && currentNode.choices.length > 0)
      );
    }, [currentNode]);

    const textSpeed = useMemo(() => {
      return TEXT_SPEED_MAP[settings.textSpeed] ?? 40;
    }, [settings.textSpeed]);

    // ── 角色表情数据缓存 ──
    const characterDataMap = useMemo(() => {
      const map: Record<string, { name: string; color: string; emotions: string[] }> = {};
      // 使用 entries 遍历以获取所有ID（包括全名别名）
      Object.entries(CHARACTERS).forEach(([key, char]) => {
        map[key] = {
          name: char.name,
          color: char.element.color,
          emotions: char.emotions,
        };
      });
      return map;
    }, []);

    // ── 感情度数据 ──
    const affectionData = useMemo(() => {
      if (!gameState) return [];
      return Object.entries(gameState.affection)
        .filter(([, val]) => val > 0)
        .map(([charId, val]) => ({
          id: charId,
          name: characterDataMap[charId]?.name ?? charId,
          color: characterDataMap[charId]?.color ?? '#a080ff',
          value: val,
        }))
        .sort((a, b) => b.value - a.value);
    }, [gameState, characterDataMap]);

    // ── 打字机效果 ──
    const startTypewriter = useCallback(
      (text: string) => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }

        if (textSpeed === 0) {
          setDisplayedText(text);
          setTextProgress(1);
          setIsTyping(false);
          setTypewriterActive(true);
          return;
        }

        setDisplayedText('');
        setIsTyping(true);
        setTextProgress(0);
        setTypewriterActive(true);
        let index = 0;

        typingTimerRef.current = setInterval(() => {
          index++;
          const progress = index / text.length;
          setDisplayedText(text.slice(0, index));
          setTextProgress(progress);

          if (index >= text.length) {
            if (typingTimerRef.current) {
              clearInterval(typingTimerRef.current);
              typingTimerRef.current = null;
            }
            setIsTyping(false);
            setTextProgress(1);
          }
        }, textSpeed);
      },
      [textSpeed, setTextProgress],
    );

    const skipTypewriter = useCallback(
      (fullText: string) => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setDisplayedText(fullText);
        setTextProgress(1);
        setIsTyping(false);
        setTypewriterActive(true);
      },
      [setTextProgress],
    );

    // ── 上一个背景（用 ref 避免 handleSceneChange 依赖变化） ──
    const prevBackgroundRef = useRef<string | undefined>();

    // ── 调度受追踪的超时 ──
    const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        sceneTimeoutsRef.current = sceneTimeoutsRef.current.filter((t) => t !== id);
        fn();
      }, ms);
      sceneTimeoutsRef.current.push(id);
      return id;
    }, []);

    // ── 屏幕特效触发 ──
    const triggerEffect = useCallback((effectOrPreset: ScreenEffectConfig | string) => {
      let effects: ScreenEffectConfig[];
      if (typeof effectOrPreset === 'string') {
        effects = EFFECT_PRESETS[effectOrPreset] ?? [{ type: 'flash', intensity: 0.5, duration: 300 }];
      } else {
        effects = [effectOrPreset];
      }
      setScreenEffects((prev) => [...prev, ...effects]);
    }, []);

    const handleEffectComplete = useCallback(() => {
      setScreenEffects((prev) => prev.slice(1));
    }, []);

    // ── 场景切换处理 ──
    const handleSceneChange = useCallback(
      (node: ExtendedNode) => {
        const bgChanged =
          node.background && node.background !== prevBackgroundRef.current;

        if (bgChanged) {
          const transitionTypes: Array<'fade' | 'magic-circle' | 'slide' | 'iris' | 'dissolve'> = ['fade', 'magic-circle', 'slide', 'iris', 'dissolve'];
          setTransitionType(transitionTypes[Math.floor(Math.random() * transitionTypes.length)]);
          setSceneTransitioning(true);
          scheduleTimeout(() => {
            prevBackgroundRef.current = node.background;
            setSceneTransitioning(false);
          }, 600);
        }

        const shouldHideSprite = (id: string) => {
          const hiddenIds = ['protagonist', 'narrator', '旁白', '???'];
          return hiddenIds.includes(id?.toLowerCase());
        };

        // 角色精灵更新
        if (node.characterSprites && node.characterSprites.length > 0) {
          const visibleSprites = node.characterSprites.filter(s => !shouldHideSprite(s.characterId));
          if (visibleSprites.length > 0) {
            const newSprites: SpriteState[] = visibleSprites.map(
              (s, i) => ({
                characterId: s.characterId,
                position: s.position ?? getNodeSpritePosition(i, visibleSprites.length),
                emotion: s.emotion ?? 'neutral',
                visible: true,
                entering: true,
                exiting: false,
              }),
            );
            setCharacterSprites(newSprites);
            scheduleTimeout(() => {
              setCharacterSprites((prev) =>
                prev.map((s) => ({ ...s, entering: false })),
              );
            }, 600);
          } else {
            setCharacterSprites((prev) =>
              prev.map((s) => ({ ...s, exiting: true })),
            );
            scheduleTimeout(() => setCharacterSprites([]), 600);
          }
        } else if (node.speaker && !shouldHideSprite(node.speaker)) {
          const spritePos = getNodeSpritePosition(0, 1);
          setCharacterSprites([
            {
              characterId: node.speaker,
              position: spritePos,
              emotion: node.emotion ?? 'neutral',
              visible: true,
              entering: true,
              exiting: false,
            },
          ]);
          scheduleTimeout(() => {
            setCharacterSprites((prev) =>
              prev.map((s) => ({ ...s, entering: false })),
            );
          }, 600);
        } else {
          setCharacterSprites((prev) =>
            prev.map((s) => ({ ...s, exiting: true })),
          );
          scheduleTimeout(() => setCharacterSprites([]), 600);
        }

        // BGM 切换
        const bgm = node.bgm ?? node.music;
        if (bgm) {
          const audio = AudioManager.getInstance();
          audio.playBGM(bgm as 'title_bgm' | 'school_bgm' | 'battle_bgm' | 'emotional_bgm' | 'tension_bgm');
          // 自动解锁BGM到鉴赏模式
          useGameStore.getState().unlockBgm(bgm);
        }

        // 处理节点动画特效
        if (node.animation) {
          const animPresets: Record<string, string> = {
            'shake': 'hit_light',
            'flash': 'flash',
            'critical': 'critical_hit',
            'magic': 'magic_cast',
            'heal': 'heal',
            'shadow': 'shadow_appear',
            'danger': 'danger',
            'awakening': 'awakening',
            'romantic': 'romantic',
            'boss': 'boss_appear',
            'death': 'death',
            'victory': 'victory',
            'darken': 'darken',
          };
          const preset = animPresets[node.animation] || node.animation;
          triggerEffect(preset);
        }

        // 检查节点类型
        if (node.type === 'battle') {
          setBattleVisible(true);
          initBattle(node.enemyId ?? 'shadow_wolf');
          AudioManager.getInstance().playSFX('battle_start');
          triggerEffect('hit_heavy');
          return;
        }

        if (node.type === 'cutscene') {
          setCutsceneVisible(true);
          return;
        }

        // 启动打字机
        if (node.text) {
          startTypewriter(node.text);
        }
      },
      [startTypewriter, initBattle, scheduleTimeout, triggerEffect],
    );

    // ── 节点变化效果 ──
    useEffect(() => {
      if (!currentNode || !gameState) return;
      if (currentNode.id === lastNodeIdRef.current) return;
      lastNodeIdRef.current = currentNode.id;

      handleSceneChange(currentNode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNode?.id]);

    // ── 战斗结束处理 ──
    useEffect(() => {
      if (battleVisible && !battleState) {
        setBattleVisible(false);
        if (gameState?.currentEndingId) return;
        const rewards = gameState?.lastBattleRewards ?? [];
        if (rewards.length > 0) {
          const cardData = rewards.map(id => {
            const c = getBattleCardById(id);
            return c ? { id, name: c.name, desc: c.effect || c.description, rarity: c.rarity, element: c.element } : { id, name: id, desc: '', rarity: 'common', element: 'neutral' };
          });
          setRewardCards(cardData);
          setRewardVisible(true);
          AudioManager.getInstance().playSFX('unlock');
        } else {
          const timer = setTimeout(() => {
            advanceDialogue();
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    }, [battleState, battleVisible, advanceDialogue, gameState?.currentEndingId, gameState?.lastBattleRewards]);

    const closeRewardOverlay = useCallback(() => {
      setRewardVisible(false);
      setRewardCards([]);
      setTimeout(() => advanceDialogue(), 100);
    }, [advanceDialogue]);

    // ── 自动模式定时器 ──
    useEffect(() => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }

      if (isAutoMode && !isTyping && textDisplayProgress >= 1 && !isChoiceNode) {
        autoTimerRef.current = setTimeout(() => {
          advanceDialogue();
        }, settings.autoSpeed);
      }

      return () => {
        if (autoTimerRef.current) {
          clearTimeout(autoTimerRef.current);
          autoTimerRef.current = null;
        }
      };
    }, [isAutoMode, isTyping, textDisplayProgress, isChoiceNode, settings.autoSpeed, advanceDialogue]);

    // ── 快进模式处理 ──
    useEffect(() => {
      if (!isSkipping) return;
      // 遇到选择节点自动暂停
      if (isChoiceNode) {
        setSkipping(false);
        return;
      }
      // 如果设置了"仅跳过已读"且当前节点未读，则暂停
      if (settings.skipRead && currentNode && gameState && !gameState.readNodes.includes(currentNode.id)) {
        setSkipping(false);
        return;
      }
      if (isTyping) {
        if (currentNode?.text) skipTypewriter(currentNode.text);
      } else if (textDisplayProgress >= 1) {
        const timer = setTimeout(() => advanceDialogue(), settings.skipSpeed ?? 50);
        return () => clearTimeout(timer);
      }
    }, [isSkipping, isTyping, isChoiceNode, textDisplayProgress, advanceDialogue, currentNode?.id, currentNode?.text, currentNode, skipTypewriter, gameState, settings.skipRead, settings.skipSpeed, setSkipping]);

    // ── 组件卸载时清理所有定时器 ──
    useEffect(() => {
      return () => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        if (autoTimerRef.current) {
          clearTimeout(autoTimerRef.current);
          autoTimerRef.current = null;
        }
        sceneTimeoutsRef.current.forEach((id) => clearTimeout(id));
        sceneTimeoutsRef.current = [];
      };
    }, []);

    // ── 鼠标视差效果（直接DOM操作，不触发重渲染）──
    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        const layers = parallaxLayersRef.current;
        // 层0: 远景光斑 (0.3x)
        if (layers[0]) layers[0].style.transform = `translate(${x * 2.4}px, ${y * 1.5}px)`;
        // 层1: 主背景 (1x)
        if (layers[1]) layers[1].style.transform = layers[1].dataset.isImage === 'true'
          ? `translate(${x * 8}px, ${y * 5}px)`
          : `translate(${x * 8}px, ${y * 5}px) scale(1.05)`;
        // 层2: 前景微粒 (1.5x)
        if (layers[2]) layers[2].style.transform = `translate(${x * 12}px, ${y * 7.5}px)`;
      },
      [],
    );

    // ── 键盘事件处理 ──
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (rewardVisible) {
          if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            closeRewardOverlay();
          }
          return;
        }
        switch (e.key) {
          case ' ':
          case 'Enter': {
            e.preventDefault();
            if (isMenuOpen) return;
            if (backlogVisible) {
              setBacklogVisible(false);
              AudioManager.getInstance().playSFX('click');
              return;
            }
            if (battleVisible || cutsceneVisible) return;
            if (isChoiceNode) return;
            if (isTyping) {
              if (currentNode?.text) skipTypewriter(currentNode.text);
              AudioManager.getInstance().playSFX('text_advance');
            } else if (textDisplayProgress >= 1) {
              advanceDialogue();
              AudioManager.getInstance().playSFX('text_advance');
            }
            break;
          }
          case 'Escape': {
            e.preventDefault();
            if (backlogVisible) {
              setBacklogVisible(false);
              AudioManager.getInstance().playSFX('click');
              return;
            }
            toggleMenu();
            AudioManager.getInstance().playSFX('click');
            break;
          }
          case 'a':
          case 'A': {
            if (!e.ctrlKey && !e.altKey) {
              setAutoMode(!isAutoMode);
              AudioManager.getInstance().playSFX('click');
            }
            break;
          }
          case 's':
          case 'S': {
            if (!e.ctrlKey && !e.altKey) {
              setSkipping(!isSkipping);
              AudioManager.getInstance().playSFX('click');
            }
            break;
          }
          case 'l':
          case 'L':
          case 'PageUp': {
            if (!e.ctrlKey && !e.altKey && !battleVisible && !cutsceneVisible && !isMenuOpen) {
              setBacklogVisible((v) => !v);
              AudioManager.getInstance().playSFX('click');
            }
            break;
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
      isMenuOpen,
      battleVisible,
      cutsceneVisible,
      backlogVisible,
      rewardVisible,
      isChoiceNode,
      isTyping,
      textDisplayProgress,
      isAutoMode,
      isSkipping,
      currentNode,
      advanceDialogue,
      toggleMenu,
      setAutoMode,
      setSkipping,
      skipTypewriter,
      closeRewardOverlay,
    ]);

    // ── 点击推进对话 ──
    const handleScreenClick = useCallback(
      (e: React.MouseEvent) => {
        if (isMenuOpen || battleVisible || cutsceneVisible || backlogVisible || rewardVisible) return;
        if (isChoiceNode) return;

        // 如果正在打字，跳到末尾
        if (isTyping) {
          if (currentNode?.text) skipTypewriter(currentNode.text);
          AudioManager.getInstance().playSFX('text_advance');
          return;
        }

        // 推进对话
        if (textDisplayProgress >= 1) {
          advanceDialogue();
          AudioManager.getInstance().playSFX('text_advance');
        }
      },
      [
        isMenuOpen,
        battleVisible,
        cutsceneVisible,
        backlogVisible,
        rewardVisible,
        isChoiceNode,
        isTyping,
        textDisplayProgress,
        currentNode,
        skipTypewriter,
        advanceDialogue,
      ],
    );

    // ── 选择处理 ──
    const handleChoiceSelect = useCallback(
      (choiceId: string) => {
        selectChoice(choiceId);
        AudioManager.getInstance().playSFX('choice_select');
        autoSave();
      },
      [selectChoice, autoSave],
    );

    // ── 菜单动作 ──
    const handleMenuSave = useCallback(() => {
      saveGame(0);
      AudioManager.getInstance().playSFX('click');
    }, [saveGame]);

    const handleMenuSettings = useCallback(() => {
      toggleMenu();
      onSettings();
      AudioManager.getInstance().playSFX('click');
    }, [toggleMenu, onSettings]);

    const handleMenuTitle = useCallback(() => {
      toggleMenu();
      onTitle();
      AudioManager.getInstance().playSFX('click');
    }, [toggleMenu, onTitle]);

    // ── 战斗动作 ──
    const handleBattleCard = useCallback(
      (cardId: string) => {
        playCard(cardId);
        AudioManager.getInstance().playSFX('card_play');
      },
      [playCard],
    );

    const handleBattleEndTurn = useCallback(() => {
      endTurn();
      AudioManager.getInstance().playSFX('hit');
    }, [endTurn]);

    // ── 过场点击 ──
    const handleCutsceneClick = useCallback(() => {
      if (cutsceneVisible) {
        setCutsceneVisible(false);
        advanceDialogue();
      }
    }, [cutsceneVisible, advanceDialogue]);

    // ── 渲染前检查 ──
    if (!gameState || !currentNode) {
      return (
        <div style={STYLES.container}>
          <div
            style={{
              ...STYLES.backgroundLayer,
              background: BACKGROUND_PRESETS.default,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgba(200,180,255,0.6)',
              fontSize: '18px',
              zIndex: 10,
              position: 'relative',
            }}
          >
            正在加载...
          </div>
        </div>
      );
    }

    // ── 当前背景样式 ──
    const currentBg = getBackgroundStyle(currentNode.background);
    const speakerColor = getCharacterColor(currentNode.speaker);
    const speakerName = getCharacterName(currentNode.speaker);

    return (
      <>
        {/* 注意: 所有CSS动画和hover样式已移至 animations.css（gs-* 前缀） */}

        <div
          ref={containerRef}
          style={STYLES.container}
          onClick={handleScreenClick}
          onMouseMove={handleMouseMove}
        >
          {/* ═══ 层 0：远景视差光斑（主背景之上，0.3x 位移）═══ */}
          <div
            ref={el => { parallaxLayersRef.current[0] = el as HTMLDivElement; }}
            style={{
              position: 'absolute',
              inset: '-5%',
              zIndex: 1,
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            <div style={{
              position: 'absolute', top: '15%', left: '20%',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(160,120,255,0.06) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'driftSlow 18s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', top: '60%', left: '70%',
              width: '240px', height: '240px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(100,180,255,0.05) 0%, transparent 70%)',
              filter: 'blur(35px)',
              animation: 'driftSlow 22s ease-in-out infinite reverse',
            }} />
            <div style={{
              position: 'absolute', top: '40%', left: '85%',
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,160,200,0.04) 0%, transparent 70%)',
              filter: 'blur(30px)',
              animation: 'driftSlow 15s ease-in-out infinite 3s',
            }} />
          </div>

          {/* ═══ 层 1：主背景层（1x 位移）═══ */}
          {currentBg.isImage ? (
            <img
              ref={el => { parallaxLayersRef.current[1] = el as HTMLImageElement; }}
              src={currentBg.value}
              alt="background"
              data-is-image="true"
              style={{
                position: 'absolute', top: 0, left: 0, width: '110%', height: '110%',
                objectFit: 'cover', objectPosition: 'center',
                transition: 'opacity 0.6s ease',
                willChange: 'transform',
              }}
            />
          ) : (
            <div
              ref={el => { parallaxLayersRef.current[1] = el as HTMLDivElement; }}
              style={{
                ...STYLES.backgroundLayer,
                background: currentBg.value,
                willChange: 'transform',
              }}
            />
          )}
          <div style={STYLES.backgroundOverlay} />

          {/* ═══ 层 1.5：前景暗角 + 微粒（1.5x 位移，最近层）═══ */}
          <div
            ref={el => { parallaxLayersRef.current[2] = el as HTMLDivElement; }}
            style={{
              position: 'absolute',
              inset: '-3%',
              zIndex: 2,
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            <div style={{
              position: 'absolute', top: '10%', left: '15%',
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'rgba(200,180,255,0.3)',
              boxShadow: '0 0 6px rgba(160,120,255,0.4)',
              animation: 'dustFloat 8s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', top: '30%', left: '80%',
              width: '3px', height: '3px', borderRadius: '50%',
              background: 'rgba(180,200,255,0.25)',
              boxShadow: '0 0 5px rgba(100,180,255,0.3)',
              animation: 'dustFloat 10s ease-in-out infinite 2s',
            }} />
            <div style={{
              position: 'absolute', top: '70%', left: '40%',
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'rgba(255,200,220,0.2)',
              boxShadow: '0 0 7px rgba(255,160,200,0.3)',
              animation: 'dustFloat 12s ease-in-out infinite 1s',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '60%',
              width: '3px', height: '3px', borderRadius: '50%',
              background: 'rgba(200,220,255,0.2)',
              boxShadow: '0 0 4px rgba(160,180,255,0.25)',
              animation: 'dustFloat 9s ease-in-out infinite 4s',
            }} />
          </div>

          {/* 场景切换转场 */}
          {sceneTransitioning && (
            <TransitionEffect isActive={sceneTransitioning} type={transitionType} />
          )}

          {/* 屏幕特效（震动/闪光/色差等） */}
          <ScreenEffects effects={screenEffects} onComplete={handleEffectComplete} />

          {/* ═══ 层 2：角色精灵层 ═══ */}
          <div style={STYLES.characterLayer}>
            {characterSprites.map((sprite) => {
              const charInfo = characterDataMap[sprite.characterId];
              const charColor = charInfo?.color ?? speakerColor;
              const posStyle = getPositionStyle(sprite.position);
              const animStyle = getSpriteAnimStyle(
                sprite.entering,
                sprite.exiting,
                sprite.position,
              );

              // 获取角色立绘图片
              const spriteImage = getCharacterSprite(sprite.characterId);
              const spriteCount = characterSprites.filter(s => s.visible).length;
              const spriteWidth = spriteCount <= 2 ? '35%' : spriteCount <= 3 ? '28%' : spriteCount <= 4 ? '23%' : '18%';
              const spriteMaxW = spriteCount <= 2 ? '420px' : spriteCount <= 3 ? '320px' : spriteCount <= 4 ? '280px' : '220px';

              return (
                <div
                  key={`${sprite.characterId}-${sprite.position}`}
                  style={{
                    ...STYLES.characterSprite,
                    ...posStyle,
                    width: spriteWidth,
                    height: '85%',
                    maxWidth: spriteMaxW,
                    opacity: sprite.visible ? 1 : 0,
                  }}
                >
                  <div
                    style={{
                      ...STYLES.characterSpriteInner,
                      ...(!sprite.entering && !sprite.exiting ? { animation: 'spriteIdleBase 4.8s ease-in-out infinite' } : {}),
                      ...animStyle,
                    }}
                  >
                    {spriteImage ? (
                      <img
                        src={spriteImage}
                        alt={charInfo?.name ?? sprite.characterId}
                        style={{
                          width: 'auto',
                          height: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          objectPosition: 'bottom center',
                          filter: sprite.emotion === 'angry' ? 'brightness(1.1) saturate(1.2)' :
                                  sprite.emotion === 'sad' ? 'brightness(0.9) saturate(0.8)' :
                                  'none',
                          transition: 'filter 0.3s ease',
                          ...(!sprite.entering && !sprite.exiting ? { animation: 'spriteBreathe 4.2s ease-in-out infinite, spriteBlink 5s ease-in-out infinite', transformOrigin: 'center top' } : {}),
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          ...STYLES.spritePlaceholder,
                          background: `linear-gradient(180deg, ${charColor}22 0%, ${charColor}08 100%)`,
                          borderColor: `${charColor}33`,
                          color: charColor,
                        }}
                      >
                        <span style={{ fontSize: '36px' }}>
                          {getEmotionEmoji(sprite.emotion)}
                        </span>
                        <span style={{ fontSize: '13px', opacity: 0.7 }}>
                          {charInfo?.name ?? sprite.characterId}
                        </span>
                        <span style={{ fontSize: '11px', opacity: 0.4, fontStyle: 'italic' }}>
                          {sprite.emotion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ 层 3：对话/选择提示层 ═══ */}
          {!battleVisible && !cutsceneVisible && (
            <div style={STYLES.dialogueLayer}>
              <div
                style={{
                  ...STYLES.dialogueBox,
                  animation: isChoiceNode ? 'none' : 'gs-glowPulse 3s ease-in-out infinite',
                  borderColor: isChoiceNode ? 'rgba(255,200,100,0.35)' : 'rgba(120,80,220,0.3)',
                  boxShadow: isChoiceNode
                    ? '0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(255,200,60,0.1)'
                    : '0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(100,60,200,0.1)',
                }}
              >
                {/* 说话者标签 */}
                {currentNode.speaker && (
                  <motion.div
                    style={{
                      ...STYLES.speakerTag,
                      background: `linear-gradient(135deg, ${speakerColor}33 0%, ${speakerColor}18 100%)`,
                      color: speakerColor,
                      borderColor: `${speakerColor}44`,
                      boxShadow: `0 0 18px ${speakerColor}44, inset 0 0 12px ${speakerColor}18`,
                    }}
                    animate={{
                      opacity: [0.9, 1, 0.9],
                      y: [0, -1, 0],
                    }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {speakerName}
                  </motion.div>
                )}

                {/* 情绪标签 */}
                {currentNode.emotion && currentNode.emotion !== 'neutral' && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '16px',
                      fontSize: '12px',
                      color: 'rgba(160, 140, 200, 0.7)',
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: '1px',
                      textTransform: 'uppercase' as const,
                    }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {currentNode.emotion}
                  </motion.div>
                )}

                {/* 对话/选择提示文本 */}
                <div style={{
                  ...STYLES.dialogueText,
                  color: isChoiceNode ? 'rgba(255,230,180,0.95)' : 'rgba(230,220,255,0.95)',
                }}>
                  {isChoiceNode ? currentNode.text : (typewriterActive ? displayedText : '')}
                </div>

                {/* 选择提示 */}
                {isChoiceNode && availableChoices.length > 0 && (
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255,200,100,0.6)',
                    marginTop: '8px',
                    textAlign: 'center',
                    letterSpacing: '2px',
                  }}>
                    ── 请选择你的行动 ──
                  </div>
                )}

                {/* 推进提示（非选择节点） */}
                {!isChoiceNode && !isTyping && textDisplayProgress >= 1 && !isAutoMode && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '24px',
                      fontSize: '12px',
                      color: 'rgba(160,140,200,0.5)',
                      animation: 'gs-blink 1.2s ease-in-out infinite',
                    }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ▼ 点击继续
                  </motion.div>
                )}

                {/* 自动模式指示 */}
                {isAutoMode && (
                  <div
                    style={{
                      ...STYLES.dialogueAdvanceHint,
                      color: 'rgba(255,200,100,0.5)',
                    }}
                  >
                    AUTO
                  </div>
                )}

                {/* 完成光带扫过 */}
                {!isChoiceNode && !isTyping && textDisplayProgress >= 1 && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${speakerColor}66, transparent)`,
                      pointerEvents: 'none',
                    }}
                    initial={{ translateX: '-100%' }}
                    animate={{ translateX: '100%' }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ═══ 层 4：选择按钮层 ═══ */}
          {isChoiceNode && availableChoices.length > 0 && (
            <div style={{
              ...STYLES.choiceLayer,
              alignItems: 'flex-end',
              paddingBottom: '230px',
              background: 'transparent',
              backdropFilter: 'none',
            }}>
              <div style={STYLES.choiceContainer}>
                {availableChoices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    className="choice-btn"
                    style={{
                      ...STYLES.choiceButton,
                      animation: `gs-choiceFadeIn 0.5s ease ${idx * 0.12}s both`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoiceSelect(choice.id);
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, rgba(255,200,100,0.25), rgba(255,160,60,0.12))`,
                        border: `1px solid rgba(255,200,100,0.4)`,
                        textAlign: 'center',
                        lineHeight: '28px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#ffd866',
                        marginRight: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 层 5：HUD 层 ═══ */}
          <div style={STYLES.hudLayer}>
            {/* 左上角：章节信息 & 好感度 */}
            <div style={STYLES.hudLeft}>
              {chapterInfo && (
                <div style={STYLES.chapterBadge}>
                  第{chapterInfo.chapter}章
                  {chapterInfo.partTitle && ` · ${chapterInfo.partTitle}`}
                </div>
              )}
              {affectionData.length > 0 && (
                <div style={STYLES.affectionRow}>
                  {affectionData.slice(0, 4).map((char) => (
                    <div key={char.id} style={STYLES.affectionChip}>
                      <span
                        style={{
                          animation: 'gs-heartPulse 2s ease-in-out infinite',
                          fontSize: '11px',
                        }}
                      >
                        ♥
                      </span>
                      <span style={{ color: char.color, fontWeight: 700 }}>
                        {char.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右上角：功能按钮 */}
            <div style={STYLES.hudRight}>
              <button
                className="hud-btn"
                style={{
                  ...STYLES.hudButton,
                  ...(isAutoMode ? STYLES.hudButtonActive : {}),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoMode(!isAutoMode);
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                {isAutoMode ? 'AUTO ●' : 'AUTO'}
              </button>
              <button
                className="hud-btn"
                style={{
                  ...STYLES.hudButton,
                  ...(isSkipping ? STYLES.hudButtonActive : {}),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSkipping(!isSkipping);
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                {isSkipping ? 'SKIP ●' : 'SKIP'}
              </button>
              <button
                className="hud-btn"
                style={{
                  ...STYLES.hudButton,
                  ...(backlogVisible ? STYLES.hudButtonActive : {}),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBacklogVisible(!backlogVisible);
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                LOG
              </button>
              <button
                className="hud-btn"
                style={STYLES.hudButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuSave();
                }}
              >
                快存
              </button>
              <button
                className="hud-btn"
                style={STYLES.hudButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                ☰ 菜单
              </button>
            </div>
          </div>

          {/* ═══ 层 6：战斗层 ═══ */}
          {battleVisible && battleState && (
            <div
              style={{
                ...STYLES.battleLayer,
                animation: 'gs-battleEnter 0.4s ease',
                background: 'rgba(0,0,0,0.9)',
              }}
            >
              <div style={{
                ...STYLES.battleContainer,
                width: '95%', maxWidth: '900px', padding: '28px 32px',
                background: 'linear-gradient(135deg, rgba(15,5,25,0.95) 0%, rgba(5,0,15,0.98) 100%)',
                border: '1px solid rgba(120,60,200,0.3)',
                boxShadow: '0 0 60px rgba(100,30,180,0.2)',
              }}>
                <div style={{
                  fontSize: '24px', fontWeight: 700,
                  color: '#c084fc', textAlign: 'center' as const,
                  marginBottom: '16px', letterSpacing: '4px',
                  textShadow: '0 0 20px rgba(160,80,255,0.5)',
                }}>⚔ 战斗 ⚔</div>

                {/* 回合+连击 */}
                <div style={{ textAlign: 'center', marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(160,140,220,0.7)' }}>
                    第 {battleState.turn} 回合
                  </span>
                  {battleState.combo > 0 && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{ fontSize: '13px', fontWeight: 700, color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.6)' }}
                    >
                      🔥 {battleState.combo}连击
                    </motion.span>
                  )}
                </div>

                {/* 敌人区域 */}
                <div style={{ marginBottom: '16px', position: 'relative' as const }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '36px', filter: battleState.enemy.enraged ? 'drop-shadow(0 0 15px #ff0000)' : 'drop-shadow(0 0 8px rgba(120,0,200,0.5))' }}>
                      {battleState.enemy.sprite || '👹'}
                    </span>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#ff8888', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {battleState.enemy.name}
                        {battleState.enemy.enraged && (
                          <span style={{ fontSize: '11px', color: '#FF4444', background: 'rgba(255,0,0,0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,0,0,0.4)' }}>
                            ⚠狂暴
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,150,150,0.6)' }}>
                        {battleState.enemy.element === 'dark' ? '🌑暗属性' : battleState.enemy.element === 'fire' ? '🔥火属性' : battleState.enemy.element === 'ice' ? '❄️冰属性' : '◇属性'}
                      </div>
                    </div>
                  </div>
                  {battleState.enemy.shield > 0 && (
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#6BB5FF', marginBottom: '4px' }}>
                      🛡 护盾: {battleState.enemy.shield}
                    </div>
                  )}
                  <div style={{
                    ...STYLES.battleHpBar, border: '1px solid rgba(200,50,50,0.4)',
                    background: 'rgba(40,0,0,0.5)',
                  }}>
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: `${(battleState.enemy.hp / battleState.enemy.maxHp) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      style={{
                        height: '100%', borderRadius: '12px',
                        background: battleState.enemy.enraged
                          ? 'linear-gradient(90deg, #ff0000, #ff4400)'
                          : 'linear-gradient(90deg, #cc2222, #ff4444)',
                        boxShadow: battleState.enemy.enraged ? '0 0 12px rgba(255,0,0,0.5)' : 'none',
                      }}
                    />
                    <div style={STYLES.battleHpLabel}>
                      {battleState.enemy.hp} / {battleState.enemy.maxHp}
                    </div>
                  </div>
                  {/* 伤害弹出 */}
                  <AnimatePresence>
                    {battleState.damagePopup?.target === 'enemy' && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -80, scale: 0.8 }}
                        transition={{ duration: 0.8 }}
                        style={{
                          position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                          fontSize: battleState.damagePopup.type === 'crit' ? '32px' : '24px',
                          fontWeight: 900, pointerEvents: 'none',
                          color: battleState.damagePopup.type === 'crit' ? '#FFD700'
                            : battleState.damagePopup.type === 'weak' ? '#8888FF'
                            : battleState.damagePopup.type === 'shield' ? '#6BB5FF'
                            : '#FF4444',
                          textShadow: `0 0 15px currentColor`,
                        }}
                      >
                        {battleState.damagePopup.type === 'crit' && '💥'}-{battleState.damagePopup.value}
                        {battleState.damagePopup.type === 'damage' && `-${battleState.damagePopup.value}`}
                        {battleState.damagePopup.type === 'weak' && `-${battleState.damagePopup.value}…`}
                        {battleState.damagePopup.type === 'shield' && `🛡+${battleState.damagePopup.value}`}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 玩家区域 */}
                <div style={{ marginBottom: '12px', position: 'relative' as const }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(200,200,255,0.8)', textAlign: 'center' as const, marginBottom: '6px' }}>
                    ✨魔法学徒 · 💎能量 {battleState.playerEnergy}/{battleState.playerMaxEnergy}
                    {battleState.playerShield > 0 && <span style={{ color: '#6BB5FF', marginLeft: '8px' }}>🛡{battleState.playerShield}</span>}
                  </div>
                  <div style={{
                    ...STYLES.battleHpBar, border: '1px solid rgba(100,150,255,0.3)',
                    background: 'rgba(0,10,40,0.5)',
                  }}>
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: `${(battleState.playerHp / battleState.playerMaxHp) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      style={{
                        height: '100%', borderRadius: '12px',
                        background: battleState.playerHp < 30
                          ? 'linear-gradient(90deg, #ff4444, #ff6666)'
                          : 'linear-gradient(90deg, #4488ff, #66ccff)',
                      }}
                    />
                    <div style={STYLES.battleHpLabel}>
                      {battleState.playerHp} / {battleState.playerMaxHp}
                    </div>
                  </div>
                  <AnimatePresence>
                    {battleState.damagePopup?.target === 'player' && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -80, scale: 0.8 }}
                        transition={{ duration: 0.8 }}
                        style={{
                          position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                          fontSize: battleState.damagePopup.type === 'crit' ? '30px' : '22px',
                          fontWeight: 900, pointerEvents: 'none',
                          color: battleState.damagePopup.type === 'heal' ? '#6BFF8B'
                            : battleState.damagePopup.type === 'shield' ? '#6BB5FF'
                            : battleState.damagePopup.type === 'crit' ? '#FF4444'
                            : '#FF6666',
                          textShadow: `0 0 15px currentColor`,
                        }}
                      >
                        {battleState.damagePopup.type === 'heal' && `+${battleState.damagePopup.value}💚`}
                        {battleState.damagePopup.type === 'shield' && `🛡+${battleState.damagePopup.value}`}
                        {(battleState.damagePopup.type === 'damage' || battleState.damagePopup.type === 'crit') && `-${battleState.damagePopup.value}`}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 敌人意图 */}
                <div style={{
                  textAlign: 'center', marginBottom: '12px', fontSize: '13px',
                  color: 'rgba(255,180,180,0.7)', padding: '6px 16px',
                  background: 'rgba(60,10,10,0.4)', borderRadius: '8px', display: 'inline-block',
                  position: 'relative' as const, left: '50%', transform: 'translateX(-50%)',
                }}>
                  {battleState.isPlayerTurn ? '👁 预告：' : '⚔ 敌方行动：'}
                  {battleState.enemy.intent === 'attack'
                    ? `⚔攻击 (${battleState.enemy.intentValue})`
                    : battleState.enemy.intent === 'defend'
                      ? `🛡防御 (+${battleState.enemy.intentValue}护盾)`
                      : battleState.enemy.intent === 'buff'
                        ? `⬆蓄力 (攻击+${battleState.enemy.intentValue})`
                        : `💥特殊攻击 (${battleState.enemy.intentValue})`}
                </div>

                {/* 手牌区域 */}
                <div style={{ ...STYLES.battleActions, marginTop: '12px' }}>
                  {battleState.hand.map((card) => {
                    const cardColor = card.element === 'fire' ? '#FF6B35'
                      : card.element === 'ice' ? '#5BC0EB'
                      : card.element === 'water' ? '#3B82F6'
                      : card.element === 'wind' ? '#90EE90'
                      : card.element === 'earth' ? '#DAA520'
                      : card.element === 'lightning' ? '#FFD700'
                      : card.element === 'light' ? '#FFFAF0'
                      : card.element === 'dark' ? '#9B59B6'
                      : '#A0A0A0';
                    const canPlay = card.cost <= battleState.playerEnergy && battleState.isPlayerTurn;
                    const rarityGlow = card.rarity === 'legendary'
                      ? `0 0 15px ${cardColor}AA, 0 0 30px ${cardColor}55`
                      : card.rarity === 'rare'
                        ? `0 0 10px ${cardColor}66`
                        : canPlay ? `0 0 8px ${cardColor}33` : 'none';
                    const rarityBorder = card.rarity === 'legendary'
                      ? `2px solid ${cardColor}`
                      : card.rarity === 'rare'
                        ? `1.5px solid ${cardColor}99`
                        : `1px solid ${cardColor}66`;
                    return (
                      <button
                        key={card.id}
                        className="battle-card-btn"
                        style={{
                          ...STYLES.battleCard,
                          minWidth: '100px', padding: '10px 14px',
                          background: card.rarity === 'legendary'
                            ? `linear-gradient(160deg, ${cardColor}44, rgba(20,10,40,0.95))`
                            : `linear-gradient(160deg, ${cardColor}22, rgba(10,5,20,0.9))`,
                          border: rarityBorder,
                          opacity: canPlay ? 1 : 0.4,
                          cursor: canPlay ? 'pointer' : 'not-allowed',
                          boxShadow: rarityGlow,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canPlay) handleBattleCard(card.id);
                        }}
                        disabled={!canPlay}
                      >
                        <div style={{ fontSize: '12px', marginBottom: '2px', color: cardColor, fontWeight: card.rarity === 'legendary' ? 800 : 600 }}>
                          {card.element === 'fire' ? '🔥' : card.element === 'ice' ? '❄️' : card.element === 'water' ? '💧' : card.element === 'wind' ? '🌪️' : card.element === 'earth' ? '🪨' : card.element === 'lightning' ? '⚡' : card.element === 'light' ? '✨' : card.element === 'dark' ? '🌑' : '◇'}
                          {' '}{card.name}{card.rarity === 'legendary' && ' ★'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(200,180,255,0.5)' }}>
                          💎{card.cost}
                          {card.damage > 0 && ` · ⚔${card.damage}`}
                          {card.shield > 0 && ` · 🛡${card.shield}`}
                          {card.heal > 0 && ` · 💚${card.heal}`}
                        </div>
                        {card.rarity === 'legendary' && (
                          <div style={{ fontSize: '8px', color: '#FFD700', marginTop: '2px', letterSpacing: '1px' }}>
                            LEGENDARY
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 结束回合 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                  {battleState.isPlayerTurn && (
                    <button
                      className="battle-card-btn"
                      style={{
                        ...STYLES.battleCard,
                        background: 'linear-gradient(135deg, rgba(80,20,80,0.8), rgba(40,10,60,0.9))',
                        borderColor: 'rgba(200,100,255,0.4)',
                        color: '#ddaaff',
                        padding: '12px 32px', fontSize: '14px',
                      }}
                      onClick={(e) => { e.stopPropagation(); handleBattleEndTurn(); }}
                    >
                      结束回合
                    </button>
                  )}
                  {!battleState.isPlayerTurn && (
                    <div style={{ fontSize: '14px', color: 'rgba(200,150,255,0.6)', padding: '12px' }}>
                      敌方回合中…
                    </div>
                  )}
                </div>

                {/* 牌库信息 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'rgba(140,120,200,0.5)' }}>
                  <span>📚牌库: {battleState.drawPile.length}</span>
                  <span>♻弃牌: {battleState.discardPile.length}</span>
                </div>

                {/* 战斗日志 */}
                <div style={{
                  marginTop: '12px', padding: '8px 12px',
                  background: 'rgba(0,0,0,0.4)', borderRadius: '6px',
                  maxHeight: '80px', overflow: 'hidden',
                  fontSize: '11px', color: 'rgba(160,140,200,0.6)',
                  lineHeight: '1.6',
                }}>
                  {battleState.battleLog.slice(-4).map((msg, i) => (
                    <div key={i} style={{ opacity: i === battleState.battleLog.slice(-4).length - 1 ? 1 : 0.5 }}>{msg}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 战斗结束退出按钮 */}
          {battleVisible && !battleState && (
            <div
              style={{
                ...STYLES.battleLayer,
                animation: 'gs-battleEnter 0.3s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setBattleVisible(false);
                advanceDialogue();
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(220,200,255,0.8)',
                  fontSize: '20px',
                }}
              >
                <div style={{ marginBottom: '24px', fontSize: '48px' }}>⚔</div>
                战斗结束
                <div
                  style={{
                    marginTop: '24px',
                    fontSize: '14px',
                    color: 'rgba(200,180,255,0.5)',
                  }}
                >
                  点击继续
                </div>
              </div>
            </div>
          )}

          {/* ═══ 层 7：过场动画层 ═══ */}
          {cutsceneVisible && (
            <div
              style={{
                ...STYLES.cutsceneLayer,
                animation: 'gs-cutsceneFadeIn 0.8s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCutsceneClick();
              }}
            >
              <div style={STYLES.cutsceneText}>
                <div style={STYLES.cutsceneTitle}>
                  {currentNode.text}
                </div>
                {currentNode.speaker && (
                  <div
                    style={{
                      fontSize: '16px',
                      color: 'rgba(180,160,220,0.6)',
                      marginTop: '16px',
                    }}
                  >
                    — {getCharacterName(currentNode.speaker)} —
                  </div>
                )}
                <div
                  style={{
                    marginTop: '40px',
                    fontSize: '13px',
                    color: 'rgba(160,140,200,0.4)',
                    animation: 'gs-blink 1.5s ease-in-out infinite',
                  }}
                >
                  点击继续
                </div>
              </div>
            </div>
          )}

          {/* ═══ 层 7.5：Backlog 对话历史回顾 ═══ */}
          <AnimatePresence>
            {backlogVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 45,
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  cursor: 'default',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBacklogVisible(false);
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '80vh',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(15,5,40,0.95) 0%, rgba(5,0,25,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(120,80,220,0.35)',
                    padding: '28px 32px',
                    boxShadow: '0 8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(100,60,200,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(120,80,220,0.2)',
                  }}>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: 'rgba(220,200,255,0.95)',
                      letterSpacing: '4px',
                    }}>
                      📜 对话回顾
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(160,140,200,0.6)' }}>
                      按 L / PageUp / ESC 关闭 · 滚轮滚动
                    </div>
                  </div>
                  <BacklogList history={gameState?.dialogueHistory ?? []} isOpen={backlogVisible} />
                  <button
                    className="menu-close"
                    style={{
                      ...STYLES.menuCloseButton,
                      marginTop: '16px',
                      marginBottom: 0,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBacklogVisible(false);
                      AudioManager.getInstance().playSFX('click');
                    }}
                  >
                    关闭 (L / ESC)
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ 层 8：战斗奖励卡牌 ═══ */}
          <AnimatePresence>
            {rewardVisible && rewardCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 50,
                  background: 'radial-gradient(ellipse at center, rgba(30,10,60,0.9) 0%, rgba(5,0,20,0.97) 100%)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  cursor: 'default',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeRewardOverlay();
                  AudioManager.getInstance().playSFX('click');
                }}
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                    maxWidth: '1000px',
                    width: '100%',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                      fontSize: '36px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B9D)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '8px',
                      textShadow: '0 0 30px rgba(255,215,0,0.3)',
                    }}
                  >
                    ⭐ 战斗胜利 · 获得卡牌 ⭐
                  </motion.div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {rewardCards.map((card, idx) => {
                      const rc = BATTLE_RARITY_COLORS[card.rarity as keyof typeof BATTLE_RARITY_COLORS] || '#9E9E9E';
                      const ec = BATTLE_ELEMENT_COLORS[card.element as keyof typeof BATTLE_ELEMENT_COLORS] || '#E0E0E0';
                      const isLegendary = card.rarity === 'legendary';
                      return (
                        <motion.div
                          key={card.id}
                          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + idx * 0.2, duration: 0.6, ease: 'easeOut' }}
                          style={{
                            width: '180px',
                            height: '260px',
                            borderRadius: '14px',
                            background: `linear-gradient(160deg, ${rc}22 0%, ${ec}33 50%, rgba(20,10,50,0.95) 100%)`,
                            border: `2px solid ${rc}`,
                            boxShadow: `0 4px 30px ${rc}55, inset 0 0 20px ${ec}22`,
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {isLegendary && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                              style={{
                                position: 'absolute',
                                inset: -40,
                                background: `conic-gradient(from 0deg, transparent, ${rc}44, transparent, ${rc}44, transparent)`,
                                pointerEvents: 'none',
                              }}
                            />
                          )}
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: rc,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(0,0,0,0.5)',
                            border: `1px solid ${rc}66`,
                            letterSpacing: '1px',
                          }}>
                            {card.rarity === 'legendary' ? '羁绊' : card.rarity === 'rare' ? '稀有' : card.rarity === 'uncommon' ? '精良' : '普通'}
                          </div>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${ec} 0%, ${ec}44 70%, transparent 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: `0 0 12px ${ec}88`,
                            flexShrink: 0,
                          }}>
                            {card.element === 'fire' ? '🔥' : card.element === 'ice' ? '❄️' :
                             card.element === 'water' ? '💧' : card.element === 'wind' ? '🌪️' :
                             card.element === 'earth' ? '🪨' : card.element === 'lightning' ? '⚡' :
                             card.element === 'light' ? '✨' : card.element === 'dark' ? '🌑' : '⚪'}
                          </div>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: rc,
                            textShadow: `0 0 10px ${rc}88`,
                            letterSpacing: '2px',
                            textAlign: 'center',
                            marginTop: '4px',
                          }}>
                            {card.name}
                          </div>
                          <div style={{
                            flex: 1,
                            fontSize: '11px',
                            color: 'rgba(220,210,245,0.75)',
                            lineHeight: 1.5,
                            textAlign: 'center',
                            padding: '4px 2px',
                            borderTop: `1px solid ${rc}33`,
                            borderBottom: `1px solid ${rc}33`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {card.desc}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '11px',
                            color: 'rgba(200,180,240,0.6)',
                          }}>
                            <span>元素：{card.element === 'fire' ? '火' : card.element === 'ice' ? '冰' :
                              card.element === 'water' ? '水' : card.element === 'wind' ? '风' :
                              card.element === 'earth' ? '地' : card.element === 'lightning' ? '雷' :
                              card.element === 'light' ? '光' : card.element === 'dark' ? '暗' : '无'}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + rewardCards.length * 0.2 + 0.3, duration: 0.4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeRewardOverlay();
                      AudioManager.getInstance().playSFX('click');
                    }}
                    style={{
                      padding: '12px 48px',
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '4px',
                      color: 'rgba(255,255,255,0.9)',
                      background: 'linear-gradient(135deg, rgba(120,80,220,0.4) 0%, rgba(80,40,180,0.4) 100%)',
                      border: '1px solid rgba(160,120,255,0.5)',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(100,60,200,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(150,100,255,0.6) 0%, rgba(110,60,220,0.6) 100%)';
                      (e.target as HTMLButtonElement).style.boxShadow = '0 4px 30px rgba(140,100,255,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(120,80,220,0.4) 0%, rgba(80,40,180,0.4) 100%)';
                      (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(100,60,200,0.3)';
                    }}
                  >
                    继续 (Space / Enter)
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ 层 8：菜单覆盖层 ═══ */}
          {isMenuOpen && (
            <div
              style={{
                ...STYLES.menuOverlay,
                animation: 'gs-menuFadeIn 0.25s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
                AudioManager.getInstance().playSFX('click');
              }}
            >
              <div
                style={{
                  ...STYLES.menuPanel,
                  animation: 'gs-menuPanelSlide 0.3s ease',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={STYLES.menuTitle}>— 菜单 —</div>

                {[
                  { label: '💾  保存游戏', action: handleMenuSave },
                  { label: '📂  读取存档', action: () => { toggleMenu(); onSave(); AudioManager.getInstance().playSFX('click'); } },
                  { label: '📖  剧情索引', action: () => { toggleMenu(); onFlow(); AudioManager.getInstance().playSFX('click'); } },
                  { label: '⚙  设置', action: handleMenuSettings },
                  { label: '🖼  CG鉴赏', action: () => { toggleMenu(); AudioManager.getInstance().playSFX('click'); } },
                  { label: '🏠  返回标题', action: handleMenuTitle },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="menu-item"
                    style={STYLES.menuButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  className="menu-close"
                  style={STYLES.menuCloseButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                    AudioManager.getInstance().playSFX('click');
                  }}
                >
                  关闭 (ESC)
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  },
);

GameScreen.displayName = 'GameScreen';

// ─── Backlog 对话历史列表组件 ───────────────────────────────────────────

const BACKLOG_COLORS: Record<string, string> = {
  hoshino_sakura: '#ff6b9d', sakura: '#ff6b9d',
  kishima_rin: '#c0c8e8', rin: '#c0c8e8',
  kazane_rin: '#a78bfa', suzu: '#a78bfa',
  ishigami_aoi: '#4dc9ff', aoi: '#4dc9ff',
  amane_yuzu: '#ffaa4d', yuzu: '#ffaa4d',
  shiraishi_mashiro: '#e8f0ff', mashiro: '#e8f0ff',
  kurosaki_soma: '#FFD23F', soma: '#FFD23F',
  shiratori_yuma: '#7EC8E3', yuma: '#7EC8E3',
  shadow_king: '#c060ff',
  professor_helios: '#FFA500', helios: '#FFA500',
  protagonist: '#d0b0ff',
};

function resolveSpeakerName(speaker?: string): string {
  if (!speaker) return '旁白';
  if (speaker === 'narrator' || speaker === '旁白') return '旁白';
  if (speaker === 'protagonist' || speaker === 'player') return '你';
  if (speaker === '???') return '???';
  const dn = getSpeakerDisplayName(speaker);
  if (dn) return dn;
  return speaker;
}

function speakerColor(speaker?: string): string {
  if (!speaker || speaker === 'narrator' || speaker === '旁白') return '#a080ff';
  const key = speaker.toLowerCase();
  for (const [k, v] of Object.entries(BACKLOG_COLORS)) {
    if (key.includes(k)) return v;
  }
  return '#c0b0ff';
}

interface BacklogEntry { speaker?: string; text: string; nodeId: string }

const BacklogList: React.FC<{ history: BacklogEntry[]; isOpen: boolean }> = React.memo(({ history, isOpen }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [history.length, isOpen]);

  if (history.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(160,140,200,0.5)',
        fontSize: '15px',
        padding: '60px 0',
        fontStyle: 'italic',
      }}>
        暂无对话记录……
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
      className="backlog-scroll"
    >
      {history.map((entry, idx) => {
        const isNarrator = !entry.speaker || entry.speaker === 'narrator' || entry.speaker === '旁白';
        const color = speakerColor(entry.speaker);
        const name = resolveSpeakerName(entry.speaker);
        return (
          <div
            key={`${entry.nodeId}-${idx}`}
            className="backlog-entry"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: isNarrator
                ? 'rgba(120,80,220,0.06)'
                : `linear-gradient(135deg, ${color}12 0%, ${color}05 100%)`,
              borderLeft: `3px solid ${color}55`,
              marginBottom: '2px',
            }}
          >
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: color,
              marginBottom: '4px',
              letterSpacing: '1px',
              opacity: 0.9,
            }}>
              {name}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(220,210,245,0.88)',
              lineHeight: 1.7,
              letterSpacing: '0.5px',
              whiteSpace: 'pre-wrap',
            }}>
              {entry.text}
            </div>
          </div>
        );
      })}
    </div>
  );
});
BacklogList.displayName = 'BacklogList';

// ─── 辅助函数：角色精灵位置样式 ─────────────────────────────────────────

function getPositionStyle(
  position: string,
): React.CSSProperties {
  switch (position) {
    case 'far-left':
      return { left: '0%', justifyContent: 'flex-start', transform: 'none' };
    case 'left':
    case 'mid-left':
      return { left: '10%', justifyContent: 'flex-start', transform: 'none' };
    case 'center-left':
      return { left: '28%', justifyContent: 'flex-start', transform: 'none' };
    case 'right':
    case 'mid-right':
      return { right: '10%', justifyContent: 'flex-end', transform: 'none' };
    case 'center-right':
      return { right: '28%', justifyContent: 'flex-end', transform: 'none' };
    case 'far-right':
      return { right: '0%', justifyContent: 'flex-end', transform: 'none' };
    case 'center':
    default:
      return { left: '50%', transform: 'translateX(-50%)', justifyContent: 'center' };
  }
}

// ─── 辅助函数：精灵入场/退场动画 ──────────────────────────────────────────

function getSpriteAnimStyle(
  entering: boolean,
  exiting: boolean,
  position: string,
): React.CSSProperties {
  const isLeftSide = position === 'left' || position === 'far-left' || position === 'mid-left' || position === 'center-left';
  const isRightSide = position === 'right' || position === 'far-right' || position === 'mid-right' || position === 'center-right';
  if (entering) {
    const animName = isLeftSide ? 'gs-slideInLeft' : isRightSide ? 'gs-slideInRight' : 'gs-slideInCenter';
    return { animation: `${animName} 0.6s ease forwards` };
  }
  if (exiting) {
    const animName = isLeftSide ? 'gs-fadeOutLeft' : isRightSide ? 'gs-fadeOutRight' : 'gs-fadeOutCenter';
    return { animation: `${animName} 0.6s ease forwards` };
  }
  return {};
}

// ─── 辅助函数：情感 Emoji ─────────────────────────────────────────────────

function getEmotionEmoji(emotion: string): string {
  const map: Record<string, string> = {
    neutral: '😐',
    happy: '😊',
    angry: '😠',
    sad: '😢',
    surprised: '😲',
    embarrassed: '😳',
    thinking: '🤔',
    determined: '😤',
    blushing: '☺️',
    crying: '😭',
    slight_smile: '🙂',
    cold_stare: '😑',
    concerned: '😟',
    gentle: '😌',
    serious: '🤨',
    excited: '🤩',
    worried: '😥',
    laughing: '😂',
    pouting: '😤',
    confident: '😏',
    smug: '😼',
    flustered: '😣',
    shocked: '😱',
    tsundere: '💢',
    gentle_smile: '☺️',
    praying: '🙏',
    rare_smile: '😊',
    satisfied: '😌',
  };
  return map[emotion] ?? '😐';
}

export default GameScreen;
