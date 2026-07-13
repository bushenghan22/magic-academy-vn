import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../systems/store';

interface AchievementScreenProps {
  onBack: () => void;
}

export const AchievementScreen: React.FC<AchievementScreenProps> = ({ onBack }) => {
  const flags = useGameStore((s) => s.gameState?.flags ?? {});

  const items = useMemo(() => {
    const map: Record<string, { name: string; description: string }> = {
      ach_harem_ending: { name: '六花齐放', description: '达成后宫结局' },
      ach_true_ending: { name: '星辉永恒', description: '达成真结局' },
      ach_hidden_ending: { name: '时间的轮回', description: '达成隐藏结局' },
    };

    return Object.keys(map).map((id) => ({
      id,
      name: map[id].name,
      description: map[id].description,
      unlocked: !!flags[id],
    }));
  }, [flags]);

  const unlockedCount = items.filter((item) => item.unlocked).length;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans SC', sans-serif",
        overflowY: 'auto',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(20,5,50,0.95) 0%, rgba(5,0,15,0.98) 100%)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ width: '1000px', maxWidth: '95vw', padding: '40px 32px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '36px', fontWeight: 700, fontFamily: "'Cinzel', 'Orbitron', serif",
            background: 'linear-gradient(135deg, #e0c0ff, #a080ff, #80c0ff)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '8px', margin: 0,
          }}>
            成就
          </h1>
          <button style={{
            padding: '10px 28px', fontSize: '14px', fontWeight: 600, letterSpacing: '2px',
            border: '1px solid rgba(180,140,255,0.3)', borderRadius: '8px', cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(30,10,60,0.6), rgba(15,5,40,0.8))',
            color: 'rgba(220,200,255,0.9)', fontFamily: "'Noto Sans SC', sans-serif",
          }} onClick={onBack}>
            ← 返回
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px 20px',
          background: 'linear-gradient(135deg, rgba(25,10,55,0.5), rgba(12,6,30,0.6))',
          border: '1px solid rgba(120,80,220,0.15)', borderRadius: '10px',
        }}>
          <span style={{ fontSize: '13px', color: 'rgba(200,190,230,0.8)', letterSpacing: '1px', minWidth: '70px' }}>成就进度</span>
          <div style={{ flex: 1, height: '8px', background: 'rgba(40,20,80,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%', borderRadius: '4px',
                background: 'linear-gradient(90deg, #a060ff, #60c0ff)',
                boxShadow: '0 0 8px rgba(160,100,255,0.4)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((unlockedCount / Math.max(items.length, 1)) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(160,200,255,0.9)', fontFamily: "'Orbitron', sans-serif", minWidth: '48px', textAlign: 'right' }}>
            {unlockedCount}/{items.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              style={{
                padding: '18px',
                borderRadius: '10px',
                border: '1px solid rgba(120,80,220,0.2)',
                background: item.unlocked ? 'linear-gradient(135deg, rgba(50,20,100,0.5), rgba(30,10,60,0.7))' : 'linear-gradient(135deg, rgba(15,8,30,0.8), rgba(8,4,18,0.9))',
                color: item.unlocked ? 'rgba(220,200,255,0.95)' : 'rgba(120,100,180,0.6)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
            >
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{item.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.75 }}>{item.description}</div>
              <div style={{ marginTop: '10px', fontSize: '11px', letterSpacing: '1px' }}>
                {item.unlocked ? '已解锁' : '未解锁'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementScreen;
