import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import type { SaveData } from '../../systems/store';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface LoadScreenProps {
  onBack: () => void;
  onLoad: (slotId: number) => void;
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────

/** 格式化时间戳为可读日期 */
function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 格式化游戏时长 */
function formatPlaytime(seconds: number): string {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}时${m}分`;
  return `${m}分`;
}

/** 获取章节显示名 */
function getChapterLabel(chapter: number): string {
  const names: Record<number, string> = {
    1: '第一章：初入学院',
    2: '第二章：暗流涌动',
    3: '第三章：星辉抉择',
  };
  return names[chapter] ?? `第${chapter}章`;
}

// ─── 样式 ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    width: '960px',
    maxWidth: '95vw',
    padding: '40px 32px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
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
  autoSaveSection: {
    marginBottom: '24px',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(40,15,80,0.5), rgba(20,8,45,0.6))',
    border: '1px solid rgba(120,80,220,0.2)',
    borderRadius: '12px',
  },
  autoSaveLabel: {
    fontSize: '13px',
    color: 'rgba(160,200,255,0.7)',
    letterSpacing: '2px',
    marginBottom: '8px',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
  },
  slot: {
    position: 'relative' as const,
    padding: '14px 16px',
    background: 'linear-gradient(145deg, rgba(25,10,55,0.6), rgba(12,6,30,0.8))',
    border: '1px solid rgba(120,80,220,0.15)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  slotEmpty: {
    position: 'relative' as const,
    padding: '14px 16px',
    background: 'linear-gradient(145deg, rgba(15,8,35,0.4), rgba(8,4,20,0.5))',
    border: '1px solid rgba(80,50,150,0.1)',
    borderRadius: '10px',
    cursor: 'default',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumber: {
    fontSize: '11px',
    color: 'rgba(140,120,200,0.6)',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '1px',
    marginBottom: '6px',
  },
  slotPlayerName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.9)',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  slotChapter: {
    fontSize: '12px',
    color: 'rgba(160,140,220,0.7)',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  slotDate: {
    fontSize: '11px',
    color: 'rgba(120,110,170,0.6)',
    fontFamily: "'Orbitron', sans-serif",
  },
  slotPlaytime: {
    fontSize: '11px',
    color: 'rgba(100,180,255,0.5)',
    marginTop: '2px',
  },
  slotThumbnail: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    width: '40px',
    height: '30px',
    borderRadius: '4px',
    background: 'linear-gradient(135deg, rgba(60,30,100,0.4), rgba(30,15,60,0.6))',
    border: '1px solid rgba(120,80,220,0.15)',
  },
  emptyText: {
    fontSize: '14px',
    color: 'rgba(100,80,160,0.4)',
    letterSpacing: '2px',
  },
  confirmOverlay: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  confirmBackdrop: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
  },
  confirmBox: {
    position: 'relative' as const,
    padding: '28px 36px',
    background: 'linear-gradient(145deg, rgba(30,12,60,0.95), rgba(15,6,35,0.98))',
    border: '1px solid rgba(120,80,220,0.3)',
    borderRadius: '12px',
    textAlign: 'center' as const,
    minWidth: '300px',
    boxShadow: '0 0 40px rgba(100,60,200,0.2)',
  },
  confirmText: {
    fontSize: '15px',
    color: 'rgba(220,200,255,0.9)',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  confirmButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  confirmYes: {
    padding: '8px 24px',
    fontSize: '14px',
    border: '1px solid rgba(255,100,100,0.4)',
    borderRadius: '6px',
    cursor: 'pointer',
    background: 'rgba(60,15,15,0.7)',
    color: 'rgba(255,180,180,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.2s ease',
  },
  confirmNo: {
    padding: '8px 24px',
    fontSize: '14px',
    border: '1px solid rgba(120,80,220,0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    background: 'rgba(20,8,45,0.7)',
    color: 'rgba(200,190,230,0.9)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.2s ease',
  },
};

// ─── 自定义 CSS ──────────────────────────────────────────────────────────

const slotHoverCSS = `
  .save-slot:not(.save-slot-empty):hover {
    border-color: rgba(160,120,255,0.5) !important;
    background: linear-gradient(145deg, rgba(35,15,70,0.7), rgba(18,8,40,0.9)) !important;
    box-shadow: 0 0 20px rgba(120,80,220,0.15);
    transform: translateY(-2px);
  }
  .save-slot:not(.save-slot-empty):active {
    transform: translateY(0);
  }
`;

// ─── 存档槽位组件 ────────────────────────────────────────────────────────

interface SlotProps {
  save: SaveData;
  onLoad: (slotId: number) => void;
  onDelete: (slotId: number) => void;
  index: number;
}

const SaveSlot: React.FC<SlotProps> = ({ save, onLoad, onDelete, index }) => {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      if (!save.isEmpty) {
        onDelete(save.id);
      }
    }, 800);
  }, [save, onDelete]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!save.isEmpty) {
        onDelete(save.id);
      }
    },
    [save, onDelete],
  );

  const handleClick = useCallback(() => {
    if (!save.isEmpty) {
      onLoad(save.id);
    }
  }, [save, onLoad]);

  if (save.isEmpty) {
    return (
      <motion.div
        className="save-slot save-slot-empty"
        style={styles.slotEmpty}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
      >
        <span style={styles.emptyText}>空存档</span>
      </motion.div>
    );
  }

  const playerName = save.gameState?.playerName ?? '未知';
  const playtime = save.gameState?.totalPlayTime ?? 0;

  return (
    <motion.div
      className="save-slot"
      style={styles.slot}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 缩略图占位 */}
      <div style={styles.slotThumbnail} />

      <div style={styles.slotNumber}>SLOT {String(save.id + 1).padStart(2, '0')}</div>
      <div style={styles.slotPlayerName}>{playerName}</div>
      <div style={styles.slotChapter}>{getChapterLabel(save.chapter)}</div>
      <div style={styles.slotDate}>{formatDate(save.timestamp)}</div>
      <div style={styles.slotPlaytime}>⏱ {formatPlaytime(playtime)}</div>
    </motion.div>
  );
};

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const LoadScreen: React.FC<LoadScreenProps> = ({ onBack, onLoad }) => {
  const { saveSlots, deleteSave, loadAutoSave } = useGameStore();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // 自动存档状态
  const [autoSaveData, setAutoSaveData] = useState<SaveData | null>(null);

  // 尝试读取自动存档
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('magic-academy-vn-autosave');
      if (raw) {
        const data: SaveData = JSON.parse(raw);
        if (!data.isEmpty) {
          setAutoSaveData(data);
        }
      }
    } catch {
      // 静默失败
    }
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget !== null) {
      deleteSave(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteSave]);

  const handleSlotLoad = useCallback(
    (slotId: number) => {
      const slot = saveSlots[slotId];
      if (slot && !slot.isEmpty) {
        onLoad(slotId);
      }
    },
    [saveSlots, onLoad],
  );

  const handleAutoSaveLoad = useCallback(() => {
    loadAutoSave();
    onLoad(-1);
  }, [loadAutoSave, onLoad]);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{slotHoverCSS}</style>
      <div style={styles.backdrop} />

      <div style={styles.inner}>
        {/* 标题栏 */}
        <div style={styles.header}>
          <h1 style={styles.title}>存档管理</h1>
          <button
            className="settings-btn"
            style={styles.backButton}
            onClick={onBack}
          >
            ← 返回
          </button>
        </div>

        {/* 自动存档 */}
        <div style={styles.autoSaveSection}>
          <div style={styles.autoSaveLabel}>⚡ 自动存档</div>
          {autoSaveData ? (
            <motion.div
              className="save-slot"
              style={{ ...styles.slot, background: 'linear-gradient(145deg, rgba(30,15,65,0.6), rgba(15,8,35,0.8))' }}
              whileHover={{ scale: 1.01, borderColor: 'rgba(160,120,255,0.4)' }}
              onClick={handleAutoSaveLoad}
            >
              <div style={styles.slotThumbnail} />
              <div style={{ ...styles.slotNumber, color: 'rgba(100,180,255,0.7)' }}>AUTO SAVE</div>
              <div style={styles.slotPlayerName}>
                {autoSaveData.gameState?.playerName ?? '未知'}
              </div>
              <div style={styles.slotChapter}>{getChapterLabel(autoSaveData.chapter)}</div>
              <div style={styles.slotDate}>{formatDate(autoSaveData.timestamp)}</div>
              <div style={styles.slotPlaytime}>
                ⏱ {formatPlaytime(autoSaveData.gameState?.totalPlayTime ?? 0)}
              </div>
            </motion.div>
          ) : (
            <div style={{ ...styles.emptyText, padding: '12px 0' }}>暂无自动存档</div>
          )}
        </div>

        {/* 存档网格 */}
        <div style={styles.grid}>
          {saveSlots.map((save, i) => (
            <SaveSlot
              key={save.id}
              save={save}
              onLoad={handleSlotLoad}
              onDelete={(id) => setDeleteTarget(id)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {deleteTarget !== null && (
          <motion.div
            style={styles.confirmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.confirmBackdrop} onClick={() => setDeleteTarget(null)} />
            <motion.div
              style={styles.confirmBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={styles.confirmText}>
                确定要删除存档位 {deleteTarget !== null ? deleteTarget + 1 : ''} 吗？
                <br />
                此操作不可撤销。
              </div>
              <div style={styles.confirmButtons}>
                <button
                  style={styles.confirmYes}
                  onClick={handleDeleteConfirm}
                >
                  删除
                </button>
                <button
                  style={styles.confirmNo}
                  onClick={() => setDeleteTarget(null)}
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadScreen;
