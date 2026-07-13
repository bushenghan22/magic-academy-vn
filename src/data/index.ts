// ============================================================
// 星辉魔法学院 - 数据索引文件
// 统一导出所有游戏数据
// ============================================================

// 角色数据
export * from './characters';

// 卡牌数据 (excluding Element to avoid conflict with characters)
export { CARD_POOL, ELEMENT_RELATIONS, RARITY_COLORS, RARITY_WEIGHTS, ELEMENT_NAMES, RARITY_NAMES, CARD_TYPE_NAMES, FIRE_CARDS, ICE_CARDS, WATER_CARDS, WIND_CARDS, EARTH_CARDS, LIGHTNING_CARDS, LIGHT_CARDS, DARK_CARDS, NEUTRAL_CARDS, getCardById, getCardsByElement, getCardsByRarity, getCardsByType, getRandomHand, drawRandomCards, getElementMultiplier, calculateDamage } from './cards';
export type { Card, Rarity, CardType } from './cards';

// 故事/剧情数据
export * from './stories';

// 约会事件数据
export * from './dateEvents';

// 结局数据
export * from './endings';

// ============================================================
// 游戏元数据配置
// ============================================================

/** 游戏核心配置信息 */
export const GAME_CONFIG = {
  // 基本信息
  title: '星辉魔法学院',
  titleEn: 'Stellar Magic Academy',
  version: '1.0.0',

  // 游戏规模
  totalChapters: 3,
  totalCharacters: 6,
  totalCards: 131,
  totalEndings: 14,
  totalDateEvents: 30,

  // 开发信息
  developer: 'Starlight Studio',
  description: '在星辉魔法学院中，你将扮演一名突然觉醒魔法能力的普通人...',

  // 游戏特性列表
  features: [
    '沉浸式视觉小说体验，多分支剧情走向',
    '6位性格迥异的角色，深度互动系统',
    '131张魔法卡牌，策略性战斗玩法',
    '14种不同结局，每个选择都影响命运',
    '30段浪漫约会事件，解锁角色专属故事',
    '精美CG立绘与全语音配音',
    '卡牌合成与进化系统',
    '学院探索与隐藏彩蛋',
  ],

  // 操作说明
  controls: {
    // 鼠标操作
    mouse: {
      leftClick: '推进对话 / 选择选项',
      rightClick: '打开菜单 / 返回',
      scroll: '浏览历史对话',
    },
    // 键盘操作
    keyboard: {
      Space: '推进对话',
      Enter: '推进对话 / 确认选择',
      Escape: '打开系统菜单',
      S: '保存游戏',
      L: '读取存档',
      A: '切换自动播放',
      T: '加速对话',
      H: '隐藏对话框',
      F: '切换全屏',
      '1-9': '快速选择选项',
      ArrowUp: '上一个选项',
      ArrowDown: '下一个选项',
      ArrowLeft: '切换上一角色',
      ArrowRight: '切换下一角色',
    },
  },

  // 默认设置
  defaultSettings: {
    textSpeed: 50,        // 文字显示速度(ms/字)
    autoSpeed: 2000,      // 自动播放间隔(ms)
    bgmVolume: 0.7,       // 背景音乐音量
    sfxVolume: 0.8,       // 音效音量
    voiceVolume: 1.0,     // 语音音量
    fullscreen: false,    // 全屏模式
    skipRead: false,      // 跳过已读文本
  },
} as const;

/** 导出游戏配置类型 */
export type GameConfig = typeof GAME_CONFIG;
