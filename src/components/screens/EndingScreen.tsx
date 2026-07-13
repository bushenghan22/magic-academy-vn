import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../systems/store';
import { ENDINGS, type Ending } from '../../data/endings';

interface EndingScreenProps {
  onTitle: () => void;
  onLoad: () => void;
}

const ENDING_META: Record<string, { name: string; subtitle: string; description: string; type: Ending['type']; cgBg: string; accentColor: string; icon: string }> = {
  sakura_good: { name: '永恒的火焰之誓', subtitle: '与星野樱的幸福未来', description: '你与樱的感情在火焰祭坛的见证下开花结果。两人携手并肩，共同守护着彼此和星辉魔法学院。樱的火焰因爱而更加炽热，而你也找到了愿意用一生守护的人。', type: 'good', cgBg: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 40%, #6b1515 100%)', accentColor: '#ff6b35', icon: '🔥' },
  rin_good: { name: '永恒冰晶之约', subtitle: '与月岛凛的温暖未来', description: '你融化了凛心中的坚冰，让她学会了信任与爱。冰之花园不再是秘密，而是两人共同的避风港。凛用永恒冰晶保存着每一个与你共度的美好瞬间。', type: 'good', cgBg: 'linear-gradient(135deg, #050a1a 0%, #0a1a3d 40%, #15306b 100%)', accentColor: '#6ec6ff', icon: '❄️' },
  suzu_good: { name: '风之精灵的祝福', subtitle: '与风间铃的欢乐未来', description: '你与铃的笑声成为了学院最美的风景。风精灵们见证了你们的爱情，赐予了永远陪伴的祝福。铃的风不再漂泊，因为她找到了归宿——你的怀抱。', type: 'good', cgBg: 'linear-gradient(135deg, #051a0a 0%, #0a3d1a 40%, #156b2a 100%)', accentColor: '#7fff6e', icon: '🍀' },
  aoi_good: { name: '大地的永恒誓言', subtitle: '与石神葵的坚定未来', description: '你成为了葵心中最珍贵的存在，比任何矿石都要闪耀。大地见证了你们的爱情，磐石山顶的誓言将永远铭刻在时间之中。', type: 'good', cgBg: 'linear-gradient(135deg, #1a1505 0%, #3d2f0a 40%, #6b5515 100%)', accentColor: '#d4a843', icon: '💎' },
  yuzu_good: { name: '雷电中的永恒之光', subtitle: '与天音柚的闪耀未来', description: '你成为了柚生命中最耀眼的存在，比任何闪电都要夺目。雷电不再是孤独的闪光，而是两人共同谱写的乐章。', type: 'good', cgBg: 'linear-gradient(135deg, #1a1505 0%, #3d300a 40%, #8b6914 100%)', accentColor: '#ffd700', icon: '⚡' },
  mashiro_good: { name: '圣光中的永恒祝福', subtitle: '与白石真白的光明未来', description: '你成为了真白心中最温暖的光，照亮了她前行的道路。圣光仪式见证了你们的爱情，光精灵们降下了最真挚的祝福。', type: 'good', cgBg: 'linear-gradient(135deg, #1a1520 0%, #3d3050 40%, #6b5a80 100%)', accentColor: '#ffe4b5', icon: '✨' },
  sakura_bad: { name: '熄灭的火焰', subtitle: '与星野樱的遗憾离别', description: '因为好感度不足或关键选择失误，你与樱的关系渐行渐远。火焰祭坛的光芒黯淡，樱独自一人走向了远方。曾经炽热的感情，最终化为了灰烬。', type: 'bad', cgBg: 'linear-gradient(135deg, #0a0000 0%, #1a0505 50%, #2a0a0a 100%)', accentColor: '#8b3030', icon: '💨' },
  rin_bad: { name: '融化的冰晶', subtitle: '与月岛凛的无声告别', description: '你未能走进凛的内心世界，冰之花园的大门永远地关闭了。凛回到了一个人的世界，那些曾经的温暖瞬间，如同融化的冰晶般消失无踪。', type: 'bad', cgBg: 'linear-gradient(135deg, #000510 0%, #050a1a 50%, #0a1025 100%)', accentColor: '#406880', icon: '💧' },
  suzu_bad: { name: '消散的风', subtitle: '与风间铃的渐行渐远', description: '你没有珍惜与铃在一起的时光，风精灵们带走了它们的祝福。铃的笑容变得勉强，最终像风一样消失在你的世界里。', type: 'bad', cgBg: 'linear-gradient(135deg, #001005 0%, #051a0a 50%, #0a2510 100%)', accentColor: '#408050', icon: '🍂' },
  aoi_bad: { name: '碎裂的矿石', subtitle: '与石神葵的沉默离别', description: '你未能理解葵沉默背后的温柔，大地之心碎裂成了无数碎片。葵回到了矿洞深处，将自己封闭在岩石的堡垒中。', type: 'bad', cgBg: 'linear-gradient(135deg, #101005 0%, #1a1a08 50%, #25250a 100%)', accentColor: '#806840', icon: '🪨' },
  yuzu_bad: { name: '暗淡的雷光', subtitle: '与天音柚的遗憾错过', description: '你没有回应柚的热情，她眼中的光芒逐渐黯淡。曾经闪耀如闪电的女孩，变得沉默寡言，最终消失在茫茫人海中。', type: 'bad', cgBg: 'linear-gradient(135deg, #100d05 0%, #1a1508 50%, #25200a 100%)', accentColor: '#807040', icon: '🌧️' },
  mashiro_bad: { name: '黯淡的圣光', subtitle: '与白石真白的温柔离别', description: '你没有珍惜真白的温柔，她心中的光芒逐渐黯淡。教堂的祈祷变得空洞，曾经温暖的圣光只剩下冰冷的余晖。', type: 'bad', cgBg: 'linear-gradient(135deg, #0f0a15 0%, #1a1025 50%, #251835 100%)', accentColor: '#706888', icon: '🕯️' },
  harem: { name: '星辉后宫·六花齐放', subtitle: '与六位少女的永恒誓约', description: '当所有六位少女的好感度都达到满级，且在最终选择时做出了"想要守护所有人"的抉择——你将解锁这个终极结局。七人缔结了永恒的羁绊，共同成为星辉魔法学院新的传说。', type: 'hidden', cgBg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 30%, #5b2c8f 60%, #b24592 100%)', accentColor: '#ff9ff3', icon: '👑' },
  true: { name: '星辉永恒', subtitle: '光与影的协奏曲', description: '你不是用封印来解决暗影之力，而是用理解和爱来净化它。羁绊之力连接了六种元素，星辉魔法学院真正成为了所有元素和谐共存的圣地。', type: 'true', cgBg: 'linear-gradient(135deg, #0a0520 0%, #1a1060 30%, #3d2ab0 60%, #8b5cf6 100%)', accentColor: '#c4b5fd', icon: '⭐' },
  hidden: { name: '超越命运的奇迹', subtitle: '永远的星辉', description: '你超越了命运的轮回，打破了千年的诅咒。从今以后，你的灵魂将获得自由——不再是命运的棋子，而是自己人生的主角。星辉魔法学院的故事到此落幕，但属于你们的故事永不落幕。', type: 'hidden', cgBg: 'linear-gradient(135deg, #000000 0%, #0a0520 30%, #1a1060 60%, #ffffff 100%)', accentColor: '#ffffff', icon: '🌟' },
  dark: { name: '暗影吞噬', subtitle: 'BAD END - 绝望的深渊', description: '你在最终决战中败北，暗影之王艾利奥斯彻底吞噬了你的星辉之力。黑暗笼罩了世界，同伴们的呼唤声越来越远……你的意识沉入了无尽的黑暗之中。', type: 'bad', cgBg: 'linear-gradient(135deg, #000000 0%, #0a0010 50%, #150020 100%)', accentColor: '#6b0080', icon: '💀' },
  normal: { name: '平凡的魔法师', subtitle: 'NORMAL END - 各自的道路', description: '战争结束了，暗影之王被再次封印。你没有在六位少女中做出选择，大家以同伴的身份各自前行。虽然没有轰轰烈烈的爱情，但这段在星辉魔法学院的日子，将成为你心中最珍贵的回忆。', type: 'good', cgBg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #2a2a3e 100%)', accentColor: '#a0a8c0', icon: '🌙' },
};

export function EndingScreen({ onTitle, onLoad }: EndingScreenProps) {
  const { gameState, returnToTitle } = useGameStore();
  const [phase, setPhase] = useState<'bgm_fade' | 'title_reveal' | 'desc_reveal' | 'buttons'>('bgm_fade');

  const endingId = gameState?.currentEndingId ?? '';
  const meta = ENDING_META[endingId] ?? ENDING_META.normal;

  const endingData = useMemo<Ending | undefined>(() => {
    return ENDINGS.find(e => e.id === `ending_${endingId}`);
  }, [endingId]);

  const isBad = meta.type === 'bad';

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('title_reveal'), 1200);
    const t2 = setTimeout(() => setPhase('desc_reveal'), 3200);
    const t3 = setTimeout(() => setPhase('buttons'), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleReturn = () => {
    returnToTitle();
    onTitle();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: meta.cgBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cinzel', 'Noto Sans SC', sans-serif",
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 星光粒子层 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(2px 2px at 20% 30%, ${meta.accentColor}40, transparent),
                          radial-gradient(1px 1px at 60% 70%, ${meta.accentColor}60, transparent),
                          radial-gradient(2px 2px at 80% 20%, ${meta.accentColor}30, transparent),
                          radial-gradient(1px 1px at 40% 80%, ${meta.accentColor}50, transparent),
                          radial-gradient(1px 1px at 90% 50%, ${meta.accentColor}40, transparent)`,
        backgroundSize: '300px 300px',
        animation: 'starTwinkle 8s ease-in-out infinite alternate',
      }} />

      {/* 顶部光芒 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: phase !== 'bgm_fade' ? 0.3 : 0, scale: 3 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${meta.accentColor}60 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* 结局类型标签 */}
      <AnimatePresence>
        {phase !== 'bgm_fade' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.4em',
              color: meta.accentColor,
              textTransform: 'uppercase',
              marginBottom: '24px',
              textShadow: `0 0 20px ${meta.accentColor}80`,
            }}
          >
            {isBad ? '— BAD END —' : meta.type === 'hidden' ? '— HIDDEN END —' : meta.type === 'true' ? '— TRUE END —' : '— END —'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结局图标 */}
      <AnimatePresence>
        {phase !== 'bgm_fade' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.5 }}
            style={{ fontSize: '4rem', marginBottom: '16px', filter: `drop-shadow(0 0 20px ${meta.accentColor})` }}
          >
            {meta.icon}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结局标题 */}
      <AnimatePresence>
        {(phase === 'title_reveal' || phase === 'desc_reveal' || phase === 'buttons') && (
          <motion.h1
            initial={{ opacity: 0, y: 30, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#fff',
              textShadow: `0 0 30px ${meta.accentColor}, 0 0 60px ${meta.accentColor}60`,
              textAlign: 'center',
              margin: 0,
              marginBottom: '8px',
              padding: '0 20px',
            }}
          >
            {meta.name}
          </motion.h1>
        )}
      </AnimatePresence>

      {/* 副标题 */}
      <AnimatePresence>
        {(phase === 'desc_reveal' || phase === 'buttons') && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
              color: meta.accentColor,
              margin: 0,
              marginBottom: '32px',
              letterSpacing: '0.1em',
              textShadow: `0 0 10px ${meta.accentColor}60`,
            }}
          >
            {meta.subtitle}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 结局描述 */}
      <AnimatePresence>
        {(phase === 'desc_reveal' || phase === 'buttons') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            style={{
              maxWidth: '600px',
              padding: '0 40px',
              marginBottom: '48px',
            }}
          >
            <p style={{
              fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
              color: 'rgba(224,216,240,0.85)',
              lineHeight: 1.9,
              textAlign: 'center',
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}>
              {meta.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 按钮 */}
      <AnimatePresence>
        {phase === 'buttons' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <button
              onClick={handleReturn}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow = `0 0 25px ${meta.accentColor}80`;
                (e.target as HTMLButtonElement).style.borderColor = meta.accentColor;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow = `0 0 15px ${meta.accentColor}30`;
                (e.target as HTMLButtonElement).style.borderColor = `${meta.accentColor}60`;
              }}
              style={{
                padding: '14px 36px',
                background: 'rgba(10,5,25,0.7)',
                border: `1px solid ${meta.accentColor}60`,
                borderRadius: '4px',
                color: '#e0d8f0',
                fontSize: '0.95rem',
                fontFamily: "'Cinzel', 'Noto Sans SC', sans-serif",
                letterSpacing: '0.15em',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: `0 0 15px ${meta.accentColor}30`,
                transition: 'all 0.3s ease',
              }}
            >
              返回标题
            </button>
            <button
              onClick={onLoad}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = 'rgba(10,5,25,0.9)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = 'rgba(10,5,25,0.5)';
              }}
              style={{
                padding: '14px 36px',
                background: 'rgba(10,5,25,0.5)',
                border: '1px solid rgba(139,111,206,0.3)',
                borderRadius: '4px',
                color: 'rgba(224,216,240,0.7)',
                fontSize: '0.95rem',
                fontFamily: "'Cinzel', 'Noto Sans SC', sans-serif",
                letterSpacing: '0.15em',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
              }}
            >
              读取存档
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 完成度提示 */}
      <AnimatePresence>
        {phase === 'buttons' && endingData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{
              position: 'absolute', bottom: '40px',
              fontSize: '0.8rem', color: 'rgba(160,150,180,0.5)',
              letterSpacing: '0.1em',
            }}
          >
            {endingData.rewards.filter(r => r.type === 'cg').length > 0 && '✨ 获得新CG  '}
            {endingData.rewards.filter(r => r.type === 'title').length > 0 && '🏷️ 获得新称号  '}
            {endingData.rewards.filter(r => r.type === 'achievement').length > 0 && '🏆 获得成就  '}
            结局已收录至画廊
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
