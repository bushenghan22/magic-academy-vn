/**
 * @file 角色数据定义 - 星辉魔法学院
 * @description 包含所有主要可攻略角色的详细数据，包括属性、背景故事、技能、
 *              好感度系统、画廊图片、故事路线等信息。
 * @module data/characters
 */

// ============================================================================
// 类型定义
// ============================================================================

/** 属性元素类型 */
export type Element =
  | 'fire'
  | 'ice'
  | 'water'
  | 'wind'
  | 'earth'
  | 'lightning'
  | 'light'
  | 'dark';

/** 属性元素的中文显示信息 */
export interface ElementInfo {
  /** 英文标识 */
  key: Element;
  /** 中文名称 */
  name: string;
  /** 中文描述 */
  description: string;
  /** 元素颜色（HEX） */
  color: string;
  /** 元素图标标识 */
  icon: string;
}

/** 角色情感/立绘状态 */
export type Emotion =
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'sad'
  | 'surprised'
  | 'embarrassed'
  | 'thinking'
  | 'determined'
  | 'blushing'
  | 'crying'
  | 'slight_smile'
  | 'cold_stare'
  | 'concerned'
  | 'gentle'
  | 'serious'
  | 'excited'
  | 'worried'
  | 'laughing'
  | 'pouting'
  | 'confident'
  | 'smug'
  | 'flustered'
  | 'shocked'
  | 'tsundere'
  | 'gentle_smile'
  | 'praying'
  | 'rare_smile'
  | 'satisfied';

/** 角色技能信息 */
export interface CharacterSkill {
  /** 技能英文标识 */
  id: string;
  /** 技能中文名称 */
  name: string;
  /** 技能描述 */
  description: string;
  /** 技能类型 */
  type: 'attack' | 'defense' | 'support' | 'ultimate';
  /** 技能威力值（1-100） */
  power: number;
  /** 技能消耗的魔法值 */
  mpCost: number;
  /** 技能解锁所需好感度等级 */
  unlockAffection: number;
}

/** 画廊图片信息 */
export interface GalleryImage {
  /** 图片唯一标识 */
  id: string;
  /** 图片描述/标题 */
  title: string;
  /** 图片类型 */
  type: 'sprite' | 'cg' | 'event' | 'ending';
  /** 解锁条件描述 */
  unlockCondition: string;
  /** 缩略图路径（占位） */
  thumbnail: string;
  /** 原图路径（占位） */
  fullImage: string;
}

/** 故事路线信息 */
export interface StoryRoute {
  /** 路线唯一标识 */
  id: string;
  /** 路线名称 */
  name: string;
  /** 路线描述 */
  description: string;
  /** 路线章节列表 */
  chapters: string[];
  /** 是否为好结局路线 */
  isGoodEnding: boolean;
  /** 进入路线的最低好感度要求 */
  minAffection: number;
  /** 路线关键选择节点 */
  keyChoices: string[];
}

/** 角色对话偏好 */
export interface DialoguePreferences {
  /** 角色喜欢听到的话题 */
  likedTopics: string[];
  /** 角色讨厌的话题 */
  dislikedTopics: string[];
  /** 角色的口头禅/常用语 */
  catchphrase: string;
  /** 角色说话时的语气特点 */
  speechPattern: string;
}

/** 好感度等级定义 */
export interface AffectionLevel {
  /** 等级名称 */
  name: string;
  /** 等级中文名称 */
  displayName: string;
  /** 所需好感度范围最小值 */
  min: number;
  /** 所需好感度范围最大值 */
  max: number;
  /** 达到该等级时角色对主角的称呼 */
  addressForm: string;
}

/** 完整角色数据结构 */
export interface Character {
  /** 角色唯一标识 */
  id: string;
  /** 角色中文名 */
  name: string;
  /** 角色日文名/罗马音 */
  nameEn: string;
  /** 角色称号 */
  title: string;
  /** 角色年龄 */
  age: number;
  /** 角色生日（月.日） */
  birthday: string;
  /** 角色星座 */
  zodiac: string;
  /** 角色属性元素 */
  element: ElementInfo;
  /** 角色简短描述（用于UI列表等场景） */
  shortDescription: string;
  /** 角色详细描述/传记 */
  description: string;
  /** 角色性格特点 */
  personality: string;
  /** 角色爱好 */
  likes: string[];
  /** 角色讨厌的事物 */
  dislikes: string[];
  /** 角色技能列表 */
  skills: CharacterSkill[];
  /** 角色立绘情感列表 */
  emotions: Emotion[];
  /** 初始好感度 */
  defaultAffection: number;
  /** 好感度等级定义 */
  affectionLevels: AffectionLevel[];
  /** 画廊图片数据 */
  galleryImages: GalleryImage[];
  /** 故事路线数据 */
  routes: StoryRoute[];
  /** 对话偏好 */
  dialoguePreferences: DialoguePreferences;
  /** 角色口头禅 */
  catchphrase: string;
  /** 角色所属学院/组织 */
  affiliation: string;
  /** 角色身高（cm） */
  height: number;
  /** 角色血型 */
  bloodType: string;
}

// ============================================================================
// 属性元素常量
// ============================================================================

/** 火属性 */
export const ELEMENT_FIRE: ElementInfo = {
  key: 'fire',
  name: '火',
  description: '火焰魔法，擅长高伤害攻击和范围打击',
  color: '#FF4500',
  icon: '🔥',
};

/** 冰属性 */
export const ELEMENT_ICE: ElementInfo = {
  key: 'ice',
  name: '冰',
  description: '冰霜魔法，擅长控制和防御',
  color: '#00BFFF',
  icon: '❄️',
};

/** 水属性 */
export const ELEMENT_WATER: ElementInfo = {
  key: 'water',
  name: '水',
  description: '水流魔法，兼具攻防与治愈能力',
  color: '#1E90FF',
  icon: '🌊',
};

/** 风属性 */
export const ELEMENT_WIND: ElementInfo = {
  key: 'wind',
  name: '风',
  description: '疾风魔法，以速度和灵活性见长',
  color: '#7FFFD4',
  icon: '🌀',
};

/** 土属性 */
export const ELEMENT_EARTH: ElementInfo = {
  key: 'earth',
  name: '土',
  description: '大地魔法，擅长防御和炼金术',
  color: '#DAA520',
  icon: '🪨',
};

/** 雷属性 */
export const ELEMENT_LIGHTNING: ElementInfo = {
  key: 'lightning',
  name: '雷',
  description: '雷电魔法，爆发力极强的攻击属性',
  color: '#FFD700',
  icon: '⚡',
};

/** 光属性 */
export const ELEMENT_LIGHT: ElementInfo = {
  key: 'light',
  name: '光',
  description: '圣光魔法，擅长治愈和辅助',
  color: '#FFFFF0',
  icon: '✨',
};

// ============================================================================
// 好感度等级定义
// ============================================================================

/** 默认好感度等级配置 */
const DEFAULT_AFFECTION_LEVELS: AffectionLevel[] = [
  {
    name: 'stranger',
    displayName: '陌生人',
    min: 0,
    max: 19,
    addressForm: '你',
  },
  {
    name: 'acquaintance',
    displayName: '相识',
    min: 20,
    max: 39,
    addressForm: '同学',
  },
  {
    name: 'friend',
    displayName: '朋友',
    min: 40,
    max: 59,
    addressForm: '名字（姓氏）',
  },
  {
    name: 'close_friend',
    displayName: '挚友',
    min: 60,
    max: 79,
    addressForm: '名字',
  },
  {
    name: 'confidant',
    displayName: '知己',
    min: 80,
    max: 94,
    addressForm: '专属昵称',
  },
  {
    name: 'soulmate',
    displayName: '灵魂伴侣',
    min: 95,
    max: 119,
    addressForm: '亲爱的',
  },
  {
    name: 'lover',
    displayName: '恋人',
    min: 120,
    max: 139,
    addressForm: '亲爱的/老公/老婆',
  },
  {
    name: 'beloved',
    displayName: '至爱',
    min: 140,
    max: 200,
    addressForm: '最爱的人',
  },
];

// ============================================================================
// 角色 1: 星野樱 (Hoshino Sakura) - 火属性
// ============================================================================

/**
 * 星野樱 - 烈焰之心
 *
 * 火焰魔法世家的天才少女，热情开朗，充满活力。
 * 对主角这个"突然觉醒的普通人"充满好奇，是最早接纳主角的人之一。
 *
 * @remarks
 * - 立绘包含 10 种情感表情
 * - 拥有 3 条故事路线（普通、好结局、真结局）
 * - 初始好感度 20（相识），说明她对新来者持开放态度
 * - 口头禅体现其热情奔放的性格
 */
export const SAKURA: Character = {
  id: 'sakura',
  name: '星野樱',
  nameEn: 'Hoshino Sakura',
  title: '烈焰之心',
  age: 17,
  birthday: '3月15日',
  zodiac: '双鱼座',
  element: ELEMENT_FIRE,
  shortDescription: '热情似火的火焰魔法天才，总是充满干劲',
  description:
    '来自火焰魔法世家的天才少女，从小就被寄予厚望。' +
    '星野家族是传承千年的火焰魔法名门，每一代都会诞生天赋异禀的火焰魔法师。' +
    '樱从小就展现出了超越同龄人的火焰魔法天赋，五岁时就能召唤出稳定的火球，' +
    '十岁时已经掌握了家族中只有成年人才能驾驭的高级火系魔法。' +
    '然而，与家族中循规蹈矩的传统不同，樱更喜欢用自己的方式来运用魔法，' +
    '经常做出出人意料的举动。她的房间墙壁上贴满了各种冒险故事的海报，' +
    '书架上摆满了关于古代魔法探险家的传记。' +
    '在入学典礼上第一次见到主角时，她就被这个"突然觉醒的普通人"所吸引，' +
    '因为这完全颠覆了她从小接受的"魔法天赋是天生的"这一认知。',
  personality:
    '热情开朗、充满活力、有时冲动，但内心善良。对朋友非常忠诚，遇到困难绝不退缩。' +
    '她的笑容像太阳一样温暖，能够感染身边的每一个人。' +
    '但在面对不公正的事情时，她会变得异常愤怒，甚至不惜与权威对抗。' +
    '她害怕被人认为是因为家族关系才获得成就的，所以总是比别人更加努力。',
  likes: ['辣的食物', '冒险', '烟花', '收集魔法石'],
  dislikes: ['无聊的课程', '被人小看', '寒冷的天气'],
  skills: [
    {
      id: 'fireball',
      name: '烈焰弹',
      description: '凝聚火焰之力射出高温火球，是最基础也是最常用的火系攻击魔法',
      type: 'attack',
      power: 40,
      mpCost: 15,
      unlockAffection: 0,
    },
    {
      id: 'flame_shield',
      name: '焰盾',
      description: '在身前展开一面由旋转火焰构成的护盾，能抵御物理和魔法攻击',
      type: 'defense',
      power: 50,
      mpCost: 20,
      unlockAffection: 30,
    },
    {
      id: 'blaze_rush',
      name: '烈焰突进',
      description: '将火焰包裹全身进行高速突进，对路径上的敌人造成连续伤害',
      type: 'attack',
      power: 65,
      mpCost: 30,
      unlockAffection: 50,
    },
    {
      id: 'inferno_burst',
      name: '地狱爆裂',
      description: '释放体内全部火焰之力，引发大范围的火焰爆裂。威力巨大但消耗极大，是星野家的秘技',
      type: 'ultimate',
      power: 95,
      mpCost: 60,
      unlockAffection: 80,
    },
  ],
  emotions: [
    'neutral',
    'happy',
    'angry',
    'sad',
    'surprised',
    'embarrassed',
    'thinking',
    'determined',
    'blushing',
    'crying',
  ],
  defaultAffection: 20,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'sakura_sprite_neutral',
      title: '星野樱 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/sakura/neutral_thumb.png',
      fullImage: 'assets/gallery/sakura/neutral.png',
    },
    {
      id: 'sakura_cg_intro',
      title: '初次相遇',
      type: 'cg',
      unlockCondition: '第一章：在走廊上与樱相撞',
      thumbnail: 'assets/gallery/sakura/cg_intro_thumb.png',
      fullImage: 'assets/gallery/sakura/cg_intro.png',
    },
    {
      id: 'sakura_cg_fireworks',
      title: '烟花之夜',
      type: 'cg',
      unlockCondition: '第二章：与樱一起观看学院烟花祭',
      thumbnail: 'assets/gallery/sakura/cg_fireworks_thumb.png',
      fullImage: 'assets/gallery/sakura/cg_fireworks.png',
    },
    {
      id: 'sakura_cg_training',
      title: '共同修炼',
      type: 'cg',
      unlockCondition: '第三章：在训练场帮助樱修炼新魔法',
      thumbnail: 'assets/gallery/sakura/cg_training_thumb.png',
      fullImage: 'assets/gallery/sakura/cg_training.png',
    },
    {
      id: 'sakura_ending_good',
      title: '烈焰之心 - 好结局',
      type: 'ending',
      unlockCondition: '完成樱的好结局路线',
      thumbnail: 'assets/gallery/sakura/ending_good_thumb.png',
      fullImage: 'assets/gallery/sakura/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'sakura_route_common',
      name: '烈焰的日常',
      description: '与樱在学院中的日常故事，了解她的过去和内心世界',
      chapters: [
        'ch1_fire_meet',
        'ch2_fire_training',
        'ch3_fire_festival',
        'ch4_fire_conflict',
      ],
      isGoodEnding: false,
      minAffection: 40,
      keyChoices: [
        'ch1_choose_follow_sakura',
        'ch3_choose_watch_fireworks_with_sakura',
        'ch4_choose_support_sakura',
      ],
    },
    {
      id: 'sakura_route_good',
      name: '永恒的烈焰',
      description: '帮助樱找到自己的道路，不再被家族的期望所束缚',
      chapters: [
        'ch5_fire_family_secret',
        'ch6_fire_awakening',
        'ch7_fire_choice',
        'ch8_fire_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 70,
      keyChoices: [
        'ch5_choose_listen_to_sakura',
        'ch7_choose_encourage_sakura',
        'ch8_choose_stay_with_sakura',
      ],
    },
    {
      id: 'sakura_route_true',
      name: '凤凰涅槃',
      description: '揭开星野家族的古老秘密，与樱一起面对最终的试炼',
      chapters: [
        'ch9_fire_phoenix_trial',
        'ch10_fire_past_truth',
        'ch11_fire_final_battle',
        'ch12_fire_true_ending',
      ],
      isGoodEnding: true,
      minAffection: 90,
      keyChoices: [
        'ch9_choose_enter_trial',
        'ch11_choose_use_bond_power',
        'ch12_choose_confess',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['冒险故事', '火焰魔法', '美食（特别是辣的）', '户外活动', '烟花'],
    dislikedTopics: ['家族压力', '寒冷天气', '无聊的规矩', '被当作小孩子'],
    catchphrase: '既然这样的话——那就全力以赴吧！',
    speechPattern: '语气活泼热情，喜欢用感叹句，经常不自觉地提高音量，激动时会冒出一些口头禅',
  },
  catchphrase: '既然这样的话——那就全力以赴吧！',
  affiliation: '星辉魔法学院 · 火系科',
  height: 160,
  bloodType: 'B',
};

// ============================================================================
// 角色 2: 月岛凛 (Tsukishima Rin) - 冰/水属性
// ============================================================================

/**
 * 月岛凛 - 霜月之剑
 *
 * 月岛家族的继承人，精通冰系和水系魔法。
 * 学生会副会长，表面冷淡，实则温柔。
 *
 * @remarks
 * - 初始好感度 10（最低），反映其冷淡的外表
 * - 拥有双属性（冰+水），技能覆盖面广
 * - 两条主要故事路线
 * - 与天音柚是竞争对手关系
 */
export const RIN: Character = {
  id: 'rin',
  name: '月岛凛',
  nameEn: 'Tsukishima Rin',
  title: '霜月之剑',
  age: 18,
  birthday: '12月22日',
  zodiac: '摩羯座',
  element: ELEMENT_ICE,
  shortDescription: '冷若冰霜的学生会副会长，外冷内热',
  description:
    '月岛家族的继承人，精通冰系和水系魔法。月岛家族是学院的创始家族之一，' +
    '数百年来一直致力于魔法理论的研究和教育。凛从小接受精英教育，' +
    '在严格的家教下成长为一名品学兼优的魔法使。她对魔法有着深刻的理解，' +
    '不仅擅长实战，更精通魔法理论，经常在学术期刊上发表论文。' +
    '作为学生会副会长，她将学院事务管理得井井有条。看似冷淡的外表下隐藏着温柔的心，' +
    '只在信任的人面前展露真实的一面。她的房间里藏着一本写满少女心事的日记，' +
    '以及几本她不好意思让别人看到的少女漫画。在深夜的学院图书馆里，' +
    '偶尔能看到她对着窗外的月光露出柔和的微笑。',
  personality:
    '冷静沉着、理性思考、表面冷漠实则温柔。学生会副会长，对自己的要求非常严格。' +
    '她习惯用逻辑来分析一切，包括感情。但在面对温暖的人和事时，' +
    '她精心维护的面具偶尔会出现裂痕，露出真实的温柔。' +
    '她害怕被人看到脆弱的一面，因为在月岛家族中，' +
    '软弱是不被允许的。',
  likes: ['绿茶', '读书', '古典音乐', '下雪天'],
  dislikes: ['甜食', '喧闹的环境', '不守规矩的人'],
  skills: [
    {
      id: 'ice_lance',
      name: '冰晶之枪',
      description: '在空中凝聚冰之枪矛投向敌人，穿透力极强',
      type: 'attack',
      power: 50,
      mpCost: 18,
      unlockAffection: 0,
    },
    {
      id: 'frost_barrier',
      name: '霜华结界',
      description: '召唤厚重的冰霜形成全方位结界，可同时保护多人',
      type: 'defense',
      power: 60,
      mpCost: 25,
      unlockAffection: 25,
    },
    {
      id: 'tidal_wave',
      name: '潮汐洪流',
      description: '操控大量水流形成巨浪冲击敌人，兼具水系的柔韧和冰系的锐利',
      type: 'attack',
      power: 70,
      mpCost: 35,
      unlockAffection: 50,
    },
    {
      id: 'absolute_zero',
      name: '绝对零度',
      description: '月岛家的终极奥义。将周围温度降至绝对零度，冻结一切。需要极大的魔力和精神集中力',
      type: 'ultimate',
      power: 100,
      mpCost: 70,
      unlockAffection: 85,
    },
  ],
  emotions: [
    'neutral',
    'slight_smile',
    'cold_stare',
    'surprised',
    'embarrassed',
    'concerned',
    'angry',
    'sad',
    'gentle',
    'serious',
  ],
  defaultAffection: 10,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'rin_sprite_neutral',
      title: '月岛凛 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/rin/neutral_thumb.png',
      fullImage: 'assets/gallery/rin/neutral.png',
    },
    {
      id: 'rin_cg_library',
      title: '月下读书',
      type: 'cg',
      unlockCondition: '第二章：在图书馆偶遇凛',
      thumbnail: 'assets/gallery/rin/cg_library_thumb.png',
      fullImage: 'assets/gallery/rin/cg_library.png',
    },
    {
      id: 'rin_cg_snow',
      title: '雪中漫步',
      type: 'cg',
      unlockCondition: '第四章：雪天与凛一同散步',
      thumbnail: 'assets/gallery/rin/cg_snow_thumb.png',
      fullImage: 'assets/gallery/rin/cg_snow.png',
    },
    {
      id: 'rin_cg_vulnerable',
      title: '面具之下',
      type: 'cg',
      unlockCondition: '第五章：看到凛脆弱的一面',
      thumbnail: 'assets/gallery/rin/cg_vulnerable_thumb.png',
      fullImage: 'assets/gallery/rin/cg_vulnerable.png',
    },
    {
      id: 'rin_ending_good',
      title: '霜月之约 - 好结局',
      type: 'ending',
      unlockCondition: '完成凛的好结局路线',
      thumbnail: 'assets/gallery/rin/ending_good_thumb.png',
      fullImage: 'assets/gallery/rin/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'rin_route_common',
      name: '冰霜的裂缝',
      description: '在学生会的工作中逐渐接近凛，看到她不为人知的一面',
      chapters: [
        'ch1_ice_student_council',
        'ch2_ice_library_encounter',
        'ch3_ice_competition',
        'ch4_ice_gentle_moment',
      ],
      isGoodEnding: false,
      minAffection: 35,
      keyChoices: [
        'ch1_choose_join_student_council',
        'ch3_choose_help_rin',
        'ch4_choose_give_tea_to_rin',
      ],
    },
    {
      id: 'rin_route_good',
      name: '融化的冰心',
      description: '帮助凛走出家族的束缚，找到真正的自我',
      chapters: [
        'ch5_ice_family_pressure',
        'ch6_ice_tears_in_rain',
        'ch7_ice_choice_of_heart',
        'ch8_ice_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 70,
      keyChoices: [
        'ch5_choose_stand_up_for_rin',
        'ch6_choose_hold_her_hand',
        'ch7_choose_choose_freedom',
        'ch8_choose_promise',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['魔法理论', '古典文学', '茶道', '安静的环境', '学术讨论'],
    dislikedTopics: ['不守规矩的行为', '吵闹的聚会', '甜食', '被人开玩笑'],
    catchphrase: '……仅此而已。不要误会了。',
    speechPattern: '语气平淡简洁，很少使用感叹句，偶尔在不经意间说出温柔的话后立刻否认',
  },
  catchphrase: '……仅此而已。不要误会了。',
  affiliation: '星辉魔法学院 · 学生会副会长 · 冰水双系科',
  height: 165,
  bloodType: 'A',
};

// ============================================================================
// 角色 3: 风间铃 (Kazaka Suzu) - 风属性
// ============================================================================

/**
 * 风间铃 - 疾风之翼
 *
 * 来自风之精灵村落的半精灵少女，活泼可爱，好奇心旺盛。
 * 对主角非常友好，是最先主动接近主角的人。
 *
 * @remarks
 * - 初始好感度 30（友好），说明她天性亲近他人
 * - 半精灵血统赋予她独特的风系魔法天赋
 * - 是游戏中最"元气"的角色，担当班级开心果
 */
export const SUZU: Character = {
  id: 'suzu',
  name: '风间铃',
  nameEn: 'Kazaka Suzu',
  title: '疾风之翼',
  age: 16,
  birthday: '6月8日',
  zodiac: '双子座',
  element: ELEMENT_WIND,
  shortDescription: '元气满满的半精灵少女，风系魔法的天才',
  description:
    '来自风之精灵村落的半精灵少女，拥有罕见的风系魔法天赋。' +
    '她的母亲是人类魔法使，父亲是风之精灵，这种混血身份在魔法世界中并不常见。' +
    '铃继承了精灵族对自然的亲和力和人类的创造力，能够感知风的意志，' +
    '甚至与风之精灵直接对话。她的魔法风格与学院中其他学生截然不同，' +
    '更接近于古老的精灵魔法——优雅而自由。铃的耳朵略微尖尖的，' +
    '平时会用发饰巧妙地遮住。她总是穿着一件飘逸的外套，' +
    '无论在什么天气里都随风舞动，像她本人一样充满活力。' +
    '她是第一个在学院里主动和主角搭话的人，因为她觉得"觉醒者"非常有趣。',
  personality:
    '活泼可爱、好奇心旺盛、有点冒失。是班级里的开心果，总能带给周围的人快乐。' +
    '她的思维方式天马行空，经常有出人意料的想法。虽然经常犯小错误——' +
    '比如走错教室、把盐当糖放——但总能用乐观的态度化解尴尬。' +
    '在朋友遇到困难时，她总是第一个站出来，用她特有的方式安慰大家。' +
    '她偶尔会思念故乡的精灵森林，但更喜欢在人类世界结交各种各样的朋友。',
  likes: ['甜食', '小动物', '冒险故事', '收集羽毛'],
  dislikes: ['无聊的事', '被人忽视', '打雷'],
  skills: [
    {
      id: 'wind_blade',
      name: '风刃',
      description: '将风之魔力凝聚成锋利的风刃射出，速度极快，几乎无法用肉眼捕捉',
      type: 'attack',
      power: 35,
      mpCost: 12,
      unlockAffection: 0,
    },
    {
      id: 'gale_force',
      name: '烈风之力',
      description: '召唤强大的风暴冲击敌人，能将中型物体吹飞',
      type: 'attack',
      power: 55,
      mpCost: 25,
      unlockAffection: 30,
    },
    {
      id: 'sky_dance',
      name: '天空之舞',
      description: '操控风之精灵在空中自由飞行，大幅提高机动性并获得短暂无敌',
      type: 'support',
      power: 30,
      mpCost: 20,
      unlockAffection: 45,
    },
    {
      id: 'storm_summon',
      name: '风暴召唤',
      description: '以精灵之力呼唤自然风暴，将方圆百米化为风暴领域。是铃的精灵血统觉醒后的力量',
      type: 'ultimate',
      power: 90,
      mpCost: 55,
      unlockAffection: 75,
    },
  ],
  emotions: [
    'neutral',
    'happy',
    'excited',
    'sad',
    'worried',
    'surprised',
    'embarrassed',
    'laughing',
    'pouting',
    'crying',
  ],
  defaultAffection: 30,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'suzu_sprite_neutral',
      title: '风间铃 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/suzu/neutral_thumb.png',
      fullImage: 'assets/gallery/suzu/neutral.png',
    },
    {
      id: 'suzu_cg_meet',
      title: '微风中的相遇',
      type: 'cg',
      unlockCondition: '第一章：铃主动向主角搭话',
      thumbnail: 'assets/gallery/suzu/cg_meet_thumb.png',
      fullImage: 'assets/gallery/suzu/cg_meet.png',
    },
    {
      id: 'suzu_cg_feather',
      title: '珍贵的羽毛',
      type: 'cg',
      unlockCondition: '第三章：帮铃找到珍贵的精灵羽毛',
      thumbnail: 'assets/gallery/suzu/cg_feather_thumb.png',
      fullImage: 'assets/gallery/suzu/cg_feather.png',
    },
    {
      id: 'suzu_cg_sky',
      title: '翱翔天际',
      type: 'cg',
      unlockCondition: '第五章：与铃一起在天空飞翔',
      thumbnail: 'assets/gallery/suzu/cg_sky_thumb.png',
      fullImage: 'assets/gallery/suzu/cg_sky.png',
    },
    {
      id: 'suzu_ending_good',
      title: '风之约定 - 好结局',
      type: 'ending',
      unlockCondition: '完成铃的好结局路线',
      thumbnail: 'assets/gallery/suzu/ending_good_thumb.png',
      fullImage: 'assets/gallery/suzu/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'suzu_route_common',
      name: '微风的轨迹',
      description: '与铃一起度过充满欢笑的校园生活，了解半精灵的世界',
      chapters: [
        'ch1_wind_first_meet',
        'ch2_wind_adventure',
        'ch3_wind_feather_hunt',
        'ch4_wind_homeland',
      ],
      isGoodEnding: false,
      minAffection: 40,
      keyChoices: [
        'ch1_choose_accept_suzu_friendship',
        'ch3_choose_help_find_feather',
        'ch4_choose_listen_to_suzu_story',
      ],
    },
    {
      id: 'suzu_route_good',
      name: '风的归宿',
      description: '帮助铃找到在人类世界和精灵世界之间的平衡，选择自己的归属',
      chapters: [
        'ch5_wind_two_worlds',
        'ch6_wind_elf_village',
        'ch7_wind_choice',
        'ch8_wind_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 65,
      keyChoices: [
        'ch5_choose_support_suzu',
        'ch6_choose_protect_suzu',
        'ch7_choose_help_both_worlds',
        'ch8_choose_stay_by_side',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['甜食和点心', '可爱的小动物', '冒险故事', '故乡的森林', '新奇的事物'],
    dislikedTopics: ['雷雨天气', '被人忽视', '无聊沉闷的课程', '关于半精灵的偏见'],
    catchphrase: '嘿嘿~ 这个好有趣！我能试试看吗？',
    speechPattern: '语气活泼跳跃，经常使用拟声词和感叹词，说话时会加入一些精灵语的词汇',
  },
  catchphrase: '嘿嘿~ 这个好有趣！我能试试看吗？',
  affiliation: '星辉魔法学院 · 风系科',
  height: 155,
  bloodType: 'O',
};

// ============================================================================
// 角色 4: 石神葵 (Ishigami Aoi) - 土属性
// ============================================================================

/**
 * 石神葵 - 大地守护者
 *
 * 来自古老石神家族的炼金术天才，沉默寡言但稳重可靠。
 * 对炼金术有着极大的热情，一提到炼金就会变得滔滔不绝。
 *
 * @remarks
 * - 初始好感度 15（略高于凛），因为他虽然沉默但对人友善
 * - 炼金术相关技能丰富，兼具攻击和防御
 * - 角色设计偏"可靠学长"类型
 */
export const AOI: Character = {
  id: 'aoi',
  name: '石神葵',
  nameEn: 'Ishigami Aoi',
  title: '大地守护者',
  age: 18,
  birthday: '9月30日',
  zodiac: '天秤座',
  element: ELEMENT_EARTH,
  shortDescription: '沉默寡言的炼金术天才，可靠的学长',
  description:
    '来自古老的石神家族，擅长土系魔法和炼金术。石神家族世代守护着学院地下深处的' +
    '古代炼金工坊，那里保存着失传已久的炼金术秘典。葵从小就在炼金工坊中长大，' +
    '对各种矿石、药剂和魔法材料了如指掌。他能够仅凭触感就辨别出矿石的种类和品质，' +
    '甚至能听到石头深处传来的"低语"——这是石神家族特有的天赋。' +
    '平时话不多，但一提到炼金术就会变得滔滔不绝，眼睛里闪烁着狂热的光芒。' +
    '在学院里是公认的天才炼金术师，经常沉迷于实验而忘记时间。' +
    '他的实验室里摆满了各种各样的矿石标本和炼金笔记，' +
    '有些实验记录已经堆了好几年没有整理。' +
    '虽然看起来不善社交，但对后辈非常照顾，是大家公认的可靠学长。',
  personality:
    '稳重可靠、沉默寡言、做事认真。对炼金术和魔法工学有着极大的热情。' +
    '他不是不善言辞，而是觉得大多数话没有说出来的必要。' +
    '但一旦涉及到炼金术或者帮助后辈的话题，他就会像换了一个人一样变得健谈。' +
    '他的温柔体现在行动上——会在下雨天默默把伞留给忘记带伞的学弟学妹，' +
    '会在考试前偷偷在别人的桌上放一瓶提神药剂。' +
    '他害怕自己的热情会吓到别人，所以总是刻意保持距离。',
  likes: ['矿石', '炼金实验', '安静的地方', '红茶'],
  dislikes: ['浪费材料的人', '嘈杂的环境', '甜食'],
  skills: [
    {
      id: 'stone_wall',
      name: '岩壁',
      description: '瞬间从地面召唤坚固的岩壁进行防御，可根据需要调整形状和厚度',
      type: 'defense',
      power: 55,
      mpCost: 20,
      unlockAffection: 0,
    },
    {
      id: 'earthquake',
      name: '地裂术',
      description: '震动大地造成裂缝和碎石攻击，对大面积敌人效果显著',
      type: 'attack',
      power: 65,
      mpCost: 30,
      unlockAffection: 35,
    },
    {
      id: 'metal_bind',
      name: '金属缚锁',
      description: '将地下的金属矿物凝聚成锁链束缚敌人，兼具控制和伤害',
      type: 'attack',
      power: 50,
      mpCost: 25,
      unlockAffection: 50,
    },
    {
      id: 'diamond_shield',
      name: '金刚不坏',
      description: '以大地之力在全身凝聚钻石级硬度的护甲，短时间内免疫一切伤害。石神家的祖传秘术',
      type: 'ultimate',
      power: 85,
      mpCost: 65,
      unlockAffection: 80,
    },
  ],
  emotions: [
    'neutral',
    'thinking',
    'slight_smile',
    'surprised',
    'serious',
    'concerned',
    'rare_smile',
    'embarrassed',
    'angry',
    'satisfied',
  ],
  defaultAffection: 15,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'aoi_sprite_neutral',
      title: '石神葵 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/aoi/neutral_thumb.png',
      fullImage: 'assets/gallery/aoi/neutral.png',
    },
    {
      id: 'aoi_cg_lab',
      title: '炼金工坊的秘密',
      type: 'cg',
      unlockCondition: '第二章：参观葵的私人炼金工坊',
      thumbnail: 'assets/gallery/aoi/cg_lab_thumb.png',
      fullImage: 'assets/gallery/aoi/cg_lab.png',
    },
    {
      id: 'aoi_cg_mining',
      title: '地下探索',
      type: 'cg',
      unlockCondition: '第四章：与葵一起深入矿山寻找稀有矿石',
      thumbnail: 'assets/gallery/aoi/cg_mining_thumb.png',
      fullImage: 'assets/gallery/aoi/cg_mining.png',
    },
    {
      id: 'aoi_cg_rare_smile',
      title: '珍贵的微笑',
      type: 'cg',
      unlockCondition: '好感度达到80以上时触发的特殊事件',
      thumbnail: 'assets/gallery/aoi/cg_rare_smile_thumb.png',
      fullImage: 'assets/gallery/aoi/cg_rare_smile.png',
    },
    {
      id: 'aoi_ending_good',
      title: '大地之约 - 好结局',
      type: 'ending',
      unlockCondition: '完成葵的好结局路线',
      thumbnail: 'assets/gallery/aoi/ending_good_thumb.png',
      fullImage: 'assets/gallery/aoi/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'aoi_route_common',
      name: '沉默的守望',
      description: '在炼金术的修行中逐渐走进葵的内心世界',
      chapters: [
        'ch1_earth_lab_visit',
        'ch2_earth_alchemy_basics',
        'ch3_earth_rare_mineral',
        'ch4_earth_underground',
      ],
      isGoodEnding: false,
      minAffection: 40,
      keyChoices: [
        'ch1_choose_show_interest_in_alchemy',
        'ch3_choose_go_mining_with_aoi',
        'ch4_choose_help_aoi_experiment',
      ],
    },
    {
      id: 'aoi_route_good',
      name: '大地的心跳',
      description: '帮助葵走出炼金工坊，学会与人交流，找到炼金术的真正意义',
      chapters: [
        'ch5_earth_family_burden',
        'ch6_earth_forbidden_technique',
        'ch7_earth_heart_of_stone',
        'ch8_earth_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 65,
      keyChoices: [
        'ch5_choose_urge_aoi_rest',
        'ch6_choose_support_aoi_decision',
        'ch7_choose_break_through',
        'ch8_choose_await_together',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['炼金术', '稀有矿石', '魔法工学', '安静的环境', '红茶品鉴'],
    dislikedTopics: ['浪费材料', '毫无意义的闲聊', '嘈杂的聚会', '甜食'],
    catchphrase: '……嗯。……让我想想。',
    speechPattern: '说话简洁，经常省略主语和不必要的修饰语，但在讨论炼金术时会突然变得口若悬河',
  },
  catchphrase: '……嗯。……让我想想。',
  affiliation: '星辉魔法学院 · 炼金术科 · 土系科',
  height: 178,
  bloodType: 'AB',
};

// ============================================================================
// 角色 5: 天音柚 (Amane Yuzu) - 雷属性
// ============================================================================

/**
 * 天音柚 - 雷电女王
 *
 * 天音家族的大小姐，高傲自信，争强好胜。
 * 将月岛凛视为最大的竞争对手，表面高傲实则在意朋友的看法。
 *
 * @remarks
 * - 初始好感度 5（最低），因为她一开始对主角不屑一顾
 * - 典型的傲娇（ツンデレ）角色设计
 * - 与月岛凛有特殊的竞争关系
 */
export const YUZU: Character = {
  id: 'yuzu',
  name: '天音柚',
  nameEn: 'Amane Yuzu',
  title: '雷电女王',
  age: 17,
  birthday: '8月1日',
  zodiac: '狮子座',
  element: ELEMENT_LIGHTNING,
  shortDescription: '高傲的雷电魔法天才，争强好胜的大小姐',
  description:
    '天音家族的大小姐，拥有强大的雷电魔法天赋。天音家族是魔法界最富有的家族之一，' +
    '掌控着大陆上最重要的魔法晶石矿脉。柚从小就是天才中的天才，五岁时就能操控雷电，' +
    '八岁时击败了家族中最年长的魔法导师。在众人的赞美和追捧中长大的她，' +
    '对自己的实力有着绝对的自信。她把月岛凛视为最大的竞争对手，' +
    '两人的成绩和表现一直是学院中最受关注的话题。' +
    '表面高傲的她，实际上非常在意朋友的看法。' +
    '她偷偷养了一只小猫（取名为"闪电"），但从来不让人知道，' +
    '因为觉得这和她"女王"的形象不匹配。' +
    '在看到主角这个"普通人"时，她最初是不屑一顾的，' +
    '但当主角展现出勇气和成长潜力时，她的好奇心被悄悄点燃了。',
  personality:
    '高傲自信、争强好胜、不服输。但在亲近的人面前会展现出孩子气的一面。' +
    '她说话尖锐，经常无意间伤害到别人，但事后又会偷偷后悔。' +
    '她不善于表达柔软的情感，所以总是用命令和挑剔来掩饰关心。' +
    '她的房间里有一个秘密抽屉，里面装满了朋友们送她的小礼物，' +
    '每一个都被仔细保存着。她害怕被人看到真实的自己——' +
    '那个其实有点缺乏安全感、渴望真正友谊的自己。',
  likes: ['胜利', '被人称赞', '辣味点心', '看星星'],
  dislikes: ['失败', '被人忽视', '无聊的事', '虫子'],
  skills: [
    {
      id: 'thunder_bolt',
      name: '雷击',
      description: '召唤雷电劈向目标，速度快且伤害高，是天音家最常用的基础雷系魔法',
      type: 'attack',
      power: 50,
      mpCost: 18,
      unlockAffection: 0,
    },
    {
      id: 'lightning_chain',
      name: '连锁闪电',
      description: '释放雷电在多个敌人之间弹射连锁攻击，敌人越多效果越强',
      type: 'attack',
      power: 60,
      mpCost: 28,
      unlockAffection: 30,
    },
    {
      id: 'volt_shield',
      name: '电磁屏障',
      description: '展开由电磁力构成的防护屏障，接触屏障的敌人会受到电击',
      type: 'defense',
      power: 55,
      mpCost: 22,
      unlockAffection: 45,
    },
    {
      id: 'judgment_bolt',
      name: '审判之雷',
      description: '天音家的终极奥义。从天际召唤审判之雷，足以改变天象。使用后会有短暂的虚弱期',
      type: 'ultimate',
      power: 100,
      mpCost: 75,
      unlockAffection: 85,
    },
  ],
  emotions: [
    'neutral',
    'confident',
    'smug',
    'angry',
    'surprised',
    'embarrassed',
    'flustered',
    'laughing',
    'shocked',
    'tsundere',
  ],
  defaultAffection: 5,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'yuzu_sprite_neutral',
      title: '天音柚 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/yuzu/neutral_thumb.png',
      fullImage: 'assets/gallery/yuzu/neutral.png',
    },
    {
      id: 'yuzu_cg_intro',
      title: '女王的蔑视',
      type: 'cg',
      unlockCondition: '第一章：在课堂上被柚当众嘲讽',
      thumbnail: 'assets/gallery/yuzu/cg_intro_thumb.png',
      fullImage: 'assets/gallery/yuzu/cg_intro.png',
    },
    {
      id: 'yuzu_cg_cat',
      title: '秘密暴露',
      type: 'cg',
      unlockCondition: '第三章：意外发现柚偷偷照顾小猫',
      thumbnail: 'assets/gallery/yuzu/cg_cat_thumb.png',
      fullImage: 'assets/gallery/yuzu/cg_cat.png',
    },
    {
      id: 'yuzu_cg_stars',
      title: '星空之下',
      type: 'cg',
      unlockCondition: '第五章：与柚一起看星星的夜晚',
      thumbnail: 'assets/gallery/yuzu/cg_stars_thumb.png',
      fullImage: 'assets/gallery/yuzu/cg_stars.png',
    },
    {
      id: 'yuzu_ending_good',
      title: '雷电的温柔 - 好结局',
      type: 'ending',
      unlockCondition: '完成柚的好结局路线',
      thumbnail: 'assets/gallery/yuzu/ending_good_thumb.png',
      fullImage: 'assets/gallery/yuzu/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'yuzu_route_common',
      name: '电光石火',
      description: '从被柚轻视到逐渐获得她的认可，走进她的内心世界',
      chapters: [
        'ch1_thunder_arrogance',
        'ch2_thunder_challenge',
        'ch3_thunder_secret_cat',
        'ch4_thunder_soft_spot',
      ],
      isGoodEnding: false,
      minAffection: 35,
      keyChoices: [
        'ch1_choose_challenge_yuzu_back',
        'ch2_choose_show_growth',
        'ch3_choose_keep_secret',
        'ch4_choose_say_kind_words',
      ],
    },
    {
      id: 'yuzu_route_good',
      name: '雷之花绽放',
      description: '帮助柚放下高傲的面具，学会真正的信任和温柔',
      chapters: [
        'ch5_thunder_lonely_heart',
        'ch6_thunder_rivalry',
        'ch7_thunder_vulnerability',
        'ch8_thunder_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 70,
      keyChoices: [
        'ch5_choose_ comfort_yuzu',
        'ch6_choose_choose_yuzu_side',
        'ch7_choose_accept_real_yuzu',
        'ch8_choose_confession',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['胜利和成就', '被人称赞', '看星星', '辣味零食', '魔法战斗'],
    dislikedTopics: ['失败', '被忽视', '虫子', '被人看到软弱的样子', '被人拿来和凛比较'],
    catchphrase: '哼！这、这不过是理所当然的事而已！才不是为了你才做的！',
    speechPattern: '语气高傲傲慢，经常用反问和讽刺，但在害羞或感动时会变得结结巴巴，典型的傲娇语气',
  },
  catchphrase: '哼！这、这不过是理所当然的事而已！才不是为了你才做的！',
  affiliation: '星辉魔法学院 · 雷系科',
  height: 158,
  bloodType: 'B',
};

// ============================================================================
// 角色 6: 白石真白 (Shiraishi Mashiro) - 光属性
// ============================================================================

/**
 * 白石真白 - 圣光之翼
 *
 * 来自圣光教会的治愈系少女，温柔善良，安静内向。
 * 拥有罕见的光系治愈魔法天赋，是学院中备受尊敬的治愈师。
 *
 * @remarks
 * - 初始好感度 25（友好偏上），因为她天性温柔善良
 * - 光系治愈魔法在游戏中是稀缺角色
 * - 虽然平时安静，关键时刻会展现出惊人的勇气
 */
export const MASHIRO: Character = {
  id: 'mashiro',
  name: '白石真白',
  nameEn: 'Shiraishi Mashiro',
  title: '圣光之翼',
  age: 16,
  birthday: '12月25日',
  zodiac: '摩羯座',
  element: ELEMENT_LIGHT,
  shortDescription: '温柔的治愈系少女，圣光的使者',
  description:
    '来自圣光教会的少女，从小在教会中长大。圣光教会是大陆上最古老的宗教组织之一，' +
    '信奉光之女神艾露西亚。真白在教会的孤儿院中被发现时，身上散发着淡淡的金色光芒，' +
    '被认定为"圣光的选民"——百年一遇的光系治愈魔法天赋者。' +
    '在教会的培养下，她成为了一名出色的治愈师，' +
    '能够在短时间内治愈严重的伤势，甚至可以净化被黑暗魔法侵蚀的区域。' +
    '她性格温柔，总是为他人着想，甚至会不顾自己的身体状况去帮助别人。' +
    '在学院里，无论是受伤的同学还是生病的老师，都会来找她治疗。' +
    '虽然平时安静内向，但在关键时刻——当重要的人面临危险时——' +
    '她会展现出惊人的勇气和力量，这种反差让很多人对她刮目相看。' +
    '她偶尔会对着天空祈祷，祈祷所有人都能幸福平安。',
  personality:
    '温柔善良、安静内向、有点天然呆。拥有治愈魔法的天赋，总是关心身边的人。' +
    '她的温柔不是软弱，而是一种发自内心的力量。' +
    '她能够敏锐地察觉到别人情绪的变化，总是第一个注意到谁在难过。' +
    '但她也有天然呆的一面——经常走着走着就迷路，做饭时分不清调味料，' +
    '有时候会对着花说话还以为花在回答她。' +
    '她害怕黑暗的地方，因为小时候在孤儿院有过不好的回忆。' +
    '她也害怕给别人添麻烦，所以总是独自承受所有的困难。',
  likes: ['花', '看书', '帮别人', '温暖的天气'],
  dislikes: ['争吵', '黑暗的地方', '被人担心'],
  skills: [
    {
      id: 'heal_light',
      name: '治愈之光',
      description: '释放温暖的金色光芒治疗目标的伤势，是最基础的治愈魔法',
      type: 'support',
      power: 40,
      mpCost: 15,
      unlockAffection: 0,
    },
    {
      id: 'holy_barrier',
      name: '圣光结界',
      description: '展开神圣的光之结界保护区域内的同伴，同时缓慢回复结界内所有人的生命力',
      type: 'defense',
      power: 55,
      mpCost: 25,
      unlockAffection: 25,
    },
    {
      id: 'divine_bless',
      name: '神之祝福',
      description: '召唤光之女神的祝福，大幅提升所有同伴的攻击、防御和魔法抗性',
      type: 'support',
      power: 70,
      mpCost: 35,
      unlockAffection: 50,
    },
    {
      id: 'resurrection',
      name: '圣者复生',
      description: '以自身生命力为代价，复活一名倒下的同伴。这是圣光教会最高阶的治愈魔法，使用后真白会极度虚弱',
      type: 'ultimate',
      power: 100,
      mpCost: 80,
      unlockAffection: 85,
    },
  ],
  emotions: [
    'neutral',
    'gentle_smile',
    'happy',
    'worried',
    'sad',
    'surprised',
    'embarrassed',
    'praying',
    'crying',
    'determined',
  ],
  defaultAffection: 25,
  affectionLevels: DEFAULT_AFFECTION_LEVELS,
  galleryImages: [
    {
      id: 'mashiro_sprite_neutral',
      title: '白石真白 - 默认立绘',
      type: 'sprite',
      unlockCondition: '初始解锁',
      thumbnail: 'assets/gallery/mashiro/neutral_thumb.png',
      fullImage: 'assets/gallery/mashiro/neutral.png',
    },
    {
      id: 'mashiro_cg_heal',
      title: '温柔的光芒',
      type: 'cg',
      unlockCondition: '第一章：受伤后被真白治愈',
      thumbnail: 'assets/gallery/mashiro/cg_heal_thumb.png',
      fullImage: 'assets/gallery/mashiro/cg_heal.png',
    },
    {
      id: 'mashiro_cg_garden',
      title: '教会花园',
      type: 'cg',
      unlockCondition: '第三章：在教会花园中与真白赏花',
      thumbnail: 'assets/gallery/mashiro/cg_garden_thumb.png',
      fullImage: 'assets/gallery/mashiro/cg_garden.png',
    },
    {
      id: 'mashiro_cg_pray',
      title: '祈祷之翼',
      type: 'cg',
      unlockCondition: '第五章：看到真白展开光之翼的神圣姿态',
      thumbnail: 'assets/gallery/mashiro/cg_pray_thumb.png',
      fullImage: 'assets/gallery/mashiro/cg_pray.png',
    },
    {
      id: 'mashiro_ending_good',
      title: '圣光的祝福 - 好结局',
      type: 'ending',
      unlockCondition: '完成真白的好结局路线',
      thumbnail: 'assets/gallery/mashiro/ending_good_thumb.png',
      fullImage: 'assets/gallery/mashiro/ending_good.png',
    },
  ],
  routes: [
    {
      id: 'mashiro_route_common',
      name: '温柔的祈祷',
      description: '在与真白的日常接触中，逐渐走进她的内心，了解圣光教会的秘密',
      chapters: [
        'ch1_light_healing',
        'ch2_light_church_visit',
        'ch3_light_garden_talk',
        'ch4_light_dark_memory',
      ],
      isGoodEnding: false,
      minAffection: 40,
      keyChoices: [
        'ch1_choose_thank_mashiro',
        'ch2_choose_visit_church',
        'ch3_choose_listen_to_mashiro',
        'ch4_choose_proteck_mashiro',
      ],
    },
    {
      id: 'mashiro_route_good',
      name: '圣光的奇迹',
      description: '帮助真白找到自我价值，不再将全部的自我奉献给他人，学会也为自己而活',
      chapters: [
        'ch5_light_prophecy',
        'ch6_light_darkness_returns',
        'ch7_light_self_sacrifice',
        'ch8_light_good_ending',
      ],
      isGoodEnding: true,
      minAffection: 70,
      keyChoices: [
        'ch5_choose_believe_in_mashiro',
        'ch6_choose_fight_together',
        'ch7_choose_stop_mashiro',
        'ch8_choose_promise_future',
      ],
    },
  ],
  dialoguePreferences: {
    likedTopics: ['花和植物', '教会的故事', '帮助别人', '温暖的天气', '安静的读书'],
    dislikedTopics: ['争吵和冲突', '黑暗的地方', '别人为她担心', '关于她的过去'],
    catchphrase: '愿圣光祝福你……你能平安无事真是太好了。',
    speechPattern: '语气轻柔温和，经常使用祈祷和祝福的词汇，紧张时会结巴，偶尔会不自觉地对着空气说话',
  },
  catchphrase: '愿圣光祝福你……你能平安无事真是太好了。',
  affiliation: '星辉魔法学院 · 光系治愈科 · 圣光教会',
  height: 152,
  bloodType: 'A',
};

// ============================================================================
// 角色集合与索引
// ============================================================================

/**
 * 所有主要角色的集合，以角色 ID 为键。
 *
 * @example
 * ```typescript
 * import { CHARACTERS } from './data/characters';
 *
 * // 获取角色
 * const sakura = CHARACTERS['sakura'];
 * console.log(sakura.name); // "星野樱"
 * console.log(sakura.element.name); // "火"
 *
 * // 遍历所有角色
 * Object.values(CHARACTERS).forEach(char => {
 *   console.log(`${char.name} - ${char.title}`);
 * });
 * ```
 */
export const CHARACTERS: Record<string, Character> = {
  sakura: SAKURA,
  hoshino_sakura: SAKURA,
  rin: RIN,
  kishima_rin: RIN,
  suzu: SUZU,
  kazane_rin: SUZU,
  aoi: AOI,
  ishigami_aoi: AOI,
  yuzu: YUZU,
  amane_yuzu: YUZU,
  mashiro: MASHIRO,
  shiraishi_mashiro: MASHIRO,
};

// ============================================================================
// NPC角色（非可攻略角色，用于剧情中显示中文名）
// ============================================================================

export interface NPC {
  id: string;
  name: string;
  title: string;
  element?: ElementInfo;
  shortDescription: string;
  description: string;
  affiliation: string;
  isRomanceable: false;
}

const HELIOS_PROFESSOR: NPC = {
  id: 'helios_professor',
  name: '赫利俄斯教授',
  title: '星辉学院院长',
  element: { ...ELEMENT_FIRE, name: '阳炎', description: '阳炎魔法，火与光的融合之力' },
  shortDescription: '星辉魔法学院的院长，博学睿智的魔法大师',
  description: '赫利俄斯教授是星辉魔法学院的现任院长，拥有深不可测的魔法实力。他总是戴着一副金丝眼镜，身穿红金相间的学院长袍，手持古老的魔法典籍。他温和儒雅，对学生关怀备至，但在面对黑暗势力时会展现出惊人的威严。他是千年前封印暗影之王的英雄后代，继承了家族守护学院的使命。',
  affiliation: '星辉魔法学院 · 院长',
  isRomanceable: false,
};

const HELIOS_ELDER: NPC = {
  id: 'helios_elder',
  name: '赫利俄斯长老',
  title: '千年守护者',
  element: { ...ELEMENT_FIRE, name: '星阳', description: '星阳魔法，汇聚星辰与太阳之力' },
  shortDescription: '赫利俄斯家族的千年长老，掌握着古代秘辛',
  description: '赫利俄长老是赫利俄斯家族的活传说，已经活了近千年。他白发如银，长髯垂胸，手持由世界树根须制成的古老法杖，身穿绣满星象符文的深棕长袍。他是千年前封印暗影之王的参与者之一，掌握着关于星辉之力和暗影真相的最高机密。平时隐居在学院深处的星象塔中，只有在学院面临重大危机时才会现身。',
  affiliation: '赫利俄斯家族 · 星辉学院最高长老',
  isRomanceable: false,
};

const SHADOW_KING: NPC = {
  id: 'shadow_king',
  name: '暗影之王',
  title: '千年暗渊之主',
  element: { key: 'dark', name: '暗', description: '暗影魔法，吞噬一切光明的黑暗之力', color: '#8B008B', icon: '🌑' },
  shortDescription: '千年前被封印的黑暗君主，游戏的最终BOSS',
  description: '暗影之王是千年前被赫利俄斯先祖封印的黑暗存在。他身披紫黑色的暗铠，背后展开恶魔之翼，一只眼眸是深紫，另一只是血红，周身缠绕着暴戾的紫色闪电和暗影幽魂。他曾是古代最伟大的魔法使之一，因追求永恒力量而堕入黑暗。他并非纯粹的邪恶——在千年的封印中，他保留着一丝被扭曲的理性，在最终决战中会揭露令人震惊的真相。',
  affiliation: '暗影深渊 · 独立',
  isRomanceable: false,
};

const STELLAR_VOICE: NPC = {
  id: 'stellar_voice',
  name: '星辰之声',
  title: '星辉的意志',
  element: ELEMENT_LIGHT,
  shortDescription: '星辉之力的化身，守护世界的光明存在',
  description: '星辰之声是星辉之力本身的意志具现，以金色天使的形态显现。她拥有六翼光之翼，头顶星环，金色长发流淌着星光，赤脚悬浮在空中，永远双手合十作祈祷姿态。她不参与世俗纷争，但会在世界面临毁灭时向被选中者传递星辉的启示。她的声音如星河般浩瀚温柔，是主角觉醒星辉之力的引导者。',
  affiliation: '星辉本源 · 光明阵营',
  isRomanceable: false,
};

// ─── 男性NPC角色（非可攻略，丰富日常互动）─────────────────────────────────

const KUROSAKI_SOMA: NPC = {
  id: 'kurosaki_soma',
  name: '黑崎苍真',
  title: '雷系觉醒者 · 同班挚友',
  element: ELEMENT_LIGHTNING,
  shortDescription: '主角的同班同学兼室友，热血开朗的雷系魔法师',
  description: '黑崎苍真是主角在星辉魔法学院最要好的男性朋友，与主角同住一间宿舍。他出身于东方魔法世家黑崎家，自幼修习雷系魔法，性格热血直率、重情重义。银灰色短发，左耳戴着一枚雷纹耳钉，校服永远不好好穿、袖子卷到手肘。他是班级里的人气王，擅长各种竞技魔法，但文化课一塌糊涂。在主角刚入学时主动搭话、带主角熟悉学院，是主角在男性朋友中最信赖的伙伴。口头禅是「喂，来打一场！」。',
  affiliation: '星辉魔法学院 · 一年级',
  isRomanceable: false,
};

const SHIRATORI_YUMA: NPC = {
  id: 'shiratori_yuma',
  name: '白鸟悠马',
  title: '学生会会计 · 水系策士',
  element: ELEMENT_WATER,
  shortDescription: '学生会会计，优雅冷静的水系魔法师，凛的得力助手',
  description: '白鸟悠马是学生会会计，月岛凛最信赖的副手。他出身名门白鸟家，与月岛家世交。淡蓝色中长发总是束在脑后，戴着一副银边眼镜，举止优雅从容，说话永远带着恰到好处的微笑。他是学院公认的「智囊」，任何复杂的难题到他手中都能被拆解得井井有条。表面温文尔雅，实则内心极为犀利，偶尔会说出让人背后发凉的话。他对主角抱有观察者的兴趣——既好奇这个「未定义属性」的转学生，也在暗中评估主角是否配得上他所敬重的凛。',
  affiliation: '星辉魔法学院 · 学生会',
  isRomanceable: false,
};

const ENOMORI: NPC = {
  id: 'enomori',
  name: '炎守严',
  title: '风纪委员长 · 土系执法者',
  element: ELEMENT_EARTH,
  shortDescription: '风纪委员长，严厉正义的三年级前辈，土系魔法高手',
  description: '炎守严是星辉魔法学院的风纪委员长，三年级学生。他身材高大魁梧，棕黑色短发如钢针般竖立，眉骨上有一道旧伤疤，眼神锐利如鹰。他严格遵守校规，对违规行为零容忍，被学生私下称为「铁壁」。但了解他的人都知道，他严厉的表象下是对学院和学生深沉的责任感——他曾因一次疏忽让好友陷入危险，自此发誓绝不再让任何人受伤。在暗影危机中，他主动请缨守护学院平民学生，成为主角团最坚实的后盾。表面不近人情，实际会在巡逻时默默护送夜归的学生回宿舍。',
  affiliation: '星辉魔法学院 · 三年级 · 风纪委员会',
  isRomanceable: false,
};

/** 所有NPC角色，以ID为键 */
export const NPCS: Record<string, NPC> = {
  helios_professor: HELIOS_PROFESSOR,
  professor_helios: HELIOS_PROFESSOR,
  helios: HELIOS_PROFESSOR,
  helio: HELIOS_PROFESSOR,
  helios_elder: HELIOS_ELDER,
  elder_helios: HELIOS_ELDER,
  shadow_king: SHADOW_KING,
  voice_of_stars: STELLAR_VOICE,
  stellar_voice: STELLAR_VOICE,
  star_voice: STELLAR_VOICE,
  kurosaki_soma: KUROSAKI_SOMA,
  soma: KUROSAKI_SOMA,
  shiratori_yuma: SHIRATORI_YUMA,
  yuma: SHIRATORI_YUMA,
  enomori: ENOMORI,
};

/** 角色显示名称映射（包含可攻略角色和NPC，用于剧情中speaker显示中文名） */
export const CHARACTER_DISPLAY_NAMES: Record<string, string> = {
  sakura: '星野樱',
  hoshino_sakura: '星野樱',
  rin: '月岛凛',
  kishima_rin: '月岛凛',
  suzu: '风间铃',
  kazane_rin: '风间铃',
  aoi: '石神葵',
  ishigami_aoi: '石神葵',
  yuzu: '天音柚',
  amane_yuzu: '天音柚',
  mashiro: '白石真白',
  shiraishi_mashiro: '白石真白',
  protagonist: '你',
  helios_professor: '赫利俄斯教授',
  professor_helios: '赫利俄斯教授',
  helios: '赫利俄斯教授',
  helio: '赫利俄斯教授',
  helios_elder: '赫利俄斯长老',
  elder_helios: '赫利俄斯长老',
  shadow_king: '暗影之王',
  voice_of_stars: '星辰之声',
  stellar_voice: '星辰之声',
  star_voice: '星辰之声',
  kurosaki_soma: '黑崎苍真',
  soma: '黑崎苍真',
  shiratori_yuma: '白鸟悠马',
  yuma: '白鸟悠马',
  enomori: '炎守严',
  narrator: '',
};

/**
 * 获取指定 ID 的角色，如果不存在则抛出错误。
 *
 * @param id - 角色的唯一标识符
 * @returns 对应的角色数据
 * @throws 当找不到指定 ID 的角色时抛出错误
 *
 * @example
 * ```typescript
 * const sakura = getCharacterById('sakura');
 * ```
 */
export function getCharacterById(id: string): Character {
  const character = CHARACTERS[id];
  if (!character) {
    throw new Error(`未找到 ID 为 "${id}" 的角色`);
  }
  return character;
}

/**
 * 获取所有角色的数组形式。
 *
 * @returns 包含所有角色的数组
 *
 * @example
 * ```typescript
 * const allCharacters = getAllCharacters();
 * allCharacters.forEach(c => console.log(c.name));
 * ```
 */
export function getAllCharacters(): Character[] {
  return Object.values(CHARACTERS);
}

/**
 * 根据属性元素筛选角色。
 *
 * @param elementKey - 要筛选的元素类型
 * @returns 符合该元素属性的角色数组
 *
 * @example
 * ```typescript
 * const fireCharacters = getCharactersByElement('fire');
 * // 返回 [SAKURA]
 * ```
 */
export function getCharactersByElement(elementKey: Element): Character[] {
  return getAllCharacters().filter((c) => c.element.key === elementKey);
}

/**
 * 查找生日在指定月份的角色。
 *
 * @param month - 月份（1-12）
 * @returns 生日在该月份的角色数组
 *
 * @example
 * ```typescript
 * const decemberCharacters = getCharactersByBirthMonth(12);
 * // 返回 [RIN (12月22日), MASHIRO (12月25日)]
 * ```
 */
export function getCharactersByBirthMonth(month: number): Character[] {
  return getAllCharacters().filter((c) => {
    const birthMonth = parseInt(c.birthday.split('月')[0], 10);
    return birthMonth === month;
  });
}

/**
 * 获取角色好感度等级列表。
 *
 * @param characterId - 角色 ID
 * @returns 该角色的好感度等级定义数组
 */
export function getAffectionLevels(characterId: string): AffectionLevel[] {
  return getCharacterById(characterId).affectionLevels;
}

/**
 * 根据当前好感度值获取对应的等级信息。
 *
 * @param characterId - 角色 ID
 * @param currentAffection - 当前好感度值（0-100）
 * @returns 对应的好感度等级
 */
export function getCurrentAffectionLevel(
  characterId: string,
  currentAffection: number,
): AffectionLevel {
  const levels = getAffectionLevels(characterId);
  const level = levels.find(
    (l) => currentAffection >= l.min && currentAffection <= l.max,
  );
  if (!level) {
    throw new Error(
      `角色 "${characterId}" 未找到对应好感度 ${currentAffection} 的等级定义`,
    );
  }
  return level;
}

/**
 * 获取说话者的中文显示名（支持可攻略角色和NPC）
 * @param speakerId - speaker字段的ID
 * @returns 中文显示名，如果找不到则返回原ID
 */
export function getSpeakerDisplayName(speakerId: string | undefined): string {
  if (!speakerId) return '';
  if (speakerId === 'narrator' || speakerId === '???') return '';
  if (speakerId === 'protagonist' || speakerId === 'player') return '你';
  if (CHARACTER_DISPLAY_NAMES[speakerId]) return CHARACTER_DISPLAY_NAMES[speakerId];
  const char = CHARACTERS[speakerId];
  if (char) return char.name;
  const npc = NPCS[speakerId];
  if (npc) return npc.name;
  return speakerId;
}

/**
 * 判断一个角色ID是否为NPC（不可攻略）
 */
export function isNPC(characterId: string): boolean {
  return characterId in NPCS;
}

/**
 * 获取任意角色（包括NPC）的中文名
 */
export function getAnyCharacterName(characterId: string): string {
  if (CHARACTERS[characterId]) return CHARACTERS[characterId].name;
  if (NPCS[characterId]) return NPCS[characterId].name;
  return CHARACTER_DISPLAY_NAMES[characterId] || characterId;
}
