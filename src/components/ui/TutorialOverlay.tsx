/**
 * TutorialOverlay - 新手教程引导覆盖层
 *
 * 展示分步教程引导，帮助新玩家了解游戏机制。
 * 每一步高亮对应的游戏UI元素，并以玻璃面板形式展示说明。
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';

// ─── 教程步骤配置 ──────────────────────────────────────────────────────────

interface TutorialStepConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlightArea: React.CSSProperties;
  tooltipPosition: React.CSSProperties;
}

const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: 'dialogue',
    title: '点击推进对话',
    description:
      '在对话区域中点击鼠标左键或按下空格键，即可推进剧情对话。' +
      '文字会以打字机效果逐字显示，再次点击可立即显示完整文本。',
    icon: '💬',
    highlightArea: { bottom: '0', left: '0', width: '100%', height: '220px' },
    tooltipPosition: { bottom: '240px', left: '50%', transform: 'translateX(-50%)' },
  },
  {
    id: 'choices',
    title: '选择影响剧情',
    description:
      '当出现选项面板时，不同的选择会影响后续剧情走向和角色好感度。' +
      '部分选项需要满足特定条件才会出现，请慎重选择！',
    icon: '🔀',
    highlightArea: { top: '50%', left: '50%', width: '400px', height: '300px', transform: 'translate(-50%, -50%)' },
    tooltipPosition: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
  },
  {
    id: 'battle',
    title: '卡牌战斗基础',
    description:
      '战斗采用卡牌系统，每回合消耗能量打出卡牌。' +
      '攻击牌造成伤害，防御牌提供护盾，治疗牌恢复生命。' +
      '合理搭配卡组是取胜的关键！',
    icon: '⚔️',
    highlightArea: { top: '10%', left: '10%', width: '80%', height: '80%' },
    tooltipPosition: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
  {
    id: 'affection',
    title: '好感度系统',
    description:
      '通过对话选择和赠送礼物可以提升角色好感度。' +
      '好感度达到特定等级后，将解锁专属剧情、约会事件和特殊CG。' +
      '每位角色的好感度等级从「陌生人」到「灵魂伴侣」共6级。',
    icon: '💕',
    highlightArea: { top: '10px', right: '10px', width: '200px', height: '60px' },
    tooltipPosition: { top: '80px', right: '10px' },
  },
  {
    id: 'save',
    title: '存档方法',
    description:
      '按ESC键或点击菜单按钮打开游戏菜单，选择「保存」即可存档。' +
      '游戏支持20个存档位，并会在关键节点自动保存。' +
      '建议在重要选择前手动存档，方便体验不同路线。',
    icon: '💾',
    highlightArea: { top: '10px', left: '10px', width: '60px', height: '60px' },
    tooltipPosition: { top: '80px', left: '10px' },
  },
];

// ─── 样式 ──────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  pointerEvents: 'auto',
};

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
};

const tooltipBase: React.CSSProperties = {
  position: 'absolute',
  width: '360px',
  padding: '24px 28px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(20, 10, 50, 0.9) 0%, rgba(10, 5, 30, 0.95) 100%)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(160, 120, 255, 0.35)',
  boxShadow: '0 0 40px rgba(120, 80, 255, 0.2), inset 0 0 30px rgba(160, 120, 255, 0.05)',
  fontFamily: "'Noto Sans SC', sans-serif",
  color: 'rgba(230, 220, 255, 0.95)',
  zIndex: 10,
  textAlign: 'center' as const,
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '10px',
  background: 'linear-gradient(135deg, #c0a0ff, #80d0ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const descStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.7,
  color: 'rgba(200, 190, 230, 0.9)',
  marginBottom: '20px',
};

const stepIndicatorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(160, 140, 200, 0.7)',
  marginBottom: '16px',
  letterSpacing: '2px',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
};

const btnBase: React.CSSProperties = {
  padding: '10px 28px',
  fontSize: '14px',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid rgba(160, 120, 255, 0.4)',
  cursor: 'pointer',
  fontFamily: "'Noto Sans SC', sans-serif",
  letterSpacing: '2px',
  transition: 'all 0.25s ease',
};

const btnNext: React.CSSProperties = {
  ...btnBase,
  background: 'linear-gradient(135deg, rgba(100, 60, 200, 0.7), rgba(60, 30, 140, 0.9))',
  color: '#e0d0ff',
  boxShadow: '0 0 16px rgba(120, 80, 255, 0.3)',
};

const btnSkip: React.CSSProperties = {
  ...btnBase,
  background: 'rgba(30, 20, 50, 0.6)',
  color: 'rgba(160, 140, 200, 0.8)',
};

const highlightStyle: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '12px',
  border: '2px solid rgba(160, 120, 255, 0.6)',
  boxShadow: '0 0 20px rgba(120, 80, 255, 0.4), inset 0 0 20px rgba(120, 80, 255, 0.1)',
  pointerEvents: 'none',
};

// ─── 主组件 ────────────────────────────────────────────────────────────────

export const TutorialOverlay: React.FC = () => {
  const tutorial = useGameStore((s) => s.tutorial);
  const completeTutorialStep = useGameStore((s) => s.completeTutorialStep);
  const dismissTutorial = useGameStore((s) => s.dismissTutorial);

  const currentIndex = useMemo(() => {
    const idx = TUTORIAL_STEPS.findIndex((s) => s.id === tutorial.currentStepId);
    return idx >= 0 ? idx : 0;
  }, [tutorial.currentStepId]);

  const step = TUTORIAL_STEPS[currentIndex];
  const isLast = currentIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      dismissTutorial();
    } else {
      completeTutorialStep(step.id);
    }
  };

  const handleSkip = () => {
    dismissTutorial();
  };

  if (!tutorial.isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={overlayStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 半透明遮罩 */}
        <div style={backdropStyle} />

        {/* 高亮区域 */}
        <motion.div
          style={{
            ...highlightStyle,
            ...step.highlightArea,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          key={step.id}
        >
          {/* 脉冲光效 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '14px',
              border: '1px solid rgba(160, 120, 255, 0.3)',
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* 提示面板 */}
        <motion.div
          style={{
            ...tooltipBase,
            ...step.tooltipPosition,
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          key={`tooltip-${step.id}`}
        >
          {/* 图标 */}
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>{step.icon}</div>

          {/* 步骤指示器 */}
          <div style={stepIndicatorStyle}>
            {currentIndex + 1} / {TUTORIAL_STEPS.length}
          </div>

          {/* 标题 */}
          <div style={titleStyle}>{step.title}</div>

          {/* 说明 */}
          <div style={descStyle}>{step.description}</div>

          {/* 按钮 */}
          <div style={buttonRowStyle}>
            <motion.button
              style={btnSkip}
              whileHover={{ background: 'rgba(60, 40, 80, 0.8)', borderColor: 'rgba(180, 140, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
            >
              跳过教程
            </motion.button>
            <motion.button
              style={btnNext}
              whileHover={{
                boxShadow: '0 0 24px rgba(140, 100, 255, 0.5)',
                borderColor: 'rgba(180, 140, 255, 0.7)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
            >
              {isLast ? '开始冒险' : '下一步'}
            </motion.button>
          </div>

          {/* 进度条 */}
          <div
            style={{
              marginTop: '16px',
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(60, 40, 100, 0.5)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #a060ff, #60c0ff)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / TUTORIAL_STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* 角落装饰符文 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '11px',
            color: 'rgba(120, 100, 180, 0.4)',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '3px',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          TUTORIAL MODE
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
