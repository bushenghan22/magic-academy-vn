import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── 类型定义 ─────────────────────────────────────────────────────────────

interface HelpScreenProps {
  onBack: () => void;
}

// ─── 标签定义 ─────────────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'intro', label: '游戏介绍', icon: '📖' },
  { id: 'controls', label: '操作指南', icon: '🎮' },
  { id: 'battle', label: '战斗系统', icon: '⚔️' },
  { id: 'affection', label: '好感度系统', icon: '💖' },
  { id: 'element', label: '元素系统', icon: '🌀' },
  { id: 'faq', label: '常见问题', icon: '❓' },
];

// ─── 元素克制数据 ─────────────────────────────────────────────────────────

const ELEMENTS = [
  { name: '火', icon: '🔥', color: '#FF4500', strong: '冰、风', weak: '水、土' },
  { name: '冰', icon: '❄️', color: '#00BFFF', strong: '风、水', weak: '火、雷' },
  { name: '水', icon: '🌊', color: '#1E90FF', strong: '火、土', weak: '冰、雷' },
  { name: '风', icon: '🌀', color: '#7FFFD4', strong: '土、雷', weak: '火、冰' },
  { name: '土', icon: '🪨', color: '#DAA520', strong: '火、雷', weak: '水、风' },
  { name: '雷', icon: '⚡', color: '#FFD700', strong: '冰、水', weak: '土、风' },
  { name: '光', icon: '✨', color: '#FFFFF0', strong: '暗', weak: '暗' },
];

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
    width: '860px',
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
  tabBar: {
    display: 'flex',
    gap: '6px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '1px',
    border: '1px solid rgba(120,80,220,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(20,8,45,0.5), rgba(10,5,25,0.7))',
    color: 'rgba(180,160,220,0.7)',
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tabActive: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '1px',
    border: '1px solid rgba(160,120,255,0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(50,20,100,0.7), rgba(30,10,60,0.9))',
    color: 'rgba(220,200,255,0.95)',
    fontFamily: "'Noto Sans SC', sans-serif",
    boxShadow: '0 0 12px rgba(120,80,220,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  contentArea: {
    padding: '28px 32px',
    background: 'linear-gradient(145deg, rgba(25,10,55,0.6), rgba(12,6,30,0.8))',
    border: '1px solid rgba(120,80,220,0.15)',
    borderRadius: '12px',
    minHeight: '400px',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'rgba(200,170,255,0.95)',
    marginBottom: '14px',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  subHeading: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgba(180,160,230,0.85)',
    marginTop: '18px',
    marginBottom: '8px',
    letterSpacing: '1px',
  },
  paragraph: {
    fontSize: '14px',
    color: 'rgba(200,190,230,0.8)',
    lineHeight: 1.9,
    marginBottom: '12px',
  },
  listItem: {
    fontSize: '14px',
    color: 'rgba(200,190,230,0.8)',
    lineHeight: 1.8,
    paddingLeft: '16px',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  keyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 10px',
    fontSize: '12px',
    fontFamily: "'Orbitron', monospace",
    borderRadius: '4px',
    background: 'rgba(40,20,80,0.6)',
    border: '1px solid rgba(120,80,220,0.25)',
    color: 'rgba(160,200,255,0.8)',
    minWidth: '32px',
    textAlign: 'center' as const,
  },
  elementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '12px',
    marginBottom: '16px',
  },
  elementCard: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(120,80,220,0.15)',
    background: 'linear-gradient(135deg, rgba(25,10,55,0.4), rgba(12,6,30,0.5))',
  },
  elementName: {
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  elementInfo: {
    fontSize: '11px',
    color: 'rgba(180,160,220,0.65)',
    lineHeight: 1.6,
  },
  faqItem: {
    padding: '14px 18px',
    background: 'linear-gradient(135deg, rgba(30,12,60,0.4), rgba(15,6,35,0.5))',
    border: '1px solid rgba(120,80,220,0.1)',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  faqQuestion: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(200,180,240,0.9)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  faqAnswer: {
    fontSize: '13px',
    color: 'rgba(180,170,220,0.75)',
    lineHeight: 1.8,
    paddingLeft: '24px',
  },
};

// ─── 内容组件 ─────────────────────────────────────────────────────────────

/** 游戏介绍 */
const IntroContent: React.FC = () => (
  <div>
    <div style={styles.sectionHeading}>📖 游戏介绍</div>
    <p style={styles.paragraph}>
      在艾斯特拉大陆上，<strong style={{ color: 'rgba(200,180,255,0.95)' }}>星辉魔法学院</strong>是培养年轻魔法使的最高学府。
      这里汇聚了来自大陆各地、拥有不同元素天赋的年轻人。
    </p>
    <p style={styles.paragraph}>
      你是一名新入学的魔法学徒——一个被认为"没有魔法天赋"却意外觉醒的普通人。
      在这个充满奇迹与危险的世界中，你将与六位性格各异的同伴一起，
      经历跌宕起伏的学院生活，揭开隐藏在学院深处的古老秘密。
    </p>
    <div style={styles.subHeading}>✨ 游戏特色</div>
    <div style={styles.listItem}>· <span>多分支剧情对话系统——每个选择都影响故事走向</span></div>
    <div style={styles.listItem}>· <span>卡牌战斗系统——策略性十足的回合制战斗</span></div>
    <div style={styles.listItem}>· <span>好感度养成——与心仪的角色建立羁绊</span></div>
    <div style={styles.listItem}>· <span>元素克制系统——火、冰、水、风、土、雷、光七大元素</span></div>
    <div style={styles.listItem}>· <span>多结局路线——每位角色拥有独立的好结局与真结局</span></div>
    <div style={styles.subHeading}>🏫 世界观</div>
    <p style={styles.paragraph}>
      星辉魔法学院坐落于艾斯特拉大陆的中心，由七大家族联合创立。
      学院拥有火、冰、水、风、土、雷、光七大元素科系，
      以及历史悠久的炼金术科和治愈科。学院下方隐藏着一个巨大的古代遗迹，
      其中封印着足以改变世界的禁忌力量……
    </p>
  </div>
);

/** 操作指南 */
const ControlsContent: React.FC = () => (
  <div>
    <div style={styles.sectionHeading}>🎮 操作指南</div>

    <div style={styles.subHeading}>🖱️ 基本操作</div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>鼠标左键</span>
      <span>点击画面推进对话 / 确认选择</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>Space</span>
      <span>推进对话（等同于鼠标左键）</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>Enter</span>
      <span>推进对话 / 确认</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>Esc</span>
      <span>打开/关闭游戏菜单</span>
    </div>

    <div style={styles.subHeading}>⌨️ 快捷键</div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>A</span>
      <span>开启/关闭自动播放模式</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>S</span>
      <span>开启/关闭快进模式（跳过已读文本）</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>Ctrl</span>
      <span>按住时加速文本显示</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>F</span>
      <span>切换全屏模式</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>H</span>
      <span>隐藏对话框（截图模式）</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>Q</span>
      <span>快速存档</span>
    </div>
    <div style={styles.listItem}>
      <span style={styles.keyBadge}>L</span>
      <span>快速读档</span>
    </div>

    <div style={styles.subHeading}>💾 存档说明</div>
    <p style={styles.paragraph}>
      游戏提供 20 个手动存档位和 1 个自动存档位。
      自动存档会在每次章节切换时自动保存。
      在存档管理界面中，右键点击已有存档可进行删除操作。
    </p>
  </div>
);

/** 战斗系统 */
const BattleContent: React.FC = () => (
  <div>
    <div style={styles.sectionHeading}>⚔️ 战斗系统</div>
    <p style={styles.paragraph}>
      游戏采用卡牌战斗系统，在特定剧情节点会进入战斗场景。
      战斗为回合制，玩家与敌人交替行动。
    </p>

    <div style={styles.subHeading}>🃏 卡牌类型</div>
    <div style={styles.listItem}>
      <span>⚔️ <strong style={{ color: 'rgba(255,150,150,0.9)' }}>攻击卡</strong></span>
      <span>—— 对敌人造成伤害，是主要输出手段</span>
    </div>
    <div style={styles.listItem}>
      <span>🛡️ <strong style={{ color: 'rgba(150,200,255,0.9)' }}>防御卡</strong></span>
      <span>—— 获得护盾值，抵挡敌人的攻击伤害</span>
    </div>
    <div style={styles.listItem}>
      <span>💫 <strong style={{ color: 'rgba(180,255,180,0.9)' }}>魔法卡</strong></span>
      <span>—— 施放各类魔法效果，如控制、增益等</span>
    </div>
    <div style={styles.listItem}>
      <span>💚 <strong style={{ color: 'rgba(255,200,150,0.9)' }}>治愈卡</strong></span>
      <span>—— 恢复自身生命值</span>
    </div>

    <div style={styles.subHeading}>⚡ 战斗流程</div>
    <p style={styles.paragraph}>
      <strong style={{ color: 'rgba(200,180,255,0.95)' }}>1. 抽牌阶段：</strong>
      每回合开始时从牌库抽取 5 张卡牌到手牌。
      <br />
      <strong style={{ color: 'rgba(200,180,255,0.95)' }}>2. 出牌阶段：</strong>
      消耗能量点打出卡牌。每回合有固定的 3 点能量。
      <br />
      <strong style={{ color: 'rgba(200,180,255,0.95)' }}>3. 结束回合：</strong>
      点击"结束回合"按钮，手牌移入弃牌堆。
      <br />
      <strong style={{ color: 'rgba(200,180,255,0.95)' }}>4. 敌人行动：</strong>
      敌人根据意图执行攻击或防御。
      <br />
      <strong style={{ color: 'rgba(200,180,255,0.95)' }}>5. 新回合：</strong>
      能量恢复，护盾清零，重新抽牌。
    </p>

    <div style={styles.subHeading}>💡 战斗提示</div>
    <div style={styles.listItem}>· <span>注意敌人的意图提示，合理分配攻防</span></div>
    <div style={styles.listItem}>· <span>利用元素克制关系造成额外伤害</span></div>
    <div style={styles.listItem}>· <span>牌库耗尽时弃牌堆会重新洗入，注意牌序管理</span></div>
    <div style={styles.listItem}>· <span>提升角色好感度可解锁更强的战斗卡牌</span></div>
  </div>
);

/** 好感度系统 */
const AffectionContent: React.FC = () => (
  <div>
    <div style={styles.sectionHeading}>💖 好感度系统</div>
    <p style={styles.paragraph}>
      好感度是衡量你与各角色关系亲密程度的核心数值。
      通过对话选择、赠送礼物和完成特定剧情事件来提升好感度。
    </p>

    <div style={styles.subHeading}>📊 好感度等级</div>
    <div style={styles.listItem}>
      <span>⬜ <strong style={{ color: 'rgba(180,180,180,0.9)' }}>陌生人</strong>（0-19）</span>
      <span>—— 角色称呼你为"你"，对话内容有限</span>
    </div>
    <div style={styles.listItem}>
      <span>🟦 <strong style={{ color: 'rgba(100,150,255,0.9)' }}>相识</strong>（20-39）</span>
      <span>—— 称呼你为"同学"，开始分享一些个人故事</span>
    </div>
    <div style={styles.listItem}>
      <span>🟩 <strong style={{ color: 'rgba(100,220,140,0.9)' }}>朋友</strong>（40-59）</span>
      <span>—— 用名字（带姓氏）称呼你，解锁更多互动选项</span>
    </div>
    <div style={styles.listItem}>
      <span>🟨 <strong style={{ color: 'rgba(255,220,100,0.9)' }}>挚友</strong>（60-79）</span>
      <span>—— 直接叫你名字，解锁约会事件和特殊剧情</span>
    </div>
    <div style={styles.listItem}>
      <span>🟥 <strong style={{ color: 'rgba(255,120,120,0.9)' }}>知己</strong>（80-94）</span>
      <span>—— 使用专属昵称，进入好结局路线</span>
    </div>
    <div style={styles.listItem}>
      <span>⭐ <strong style={{ color: 'rgba(255,200,100,0.9)' }}>灵魂伴侣</strong>（95-100）</span>
      <span>—— 最亲密关系，解锁真结局路线</span>
    </div>

    <div style={styles.subHeading}>💡 提升好感度的方法</div>
    <div style={styles.listItem}>· <span>在对话中选择符合角色性格的选项</span></div>
    <div style={styles.listItem}>· <span>赠送角色喜欢的礼物（避免送讨厌的东西）</span></div>
    <div style={styles.listItem}>· <span>完成与该角色相关的支线剧情</span></div>
    <div style={styles.listItem}>· <span>在关键剧情中选择支持该角色的立场</span></div>
    <div style={styles.listItem}>· <span>参加角色专属的约会事件</span></div>

    <div style={styles.subHeading}>⚠️ 注意事项</div>
    <p style={styles.paragraph}>
      好感度是单向的——提升对某角色的好感度不会降低对其他角色的好感度。
      但某些选择可能会影响多条路线的解锁条件。
      二周目可以继承一周目的好感度，方便攻略其他路线。
    </p>
  </div>
);

/** 元素系统 */
const ElementContent: React.FC = () => (
  <div>
    <div style={styles.sectionHeading}>🌀 元素系统</div>
    <p style={styles.paragraph}>
      艾斯特拉大陆存在七大基础元素，每种元素都有独特的力量。
      元素之间存在克制关系，利用克制关系可以在战斗中获得优势。
    </p>

    <div style={styles.subHeading}>🔮 元素属性一览</div>
    <div style={styles.elementGrid}>
      {ELEMENTS.map((el) => (
        <div key={el.name} style={styles.elementCard}>
          <div style={{ ...styles.elementName, color: el.color }}>
            {el.icon} {el.name}属性
          </div>
          <div style={styles.elementInfo}>
            克制：{el.strong}
            <br />
            被克：{el.weak}
          </div>
        </div>
      ))}
    </div>

    <div style={styles.subHeading}>⚔️ 克制效果</div>
    <p style={styles.paragraph}>
      使用克制属性攻击时，伤害倍率为 <strong style={{ color: 'rgba(100,220,140,0.9)' }}>1.5 倍</strong>。
      <br />
      使用被克制属性攻击时，伤害倍率为 <strong style={{ color: 'rgba(255,120,120,0.9)' }}>0.7 倍</strong>。
      <br />
      无克制关系时，伤害倍率为 1.0 倍（正常伤害）。
      <br />
      光与暗互为克制，双方均造成 1.3 倍伤害。
    </p>

    <div style={styles.subHeading}>🎯 策略建议</div>
    <div style={styles.listItem}>· <span>在战斗前查看敌人属性，选择克制属性的卡牌</span></div>
    <div style={styles.listItem}>· <span>培养不同属性的角色，以应对各种敌人</span></div>
    <div style={styles.listItem}>· <span>光属性角色拥有独特的治愈能力，适合作为辅助</span></div>
    <div style={styles.listItem}>· <span>注意保护被克制属性的角色，避免受到额外伤害</span></div>
  </div>
);

/** 常见问题 */
const FaqContent: React.FC = () => {
  const faqs = [
    {
      q: 'Q：如何存档？',
      a: '在游戏过程中，按 Esc 打开菜单，选择"保存"即可手动存档。游戏也会在章节切换时自动存档。',
    },
    {
      q: 'Q：好感度会影响结局吗？',
      a: '是的。每位角色都有好结局和真结局路线，分别需要达到不同的好感度阈值。提高好感度是解锁各角色专属路线的关键。',
    },
    {
      q: 'Q：错过了某个选择怎么办？',
      a: '可以读取之前的存档重新选择，或者在二周目时做出不同的选择。部分关键选择会影响后续路线的开放。',
    },
    {
      q: 'Q：卡牌如何获得？',
      a: '随着剧情推进和好感度提升，角色会教你新的魔法卡牌。此外，完成特定事件和探索隐藏内容也能获得稀有卡牌。',
    },
    {
      q: 'Q：游戏有多周目要素吗？',
      a: '是的。一周目无法攻略所有角色路线。二周目会继承好感度和部分解锁内容，方便玩家体验不同的故事线。',
    },
    {
      q: 'Q：如何解锁隐藏 CG？',
      a: '隐藏 CG 通常需要在特定章节做出特定选择，或在限定条件下完成某些事件。参考角色图鉴中的解锁条件说明。',
    },
    {
      q: 'Q：游戏支持键盘操作吗？',
      a: '完全支持。可以使用 Space/Enter 推进对话，Esc 打开菜单，A 键切换自动模式，S 键切换快进。详见"操作指南"。',
    },
    {
      q: 'Q：如何重置设置？',
      a: '在设置页面底部有"恢复默认"按钮，可以一键重置所有设置项。',
    },
  ];

  return (
    <div>
      <div style={styles.sectionHeading}>❓ 常见问题</div>
      {faqs.map((faq, i) => (
        <div key={i} style={styles.faqItem}>
          <div style={styles.faqQuestion}>
            <span style={{ color: 'rgba(160,120,255,0.8)' }}>Q：</span>
            {faq.q.replace('Q：', '')}
          </div>
          <div style={styles.faqAnswer}>{faq.a}</div>
        </div>
      ))}
    </div>
  );
};

// ─── 内容映射 ─────────────────────────────────────────────────────────────

const CONTENT_MAP: Record<string, React.FC> = {
  intro: IntroContent,
  controls: ControlsContent,
  battle: BattleContent,
  affection: AffectionContent,
  element: ElementContent,
  faq: FaqContent,
};

// ─── 主组件 ──────────────────────────────────────────────────────────────

export const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const ContentComponent = CONTENT_MAP[activeTab] ?? IntroContent;

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{`
        .help-tab:hover {
          border-color: rgba(140,100,220,0.4);
          color: rgba(210,195,245,0.9);
        }
        .help-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(160,100,255,0.3);
        }
      `}</style>
      <div style={styles.backdrop} />

      <div style={styles.inner}>
        {/* 标题栏 */}
        <div style={styles.header}>
          <h1 style={styles.title}>帮 助</h1>
          <button className="help-btn" style={styles.backButton} onClick={onBack}>
            ← 返回
          </button>
        </div>

        {/* 标签栏 */}
        <div style={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className="help-tab"
              style={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div style={styles.contentArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ContentComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpScreen;
