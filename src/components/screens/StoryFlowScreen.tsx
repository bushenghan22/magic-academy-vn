import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import { getChapterNodes, type StoryNode } from '../../data/stories';
import { ENDINGS, type Ending } from '../../data/endings';

interface StoryFlowScreenProps {
  onBack: () => void;
}

type Tab = 'timeline' | 'endings';

const CHAPTER_NAMES: Record<number, string> = {
  0: '序章',
  1: '第一章 · 入学',
  2: '第二章 · 历练',
  3: '第三章 · 决战',
};

const EXTRA_ENDINGS: Ending[] = [
  {
    id: 'ending_dark',
    type: 'bad',
    name: '暗影吞噬',
    subtitle: 'BAD END · 世界陷入黑暗',
    description: '你败在了暗影之王的手下，黑暗吞噬了整个魔法学院。六位少女的羁绊没能拯救世界，一切都被永恒的暗影笼罩。',
    conditions: [{ type: 'flag', key: 'boss_defeated_by_shadow_king', value: true }],
    dialoguePreview: ['艾利奥斯：愚蠢的人类，光明终究无法战胜黑暗……', '黑暗……吞噬了一切……'],
    cgImage: 'cg_ending_dark',
    bgm: 'bgm_ending_dark',
    rewards: [{ type: 'achievement', id: 'ach_dark_ending' }],
  },
  {
    id: 'ending_normal',
    type: 'good',
    name: '平凡的魔法师',
    subtitle: 'NORMAL END · 友谊长存',
    description: '你没有对任何人告白，选择了以朋友的身份继续守护着大家。毕业之后，你成为了学院的一名教师，和六位少女保持着永远的友谊。',
    conditions: [{ type: 'flag', key: 'ending_normal', value: true }],
    dialoguePreview: ['众人：不管未来怎样，我们永远都是朋友！', '我：嗯，大家一定要幸福啊……'],
    cgImage: 'cg_ending_normal',
    bgm: 'bgm_ending_normal',
    rewards: [{ type: 'achievement', id: 'ach_normal_ending' }],
  },
];

const ALL_ENDINGS = [...ENDINGS, ...EXTRA_ENDINGS];

const ENDING_META: Record<string, { icon: string; color: string; label: string; labelColor: string }> = {
  good: { icon: '💕', color: '#ff6b9d', label: 'GOOD END', labelColor: '#ff6b9d' },
  bad: { icon: '💔', color: '#8b5cf6', label: 'BAD END', labelColor: '#8b5cf6' },
  true: { icon: '⭐', color: '#ffd700', label: 'TRUE END', labelColor: '#ffd700' },
  hidden: { icon: '🌟', color: '#00e5ff', label: 'HIDDEN END', labelColor: '#00e5ff' },
};

function getNodeLabel(node: StoryNode): string {
  const t = (node.text || '').replace(/\s+/g, ' ').trim();
  if (node.type === 'choice') {
    return `🔀 ${node.speaker ? node.speaker + '：' : ''}选择分支`;
  }
  if (node.type === 'battle') {
    const enemyName = node.enemyId || '敌人';
    const displayName = enemyName === 'shadow_king' ? '暗影之王·艾利奥斯'
      : enemyName === 'shadow_wolf' ? '暗影狼'
      : enemyName === 'shadow_assassin' ? '暗影刺客'
      : enemyName === 'shadow_knight' ? '暗影骑士'
      : enemyName === 'fire_elemental' ? '火元素'
      : enemyName === 'shadow_dragon_whelp' ? '暗影幼龙'
      : enemyName;
    return `⚔ 战斗 · ${displayName}`;
  }
  if (node.type === 'branch') {
    return `🔀 分支判定`;
  }
  if (t.length > 0) {
    const clean = t.replace(/「|」|『|』/g, '').slice(0, 28);
    return clean + (t.length > 28 ? '…' : '');
  }
  return node.id;
}

function getEndingMeta(type: Ending['type']) {
  return ENDING_META[type] || ENDING_META.bad;
}

export const StoryFlowScreen: React.FC<StoryFlowScreenProps> = ({ onBack }) => {
  const gameState = useGameStore((s) => s.gameState);
  const jumpToNode = useGameStore((s) => s.jumpToNode);
  const [tab, setTab] = useState<Tab>('timeline');
  const [selectedChapter, setSelectedChapter] = useState<number>(gameState?.currentChapter || 1);

  const readNodes = gameState?.readNodes ?? [];
  const currentNodeId = gameState?.currentNodeId ?? '';
  const flags = gameState?.flags ?? {};

  const chapters = useMemo(() => [1, 2, 3], []);
  const chapterNodes = useMemo(() => {
    return getChapterNodes(selectedChapter).sort((a, b) => a.id.localeCompare(b.id));
  }, [selectedChapter]);

  const endingUnlocked: Record<string, boolean> = {};
  for (const e of ALL_ENDINGS) {
    endingUnlocked[e.id] = !!flags[e.id];
  }

  const unlockedEndingCount = Object.values(endingUnlocked).filter(Boolean).length;
  const visitedCount = readNodes.length;
  const totalNodeCount = chapters.reduce((sum, c) => sum + getChapterNodes(c).length, 0);
  const progress = totalNodeCount > 0 ? Math.round((visitedCount / totalNodeCount) * 100) : 0;

  const handleJump = (nodeId: string) => {
    if (!readNodes.includes(nodeId)) return;
    jumpToNode(nodeId);
  };

  return (
    <div style={s.container}>
      <div style={s.backdrop} />

      <div style={s.inner}>
        {/* 标题栏 */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>📖 剧情索引</h1>
            <div style={s.subtitle}>
              已探索 <span style={{ color: '#ffd700', fontWeight: 700 }}>{visitedCount}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>/{totalNodeCount}</span> 个节点
              &nbsp;·&nbsp;结局收集 <span style={{ color: '#ff6b9d', fontWeight: 700 }}>{unlockedEndingCount}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>/{ALL_ENDINGS.length}</span>
            </div>
          </div>
          <button style={s.backBtn} onClick={onBack}>← 返回</button>
        </div>

        {/* 进度条 */}
        <div style={s.progressBar}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              ...s.progressFill,
              background: 'linear-gradient(90deg, #a080ff, #6b9dff, #ff6b9d)',
            }}
          />
          <span style={s.progressLabel}>{progress}%</span>
        </div>

        {/* 标签切换 */}
        <div style={s.tabs}>
          <button
            style={tab === 'timeline' ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setTab('timeline')}
          >
            🗺️ 剧情时间轴
          </button>
          <button
            style={tab === 'endings' ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setTab('endings')}
          >
            🏆 结局图鉴 ({unlockedEndingCount}/{ALL_ENDINGS.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 章节选择 */}
              <div style={s.chapterTabs}>
                {chapters.map((c) => {
                  const chNodes = getChapterNodes(c);
                  const chRead = chNodes.filter((n) => readNodes.includes(n.id)).length;
                  const isCurrent = c === (gameState?.currentChapter || 1);
                  return (
                    <button
                      key={c}
                      style={{
                        ...s.chapterTab,
                        ...(selectedChapter === c ? s.chapterTabActive : {}),
                        borderColor: isCurrent ? '#ffd700' : 'rgba(160,128,255,0.3)',
                      }}
                      onClick={() => setSelectedChapter(c)}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>{CHAPTER_NAMES[c] || `第${c}章`}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                        {chRead}/{chNodes.length}
                      </span>
                      {isCurrent && <span style={s.currentBadge}>📍当前</span>}
                    </button>
                  );
                })}
              </div>

              {/* 时间轴 */}
              <div style={s.timeline}>
                {chapterNodes.map((node, idx) => {
                  const isVisited = readNodes.includes(node.id);
                  const isCurrent = node.id === currentNodeId;
                  const isChoice = node.type === 'choice';
                  const isBattle = node.type === 'battle';
                  const isEnding = node.effects?.some(
                    (e) => (e.type === 'flag' && String(e.target).startsWith('ending_')) ||
                           (e.type === 'ending'),
                  );
                  const isDeadEnd = !node.next && !node.nextNode && !node.choices && !isEnding && !isBattle;

                  let dotColor = 'rgba(100,80,140,0.4)';
                  let dotIcon = '·';
                  if (isVisited) { dotColor = 'rgba(160,128,255,0.8)'; dotIcon = '✓'; }
                  if (isChoice && isVisited) { dotColor = '#ffd700'; dotIcon = '⇄'; }
                  if (isBattle && isVisited) { dotColor = '#ff6b6b'; dotIcon = '⚔'; }
                  if (isEnding) {
                    const endingFlag = node.effects?.find(
                      (e) => e.type === 'flag' && String(e.target).startsWith('ending_'),
                    );
                    const eid = endingFlag ? String(endingFlag.target) : '';
                    const unlocked = !!flags[eid];
                    dotColor = unlocked ? '#ff6b9d' : 'rgba(100,80,140,0.3)';
                    dotIcon = unlocked ? '🏁' : '🔒';
                  }
                  if (isCurrent) { dotColor = '#00e5ff'; dotIcon = '🎯'; }

                  return (
                    <div key={node.id} style={s.timelineItem}>
                      <div style={s.timelineLine}>
                        <div style={{
                          ...s.timelineDot,
                          background: dotColor,
                          boxShadow: isVisited ? `0 0 12px ${dotColor}` : 'none',
                          border: isCurrent ? '2px solid #fff' : 'none',
                        }}>
                          {dotIcon}
                        </div>
                        {idx < chapterNodes.length - 1 && (
                          <div style={{
                            ...s.timelineConnector,
                            background: isVisited
                              ? 'linear-gradient(180deg, rgba(160,128,255,0.5), rgba(160,128,255,0.1))'
                              : 'rgba(100,80,140,0.15)',
                          }} />
                        )}
                      </div>
                      <div style={{
                        ...s.timelineCard,
                        opacity: isVisited ? 1 : 0.45,
                        cursor: isVisited ? 'pointer' : 'default',
                        border: isCurrent
                          ? '1px solid #00e5ff'
                          : isEnding && flags[(node.effects?.find((e) => e.type === 'flag' && String(e.target).startsWith('ending_'))?.target as string) || '']
                            ? '1px solid #ff6b9d'
                            : '1px solid rgba(160,128,255,0.15)',
                        boxShadow: isCurrent
                          ? '0 0 20px rgba(0,229,255,0.3)'
                          : isVisited ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                      }}
                        onClick={() => handleJump(node.id)}
                      >
                        <div style={s.timelineCardHeader}>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isCurrent ? '#00e5ff'
                              : isChoice ? '#ffd700'
                              : isBattle ? '#ff6b6b'
                              : isEnding ? '#ff6b9d'
                              : isVisited ? 'rgba(220,200,255,0.9)' : 'rgba(160,140,200,0.5)',
                          }}>
                            {getNodeLabel(node)}
                          </span>
                          <span style={s.nodeIdBadge}>
                            {isCurrent && '📍当前'}
                            {isEnding && !isCurrent && '🏁结局'}
                            {isBattle && !isCurrent && '⚔战斗'}
                            {isDeadEnd && isVisited && !isCurrent && '●'}
                            {!isVisited && !isEnding && '🔒未探索'}
                            {isVisited && !isCurrent && !isBattle && !isEnding && !isChoice && '✓已读'}
                            {isChoice && isVisited && !isCurrent && '🔀分支'}
                          </span>
                        </div>
                        {isChoice && node.choices && (
                          <div style={s.choiceList}>
                            {node.choices.map((ch) => {
                              const chosen = gameState?.choiceHistory?.includes(ch.id);
                              return (
                                <div key={ch.id} style={{
                                  ...s.choiceItem,
                                  background: chosen ? 'rgba(255,215,0,0.15)' : 'rgba(80,60,120,0.2)',
                                  borderLeft: chosen ? '2px solid #ffd700' : '2px solid rgba(100,80,140,0.3)',
                                }}>
                                  <span style={{
                                    color: chosen ? '#ffd700' : 'rgba(180,160,220,0.6)',
                                    fontSize: '11px',
                                  }}>
                                    {chosen ? '✓ ' : '· '}
                                    {ch.text.replace(/「|」/g, '').slice(0, 40)}{ch.text.length > 40 ? '…' : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === 'endings' && (
            <motion.div
              key="endings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 结局类型分组 */}
              {(['good', 'bad', 'true', 'hidden'] as const).map((type) => {
                const endings = ALL_ENDINGS.filter((e) => e.type === type);
                const meta = getEndingMeta(type);
                const unlocked = endings.filter((e) => endingUnlocked[e.id]).length;
                return (
                  <div key={type} style={{ marginBottom: '28px' }}>
                    <div style={s.endingGroupHeader}>
                      <span style={{ fontSize: '20px' }}>{meta.icon}</span>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: meta.color,
                        textShadow: `0 0 15px ${meta.color}66`,
                        letterSpacing: '3px',
                      }}>{meta.label}</span>
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.4)',
                      }}>{unlocked}/{endings.length}</span>
                    </div>
                    <div style={s.endingGrid}>
                      {endings.map((ending) => {
                        const isUnlocked = endingUnlocked[ending.id];
                        return (
                          <motion.div
                            key={ending.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: isUnlocked ? 1.03 : 1 }}
                            style={{
                              ...s.endingCard,
                              opacity: isUnlocked ? 1 : 0.5,
                              borderColor: isUnlocked ? meta.color : 'rgba(100,80,140,0.2)',
                              boxShadow: isUnlocked ? `0 0 20px ${meta.color}22` : 'none',
                              background: isUnlocked
                                ? `linear-gradient(160deg, ${meta.color}22, rgba(10,5,20,0.9))`
                                : 'rgba(20,10,30,0.6)',
                            }}
                          >
                            <div style={{
                              fontSize: '36px',
                              textAlign: 'center',
                              filter: isUnlocked ? 'none' : 'grayscale(1) blur(2px)',
                              marginBottom: '8px',
                            }}>
                              {isUnlocked ? meta.icon : '🔒'}
                            </div>
                            <div style={{
                              fontSize: '15px',
                              fontWeight: 700,
                              color: isUnlocked ? meta.color : 'rgba(160,140,200,0.5)',
                              textAlign: 'center',
                              marginBottom: '4px',
                            }}>
                              {isUnlocked ? ending.name : '???'}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: isUnlocked ? 'rgba(255,255,255,0.5)' : 'rgba(120,100,160,0.4)',
                              textAlign: 'center',
                              marginBottom: '8px',
                            }}>
                              {isUnlocked ? ending.subtitle : '尚未解锁'}
                            </div>
                            {isUnlocked && (
                              <div style={{
                                fontSize: '11px',
                                color: 'rgba(200,180,255,0.6)',
                                lineHeight: 1.5,
                                maxHeight: '60px',
                                overflow: 'hidden',
                                textAlign: 'center',
                              }}>
                                {ending.description.slice(0, 80)}…
                              </div>
                            )}
                            {isUnlocked && ending.rewards.length > 0 && (
                              <div style={{
                                marginTop: '8px',
                                fontSize: '10px',
                                color: 'rgba(255,215,0,0.7)',
                                textAlign: 'center',
                                letterSpacing: '1px',
                              }}>
                                🏆 获得 {ending.rewards.length} 项奖励
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed', inset: 0, zIndex: 100,
    fontFamily: "'Noto Sans SC', sans-serif",
    overflowY: 'auto',
  },
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'radial-gradient(ellipse at 50% 20%, rgba(20,5,50,0.97) 0%, rgba(3,0,12,0.99) 100%)',
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  },
  inner: {
    width: '960px', maxWidth: '95vw', padding: '36px 24px 60px', margin: '0 auto',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px',
  },
  title: {
    fontSize: '32px', fontWeight: 700, margin: 0,
    background: 'linear-gradient(135deg, #e0c0ff, #a080ff, #80c0ff, #ff6b9d)',
    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '4px',
  },
  subtitle: {
    fontSize: '13px', color: 'rgba(200,180,255,0.7)', marginTop: '6px', letterSpacing: '1px',
  },
  backBtn: {
    padding: '10px 24px', fontSize: '13px', fontWeight: 600, color: '#c0a0ff',
    background: 'rgba(100,60,180,0.2)', border: '1px solid rgba(160,100,255,0.3)',
    borderRadius: '8px', cursor: 'pointer', letterSpacing: '2px',
    transition: 'all 0.2s',
  },
  progressBar: {
    width: '100%', height: '8px', background: 'rgba(60,40,100,0.3)',
    borderRadius: '4px', overflow: 'hidden', position: 'relative', marginBottom: '24px',
  },
  progressFill: {
    height: '100%', borderRadius: '4px',
    boxShadow: '0 0 10px rgba(160,128,255,0.6)',
  },
  progressLabel: {
    position: 'absolute', top: '-20px', right: '0', fontSize: '12px', color: 'rgba(255,255,255,0.6)',
  },
  tabs: {
    display: 'flex', gap: '12px', marginBottom: '24px',
  },
  tab: {
    padding: '10px 24px', fontSize: '14px', fontWeight: 600,
    color: 'rgba(180,160,220,0.7)',
    background: 'rgba(60,40,100,0.2)', border: '1px solid rgba(100,60,180,0.2)',
    borderRadius: '8px', cursor: 'pointer', letterSpacing: '2px',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#fff', background: 'linear-gradient(135deg, rgba(160,80,255,0.4), rgba(80,120,255,0.3))',
    border: '1px solid rgba(160,128,255,0.5)',
    boxShadow: '0 0 15px rgba(160,80,255,0.2)',
  },
  chapterTabs: {
    display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap',
  },
  chapterTab: {
    padding: '14px 24px',
    background: 'rgba(40,20,70,0.4)',
    border: '1px solid rgba(160,128,255,0.2)',
    borderRadius: '10px', cursor: 'pointer', color: 'rgba(200,180,255,0.7)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
    transition: 'all 0.2s', minWidth: '140px', position: 'relative',
  },
  chapterTabActive: {
    background: 'linear-gradient(135deg, rgba(100,40,200,0.4), rgba(60,30,140,0.5))',
    color: '#fff',
    boxShadow: '0 0 20px rgba(160,80,255,0.3)',
  },
  currentBadge: {
    position: 'absolute', top: '-8px', right: '-8px',
    background: '#ffd700', color: '#000', fontSize: '10px', fontWeight: 700,
    padding: '2px 8px', borderRadius: '10px',
  },
  timeline: {
    position: 'relative', paddingLeft: '4px',
  },
  timelineItem: {
    display: 'flex', gap: '16px', marginBottom: '6px',
  },
  timelineLine: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '24px', flexShrink: 0,
  },
  timelineDot: {
    width: '22px', height: '22px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', color: '#fff', fontWeight: 700,
    flexShrink: 0, zIndex: 1,
  },
  timelineConnector: {
    width: '2px', flexGrow: 1, minHeight: '16px',
  },
  timelineCard: {
    flexGrow: 1, padding: '10px 14px',
    background: 'rgba(20,10,40,0.5)',
    borderRadius: '8px', marginBottom: '6px',
    transition: 'all 0.2s',
  },
  timelineCardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
  },
  nodeIdBadge: {
    fontSize: '10px', color: 'rgba(160,140,200,0.6)', flexShrink: 0,
    background: 'rgba(60,40,100,0.4)', padding: '2px 8px', borderRadius: '4px',
    letterSpacing: '1px',
  },
  choiceList: {
    marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px',
  },
  choiceItem: {
    padding: '4px 8px', borderRadius: '4px', fontSize: '11px',
  },
  endingGroupHeader: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
    paddingBottom: '8px', borderBottom: '1px solid rgba(160,128,255,0.15)',
  },
  endingGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px',
  },
  endingCard: {
    padding: '20px 14px', borderRadius: '12px',
    border: '1px solid', transition: 'all 0.3s',
  },
};
