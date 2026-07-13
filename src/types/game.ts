/**
 * @file 星辉魔法学院 - 游戏核心类型定义
 * @description 视觉小说 / Galgame "星辉魔法学院" (Stellar Magic Academy) 的完整 TypeScript 类型系统
 *
 * 游戏背景设定：
 * 在艾斯特拉大陆上，星辉魔法学院是培养年轻魔法使的最高学府。
 * 玩家扮演一名新入学的魔法学徒，与五位性格各异的同伴一起
 * 经历三年的学院生活，揭开隐藏在学院深处的秘密。
 *
 * 核心玩法包含：
 * - 多分支剧情对话系统
 * - 卡牌战斗系统
 * - 好感度养成系统
 * - 约会互动系统
 * - 多结局路线系统
 */

// ============================================================================
// 基础枚举类型
// ============================================================================

/**
 * 元素类型 - 艾斯特拉大陆的七大基础元素
 * 每个角色和魔法卡牌都隶属于一种元素，元素之间存在克制关系
 */
export type ElementType =
  | 'fire'      // 火元素 - 热情、破坏力强
  | 'water'     // 水元素 - 治愈、流动、适应性强
  | 'earth'     // 土元素 - 坚固、防御、沉稳
  | 'wind'      // 风元素 - 速度、自由、变化多端
  | 'lightning' // 雷元素 - 迅猛、爆发、难以捉摸
  | 'light'     // 光元素 - 神圣、净化、稀有
  | 'dark';     // 暗元素 - 神秘、禁忌、强大

/**
 * 卡牌稀有度等级
 * 稀有度越高，卡牌的基础数值和特殊效果越强
 */
export type CardRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';

/**
 * 卡牌类型 - 决定卡牌在战斗中的功能分类
 */
export type CardType = 'attack' | 'defense' | 'magic' | 'heal' | 'special';

/**
 * 故事节点类型 - 决定该节点的游戏交互方式
 */
export type StoryNodeType =
  | 'dialogue'  // 对话节点 - 展示角色对话
  | 'choice'    // 选择节点 - 玩家做出选择
  | 'battle'    // 战斗节点 - 进入卡牌战斗
  | 'cutscene'  // 过场动画节点 - 播放剧情动画
  | 'date'      // 约会节点 - 进入约会场景
  | 'branch'    // 分支节点 - 根据条件自动跳转
  | 'ending';   // 结局节点 - 触发游戏结局

/**
 * 战斗阶段 - 卡牌战斗的回合流程
 */
export type BattlePhase = 'draw' | 'play' | 'enemy' | 'result';

/**
 * 结局类型 - 不同条件触发的结局分支
 */
export type EndingType = 'good' | 'bad' | 'true' | 'hidden';

/**
 * 条件类型 - 用于剧情分支的条件判断
 */
export type ConditionType = 'flag' | 'affection' | 'card' | 'chapter' | 'item';

/**
 * 条件比较运算符
 */
export type ConditionOperator = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'includes' | 'excludes';

/**
 * 效果类型 - 选择或事件产生的副作用
 */
export type EffectType = 'affection' | 'flag' | 'item' | 'card' | 'unlock';

/**
 * 游戏章节编号（1-3）
 * - 第一章：初入学院（入学篇）
 * - 第二章：暗流涌动（冲突篇）
 * - 第三章：星辉抉择（终章）
 */
export type ChapterNumber = 1 | 2 | 3;

// ============================================================================
// 基础接口类型
// ============================================================================

/**
 * 角色表情到立绘资源的映射
 * 每个角色在不同情绪状态下使用不同的立绘图片
 */
export type SpriteMap = Record<string, string>;

/**
 * 通用的键值对标记系统
 * 用于存储游戏中的各种布尔标记（flags）
 */
export type FlagMap = Record<string, boolean>;

/**
 * 数值型标记映射
 * 用于存储好感度、物品数量等数值数据
 */
export type NumberMap = Record<string, number>;

/**
 * 字符串型标记映射
 * 用于存储字符串类型的游戏数据
 */
export type StringMap = Record<string, string>;

// ============================================================================
// 游戏实体类型
// ============================================================================

/**
 * 角色条件 - 用于控制剧情分支和选择可见性的逻辑判断
 *
 * @example
 * ```typescript
 * // 检查玩家是否设置了某个标记
 * const flagCondition: Condition = {
 *   type: 'flag',
 *   key: 'learned_fireball',
 *   operator: '==',
 *   value: true
 * };
 *
 * // 检查好感度是否达到阈值
 * const affectionCondition: Condition = {
 *   type: 'affection',
 *   key: 'sakura',
 *   operator: '>=',
 *   value: 50
 * };
 * ```
 */
export interface Condition {
  /** 条件类型 - 判断依据的数据类别 */
  type: ConditionType;

  /** 条件键 - 要检查的具体数据标识（角色id/标记名/卡牌id/物品id等） */
  key: string;

  /** 比较运算符 - 定义比较方式 */
  operator: ConditionOperator;

  /** 期望值 - 用于比较的目标值 */
  value: string | number | boolean | string[];
}

/**
 * 游戏效果 - 选择或事件触发后的数据变更
 *
 * @example
 * ```typescript
 * // 提升角色好感度
 * const affectionEffect: Effect = {
 *   type: 'affection',
 *   target: 'sakura',
 *   value: 10
 * };
 *
 * // 设置剧情标记
 * const flagEffect: Effect = {
 *   type: 'flag',
 *   target: 'ch1_helped_sakura',
 *   value: true
 * };
 *
 * // 获得卡牌
 * const cardEffect: Effect = {
 *   type: 'card',
 *   target: 'fireball_ssr',
 *   value: 1
 * };
 * ```
 */
export interface Effect {
  /** 效果类型 - 决定作用的目标数据类别 */
  type: EffectType;

  /** 目标 - 受影响的对象（角色id/标记名/物品id/卡牌id等） */
  target: string;

  /** 效果值 - 变更的数值或状态 */
  value: string | number | boolean;
}

/**
 * 玩家选择项 - 在选择节点中展示的可交互选项
 *
 * 选择可以有条件限制（需满足特定条件才可见），
 * 也可以是隐藏选项（需要特定条件才能解锁显示）。
 * 每个选择都会产生相应的效果并跳转到下一个节点。
 */
export interface Choice {
  /** 选择项唯一标识符 */
  id: string;

  /** 选择项显示文本 */
  text: string;

  /** 选择后跳转的目标节点id */
  nextNode: string;

  /** 选择项显示的前提条件列表（所有条件需同时满足） */
  conditions: Condition[];

  /** 选择后的效果列表（好感度变化、标记设置等） */
  effects: Effect[];

  /** 选择后设置的标记映射 */
  flags: FlagMap;

  /** 是否为隐藏选项（需要特定条件解锁才显示） */
  isHidden: boolean;

  /** 显示该选项所需的最低好感度要求（角色id -> 最低好感度值） */
  affectionRequirement: NumberMap;
}

/**
 * 角色立绘显示配置
 *
 * 在故事节点中控制角色立绘在屏幕上的显示方式，
 * 包括位置、大小、表情等。支持多角色同屏显示。
 */
export interface CharacterSprite {
  /** 角色id */
  characterId: string;

  /** 角色表情（对应Character.sprites中的表情key） */
  emotion: string;

  /** 水平位置（百分比，0-100，相对于游戏窗口宽度） */
  positionX: number;

  /** 垂直位置（百分比，0-100，相对于游戏窗口高度） */
  positionY: number;

  /** 缩放比例（1.0为原始大小） */
  scale: number;

  /** 图层顺序（数值越大越靠前） */
  zIndex: number;

  /** 是否镜像翻转（面向左边时为true） */
  flip: boolean;

  /** 透明度（0.0完全透明 - 1.0完全不透明） */
  opacity: number;

  /** 入场动画类型（如 'fadeIn', 'slideInLeft', 'none'） */
  enterAnimation: string;

  /** 退场动画类型（如 'fadeOut', 'slideOutRight', 'none'） */
  exitAnimation: string;
}

/**
 * 故事节点 - 剧情图谱中的核心单元
 *
 * 整个游戏剧情由故事节点构成的有向图驱动。
 * 每个节点包含对话内容、背景信息、角色状态、
 * 玩家选择和剧情效果等完整的游戏逻辑。
 *
 * 节点类型决定了该节点的交互方式：
 * - dialogue: 纯对话，点击推进
 * - choice: 展示选项等待玩家选择
 * - battle: 进入卡牌战斗
 * - cutscene: 播放过场动画
 * - date: 进入约会场景
 * - branch: 根据条件自动跳转（无UI交互）
 * - ending: 触发结局画面
 */
export interface StoryNode {
  /** 节点唯一标识符（格式建议：ch{章节}_{场景}_{序号}，如 ch1_intro_001） */
  id: string;

  /** 所属章节（1=入学篇, 2=冲突篇, 3=终章） */
  chapter: ChapterNumber;

  /** 节点类型 - 决定该节点的交互模式 */
  type: StoryNodeType;

  /** 说话角色的id（对话节点中标识当前发言角色） */
  speaker: string;

  /** 对话文本内容（支持变量插值，如 {playerName}、{sakura} 等） */
  text: string;

  /** 角色当前情绪（对应立绘表情，如 'happy'、'sad'、'angry'、'surprised'） */
  emotion: string;

  /** 背景图片资源id（引用背景资源表中的对应项） */
  background: string;

  /** 背景音乐资源id（引用音频资源表中的对应项，空字符串表示不切换BGM） */
  bgm: string;

  /** 音效资源id（引用音频资源表中的对应项，空字符串表示无音效） */
  sfx: string;

  /** 下一个节点的id（顺序推进的目标节点） */
  next: string;

  /** 选择项列表（仅choice类型节点有效，展示玩家可交互的选项） */
  choices: Choice[];

  /** 条件分支列表（branch类型节点使用，按顺序检查，跳转到第一个满足条件的节点） */
  conditions: Condition[];

  /** 该节点触发时产生的效果列表（好感度变化、标记设置、物品增减等） */
  effects: Effect[];

  /** 该节点触发时设置的标记（布尔型标记映射） */
  flags: FlagMap;

  /** 屏幕上显示的角色立绘配置列表 */
  characterSprites: CharacterSprite[];

  /** 屏幕动画效果id（如 'screenShake'、'flashWhite'、'fadeToBlack'） */
  animation: string;
}

/**
 * 好感度等级 - 定义角色好感度的阶段性阈值
 *
 * 好感度分为多个等级，每个等级有不同的称呼、描述和解锁内容。
 * 达到特定好感度等级可解锁新的剧情分支、约会事件和特殊CG。
 */
export interface AffectionLevel {
  /** 好感度等级编号（从0开始递增） */
  level: number;

  /** 等级名称（如 "初识"、"友善"、"亲密"、"挚爱"） */
  name: string;

  /** 等级描述（描述当前关系状态的文本） */
  description: string;

  /** 达到该等级所需的最低好感度值 */
  threshold: number;

  /** 达到该等级后解锁的内容列表（如 "解锁约会事件：图书馆之约"） */
  unlocks: string[];
}

/**
 * 角色定义 - 完整的角色档案
 *
 * 包含角色的所有静态信息：身份背景、性格特征、
 * 好恶习惯、魔法能力、可用卡牌池、立绘资源等。
 * 每个可攻略角色都有独立的故事路线和结局。
 */
export interface Character {
  /** 角色唯一标识符（如 'sakura'、'kai'、'luna'） */
  id: string;

  /** 角色中文名（如 '星宫樱'、'炎�的凯'、'月咏露娜'） */
  name: string;

  /** 角色英文名（如 'Sakura Hoshimiya'、'Kai Blaze'、'Luna Tsukuyomi'） */
  nameEn: string;

  /** 角色称号（如 '炎之继承者'、'月光公主'、 '雷电天才'） */
  title: string;

  /** 角色所属元素 */
  element: ElementType;

  /** 性格特征描述（详细的性格分析文本） */
  personality: string;

  /** 角色完整背景描述（包含身世、入学动机、人际关系等） */
  description: string;

  /** 角色简短描述（用于UI列表展示，一句话概括） */
  shortDescription: string;

  /** 生日（格式：MM-DD） */
  birthday: string;

  /** 年龄 */
  age: number;

  /** 血型 */
  bloodType: string;

  /** 角色喜欢的事物列表（用于约会系统选择礼物时参考） */
  likes: string[];

  /** 角色讨厌的事物列表 */
  dislikes: string[];

  /** 角色掌握的魔法技能列表 */
  skills: string[];

  /** 角色可用卡牌池（卡牌id列表，战斗中会从中抽取） */
  cardPool: string[];

  /** 表情立绘映射（情绪名 -> 立绘资源id） */
  sprites: SpriteMap;

  /** 画廊可解锁的CG图片id列表 */
  galleryImages: string[];

  /** 该角色相关的故事路线id列表 */
  routes: string[];

  /** 初始好感度值（游戏开始时的好感度） */
  defaultAffection: number;

  /** 最大好感度上限 */
  maxAffection: number;
}

/**
 * 魔法卡牌 - 战斗系统中使用的卡牌
 *
 * 卡牌分为攻击、防御、魔法、治愈、特殊五种类型，
 * 每张卡牌有元素属性、法力消耗、冷却时间和特殊效果。
 * 稀有度越高的卡牌效果越强，但也更难获得。
 */
export interface Card {
  /** 卡牌唯一标识符 */
  id: string;

  /** 卡牌名称 */
  name: string;

  /** 卡牌描述文本（说明卡牌的效果） */
  description: string;

  /** 卡牌元素属性 */
  element: ElementType;

  /** 卡牌稀有度 */
  rarity: CardRarity;

  /** 法力消耗（使用该卡牌需要消耗的MP） */
  cost: number;

  /** 伤害/防御/治疗数值（根据卡牌类型决定具体含义） */
  damage: number;

  /** 特殊效果描述（如 "灼烧3回合"、"降低敌人防御20%"） */
  effect: string;

  /** 卡牌类型 */
  type: CardType;

  /** 冷却时间（使用后需要等待的回合数，0为无冷却） */
  cooldown: number;

  /** 使用时播放的动画id */
  animation: string;

  /** 使用时播放的音效id */
  soundEffect: string;
}

/**
 * 增益/减益效果状态
 *
 * 在战斗中对角色施加的临时效果，持续若干回合。
 */
export interface BuffDebuff {
  /** 效果唯一id */
  id: string;

  /** 效果名称 */
  name: string;

  /** 效果描述 */
  description: string;

  /** 效果持续回合数 */
  duration: number;

  /** 效果数值（正值为增益，负值为减益） */
  value: number;

  /** 效果类型（如 'attack_up'、'defense_down'、'poison'、'regen'） */
  effectType: string;

  /** 是否为增益效果 */
  isBuff: boolean;

  /** 效果来源（施加该效果的卡牌或角色id） */
  source: string;
}

/**
 * 战斗状态 - 卡牌战斗的实时数据
 *
 * 记录战斗过程中的所有动态数据，包括双方的HP/MP、
 * 手牌/牌库/弃牌堆、当前回合数、战斗阶段和增减益效果。
 */
export interface BattleState {
  /** 玩家当前生命值 */
  playerHP: number;

  /** 玩家最大生命值 */
  playerMaxHP: number;

  /** 玩家当前法力值 */
  playerMP: number;

  /** 玩家最大法力值 */
  playerMaxMP: number;

  /** 玩家牌库（待抽取的卡牌id列表） */
  playerDeck: string[];

  /** 玩家手牌（当前持有的卡牌id列表） */
  playerHand: string[];

  /** 玩家弃牌堆（已使用的卡牌id列表） */
  playerDiscard: string[];

  /** 敌人当前生命值 */
  enemyHP: number;

  /** 敌人最大生命值 */
  enemyMaxHP: number;

  /** 敌人名称 */
  enemyName: string;

  /** 敌人可用卡牌列表 */
  enemyDeck: string[];

  /** 当前回合数 */
  turn: number;

  /** 当前战斗阶段 */
  phase: BattlePhase;

  /** 玩家身上的增益效果列表 */
  buffs: BuffDebuff[];

  /** 玩家身上的减益效果列表 */
  debuffs: BuffDebuff[];
}

/**
 * 约会事件 - 角色专属的约会场景
 *
 * 约会系统允许玩家在达到一定好感度后与角色进行特殊互动，
 * 包含独特的对话、选项和奖励。成功完成约会可大幅提升好感度。
 */
export interface DateEvent {
  /** 约会事件唯一标识符 */
  id: string;

  /** 约会对象角色id */
  characterId: string;

  /** 约会地点（如 'garden'、'library'、'town'、'lake'） */
  location: string;

  /** 约会对话节点列表（构成约会场景的完整对话流） */
  dialogues: StoryNode[];

  /** 约会中的选择项列表 */
  choices: Choice[];

  /** 解锁该约会事件所需的最低好感度值 */
  requiredAffection: number;

  /** 完成约会后的奖励列表 */
  rewards: Effect[];

  /** 约会CG图片id（成功约会后解锁的特殊CG） */
  cgImage: string;
}

/**
 * 游戏结局定义
 *
 * 游戏包含多种类型的结局：
 * - good: 良好结局 - 与角色达成圆满关系
 * - bad: 不良结局 - 关系破裂或剧情失败
 * - true: 真结局 - 完成所有条件后解锁的最终真相
 * - hidden: 隐藏结局 - 特殊条件触发的彩蛋结局
 */
export interface Ending {
  /** 结局唯一标识符 */
  id: string;

  /** 结局关联的角色id（独立结局时为空字符串） */
  characterId: string;

  /** 结局类型 */
  type: EndingType;

  /** 结局名称 */
  name: string;

  /** 结局描述文本（结局画面展示的故事总结） */
  description: string;

  /** 触发该结局的条件列表 */
  conditions: Condition[];

  /** 结局CG图片id */
  cgImage: string;
}

/**
 * 教程引导步骤
 *
 * 新手教程系统，引导玩家了解游戏的各项操作和机制。
 * 每个步骤高亮特定UI元素并展示说明文字。
 */
export interface Tutorial {
  /** 教程步骤唯一标识符 */
  id: string;

  /** 步骤序号（决定展示顺序） */
  step: number;

  /** 步骤标题 */
  title: string;

  /** 步骤详细说明 */
  description: string;

  /** 需要高亮的UI元素选择器（CSS选择器格式） */
  highlightElement: string;

  /** 教程提示框显示位置（相对于高亮元素） */
  position: 'top' | 'bottom' | 'left' | 'right';

  /** 触发下一步的操作类型（如 'click'、'drag'、'input'） */
  action: string;
}

// ============================================================================
// 系统状态类型
// ============================================================================

/**
 * 游戏设置 - 玩家可配置的游戏选项
 *
 * 所有设置都有合理的默认值，支持持久化存储。
 */
export interface GameSettings {
  /** 背景音乐音量（0.0 - 1.0） */
  bgmVolume: number;

  /** 音效音量（0.0 - 1.0） */
  sfxVolume: number;

  /** 语音音量（0.0 - 1.0） */
  voiceVolume: number;

  /** 文字显示速度（毫秒/字符，数值越小速度越快） */
  textSpeed: number;

  /** 自动播放速度（毫秒/节点，每句话自动推进的间隔时间） */
  autoSpeed: number;

  /** 是否跳过已读文本 */
  skipRead: boolean;

  /** 是否全屏显示 */
  fullscreen: boolean;

  /** 游戏分辨率（如 '1920x1080'、'1280x720'） */
  resolution: string;
}

/**
 * 存档数据 - 游戏存档的完整快照
 *
 * 每个存档记录了游戏在某个时间点的完整状态，
 * 包括当前进度、角色好感度、剧情标记、卡牌收集等。
 */
export interface SaveData {
  /** 存档唯一id */
  id: string;

  /** 存档时间戳（Unix时间戳，毫秒） */
  timestamp: number;

  /** 存档时的当前节点id */
  currentNodeId: string;

  /** 存档时的当前章节 */
  chapter: ChapterNumber;

  /** 各角色的好感度映射（角色id -> 好感度数值） */
  characterAffections: NumberMap;

  /** 存档时的剧情标记快照 */
  flags: FlagMap;

  /** 存档时玩家拥有的卡牌id列表 */
  cards: string[];

  /** 存档时的游戏设置 */
  settings: GameSettings;

  /** 累计游戏时长（秒） */
  playtime: number;

  /** 存档缩略图（截屏的base64数据或图片路径） */
  screenshot: string;
}

/**
 * 全局游戏状态 - 运行时的完整游戏数据
 *
 * 包含游戏进行中的所有动态数据，是游戏引擎的核心状态对象。
 * 所有游戏逻辑的读写都通过此对象进行。
 */
export interface GameState {
  /** 当前所在的故事节点id */
  currentNodeId: string;

  /** 当前游戏章节 */
  chapter: ChapterNumber;

  /** 全局剧情标记映射 */
  flags: FlagMap;

  /** 各角色好感度映射（角色id -> 好感度数值） */
  affections: NumberMap;

  /** 玩家背包物品（物品id -> 数量） */
  inventory: NumberMap;

  /** 玩家已收集的卡牌id列表 */
  cards: string[];

  /** 已解锁的CG图片id列表（画廊系统） */
  unlockedCGs: string[];

  /** 已读过的故事节点id集合（用于跳过已读文本功能） */
  readNodes: Set<string>;

  /** 累计游戏时长（秒） */
  playtime: number;

  /** 玩家自定义的角色名 */
  playerName: string;

  /** 玩家在当前游戏中做过的所有选择记录 */
  choicesMade: ChoiceRecord[];
}

/**
 * 选择记录 - 记录玩家做出的每个选择
 *
 * 用于剧情回溯、成就统计和多周目继承系统。
 */
export interface ChoiceRecord {
  /** 所属节点id */
  nodeId: string;

  /** 选择的选项id */
  choiceId: string;

  /** 选择时间戳 */
  timestamp: number;

  /** 选择时的章节 */
  chapter: ChapterNumber;
}

/**
 * 战斗事件定义 - 故事中触发的预设战斗
 *
 * 定义战斗节点中使用的敌人配置和战斗场景参数。
 */
export interface BattleEvent {
  /** 战斗事件唯一标识符 */
  id: string;

  /** 敌人名称 */
  enemyName: string;

  /** 敌人描述文本 */
  enemyDescription: string;

  /** 敌人立绘资源id */
  enemySprite: string;

  /** 敌人生命值 */
  enemyHP: number;

  /** 敌人法力值 */
  enemyMP: number;

  /** 敌人卡牌列表 */
  enemyCards: string[];

  /** 战斗背景图片id */
  battleBackground: string;

  /** 战斗BGM id */
  battleBGM: string;

  /** 战斗胜利后的效果 */
  victoryEffects: Effect[];

  /** 战斗失败后的效果 */
  defeatEffects: Effect[];

  /** 战斗胜利后跳转的节点id */
  victoryNode: string;

  /** 战斗失败后跳转的节点id */
  defeatNode: string;

  /** 是否为BOSS战斗 */
  isBoss: boolean;
}

/**
 * CG画廊条目 - 可收集的CG图片信息
 *
 * 用于画廊系统展示已解锁和未解锁的CG图片。
 */
export interface CGGalleryEntry {
  /** CG图片唯一id */
  id: string;

  /** CG图片名称 */
  name: string;

  /** CG图片描述 */
  description: string;

  /** 所属章节 */
  chapter: ChapterNumber;

  /** 关联的角色id（如适用） */
  characterId: string;

  /** 图片资源路径 */
  imagePath: string;

  /** 缩略图资源路径 */
  thumbnailPath: string;

  /** 解锁条件列表 */
  unlockConditions: Condition[];

  /** 是否为隐藏CG（未解锁时显示为剪影） */
  isHidden: boolean;
}

/**
 * 成就定义 - 游戏成就系统
 *
 * 成就系统记录玩家在游戏中的各种里程碑。
 */
export interface Achievement {
  /** 成就唯一id */
  id: string;

  /** 成就名称 */
  name: string;

  /** 成就描述 */
  description: string;

  /** 成就图标资源id */
  icon: string;

  /** 成就达成条件列表 */
  conditions: Condition[];

  /** 成就类型（如 'story'、'battle'、'affection'、'collection'） */
  category: string;

  /** 是否为隐藏成就（未达成前不显示描述） */
  isHidden: boolean;

  /** 达成后的奖励 */
  rewards: Effect[];
}

/**
 * 物品定义 - 游戏中的可使用物品
 *
 * 物品可用于赠送角色（提升好感度）、战斗辅助等。
 */
export interface Item {
  /** 物品唯一id */
  id: string;

  /** 物品名称 */
  name: string;

  /** 物品描述 */
  description: string;

  /** 物品图标资源id */
  icon: string;

  /** 物品类型（如 'gift'、'consumable'、'key_item'） */
  type: string;

  /** 物品效果列表（使用时触发的效果） */
  effects: Effect[];

  /** 赠送该物品时各角色的好感度变化（角色id -> 好感度增量） */
  giftAffectionBonus: NumberMap;

  /** 物品价格（商店购买所需金币） */
  price: number;

  /** 是否为关键物品（不可丢弃、不可出售） */
  isKeyItem: boolean;

  /** 最大持有数量 */
  maxStack: number;
}

/**
 * 章节定义 - 游戏章节的元数据
 *
 * 定义每个章节的基本信息和起始/结束节点。
 */
export interface ChapterDefinition {
  /** 章节编号 */
  chapter: ChapterNumber;

  /** 章节中文标题 */
  title: string;

  /** 章节英文标题 */
  titleEn: string;

  /** 章节描述（章节选择界面展示的简介） */
  description: string;

  /** 章节起始节点id */
  startNode: string;

  /** 章节所有可能的结束节点id列表 */
  endNodes: string[];

  /** 章节封面图资源id */
  coverImage: string;

  /** 章节预览BGM id */
  previewBGM: string;

  /** 章节解锁条件列表 */
  unlockConditions: Condition[];
}

/**
 * 对话历史记录 - 已读对话的记录
 *
 * 用于回放已读对话和对话回溯功能。
 */
export interface DialogueRecord {
  /** 节点id */
  nodeId: string;

  /** 说话角色id */
  speaker: string;

  /** 对话文本 */
  text: string;

  /** 角色表情 */
  emotion: string;

  /** 记录时间戳 */
  timestamp: number;

  /** 如果是选择节点，记录玩家选择的选项id */
  selectedChoiceId?: string;
}

/**
 * 元素克制关系定义
 *
 * 定义元素之间的克制关系，克制关系影响战斗伤害倍率。
 */
export interface ElementRelation {
  /** 攻击方元素 */
  attacker: ElementType;

  /** 防御方元素 */
  defender: ElementType;

  /** 伤害倍率（1.0为正常，>1.0为克制，<1.0为被克制） */
  damageMultiplier: number;
}

/**
 * 资源配置 - 游戏资源的路径映射
 *
 * 集中管理所有游戏资源的路径配置。
 */
export interface ResourceConfig {
  /** 背景图片资源映射（id -> 文件路径） */
  backgrounds: StringMap;

  /** 角色立绘资源映射（id -> 文件路径） */
  sprites: StringMap;

  /** CG图片资源映射（id -> 文件路径） */
  cgs: StringMap;

  /** BGM音频资源映射（id -> 文件路径） */
  bgm: StringMap;

  /** 音效音频资源映射（id -> 文件路径） */
  sfx: StringMap;

  /** 语音音频资源映射（id -> 文件路径） */
  voice: StringMap;

  /** UI资源映射（id -> 文件路径） */
  ui: StringMap;
}

/**
 * 场景背景定义 - 场景的环境信息
 *
 * 定义游戏中出现的各种场景背景，包括时间和天气变化。
 */
export interface SceneBackground {
  /** 背景id */
  id: string;

  /** 场景名称 */
  name: string;

  /** 基础背景图资源id */
  baseImage: string;

  /** 时间段变体（白天/黄昏/夜晚的背景图） */
  timeVariants: StringMap;

  /** 天气变体（晴天/雨天/雪天的背景图） */
  weatherVariants: StringMap;

  /** 该场景的默认BGM */
  defaultBGM: string;

  /** 该场景可出现的角色列表 */
  availableCharacters: string[];
}
