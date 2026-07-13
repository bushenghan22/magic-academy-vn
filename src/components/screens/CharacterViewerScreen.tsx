import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import {
  CHARACTERS,
  getAllCharacters,
  getCurrentAffectionLevel,
} from '../../data/characters';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface CharacterViewerScreenProps {
  onBack: () => void;
}

// ─── 技能类型图标映射 ────────────────────────────────────────────────────

const SKILL_TYPE_ICONS: Record<string, string> = {
  attack: '⚔️',
  defense: '🛡️',
  support: '💫',
  ultimate: '🌟',
};

const SKILL_TYPE_LABELS: Record<string, string> = {
  attack: '攻击',
  defense: '防御',
  support: '辅助',
  ultimate: '奥义',
};

// ─── 样式 ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    fontFamily: "'Noto Sans SC', sans-serif",
    overflow: 'hidden',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 30%, rgba(20,5,50,0.95) 0%, rgba(5,0,15,0.98) 100%)',
    backdropFilter: 'blur(8px)',
    zIndex: -1,
  },
  inner: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: '32px',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexShrink: 0,
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
  leftPanel: {
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  characterList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  charListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid rgba(120,80,220,0.1)',
    transition: 'all 0.3s ease',
  },
  charListItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid rgba(160,120,255,0.4)',
    background: 'linear-gradient(135deg, rgba(40,18,80,0.6), rgba(20,8,45,0.8))',
    boxShadow: '0 0 16px rgba(120,80,220,0.15)',
  },
  charPortrait: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    border: '2px solid rgba(120,80,220,0.2)',
  },
  charListName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.9)',
  },
  charListTitle: {
    fontSize: '11px',
    color: 'rgba(160,140,200,0.6)',
    marginTop: '2px',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto',
    paddingRight: '8px',
  },
  spriteArea: {
    width: '100%',
    height: '240px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    position: 'relative' as const,
    overflow: 'hidden',
    border: '1px solid rgba(120,80,220,0.15)',
  },
  spritePlaceholder: {
    fontSize: '64px',
    opacity: 0.3,
    zIndex: 1,
  },
  spriteOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 80%, transparent 30%, rgba(0,0,0,0.3) 100%)',
    zIndex: 2,
  },
  charName: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'rgba(230,210,255,0.95)',
    marginBottom: '4px',
    letterSpacing: '4px',
  },
  charNameEn: {
    fontSize: '13px',
    fontFamily: "'Orbitron', sans-serif",
    color: 'rgba(140,130,200,0.5)',
    letterSpacing: '2px',
    marginBottom: '8px',
  },
  charTitleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 14px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  elementBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    marginLeft: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '16px',
  },
  personalityTag: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'rgba(200,180,240,0.8)',
    background: 'rgba(40,20,80,0.4)',
    border: '1px solid rgba(120,80,220,0.15)',
  },
  descriptionBox: {
    padding: '14px 18px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
    border: '1px solid rgba(120,80,220,0.12)',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '13px',
    color: 'rgba(200,190,230,0.8)',
    lineHeight: 1.8,
    maxHeight: '120px',
    overflowY: 'auto' as const,
  },
  affectionSection: {
    marginBottom: '20px',
    padding: '14px 18px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
    border: '1px solid rgba(120,80,220,0.12)',
    borderRadius: '10px',
  },
  affectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  affectionLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(200,180,240,0.85)',
    letterSpacing: '1px',
  },
  affectionLevel: {
    fontSize: '12px',
    color: 'rgba(255,180,200,0.8)',
    padding: '2px 10px',
    borderRadius: '10px',
    background: 'rgba(80,30,60,0.4)',
    border: '1px solid rgba(255,120,160,0.2)',
  },
  affectionTrack: {
    width: '100%',
    height: '10px',
    background: 'rgba(40,20,80,0.5)',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  affectionFill: {
    height: '100%',
    borderRadius: '5px',
    background: 'linear-gradient(90deg, #ff80a0, #ff60c0, #ffa0e0)',
    boxShadow: '0 0 8px rgba(255,100,180,0.4)',
    transition: 'width 0.5s ease',
  },
  affectionValue: {
    fontSize: '12px',
    color: 'rgba(255,180,200,0.7)',
    textAlign: 'right' as const,
    fontFamily: "'Orbitron', sans-serif",
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  infoCard: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
    border: '1px solid rgba(120,80,220,0.12)',
    borderRadius: '10px',
  },
  infoCardTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(160,140,200,0.7)',
    marginBottom: '8px',
    letterSpacing: '1px',
  },
  infoItem: {
    fontSize: '12px',
    color: 'rgba(200,190,230,0.75)',
    padding: '2px 0',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(200,170,255,0.9)',
    marginBottom: '12px',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  skillList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '20px',
  },
  skillItem: {
    padding: '10px 14px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
    border: '1px solid rgba(120,80,220,0.12)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  skillIcon: {
    fontSize: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(40,20,80,0.4)',
    flexShrink: 0,
  },
  skillName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.9)',
  },
  skillDesc: {
    fontSize: '11px',
    color: 'rgba(180,160,220,0.65)',
    marginTop: '2px',
    lineHeight: 1.4,
  },
  skillPower: {
    fontSize: '10px',
    color: 'rgba(100,180,255,0.6)',
    marginTop: '2px',
    fontFamily: "'Orbitron', sans-serif",
  },
  routeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '20px',
  },
  routeItem: {
    padding: '10px 14px',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
    border: '1px solid rgba(120,80,220,0.12)',
    borderRadius: '8px',
  },
  routeName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(220,200,255,0.85)',
    marginBottom: '2px',
  },
  routeDesc: {
    fontSize: '11px',
    color: 'rgba(160,140,200,0.6)',
    lineHeight: 1.4,
  },
  routeBadge: {
    fontSize: '10px',
    padding: '1px 8px',
    borderRadius: '8px',
    marginLeft: '8px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    color: 'rgba(120,100,180,0.4)',
    fontSize: '16px',
    letterSpacing: '2px',
  },
};

// ─── 性格标签提取 ────────────────────────────────────────────────────────

function extractPersonalityTags(personality: string): string[] {
  const patterns = ['热情', '开朗', '冷静', '温柔', '高傲', '活泼', '沉默', '稳重',
    '可爱', '善良', '内向', '自信', '好胜', '冲动', '理性', '冒失', '认真', '天然'];
  return patterns.filter((p) => personality.includes(p)).slice(0, 5);
}

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const CharacterViewerScreen: React.FC<CharacterViewerScreenProps> = ({ onBack }) => {
  const gameState = useGameStore((s) => s.gameState);
  const affections = gameState?.affection ?? {};

  const characters = useMemo(() => getAllCharacters(), []);
  const [selectedId, setSelectedId] = useState<string>(characters[0]?.id ?? '');

  const selectedChar = CHARACTERS[selectedId] ?? null;

  // 当前好感度
  const currentAffection = affections[selectedId] ?? selectedChar?.defaultAffection ?? 0;

  // 当前好感度等级
  const affectionLevel = useMemo(() => {
    if (!selectedChar) return null;
    try {
      return getCurrentAffectionLevel(selectedId, currentAffection);
    } catch {
      return null;
    }
  }, [selectedId, currentAffection, selectedChar]);

  // 性格标签
  const personalityTags = useMemo(() => {
    if (!selectedChar) return [];
    return extractPersonalityTags(selectedChar.personality);
  }, [selectedChar]);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{`
        .char-list-item:hover {
          background: linear-gradient(135deg, rgba(30,12,60,0.4), rgba(15,6,35,0.6)) !important;
          border-color: rgba(140,100,220,0.3) !important;
        }
      `}</style>
      <div style={styles.backdrop} />

      <div style={styles.inner}>
        {/* ── 左侧面板：角色列表 ──────────────────────────────── */}
        <div style={styles.leftPanel}>
          <div style={styles.header}>
            <h1 style={{ ...styles.title, fontSize: '28px' }}>角色图鉴</h1>
            <button style={styles.backButton} onClick={onBack}>
              ← 返回
            </button>
          </div>

          <div style={styles.characterList}>
            {characters.map((char) => {
              const isActive = char.id === selectedId;
              const bgGradient = isActive
                ? undefined
                : { background: 'linear-gradient(135deg, rgba(20,8,45,0.3), rgba(10,5,25,0.4))' };

              return (
                <motion.div
                  key={char.id}
                  className="char-list-item"
                  style={{
                    ...(isActive ? styles.charListItemActive : styles.charListItem),
                    ...bgGradient,
                  }}
                  onClick={() => setSelectedId(char.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      ...styles.charPortrait,
                      background: `linear-gradient(135deg, ${char.element.color}30, ${char.element.color}10)`,
                      borderColor: isActive ? `${char.element.color}60` : undefined,
                    }}
                  >
                    {char.element.icon}
                  </div>
                  <div>
                    <div style={styles.charListName}>{char.name}</div>
                    <div style={styles.charListTitle}>{char.title}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── 右侧面板：角色详情 ──────────────────────────────── */}
        <div style={styles.rightPanel}>
          <AnimatePresence mode="wait">
            {selectedChar ? (
              <motion.div
                key={selectedChar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 立绘区域 */}
                <div
                  style={{
                    ...styles.spriteArea,
                    background: `linear-gradient(135deg, ${selectedChar.element.color}15, ${selectedChar.element.color}05, rgba(5,0,15,0.9))`,
                  }}
                >
                  <div style={styles.spriteOverlay} />
                  <div style={styles.spritePlaceholder}>
                    {selectedChar.element.icon}
                  </div>
                </div>

                {/* 基本信息 */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={styles.charName}>{selectedChar.name}</span>
                  <span
                    style={{
                      ...styles.elementBadge,
                      background: `${selectedChar.element.color}20`,
                      color: selectedChar.element.color,
                    }}
                  >
                    {selectedChar.element.icon} {selectedChar.element.name}
                  </span>
                </div>
                <div style={styles.charNameEn}>{selectedChar.nameEn}</div>
                <div
                  style={{
                    ...styles.charTitleBadge,
                    background: 'linear-gradient(135deg, rgba(60,30,100,0.5), rgba(30,15,60,0.7))',
                    border: '1px solid rgba(120,80,220,0.25)',
                    color: 'rgba(200,180,240,0.9)',
                  }}
                >
                  ✦ {selectedChar.title}
                </div>

                {/* 性格标签 */}
                <div style={styles.tagsRow}>
                  {personalityTags.map((tag) => (
                    <span key={tag} style={styles.personalityTag}>{tag}</span>
                  ))}
                </div>

                {/* 角色简介 */}
                <div style={styles.descriptionBox}>
                  {selectedChar.description}
                </div>

                {/* 好感度 */}
                <div style={styles.affectionSection}>
                  <div style={styles.affectionHeader}>
                    <span style={styles.affectionLabel}>💖 好感度</span>
                    {affectionLevel && (
                      <span style={styles.affectionLevel}>
                        {affectionLevel.displayName}
                      </span>
                    )}
                  </div>
                  <div style={styles.affectionTrack}>
                    <motion.div
                      style={{
                        ...styles.affectionFill,
                        width: `${currentAffection}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentAffection}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <div style={styles.affectionValue}>{currentAffection} / 100</div>
                </div>

                {/* 基本资料 */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <div style={styles.infoCardTitle}>📋 基本资料</div>
                    <div style={styles.infoItem}>年龄：{selectedChar.age}岁</div>
                    <div style={styles.infoItem}>生日：{selectedChar.birthday}</div>
                    <div style={styles.infoItem}>星座：{selectedChar.zodiac}</div>
                    <div style={styles.infoItem}>身高：{selectedChar.height}cm</div>
                    <div style={styles.infoItem}>血型：{selectedChar.bloodType}</div>
                  </div>
                  <div style={styles.infoCard}>
                    <div style={styles.infoCardTitle}>🏫 所属</div>
                    <div style={styles.infoItem}>{selectedChar.affiliation}</div>
                  </div>
                </div>

                {/* 喜好 */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <div style={styles.infoCardTitle}>💚 喜欢</div>
                    {selectedChar.likes.map((item) => (
                      <div key={item} style={styles.infoItem}>· {item}</div>
                    ))}
                  </div>
                  <div style={styles.infoCard}>
                    <div style={styles.infoCardTitle}>💔 讨厌</div>
                    {selectedChar.dislikes.map((item) => (
                      <div key={item} style={styles.infoItem}>· {item}</div>
                    ))}
                  </div>
                </div>

                {/* 技能列表 */}
                <div style={styles.sectionTitle}>
                  <span>⚡</span> 魔法技能
                </div>
                <div style={styles.skillList}>
                  {selectedChar.skills.map((skill) => (
                    <div key={skill.id} style={styles.skillItem}>
                      <div style={styles.skillIcon}>
                        {SKILL_TYPE_ICONS[skill.type] ?? '✨'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.skillName}>
                          {skill.name}
                          <span style={{
                            fontSize: '10px',
                            color: 'rgba(140,120,200,0.5)',
                            marginLeft: '8px',
                          }}>
                            [{SKILL_TYPE_LABELS[skill.type] ?? skill.type}]
                          </span>
                        </div>
                        <div style={styles.skillDesc}>{skill.description}</div>
                        <div style={styles.skillPower}>
                          威力 {skill.power} | 消耗 MP {skill.mpCost}
                          {skill.unlockAffection > 0 && (
                            <span> | 解锁好感度 {skill.unlockAffection}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 故事路线 */}
                <div style={styles.sectionTitle}>
                  <span>📖</span> 故事路线
                </div>
                <div style={styles.routeList}>
                  {selectedChar.routes.map((route) => (
                    <div key={route.id} style={styles.routeItem}>
                      <div style={styles.routeName}>
                        {route.name}
                        {route.isGoodEnding && (
                          <span
                            style={{
                              ...styles.routeBadge,
                              background: 'rgba(80,180,100,0.2)',
                              color: 'rgba(140,220,160,0.8)',
                              border: '1px solid rgba(80,180,100,0.2)',
                            }}
                          >
                            好结局
                          </span>
                        )}
                        <span
                          style={{
                            ...styles.routeBadge,
                            background: 'rgba(100,80,180,0.2)',
                            color: 'rgba(160,140,220,0.7)',
                          }}
                        >
                          好感度 ≥{route.minAffection}
                        </span>
                      </div>
                      <div style={styles.routeDesc}>{route.description}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div style={styles.emptyState}>
                请选择一个角色
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterViewerScreen;
