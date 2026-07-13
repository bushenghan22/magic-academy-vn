/**
 * DateScene - 约会场景组件
 *
 * 全屏覆盖的约会互动场景。
 * 包含特殊对话样式、好感度提升、CG解锁、小游戏互动。
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import { CHARACTERS } from '../../data/characters';

// ─── Props ─────────────────────────────────────────────────────────────────

interface DateSceneProps {
  dateEventId: string;
  onComplete: () => void;
}

// ─── 约会事件数据（本地示例）────────────────────────────────────────────────

interface DateEvent {
  id: string;
  characterId: string;
  location: string;
  dialogues: { speaker: string; text: string }[];
  miniGame?: {
    type: 'gift' | 'quiz';
    question: string;
    options: { id: string; text: string; correct: boolean }[];
    rewardAffection: number;
    failAffection: number;
  };
  cgId?: string;
  baseAffection: number;
}

const DATE_EVENTS: Record<string, DateEvent> = {
  sakura_fireworks: {
    id: 'sakura_fireworks',
    characterId: 'sakura',
    location: '学院天台',
    dialogues: [
      { speaker: '星野樱', text: '这里就是学院看烟花最好的位置！我找了好久呢~' },
      { speaker: '旁白', text: '夜空中，五彩斑斓的烟花绽放，映照在樱明亮的眼眸中。' },
      { speaker: '星野樱', text: '你知道吗？在我们家族的传统里，和重要的人一起看烟花，是一种祝福。' },
      { speaker: '旁白', text: '微风吹过，樱的发梢轻轻飘动，空气中弥漫着淡淡的花香。' },
    ],
    miniGame: {
      type: 'quiz',
      question: '樱最喜欢的颜色是哪种烟花？',
      options: [
        { id: 'a', text: '红色 - 如同她的火焰', correct: true },
        { id: 'b', text: '蓝色 - 如同星空', correct: false },
        { id: 'c', text: '金色 - 如同太阳', correct: false },
      ],
      rewardAffection: 10,
      failAffection: 3,
    },
    cgId: 'sakura_cg_fireworks',
    baseAffection: 5,
  },
  rin_library: {
    id: 'rin_library',
    characterId: 'rin',
    location: '学院图书馆',
    dialogues: [
      { speaker: '月岛凛', text: '……你居然能找到这里。这是图书馆最安静的角落。' },
      { speaker: '旁白', text: '凛独自坐在窗边，月光透过玻璃洒在她翻开的书页上。' },
      { speaker: '月岛凛', text: '既然来了……就坐下吧。这本书很有趣，你可能会喜欢。' },
      { speaker: '旁白', text: '她将手中的书轻轻推到你面前，嘴角微微上扬。' },
    ],
    miniGame: {
      type: 'gift',
      question: '你想给凛带什么？',
      options: [
        { id: 'a', text: '一杯热绿茶', correct: true },
        { id: 'b', text: '一块巧克力蛋糕', correct: false },
        { id: 'c', text: '一束鲜花', correct: false },
      ],
      rewardAffection: 10,
      failAffection: 2,
    },
    cgId: 'rin_cg_library',
    baseAffection: 5,
  },
};

// ─── 样式 ──────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 8000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(5, 0, 15, 0.95), rgba(0, 0, 0, 0.98))',
  fontFamily: "'Noto Sans SC', sans-serif",
};

const locationBadge: React.CSSProperties = {
  position: 'absolute',
  top: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 24px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.7), rgba(30, 10, 50, 0.8))',
  border: '1px solid rgba(200, 140, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  fontSize: '14px',
  color: 'rgba(220, 200, 255, 0.9)',
  letterSpacing: '3px',
};

const dialogueBoxStyle: React.CSSProperties = {
  width: '700px',
  maxWidth: '90%',
  padding: '24px 32px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.9), rgba(8, 4, 20, 0.95))',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(200, 140, 255, 0.25)',
  boxShadow: '0 8px 40px rgba(120, 60, 200, 0.2)',
  textAlign: 'center' as const,
  color: 'rgba(220, 210, 250, 0.95)',
  fontSize: '15px',
  lineHeight: 1.8,
};

const optionBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '10px',
  border: '1px solid rgba(160, 120, 255, 0.3)',
  background: 'linear-gradient(135deg, rgba(20, 10, 45, 0.7), rgba(12, 6, 30, 0.85))',
  color: 'rgba(220, 210, 250, 0.9)',
  fontSize: '14px',
  fontFamily: "'Noto Sans SC', sans-serif",
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: 'all 0.25s ease',
};

const rewardStyle: React.CSSProperties = {
  padding: '20px 28px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(50, 20, 70, 0.9), rgba(25, 10, 40, 0.95))',
  border: '1px solid rgba(200, 140, 255, 0.35)',
  textAlign: 'center' as const,
  boxShadow: '0 0 40px rgba(160, 100, 255, 0.2)',
};

// ─── 主组件 ────────────────────────────────────────────────────────────────

export const DateScene: React.FC<DateSceneProps> = ({ dateEventId, onComplete }) => {
  const addAffection = useGameStore((s) => s.addAffection);
  const unlockCG = useGameStore((s) => s.unlockCG);

  const event = useMemo(() => DATE_EVENTS[dateEventId], [dateEventId]);
  const character = useMemo(
    () => (event ? CHARACTERS[event.characterId] : null),
    [event],
  );

  const [phase, setPhase] = useState<'dialogue' | 'minigame' | 'reward' | 'complete'>('dialogue');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [miniGameResult, setMiniGameResult] = useState<'correct' | 'wrong' | null>(null);
  const [cgUnlocked, setCgUnlocked] = useState(false);

  // 如果找不到事件数据
  if (!event || !character) {
    return (
      <div style={overlayStyle}>
        <div style={{ color: 'rgba(200,180,230,0.7)', fontSize: '16px' }}>
          约会事件「{dateEventId}」加载中...
        </div>
      </div>
    );
  }

  const accentColor = character.element.color;

  const handleAdvanceDialogue = () => {
    if (dialogueIndex < event.dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else if (event.miniGame) {
      setPhase('minigame');
    } else {
      applyRewards();
      setPhase('reward');
    }
  };

  const handleMiniGameAnswer = (optionId: string) => {
    const option = event.miniGame!.options.find((o) => o.id === optionId);
    if (!option) return;

    if (option.correct) {
      setMiniGameResult('correct');
      addAffection(event.characterId, event.miniGame!.rewardAffection);
    } else {
      setMiniGameResult('wrong');
      addAffection(event.characterId, event.miniGame!.failAffection);
    }

    setTimeout(() => {
      applyRewards();
      setPhase('reward');
    }, 1500);
  };

  const applyRewards = () => {
    addAffection(event.characterId, event.baseAffection);
    if (event.cgId) {
      unlockCG(event.cgId);
      setCgUnlocked(true);
    }
  };

  const handleComplete = () => {
    setPhase('complete');
    onComplete();
  };

  const currentDialogue = event.dialogues[dialogueIndex];

  return (
    <AnimatePresence>
      <motion.div
        style={overlayStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 背景装饰 */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, ${accentColor}15, transparent 60%)`,
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* 地点标签 */}
        <motion.div
          style={locationBadge}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          📍 {event.location}
        </motion.div>

        {/* 对话阶段 */}
        {phase === 'dialogue' && (
          <motion.div
            style={{ ...dialogueBoxStyle, cursor: 'pointer' }}
            onClick={handleAdvanceDialogue}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            key={`dialogue-${dialogueIndex}`}
            transition={{ duration: 0.4 }}
          >
            {/* 说话人 */}
            {currentDialogue.speaker !== '旁白' && (
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: accentColor,
                  marginBottom: '10px',
                  letterSpacing: '2px',
                  textShadow: `0 0 10px ${accentColor}40`,
                }}
              >
                {currentDialogue.speaker}
              </div>
            )}
            {/* 文本 */}
            <div style={{ fontStyle: currentDialogue.speaker === '旁白' ? 'italic' : 'normal' }}>
              {currentDialogue.text}
            </div>
            {/* 进度提示 */}
            <div
              style={{
                marginTop: '16px',
                fontSize: '11px',
                color: 'rgba(140, 120, 180, 0.5)',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '2px',
              }}
            >
              {dialogueIndex + 1} / {event.dialogues.length} ▸
            </div>
          </motion.div>
        )}

        {/* 小游戏阶段 */}
        {phase === 'minigame' && event.miniGame && (
          <motion.div
            style={{ ...dialogueBoxStyle, maxWidth: '500px' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ fontSize: '12px', color: 'rgba(200, 140, 255, 0.7)', marginBottom: '12px', letterSpacing: '2px' }}>
              {event.miniGame.type === 'gift' ? '🎁 选择礼物' : '❓ 回答问题'}
            </div>
            <div style={{ fontSize: '16px', marginBottom: '20px', fontWeight: 600 }}>
              {event.miniGame.question}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {event.miniGame.options.map((option) => {
                const isResult = miniGameResult !== null;
                const isCorrect = option.correct;
                let bg = optionBtnStyle.background;
                let borderColor = 'rgba(160, 120, 255, 0.3)';

                if (isResult && isCorrect) {
                  bg = 'linear-gradient(135deg, rgba(20, 60, 30, 0.8), rgba(10, 40, 20, 0.9))';
                  borderColor = 'rgba(80, 220, 120, 0.6)';
                } else if (isResult && !isCorrect && miniGameResult === 'wrong' && option.id === event.miniGame!.options.find(o => !o.correct)?.id) {
                  // only show wrong feedback on the selected wrong one
                }

                return (
                  <motion.button
                    key={option.id}
                    style={{ ...optionBtnStyle, background: bg, borderColor }}
                    whileHover={isResult ? {} : { borderColor: 'rgba(200, 160, 255, 0.6)', x: 4 }}
                    whileTap={isResult ? {} : { scale: 0.98 }}
                    onClick={() => !isResult && handleMiniGameAnswer(option.id)}
                    disabled={isResult}
                  >
                    {option.text}
                    {isResult && isCorrect && ' ✓'}
                  </motion.button>
                );
              })}
            </div>
            {miniGameResult && (
              <motion.div
                style={{ marginTop: '16px', fontSize: '14px', fontWeight: 600 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {miniGameResult === 'correct' ? (
                  <span style={{ color: '#80ffa0' }}>回答正确！好感度大幅提升 ✨</span>
                ) : (
                  <span style={{ color: '#ffa080' }}>不太对呢……不过也没关系~</span>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 奖励阶段 */}
        {phase === 'reward' && (
          <motion.div
            style={rewardStyle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>💕</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: accentColor, marginBottom: '8px' }}>
              约会完成！
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(200, 190, 230, 0.8)', marginBottom: '6px' }}>
              {character.name} 好感度 +{event.baseAffection + (miniGameResult === 'correct' ? event.miniGame!.rewardAffection : (event.miniGame?.failAffection ?? 0))}
            </div>
            {cgUnlocked && (
              <motion.div
                style={{ fontSize: '13px', color: '#ffd080', marginTop: '8px' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🎨 解锁了新CG！
              </motion.div>
            )}
            <motion.button
              style={{
                marginTop: '20px',
                padding: '10px 36px',
                borderRadius: '8px',
                border: '1px solid rgba(200, 140, 255, 0.4)',
                background: 'linear-gradient(135deg, rgba(80, 40, 140, 0.7), rgba(50, 20, 100, 0.9))',
                color: 'rgba(230, 220, 255, 0.95)',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Noto Sans SC', sans-serif",
                cursor: 'pointer',
                letterSpacing: '2px',
              }}
              whileHover={{ boxShadow: '0 0 20px rgba(160, 100, 255, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleComplete}
            >
              继续
            </motion.button>
          </motion.div>
        )}

        {/* 底部角色名 */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            fontFamily: "'Orbitron', sans-serif",
            color: 'rgba(140, 120, 180, 0.4)',
            letterSpacing: '3px',
          }}
        >
          DATE EVENT — {character.nameEn.toUpperCase()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DateScene;
