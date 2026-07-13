import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import { getAllCharacters } from '../../data/characters';
import { AudioManager } from '../../systems/audio/AudioManager';
import type { BGMName } from '../../systems/audio/AudioManager';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface GalleryScreenProps {
  onBack: () => void;
}

// ─── BGM 数据定义 ────────────────────────────────────────────────────────

interface BGMItem {
  id: string;
  name: string;
  description: string;
  mood: string;
  unlockCondition: string;
}

const BGM_LIST: BGMItem[] = [
  { id: 'title_bgm', name: '星辉序章', description: '标题画面主题曲', mood: '神秘·温柔', unlockCondition: '游戏开始时解锁' },
  { id: 'school_bgm', name: '学院日常', description: '校园轻快旋律', mood: '明亮·日常', unlockCondition: '进入学院解锁' },
  { id: 'bgm_main_theme', name: '星辉传说', description: '史诗感主题曲', mood: '壮阔·史诗', unlockCondition: '第一章通关解锁' },
  { id: 'bgm_peaceful_daily', name: '宁静时光', description: '平静日常BGM', mood: '悠闲·治愈', unlockCondition: '日常剧情解锁' },
  { id: 'bgm_school_life', name: '青春学园', description: '校园生活旋律', mood: '青春·活泼', unlockCondition: '校园活动解锁' },
  { id: 'bgm_mysterious', name: '秘境探索', description: '神秘遗迹BGM', mood: '神秘·悬疑', unlockCondition: '探索遗迹解锁' },
  { id: 'tension_bgm', name: '暗流涌动', description: '紧张悬疑BGM', mood: '紧张·压迫', unlockCondition: '遭遇暗影解锁' },
  { id: 'emotional_bgm', name: '心之羁绊', description: '感情戏钢琴曲', mood: '温柔·心动', unlockCondition: '好感度剧情解锁' },
  { id: 'bgm_romantic', name: '樱花告白', description: '浪漫场景BGM', mood: '浪漫·甜蜜', unlockCondition: '告白场景解锁' },
  { id: 'bgm_sad', name: '离别之泪', description: '悲伤场景BGM', mood: '悲伤·感人', unlockCondition: '悲伤剧情解锁' },
  { id: 'battle_bgm', name: '魔法决战', description: '普通战斗BGM', mood: '激昂·战斗', unlockCondition: '首次战斗解锁' },
  { id: 'bgm_battle', name: '元素交锋', description: '强化战斗BGM', mood: '激烈·热血', unlockCondition: '强敌战斗解锁' },
  { id: 'bgm_boss_battle', name: '暗影降临', description: 'Boss战BGM', mood: '史诗·决战', unlockCondition: 'Boss战解锁' },
  { id: 'bgm_awakening', name: '星辉觉醒', description: '力量觉醒BGM', mood: '神圣·觉醒', unlockCondition: '力量觉醒解锁' },
  { id: 'bgm_festival', name: '星辉祭典', description: '学院祭BGM', mood: '热闹·欢乐', unlockCondition: '学院祭解锁' },
];

// ─── 筛选标签 ─────────────────────────────────────────────────────────────

type MainTab = 'cg' | 'music';

// ─── 样式 ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    fontFamily: "'Noto Sans SC', sans-serif",
    overflowY: 'auto',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 30%, rgba(20,5,50,0.95) 0%, rgba(5,0,15,0.98) 100%)',
    backdropFilter: 'blur(8px)',
    zIndex: -1,
  },
  inner: {
    width: '1000px',
    maxWidth: '95vw',
    padding: '40px 32px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    fontFamily: "'Cinzel', 'Orbitron', serif",
    background: 'linear-gradient(135deg, #e0c0ff, #a080ff, #80c0ff)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '8px',
    margin: 0,
  },
  backButton: {
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '2px',
    border: '1px solid rgba(180,140,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(30,10,60,0.6), rgba(15,5,40,0.8))',
    color: 'rgba(220,200,255,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
  },
  mainTabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    padding: '4px',
    background: 'linear-gradient(135deg, rgba(15,5,35,0.6), rgba(10,3,25,0.8))',
    borderRadius: '12px',
    border: '1px solid rgba(100,60,180,0.2)',
    width: 'fit-content',
  },
  mainTab: {
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '2px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'transparent',
    color: 'rgba(160,140,200,0.6)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
  },
  mainTabActive: {
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '2px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(80,40,150,0.5), rgba(50,20,100,0.7))',
    color: 'rgba(230,210,255,0.95)',
    fontFamily: "'Noto Sans SC', sans-serif",
    boxShadow: '0 0 16px rgba(120,80,220,0.2)',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.5), rgba(12,6,30,0.6))',
    border: '1px solid rgba(120,80,220,0.15)',
    borderRadius: '10px',
  },
  progressLabel: {
    fontSize: '13px',
    color: 'rgba(200,190,230,0.8)',
    letterSpacing: '1px',
    minWidth: '70px',
  },
  progressTrack: {
    flex: 1,
    height: '8px',
    background: 'rgba(40,20,80,0.5)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #a060ff, #60c0ff)',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 8px rgba(160,100,255,0.4)',
  },
  progressPercent: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(160,200,255,0.9)',
    fontFamily: "'Orbitron', sans-serif",
    minWidth: '48px',
    textAlign: 'right' as const,
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '1px',
    border: '1px solid rgba(120,80,220,0.2)',
    borderRadius: '20px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(20,8,45,0.5), rgba(10,5,25,0.7))',
    color: 'rgba(180,160,220,0.7)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
  },
  tabActive: {
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '1px',
    border: '1px solid rgba(160,120,255,0.5)',
    borderRadius: '20px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(50,20,100,0.7), rgba(30,10,60,0.9))',
    color: 'rgba(220,200,255,0.95)',
    fontFamily: "'Noto Sans SC', sans-serif",
    boxShadow: '0 0 12px rgba(120,80,220,0.2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
  },
  cgCard: {
    position: 'relative' as const,
    aspectRatio: '16 / 10',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(120,80,220,0.15)',
  },
  cgCardUnlocked: {
    background: 'linear-gradient(135deg, rgba(40,20,80,0.6), rgba(20,10,45,0.8))',
  },
  cgCardLocked: {
    background: 'linear-gradient(135deg, rgba(15,8,30,0.8), rgba(8,4,18,0.9))',
    cursor: 'default',
  },
  cgThumbnail: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    padding: '12px',
  },
  cgPlaceholder: {
    fontSize: '32px',
    marginBottom: '6px',
    opacity: 0.4,
  },
  cgTitle: {
    fontSize: '12px',
    color: 'rgba(200,190,230,0.8)',
    textAlign: 'center' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    maxWidth: '100%',
  },
  cgType: {
    fontSize: '10px',
    color: 'rgba(140,120,200,0.6)',
    marginTop: '2px',
  },
  lockOverlay: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5,0,15,0.7)',
  },
  lockIcon: {
    fontSize: '28px',
    marginBottom: '4px',
    opacity: 0.5,
  },
  lockText: {
    fontSize: '11px',
    color: 'rgba(120,100,180,0.5)',
    letterSpacing: '1px',
  },
  // 音乐列表样式
  musicList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  musicItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(120,80,220,0.15)',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.5), rgba(12,6,30,0.6))',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  musicItemLocked: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(80,50,120,0.1)',
    background: 'linear-gradient(135deg, rgba(15,8,30,0.6), rgba(8,4,18,0.7))',
    cursor: 'default',
    opacity: 0.5,
  },
  musicItemPlaying: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(160,120,255,0.4)',
    background: 'linear-gradient(135deg, rgba(50,20,100,0.6), rgba(30,10,70,0.8))',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(120,80,220,0.2)',
  },
  musicIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  },
  musicInfo: {
    flex: 1,
    minWidth: 0,
  },
  musicName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.9)',
    marginBottom: '4px',
  },
  musicDesc: {
    fontSize: '12px',
    color: 'rgba(160,140,200,0.7)',
    display: 'flex',
    gap: '12px',
  },
  musicMood: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    background: 'rgba(100,60,180,0.2)',
    color: 'rgba(180,150,230,0.8)',
  },
  playButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '2px solid rgba(160,120,255,0.5)',
    background: 'linear-gradient(135deg, rgba(60,30,120,0.6), rgba(40,15,80,0.8))',
    color: 'rgba(220,200,255,0.9)',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  playingIndicator: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '20px',
  },
  playingBar: {
    width: '3px',
    background: 'linear-gradient(180deg, #a060ff, #60c0ff)',
    borderRadius: '2px',
  },
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modalBackdrop: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
  },
  modalContent: {
    position: 'relative' as const,
    maxWidth: '80vw',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
  },
  modalImage: {
    width: '640px',
    maxWidth: '80vw',
    aspectRatio: '16 / 10',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(40,20,80,0.6), rgba(20,10,45,0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(120,80,220,0.3)',
    boxShadow: '0 0 40px rgba(100,60,200,0.2)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.95)',
    letterSpacing: '2px',
  },
  modalCondition: {
    fontSize: '13px',
    color: 'rgba(160,140,200,0.7)',
    letterSpacing: '1px',
  },
  modalClose: {
    position: 'absolute' as const,
    top: '-12px',
    right: '-12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(180,140,255,0.3)',
    background: 'rgba(20,8,45,0.9)',
    color: 'rgba(200,190,230,0.9)',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowPlayingBar: {
    position: 'sticky',
    bottom: '20px',
    marginTop: '20px',
    padding: '14px 20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(30,12,70,0.9), rgba(15,6,40,0.95))',
    border: '1px solid rgba(140,100,230,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
  },
};

// ─── CG 占位渐变色映射 ──────────────────────────────────────────────────

const CG_GRADIENTS = [
  'linear-gradient(135deg, #2a1050, #1a0830)',
  'linear-gradient(135deg, #1a2050, #0a1030)',
  'linear-gradient(135deg, #2a1540, #150a25)',
  'linear-gradient(135deg, #201a50, #100d30)',
];

const BGM_GRADIENTS: Record<string, string> = {
  title_bgm: 'linear-gradient(135deg, #1a1040, #2a1a60)',
  school_bgm: 'linear-gradient(135deg, #1a3050, #0a2040)',
  bgm_main_theme: 'linear-gradient(135deg, #402060, #201040)',
  bgm_peaceful_daily: 'linear-gradient(135deg, #1a4030, #0a3020)',
  bgm_school_life: 'linear-gradient(135deg, #30401a, #203010)',
  bgm_mysterious: 'linear-gradient(135deg, #201a40, #100d30)',
  tension_bgm: 'linear-gradient(135deg, #401010, #200808)',
  emotional_bgm: 'linear-gradient(135deg, #402050, #301840)',
  bgm_romantic: 'linear-gradient(135deg, #502040, #401830)',
  bgm_sad: 'linear-gradient(135deg, #1a2040, #0d1530)',
  battle_bgm: 'linear-gradient(135deg, #501a1a, #300d0d)',
  bgm_battle: 'linear-gradient(135deg, #601010, #400808)',
  bgm_boss_battle: 'linear-gradient(135deg, #400a40, #200520)',
  bgm_awakening: 'linear-gradient(135deg, #fff59d, #ffd54f)',
  bgm_festival: 'linear-gradient(135deg, #502060, #ff6b9d)',
};

// ─── 获取所有 CG 数据 ────────────────────────────────────────────────────

interface CGItem {
  id: string;
  title: string;
  characterId: string;
  characterName: string;
  type: string;
  unlockCondition: string;
}

function getAllCGs(): CGItem[] {
  const cgs: CGItem[] = [];
  const characters = getAllCharacters();

  for (const char of characters) {
    for (const img of char.galleryImages) {
      cgs.push({
        id: img.id,
        title: img.title,
        characterId: char.id,
        characterName: char.name,
        type: img.type,
        unlockCondition: img.unlockCondition,
      });
    }
  }

  return cgs;
}

function getCgTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    sprite: '立绘',
    cg: 'CG',
    event: '事件',
    ending: '结局',
  };
  return labels[type] ?? type;
}

// ─── 播放动画指示器 ─────────────────────────────────────────────────────

const PlayingIndicator: React.FC = () => (
  <div style={styles.playingIndicator}>
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        style={{
          ...styles.playingBar,
          height: `${8 + Math.random() * 12}px`,
        }}
        animate={{
          height: [`${8 + i * 2}px`, `${16 - i * 2}px`, `${8 + i * 2}px`],
        }}
        transition={{
          duration: 0.5 + i * 0.1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onBack }) => {
  const gameState = useGameStore((s) => s.gameState);
  const unlockedCGs = useMemo(() => gameState?.unlockedCGs ?? [], [gameState?.unlockedCGs]);
  const unlockedBgm = useMemo(() => gameState?.unlockedBgm ?? ['title_bgm'], [gameState?.unlockedBgm]);
  const [mainTab, setMainTab] = useState<MainTab>('cg');
  const [activeCharTab, setActiveCharTab] = useState<string>('all');
  const [selectedCG, setSelectedCG] = useState<CGItem | null>(null);
  const [playingBgm, setPlayingBgm] = useState<string | null>(null);

  // 全部 CG 列表
  const allCGs = useMemo(() => getAllCGs(), []);
  const characters = useMemo(() => getAllCharacters(), []);

  // 筛选后的 CG
  const filteredCGs = useMemo(() => {
    if (activeCharTab === 'all') return allCGs;
    return allCGs.filter((cg) => cg.characterId === activeCharTab);
  }, [allCGs, activeCharTab]);

  // CG解锁统计
  const cgUnlockPercent = useMemo(() => {
    if (allCGs.length === 0) return 0;
    const count = allCGs.filter((cg) => unlockedCGs.includes(cg.id)).length;
    return Math.round((count / allCGs.length) * 100);
  }, [allCGs, unlockedCGs]);

  // BGM解锁统计
  const bgmUnlockPercent = useMemo(() => {
    if (BGM_LIST.length === 0) return 0;
    const count = BGM_LIST.filter((bgm) => unlockedBgm.includes(bgm.id)).length;
    return Math.round((count / BGM_LIST.length) * 100);
  }, [unlockedBgm]);

  // 处理BGM播放
  const handlePlayBgm = useCallback((bgmId: string) => {
    if (!unlockedBgm.includes(bgmId)) return;
    const audio = AudioManager.getInstance();
    if (playingBgm === bgmId) {
      audio.stopBGM();
      setPlayingBgm(null);
    } else {
      audio.playBGM(bgmId as BGMName);
      setPlayingBgm(bgmId);
    }
  }, [playingBgm, unlockedBgm]);

  // 切换标签时停止音乐
  useEffect(() => {
    if (mainTab !== 'music' && playingBgm) {
      AudioManager.getInstance().stopBGM();
      setPlayingBgm(null);
    }
  }, [mainTab, playingBgm]);

  // 离开时停止播放
  useEffect(() => {
    return () => {
      AudioManager.getInstance().stopBGM();
    };
  }, []);

  const unlockPercent = mainTab === 'cg' ? cgUnlockPercent : bgmUnlockPercent;
  const unlockLabel = mainTab === 'cg' ? 'CG收集' : '音乐收集';

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{`
        .cg-card-unlocked:hover {
          border-color: rgba(160,120,255,0.5) !important;
          box-shadow: 0 0 20px rgba(120,80,220,0.2);
          transform: translateY(-3px) scale(1.02);
        }
        .gallery-tab:hover {
          border-color: rgba(140,100,220,0.4);
          color: rgba(210,195,245,0.9);
        }
        .music-item-unlocked:hover {
          border-color: rgba(160,120,255,0.4) !important;
          transform: translateX(4px);
          box-shadow: 0 0 16px rgba(120,80,220,0.15);
        }
        .gallery-main-tab:hover {
          color: rgba(200,180,240,0.8);
        }
      `}</style>
      <div style={styles.backdrop} />

      <div style={styles.inner}>
        {/* 标题栏 */}
        <div style={styles.header}>
          <h1 style={styles.title}>鉴赏模式</h1>
          <button style={styles.backButton} onClick={onBack}>
            ← 返回
          </button>
        </div>

        {/* 主标签切换 */}
        <div style={styles.mainTabs}>
          <button
            className="gallery-main-tab"
            style={mainTab === 'cg' ? styles.mainTabActive : styles.mainTab}
            onClick={() => setMainTab('cg')}
          >
            🖼️ CG画廊
          </button>
          <button
            className="gallery-main-tab"
            style={mainTab === 'music' ? styles.mainTabActive : styles.mainTab}
            onClick={() => setMainTab('music')}
          >
            🎵 音乐鉴赏
          </button>
        </div>

        {/* 解锁进度 */}
        <div style={styles.progressBar}>
          <span style={styles.progressLabel}>{unlockLabel}</span>
          <div style={styles.progressTrack}>
            <motion.div
              style={{ ...styles.progressFill, width: `${unlockPercent}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${unlockPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span style={styles.progressPercent}>{unlockPercent}%</span>
        </div>

        {/* CG内容 */}
        <AnimatePresence mode="wait">
          {mainTab === 'cg' && (
            <motion.div
              key="cg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* 角色筛选标签 */}
              <div style={styles.tabs}>
                <button
                  className="gallery-tab"
                  style={activeCharTab === 'all' ? styles.tabActive : styles.tab}
                  onClick={() => setActiveCharTab('all')}
                >
                  全部
                </button>
                {characters.map((char) => (
                  <button
                    key={char.id}
                    className="gallery-tab"
                    style={activeCharTab === char.id ? styles.tabActive : styles.tab}
                    onClick={() => setActiveCharTab(char.id)}
                  >
                    <span style={{ marginRight: '4px' }}>{char.element.icon}</span>
                    {char.name}
                  </button>
                ))}
              </div>

              {/* CG 网格 */}
              <div style={styles.grid}>
                {filteredCGs.map((cg, i) => {
                  const isUnlocked = unlockedCGs.includes(cg.id);

                  return (
                    <motion.div
                      key={cg.id}
                      className={isUnlocked ? 'cg-card-unlocked' : ''}
                      style={{
                        ...styles.cgCard,
                        ...(isUnlocked ? styles.cgCardUnlocked : styles.cgCardLocked),
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      onClick={() => isUnlocked && setSelectedCG(cg)}
                    >
                      <div
                        style={{
                          ...styles.cgThumbnail,
                          background: CG_GRADIENTS[i % CG_GRADIENTS.length],
                        }}
                      >
                        {isUnlocked ? (
                          <>
                            <div style={styles.cgPlaceholder}>🖼️</div>
                            <div style={styles.cgTitle}>{cg.title}</div>
                            <div style={styles.cgType}>{getCgTypeLabel(cg.type)}</div>
                          </>
                        ) : (
                          <>
                            <div style={styles.cgPlaceholder}>?</div>
                            <div style={styles.cgTitle}>???</div>
                          </>
                        )}
                      </div>

                      {!isUnlocked && (
                        <div style={styles.lockOverlay}>
                          <div style={styles.lockIcon}>🔒</div>
                          <div style={styles.lockText}>未解锁</div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 音乐鉴赏内容 */}
          {mainTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.musicList}>
                {BGM_LIST.map((bgm, i) => {
                  const isUnlocked = unlockedBgm.includes(bgm.id);
                  const isPlaying = playingBgm === bgm.id;

                  return (
                    <motion.div
                      key={bgm.id}
                      className={isUnlocked ? 'music-item-unlocked' : ''}
                      style={
                        isPlaying
                          ? styles.musicItemPlaying
                          : isUnlocked
                          ? styles.musicItem
                          : styles.musicItemLocked
                      }
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      onClick={() => isUnlocked && handlePlayBgm(bgm.id)}
                    >
                      <div
                        style={{
                          ...styles.musicIcon,
                          background: BGM_GRADIENTS[bgm.id] || BGM_GRADIENTS.school_bgm,
                        }}
                      >
                        {isUnlocked ? (isPlaying ? '🎵' : '🎶') : '🔒'}
                      </div>
                      <div style={styles.musicInfo}>
                        <div style={styles.musicName}>
                          {isUnlocked ? bgm.name : '???'}
                        </div>
                        <div style={styles.musicDesc}>
                          {isUnlocked ? (
                            <>
                              <span>{bgm.description}</span>
                              <span style={styles.musicMood}>{bgm.mood}</span>
                            </>
                          ) : (
                            <span style={{ opacity: 0.6 }}>{bgm.unlockCondition}</span>
                          )}
                        </div>
                      </div>
                      {isUnlocked && (
                        isPlaying ? (
                          <div style={styles.playButton} onClick={(e) => { e.stopPropagation(); handlePlayBgm(bgm.id); }}>
                            <PlayingIndicator />
                          </div>
                        ) : (
                          <div style={styles.playButton} onClick={(e) => { e.stopPropagation(); handlePlayBgm(bgm.id); }}>
                            ▶
                          </div>
                        )
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* 正在播放提示 */}
              {playingBgm && (
                <motion.div
                  style={styles.nowPlayingBar}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={{ fontSize: '20px' }}>🎵</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'rgba(160,140,200,0.7)' }}>正在播放</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(220,200,255,0.95)' }}>
                      {BGM_LIST.find(b => b.id === playingBgm)?.name}
                    </div>
                  </div>
                  <button
                    style={{ ...styles.playButton, width: '36px', height: '36px', fontSize: '14px' }}
                    onClick={() => handlePlayBgm(playingBgm)}
                  >
                    ⏹
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CG 查看弹窗 */}
      <AnimatePresence>
        {selectedCG && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCG(null)}
          >
            <div style={styles.modalBackdrop} />
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={styles.modalClose}
                onClick={() => setSelectedCG(null)}
              >
                ✕
              </button>

              <div style={styles.modalImage}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
                  <div style={{ fontSize: '16px', color: 'rgba(200,180,240,0.6)' }}>
                    {selectedCG.title}
                  </div>
                </div>
              </div>

              <div style={styles.modalTitle}>{selectedCG.title}</div>
              <div style={styles.modalCondition}>
                📍 {selectedCG.unlockCondition}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryScreen;
