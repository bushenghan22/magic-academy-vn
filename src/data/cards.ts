/**
 * @file 卡牌战斗系统 - 卡牌数据
 * @description 星辉魔法学院（Stellar Magic Academy）卡牌战斗系统的完整卡牌数据
 * 包含100+张战斗卡牌，按元素和稀有度分类
 * @module data/cards
 */

// ============================================================================
// 类型定义
// ============================================================================

/** 卡牌元素类型 */
export type Element =
  | 'fire'
  | 'ice'
  | 'water'
  | 'wind'
  | 'earth'
  | 'lightning'
  | 'light'
  | 'dark'
  | 'neutral';

/** 卡牌稀有度 */
export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';

/** 卡牌战斗类型 */
export type CardType = 'attack' | 'defense' | 'magic' | 'heal' | 'special';

/** 动画ID类型 */
export type AnimationId = string;

/**
 * 战斗卡牌接口
 * @interface Card
 */
export interface Card {
  /** 卡牌唯一标识 */
  id: string;
  /** 卡牌名称 */
  name: string;
  /** 卡牌描述 */
  description: string;
  /** 卡牌元素 */
  element: Element;
  /** 卡牌稀有度 */
  rarity: Rarity;
  /** 卡牌战斗类型 */
  type: CardType;
  /** MP消耗 */
  cost: number;
  /** 基础伤害（防御卡为减伤值，治疗卡为治疗量） */
  damage: number;
  /** 特殊效果描述 */
  effect: string;
  /** 冷却回合数 */
  cooldown: number;
  /** 动画标识 */
  animationId: AnimationId;
}

// ============================================================================
// 火系卡牌（Fire Cards）
// ============================================================================

/** 火系卡牌集合 */
export const FIRE_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'fire_bolt',
    name: '火球术',
    description: '投掷一颗小型火球，对敌人造成火焰伤害',
    element: 'fire',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 8,
    effect: '造成8点火焰伤害',
    cooldown: 0,
    animationId: 'anim_fire_bolt',
  },
  {
    id: 'spark',
    name: '火花',
    description: '迸发出一簇火花，虽然威力不大但速度极快',
    element: 'fire',
    rarity: 'N',
    type: 'attack',
    cost: 1,
    damage: 4,
    effect: '造成4点火焰伤害，先手+1',
    cooldown: 0,
    animationId: 'anim_spark',
  },
  {
    id: 'warm_breeze',
    name: '暖风',
    description: '温暖的风拂过战场，轻微恢复生命',
    element: 'fire',
    rarity: 'N',
    type: 'heal',
    cost: 2,
    damage: 5,
    effect: '恢复5点生命值',
    cooldown: 1,
    animationId: 'anim_warm_breeze',
  },
  {
    id: 'fire_dart',
    name: '火焰飞镖',
    description: '发射一枚火焰飞镖，精准打击敌人弱点',
    element: 'fire',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 6,
    effect: '造成6点火焰伤害，有15%几率暴击',
    cooldown: 0,
    animationId: 'anim_fire_dart',
  },
  {
    id: 'cinder',
    name: '灰烬弹',
    description: '投掷燃烧的灰烬，附带灼伤效果',
    element: 'fire',
    rarity: 'N',
    type: 'magic',
    cost: 3,
    damage: 5,
    effect: '造成5点伤害，附加灼伤（每回合2点，持续2回合）',
    cooldown: 0,
    animationId: 'anim_cinder',
  },
  // ---- R 稀有度 ----
  {
    id: 'flame_burst',
    name: '烈焰爆发',
    description: '释放一团猛烈的火焰爆炸，覆盖范围较广',
    element: 'fire',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 14,
    effect: '造成14点火焰伤害',
    cooldown: 1,
    animationId: 'anim_flame_burst',
  },
  {
    id: 'heat_wave',
    name: '热浪',
    description: '释放灼热的气浪，降低敌人防御力',
    element: 'fire',
    rarity: 'R',
    type: 'magic',
    cost: 3,
    damage: 8,
    effect: '造成8点伤害，降低敌人防御20%持续2回合',
    cooldown: 1,
    animationId: 'anim_heat_wave',
  },
  {
    id: 'fire_wall',
    name: '火墙',
    description: '在前方竖起一道燃烧的火焰之墙',
    element: 'fire',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 12,
    effect: '减少12点伤害，攻击者受到4点火焰反伤',
    cooldown: 2,
    animationId: 'anim_fire_wall',
  },
  {
    id: 'blaze_shot',
    name: '烈焰射击',
    description: '将魔力凝聚为火焰之箭，精准射击',
    element: 'fire',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 16,
    effect: '造成16点火焰伤害，无视10%防御',
    cooldown: 1,
    animationId: 'anim_blaze_shot',
  },
  {
    id: 'phoenix_feather',
    name: '不死鸟之羽',
    description: '使用凤凰之羽的力量，持续恢复生命',
    element: 'fire',
    rarity: 'R',
    type: 'heal',
    cost: 4,
    damage: 10,
    effect: '恢复10点生命值，持续恢复每回合3点共3回合',
    cooldown: 2,
    animationId: 'anim_phoenix_feather',
  },
  {
    id: 'fire_storm',
    name: '火焰风暴',
    description: '召唤小型火焰风暴席卷战场',
    element: 'fire',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 12,
    effect: '造成12点火焰伤害，有30%几率附加灼伤',
    cooldown: 2,
    animationId: 'anim_fire_storm',
  },
  // ---- SR 稀有度 ----
  {
    id: 'inferno',
    name: '地狱火',
    description: '从地底召唤地狱之火，焚烧一切',
    element: 'fire',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 25,
    effect: '造成25点火焰伤害，灼伤效果翻倍',
    cooldown: 2,
    animationId: 'anim_inferno',
  },
  {
    id: 'dragon_breath',
    name: '龙息',
    description: '模仿上古火龙的吐息，威力惊人',
    element: 'fire',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 30,
    effect: '造成30点火焰伤害，穿透防御',
    cooldown: 3,
    animationId: 'anim_dragon_breath',
  },
  {
    id: 'flame_sword',
    name: '炎之剑',
    description: '凝聚火焰之力化为巨剑，斩裂敌人',
    element: 'fire',
    rarity: 'SR',
    type: 'attack',
    cost: 6,
    damage: 22,
    effect: '造成22点伤害，下一次攻击伤害+30%',
    cooldown: 2,
    animationId: 'anim_flame_sword',
  },
  {
    id: 'solar_flare',
    name: '日冕爆发',
    description: '模拟太阳表面的日冕爆发，释放毁灭性能量',
    element: 'fire',
    rarity: 'SR',
    type: 'magic',
    cost: 9,
    damage: 28,
    effect: '造成28点火焰伤害，降低敌人命中率25%持续2回合',
    cooldown: 3,
    animationId: 'anim_solar_flare',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'phoenix_rebirth',
    name: '凤凰涅槃',
    description: '浴火重生的凤凰之力，恢复大量生命并提升全属性',
    element: 'fire',
    rarity: 'SSR',
    type: 'heal',
    cost: 12,
    damage: 40,
    effect: '恢复40点生命值，全属性提升15%持续3回合',
    cooldown: 5,
    animationId: 'anim_phoenix_rebirth',
  },
  {
    id: 'meteor_strike',
    name: '陨石打击',
    description: '从天召唤燃烧的陨石，毁灭性打击',
    element: 'fire',
    rarity: 'SSR',
    type: 'attack',
    cost: 14,
    damage: 45,
    effect: '造成45点火焰伤害，附带大范围灼伤（每回合5点，持续3回合）',
    cooldown: 4,
    animationId: 'anim_meteor_strike',
  },
  // ---- UR 稀有度 ----
  {
    id: 'genesis_flame',
    name: '创世之焰',
    description: '传说中的创世火焰，蕴含世界诞生之初的力量',
    element: 'fire',
    rarity: 'UR',
    type: 'attack',
    cost: 20,
    damage: 65,
    effect: '造成65点火焰伤害，烧尽一切防御，灼伤持续至战斗结束',
    cooldown: 6,
    animationId: 'anim_genesis_flame',
  },
];

// ============================================================================
// 冰系卡牌（Ice Cards）
// ============================================================================

/** 冰系卡牌集合 */
export const ICE_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'ice_shard',
    name: '冰碎片',
    description: '发射锋利的冰碎片刺向敌人',
    element: 'ice',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点冰霜伤害',
    cooldown: 0,
    animationId: 'anim_ice_shard',
  },
  {
    id: 'frost_bite',
    name: '霜冻',
    description: '用寒气侵蚀敌人，减缓其行动',
    element: 'ice',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 5,
    effect: '造成5点伤害，降低敌人速度10%持续1回合',
    cooldown: 0,
    animationId: 'anim_frost_bite',
  },
  {
    id: 'cold_snap',
    name: '寒流',
    description: '突然袭来的寒流，冻彻骨髓',
    element: 'ice',
    rarity: 'N',
    type: 'attack',
    cost: 3,
    damage: 9,
    effect: '造成9点冰霜伤害',
    cooldown: 0,
    animationId: 'anim_cold_snap',
  },
  {
    id: 'icicle',
    name: '冰柱',
    description: '从地面升起锋利的冰柱',
    element: 'ice',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 6,
    effect: '造成6点冰霜伤害，有10%几率冰冻1回合',
    cooldown: 0,
    animationId: 'anim_icicle',
  },
  {
    id: 'chill_wind',
    name: '寒风',
    description: '刺骨的寒风吹过，轻微冻伤敌人',
    element: 'ice',
    rarity: 'N',
    type: 'magic',
    cost: 1,
    damage: 3,
    effect: '造成3点伤害，减速效果',
    cooldown: 0,
    animationId: 'anim_chill_wind',
  },
  // ---- R 稀有度 ----
  {
    id: 'ice_lance',
    name: '冰之枪',
    description: '凝聚寒冰之力化为长枪，贯穿敌人',
    element: 'ice',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 15,
    effect: '造成15点冰霜伤害，有20%几率冰冻1回合',
    cooldown: 1,
    animationId: 'anim_ice_lance',
  },
  {
    id: 'frost_armor',
    name: '冰霜护甲',
    description: '用寒冰凝结成护甲，保护自身',
    element: 'ice',
    rarity: 'R',
    type: 'defense',
    cost: 3,
    damage: 14,
    effect: '减少14点伤害，攻击者受到冰霜减速',
    cooldown: 2,
    animationId: 'anim_frost_armor',
  },
  {
    id: 'blizzard',
    name: '暴风雪',
    description: '召唤猛烈的暴风雪席卷战场',
    element: 'ice',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 13,
    effect: '造成13点冰霜伤害，有25%几率冰冻1回合',
    cooldown: 2,
    animationId: 'anim_blizzard',
  },
  {
    id: 'frozen_ground',
    name: '冰封大地',
    description: '冻结脚下大地，使敌人行动困难',
    element: 'ice',
    rarity: 'R',
    type: 'magic',
    cost: 4,
    damage: 10,
    effect: '造成10点伤害，降低敌人速度30%持续2回合',
    cooldown: 2,
    animationId: 'anim_frozen_ground',
  },
  {
    id: 'crystal_ice',
    name: '水晶冰',
    description: '凝结出纯净的水晶冰晶，可用于攻防',
    element: 'ice',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 10,
    effect: '减少10点伤害，恢复3点生命值',
    cooldown: 1,
    animationId: 'anim_crystal_ice',
  },
  // ---- SR 稀有度 ----
  {
    id: 'absolute_zero',
    name: '绝对零度',
    description: '将温度降至绝对零度，冻结一切分子运动',
    element: 'ice',
    rarity: 'SR',
    type: 'magic',
    cost: 8,
    damage: 20,
    effect: '造成20点伤害，冰冻敌人2回合',
    cooldown: 3,
    animationId: 'anim_absolute_zero',
  },
  {
    id: 'ice_prison',
    name: '冰之牢笼',
    description: '用寒冰构建牢笼，将敌人困于其中',
    element: 'ice',
    rarity: 'SR',
    type: 'magic',
    cost: 7,
    damage: 18,
    effect: '造成18点伤害，冰冻敌人1回合并持续每回合5点伤害',
    cooldown: 3,
    animationId: 'anim_ice_prison',
  },
  {
    id: 'diamond_dust',
    name: '钻石星尘',
    description: '无数冰晶如钻石般闪耀，美丽而致命',
    element: 'ice',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 26,
    effect: '造成26点冰霜伤害，无视冰霜抗性',
    cooldown: 2,
    animationId: 'anim_diamond_dust',
  },
  {
    id: 'frost_bloom',
    name: '霜花绽放',
    description: '冰霜之花在战场绽放，恢复并防御',
    element: 'ice',
    rarity: 'SR',
    type: 'heal',
    cost: 6,
    damage: 20,
    effect: '恢复20点生命值，获得冰霜护盾（吸收10点伤害）',
    cooldown: 3,
    animationId: 'anim_frost_bloom',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'eternal_winter',
    name: '永恒之冬',
    description: '召唤永恒的寒冬，将战场化为冰之世界',
    element: 'ice',
    rarity: 'SSR',
    type: 'magic',
    cost: 13,
    damage: 35,
    effect: '造成35点冰霜伤害，全场冰冻2回合，持续减速50%',
    cooldown: 5,
    animationId: 'anim_eternal_winter',
  },
  {
    id: 'glacial_crash',
    name: '冰川崩塌',
    description: '操纵巨型冰川崩塌压向敌人',
    element: 'ice',
    rarity: 'SSR',
    type: 'attack',
    cost: 15,
    damage: 50,
    effect: '造成50点冰霜伤害，对冰冻目标额外+20伤害',
    cooldown: 4,
    animationId: 'anim_glacial_crash',
  },
  // ---- UR 稀有度 ----
  {
    id: 'aurora_freeze',
    name: '极光冻结',
    description: '极光之力降临，将一切封入永恒的冰晶之中',
    element: 'ice',
    rarity: 'UR',
    type: 'attack',
    cost: 20,
    damage: 60,
    effect: '造成60点冰霜伤害，冰冻3回合，冻结时间本身',
    cooldown: 6,
    animationId: 'anim_aurora_freeze',
  },
];

// ============================================================================
// 水系卡牌（Water Cards）
// ============================================================================

/** 水系卡牌集合 */
export const WATER_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'water_bolt',
    name: '水弹',
    description: '发射一颗高压水弹冲击敌人',
    element: 'water',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点水系伤害',
    cooldown: 0,
    animationId: 'anim_water_bolt',
  },
  {
    id: 'splash',
    name: '水花',
    description: '溅起一阵水花，干扰敌人视线',
    element: 'water',
    rarity: 'N',
    type: 'magic',
    cost: 1,
    damage: 3,
    effect: '造成3点伤害，降低命中率5%',
    cooldown: 0,
    animationId: 'anim_splash',
  },
  {
    id: 'mist',
    name: '薄雾',
    description: '释放薄雾笼罩战场，提高闪避率',
    element: 'water',
    rarity: 'N',
    type: 'defense',
    cost: 2,
    damage: 5,
    effect: '减少5点伤害，提升闪避率10%持续1回合',
    cooldown: 1,
    animationId: 'anim_mist',
  },
  {
    id: 'dew_drop',
    name: '露珠',
    description: '凝聚纯净的露珠，恢复少量生命',
    element: 'water',
    rarity: 'N',
    type: 'heal',
    cost: 2,
    damage: 6,
    effect: '恢复6点生命值',
    cooldown: 1,
    animationId: 'anim_dew_drop',
  },
  {
    id: 'tide',
    name: '潮汐',
    description: '操纵潮汐之力冲击敌人',
    element: 'water',
    rarity: 'N',
    type: 'attack',
    cost: 3,
    damage: 8,
    effect: '造成8点水系伤害',
    cooldown: 0,
    animationId: 'anim_tide',
  },
  // ---- R 稀有度 ----
  {
    id: 'tidal_wave',
    name: '巨浪',
    description: '召唤滔天巨浪淹没敌人',
    element: 'water',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 16,
    effect: '造成16点水系伤害，击退效果',
    cooldown: 2,
    animationId: 'anim_tidal_wave',
  },
  {
    id: 'water_shield',
    name: '水之盾',
    description: '用水流凝结成流动的护盾',
    element: 'water',
    rarity: 'R',
    type: 'defense',
    cost: 3,
    damage: 15,
    effect: '减少15点伤害，吸收伤害转化为治愈（3点）',
    cooldown: 2,
    animationId: 'anim_water_shield',
  },
  {
    id: 'rain_dance',
    name: '雨之舞',
    description: '在雨中翩翩起舞，恢复生命力',
    element: 'water',
    rarity: 'R',
    type: 'heal',
    cost: 4,
    damage: 12,
    effect: '恢复12点生命值，持续恢复每回合3点共2回合',
    cooldown: 2,
    animationId: 'anim_rain_dance',
  },
  {
    id: 'aqua_jet',
    name: '水流喷射',
    description: '高压水流如同利刃般喷射而出',
    element: 'water',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 14,
    effect: '造成14点水系伤害，先手攻击',
    cooldown: 1,
    animationId: 'anim_aqua_jet',
  },
  // ---- SR 稀有度 ----
  {
    id: 'ocean_rage',
    name: '海洋之怒',
    description: '引发海洋的愤怒，巨浪翻涌',
    element: 'water',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 28,
    effect: '造成28点水系伤害，击退并降低速度20%',
    cooldown: 3,
    animationId: 'anim_ocean_rage',
  },
  {
    id: 'tsunami',
    name: '海啸',
    description: '召唤毁灭性的海啸席卷一切',
    element: 'water',
    rarity: 'SR',
    type: 'attack',
    cost: 9,
    damage: 32,
    effect: '造成32点水系伤害，淹没目标1回合',
    cooldown: 3,
    animationId: 'anim_tsunami',
  },
  {
    id: 'water_dragon',
    name: '水龙',
    description: '凝聚水流化为巨龙，咆哮而出',
    element: 'water',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 24,
    effect: '造成24点水系伤害，清除敌方增益效果',
    cooldown: 2,
    animationId: 'anim_water_dragon',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'abyssal_vortex',
    name: '深渊漩涡',
    description: '打开通往深渊的漩涡，吞噬一切',
    element: 'water',
    rarity: 'SSR',
    type: 'attack',
    cost: 14,
    damage: 42,
    effect: '造成42点水系伤害，吸取敌人20%当前生命值',
    cooldown: 5,
    animationId: 'anim_abyssal_vortex',
  },
  // ---- UR 稀有度 ----
  {
    id: 'primordial_ocean',
    name: '始源之海',
    description: '重现世界创生前的始源之海，万物归于虚无',
    element: 'water',
    rarity: 'UR',
    type: 'attack',
    cost: 20,
    damage: 58,
    effect: '造成58点水系伤害，淹没全场3回合，持续回复己方生命',
    cooldown: 6,
    animationId: 'anim_primordial_ocean',
  },
];

// ============================================================================
// 风系卡牌（Wind Cards）
// ============================================================================

/** 风系卡牌集合 */
export const WIND_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'wind_blade',
    name: '风之刃',
    description: '用锐利的风刃切割敌人',
    element: 'wind',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点风系伤害',
    cooldown: 0,
    animationId: 'anim_wind_blade',
  },
  {
    id: 'gust',
    name: '阵风',
    description: '突然刮起的阵风，吹乱敌人',
    element: 'wind',
    rarity: 'N',
    type: 'magic',
    cost: 1,
    damage: 4,
    effect: '造成4点伤害，击退效果',
    cooldown: 0,
    animationId: 'anim_gust',
  },
  {
    id: 'breeze',
    name: '微风',
    description: '温柔的微风拂面，舒缓身心',
    element: 'wind',
    rarity: 'N',
    type: 'heal',
    cost: 2,
    damage: 5,
    effect: '恢复5点生命值',
    cooldown: 1,
    animationId: 'anim_breeze',
  },
  {
    id: 'air_cut',
    name: '空气斩',
    description: '压缩空气形成真空之刃',
    element: 'wind',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 8,
    effect: '造成8点风系伤害，无视5%防御',
    cooldown: 0,
    animationId: 'anim_air_cut',
  },
  {
    id: 'whisper',
    name: '低语之风',
    description: '风中传来神秘低语，干扰敌人精神',
    element: 'wind',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 5,
    effect: '造成5点伤害，降低敌人魔抗5%',
    cooldown: 0,
    animationId: 'anim_whisper',
  },
  // ---- R 稀有度 ----
  {
    id: 'gale_force',
    name: '疾风之力',
    description: '释放疾风的强大力量',
    element: 'wind',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 15,
    effect: '造成15点风系伤害，提升自身速度15%持续2回合',
    cooldown: 1,
    animationId: 'anim_gale_force',
  },
  {
    id: 'cyclone',
    name: '旋风',
    description: '召唤强力旋风卷起敌人',
    element: 'wind',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 14,
    effect: '造成14点风系伤害，击飞敌人1回合',
    cooldown: 2,
    animationId: 'anim_cyclone',
  },
  {
    id: 'sky_dance',
    name: '天空之舞',
    description: '在风中起舞，恢复体力并提升敏捷',
    element: 'wind',
    rarity: 'R',
    type: 'heal',
    cost: 4,
    damage: 10,
    effect: '恢复10点生命值，提升速度20%持续2回合',
    cooldown: 2,
    animationId: 'anim_sky_dance',
  },
  {
    id: 'wind_barrier',
    name: '风之结界',
    description: '构筑风之结界保护自身',
    element: 'wind',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 13,
    effect: '减少13点伤害，反弹20%远程攻击',
    cooldown: 2,
    animationId: 'anim_wind_barrier',
  },
  // ---- SR 稀有度 ----
  {
    id: 'tempest',
    name: '暴风',
    description: '引发肆虐的暴风，摧毁一切阻碍',
    element: 'wind',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 26,
    effect: '造成26点风系伤害，清除敌方增益',
    cooldown: 3,
    animationId: 'anim_tempest',
  },
  {
    id: 'hurricane',
    name: '飓风',
    description: '召唤毁灭性的飓风',
    element: 'wind',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 30,
    effect: '造成30点风系伤害，击飞2回合',
    cooldown: 3,
    animationId: 'anim_hurricane',
  },
  {
    id: 'dragon_wind',
    name: '龙卷风',
    description: '召唤连接天地的龙卷风',
    element: 'wind',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 24,
    effect: '造成24点风系伤害，持续2回合每回合8点伤害',
    cooldown: 2,
    animationId: 'anim_dragon_wind',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'divine_gale',
    name: '神圣疾风',
    description: '借取天界之风，神圣不可阻挡',
    element: 'wind',
    rarity: 'SSR',
    type: 'attack',
    cost: 13,
    damage: 40,
    effect: '造成40点风系伤害，全队速度提升30%持续3回合',
    cooldown: 5,
    animationId: 'anim_divine_gale',
  },
  // ---- UR 稀有度 ----
  {
    id: 'genesis_wind',
    name: '创世之风',
    description: '世界诞生时的第一缕风，蕴含无限可能',
    element: 'wind',
    rarity: 'UR',
    type: 'special',
    cost: 18,
    damage: 55,
    effect: '造成55点风系伤害，重置所有技能冷却，行动次数+1',
    cooldown: 6,
    animationId: 'anim_genesis_wind',
  },
];

// ============================================================================
// 地系卡牌（Earth Cards）
// ============================================================================

/** 地系卡牌集合 */
export const EARTH_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'rock_throw',
    name: '投石',
    description: '投掷岩石砸向敌人',
    element: 'earth',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点地系伤害',
    cooldown: 0,
    animationId: 'anim_rock_throw',
  },
  {
    id: 'stone_spike',
    name: '石笋',
    description: '从地面突起尖锐的石笋',
    element: 'earth',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 6,
    effect: '造成6点地系伤害，有10%几率眩晕',
    cooldown: 0,
    animationId: 'anim_stone_spike',
  },
  {
    id: 'dust_cloud',
    name: '尘土',
    description: '扬起尘土干扰敌人视线',
    element: 'earth',
    rarity: 'N',
    type: 'defense',
    cost: 1,
    damage: 3,
    effect: '减少3点伤害，降低敌人命中率10%持续1回合',
    cooldown: 0,
    animationId: 'anim_dust_cloud',
  },
  {
    id: 'pebble',
    name: '碎石',
    description: '碎石飞溅，虽然威力不大但胜在数量',
    element: 'earth',
    rarity: 'N',
    type: 'attack',
    cost: 1,
    damage: 4,
    effect: '造成4点地系伤害',
    cooldown: 0,
    animationId: 'anim_pebble',
  },
  {
    id: 'tremor',
    name: '微震',
    description: '引发小型地震，动摇敌人根基',
    element: 'earth',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 5,
    effect: '造成5点伤害，降低敌人防御5%',
    cooldown: 0,
    animationId: 'anim_tremor',
  },
  // ---- R 稀有度 ----
  {
    id: 'stone_wall',
    name: '石墙',
    description: '召唤坚固的石墙保护己方',
    element: 'earth',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 18,
    effect: '减少18点伤害，持续2回合',
    cooldown: 2,
    animationId: 'anim_stone_wall',
  },
  {
    id: 'earthquake',
    name: '地震',
    description: '引发强烈地震，动摇战场',
    element: 'earth',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 14,
    effect: '造成14点地系伤害，有20%几率眩晕1回合',
    cooldown: 2,
    animationId: 'anim_earthquake',
  },
  {
    id: 'metal_bind',
    name: '金属束缚',
    description: '从地面召唤金属锁链束缚敌人',
    element: 'earth',
    rarity: 'R',
    type: 'magic',
    cost: 4,
    damage: 10,
    effect: '造成10点伤害，束缚敌人1回合无法行动',
    cooldown: 2,
    animationId: 'anim_metal_bind',
  },
  {
    id: 'quake_hammer',
    name: '震锤',
    description: '凝聚大地之力化为巨锤，重击敌人',
    element: 'earth',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 17,
    effect: '造成17点地系伤害，无视15%防御',
    cooldown: 1,
    animationId: 'anim_quake_hammer',
  },
  // ---- SR 稀有度 ----
  {
    id: 'avalanche',
    name: '雪崩',
    description: '引发大规模雪崩，势不可挡',
    element: 'earth',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 28,
    effect: '造成28点地系伤害，压倒性力量降低敌人攻击20%',
    cooldown: 3,
    animationId: 'anim_avalanche',
  },
  {
    id: 'diamond_shield',
    name: '钻石之盾',
    description: '用最坚硬的钻石构成的护盾',
    element: 'earth',
    rarity: 'SR',
    type: 'defense',
    cost: 7,
    damage: 25,
    effect: '减少25点伤害，免疫控制效果1回合',
    cooldown: 3,
    animationId: 'anim_diamond_shield',
  },
  {
    id: 'earth_golem',
    name: '岩石巨人',
    description: '召唤岩石构成的巨人协战',
    element: 'earth',
    rarity: 'SR',
    type: 'special',
    cost: 9,
    damage: 20,
    effect: '召唤岩石巨人（生命30，攻击15）持续3回合',
    cooldown: 4,
    animationId: 'anim_earth_golem',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'world_tree',
    name: '世界树',
    description: '召唤连接天地的世界树，庇护万物',
    element: 'earth',
    rarity: 'SSR',
    type: 'heal',
    cost: 15,
    damage: 35,
    effect: '恢复35点生命值，全队获得20点护盾，持续回复3回合',
    cooldown: 5,
    animationId: 'anim_world_tree',
  },
  // ---- UR 稀有度 ----
  {
    id: 'tectonic_shift',
    name: '地壳变动',
    description: '引发地壳级别的板块运动，改写地形',
    element: 'earth',
    rarity: 'UR',
    type: 'attack',
    cost: 20,
    damage: 62,
    effect: '造成62点地系伤害，地形改变持续3回合（地系增伤50%）',
    cooldown: 6,
    animationId: 'anim_tectonic_shift',
  },
];

// ============================================================================
// 雷系卡牌（Lightning Cards）
// ============================================================================

/** 雷系卡牌集合 */
export const LIGHTNING_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'spark_shot',
    name: '电火花',
    description: '释放电火花攻击敌人',
    element: 'lightning',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点雷电伤害',
    cooldown: 0,
    animationId: 'anim_spark_shot',
  },
  {
    id: 'static',
    name: '静电',
    description: '积蓄静电能量',
    element: 'lightning',
    rarity: 'N',
    type: 'magic',
    cost: 1,
    damage: 3,
    effect: '造成3点伤害，充能1层（下次雷系伤害+10%）',
    cooldown: 0,
    animationId: 'anim_static',
  },
  {
    id: 'shock',
    name: '电击',
    description: '释放电流电击敌人',
    element: 'lightning',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 8,
    effect: '造成8点雷电伤害，有10%几率麻痹',
    cooldown: 0,
    animationId: 'anim_shock',
  },
  {
    id: 'volt_arrow',
    name: '伏特之箭',
    description: '凝聚雷电化为箭矢射出',
    element: 'lightning',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 6,
    effect: '造成6点雷电伤害，先手+1',
    cooldown: 0,
    animationId: 'anim_volt_arrow',
  },
  {
    id: 'charge',
    name: '充电',
    description: '为自身充能，提升下次攻击威力',
    element: 'lightning',
    rarity: 'N',
    type: 'special',
    cost: 1,
    damage: 0,
    effect: '充能2层，下次雷系攻击伤害+20%',
    cooldown: 1,
    animationId: 'anim_charge',
  },
  // ---- R 稀有度 ----
  {
    id: 'thunder_bolt',
    name: '雷击',
    description: '召唤雷电劈向敌人',
    element: 'lightning',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 16,
    effect: '造成16点雷电伤害，有20%几率麻痹1回合',
    cooldown: 1,
    animationId: 'anim_thunder_bolt',
  },
  {
    id: 'lightning_chain',
    name: '闪电链',
    description: '闪电在多个敌人间弹跳',
    element: 'lightning',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 12,
    effect: '造成12点雷电伤害，弹射至最多2个额外目标（每次-20%）',
    cooldown: 2,
    animationId: 'anim_lightning_chain',
  },
  {
    id: 'volt_shield',
    name: '电之盾',
    description: '用电流构成护盾，触碰者将遭受电击',
    element: 'lightning',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 12,
    effect: '减少12点伤害，近战攻击者受到6点雷电反伤并麻痹',
    cooldown: 2,
    animationId: 'anim_volt_shield',
  },
  {
    id: 'plasma_burst',
    name: '等离子爆发',
    description: '释放等离子能量爆发',
    element: 'lightning',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 18,
    effect: '造成18点雷电伤害，消耗充能层数每层+15%伤害',
    cooldown: 1,
    animationId: 'anim_plasma_burst',
  },
  // ---- SR 稀有度 ----
  {
    id: 'judgment_bolt',
    name: '审判之雷',
    description: '来自天际的审判之雷，裁决正义',
    element: 'lightning',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 30,
    effect: '造成30点雷电伤害，对邪恶属性目标额外+50%伤害',
    cooldown: 3,
    animationId: 'anim_judgment_bolt',
  },
  {
    id: 'storm_caller',
    name: '风暴召唤者',
    description: '召唤雷暴风暴，持续轰击',
    element: 'lightning',
    rarity: 'SR',
    type: 'magic',
    cost: 7,
    damage: 22,
    effect: '造成22点伤害，雷暴持续3回合每回合8点随机雷击',
    cooldown: 3,
    animationId: 'anim_storm_caller',
  },
  {
    id: 'thunder_god',
    name: '雷神之力',
    description: '借取雷神托尔的力量，化身雷神',
    element: 'lightning',
    rarity: 'SR',
    type: 'special',
    cost: 9,
    damage: 25,
    effect: '造成25点雷电伤害，进入雷神状态3回合（攻击+30%，速度+20%）',
    cooldown: 4,
    animationId: 'anim_thunder_god',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'divine_lightning',
    name: '神圣雷电',
    description: '来自天界的神圣雷电，毁灭不洁',
    element: 'lightning',
    rarity: 'SSR',
    type: 'attack',
    cost: 14,
    damage: 48,
    effect: '造成48点雷电伤害，麻痹2回合，无视雷电抗性',
    cooldown: 5,
    animationId: 'anim_divine_lightning',
  },
  // ---- UR 稀有度 ----
  {
    id: 'cosmic_storm',
    name: '宇宙风暴',
    description: '来自宇宙深处的风暴，星辰为之颤抖',
    element: 'lightning',
    rarity: 'UR',
    type: 'attack',
    cost: 20,
    damage: 68,
    effect: '造成68点雷电伤害，全屏雷暴3回合，麻痹所有敌人',
    cooldown: 6,
    animationId: 'anim_cosmic_storm',
  },
];

// ============================================================================
// 光系卡牌（Light Cards）
// ============================================================================

/** 光系卡牌集合 */
export const LIGHT_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'heal_light',
    name: '治愈之光',
    description: '温暖的光芒治愈伤痛',
    element: 'light',
    rarity: 'N',
    type: 'heal',
    cost: 2,
    damage: 8,
    effect: '恢复8点生命值',
    cooldown: 0,
    animationId: 'anim_heal_light',
  },
  {
    id: 'holy_spark',
    name: '圣光闪烁',
    description: '闪烁的圣光灼伤暗属性敌人',
    element: 'light',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 6,
    effect: '造成6点光系伤害，对暗属性额外+30%',
    cooldown: 0,
    animationId: 'anim_holy_spark',
  },
  {
    id: 'bless',
    name: '祝福',
    description: '施加神圣祝福，提升全属性',
    element: 'light',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 0,
    effect: '全属性提升5%持续2回合',
    cooldown: 1,
    animationId: 'anim_bless',
  },
  {
    id: 'purify',
    name: '净化',
    description: '净化负面状态',
    element: 'light',
    rarity: 'N',
    type: 'heal',
    cost: 2,
    damage: 3,
    effect: '恢复3点生命值，清除1个负面状态',
    cooldown: 1,
    animationId: 'anim_purify',
  },
  {
    id: 'radiance',
    name: '光辉',
    description: '释放柔和的光辉，照亮战场',
    element: 'light',
    rarity: 'N',
    type: 'magic',
    cost: 1,
    damage: 4,
    effect: '造成4点伤害，揭示隐身单位',
    cooldown: 0,
    animationId: 'anim_radiance',
  },
  // ---- R 稀有度 ----
  {
    id: 'holy_barrier',
    name: '圣光屏障',
    description: '构筑神圣的光之屏障',
    element: 'light',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 16,
    effect: '减少16点伤害，免疫暗属性伤害1回合',
    cooldown: 2,
    animationId: 'anim_holy_barrier',
  },
  {
    id: 'divine_bless',
    name: '神圣祝福',
    description: '接受神圣的祝福，大幅提升能力',
    element: 'light',
    rarity: 'R',
    type: 'heal',
    cost: 5,
    damage: 12,
    effect: '恢复12点生命值，全属性提升15%持续2回合',
    cooldown: 2,
    animationId: 'anim_divine_bless',
  },
  {
    id: 'light_arrow',
    name: '光之箭',
    description: '凝聚光之力化为箭矢，精准射击',
    element: 'light',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 15,
    effect: '造成15点光系伤害，必中效果',
    cooldown: 1,
    animationId: 'anim_light_arrow',
  },
  {
    id: 'sanctuary',
    name: '圣域',
    description: '展开神圣领域，持续治愈与保护',
    element: 'light',
    rarity: 'R',
    type: 'heal',
    cost: 5,
    damage: 8,
    effect: '恢复8点生命值，圣域持续3回合每回合恢复5点',
    cooldown: 3,
    animationId: 'anim_sanctuary',
  },
  // ---- SR 稀有度 ----
  {
    id: 'resurrection',
    name: '复活术',
    description: '以神圣之力复活倒下的同伴',
    element: 'light',
    rarity: 'SR',
    type: 'heal',
    cost: 10,
    damage: 30,
    effect: '恢复30点生命值，若生命值低于0则复活（恢复50%最大生命）',
    cooldown: 5,
    animationId: 'anim_resurrection',
  },
  {
    id: 'judgment',
    name: '神圣审判',
    description: '降下神圣的审判之光',
    element: 'light',
    rarity: 'SR',
    type: 'attack',
    cost: 8,
    damage: 28,
    effect: '造成28点光系伤害，对暗属性目标伤害翻倍',
    cooldown: 3,
    animationId: 'anim_judgment',
  },
  {
    id: 'holy_nova',
    name: '神圣新星',
    description: '释放神圣新星，伤害敌人并治愈友方',
    element: 'light',
    rarity: 'SR',
    type: 'special',
    cost: 9,
    damage: 22,
    effect: '对敌人造成22点光系伤害，同时恢复己方全体15点生命',
    cooldown: 3,
    animationId: 'anim_holy_nova',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'celestial_grace',
    name: '天恩',
    description: '获得天界的恩宠，近乎无敌',
    element: 'light',
    rarity: 'SSR',
    type: 'heal',
    cost: 14,
    damage: 50,
    effect: '恢复50点生命值，获得无敌1回合，全属性提升25%持续3回合',
    cooldown: 6,
    animationId: 'anim_celestial_grace',
  },
  // ---- UR 稀有度 ----
  {
    id: 'genesis_light',
    name: '创世之光',
    description: '世界诞生时的第一道光，照耀万物',
    element: 'light',
    rarity: 'UR',
    type: 'special',
    cost: 20,
    damage: 55,
    effect: '造成55点光系伤害，治愈全队至满血，驱散所有负面状态',
    cooldown: 7,
    animationId: 'anim_genesis_light',
  },
];

// ============================================================================
// 暗系卡牌（Dark Cards）
// ============================================================================

/** 暗系卡牌集合 */
export const DARK_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'shadow_bolt',
    name: '暗影弹',
    description: '发射一颗暗影能量弹',
    element: 'dark',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 7,
    effect: '造成7点暗系伤害',
    cooldown: 0,
    animationId: 'anim_shadow_bolt',
  },
  {
    id: 'dark_mist',
    name: '黑暗之雾',
    description: '释放黑暗之雾笼罩战场',
    element: 'dark',
    rarity: 'N',
    type: 'defense',
    cost: 2,
    damage: 5,
    effect: '减少5点伤害，降低敌人命中率10%持续1回合',
    cooldown: 0,
    animationId: 'anim_dark_mist',
  },
  {
    id: 'curse',
    name: '诅咒',
    description: '施加诅咒，持续削弱敌人',
    element: 'dark',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 3,
    effect: '造成3点伤害，诅咒持续3回合每回合2点伤害',
    cooldown: 1,
    animationId: 'anim_curse',
  },
  {
    id: 'drain',
    name: '吸取',
    description: '吸取敌人的生命力',
    element: 'dark',
    rarity: 'N',
    type: 'attack',
    cost: 2,
    damage: 5,
    effect: '造成5点伤害，恢复等量50%生命值',
    cooldown: 0,
    animationId: 'anim_drain',
  },
  {
    id: 'fear',
    name: '恐惧',
    description: '释放恐惧之力，动摇敌人意志',
    element: 'dark',
    rarity: 'N',
    type: 'magic',
    cost: 2,
    damage: 4,
    effect: '造成4点伤害，降低敌人攻击10%持续1回合',
    cooldown: 1,
    animationId: 'anim_fear',
  },
  // ---- R 稀有度 ----
  {
    id: 'shadow_blade',
    name: '影之刃',
    description: '暗影凝聚成锋利的刀刃',
    element: 'dark',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 15,
    effect: '造成15点暗系伤害，从暗影中突袭（先手+2）',
    cooldown: 1,
    animationId: 'anim_shadow_blade',
  },
  {
    id: 'void_blast',
    name: '虚空爆破',
    description: '引爆虚空能量，撕裂空间',
    element: 'dark',
    rarity: 'R',
    type: 'attack',
    cost: 5,
    damage: 18,
    effect: '造成18点暗系伤害，无视15%防御',
    cooldown: 2,
    animationId: 'anim_void_blast',
  },
  {
    id: 'life_drain',
    name: '生命吸取',
    description: '强力的生命力吸取，大量恢复自身',
    element: 'dark',
    rarity: 'R',
    type: 'attack',
    cost: 4,
    damage: 12,
    effect: '造成12点伤害，恢复等量80%生命值',
    cooldown: 2,
    animationId: 'anim_life_drain',
  },
  {
    id: 'dark_pact',
    name: '暗黑契约',
    description: '签订暗黑契约，以生命换取力量',
    element: 'dark',
    rarity: 'R',
    type: 'special',
    cost: 3,
    damage: 0,
    effect: '消耗10%当前生命值，攻击力提升40%持续3回合',
    cooldown: 3,
    animationId: 'anim_dark_pact',
  },
  // ---- SR 稀有度 ----
  {
    id: 'shadow_storm',
    name: '暗影风暴',
    description: '召唤暗影构成的风暴',
    element: 'dark',
    rarity: 'SR',
    type: 'attack',
    cost: 7,
    damage: 26,
    effect: '造成26点暗系伤害，诅咒效果翻倍',
    cooldown: 3,
    animationId: 'anim_shadow_storm',
  },
  {
    id: 'abyss_call',
    name: '深渊呼唤',
    description: '呼唤深渊中的力量，侵蚀敌人灵魂',
    element: 'dark',
    rarity: 'SR',
    type: 'magic',
    cost: 8,
    damage: 22,
    effect: '造成22点暗系伤害，降低敌人全属性20%持续2回合',
    cooldown: 3,
    animationId: 'anim_abyss_call',
  },
  {
    id: 'oblivion',
    name: '忘却',
    description: '使敌人陷入忘却，遗忘技能',
    element: 'dark',
    rarity: 'SR',
    type: 'magic',
    cost: 7,
    damage: 18,
    effect: '造成18点伤害，随机封印敌人1个技能2回合',
    cooldown: 3,
    animationId: 'anim_oblivion',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'black_hole',
    name: '黑洞',
    description: '在战场中央撕开一个黑洞，吞噬一切',
    element: 'dark',
    rarity: 'SSR',
    type: 'attack',
    cost: 15,
    damage: 50,
    effect: '造成50点暗系伤害，吸取敌人25%最大生命值，降低全属性30%',
    cooldown: 5,
    animationId: 'anim_black_hole',
  },
  // ---- UR 稀有度 ----
  {
    id: 'void_annihilation',
    name: '虚空湮灭',
    description: '将敌人拖入虚空，彻底湮灭其存在',
    element: 'dark',
    rarity: 'UR',
    type: 'attack',
    cost: 22,
    damage: 70,
    effect: '造成70点暗系伤害，湮灭效果（低于20%生命值直接消灭），吸取50%伤害为生命',
    cooldown: 7,
    animationId: 'anim_void_annihilation',
  },
];

// ============================================================================
// 中立卡牌（Neutral Cards）
// ============================================================================

/** 中立卡牌集合 */
export const NEUTRAL_CARDS: Card[] = [
  // ---- N 稀有度 ----
  {
    id: 'basic_strike',
    name: '基础打击',
    description: '最基础的物理攻击',
    element: 'neutral',
    rarity: 'N',
    type: 'attack',
    cost: 1,
    damage: 5,
    effect: '造成5点物理伤害',
    cooldown: 0,
    animationId: 'anim_basic_strike',
  },
  {
    id: 'defend',
    name: '防御',
    description: '采取防御姿态，减少伤害',
    element: 'neutral',
    rarity: 'N',
    type: 'defense',
    cost: 1,
    damage: 8,
    effect: '减少8点伤害',
    cooldown: 0,
    animationId: 'anim_defend',
  },
  {
    id: 'concentrate',
    name: '集中',
    description: '集中精神，恢复MP',
    element: 'neutral',
    rarity: 'N',
    type: 'special',
    cost: 0,
    damage: 0,
    effect: '恢复3点MP',
    cooldown: 2,
    animationId: 'anim_concentrate',
  },
  {
    id: 'analyze',
    name: '分析',
    description: '分析敌人弱点',
    element: 'neutral',
    rarity: 'N',
    type: 'special',
    cost: 1,
    damage: 0,
    effect: '揭示敌人属性和弱点，下次攻击伤害+15%',
    cooldown: 2,
    animationId: 'anim_analyze',
  },
  // ---- R 稀有度 ----
  {
    id: 'power_surge',
    name: '力量涌动',
    description: '体内涌动着强大的力量',
    element: 'neutral',
    rarity: 'R',
    type: 'special',
    cost: 3,
    damage: 0,
    effect: '攻击力提升30%持续3回合',
    cooldown: 3,
    animationId: 'anim_power_surge',
  },
  {
    id: 'energy_field',
    name: '能量场',
    description: '展开能量护场保护自身',
    element: 'neutral',
    rarity: 'R',
    type: 'defense',
    cost: 4,
    damage: 15,
    effect: '减少15点伤害，吸收30%伤害转化为MP',
    cooldown: 2,
    animationId: 'anim_energy_field',
  },
  {
    id: 'quick_step',
    name: '疾步',
    description: '极速移动，躲避攻击',
    element: 'neutral',
    rarity: 'R',
    type: 'defense',
    cost: 3,
    damage: 0,
    effect: '闪避率提升50%持续1回合，先手+2',
    cooldown: 2,
    animationId: 'anim_quick_step',
  },
  {
    id: 'counter',
    name: '反击',
    description: '进入反击姿态，等待敌人露出破绽',
    element: 'neutral',
    rarity: 'R',
    type: 'special',
    cost: 3,
    damage: 12,
    effect: '下次受到攻击时反击，造成12点伤害并眩晕1回合',
    cooldown: 2,
    animationId: 'anim_counter',
  },
  // ---- SR 稀有度 ----
  {
    id: 'mirror_reflect',
    name: '镜面反射',
    description: '构筑镜面屏障，反射一切攻击',
    element: 'neutral',
    rarity: 'SR',
    type: 'defense',
    cost: 7,
    damage: 0,
    effect: '反弹100%伤害持续1回合，免疫魔法伤害',
    cooldown: 4,
    animationId: 'anim_mirror_reflect',
  },
  {
    id: 'time_stop',
    name: '时间停止',
    description: '停止时间流动，获得额外行动',
    element: 'neutral',
    rarity: 'SR',
    type: 'special',
    cost: 10,
    damage: 0,
    effect: '停止时间1回合，获得2次额外行动机会',
    cooldown: 5,
    animationId: 'anim_time_stop',
  },
  // ---- SSR 稀有度 ----
  {
    id: 'wish',
    name: '许愿',
    description: '向星辰许下愿望，实现不可能之事',
    element: 'neutral',
    rarity: 'SSR',
    type: 'special',
    cost: 15,
    damage: 0,
    effect: '随机触发：满血恢复/全属性+50%/无敌2回合/随机UR卡效果',
    cooldown: 8,
    animationId: 'anim_wish',
  },
  // ---- UR 稀有度 ----
  {
    id: 'reality_rewrite',
    name: '现实改写',
    description: '改写现实法则，超越一切规则',
    element: 'neutral',
    rarity: 'UR',
    type: 'special',
    cost: 25,
    damage: 80,
    effect: '造成80点无属性伤害，无视一切防御/免疫/护盾，重写战斗规则',
    cooldown: 8,
    animationId: 'anim_reality_rewrite',
  },
];

// ============================================================================
// 卡牌池（CARD_POOL）
// ============================================================================

/**
 * 全部卡牌池 - 包含所有卡牌
 * @description 合并所有元素的卡牌为一个完整卡牌池
 */
export const CARD_POOL: Card[] = [
  ...FIRE_CARDS,
  ...ICE_CARDS,
  ...WATER_CARDS,
  ...WIND_CARDS,
  ...EARTH_CARDS,
  ...LIGHTNING_CARDS,
  ...LIGHT_CARDS,
  ...DARK_CARDS,
  ...NEUTRAL_CARDS,
];

// ============================================================================
// 元素克制关系（ELEMENT_RELATIONS）
// ============================================================================

/**
 * 元素克制关系表
 * @description 定义元素间的克制关系
 * - 1.5 = 克制（优势）
 * - 1.0 = 正常
 * - 0.75 = 被克制（劣势）
 *
 * 克制链：
 * 火 → 冰 → 风 → 地 → 雷 → 水 → 火
 * 光 ↔ 暗（互相克制）
 * 中立无克制关系
 */
export const ELEMENT_RELATIONS: Record<Element, Record<Element, number>> = {
  fire: {
    fire: 1.0,
    ice: 1.5,
    water: 0.75,
    wind: 1.0,
    earth: 1.0,
    lightning: 1.0,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  ice: {
    fire: 0.75,
    ice: 1.0,
    water: 1.0,
    wind: 1.5,
    earth: 1.0,
    lightning: 1.0,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  water: {
    fire: 1.5,
    ice: 1.0,
    water: 1.0,
    wind: 1.0,
    earth: 1.0,
    lightning: 0.75,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  wind: {
    fire: 1.0,
    ice: 0.75,
    water: 1.0,
    wind: 1.0,
    earth: 1.5,
    lightning: 1.0,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  earth: {
    fire: 1.0,
    ice: 1.0,
    water: 1.0,
    wind: 0.75,
    earth: 1.0,
    lightning: 1.5,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  lightning: {
    fire: 1.0,
    ice: 1.0,
    water: 1.5,
    wind: 1.0,
    earth: 0.75,
    lightning: 1.0,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
  light: {
    fire: 1.0,
    ice: 1.0,
    water: 1.0,
    wind: 1.0,
    earth: 1.0,
    lightning: 1.0,
    light: 1.0,
    dark: 1.5,
    neutral: 1.0,
  },
  dark: {
    fire: 1.0,
    ice: 1.0,
    water: 1.0,
    wind: 1.0,
    earth: 1.0,
    lightning: 1.0,
    light: 1.5,
    dark: 1.0,
    neutral: 1.0,
  },
  neutral: {
    fire: 1.0,
    ice: 1.0,
    water: 1.0,
    wind: 1.0,
    earth: 1.0,
    lightning: 1.0,
    light: 1.0,
    dark: 1.0,
    neutral: 1.0,
  },
};

// ============================================================================
// 稀有度颜色（RARITY_COLORS）
// ============================================================================

/**
 * 稀有度对应颜色
 * @description 用于UI显示中卡牌边框、文字等的颜色标识
 */
export const RARITY_COLORS: Record<Rarity, string> = {
  /** N - 普通（灰色） */
  N: '#9E9E9E',
  /** R - 稀有（蓝色） */
  R: '#2196F3',
  /** SR - 超稀有（紫色） */
  SR: '#9C27B0',
  /** SSR - 极稀有（金色） */
  SSR: '#FFD700',
  /** UR - 超越稀有（彩虹色渐变，以红色为代表） */
  UR: '#FF4081',
};

// ============================================================================
// 稀有度权重（RARITY_WEIGHTS）- 用于抽卡系统
// ============================================================================

/**
 * 抽卡系统稀有度权重
 * @description 用于决定抽卡时各稀有度的出现概率
 * - N: 50%
 * - R: 30%
 * - SR: 13%
 * - SSR: 5%
 * - UR: 2%
 */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  /** N 出现概率 50% */
  N: 50,
  /** R 出现概率 30% */
  R: 30,
  /** SR 出现概率 13% */
  SR: 13,
  /** SSR 出现概率 5% */
  SSR: 5,
  /** UR 出现概率 2% */
  UR: 2,
};

// ============================================================================
// 元素中文名称映射
// ============================================================================

/** 元素中文名称 */
export const ELEMENT_NAMES: Record<Element, string> = {
  fire: '火',
  ice: '冰',
  water: '水',
  wind: '风',
  earth: '地',
  lightning: '雷',
  light: '光',
  dark: '暗',
  neutral: '中立',
};

/** 稀有度中文名称 */
export const RARITY_NAMES: Record<Rarity, string> = {
  N: '普通',
  R: '稀有',
  SR: '超稀有',
  SSR: '极稀有',
  UR: '超越',
};

/** 卡牌类型中文名称 */
export const CARD_TYPE_NAMES: Record<CardType, string> = {
  attack: '攻击',
  defense: '防御',
  magic: '魔法',
  heal: '治疗',
  special: '特殊',
};

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 通过ID获取卡牌
 * @param id - 卡牌唯一标识
 * @returns 对应的卡牌对象，未找到则返回 undefined
 */
export function getCardById(id: string): Card | undefined {
  return CARD_POOL.find((card) => card.id === id);
}

/**
 * 按元素获取卡牌列表
 * @param element - 元素类型
 * @returns 该元素的所有卡牌
 */
export function getCardsByElement(element: Element): Card[] {
  return CARD_POOL.filter((card) => card.element === element);
}

/**
 * 按稀有度获取卡牌列表
 * @param rarity - 稀有度等级
 * @returns 该稀有度的所有卡牌
 */
export function getCardsByRarity(rarity: Rarity): Card[] {
  return CARD_POOL.filter((card) => card.rarity === rarity);
}

/**
 * 按战斗类型获取卡牌列表
 * @param type - 卡牌战斗类型
 * @returns 该类型的所有卡牌
 */
export function getCardsByType(type: CardType): Card[] {
  return CARD_POOL.filter((card) => card.type === type);
}

/**
 * 按元素和稀有度获取卡牌列表
 * @param element - 元素类型
 * @param rarity - 稀有度等级
 * @returns 符合条件的所有卡牌
 */
export function getCardsByElementAndRarity(element: Element, rarity: Rarity): Card[] {
  return CARD_POOL.filter((card) => card.element === element && card.rarity === rarity);
}

/**
 * 获取随机手牌
 * @param handSize - 手牌数量，默认5张
 * @param allowedElements - 允许的元素筛选，不传则全元素
 * @returns 随机选取的卡牌数组
 */
export function getRandomHand(handSize: number = 5, allowedElements?: Element[]): Card[] {
  const pool = allowedElements
    ? CARD_POOL.filter((card) => allowedElements.includes(card.element))
    : [...CARD_POOL];

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(handSize, shuffled.length));
}

/**
 * 按稀有度权重随机抽卡
 * @param count - 抽取数量
 * @param excludeIds - 排除的卡牌ID列表
 * @returns 随机抽取的卡牌数组
 */
export function drawRandomCards(count: number = 1, excludeIds: string[] = []): Card[] {
  const results: Card[] = [];
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, w) => sum + w, 0);

  for (let i = 0; i < count; i++) {
    let roll = Math.random() * totalWeight;
    let selectedRarity: Rarity = 'N';

    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
      roll -= weight;
      if (roll <= 0) {
        selectedRarity = rarity as Rarity;
        break;
      }
    }

    const rarityPool = getCardsByRarity(selectedRarity).filter(
      (card) => !excludeIds.includes(card.id)
    );

    if (rarityPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * rarityPool.length);
      results.push(rarityPool[randomIndex]);
    }
  }

  return results;
}

/**
 * 计算元素克制倍率
 * @param attackElement - 攻击方元素
 * @param defendElement - 防御方元素
 * @returns 伤害倍率
 */
export function getElementMultiplier(attackElement: Element, defendElement: Element): number {
  return ELEMENT_RELATIONS[attackElement]?.[defendElement] ?? 1.0;
}

/**
 * 计算实际伤害
 * @param card - 使用的卡牌
 * @param attackElement - 攻击方元素
 * @param defendElement - 防御方元素
 * @param rarityMultiplier - 稀有度伤害倍率，默认根据稀有度自动计算
 * @returns 最终伤害值
 */
export function calculateDamage(
  card: Card,
  attackElement: Element,
  defendElement: Element,
  rarityMultiplier?: number
): number {
  const elementMult = getElementMultiplier(attackElement, defendElement);
  const rarityMult = rarityMultiplier ?? getRarityMultiplier(card.rarity);
  return Math.floor(card.damage * elementMult * rarityMult);
}

/**
 * 获取稀有度对应的伤害倍率
 * @param rarity - 稀有度
 * @returns 伤害倍率
 */
export function getRarityMultiplier(rarity: Rarity): number {
  const multipliers: Record<Rarity, number> = {
    N: 1.0,
    R: 1.1,
    SR: 1.2,
    SSR: 1.35,
    UR: 1.5,
  };
  return multipliers[rarity];
}

/**
 * 获取稀有度排序权重（用于排序）
 * @param rarity - 稀有度
 * @returns 排序权重值（越高越稀有）
 */
export function getRaritySortWeight(rarity: Rarity): number {
  const weights: Record<Rarity, number> = {
    N: 1,
    R: 2,
    SR: 3,
    SSR: 4,
    UR: 5,
  };
  return weights[rarity];
}

/**
 * 按稀有度排序卡牌（从低到高）
 * @param cards - 卡牌数组
 * @returns 排序后的新数组
 */
export function sortByRarity(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => getRaritySortWeight(a.rarity) - getRaritySortWeight(b.rarity));
}

/**
 * 获取卡牌总数统计
 * @returns 各稀有度卡牌数量统计
 */
export function getCardStats(): Record<Rarity, number> & { total: number } {
  const stats = {
    N: getCardsByRarity('N').length,
    R: getCardsByRarity('R').length,
    SR: getCardsByRarity('SR').length,
    SSR: getCardsByRarity('SSR').length,
    UR: getCardsByRarity('UR').length,
    total: CARD_POOL.length,
  };
  return stats;
}

/**
 * 获取指定元素的卡牌总数统计
 * @param element - 元素类型
 * @returns 该元素各稀有度卡牌数量统计
 */
export function getElementCardStats(element: Element): Record<Rarity, number> {
  return {
    N: getCardsByElementAndRarity(element, 'N').length,
    R: getCardsByElementAndRarity(element, 'R').length,
    SR: getCardsByElementAndRarity(element, 'SR').length,
    SSR: getCardsByElementAndRarity(element, 'SSR').length,
    UR: getCardsByElementAndRarity(element, 'UR').length,
  };
}

// ============================================================================
// 内部工具函数
// ============================================================================

/**
 * Fisher-Yates 洗牌算法
 * @param array - 要打乱的数组
 * @returns 打乱后的新数组
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
