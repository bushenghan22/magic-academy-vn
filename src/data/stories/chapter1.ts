/**
 * 星辉魔法学院 - 第一章：入学篇
 * Stellar Magic Academy - Chapter 1: Enrollment Arc
 *
 * 包含200+故事节点，80+选择点
 * 涵盖：序章觉醒、魔法基础课、森林探索、日常羁绊、学院祭
 */

// ==================== 类型定义 ====================

export interface StoryChoice {
  id: string;
  text: string;
  nextNode?: string;
  next?: string;
  effects?: StoryEffect[];
  conditions?: StoryCondition[];
  condition?: StoryCondition;
}

export interface StoryCondition {
  type: 'flag' | 'affection' | 'choice' | 'chapter' | 'hasCard' | 'hasItem' | 'all_affections_min';
  key?: string;
  target?: string | string[];
  targets?: string[];
  value?: boolean | number | string;
  min?: number;
  characterId?: string;
  operator?: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
}

export interface StoryEffect {
  type: 'affection' | 'flag' | 'stat' | 'item' | 'unlock' | 'cg_unlock' | 'title_unlock' | 'item_unlock' | 'achievement' | 'ending' | 'choice' | 'setFlag' | 'addCard' | 'removeCard' | 'unlockCG' | 'addItem';
  key?: string;
  target?: string;
  value?: number | string | boolean;
  characterId?: string;
  amount?: number;
}

export interface CharacterSprite {
  characterId: string;
  position: 'left' | 'center' | 'right' | 'far-left' | 'far-right' | 'mid-left' | 'mid-right' | 'center-left' | 'center-right';
  emotion: string;
  outfit?: string;
}

export interface StoryNode {
  id: string;
  type: 'dialogue' | 'choice' | 'cutscene' | 'branch' | 'battle';
  chapter: number;
  speaker?: string;
  text: string;
  emotion?: string;
  portrait?: string;
  background?: string;
  bgm?: string;
  music?: string;
  next?: string;
  nextNode?: string;
  enemyId?: string;
  defaultOption?: StoryChoice;
  choices?: StoryChoice[];
  effects?: StoryEffect[];
  flags?: Record<string, boolean>;
  characterSprites?: CharacterSprite[];
}

export interface ChapterInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  parts: {
    id: string;
    title: string;
    startNode: string;
    nodeCount: number;
  }[];
  mainCharacters: string[];
  backgrounds: string[];
  bgmList: string[];
  totalNodes: number;
  totalChoices: number;
}

// ==================== 章节元数据 ====================

export const CHAPTER_1_INFO: ChapterInfo = {
  id: 1,
  title: '入学篇',
  subtitle: '星辰的序曲',
  description:
    '一个平凡的少年在某天突然觉醒了魔法的力量，被传送到了传说中的星辉魔法学院。在这里，他将遇见性格迥异的同伴，学习魔法的基础，经历第一次冒险，并在学院祭中迎来命运的转折。',
  parts: [
    {
      id: 'prologue',
      title: '序章 - 觉醒',
      startNode: 'ch1_prologue_001',
      nodeCount: 32,
    },
    {
      id: 'classroom',
      title: '第一课 - 魔法基础',
      startNode: 'ch1_classroom_001',
      nodeCount: 42,
    },
    {
      id: 'forest',
      title: '第一次战斗 - 森林探索',
      startNode: 'ch1_forest_001',
      nodeCount: 52,
    },
    {
      id: 'daily',
      title: '日常与羁绊',
      startNode: 'ch1_daily_001',
      nodeCount: 42,
    },
    {
      id: 'festival',
      title: '第一章终幕 - 学院祭',
      startNode: 'ch1_festival_001',
      nodeCount: 42,
    },
  ],
  mainCharacters: [
    'protagonist',
    'kazane_rin',
    'kishima_rin',
    'hoshino_sakura',
    'ishigami_aoi',
    'amane_yuzu',
    'shiraishi_mashiro',
    'professor_helios',
  ],
  backgrounds: [
    'bg_city_sunset',
    'bg_academy_gate',
    'bg_academy_gate_night',
    'bg_lobby',
    'bg_office',
    'bg_classroom',
    'bg_classroom_evening',
    'bg_library',
    'bg_cafeteria',
    'bg_dormitory',
    'bg_dormitory_night',
    'bg_garden',
    'bg_forest',
    'bg_forest_deep',
    'bg_ruins_entrance',
    'bg_ruins_interior',
    'bg_arena',
    'bg_festival_day',
    'bg_festival_night',
    'bg_rooftop',
    'bg_rooftop_night',
    'bg_training_ground',
    'bg_alchemy_lab',
    'bg_starry_sky',
    'bg_starry_sky_bright',
    'bg_corridor',
    'bg_dorm_room',
    'bg_dorm_room_night',
    'bg_shrine',
  ],
  bgmList: [
    'bgm_main_theme',
    'bgm_peaceful_daily',
    'bgm_mysterious',
    'bgm_battle',
    'bgm_boss_battle',
    'bgm_romance',
    'bgm_comedy',
    'bgm_sad',
    'bgm_festival',
    'bgm_magic_class',
    'bgm_forest',
    'bgm_ruins',
    'bgm_dramatic',
    'bgm_epilogue',
    'bgm_awakening',
  ],
  totalNodes: 308,
  totalChoices: 241,
};

// ==================== 故事节点 ====================

export const CHAPTER_1_NODES: StoryNode[] = [
  // ============================================================
  // PART 1: 序章 - 觉醒 (Prologue - Awakening)
  // ============================================================

  // --- 场景1：平凡世界的最后一刻 ---
  {
    id: 'ch1_prologue_001',
    type: 'cutscene',
    chapter: 1,
    text: '黄昏时分，夕阳将整座城市浸入熔金般的绯红之中。你走在放学回家的路上，耳机里循环着熟悉的旋律，晚风拂过脸颊，带着初夏特有的温热和路边栀子花丛的甜香。街道上车水马龙，行人三三两两地走过，一切都如往常般平凡而安宁——然而你并不知道，这是你作为「普通人」的最后一个黄昏。',
    background: 'bg_city_sunset',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_prologue_002',
  },
  {
    id: 'ch1_prologue_002',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '……嗯？今天的天空……好像有点不对劲？那是什么光？',
    emotion: 'confused',
    background: 'bg_city_sunset',
    next: 'ch1_prologue_003',
  },
  {
    id: 'ch1_prologue_003',
    type: 'cutscene',
    chapter: 1,
    text: '天穹骤然裂开一道缝隙，流泻出如极光般绚烂的光芒——那不是任何已知的自然现象。光芒在云层间蜿蜒游走，如同一条活着的光之河流，呼吸般明灭起伏。奇怪的是，街上的人群依然行色匆匆，有说有笑，仿佛对这道惊天异象视而不见。只有你。只有你能看见那道光，它像被什么指引着一般，正穿过云层，缓缓地、坚定地朝你的方向落下来，带着某种古老而温柔的召唤。',
    background: 'bg_starry_sky_bright',
    bgm: 'bgm_mysterious',
    next: 'ch1_prologue_004',
  },
  {
    id: 'ch1_prologue_004',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '等等——这道光在朝我过来？！不、不对……身体好热！胸口……胸口像是有什么东西要烧起来了——！！',
    emotion: 'panic',
    background: 'bg_starry_sky_bright',
    effects: [{ type: 'flag', target: 'awakening_started', value: true }],
    next: 'ch1_prologue_005',
  },
  {
    id: 'ch1_prologue_005',
    type: 'cutscene',
    chapter: 1,
    text: '光芒在一瞬间将你完全吞没，世界化为一片刺目的纯白。你感到一股温热的能量从胸口最深处喷涌而出——像一颗沉睡了千万年的星辰终于苏醒，它沿着你的血管、你的骨骼、你的每一个细胞蔓延开来，带着古老而庄严的力量。你的视野迅速模糊，意识如退潮般被卷走。在彻底失去知觉的最后一秒，你听到了一个空灵而悠远的声音，仿佛穿越了千年的时光——',
    background: 'bg_starry_sky_bright',
    bgm: 'bgm_awakening',
    next: 'ch1_prologue_006',
  },
  {
    id: 'ch1_prologue_006',
    type: 'dialogue',
    chapter: 1,
    speaker: '???',
    text: '「被星辉选中的继承者啊……千年的等待终于结束。星辉学院，在等待着你……」',
    emotion: 'mysterious',
    background: 'bg_starry_sky',
    next: 'ch1_prologue_007',
  },
  {
    id: 'ch1_prologue_007',
    type: 'cutscene',
    chapter: 1,
    text: '再次睁开眼睛时，你发现自己站在一座宏伟得不似人间的大门前。高耸入云的白玉石柱上雕刻着繁复的魔法纹路，每一道刻痕都流淌着星辰般的淡蓝色微光，仿佛活着的符文在低声吟唱着古老的咒语。门楣上方，用散发着金光的古老文字书写着几个大字——「星辉魔法学院」。空气中弥漫着魔力的甜香，微风拂过带着花朵和古木的气息。身后是陌生的森林和山脉，来时的城市已消失无踪。你知道，平凡的人生，在这一刻已经永远地结束了。',
    background: 'bg_academy_gate',
    bgm: 'bgm_main_theme',
    effects: [{ type: 'flag', target: 'arrived_at_academy', value: true }],
    next: 'ch1_prologue_008',
  },
  {
    id: 'ch1_prologue_008',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '星辉……魔法学院？这到底是什么地方？我不是在回家的路上吗？',
    emotion: 'surprised',
    background: 'bg_academy_gate',
    next: 'ch1_prologue_choice_000',
  },

  // --- 选择点0：初到学院的反应 ---
  {
    id: 'ch1_prologue_choice_000',
    type: 'choice',
    chapter: 1,
    text: '你站在一座陌生的魔法学院门前，完全不知道发生了什么。你首先想到的是——',
    background: 'bg_academy_gate',
    choices: [
      {
        id: 'choice_000_a',
        text: '四处观察周围的环境，试图寻找线索。',
        nextNode: 'ch1_prologue_009',
        effects: [{ type: 'stat', target: 'intelligence', value: 2 }],
      },
      {
        id: 'choice_000_b',
        text: '尝试回忆之前发生了什么。',
        nextNode: 'ch1_prologue_009',
        effects: [{ type: 'flag', target: 'tried_to_remember', value: true }],
      },
      {
        id: 'choice_000_c',
        text: '检查自己有没有受伤。',
        nextNode: 'ch1_prologue_009',
        effects: [{ type: 'stat', target: 'caution', value: 2 }],
      },
    ],
  },

  // --- 场景2：遇见风间铃 ---
  {
    id: 'ch1_prologue_009',
    type: 'cutscene',
    chapter: 1,
    text: '就在你茫然失措的时候，一阵轻快得近乎跳跃的脚步声从身后传来。还没来得及回头，一个带着笑意的声音就在耳边响起——',
    background: 'bg_academy_gate',
    next: 'ch1_prologue_010',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
  },
  {
    id: 'ch1_prologue_010',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '哎呀~又一个迷路的新生吗？嘻嘻，看你一脸懵的样子，一定是个普通人对不对！',
    emotion: 'cheerful',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
    next: 'ch1_prologue_011',
  },
  {
    id: 'ch1_prologue_011',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '你……你是谁？这里是哪里？我怎么会在这里？',
    emotion: 'confused',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
    next: 'ch1_prologue_012',
  },
  {
    id: 'ch1_prologue_012',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '我叫风间铃！半精灵，风属性魔法二年级生！这里是星辉魔法学院，全世界最棒的魔法学府哦~至于你怎么来的嘛……大概是因为你觉醒了魔法天赋吧！',
    emotion: 'excited',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'excited' },
    ],
    next: 'ch1_prologue_013',
  },
  {
    id: 'ch1_prologue_013',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '魔法……天赋？可我只是一个普通人啊。',
    emotion: 'doubtful',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'thinking' },
    ],
    next: 'ch1_prologue_choice_001',
  },

  // --- 选择点1：如何回应铃的热情 ---
  {
    id: 'ch1_prologue_choice_001',
    type: 'choice',
    chapter: 1,
    text: '面对这个热情过头的半精灵少女，你要怎么回应？',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
    choices: [
      {
        id: 'choice_001_a',
        text: '谢谢你告诉我这些！能详细说说这里的情况吗？',
        nextNode: 'ch1_prologue_014a',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 5 },
          { type: 'flag', target: 'protagonist_personality', value: 'friendly' },
        ],
      },
      {
        id: 'choice_001_b',
        text: '等等，我需要冷静一下……这一切太突然了。',
        nextNode: 'ch1_prologue_014b',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 2 },
          { type: 'flag', target: 'protagonist_personality', value: 'cautious' },
        ],
      },
      {
        id: 'choice_001_c',
        text: '魔法？哈，你是在拍什么综艺节目吧？',
        nextNode: 'ch1_prologue_014c',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: -2 },
          { type: 'flag', target: 'protagonist_personality', value: 'skeptical' },
        ],
      },
    ],
  },

  // 路线A：友好回应
  {
    id: 'ch1_prologue_014a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '哇~你好温柔啊！我就喜欢你这种人！来来来，我带你进去，边走边说~',
    emotion: 'delighted',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'excited' },
    ],
    next: 'ch1_prologue_015',
  },

  // 路线B：需要冷静
  {
    id: 'ch1_prologue_014b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '诶~这种反应也很常见啦。别担心，每个被选中的新人都会经历这个过程的。慢慢来就好~',
    emotion: 'gentle',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'gentle' },
    ],
    next: 'ch1_prologue_015',
  },

  // 路线C：怀疑态度
  {
    id: 'ch1_prologue_014c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '噗~综艺节目？你这个人真有意思！不过我可没在开玩笑哦。看好了——',
    emotion: 'amused',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'smirk' },
    ],
    next: 'ch1_prologue_014c_magic',
  },
  {
    id: 'ch1_prologue_014c_magic',
    type: 'cutscene',
    chapter: 1,
    text: '铃轻轻抬起手掌，一缕翠绿色的风之魔法在她指尖旋转，卷起了一阵花瓣雨。这绝不是任何科技手段能做到的事情。',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'confident' },
    ],
    next: 'ch1_prologue_015',
    effects: [{ type: 'flag', target: 'saw_rin_magic', value: true }],
  },

  // --- 选择点1b：铃的魔法令你印象深刻 ---
  {
    id: 'ch1_prologue_choice_001b',
    type: 'choice',
    chapter: 1,
    text: '铃展示了真实的魔法，你终于确信这不是梦。你——',
    background: 'bg_academy_gate',
    choices: [
      {
        id: 'choice_001b_a',
        text: '「太厉害了！能教我吗？」',
        nextNode: 'ch1_prologue_015',
        effects: [{ type: 'affection', target: 'kazane_rin', value: 5 }],
      },
      {
        id: 'choice_001b_b',
        text: '「好吧，我接受现实了。带我进去吧。」',
        nextNode: 'ch1_prologue_015',
        effects: [{ type: 'flag', target: 'accepted_magic', value: true }],
      },
    ],
  },

  // --- 铃介绍学院 ---
  {
    id: 'ch1_prologue_015',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '星辉魔法学院创立于一千两百年前，是世界上历史最悠久的魔法学府。学院分为五个系——元素魔法系、炼金术系、召唤术系、治愈魔法系和战斗魔法系。',
    emotion: 'proud',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'proud' },
    ],
    next: 'ch1_prologue_016',
  },
  {
    id: 'ch1_prologue_016',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '不过新生第一年都是通识教育啦，要到第二年才分系。对了对了，学院还有五个年级，每个年级大概有一百多人呢！',
    emotion: 'cheerful',
    background: 'bg_academy_gate',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
    next: 'ch1_prologue_choice_002',
  },

  // --- 选择点2：对学院的疑问 ---
  {
    id: 'ch1_prologue_choice_002',
    type: 'choice',
    chapter: 1,
    text: '你对学院充满了疑问，想要先了解什么？',
    background: 'bg_academy_gate',
    choices: [
      {
        id: 'choice_002_a',
        text: '「被选中」是什么意思？为什么是我？',
        nextNode: 'ch1_prologue_017a',
        effects: [
          { type: 'flag', target: 'asked_about_chosen', value: true },
        ],
      },
      {
        id: 'choice_002_b',
        text: '这个学院的入学条件是什么？',
        nextNode: 'ch1_prologue_017b',
        effects: [
          { type: 'flag', target: 'asked_about_enrollment', value: true },
        ],
      },
      {
        id: 'choice_002_c',
        text: '你说你是半精灵？这个世界上还有精灵吗？',
        nextNode: 'ch1_prologue_017c',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 3 },
          { type: 'flag', target: 'asked_about_rin', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_prologue_017a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '嗯~这个说来话长呢。简单来说，每个人体内都有魔力的种子，但大部分人的种子一辈子都不会发芽。只有在特殊条件下，魔力种子才会觉醒，然后学院的探测魔法就会找到你~',
    emotion: 'thinking',
    background: 'bg_academy_gate',
    next: 'ch1_prologue_018',
  },
  {
    id: 'ch1_prologue_017b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '入学条件嘛……其实就是被学院的「星辰之眼」探测到魔力觉醒就行了。有的人一出生就被发现了，有的人像你这样突然觉醒。据说还有些人是被古代魔法物品触发的呢！',
    emotion: 'explaining',
    background: 'bg_academy_gate',
    next: 'ch1_prologue_018',
  },
  {
    id: 'ch1_prologue_017c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '嘻嘻，被你注意到了~我妈妈是精灵，爸爸是人类。半精灵在这个世界虽然不算常见，但也不稀奇啦。除了精灵，还有龙族、兽人、矮人等等各种各样的种族呢！',
    emotion: 'happy',
    background: 'bg_academy_gate',
    next: 'ch1_prologue_018',
  },

  // --- 前往教务处 ---
  {
    id: 'ch1_prologue_018',
    type: 'cutscene',
    chapter: 1,
    text: '铃拉着你的手走进了学院大门。眼前的景象令你屏住了呼吸——巨大的魔法喷泉在阳光下折射出七彩的光晕，水珠在空中凝结成细小的符文后散落；哥特式尖塔与流线型的未来建筑错落交织，攀附在翠绿的山坡上；空中不时有骑着扫帚的学生呼啸而过，留下一道道银色的魔力尾迹。',
    background: 'bg_lobby',
    bgm: 'bgm_main_theme',
    next: 'ch1_prologue_019',
  },
  {
    id: 'ch1_prologue_019',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '好啦~先带你去教务处报到吧！新生都要先去那里登记的。教务处在主楼的三楼，跟我来~',
    emotion: 'cheerful',
    background: 'bg_lobby',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'happy' },
    ],
    next: 'ch1_prologue_020',
  },
  {
    id: 'ch1_prologue_020',
    type: 'cutscene',
    chapter: 1,
    text: '穿过长廊，登上旋转楼梯，你来到了教务处门前。门牌上写着「新生入学登记处」，旁边还有一个小小的水晶球在发光。',
    background: 'bg_corridor',
    next: 'ch1_prologue_choice_004',
  },

  // --- 选择点4：走在学院走廊上 ---
  {
    id: 'ch1_prologue_choice_004',
    type: 'choice',
    chapter: 1,
    text: '走在学院宏伟的走廊中，你被各种各样的景象所震撼。你最想先了解什么？',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_p004_a',
        text: '仔细观察墙壁上的魔法符文。',
        nextNode: 'ch1_prologue_choice_004b',
        effects: [{ type: 'stat', target: 'intelligence', value: 2 }, { type: 'flag', target: 'noticed_runes', value: true }],
      },
      {
        id: 'choice_p004_b',
        text: '和铃聊天，问问她的故事。',
        nextNode: 'ch1_prologue_choice_004b',
        effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }],
      },
      {
        id: 'choice_p004_c',
        text: '默默记下路线，以防迷路。',
        nextNode: 'ch1_prologue_choice_004b',
        effects: [{ type: 'flag', target: 'memorized_route', value: true }],
      },
    ],
  },

  // --- 选择点4b：教务处门前 ---
  {
    id: 'ch1_prologue_choice_004b',
    type: 'choice',
    chapter: 1,
    text: '站在教务处门前，你能感受到门后有强大的魔力波动。你——',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_p004b_a',
        text: '深吸一口气，鼓起勇气敲门。',
        nextNode: 'ch1_prologue_021',
        effects: [{ type: 'stat', target: 'courage', value: 2 }],
      },
      {
        id: 'choice_p004b_b',
        text: '让铃先进去，自己跟在后面。',
        nextNode: 'ch1_prologue_021',
        effects: [{ type: 'flag', target: 'followed_rin', value: true }],
      },
      {
        id: 'choice_p004b_c',
        text: '在门口犹豫了一下。',
        nextNode: 'ch1_prologue_021',
        effects: [{ type: 'affection', target: 'kazane_rin', value: 1 }],
      },
    ],
  },

  // --- 场景3：遇到月岛凛 ---
  {
    id: 'ch1_prologue_021',
    type: 'cutscene',
    chapter: 1,
    text: '你推开门，映入眼帘的是一个整洁的办公室。一个银发少女正端坐在桌前，翻阅着厚厚的文件。她的气质冷若冰霜，银色的长发如同月光倾泻而下，在肩头铺成一片霜白。她没有抬头，但你分明感到一股凛冽的压迫感——仿佛推开的不是一扇门，而是踏入了一片寂静的冬湖。',
    background: 'bg_office',
    bgm: 'bgm_mysterious',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'cold' },
    ],
    next: 'ch1_prologue_choice_006',
  },

  // --- 选择点6：初见凛的第一印象 ---
  {
    id: 'ch1_prologue_choice_006',
    type: 'choice',
    chapter: 1,
    text: '面前的银发少女散发着冰冷的气场，但又有一种让人无法移开目光的魅力。你对她的第一印象是——',
    background: 'bg_office',
    choices: [
      { id: 'choice_p006_a', text: '「好漂亮……但也很可怕。」', nextNode: 'ch1_prologue_022', effects: [{ type: 'affection', target: 'kishima_rin', value: 1 }, { type: 'flag', target: 'impressed_by_rin', value: true }] },
      { id: 'choice_p006_b', text: '「看起来很厉害的样子。」', nextNode: 'ch1_prologue_022', effects: [{ type: 'flag', target: 'respected_rin', value: true }] },
      { id: 'choice_p006_c', text: '「这个人不好惹……」', nextNode: 'ch1_prologue_022', effects: [{ type: 'flag', target: 'intimidated_by_rin', value: true }] },
    ],
  },
  {
    id: 'ch1_prologue_choice_006b',
    type: 'choice',
    chapter: 1,
    text: '凛在认真地翻阅文件。在她抬头之前，你注意到了桌上的一本厚重书籍，封面上写着《星辉学院千年史》。你——',
    background: 'bg_office',
    choices: [
      { id: 'choice_p006b_a', text: '好奇地多看了几眼那本书。', nextNode: 'ch1_prologue_022', effects: [{ type: 'flag', target: 'noticed_history_book', value: true }, { type: 'stat', target: 'intelligence', value: 1 }] },
      { id: 'choice_p006b_b', text: '礼貌地等待她先开口。', nextNode: 'ch1_prologue_022', effects: [{ type: 'affection', target: 'kishima_rin', value: 1 }] },
    ],
  },
  {
    id: 'ch1_prologue_022',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '风间铃，你又擅自带新生来报到了？按照规定，新生应该自行找到教务处。这本身就是入学测试的一部分。',
    emotion: 'cold',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'cold' },
    ],
    next: 'ch1_prologue_023',
  },
  {
    id: 'ch1_prologue_023',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '诶~凛你好严格啊！这个人是从异世界传送过来的耶，连这里是哪都不知道，怎么能怪人家嘛~',
    emotion: 'pouty',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'left', emotion: 'pouty' },
      { characterId: 'kishima_rin', position: 'right', emotion: 'cold' },
    ],
    next: 'ch1_prologue_024',
  },
  {
    id: 'ch1_prologue_024',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……从异世界直接传送？这可是相当罕见的情况。这个世界与人类所在的「现世」本就相邻，一般觉醒者会先在现世获得初步的魔力波动，然后由学院派专人通过固定的传送门接引前来。但你的情况……空间裂缝自行打开并将你卷入，这在学院一千两百年的历史上，记录在案的也不超过五次。',
    emotion: 'surprised',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'surprised' },
    ],
    next: 'ch1_prologue_025',
  },
  {
    id: 'ch1_prologue_025',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '我叫月岛凛，学生会副会长，同时也是教务处的临时助手。请出示你的魔力凭证——如果没有的话，我需要对你进行魔力检测。',
    emotion: 'professional',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_prologue_026',
  },
  {
    id: 'ch1_prologue_026',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '魔力凭证？我什么都没有啊……',
    emotion: 'embarrassed',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'cold' },
    ],
    next: 'ch1_prologue_027',
  },
  {
    id: 'ch1_prologue_027',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '果然。那么请把手放在这个水晶球上。它会检测你的魔力属性和等级。',
    emotion: 'neutral',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_prologue_028',
  },
  {
    id: 'ch1_prologue_028',
    type: 'cutscene',
    chapter: 1,
    text: '你将手掌放在水晶球上。起初没有任何反应，但几秒后，水晶球突然爆发出耀眼的光芒——不是单一的颜色，而是多种色彩交织在一起的奇异光辉，如同将彩虹揉碎后封入了水晶。',
    background: 'bg_office',
    bgm: 'bgm_awakening',
    next: 'ch1_prologue_029',
  },
  {
    id: 'ch1_prologue_029',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '这……这是什么属性？检测结果是……「未定义」？这不可能。水晶球的数据库涵盖了八大元素系统以及所有已知的变异属性，从未出现过无法识别的情况。要么是你的魔力超越了现有的分类体系，要么……它同时属于多个属性。无论哪种，都意味着你绝非普通的觉醒者。',
    emotion: 'shocked',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'shocked' },
    ],
    effects: [{ type: 'flag', target: 'unique_magic_detected', value: true }],
    next: 'ch1_prologue_030',
  },
  {
    id: 'ch1_prologue_030',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……我需要向学院长报告这件事。风间铃，你先带这位新生去安排宿舍。明天早上八点，一年级教室集合。',
    emotion: 'serious',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'serious' },
    ],
    next: 'ch1_prologue_choice_003',
  },

  // --- 选择点3：对凛的态度 ---
  {
    id: 'ch1_prologue_choice_003',
    type: 'choice',
    chapter: 1,
    text: '月岛凛似乎对你的「未定义」属性很在意。你要怎么做？',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'serious' },
    ],
    choices: [
      {
        id: 'choice_003_a',
        text: '「月岛同学，我的情况很严重吗？」',
        nextNode: 'ch1_prologue_031a',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 3 },
          { type: 'flag', target: 'showed_concern', value: true },
        ],
      },
      {
        id: 'choice_003_b',
        text: '自信地表示「未定义说不定意味着无限可能呢！」',
        nextNode: 'ch1_prologue_031b',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: -1 },
          { type: 'affection', target: 'kazane_rin', value: 5 },
          { type: 'flag', target: 'showed_confidence', value: true },
        ],
      },
      {
        id: 'choice_003_c',
        text: '沉默地鞠躬，表示听从安排。',
        nextNode: 'ch1_prologue_031c',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 1 },
        ],
      },
    ],
  },

  {
    id: 'ch1_prologue_031a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……情况谈不上严重，只是非常罕见。学院建立以来，从未有过「未定义」属性的记录。我会向学院长确认后再通知你。不必过于担心。',
    emotion: 'slightly_warm',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'slightly_warm' },
    ],
    next: 'ch1_prologue_032',
  },
  {
    id: 'ch1_prologue_031b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……你的乐观精神倒是值得肯定。不过希望你明白，「未知」在魔法世界中并不总是好事。……算了，明天教室见。',
    emotion: 'cold_but_intrigued',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'cold' },
    ],
    next: 'ch1_prologue_032',
  },
  {
    id: 'ch1_prologue_031c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……至少你很懂规矩。明天见。',
    emotion: 'neutral',
    background: 'bg_office',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_prologue_032',
  },

  // --- 选择点5：对凛的态度后续 ---
  {
    id: 'ch1_prologue_choice_005',
    type: 'choice',
    chapter: 1,
    text: '凛让你去安排宿舍。离开教务处后，你走在回宿舍的路上。你心里在想——',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_p005_a',
        text: '「月岛同学虽然冷淡，但好像不是坏人。」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'affection', target: 'kishima_rin', value: 2 }],
      },
      {
        id: 'choice_p005_b',
        text: '「她对我好像有偏见……算了，时间会证明一切。」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'felt_prejudged', value: true }],
      },
      {
        id: 'choice_p005_c',
        text: '「不管怎样，这个学院比我想象的有趣多了！」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'affection', target: 'kazane_rin', value: 2 }],
      },
    ],
  },

  // --- 选择点5b：宿舍选择 ---
  {
    id: 'ch1_prologue_choice_005b',
    type: 'choice',
    chapter: 1,
    text: '铃带你来到了宿舍区。这里有不同类型的宿舍供你选择——',
    background: 'bg_dormitory',
    choices: [
      {
        id: 'choice_p005b_a',
        text: '选择靠近图书馆的安静宿舍。',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'dorm_library', value: true }, { type: 'stat', target: 'intelligence', value: 2 }],
      },
      {
        id: 'choice_p005b_b',
        text: '选择靠近训练场的便利宿舍。',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'dorm_training', value: true }, { type: 'stat', target: 'courage', value: 2 }],
      },
      {
        id: 'choice_p005b_c',
        text: '选择能看到星空的顶楼宿舍。',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'dorm_rooftop', value: true }],
      },
    ],
  },

  // --- 选择点5c：入睡前的思考 ---
  {
    id: 'ch1_prologue_choice_005c',
    type: 'choice',
    chapter: 1,
    text: '躺在宿舍的床上，你回想着今天发生的一切。入睡前，你最后想到的是——',
    background: 'bg_dorm_room_night',
    choices: [
      {
        id: 'choice_p005c_a',
        text: '「明天开始，我要认真学习魔法！」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'determined_to_learn', value: true }],
      },
      {
        id: 'choice_p005c_b',
        text: '「好想念原来的世界……」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'flag', target: 'missed_home', value: true }],
      },
      {
        id: 'choice_p005c_c',
        text: '「风间铃真是个好人。」',
        nextNode: 'ch1_prologue_032',
        effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }],
      },
    ],
  },

  // --- 序章收尾 ---
  {
    id: 'ch1_prologue_032',
    type: 'cutscene',
    chapter: 1,
    text: '在铃的带领下，你来到了宿舍区。夕阳的余晖洒在古老的石砖路上，一切都像是梦境一般。你知道，从今天起，你的人生将彻底改变。\n\n——序章·觉醒 完——',
    background: 'bg_academy_gate_night',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'chapter1_prologue_complete', value: true }],
    next: 'ch1_prologue_extra_001',
  },

  // --- 序章额外选择点 ---
  {
    id: 'ch1_prologue_extra_001',
    type: 'choice',
    chapter: 1,
    text: '回到宿舍后，铃给你留了一张字条：「明天见~有什么不懂的随时来问我！」你决定——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_pe001_a', text: '给铃回一张感谢的字条。', nextNode: 'ch1_prologue_extra_002', effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }] },
      { id: 'choice_pe001_b', text: '早点休息，为明天做准备。', nextNode: 'ch1_prologue_extra_002', effects: [{ type: 'stat', target: 'rest', value: 3 }] },
    ],
  },
  {
    id: 'ch1_prologue_extra_002',
    type: 'choice',
    chapter: 1,
    text: '睡前你注意到窗外的星空异常明亮，星座的排列和你原来的世界完全不同。你觉得——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_pe002_a', text: '用笔记本记录下星座的样子。', nextNode: 'ch1_prologue_extra_003', effects: [{ type: 'flag', target: 'recorded_stars', value: true }] },
      { id: 'choice_pe002_b', text: '沉浸在美丽的星空中心情平静。', nextNode: 'ch1_prologue_extra_003', effects: [{ type: 'stat', target: 'empathy', value: 2 }] },
    ],
  },
  {
    id: 'ch1_prologue_extra_003',
    type: 'choice',
    chapter: 1,
    text: '半梦半醒之间，你似乎听到了那个神秘声音的低语。它说了什么？',
    background: 'bg_starry_sky',
    choices: [
      { id: 'choice_pe003_a', text: '「去寻找真相……」', nextNode: 'ch1_prologue_extra_004', effects: [{ type: 'flag', target: 'dream_truth', value: true }] },
      { id: 'choice_pe003_b', text: '「保护重要的人……」', nextNode: 'ch1_prologue_extra_004', effects: [{ type: 'flag', target: 'dream_protect', value: true }] },
      { id: 'choice_pe003_c', text: '「相信自己……」', nextNode: 'ch1_prologue_extra_004', effects: [{ type: 'flag', target: 'dream_believe', value: true }] },
    ],
  },
  {
    id: 'ch1_prologue_extra_004',
    type: 'choice',
    chapter: 1,
    text: '第二天早上醒来，你发现自己枕头边多了一个小小的水晶碎片，在晨光中微微发光。你要——',
    background: 'bg_dorm_room',
    choices: [
      { id: 'choice_pe004_a', text: '小心地收起来，以后再研究。', nextNode: 'ch1_prologue_extra_005', effects: [{ type: 'item', target: 'mysterious_shard', value: 1 }, { type: 'flag', target: 'kept_shard', value: true }] },
      { id: 'choice_pe004_b', text: '试着注入魔力看看。', nextNode: 'ch1_prologue_extra_005', effects: [{ type: 'item', target: 'mysterious_shard', value: 1 }, { type: 'flag', target: 'activated_shard', value: true }, { type: 'stat', target: 'magic_control', value: 2 }] },
      { id: 'choice_pe004_c', text: '带给赫利俄斯教授看看。', nextNode: 'ch1_prologue_extra_005', effects: [{ type: 'item', target: 'mysterious_shard', value: 1 }, { type: 'flag', target: 'showed_shard_professor', value: true }] },
    ],
  },
  {
    id: 'ch1_prologue_extra_005',
    type: 'choice',
    chapter: 1,
    text: '你整理好行装准备去教室。出门前，你决定——',
    background: 'bg_dorm_room',
    choices: [
      { id: 'choice_pe005_a', text: '先去食堂吃个早餐。', nextNode: 'ch1_classroom_001', effects: [{ type: 'flag', target: 'ate_breakfast', value: true }] },
      { id: 'choice_pe005_b', text: '直接去教室，早点到。', nextNode: 'ch1_classroom_001', effects: [{ type: 'flag', target: 'early_to_class', value: true }] },
      { id: 'choice_pe005_c', text: '在路上练习一下昨天学到的魔力感知。', nextNode: 'ch1_classroom_001', effects: [{ type: 'stat', target: 'magic_control', value: 3 }, { type: 'flag', target: 'practiced_morning', value: true }] },
    ],
  },

  // ============================================================
  // PART 2: 第一课 - 魔法基础 (First Lesson - Magic Basics)
  // ============================================================

  // --- 教室场景 ---
  {
    id: 'ch1_classroom_001',
    type: 'cutscene',
    chapter: 1,
    text: '第二天清晨，阳光透过彩色玻璃窗洒入教室。你按照昨晚铃给你的地图，找到了一年级的教室。教室里已经坐了不少人，空气中弥漫着兴奋和紧张的气息。',
    background: 'bg_classroom',
    bgm: 'bgm_magic_class',
    effects: [{ type: 'flag', target: 'chapter2_started', value: true }],
    next: 'ch1_classroom_002',
  },
  {
    id: 'ch1_classroom_002',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '这里就是教室了……大家都看起来好厉害的样子。',
    emotion: 'nervous',
    background: 'bg_classroom',
    next: 'ch1_classroom_003',
  },
  {
    id: 'ch1_classroom_003',
    type: 'cutscene',
    chapter: 1,
    text: '你找了一个靠窗的位置坐下。就在这时，一个粉色长发的少女突然出现在你面前，眼睛里闪烁着好奇的光芒。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'curious' },
    ],
    next: 'ch1_classroom_choice_007',
  },

  // --- 选择点：初见樱的反应 ---
  {
    id: 'ch1_classroom_choice_007',
    type: 'choice',
    chapter: 1,
    text: '一个粉色长发的少女突然出现在你面前，眼睛闪闪发光地看着你。你——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_cc007_a', text: '被她的热情吓了一跳。', nextNode: 'ch1_classroom_004', effects: [{ type: 'flag', target: 'startled_by_sakura', value: true }] },
      { id: 'choice_cc007_b', text: '对她友好地微笑。', nextNode: 'ch1_classroom_004', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 2 }] },
      { id: 'choice_cc007_c', text: '好奇地打量她粉色的头发。', nextNode: 'ch1_classroom_004', effects: [{ type: 'flag', target: 'noticed_sakura_hair', value: true }] },
    ],
  },
  {
    id: 'ch1_classroom_choice_008',
    type: 'choice',
    chapter: 1,
    text: '上课铃响了。你环顾教室，看到了各种各样的同学。有些人看起来很紧张，有些人很自信。你的心情是——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_cc008_a', text: '紧张但期待。', nextNode: 'ch1_classroom_019', effects: [{ type: 'flag', target: 'nervous_but_excited', value: true }] },
      { id: 'choice_cc008_b', text: '充满好奇。', nextNode: 'ch1_classroom_019', effects: [{ type: 'stat', target: 'intelligence', value: 2 }, { type: 'flag', target: 'curious_mood', value: true }] },
      { id: 'choice_cc008_c', text: '冷静观察。', nextNode: 'ch1_classroom_019', effects: [{ type: 'flag', target: 'calm_mood', value: true }] },
    ],
  },

  // --- 遇见星野樱 ---
  {
    id: 'ch1_classroom_004',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '你就是昨天被空间裂缝传送过来的人吧！我听说了！你的属性是「未定义」对不对？好厉害啊，我还是第一次见到未知属性的人呢！',
    emotion: 'excited',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_classroom_005',
  },
  {
    id: 'ch1_classroom_005',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '消息传得也太快了吧……',
    emotion: 'embarrassed',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_classroom_006',
  },
  {
    id: 'ch1_classroom_006',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '我叫星野樱！火属性魔法，天赋等级A！我可是立志要成为最强的火焰魔法师的！以后请多关照~',
    emotion: 'confident',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'confident' },
    ],
    next: 'ch1_classroom_007',
  },

  // --- 遇见石神葵 ---
  {
    id: 'ch1_classroom_007',
    type: 'cutscene',
    chapter: 1,
    text: '在樱的身后，一个蓝发少年静静地坐在角落里，手中翻阅着一本厚重的炼金术书籍。他似乎注意到了你的目光，微微抬起头，用深邃的眼神看了你一眼，然后又低下了头。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'happy' },
      { characterId: 'ishigami_aoi', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_classroom_008',
  },
  {
    id: 'ch1_classroom_008',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '啊，那是石神葵学长。虽然是一年级，但他已经在自学三年级的炼金术了。他不太爱说话，但人其实还不错~',
    emotion: 'whispering',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'whispering' },
      { characterId: 'ishigami_aoi', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_classroom_009',
  },

  // --- 遇见天音柚 ---
  {
    id: 'ch1_classroom_009',
    type: 'cutscene',
    chapter: 1,
    text: '教室门被猛地推开，一个金发碧眼的少女大步走了进来。她的气场强大，身后的两个随从小心翼翼地跟在后面。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'proud' },
    ],
    next: 'ch1_classroom_010',
  },
  {
    id: 'ch1_classroom_010',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '哼，这就是今年的新生质量吗？看起来都很普通呢。——特别是你，那个「未定义」的家伙。',
    emotion: 'disdainful',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'disdainful' },
    ],
    next: 'ch1_classroom_011',
  },
  {
    id: 'ch1_classroom_011',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '……我？',
    emotion: 'confused',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'disdainful' },
    ],
    next: 'ch1_classroom_012',
  },
  {
    id: 'ch1_classroom_012',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '天音柚，雷属性，天赋等级S。天音家是三大魔法世家之一，我从小就在最顶尖的环境中修炼。像你这样来路不明的人，在这个学院里可不要太自以为是了。',
    emotion: 'arrogant',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'arrogant' },
    ],
    next: 'ch1_classroom_choice_001',
  },

  // --- 选择点4：回应天音柚 ---
  {
    id: 'ch1_classroom_choice_001',
    type: 'choice',
    chapter: 1,
    text: '天音柚的态度十分傲慢。你要怎么回应？',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'arrogant' },
    ],
    choices: [
      {
        id: 'choice_004_a',
        text: '「天赋并不能代表一切，我会用实力证明自己。」',
        nextNode: 'ch1_classroom_013a',
        effects: [
          { type: 'affection', target: 'amane_yuzu', value: -3 },
          { type: 'affection', target: 'hoshino_sakura', value: 5 },
          { type: 'flag', target: 'stood_up_to_yuzu', value: true },
        ],
      },
      {
        id: 'choice_004_b',
        text: '无视她的挑衅，保持沉默。',
        nextNode: 'ch1_classroom_013b',
        effects: [
          { type: 'affection', target: 'amane_yuzu', value: -1 },
          { type: 'affection', target: 'ishigami_aoi', value: 3 },
        ],
      },
      {
        id: 'choice_004_c',
        text: '「天音同学说得对，我确实还有很多要学习的地方。」',
        nextNode: 'ch1_classroom_013c',
        effects: [
          { type: 'affection', target: 'amane_yuzu', value: 5 },
          { type: 'flag', target: 'humble_response', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_classroom_013a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '哈？你一个连属性都没有的家伙，说要用实力证明自己？真是可笑。不过……我倒要看看你能撑多久。',
    emotion: 'surprised_then_annoyed',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'annoyed' },
    ],
    next: 'ch1_classroom_014',
  },
  {
    id: 'ch1_classroom_013b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '哼，不敢回应吗？懦夫。',
    emotion: 'dismissive',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'dismissive' },
    ],
    next: 'ch1_classroom_014',
  },
  {
    id: 'ch1_classroom_013c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '……哼，至少你还算有自知之明。',
    emotion: 'slightly_pleased',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'slightly_pleased' },
    ],
    next: 'ch1_classroom_014',
  },

  // --- 遇见白石真白 ---
  {
    id: 'ch1_classroom_014',
    type: 'cutscene',
    chapter: 1,
    text: '就在气氛尴尬的时候，一个温柔的声音从身后传来。一个白发紫眸的少女微笑着向你走来，她的身上散发着淡淡的薰衣草香气。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_classroom_015',
  },
  {
    id: 'ch1_classroom_015',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '你好，你就是新来的同学吧？我叫白石真白，治愈魔法属性。以后我们就是同班同学了，请多关照~',
    emotion: 'gentle',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_classroom_016',
  },
  {
    id: 'ch1_classroom_016',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '别在意柚的话，她其实不是坏人，只是从小被家族教育得太严格了。对了，你的手在发抖呢……是紧张吗？让我帮你——',
    emotion: 'caring',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'caring' },
    ],
    next: 'ch1_classroom_017',
  },
  {
    id: 'ch1_classroom_017',
    type: 'cutscene',
    chapter: 1,
    text: '真白轻轻握住了你的手，一道温暖的白色光芒从她的掌心流出，瞬间让你感到安心和平静。',
    background: 'bg_classroom',
    effects: [
      { type: 'affection', target: 'shiraishi_mashiro', value: 3 },
      { type: 'flag', target: 'mashiro_healed', value: true },
    ],
    next: 'ch1_classroom_choice_002',
  },

  // --- 选择点5：对真白的治愈 ---
  {
    id: 'ch1_classroom_choice_002',
    type: 'choice',
    chapter: 1,
    text: '真白的治愈魔法让你感到温暖。你要怎么回应？',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    choices: [
      {
        id: 'choice_005_a',
        text: '「谢谢你，白石同学。你的魔法好温暖。」',
        nextNode: 'ch1_classroom_018a',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 5 },
        ],
      },
      {
        id: 'choice_005_b',
        text: '脸红地缩回手，「不、不用了，我没事的！」',
        nextNode: 'ch1_classroom_018b',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 3 },
        ],
      },
      {
        id: 'choice_005_c',
        text: '好奇地问「治愈魔法是怎么运作的？」',
        nextNode: 'ch1_classroom_018c',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 4 },
          { type: 'flag', target: 'curious_about_healing', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_classroom_018a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '不用谢~治愈系魔法本来就是为了帮助别人而存在的。以后有什么不舒服随时来找我就好。',
    emotion: 'happy',
    background: 'bg_classroom',
    next: 'ch1_classroom_019',
  },
  {
    id: 'ch1_classroom_018b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '噗……你害羞的样子好可爱。不过紧张是正常的，大家第一天都会紧张的。',
    emotion: 'amused',
    background: 'bg_classroom',
    next: 'ch1_classroom_019',
  },
  {
    id: 'ch1_classroom_018c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '治愈魔法的原理是将自身的魔力转化为生命能量，修复受损的身体组织和精神状态。需要很高的精神力和共情能力呢。你对魔法理论也很感兴趣吗？',
    emotion: 'pleased',
    background: 'bg_classroom',
    next: 'ch1_classroom_019',
  },

  // --- 教授登场 ---
  {
    id: 'ch1_classroom_019',
    type: 'cutscene',
    chapter: 1,
    text: '上课铃声响起，一个穿着华丽长袍的中年男子走进了教室。他的白发和金色眼瞳散发着一种威严的气息，但嘴角的微笑又让人感到亲切。',
    background: 'bg_classroom',
    bgm: 'bgm_magic_class',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'wise_smile' },
    ],
    next: 'ch1_classroom_020',
  },
  {
    id: 'ch1_classroom_020',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '各位新同学，早上好。我是赫利俄斯教授，负责教授魔法基础理论。欢迎来到星辉魔法学院。在接下来的一年里，你们将学习到魔法世界的方方面面。',
    emotion: 'warm',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'wise_smile' },
    ],
    next: 'ch1_classroom_021',
  },
  {
    id: 'ch1_classroom_021',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '首先，让我们从最基本的问题开始——什么是魔法？有人愿意回答吗？',
    emotion: 'teaching',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'questioning' },
    ],
    next: 'ch1_classroom_choice_003',
  },

  // --- 选择点6：回答教授的问题 ---
  {
    id: 'ch1_classroom_choice_003',
    type: 'choice',
    chapter: 1,
    text: '赫利俄斯教授在等回答。你是否要举手？',
    background: 'bg_classroom',
    choices: [
      {
        id: 'choice_006_a',
        text: '举手回答：「魔法是对自然能量的运用和操控吧？」',
        nextNode: 'ch1_classroom_022a',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 2 },
          { type: 'flag', target: 'answered_professor', value: true },
        ],
      },
      {
        id: 'choice_006_b',
        text: '举手回答：「魔法是将想象力转化为现实的力量？」',
        nextNode: 'ch1_classroom_022b',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 3 },
          { type: 'flag', target: 'creative_answer', value: true },
        ],
      },
      {
        id: 'choice_006_c',
        text: '保持安静，先观察其他人的回答。',
        nextNode: 'ch1_classroom_022c',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 2 },
        ],
      },
    ],
  },

  {
    id: 'ch1_classroom_022a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '不错的回答！没错，魔法的本质就是对自然中存在的各种元素能量的感知、引导和转化。这位同学，请问你的名字是？',
    emotion: 'pleased',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'pleased' },
    ],
    next: 'ch1_classroom_023',
  },
  {
    id: 'ch1_classroom_022b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '哦？想象力转化为现实……这个说法很有诗意。虽然不完全准确，但在某些高级魔法中，想象力确实是非常重要的因素。你很有潜力。',
    emotion: 'intrigued',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'intrigued' },
    ],
    next: 'ch1_classroom_023',
  },
  {
    id: 'ch1_classroom_022c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '看来有些同学比较谨慎呢。不过在魔法学习中，观察力同样重要。让我来为大家详细讲解吧。',
    emotion: 'understanding',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'understanding' },
    ],
    next: 'ch1_classroom_023',
  },

  // --- 魔法系统讲解 ---
  {
    id: 'ch1_classroom_023',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '在我们的世界中，魔法被分为八大元素系统：火、水、风、土、雷、光、暗，以及最为稀有的时空系。每个人天生就与某种元素有着亲和力，这决定了你的魔法属性。亲和力越高，施展该系魔法就越强大、越省力。通常一个人终生只能精通一至两种属性，极少数天才可以达到三种。',
    emotion: 'teaching',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'teaching' },
    ],
    next: 'ch1_classroom_024',
  },
  {
    id: 'ch1_classroom_024',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '除了元素魔法，还有炼金术、召唤术、治愈术等特殊分类。每种魔法都有从初级到传说级的不同阶段。现在，让我们进行第一次实战练习！',
    emotion: 'enthusiastic',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'enthusiastic' },
    ],
    next: 'ch1_classroom_025',
  },

  // --- 移动到训练场 ---
  {
    id: 'ch1_classroom_025',
    type: 'cutscene',
    chapter: 1,
    text: '赫利俄斯教授带领全班同学来到了室外的魔法训练场。宽阔的场地上布满了防护魔法阵，四周的石柱上刻着古老的符文。',
    background: 'bg_training_ground',
    bgm: 'bgm_magic_class',
    next: 'ch1_classroom_026',
  },
  {
    id: 'ch1_classroom_026',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '今天的练习内容很简单——尝试释放你最基础的元素力量。每个人面前都有一个元素水晶球，将你的魔力注入其中，它会根据你的属性产生反应。',
    emotion: 'teaching',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'teaching' },
    ],
    next: 'ch1_classroom_027',
  },
  {
    id: 'ch1_classroom_027',
    type: 'cutscene',
    chapter: 1,
    text: '星野樱第一个上前，她将手放在水晶球上，一股炽热的火焰瞬间冲天而起，引得周围的同学惊叹不已。天音柚紧随其后，雷电在她指尖跳跃，显示出强大的力量。白石真白温柔地触碰水晶球，柔和的白色光芒如同月光般洒落。',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'proud' },
      { characterId: 'amane_yuzu', position: 'center', emotion: 'smug' },
      { characterId: 'shiraishi_mashiro', position: 'right', emotion: 'gentle_smile' },
    ],
    next: 'ch1_classroom_028',
  },
  {
    id: 'ch1_classroom_028',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '非常好！火属性A级、雷属性S级、治愈属性A级——今年的新生素质很高啊。那么……下一位，「未定义」属性的新同学，请上前来。',
    emotion: 'curious',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'curious' },
    ],
    next: 'ch1_classroom_029',
  },

  // --- 主角的第一次魔法练习 ---
  {
    id: 'ch1_classroom_029',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '（所有人的目光都集中在我身上……好紧张。我到底该怎么做？）',
    emotion: 'nervous',
    background: 'bg_training_ground',
    next: 'ch1_classroom_choice_004',
  },

  // --- 选择点7：选择练习哪种元素魔法 ---
  {
    id: 'ch1_classroom_choice_004',
    type: 'choice',
    chapter: 1,
    text: '教授让你尝试释放魔力。但你的属性是「未定义」，你决定如何尝试？',
    background: 'bg_training_ground',
    choices: [
      {
        id: 'choice_007_a',
        text: '脑海中想象火焰，尝试释放火属性力量。',
        nextNode: 'ch1_classroom_030_fire',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 5 },
          { type: 'flag', target: 'tried_fire', value: true },
          { type: 'stat', target: 'fire_affinity', value: 10 },
        ],
      },
      {
        id: 'choice_007_b',
        text: '脑海中想象流水，尝试释放水属性力量。',
        nextNode: 'ch1_classroom_030_water',
        effects: [
          { type: 'flag', target: 'tried_water', value: true },
          { type: 'stat', target: 'water_affinity', value: 10 },
        ],
      },
      {
        id: 'choice_007_c',
        text: '脑海中想象雷电，尝试释放雷属性力量。',
        nextNode: 'ch1_classroom_030_thunder',
        effects: [
          { type: 'affection', target: 'amane_yuzu', value: 2 },
          { type: 'flag', target: 'tried_thunder', value: true },
          { type: 'stat', target: 'thunder_affinity', value: 10 },
        ],
      },
      {
        id: 'choice_007_d',
        text: '什么都不想，只是单纯地将体内的力量释放出来。',
        nextNode: 'ch1_classroom_030_unique',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 5 },
          { type: 'flag', target: 'tried_unique', value: true },
        ],
      },
    ],
  },

  // 火属性路线
  {
    id: 'ch1_classroom_030_fire',
    type: 'cutscene',
    chapter: 1,
    text: '你闭上眼睛，脑海中浮现出跳动的火焰。一股暖流从胸口涌出，沿着手臂流向指尖——水晶球开始发出温暖的橙红色光芒，但很快，光芒的颜色开始变化……',
    background: 'bg_training_ground',
    bgm: 'bgm_awakening',
    next: 'ch1_classroom_031_common',
  },
  // 水属性路线
  {
    id: 'ch1_classroom_030_water',
    type: 'cutscene',
    chapter: 1,
    text: '你闭上眼睛，脑海中浮现出潺潺流水。一股清凉的能量在体内流动，水晶球开始发出蔚蓝色的光芒，但很快，光芒的颜色开始变化……',
    background: 'bg_training_ground',
    bgm: 'bgm_awakening',
    next: 'ch1_classroom_031_common',
  },
  // 雷属性路线
  {
    id: 'ch1_classroom_030_thunder',
    type: 'cutscene',
    chapter: 1,
    text: '你闭上眼睛，脑海中浮现出闪耀的雷电。一股强烈的电流感在体内奔涌，水晶球开始发出紫色的电光，但很快，光芒的颜色开始变化……',
    background: 'bg_training_ground',
    bgm: 'bgm_awakening',
    next: 'ch1_classroom_031_common',
  },
  // 独特路线
  {
    id: 'ch1_classroom_030_unique',
    type: 'cutscene',
    chapter: 1,
    text: '你闭上眼睛，不去刻意想象任何东西，只是放松身心，让体内的力量自由流动。一股奇异的能量从灵魂深处涌出——水晶球突然爆发出前所未有的光芒！',
    background: 'bg_training_ground',
    bgm: 'bgm_awakening',
    next: 'ch1_classroom_031_common',
  },

  // 共同结果
  {
    id: 'ch1_classroom_031_common',
    type: 'cutscene',
    chapter: 1,
    text: '水晶球突然爆发出七彩交织的光芒！不同颜色的能量在空中旋转、融合，形成了一道绚烂的光环。整个训练场都被这道光芒照亮了。所有在场的人都目瞪口呆。',
    background: 'bg_training_ground',
    bgm: 'bgm_dramatic',
    next: 'ch1_classroom_032',
    effects: [{ type: 'flag', target: 'first_magic_release', value: true }],
  },
  {
    id: 'ch1_classroom_032',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '这……这是……！多元素融合？不，这不仅仅是多元素……这种力量……各位同学，今天的练习到此结束。你——留一下。',
    emotion: 'shocked',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'shocked' },
    ],
    next: 'ch1_classroom_033',
  },

  // --- 各角色反应 ---
  {
    id: 'ch1_classroom_033',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '哇啊啊啊！你刚才那个也太帅了吧！七彩的光芒诶！你到底是怎么做到的？！',
    emotion: 'amazed',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'amazed' },
    ],
    next: 'ch1_classroom_034',
  },
  {
    id: 'ch1_classroom_034',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '……哼，不过是虚张声势罢了。多种元素同时释放，只会让每种元素的威力都大打折扣。华而不实。',
    emotion: 'jealous',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'right', emotion: 'jealous' },
    ],
    next: 'ch1_classroom_035',
  },
  {
    id: 'ch1_classroom_035',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……有趣。从未在任何文献中看到过这样的现象。',
    emotion: 'interested',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'interested' },
    ],
    next: 'ch1_classroom_036',
  },
  {
    id: 'ch1_classroom_036',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '你的魔力……好特别。我能感受到，那股力量中蕴含着某种温暖而深邃的东西。',
    emotion: 'wondering',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'wondering' },
    ],
    next: 'ch1_classroom_037',
  },

  // --- 教授私谈 ---
  {
    id: 'ch1_classroom_037',
    type: 'cutscene',
    chapter: 1,
    text: '其他同学陆续离开后，赫利俄斯教授将你单独叫到了一旁。他的表情异常严肃。',
    background: 'bg_training_ground',
    bgm: 'bgm_mysterious',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'serious' },
    ],
    next: 'ch1_classroom_038',
  },
  {
    id: 'ch1_classroom_038',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '你知道你刚才释放的是什么吗？那不是普通的多元素魔法——多元素魔法是同时释放几种属性，彼此并不交融。而你刚才做到的，是「全元素共鸣」——八种元素在你体内彼此呼应、融为一体，化为一种前所未有的力量。这种事，在魔法典籍中只被记载过一次，而那唯一的一次，发生在一千两百年前。',
    emotion: 'grave',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'grave' },
    ],
    next: 'ch1_classroom_choice_005',
  },

  // --- 选择点8：对教授的话的反应 ---
  {
    id: 'ch1_classroom_choice_005',
    type: 'choice',
    chapter: 1,
    text: '赫利俄斯教授的表情非常凝重。你感到——',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'grave' },
    ],
    choices: [
      {
        id: 'choice_008_a',
        text: '「一千两百年前的那个人是谁？」',
        nextNode: 'ch1_classroom_039a',
        effects: [
          { type: 'flag', target: 'asked_about_legend', value: true },
        ],
      },
      {
        id: 'choice_008_b',
        text: '「这是不是意味着我很危险？」',
        nextNode: 'ch1_classroom_039b',
        effects: [
          { type: 'flag', target: 'asked_about_danger', value: true },
        ],
      },
      {
        id: 'choice_008_c',
        text: '沉默等待教授继续说下去。',
        nextNode: 'ch1_classroom_039c',
        effects: [
          { type: 'affection', target: 'professor_helios', value: 2 },
        ],
      },
    ],
  },

  {
    id: 'ch1_classroom_039a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '那个人……是星辉魔法学院的创始人，初代学院长——星辉大贤者。传说他掌握了所有元素的力量，并用这股力量封印了一场差点毁灭世界的浩劫。为了守护封印、培养后继者，他创建了这座学院。但关于他的具体事迹，包括他最终的下落，大部分都已经失传了——留下的，只有这座千年不倒的学院，和「当世界再度面临危机时，星辉之力会再次觉醒」的古老预言。',
    emotion: 'nostalgic',
    background: 'bg_training_ground',
    next: 'ch1_classroom_040',
  },
  {
    id: 'ch1_classroom_039b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '危险？不一定。但你的确拥有非常特殊的力量，这种力量如果不能妥善控制，可能会带来意想不到的后果。所以接下来的修炼，你要比其他同学更加努力。',
    emotion: 'concerned',
    background: 'bg_training_ground',
    next: 'ch1_classroom_040',
  },
  {
    id: 'ch1_classroom_039c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '……你的沉稳让我印象深刻。很好。让我告诉你更多关于这种力量的事吧。',
    emotion: 'approving',
    background: 'bg_training_ground',
    next: 'ch1_classroom_040',
  },

  {
    id: 'ch1_classroom_040',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '从今天开始，每周三晚上我会单独给你进行额外的魔法训练。另外……我建议你暂时不要在其他同学面前展示全部的力量。有些人可能会因为嫉妒或恐惧而做出不理智的行为。',
    emotion: 'serious',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'serious' },
    ],
    effects: [{ type: 'flag', target: 'private_training_unlocked', value: true }],
    next: 'ch1_classroom_choice_006',
  },

  // --- 选择点9：是否答应保密 ---
  {
    id: 'ch1_classroom_choice_006',
    type: 'choice',
    chapter: 1,
    text: '教授建议你隐藏实力。你怎么看？',
    background: 'bg_training_ground',
    choices: [
      {
        id: 'choice_009_a',
        text: '「我明白了，我会小心的。」',
        nextNode: 'ch1_classroom_041a',
        effects: [
          { type: 'affection', target: 'professor_helios', value: 5 },
          { type: 'flag', target: 'agreed_to_hide_power', value: true },
        ],
      },
      {
        id: 'choice_009_b',
        text: '「可是我不想对朋友隐瞒……」',
        nextNode: 'ch1_classroom_041b',
        effects: [
          { type: 'affection', target: 'professor_helios', value: 1 },
          { type: 'flag', target: 'reluctant_to_hide', value: true },
        ],
      },
      {
        id: 'choice_009_c',
        text: '「教授，能告诉我更多关于这个力量的真相吗？」',
        nextNode: 'ch1_classroom_041c',
        effects: [
          { type: 'affection', target: 'professor_helios', value: 3 },
          { type: 'flag', target: 'sought_truth', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_classroom_041a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '很好，你能理解就好。去休息吧，明天还有更多的课程等着你。记住，任何时候遇到问题都可以来找我。',
    emotion: 'relieved',
    background: 'bg_training_ground',
    next: 'ch1_classroom_042',
  },
  {
    id: 'ch1_classroom_041b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '……你的真诚让我感动。但有些事情，即使是朋友也不适合知道得太早。至少在你学会控制这股力量之前，谨慎一些好吗？',
    emotion: 'understanding',
    background: 'bg_training_ground',
    next: 'ch1_classroom_042',
  },
  {
    id: 'ch1_classroom_041c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '关于这个力量的真相……现在告诉你还为时过早。但我可以告诉你一件事——你之所以被空间裂缝传送到这里，绝非偶然。星辉大贤者临终前留下预言：当千年的封印开始松动、世界再度陷入危机之时，继承星辉之力的人就会出现。而你……很可能就是那个人。当你准备好了，一切都会水落石出的。',
    emotion: 'mysterious',
    background: 'bg_training_ground',
    next: 'ch1_classroom_042',
  },

  {
    id: 'ch1_classroom_042',
    type: 'cutscene',
    chapter: 1,
    text: '你离开了训练场，脑海中充满了教授的话。回到宿舍的路上，星野樱在走廊等你。\n\n——魔法基础 课程完——',
    background: 'bg_corridor',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'chapter1_classroom_complete', value: true }],
    next: 'ch1_classroom_extra_001',
  },

  // --- 魔法课额外选择点 ---
  {
    id: 'ch1_classroom_extra_001',
    type: 'choice',
    chapter: 1,
    text: '樱在走廊等你，她看起来有些犹豫。她想对你说——',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_ce001_a', text: '主动打招呼：「樱，你怎么在这里？」', nextNode: 'ch1_classroom_extra_002', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 3 }] },
      { id: 'choice_ce001_b', text: '微笑着等她开口。', nextNode: 'ch1_classroom_extra_002', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 2 }] },
    ],
  },
  {
    id: 'ch1_classroom_extra_002',
    type: 'choice',
    chapter: 1,
    text: '樱邀请你一起练习魔法。她说可以互相切磋。你——',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_ce002_a', text: '「好啊！我正想多练习呢！」', nextNode: 'ch1_classroom_extra_003', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 5 }, { type: 'stat', target: 'magic_control', value: 3 }] },
      { id: 'choice_ce002_b', text: '「今天有些累了，改天吧。」', nextNode: 'ch1_classroom_extra_003', effects: [{ type: 'affection', target: 'hoshino_sakura', value: -1 }] },
      { id: 'choice_ce002_c', text: '「我能行吗……你可是A级天才啊。」', nextNode: 'ch1_classroom_extra_003', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 3 }] },
    ],
  },
  {
    id: 'ch1_classroom_extra_003',
    type: 'choice',
    chapter: 1,
    text: '练习结束后，你感到自己的魔力控制有了进步。此时天色已晚，你决定——',
    background: 'bg_classroom_evening',
    choices: [
      { id: 'choice_ce003_a', text: '去图书馆查阅「全元素共鸣」的资料。', nextNode: 'ch1_classroom_extra_004', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'researched_resonance', value: true }] },
      { id: 'choice_ce003_b', text: '去找真白，聊聊关于治愈魔法的事。', nextNode: 'ch1_classroom_extra_004', effects: [{ type: 'affection', target: 'shiraishi_mashiro', value: 5 }] },
      { id: 'choice_ce003_c', text: '回宿舍好好休息。', nextNode: 'ch1_classroom_extra_004', effects: [{ type: 'stat', target: 'rest', value: 5 }] },
    ],
  },
  {
    id: 'ch1_classroom_extra_004',
    type: 'choice',
    chapter: 1,
    text: '在路上你遇到了天音柚。她看了你一眼，欲言又止。你觉得她在想什么？',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_ce004_a', text: '她可能在想白天魔力释放的事。', nextNode: 'ch1_classroom_extra_005', effects: [{ type: 'flag', target: 'analyzed_yuzu_thoughts', value: true }] },
      { id: 'choice_ce004_b', text: '她大概只是路过而已。', nextNode: 'ch1_classroom_extra_005', effects: [] },
      { id: 'choice_ce004_c', text: '主动走过去和她说话。', nextNode: 'ch1_classroom_extra_005', effects: [{ type: 'affection', target: 'amane_yuzu', value: 5 }, { type: 'flag', target: 'talked_to_yuzu_evening', value: true }] },
    ],
  },
  {
    id: 'ch1_classroom_extra_005',
    type: 'choice',
    chapter: 1,
    text: '回到宿舍，你收到了赫利俄斯教授的信：「周三晚上第一次单独训练，做好准备。」你——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_ce005_a', text: '认真复习今天的课程内容。', nextNode: 'ch1_forest_001', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'studied_for_training', value: true }] },
      { id: 'choice_ce005_b', text: '早点睡觉，保持最佳状态。', nextNode: 'ch1_forest_001', effects: [{ type: 'stat', target: 'rest', value: 5 }] },
      { id: 'choice_ce005_c', text: '拿出星光吊坠仔细观察。', nextNode: 'ch1_forest_001', effects: [{ type: 'flag', target: 'examined_pendant', value: true }] },
    ],
  },

  // ============================================================
  // PART 3: 第一次战斗 - 森林探索 (First Battle - Forest Exploration)
  // ============================================================

  // --- 学院通知 ---
  {
    id: 'ch1_forest_001',
    type: 'cutscene',
    chapter: 1,
    text: '入学第三天，学院布告栏上张贴了一则重要的通知——「新生魔法森林探索活动」。所有一年级学生必须参加，这是入学后的第一次实战考核。',
    background: 'bg_corridor',
    bgm: 'bgm_main_theme',
    effects: [{ type: 'flag', target: 'forest_exploration_started', value: true }],
    next: 'ch1_forest_002',
  },
  {
    id: 'ch1_forest_002',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '魔法森林探索！每年新生的传统活动哦~在森林里会遇到各种各样的野生魔法生物，要运用你学到的魔法来应对。表现好的话还会有奖励呢！',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'excited' },
    ],
    next: 'ch1_forest_003',
  },
  {
    id: 'ch1_forest_003',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '野生魔法生物？听起来有点危险……',
    emotion: 'worried',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'excited' },
    ],
    next: 'ch1_forest_004',
  },
  {
    id: 'ch1_forest_004',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '放心放心~外圈的生物都不强的，而且有老师们在暗中保护。不过探索森林深处的话……嗯，那就看你的实力了！',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'right', emotion: 'wink' },
    ],
    next: 'ch1_forest_005',
  },

  // --- 队伍分配 ---
  {
    id: 'ch1_forest_005',
    type: 'cutscene',
    chapter: 1,
    text: '探索活动的队伍分配结果公布了。你被分到了第三小队。',
    background: 'bg_lobby',
    bgm: 'bgm_main_theme',
    next: 'ch1_forest_choice_001',
  },

  // --- 选择点10：队伍成员（根据之前的选择） ---
  {
    id: 'ch1_forest_choice_001',
    type: 'choice',
    chapter: 1,
    text: '你希望谁加入你的队伍？（注意：这会影响后续的剧情走向和好感度）',
    background: 'bg_lobby',
    choices: [
      {
        id: 'choice_010_a',
        text: '邀请星野樱加入队伍',
        nextNode: 'ch1_forest_006_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 8 },
          { type: 'flag', target: 'team_sakura', value: true },
        ],
      },
      {
        id: 'choice_010_b',
        text: '邀请白石真白加入队伍',
        nextNode: 'ch1_forest_006_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 8 },
          { type: 'flag', target: 'team_mashiro', value: true },
        ],
      },
      {
        id: 'choice_010_c',
        text: '邀请石神葵加入队伍',
        nextNode: 'ch1_forest_006_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 8 },
          { type: 'flag', target: 'team_aoi', value: true },
        ],
      },
      {
        id: 'choice_010_d',
        text: '随机分配就好',
        nextNode: 'ch1_forest_006_random',
        effects: [
          { type: 'flag', target: 'team_random', value: true },
        ],
      },
    ],
  },

  // 樱入队
  {
    id: 'ch1_forest_006_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '真的吗？你要选我？太好了！放心吧，有我在，什么怪物都不在话下！看我把它们统统烧成灰！',
    background: 'bg_lobby',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_forest_007',
  },
  // 真白入队
  {
    id: 'ch1_forest_006_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '嗯，我很乐意和你一组。虽然我的战斗力可能不够强，但我会好好支持大家的。治愈和辅助就交给我吧。',
    background: 'bg_lobby',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_forest_007',
  },
  // 葵入队
  {
    id: 'ch1_forest_006_aoi',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……选我？可以。我正好需要采集一些森林里的炼金素材。不过别指望我会说很多话。',
    background: 'bg_lobby',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'neutral' },
    ],
    next: 'ch1_forest_007',
  },
  // 随机分配
  {
    id: 'ch1_forest_006_random',
    type: 'cutscene',
    chapter: 1,
    text: '系统随机分配的结果是——星野樱和石神葵成为了你的队友。樱热情地挥着手，葵则默默地检查着自己的装备。',
    background: 'bg_lobby',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'happy' },
      { characterId: 'ishigami_aoi', position: 'right', emotion: 'neutral' },
    ],
    next: 'ch1_forest_007',
  },

  // --- 出发前往森林 ---
  {
    id: 'ch1_forest_007',
    type: 'cutscene',
    chapter: 1,
    text: '所有小队集合完毕后，赫利俄斯教授宣布了探索规则：每队需要在森林中收集至少三颗「魔力结晶」，并且安全返回。限时六小时。各小队可以选择不同的路线。',
    background: 'bg_forest',
    bgm: 'bgm_forest',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'serious' },
    ],
    next: 'ch1_forest_008',
  },
  {
    id: 'ch1_forest_008',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '记住，安全第一。遇到无法应对的危险，立刻使用传送水晶回到这里。现在，出发！',
    background: 'bg_forest',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'serious' },
    ],
    next: 'ch1_forest_009',
  },

  // --- 进入森林 ---
  {
    id: 'ch1_forest_009',
    type: 'cutscene',
    chapter: 1,
    text: '你和队友们踏入了魔法森林。参天古木遮天蔽日，树干上缠绕着发光的藤蔓，空气中弥漫着魔力的气息。偶尔有小型魔法生物从灌木丛中探出头来好奇地打量着你们。',
    background: 'bg_forest',
    bgm: 'bgm_forest',
    next: 'ch1_forest_010',
  },
  {
    id: 'ch1_forest_010',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '这里的空气……好像和外面完全不一样。充满了某种能量。',
    emotion: 'wondering',
    background: 'bg_forest',
    next: 'ch1_forest_choice_006',
  },

  // --- 选择点：森林路径选择 ---
  {
    id: 'ch1_forest_choice_006',
    type: 'choice',
    chapter: 1,
    text: '面前有两条小路。左边的路被发光的蘑菇覆盖，看起来很安全；右边的路通向更深的密林，隐约能听到水流声。你选择——',
    background: 'bg_forest',
    choices: [
      { id: 'choice_fs006_a', text: '走左边安全的路。', nextNode: 'ch1_forest_choice_007', effects: [{ type: 'flag', target: 'took_safe_path', value: true }, { type: 'stat', target: 'intelligence', value: 2 }] },
      { id: 'choice_fs006_b', text: '走右边探索更深的密林。', nextNode: 'ch1_forest_choice_007', effects: [{ type: 'flag', target: 'took_deep_path', value: true }, { type: 'stat', target: 'courage', value: 2 }] },
      { id: 'choice_fs006_c', text: '让队友来决定。', nextNode: 'ch1_forest_choice_007', effects: [{ type: 'flag', target: 'let_teammate_decide', value: true }, { type: 'affection', target: 'hoshino_sakura', value: 2 }] },
    ],
  },
  {
    id: 'ch1_forest_choice_007',
    type: 'choice',
    chapter: 1,
    text: '在前进的途中，你发现了一株罕见的魔法草药。它散发着淡蓝色的光芒。你——',
    background: 'bg_forest',
    choices: [
      { id: 'choice_fs007_a', text: '小心地采集下来，以后也许有用。', nextNode: 'ch1_forest_011', effects: [{ type: 'item', target: 'rare_herb', value: 1 }, { type: 'flag', target: 'collected_herb', value: true }] },
      { id: 'choice_fs007_b', text: '观察一下但不触碰。', nextNode: 'ch1_forest_011', effects: [{ type: 'stat', target: 'intelligence', value: 2 }, { type: 'flag', target: 'observed_herb', value: true }] },
      { id: 'choice_fs007_c', text: '告诉队友这里有好东西。', nextNode: 'ch1_forest_011', effects: [{ type: 'affection', target: 'ishigami_aoi', value: 3 }] },
    ],
  },
  {
    id: 'ch1_forest_011',
    type: 'cutscene',
    chapter: 1,
    text: '你沿着小路前行，忽然，前方的灌木丛剧烈摇晃起来——一只全身覆盖着冰霜的巨狼从树丛中跳了出来！',
    background: 'bg_forest',
    bgm: 'bgm_battle',
    effects: [{ type: 'flag', target: 'first_enemy_encounter', value: true }],
    next: 'ch1_forest_012',
  },

  // --- 第一次战斗：冰霜巨狼 ---
  {
    id: 'ch1_forest_012',
    type: 'battle',
    chapter: 1,
    text: '野生的冰霜巨狼出现了！这是你的第一场战斗。巨狼张开大嘴，一团冰蓝色的能量正在凝聚——它准备发动攻击了！',
    background: 'bg_forest',
    bgm: 'bgm_battle',
    enemyId: 'frost_wolf',
    next: 'ch1_forest_choice_002',
  },

  // --- 选择点11：第一场战斗策略 ---
  {
    id: 'ch1_forest_choice_002',
    type: 'choice',
    chapter: 1,
    text: '冰霜巨狼正在蓄力！你必须立刻做出反应！',
    background: 'bg_forest',
    choices: [
      {
        id: 'choice_011_a',
        text: '冲上前去，用近身攻击打断它的蓄力！',
        nextNode: 'ch1_forest_013_melee',
        effects: [
          { type: 'flag', target: 'combat_style_melee', value: true },
          { type: 'stat', target: 'courage', value: 5 },
        ],
      },
      {
        id: 'choice_011_b',
        text: '尝试释放魔法进行远程攻击！',
        nextNode: 'ch1_forest_013_magic',
        effects: [
          { type: 'flag', target: 'combat_style_magic', value: true },
          { type: 'stat', target: 'magic_control', value: 5 },
        ],
      },
      {
        id: 'choice_011_c',
        text: '让队友先行进攻，自己在后方观察弱点！',
        nextNode: 'ch1_forest_013_observe',
        effects: [
          { type: 'flag', target: 'combat_style_observe', value: true },
          { type: 'stat', target: 'intelligence', value: 5 },
        ],
      },
      {
        id: 'choice_011_d',
        text: '尝试与冰霜巨狼沟通！',
        nextNode: 'ch1_forest_013_communicate',
        effects: [
          { type: 'flag', target: 'combat_style_diplomacy', value: true },
          { type: 'stat', target: 'empathy', value: 5 },
        ],
      },
    ],
  },

  // 近身战斗
  {
    id: 'ch1_forest_013_melee',
    type: 'cutscene',
    chapter: 1,
    text: '你鼓起勇气冲了上去！在冰弹射出的一瞬间，你侧身闪避，同时将魔力集中在拳头上，狠狠地砸向巨狼的侧腹。巨狼吃痛，嚎叫着后退了几步。',
    background: 'bg_forest',
    bgm: 'bgm_battle',
    next: 'ch1_forest_014',
  },
  // 魔法战斗
  {
    id: 'ch1_forest_013_magic',
    type: 'cutscene',
    chapter: 1,
    text: '你后退一步，双手前伸，试图释放魔法。七彩的光芒在你掌心凝聚——一道混合着火焰和雷电的能量束射向巨狼！虽然威力不够集中，但足以让巨狼感到疼痛。',
    background: 'bg_forest',
    bgm: 'bgm_battle',
    next: 'ch1_forest_014',
  },
  // 观察策略
  {
    id: 'ch1_forest_013_observe',
    type: 'cutscene',
    chapter: 1,
    text: '你冷静地退到后方，仔细观察巨狼的行动模式。你发现它每次蓄力攻击后都会有一个短暂的停顿，而且左后腿似乎有旧伤。你将这个信息告诉了队友。',
    background: 'bg_forest',
    bgm: 'bgm_battle',
    next: 'ch1_forest_014',
  },
  // 沟通尝试
  {
    id: 'ch1_forest_013_communicate',
    type: 'cutscene',
    chapter: 1,
    text: '你伸出手，试图用精神力与巨狼建立联系。出乎所有人意料的是，巨狼的动作竟然慢了下来！它歪着头看着你，冰蓝色的眼睛中似乎闪过一丝困惑。',
    background: 'bg_forest',
    bgm: 'bgm_mysterious',
    next: 'ch1_forest_014',
    effects: [
      { type: 'affection', target: 'kazane_rin', value: 5 },
      { type: 'flag', target: 'wolf_communication_attempt', value: true },
    ],
  },

  // --- 战斗结局 ---
  {
    id: 'ch1_forest_014',
    type: 'cutscene',
    chapter: 1,
    text: '经过一番激战，冰霜巨狼终于不再攻击你们。它发出一声低沉的嚎叫，转身消失在了密林深处。在它离开的地方，留下了一颗闪烁着冰蓝色光芒的魔力结晶。',
    background: 'bg_forest',
    bgm: 'bgm_forest',
    next: 'ch1_forest_015',
    effects: [{ type: 'item', target: 'ice_crystal', value: 1 }],
  },
  {
    id: 'ch1_forest_015',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '我们……赢了？这就是魔法战斗吗？',
    emotion: 'relieved',
    background: 'bg_forest',
    next: 'ch1_forest_choice_003',
  },

  // --- 选择点12：战后反应 ---
  {
    id: 'ch1_forest_choice_003',
    type: 'choice',
    chapter: 1,
    text: '第一场战斗结束了。你有什么感受？',
    background: 'bg_forest',
    choices: [
      {
        id: 'choice_012_a',
        text: '太刺激了！想继续探索更深处！',
        nextNode: 'ch1_forest_016a',
        effects: [
          { type: 'stat', target: 'courage', value: 3 },
          { type: 'flag', target: 'wants_deeper_exploration', value: true },
        ],
      },
      {
        id: 'choice_012_b',
        text: '有些后怕，但在可控范围内。',
        nextNode: 'ch1_forest_016b',
        effects: [
          { type: 'stat', target: 'intelligence', value: 2 },
        ],
      },
      {
        id: 'choice_012_c',
        text: '关心队友是否受伤。',
        nextNode: 'ch1_forest_016c',
        effects: [
          { type: 'stat', target: 'empathy', value: 3 },
          { type: 'affection', target: 'shiraishi_mashiro', value: 5 },
        ],
      },
    ],
  },

  {
    id: 'ch1_forest_016a',
    type: 'cutscene',
    chapter: 1,
    text: '带着兴奋的心情，你带领队伍继续向森林深处前进。树木越来越茂密，魔力的气息也越来越浓郁。',
    background: 'bg_forest_deep',
    bgm: 'bgm_forest',
    next: 'ch1_forest_017',
  },
  {
    id: 'ch1_forest_016b',
    type: 'cutscene',
    chapter: 1,
    text: '你整理了一下思绪，冷静地分析了刚才的战斗。虽然有些惊险，但你从中学到了不少。队伍继续前进。',
    background: 'bg_forest',
    bgm: 'bgm_forest',
    next: 'ch1_forest_017',
  },
  {
    id: 'ch1_forest_016c',
    type: 'cutscene',
    chapter: 1,
    text: '你仔细检查了每个队友的状态，确认没有人受伤后才松了一口气。这种细心让队友们对你的好感大增。',
    background: 'bg_forest',
    bgm: 'bgm_forest',
    next: 'ch1_forest_017',
  },

  // --- 深入森林 ---
  {
    id: 'ch1_forest_017',
    type: 'cutscene',
    chapter: 1,
    text: '随着深入，你又收集到了两颗魔力结晶。但就在这时，你发现了一条隐蔽的小径，通向一片古老的废墟。',
    background: 'bg_forest_deep',
    bgm: 'bgm_mysterious',
    next: 'ch1_forest_018',
  },
  {
    id: 'ch1_forest_018',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '那是什么……？看起来像是某种古老的建筑遗迹。',
    emotion: 'curious',
    background: 'bg_forest_deep',
    next: 'ch1_forest_choice_004',
  },

  // --- 选择点13：是否进入遗迹 ---
  {
    id: 'ch1_forest_choice_004',
    type: 'choice',
    chapter: 1,
    text: '你发现了一条通往古老遗迹的隐蔽小径。虽然已经收集够了三颗结晶，但遗迹的神秘气息深深吸引着你。你要怎么做？',
    background: 'bg_forest_deep',
    choices: [
      {
        id: 'choice_013_a',
        text: '进入遗迹探索！这种机会不可错过！',
        nextNode: 'ch1_forest_019_enter',
        effects: [
          { type: 'stat', target: 'courage', value: 5 },
          { type: 'flag', target: 'entered_ruins', value: true },
        ],
      },
      {
        id: 'choice_013_b',
        text: '先在入口处观察一下，再做决定。',
        nextNode: 'ch1_forest_019_observe',
        effects: [
          { type: 'stat', target: 'intelligence', value: 3 },
          { type: 'flag', target: 'observed_ruins', value: true },
        ],
      },
      {
        id: 'choice_013_c',
        text: '太危险了，还是直接回去吧。',
        nextNode: 'ch1_forest_019_leave',
        effects: [
          { type: 'flag', target: 'left_ruins', value: true },
        ],
      },
    ],
  },

  // 进入遗迹
  {
    id: 'ch1_forest_019_enter',
    type: 'cutscene',
    chapter: 1,
    text: '你推开了遗迹入口处沉重的石门。门后是一条长长的走廊，墙壁上刻满了古老的符文，散发着微弱的蓝色光芒。空气中有种古老而庄严的气息。',
    background: 'bg_ruins_entrance',
    bgm: 'bgm_ruins',
    next: 'ch1_forest_020',
  },
  // 观察遗迹
  {
    id: 'ch1_forest_019_observe',
    type: 'cutscene',
    chapter: 1,
    text: '你仔细观察了遗迹入口的符文。这些文字似乎记录着某种警告，但大部分已经模糊不清。经过慎重考虑，你还是决定进入——毕竟，探索本身就是魔法学习的一部分。',
    background: 'bg_ruins_entrance',
    bgm: 'bgm_ruins',
    next: 'ch1_forest_020',
  },
  // 离开遗迹
  {
    id: 'ch1_forest_019_leave',
    type: 'cutscene',
    chapter: 1,
    text: '你正准备转身离开，突然——遗迹的石门自动打开了！一股强大的魔力将你们吸了进去！',
    background: 'bg_ruins_entrance',
    bgm: 'bgm_ruins',
    effects: [{ type: 'flag', target: 'forced_into_ruins', value: true }],
    next: 'ch1_forest_020',
  },

  // --- 遗迹内部探索 ---
  {
    id: 'ch1_forest_020',
    type: 'cutscene',
    chapter: 1,
    text: '遗迹内部比想象中要大得多。宏伟的大厅中央矗立着一座巨大的水晶，水晶中封印着一把剑——一把散发着星光的魔法剑。剑身上刻着与学院门楣上相同的古老符文，仿佛在无声地诉说着什么。空气中弥漫的魔力气息，和你觉醒那天感受到的如出一辙。',
    background: 'bg_ruins_interior',
    bgm: 'bgm_ruins',
    next: 'ch1_forest_021',
  },
  {
    id: 'ch1_forest_021',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '这是……好强的魔力波动。这把剑到底是什么来历？',
    emotion: 'awed',
    background: 'bg_ruins_interior',
    next: 'ch1_forest_022',
  },
  {
    id: 'ch1_forest_022',
    type: 'cutscene',
    chapter: 1,
    text: '就在你靠近水晶的那一刻，整个遗迹突然震动起来！水晶表面出现了裂痕，一个由魔法能量构成的巨大身影从裂痕中浮现——遗迹的守护者！',
    background: 'bg_ruins_interior',
    bgm: 'bgm_boss_battle',
    effects: [{ type: 'flag', target: 'boss_encountered', value: true }],
    next: 'ch1_forest_023',
  },

  // --- Boss战 ---
  {
    id: 'ch1_forest_023',
    type: 'battle',
    chapter: 1,
    text: '遗迹守护者——「星辉之守卫」出现了！这是一具由纯魔法能量构成的古代石像，全身闪烁着星辰般的光芒。它的力量远超之前的冰霜巨狼！',
    background: 'bg_ruins_interior',
    bgm: 'bgm_boss_battle',
    enemyId: 'star_guardian',
    next: 'ch1_forest_choice_005',
  },

  // --- 选择点14：Boss战策略 ---
  {
    id: 'ch1_forest_choice_005',
    type: 'choice',
    chapter: 1,
    text: '星辉之守卫发出了震耳欲聋的咆哮！你必须立刻决定战斗策略！',
    background: 'bg_ruins_interior',
    choices: [
      {
        id: 'choice_014_a',
        text: '全力释放自己的全部魔力！',
        nextNode: 'ch1_forest_024_full_power',
        effects: [
          { type: 'flag', target: 'used_full_power', value: true },
          { type: 'stat', target: 'magic_power', value: 10 },
        ],
      },
      {
        id: 'choice_014_b',
        text: '指挥队友配合作战！',
        nextNode: 'ch1_forest_024_teamwork',
        effects: [
          { type: 'flag', target: 'used_teamwork', value: true },
          { type: 'stat', target: 'leadership', value: 10 },
        ],
      },
      {
        id: 'choice_014_c',
        text: '寻找守护者的弱点！',
        nextNode: 'ch1_forest_024_weakness',
        effects: [
          { type: 'flag', target: 'found_weakness', value: true },
          { type: 'stat', target: 'intelligence', value: 10 },
        ],
      },
      {
        id: 'choice_014_d',
        text: '尝试与守护者沟通，表明没有恶意！',
        nextNode: 'ch1_forest_024_negotiate',
        effects: [
          { type: 'flag', target: 'negotiated_with_guardian', value: true },
          { type: 'stat', target: 'empathy', value: 10 },
        ],
      },
    ],
  },

  // 全力释放
  {
    id: 'ch1_forest_024_full_power',
    type: 'cutscene',
    chapter: 1,
    text: '你深吸一口气，将体内所有的魔力集中在双手之上。七彩的光芒再次绽放，比训练场上那次更加耀眼！你将这股力量推向了守护者——',
    background: 'bg_ruins_interior',
    bgm: 'bgm_boss_battle',
    next: 'ch1_forest_025',
  },
  // 团队配合
  {
    id: 'ch1_forest_024_teamwork',
    type: 'cutscene',
    chapter: 1,
    text: '你冷静地分析战场，迅速下达指令。队友们配合默契——有人牵制，有人攻击，有人支援。虽然个人力量不足，但团队的配合弥补了一切！',
    background: 'bg_ruins_interior',
    bgm: 'bgm_boss_battle',
    next: 'ch1_forest_025',
  },
  // 寻找弱点
  {
    id: 'ch1_forest_024_weakness',
    type: 'cutscene',
    chapter: 1,
    text: '在守护者攻击的间隙，你仔细观察它的行动。你注意到它胸口的水晶核心每次发光时都会有一个短暂的暗淡期——那就是弱点！你抓住时机，将力量集中攻击那个位置！',
    background: 'bg_ruins_interior',
    bgm: 'bgm_boss_battle',
    next: 'ch1_forest_025',
  },
  // 沟通
  {
    id: 'ch1_forest_024_negotiate',
    type: 'cutscene',
    chapter: 1,
    text: '你放下攻击姿态，用精神力向守护者传达了自己没有恶意的信息。守护者犹豫了一下——就在这短暂的停顿中，你感受到了一股来自遗迹深处的共鸣。似乎有什么东西认可了你。',
    background: 'bg_ruins_interior',
    bgm: 'bgm_mysterious',
    next: 'ch1_forest_025',
  },

  // --- Boss战结局 ---
  {
    id: 'ch1_forest_025',
    type: 'cutscene',
    chapter: 1,
    text: '战斗持续了整整十分钟。最终，守护者的身体开始碎裂，化为无数光点消散在空中。在它消失的位置，那把星光之剑缓缓从水晶中飞出，悬浮在你的面前。',
    background: 'bg_ruins_interior',
    bgm: 'bgm_awakening',
    next: 'ch1_forest_026',
  },
  {
    id: 'ch1_forest_026',
    type: 'cutscene',
    chapter: 1,
    text: '你伸出手，触碰了剑柄。一瞬间，大量的信息涌入你的脑海——你看到了一个模糊的身影，穿着古老的长袍，手持同样的剑，站在学院的大门前。那个声音再次响起——',
    background: 'bg_starry_sky',
    bgm: 'bgm_awakening',
    next: 'ch1_forest_027',
  },
  {
    id: 'ch1_forest_027',
    type: 'dialogue',
    chapter: 1,
    speaker: '???',
    text: '「终于等到你了……星辉的继承者。千年前的封印正在松动，而你是唯一能够继承这份力量、守护这个世界的人……」',
    emotion: 'mysterious',
    background: 'bg_starry_sky',
    next: 'ch1_forest_028',
    effects: [
      { type: 'item', target: 'starlight_sword', value: 1 },
      { type: 'flag', target: 'obtained_starlight_sword', value: true },
    ],
  },
  {
    id: 'ch1_forest_028',
    type: 'cutscene',
    chapter: 1,
    text: '幻象消失了。你手中的剑缩小成了一个精巧的吊坠。遗迹开始崩塌，你和队友们匆忙逃出了废墟。\n\n——森林探索 完——',
    background: 'bg_forest',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'chapter1_forest_complete', value: true }],
    next: 'ch1_forest_extra_001',
  },

  // --- 森林探索额外选择点 ---
  {
    id: 'ch1_forest_extra_001',
    type: 'choice',
    chapter: 1,
    text: '从遗迹逃出来后，你和队友们气喘吁吁地停在安全地带。你——',
    background: 'bg_forest',
    choices: [
      { id: 'choice_fe001_a', text: '检查队友们的状况。', nextNode: 'ch1_forest_extra_002', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'affection', target: 'shiraishi_mashiro', value: 3 }] },
      { id: 'choice_fe001_b', text: '回忆刚才遗迹里发生的一切。', nextNode: 'ch1_forest_extra_002', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'reflected_on_ruins', value: true }] },
      { id: 'choice_fe001_c', text: '观察手中的星光吊坠。', nextNode: 'ch1_forest_extra_002', effects: [{ type: 'flag', target: 'observed_pendant_post_battle', value: true }] },
    ],
  },
  {
    id: 'ch1_forest_extra_002',
    type: 'choice',
    chapter: 1,
    text: '返回学院的路上，铃跑来接你们。看到你平安无事，她松了一口气。你要对她说——',
    background: 'bg_academy_gate',
    choices: [
      { id: 'choice_fe002_a', text: '「让你担心了，抱歉。」', nextNode: 'ch1_forest_extra_003', effects: [{ type: 'affection', target: 'kazane_rin', value: 5 }] },
      { id: 'choice_fe002_b', text: '兴奋地向她描述遗迹里的冒险。', nextNode: 'ch1_forest_extra_003', effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }, { type: 'flag', target: 'told_rin_about_ruins', value: true }] },
      { id: 'choice_fe002_c', text: '「我没事，不用担心。」', nextNode: 'ch1_forest_extra_003', effects: [{ type: 'affection', target: 'kazane_rin', value: 1 }] },
    ],
  },
  {
    id: 'ch1_forest_extra_003',
    type: 'choice',
    chapter: 1,
    text: '赫利俄斯教授在学院门口等你们。他看着你手中的吊坠，表情复杂。他问你——',
    background: 'bg_lobby',
    choices: [
      { id: 'choice_fe003_a', text: '如实报告遗迹里发生的一切。', nextNode: 'ch1_forest_extra_004', effects: [{ type: 'affection', target: 'professor_helios', value: 5 }, { type: 'flag', target: 'reported_truthfully', value: true }] },
      { id: 'choice_fe003_b', text: '只说了部分情况，保留了一些秘密。', nextNode: 'ch1_forest_extra_004', effects: [{ type: 'flag', target: 'partial_report', value: true }] },
      { id: 'choice_fe003_c', text: '询问教授关于这个吊坠的来历。', nextNode: 'ch1_forest_extra_004', effects: [{ type: 'flag', target: 'asked_pendant_origin', value: true }, { type: 'affection', target: 'professor_helios', value: 3 }] },
    ],
  },
  {
    id: 'ch1_forest_extra_004',
    type: 'choice',
    chapter: 1,
    text: '晚上回到宿舍，你感到身心俱疲但内心充实。你决定——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_fe004_a', text: '写下今天的冒险日记。', nextNode: 'ch1_forest_extra_005', effects: [{ type: 'flag', target: 'wrote_diary', value: true }, { type: 'stat', target: 'intelligence', value: 2 }] },
      { id: 'choice_fe004_b', text: '冥想，感受体内的魔力流动。', nextNode: 'ch1_forest_extra_005', effects: [{ type: 'stat', target: 'magic_control', value: 5 }, { type: 'flag', target: 'meditated_after_forest', value: true }] },
      { id: 'choice_fe004_c', text: '直接倒头就睡。', nextNode: 'ch1_forest_extra_005', effects: [{ type: 'stat', target: 'rest', value: 5 }] },
    ],
  },
  {
    id: 'ch1_forest_extra_005',
    type: 'choice',
    chapter: 1,
    text: '半夜，你被一阵奇异的光芒惊醒。吊坠在黑暗中发出微弱的星光。你——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_fe005_a', text: '紧张地观察光芒的变化。', nextNode: 'ch1_daily_001', effects: [{ type: 'flag', target: 'observed_glow', value: true }] },
      { id: 'choice_fe005_b', text: '尝试与光芒产生共鸣。', nextNode: 'ch1_daily_001', effects: [{ type: 'stat', target: 'magic_power', value: 3 }, { type: 'flag', target: 'resonated_with_pendant', value: true }] },
      { id: 'choice_fe005_c', text: '用被子蒙住头继续睡。', nextNode: 'ch1_daily_001', effects: [{ type: 'flag', target: 'ignored_glow', value: true }] },
    ],
  },

  // ============================================================
  // PART 4: 日常与羁绊 (Daily Life & Bonds)
  // ============================================================

  // --- 学院日常 ---
  {
    id: 'ch1_daily_001',
    type: 'cutscene',
    chapter: 1,
    text: '森林探索之后，你正式融入了星辉魔法学院的日常生活。每天都有新的课程、新的挑战，以及和同伴们相处的快乐时光。',
    background: 'bg_academy_gate',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'daily_life_started', value: true }],
    next: 'ch1_daily_002',
  },

  // --- 图书馆场景 ---
  {
    id: 'ch1_daily_002',
    type: 'cutscene',
    chapter: 1,
    text: '一个宁静的午后，你来到了学院的图书馆。这里是整个学院最宏伟的建筑之一——五层楼高的圆形大厅，书架从地面一直延伸到天花板，漂浮的蜡烛散发着温暖的光芒。',
    background: 'bg_library',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_003',
  },
  {
    id: 'ch1_daily_003',
    type: 'cutscene',
    chapter: 1,
    text: '你在书架间穿梭，寻找关于「全元素共鸣」的资料。忽然，你注意到石神葵正坐在角落里，面前摆满了厚重的古籍。',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'focused' },
    ],
    next: 'ch1_daily_choice_001',
  },

  // --- 选择点15：图书馆事件 ---
  {
    id: 'ch1_daily_choice_001',
    type: 'choice',
    chapter: 1,
    text: '你在图书馆遇到了石神葵。你要怎么做？',
    background: 'bg_library',
    choices: [
      {
        id: 'choice_015_a',
        text: '走过去和他打招呼，问问他在研究什么。',
        nextNode: 'ch1_daily_004a',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 5 },
          { type: 'flag', target: 'talked_to_aoi_library', value: true },
        ],
      },
      {
        id: 'choice_015_b',
        text: '在旁边坐下，安静地自己看书。',
        nextNode: 'ch1_daily_004b',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 2 },
        ],
      },
      {
        id: 'choice_015_c',
        text: '去找其他区域的书。',
        nextNode: 'ch1_daily_004c',
        effects: [
          { type: 'flag', target: 'explored_library_alone', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_daily_004a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'protagonist',
    text: '石神同学，你好。你在看什么书呢？',
    emotion: 'friendly',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'surprised' },
    ],
    next: 'ch1_daily_005',
  },
  {
    id: 'ch1_daily_004b',
    type: 'cutscene',
    chapter: 1,
    text: '你在葵旁边的座位坐下，默默地翻开了自己的书。过了好一会儿，葵忽然开口了——',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'neutral' },
    ],
    next: 'ch1_daily_005',
  },
  {
    id: 'ch1_daily_004c',
    type: 'cutscene',
    chapter: 1,
    text: '你走向了图书馆的另一个区域。在禁书区的入口附近，你发现了一本关于「星辰之力」的古籍。正当你想伸手去拿的时候——',
    background: 'bg_library',
    next: 'ch1_daily_006_alt',
  },

  {
    id: 'ch1_daily_005',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……你身上的魔力波动很特别。我一直在研究这种现象。「全元素共鸣」……在炼金术的记载中，这被称作「贤者之证」。据说只有拥有改变世界潜能的人才会拥有这种力量。',
    emotion: 'thoughtful',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'thoughtful' },
    ],
    next: 'ch1_daily_006',
  },
  {
    id: 'ch1_daily_006',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……如果你愿意的话，我可以帮你分析你的魔力特性。作为交换……你能让我研究一下你的「全元素共鸣」现象吗？',
    emotion: 'slightly_embarrassed',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'slightly_embarrassed' },
    ],
    next: 'ch1_daily_choice_002',
  },

  {
    id: 'ch1_daily_006_alt',
    type: 'cutscene',
    chapter: 1,
    text: '一只修长的手从你身后伸出，拿走了那本书。你转身一看——是石神葵。',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'neutral' },
    ],
    next: 'ch1_daily_006',
  },

  // --- 选择点16：是否同意葵的提议 ---
  {
    id: 'ch1_daily_choice_002',
    type: 'choice',
    chapter: 1,
    text: '石神葵提议互相帮助。你要答应吗？',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'slightly_embarrassed' },
    ],
    choices: [
      {
        id: 'choice_016_a',
        text: '「当然可以！互相学习是好事。」',
        nextNode: 'ch1_daily_007a',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 10 },
          { type: 'flag', target: 'aoi_research_partner', value: true },
          { type: 'unlock', target: 'alchemy_lessons', value: true },
        ],
      },
      {
        id: 'choice_016_b',
        text: '「我需要考虑一下……」',
        nextNode: 'ch1_daily_007b',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 3 },
        ],
      },
      {
        id: 'choice_016_c',
        text: '「教授说要我不要随便展示力量……」',
        nextNode: 'ch1_daily_007c',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: -2 },
          { type: 'flag', target: 'declined_aoi', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_daily_007a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……谢谢。你是我见过的第一个愿意让我研究的「全元素共鸣」者。我会用最高标准的保密协议来保护你的隐私的。',
    emotion: 'genuinely_grateful',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'genuinely_grateful' },
    ],
    next: 'ch1_daily_008',
  },
  {
    id: 'ch1_daily_007b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……也好。不急于一时。如果你改变主意了，随时来找我。',
    emotion: 'neutral',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'neutral' },
    ],
    next: 'ch1_daily_008',
  },
  {
    id: 'ch1_daily_007c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……赫利俄斯教授的顾虑有道理。是我唐突了。不过……你需要炼金术方面的帮助时，可以来找我。',
    emotion: 'disappointed',
    background: 'bg_library',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'disappointed' },
    ],
    next: 'ch1_daily_008',
  },

  // --- 食堂场景 ---
  {
    id: 'ch1_daily_008',
    type: 'cutscene',
    chapter: 1,
    text: '傍晚时分，你来到了学院的食堂。巨大的穹顶下方摆满了长桌，各种种族的学生们在这里用餐聊天。空气中飘着美食的香气。',
    background: 'bg_cafeteria',
    bgm: 'bgm_comedy',
    next: 'ch1_daily_008b_soma',
  },
  {
    id: 'ch1_daily_008b_soma',
    type: 'cutscene',
    chapter: 1,
    text: '你刚端起餐盘，肩膀就被重重一拍——差点把汤洒出来。回头一看，一个银灰色短发、左耳戴着雷纹耳钉的少年正咧嘴笑着看你。校服袖子卷到手肘，露出结实的小臂。',
    background: 'bg_cafeteria',
    bgm: 'bgm_comedy',
    next: 'ch1_daily_008c_soma',
  },
  {
    id: 'ch1_daily_008c_soma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kurosaki_soma',
    text: '喂！新来的！你就是那个「未定义属性」的转学生吧？我叫黑崎苍真，和你同班，还住你隔壁宿舍！以后咱就是兄弟了，有什么事尽管找我！',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'kurosaki_soma', position: 'center', emotion: 'happy' },
    ],
    next: 'ch1_daily_008d_soma',
  },
  {
    id: 'ch1_daily_008d_soma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kurosaki_soma',
    text: '来来来，坐这儿！我给你留了位置。我跟你说，你一来就成了学院的红人，大家都在议论你。不过别担心，有我在，谁敢欺负你我电他！——哎，不过你文化课行不行？我期中考试垫底了，需要抱大腿。',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'kurosaki_soma', position: 'center', emotion: 'laughing' },
    ],
    next: 'ch1_daily_choice_soma',
  },
  {
    id: 'ch1_daily_choice_soma',
    type: 'choice',
    chapter: 1,
    text: '苍真一边说一边往你盘子里夹菜，热情得让你有点招架不住。这个自来熟的家伙似乎认定你是朋友了。你——',
    background: 'bg_cafeteria',
    choices: [
      {
        id: 'choice_soma_a',
        text: '爽快答应，「行！文化课我帮你，魔法实战你教我，公平交易！」',
        nextNode: 'ch1_daily_008e_soma',
        effects: [
          { type: 'flag', target: 'soma_friendship', value: true },
        ],
      },
      {
        id: 'choice_soma_b',
        text: '笑着调侃，「垫底还这么理直气壮？行吧，看在你这么热情的份上，勉为其难帮你一次。」',
        nextNode: 'ch1_daily_008e_soma',
        effects: [
          { type: 'flag', target: 'soma_banter', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_008e_soma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kurosaki_soma',
    text: '哈哈哈！爽快！我就喜欢你这性格！对了——（压低声音）前面那桌有两个女生在瞪你，你认识？一个粉色一个紫色，看起来都要打起来了。',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'kurosaki_soma', position: 'center', emotion: 'thinking' },
    ],
    next: 'ch1_daily_009',
  },
  {
    id: 'ch1_daily_009',
    type: 'cutscene',
    chapter: 1,
    text: '你端着餐盘寻找座位，忽然听到一阵骚动——星野樱和天音柚正在激烈地争论着什么。',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'angry' },
      { characterId: 'amane_yuzu', position: 'right', emotion: 'angry' },
    ],
    next: 'ch1_daily_010',
  },
  {
    id: 'ch1_daily_010',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '我说了，火属性才是最强的攻击系！在历史上，火系魔法师赢得的决斗比赛数量是最多的！',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'angry' },
    ],
    next: 'ch1_daily_011',
  },
  {
    id: 'ch1_daily_011',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '可笑！雷属性的攻击力和速度都是火属性无法比拟的。天音家代代都是雷系魔法师，这本身就说明了雷属性的优越性！',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'right', emotion: 'angry' },
    ],
    next: 'ch1_daily_choice_003',
  },

  // --- 选择点17：食堂争论 ---
  {
    id: 'ch1_daily_choice_003',
    type: 'choice',
    chapter: 1,
    text: '樱和柚正在争论火属性和雷属性哪个更强。你要介入吗？',
    background: 'bg_cafeteria',
    choices: [
      {
        id: 'choice_017_a',
        text: '「两个都很强啊，关键看使用者的水平吧？」',
        nextNode: 'ch1_daily_012a',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 2 },
          { type: 'affection', target: 'amane_yuzu', value: 2 },
        ],
      },
      {
        id: 'choice_017_b',
        text: '站在樱这边：「火属性确实很厉害！」',
        nextNode: 'ch1_daily_012b',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 8 },
          { type: 'affection', target: 'amane_yuzu', value: -5 },
        ],
      },
      {
        id: 'choice_017_c',
        text: '站在柚这边：「雷属性速度确实很快！」',
        nextNode: 'ch1_daily_012c',
        effects: [
          { type: 'affection', target: 'amane_yuzu', value: 8 },
          { type: 'affection', target: 'hoshino_sakura', value: -5 },
        ],
      },
      {
        id: 'choice_017_d',
        text: '默默坐下吃自己的饭，不参与争论。',
        nextNode: 'ch1_daily_012d',
        effects: [],
      },
    ],
  },

  {
    id: 'ch1_daily_012a',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '嗯……你说的也有道理啦。但火属性就是更强！',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'reluctant_agree' },
    ],
    next: 'ch1_daily_013',
  },
  {
    id: 'ch1_daily_012b',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '听到没有！连他都这么说了！',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'triumphant' },
    ],
    next: 'ch1_daily_013',
  },
  {
    id: 'ch1_daily_012c',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '哼，总算有一个有眼光的人了。',
    background: 'bg_cafeteria',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'right', emotion: 'pleased' },
    ],
    next: 'ch1_daily_013',
  },
  {
    id: 'ch1_daily_012d',
    type: 'cutscene',
    chapter: 1,
    text: '你默默地找了个角落坐下，一边吃饭一边看她们争论。不知不觉间，你嘴角露出了微笑。这种日常的感觉……真好。',
    background: 'bg_cafeteria',
    next: 'ch1_daily_013',
  },

  // --- 宿舍夜晚 ---
  {
    id: 'ch1_daily_013',
    type: 'cutscene',
    chapter: 1,
    text: '夜幕降临，你回到了自己的宿舍房间。窗外，星光璀璨，学院的夜景美得令人窒息。你坐在窗边，回想着这几天的经历。',
    background: 'bg_dorm_room_night',
    bgm: 'bgm_romance',
    next: 'ch1_daily_choice_004',
  },

  // --- 选择点18：选择课余时间与谁度过 ---
  {
    id: 'ch1_daily_choice_004',
    type: 'choice',
    chapter: 1,
    text: '明天是休息日。你想和谁一起度过？',
    background: 'bg_dorm_room_night',
    choices: [
      {
        id: 'choice_018_a',
        text: '和风间铃一起去校园探险',
        nextNode: 'ch1_daily_014_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 10 },
          { type: 'flag', target: 'date_rin', value: true },
        ],
      },
      {
        id: 'choice_018_b',
        text: '和星野樱一起练习魔法',
        nextNode: 'ch1_daily_014_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 10 },
          { type: 'flag', target: 'date_sakura', value: true },
        ],
      },
      {
        id: 'choice_018_c',
        text: '和白石真白一起在花园散步',
        nextNode: 'ch1_daily_014_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 10 },
          { type: 'flag', target: 'date_mashiro', value: true },
        ],
      },
      {
        id: 'choice_018_d',
        text: '和石神葵一起泡图书馆',
        nextNode: 'ch1_daily_014_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 10 },
          { type: 'flag', target: 'date_aoi', value: true },
        ],
      },
      {
        id: 'choice_018_e',
        text: '独自在宿舍休息',
        nextNode: 'ch1_daily_014_alone',
        effects: [
          { type: 'stat', target: 'rest', value: 10 },
        ],
      },
    ],
  },

  // --- 铃约会场景 ---
  {
    id: 'ch1_daily_014_rin',
    type: 'cutscene',
    chapter: 1,
    text: '第二天一早，铃就兴冲冲地出现在你的宿舍门口，拉着你去探索学院的各个角落。',
    background: 'bg_academy_gate',
    bgm: 'bgm_peaceful_daily',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_daily_015_rin',
  },
  {
    id: 'ch1_daily_015_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '你知道吗？学院里有一个传说——在月圆之夜，如果你站在钟楼的最高处，就能看到精灵的舞蹈！我妈妈说那是真的哦！',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_daily_016_rin',
  },
  {
    id: 'ch1_daily_016_rin',
    type: 'choice',
    chapter: 1,
    text: '铃兴致勃勃地向你讲述各种传说。你——',
    background: 'bg_garden',
    choices: [
      {
        id: 'choice_019_a',
        text: '「好想去看看！下次月圆的时候一起去吧！」',
        nextNode: 'ch1_daily_017_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 5 },
          { type: 'flag', target: 'moonlight_promise', value: true },
        ],
      },
      {
        id: 'choice_019_b',
        text: '「精灵的舞蹈？真的存在吗？」',
        nextNode: 'ch1_daily_017_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '嘻嘻~你是个很好的听众呢。和你在一起很开心！以后我们也要经常一起玩哦！',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'happy' },
    ],
    next: 'ch1_daily_017b_rin',
  },
  {
    id: 'ch1_daily_017b_rin',
    type: 'cutscene',
    chapter: 1,
    text: '铃忽然停下脚步，转过身来面对你。阳光透过树叶的间隙洒在她身上，风之精灵在她发梢间嬉戏。她歪着头看你，眼神中带着一种你从未见过的柔和光芒。',
    background: 'bg_garden',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'gentle' },
    ],
    next: 'ch1_daily_017c_rin',
  },
  {
    id: 'ch1_daily_017c_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '呐……你知道吗？精灵能感知到人心的「颜色」。每个人的心都有不同的颜色——有人的心是冷色的，有人的心是暖色的。而你呢……',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'gentle' },
    ],
    next: 'ch1_daily_017d_rin',
  },
  {
    id: 'ch1_daily_017d_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '你的心，是像阳光一样温暖的金色。我第一次见到你的时候，精灵们就告诉我——这个人的心，是最温暖的颜色。所以……我才忍不住想要靠近你。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_daily_017e_rin',
  },
  {
    id: 'ch1_daily_017e_rin',
    type: 'choice',
    chapter: 1,
    text: '铃难得露出了害羞的表情，耳尖泛起淡淡的粉色。你——',
    background: 'bg_garden',
    choices: [
      {
        id: 'choice_019b_a',
        text: '轻轻揉揉她的头，「我也觉得，靠近你的时候最安心。」',
        nextNode: 'ch1_daily_017f_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 8 },
          { type: 'flag', target: 'rin_heart_color', value: true },
        ],
      },
      {
        id: 'choice_019b_b',
        text: '认真地看着她，「那我以后，能一直让你靠近吗？」',
        nextNode: 'ch1_daily_017f_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 12 },
          { type: 'flag', target: 'rin_heart_promise', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017f_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '呜哇……你、你突然说这种话，我会……我会不知所措的啦！但是……嘻嘻，我好开心。这个约定，你要记住哦——一辈子那种。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'shy_happy' },
    ],
    next: 'ch1_daily_018',
  },

  // --- 樱约会场景 ---
  {
    id: 'ch1_daily_014_sakura',
    type: 'cutscene',
    chapter: 1,
    text: '你和樱一起来到了训练场。她迫不及待地想要展示新学会的火系魔法。',
    background: 'bg_training_ground',
    bgm: 'bgm_peaceful_daily',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'excited' },
    ],
    next: 'ch1_daily_015_sakura',
  },
  {
    id: 'ch1_daily_015_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '看好了！这是我新学会的——「炎凰之舞」！',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'determined' },
    ],
    next: 'ch1_daily_016_sakura',
  },
  {
    id: 'ch1_daily_016_sakura',
    type: 'cutscene',
    chapter: 1,
    text: '樱释放出一团凤凰形态的火焰，绚丽无比。但随后她脚下一滑——眼看就要摔倒！',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'surprised' },
    ],
    next: 'ch1_daily_choice_019',
  },
  {
    id: 'ch1_daily_choice_019',
    type: 'choice',
    chapter: 1,
    text: '樱快要摔倒了！',
    background: 'bg_training_ground',
    choices: [
      {
        id: 'choice_019_c',
        text: '冲上去接住她！',
        nextNode: 'ch1_daily_017_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 10 },
          { type: 'flag', target: 'caught_sakura', value: true },
        ],
      },
      {
        id: 'choice_019_d',
        text: '释放魔法缓冲她的坠落！',
        nextNode: 'ch1_daily_017_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 5 },
          { type: 'stat', target: 'magic_control', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '……谢、谢谢你。啊哈哈，有点丢脸呢……明明是火系天才，连个平衡都保持不好。',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'embarrassed' },
    ],
    next: 'ch1_daily_017b_sakura',
  },
  {
    id: 'ch1_daily_017b_sakura',
    type: 'cutscene',
    chapter: 1,
    text: '你这才意识到，你接住樱的时候，她整个人都倒在你怀里。她的脸近在咫尺，粉色的长发蹭过你的下巴，带着一股淡淡的焦糖香气——那是火系魔法特有的气味。樱也意识到了这个姿势，耳根瞬间变得通红。',
    background: 'bg_training_ground',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_daily_017c_sakura',
  },
  {
    id: 'ch1_daily_017c_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '你、你还抱着我干嘛！快放开啦……不是，我没有说讨厌的意思，只是……心跳好快，会被你听到的！',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'tsundere' },
    ],
    next: 'ch1_daily_017d_sakura',
  },
  {
    id: 'ch1_daily_017d_sakura',
    type: 'choice',
    chapter: 1,
    text: '樱在你怀里挣扎了一下，但并没有真的用力推开。你能感到她身体的温度比常人要高——火系魔法师的体温本就偏热。你——',
    background: 'bg_training_ground',
    choices: [
      {
        id: 'choice_019e_a',
        text: '温柔地扶她站稳，「你的心跳，我确实听到了——和我的心跳一样快。」',
        nextNode: 'ch1_daily_017e_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 10 },
          { type: 'flag', target: 'sakura_heartbeat', value: true },
        ],
      },
      {
        id: 'choice_019e_b',
        text: '帮她理顺凌乱的头发，「下次别逞强了，我会一直在旁边接住你的。」',
        nextNode: 'ch1_daily_017e_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 12 },
          { type: 'flag', target: 'sakura_protect_promise', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017e_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '……笨蛋。谁要你接住啊……但是，如果你坚持的话……我、我也不反对啦。只是……别让别人看到，我会很没面子的！',
    background: 'bg_training_ground',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'shy_happy' },
    ],
    next: 'ch1_daily_018',
  },

  // --- 真白约会场景 ---
  {
    id: 'ch1_daily_014_mashiro',
    type: 'cutscene',
    chapter: 1,
    text: '你和真白漫步在学院的花园中。各色魔法花卉在阳光下绽放，蝴蝶在花丛间飞舞。',
    background: 'bg_garden',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_daily_015_mashiro',
  },
  {
    id: 'ch1_daily_015_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '你知道吗？这些花都是用治愈魔法培育的。每朵花都有不同的治愈效果。比如这朵「月光百合」，它的花香可以缓解焦虑和压力。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'happy' },
    ],
    next: 'ch1_daily_016_mashiro',
  },
  {
    id: 'ch1_daily_016_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '我之所以选择学习治愈魔法，是因为……小时候我体弱多病，是村里的治愈师治好了我。从那以后，我就立志要成为能够帮助他人的治愈魔法师。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'nostalgic' },
    ],
    next: 'ch1_daily_choice_020',
  },
  {
    id: 'ch1_daily_choice_020',
    type: 'choice',
    chapter: 1,
    text: '真白分享了她的过去。你怎么回应？',
    background: 'bg_garden',
    choices: [
      {
        id: 'choice_020_a',
        text: '「你一定可以成为最棒的治愈师的。」',
        nextNode: 'ch1_daily_017_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 8 },
        ],
      },
      {
        id: 'choice_020_b',
        text: '「我也想分享我的故事给你听。」',
        nextNode: 'ch1_daily_017_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 10 },
          { type: 'flag', target: 'shared_past_with_mashiro', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '谢谢你……能遇到你这样的人，来到这个学院真是太好了。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'touched' },
    ],
    next: 'ch1_daily_017b_mashiro',
  },
  {
    id: 'ch1_daily_017b_mashiro',
    type: 'cutscene',
    chapter: 1,
    text: '真白说着，轻轻摘下一朵月光百合，踮起脚尖别在了你的耳畔。她的指尖掠过你的鬓角，带着治愈魔法师特有的温暖。那一刻，花香、她的体温、还有阳光的味道，一起涌入你的感官。',
    background: 'bg_garden',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_daily_017c_mashiro',
  },
  {
    id: 'ch1_daily_017c_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '呵呵，这朵花和你很配呢。你知道吗……月光百合有一个浪漫的传说——如果将它赠予重要的人，两人的缘分就会像花香一样，永远萦绕在彼此身边。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_daily_017d_mashiro',
  },
  {
    id: 'ch1_daily_017d_mashiro',
    type: 'choice',
    chapter: 1,
    text: '真白的声音越来越轻，她的目光落在你胸口的那朵花上，却始终没有抬起来。但你能看到，她白皙的耳廓已经染上了绯色。你——',
    background: 'bg_garden',
    choices: [
      {
        id: 'choice_020c_a',
        text: '轻轻握住她别花的那只手，「那这朵花，我会一直带在身边——连同它主人的一份心意。」',
        nextNode: 'ch1_daily_017e_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 12 },
          { type: 'flag', target: 'mashiro_flower_bond', value: true },
        ],
      },
      {
        id: 'choice_020c_b',
        text: '也摘下一朵花，别在她的发间，「这样，我们就都有花了。缘分，是双向的。」',
        nextNode: 'ch1_daily_017e_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 10 },
          { type: 'flag', target: 'mashiro_mutual_flower', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017e_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '……嗯。我会记住这一刻的——阳光、花香、还有你。以后无论发生什么，只要闻到这朵花的香气，我就会想起今天。谢谢你……让我有了这样珍贵的回忆。',
    background: 'bg_garden',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'tender' },
    ],
    next: 'ch1_daily_018',
  },

  // --- 葵约会场景 ---
  {
    id: 'ch1_daily_014_aoi',
    type: 'cutscene',
    chapter: 1,
    text: '你和葵在图书馆度过了安静的一天。他教你基础的炼金术知识，你们一起做了几个简单的实验。',
    background: 'bg_alchemy_lab',
    bgm: 'bgm_peaceful_daily',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'focused' },
    ],
    next: 'ch1_daily_015_aoi',
  },
  {
    id: 'ch1_daily_015_aoi',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '炼金术的核心原理是「等价交换」。想要获得什么，就必须付出等价的代价。这不仅仅是炼金术的法则，也是这个世界的根本法则之一。',
    background: 'bg_alchemy_lab',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'teaching' },
    ],
    next: 'ch1_daily_016_aoi',
  },
  {
    id: 'ch1_daily_016_aoi',
    type: 'choice',
    chapter: 1,
    text: '葵向你讲解炼金术的基本原理。',
    background: 'bg_alchemy_lab',
    choices: [
      {
        id: 'choice_021_a',
        text: '「等价交换……这和我在原来世界中学到的某些物理定律很像呢。」',
        nextNode: 'ch1_daily_017_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 8 },
          { type: 'flag', target: 'alchemy_insight', value: true },
        ],
      },
      {
        id: 'choice_021_b',
        text: '「听起来好深奥……你能演示一下吗？」',
        nextNode: 'ch1_daily_017_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017_aoi',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……你比我想象中的更有悟性。也许……你不仅仅是「全元素共鸣」者，还有着超越这个时代的理解力。',
    background: 'bg_alchemy_lab',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'impressed' },
    ],
    next: 'ch1_daily_017b_aoi',
  },
  {
    id: 'ch1_daily_017b_aoi',
    type: 'cutscene',
    chapter: 1,
    text: '葵说着，从抽屉里取出一个小小的水晶瓶，里面装着一枚精致的书签——书签的边缘镶嵌着细碎的星辉矿石，在昏暗的炼金工坊里散发着柔和的蓝光。他将它推到你面前，目光却避开了你的眼睛。',
    background: 'bg_alchemy_lab',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'shy' },
    ],
    next: 'ch1_daily_017c_aoi',
  },
  {
    id: 'ch1_daily_017c_aoi',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……这个，给你。是我用炼金术做的——星辉矿石能稳定魔力，对你这种全元素使用者会有帮助。……别误会，只是顺手做的，不是什么特别的礼物。',
    background: 'bg_alchemy_lab',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'tsundere' },
    ],
    next: 'ch1_daily_017d_aoi',
  },
  {
    id: 'ch1_daily_017d_aoi',
    type: 'choice',
    chapter: 1,
    text: '葵的语气一如既往地冷淡，但你注意到，他放在桌下的手在微微攥紧——那是他紧张时的小动作。星辉矿石的书签在两人之间静静发光。你——',
    background: 'bg_alchemy_lab',
    choices: [
      {
        id: 'choice_021c_a',
        text: '接过书签，认真地说，「谢谢你，葵。这是我收到的最用心的礼物——我会珍惜的。」',
        nextNode: 'ch1_daily_017e_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 10 },
          { type: 'flag', target: 'aoi_bookmark_gift', value: true },
        ],
      },
      {
        id: 'choice_021c_b',
        text: '微笑着看他，「顺手做的？那这星辉矿石也是顺手捡的？我知道你的心意的，葵。」',
        nextNode: 'ch1_daily_017e_aoi',
        effects: [
          { type: 'affection', target: 'ishigami_aoi', value: 12 },
          { type: 'flag', target: 'aoi_understood', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017e_aoi',
    type: 'dialogue',
    chapter: 1,
    speaker: 'ishigami_aoi',
    text: '……随你怎么说。总之，收着就是了。……以后有什么不懂的炼金术问题，可以来找我。我……我会一直在工坊的。',
    background: 'bg_alchemy_lab',
    characterSprites: [
      { characterId: 'ishigami_aoi', position: 'center', emotion: 'shy_happy' },
    ],
    next: 'ch1_daily_018',
  },

  // --- 独自休息场景 ---
  {
    id: 'ch1_daily_014_alone',
    type: 'cutscene',
    chapter: 1,
    text: '你选择在宿舍休息了一天。看了些书，整理了笔记，傍晚时分来到屋顶看夕阳。虽然有些寂寞，但也获得了难得的平静。',
    background: 'bg_rooftop',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_015b_yuma',
  },

  // --- 白鸟悠马登场：学生会办公室 ---
  {
    id: 'ch1_daily_015b_yuma',
    type: 'cutscene',
    chapter: 1,
    text: '夕阳西沉时，你被学生会的一封信叫到了办公室。推门进去，一个戴银边眼镜、淡蓝色长发束在脑后的少年正端坐在堆满文件的桌前，优雅地翻动账本。他抬起头，露出恰到好处的微笑。',
    background: 'bg_corridor',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_015c_yuma',
  },
  {
    id: 'ch1_daily_015c_yuma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiratori_yuma',
    text: '你好，转学生同学。我是白鸟悠马，学生会会计。月岛副会长让我转告你——你的入学手续还有几份文件需要补签。另外……（推了推眼镜）作为好奇者，我想亲眼看看让整个学院议论纷纷的「未定义属性」先生是什么样的人。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'shiratori_yuma', position: 'center', emotion: 'slight_smile' },
    ],
    next: 'ch1_daily_015d_yuma',
  },
  {
    id: 'ch1_daily_015d_yuma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiratori_yuma',
    text: '果然，从你的眼神里能看出一些不寻常的东西。……我提醒你一句，朋友：月岛凛是我最敬重的人。她背负的东西比你想象的多得多。如果你只是抱着玩闹的心态接近她——（微笑不变，但语气冷了下来）——我会让你后悔的。当然，如果你是真心的，那我们也许能成为朋友。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'shiratori_yuma', position: 'center', emotion: 'cold_stare' },
    ],
    next: 'ch1_daily_choice_yuma',
  },
  {
    id: 'ch1_daily_choice_yuma',
    type: 'choice',
    chapter: 1,
    text: '白鸟悠马的微笑从未消失，但你清楚地感受到了话语中的锋芒。这个看似温文尔雅的人，实际上是凛的守护者。你——',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_yuma_a',
        text: '认真地回应，「我对凛是真心的。她背负的东西，我愿意和她一起承担。」',
        nextNode: 'ch1_daily_015e_yuma',
        effects: [
          { type: 'flag', target: 'yuma_approval', value: true },
          { type: 'affection', target: 'kishima_rin', value: 5 },
        ],
      },
      {
        id: 'choice_yuma_b',
        text: '不卑不亢，「谢谢你的提醒。但我和凛之间的事，由我们自己决定。」',
        nextNode: 'ch1_daily_015e_yuma',
        effects: [
          { type: 'flag', target: 'yuma_respect', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_015e_yuma',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiratori_yuma',
    text: '……呵，有意思。敢在我面前这样说话的人，你已经第三个了——前两个一个是副会长本人，一个是赫利俄斯院长。好吧，文件在这里，签完就可以走了。……我不讨厌你，转学生。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'shiratori_yuma', position: 'center', emotion: 'rare_smile' },
    ],
    next: 'ch1_daily_016b_enomori',
  },

  // --- 炎守严登场：风纪巡逻 ---
  {
    id: 'ch1_daily_016b_enomori',
    type: 'cutscene',
    chapter: 1,
    text: '签完文件离开学生会办公室，你在走廊上差点撞上一个高大的身影。那是一个三年级的前辈——棕黑色钢针短发，眉骨上一道伤疤，眼神锐利如鹰。他胸前佩戴着风纪委员长的徽章，正抱着手臂靠在墙边。',
    background: 'bg_corridor',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_016c_enomori',
  },
  {
    id: 'ch1_daily_016c_enomori',
    type: 'dialogue',
    chapter: 1,
    speaker: 'enomori',
    text: '一年级新生？……是你。我看过你的档案，「未定义属性」转学生。我是风纪委员长炎守严。给你个忠告——学院祭将近，别因为一时兴起违反校规。最近的宵禁时间提前到了晚上九点，夜间禁止进入禁区。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'enomori', position: 'center', emotion: 'serious' },
    ],
    next: 'ch1_daily_016d_enomori',
  },
  {
    id: 'ch1_daily_016d_enomori',
    type: 'dialogue',
    chapter: 1,
    speaker: 'enomori',
    text: '……另外，我听说你前几天和几位女同学去了后花园。那里夜晚有暗影能量的残余，虽然浓度很低，但不是你们该去的地方。下次去任何可疑地点之前，先向风纪委员会报备。这不是刁难，是保护。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'enomori', position: 'center', emotion: 'concerned' },
    ],
    next: 'ch1_daily_choice_enomori',
  },
  {
    id: 'ch1_daily_choice_enomori',
    type: 'choice',
    chapter: 1,
    text: '炎守严的表情严厉，但「保护」两个字说得很认真。你隐约觉得，这个被称为「铁壁」的前辈，并不是表面上那么不近人情。你——',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_enomori_a',
        text: '郑重鞠躬，「明白了，炎守前辈。以后我们会注意的，谢谢您的提醒。」',
        nextNode: 'ch1_daily_016e_enomori',
        effects: [
          { type: 'flag', target: 'enomori_respect', value: true },
        ],
      },
      {
        id: 'choice_enomori_b',
        text: '好奇地问，「前辈的伤疤……是为了保护别人受的吗？」',
        nextNode: 'ch1_daily_016e_enomori',
        effects: [
          { type: 'flag', target: 'enomori_trust', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_016e_enomori',
    type: 'dialogue',
    chapter: 1,
    speaker: 'enomori',
    text: '……（沉默片刻）……是为了保护一个重要的人。那次我没能保护住他，所以这道疤是教训，也是誓言。……你眼神不错，转学生。回去吧，路上小心。——还有，叫我炎守委员长就行，「前辈」什么的，太生分。',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'enomori', position: 'center', emotion: 'rare_smile' },
    ],
    next: 'ch1_daily_017b_sakura_ambush',
  },

  // --- 樱的夜间 ambush 暧昧场景 ---
  {
    id: 'ch1_daily_017b_sakura_ambush',
    type: 'cutscene',
    chapter: 1,
    text: '告别炎守严后，你往宿舍方向走去。夜色已深，走廊上空无一人。突然，一个粉色的身影从拐角处窜了出来，一把拽住了你的袖子——是樱，她看起来跑得很急，脸颊绯红，胸口起伏。',
    background: 'bg_corridor',
    bgm: 'bgm_romance',
    next: 'ch1_daily_017c_sakura_ambush',
  },
  {
    id: 'ch1_daily_017c_sakura_ambush',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '你、你跑哪去了！我找了你好久！那个白鸟悠马是不是找你麻烦了？我告诉你，他那个人看起来笑眯眯的，其实超坏的！你、你别被他吓到了！',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'worried' },
    ],
    next: 'ch1_daily_017d_sakura_ambush',
  },
  {
    id: 'ch1_daily_017d_sakura_ambush',
    type: 'cutscene',
    chapter: 1,
    text: '樱一口气说完，才意识到自己拽着你的袖子离你很近。她猛地松开手，脸更红了，但脚步却没有后退——只是把头偏向一边，假装看墙上的画。走廊尽头的月光照进来，将她的粉色长发染成银白。',
    background: 'bg_corridor',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_daily_choice_sakura_ambush',
  },
  {
    id: 'ch1_daily_choice_sakura_ambush',
    type: 'choice',
    chapter: 1,
    text: '走廊里只有你们两人，月光和樱的呼吸声清晰可闻。她明明是来「保护」你的，此刻却比你还紧张。你——',
    background: 'bg_corridor',
    choices: [
      {
        id: 'choice_sakura_ambush_a',
        text: '轻笑，「原来你是在担心我啊。谢谢你，樱——有你在真好。」',
        nextNode: 'ch1_daily_017e_sakura_ambush',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 10 },
          { type: 'flag', target: 'sakura_night_ambush', value: true },
        ],
      },
      {
        id: 'choice_sakura_ambush_b',
        text: '伸手揉揉她的头，「我没事的。倒是你，这么晚一个人跑出来，我送你回宿舍吧。」',
        nextNode: 'ch1_daily_017e_sakura_ambush',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 12 },
          { type: 'flag', target: 'sakura_walk_back', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_daily_017e_sakura_ambush',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '……哼！谁、谁担心你了！我只是……只是路过而已！……好吧，既然你都这么说了，那我就勉强让你送一下吧。但是不许笑我！还有——不许告诉任何人今晚的事，听到没！',
    background: 'bg_corridor',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'tsundere' },
    ],
    next: 'ch1_daily_018',
  },

  // --- 日常场景汇合 ---
  {
    id: 'ch1_daily_018',
    type: 'cutscene',
    chapter: 1,
    text: '一天的时光飞逝。傍晚时分，你在宿舍门口收到了一封信——学院祭的通知。每个班级都要准备一个节目，作为班级代表，你被推举为班级节目的负责人。',
    background: 'bg_dorm_room',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'festival_preparation', value: true }],
    next: 'ch1_daily_choice_005',
  },

  // --- 选择点22：班级节目选择 ---
  {
    id: 'ch1_daily_choice_005',
    type: 'choice',
    chapter: 1,
    text: '作为班级负责人，你要决定班级在学院祭上表演什么节目。',
    background: 'bg_dorm_room',
    choices: [
      {
        id: 'choice_022_a',
        text: '魔法舞台剧',
        nextNode: 'ch1_daily_019_play',
        effects: [
          { type: 'flag', target: 'class_activity_play', value: true },
          { type: 'affection', target: 'kazane_rin', value: 5 },
        ],
      },
      {
        id: 'choice_022_b',
        text: '魔法竞技展示',
        nextNode: 'ch1_daily_019_arena',
        effects: [
          { type: 'flag', target: 'class_activity_arena', value: true },
          { type: 'affection', target: 'hoshino_sakura', value: 5 },
          { type: 'affection', target: 'amane_yuzu', value: 5 },
        ],
      },
      {
        id: 'choice_022_c',
        text: '炼金术展览',
        nextNode: 'ch1_daily_019_alchemy',
        effects: [
          { type: 'flag', target: 'class_activity_alchemy', value: true },
          { type: 'affection', target: 'ishigami_aoi', value: 5 },
        ],
      },
      {
        id: 'choice_022_d',
        text: '治愈魔法义诊',
        nextNode: 'ch1_daily_019_healing',
        effects: [
          { type: 'flag', target: 'class_activity_healing', value: true },
          { type: 'affection', target: 'shiraishi_mashiro', value: 5 },
        ],
      },
    ],
  },

  // 舞台剧
  {
    id: 'ch1_daily_019_play',
    type: 'cutscene',
    chapter: 1,
    text: '你决定排练一出魔法舞台剧，重现初代学院长的传说故事。同学们对这个创意反响热烈，大家热情高涨地投入了排练。',
    background: 'bg_classroom',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_020',
  },
  // 竞技
  {
    id: 'ch1_daily_019_arena',
    type: 'cutscene',
    chapter: 1,
    text: '你决定组织一场魔法竞技展示。樱和柚终于找到了一个正当理由来一决高下，两人都跃跃欲试。',
    background: 'bg_arena',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_020',
  },
  // 炼金展
  {
    id: 'ch1_daily_019_alchemy',
    type: 'cutscene',
    chapter: 1,
    text: '你决定举办炼金术展览。葵主动承担了主要的展览内容策划，展出了许多令人惊叹的炼金术成品。',
    background: 'bg_alchemy_lab',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_020',
  },
  // 义诊
  {
    id: 'ch1_daily_019_healing',
    type: 'cutscene',
    chapter: 1,
    text: '你决定举办治愈魔法义诊活动。真白非常感动，和其他治愈系同学一起为大家提供免费的治愈服务。',
    background: 'bg_garden',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_020',
  },

  // --- 准备期间的小事件 ---
  {
    id: 'ch1_daily_020',
    type: 'cutscene',
    chapter: 1,
    text: '在准备学院祭的过程中，你和同学们的关系越来越亲密。大家一起熬夜排练、一起讨论方案、一起分享零食。这种温暖的羁绊让你感到了前所未有的归属感。',
    background: 'bg_classroom_evening',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_daily_choice_006',
  },

  // --- 选择点23：好感度事件 ---
  {
    id: 'ch1_daily_choice_006',
    type: 'choice',
    chapter: 1,
    text: '在准备期间的深夜，有人来敲你的宿舍门。打开门一看——',
    background: 'bg_dorm_room_night',
    choices: [
      {
        id: 'choice_023_a',
        text: '是铃，她带着宵夜来看你',
        nextNode: 'ch1_daily_021_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 5 },
        ],
      },
      {
        id: 'choice_023_b',
        text: '是樱，她想要一起练习台词',
        nextNode: 'ch1_daily_021_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 5 },
        ],
      },
      {
        id: 'choice_023_c',
        text: '是凛，她来检查筹备进度',
        nextNode: 'ch1_daily_021_rin2',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 5 },
        ],
      },
    ],
  },

  {
    id: 'ch1_daily_021_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '夜宵时间~嘻嘻，看你房间灯还亮着，就猜你还没睡。来，这是我特制的精灵茶点，吃了保证精神百倍！',
    background: 'bg_dorm_room_night',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'caring' },
    ],
    next: 'ch1_daily_choice_007',
  },
  {
    id: 'ch1_daily_021_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '嘿！睡不着，台词怎么都记不住……你能不能陪我练练？拜托了！',
    background: 'bg_dorm_room_night',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'pleading' },
    ],
    next: 'ch1_daily_choice_007',
  },
  {
    id: 'ch1_daily_021_rin2',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……我知道这个时间来打扰不太合适。但学生会有规定，筹备期间需要定期检查进度。……顺便，这个给你，夜深了注意保暖。',
    background: 'bg_dorm_room_night',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'slightly_warm' },
    ],
    next: 'ch1_daily_choice_007',
  },

  // --- 选择点24：深夜对话 ---
  {
    id: 'ch1_daily_choice_007',
    type: 'choice',
    chapter: 1,
    text: '深夜的宁静时光中，你要和对方聊些什么？',
    background: 'bg_dorm_room_night',
    choices: [
      {
        id: 'choice_024_a',
        text: '聊关于你来到这个世界之前的生活',
        nextNode: 'ch1_daily_022',
        effects: [
          { type: 'stat', target: 'bonding', value: 5 },
          { type: 'flag', target: 'shared_past', value: true },
        ],
      },
      {
        id: 'choice_024_b',
        text: '聊关于学院和魔法的未来',
        nextNode: 'ch1_daily_022',
        effects: [
          { type: 'stat', target: 'bonding', value: 3 },
        ],
      },
      {
        id: 'choice_024_c',
        text: '聊关于各自的梦想和目标',
        nextNode: 'ch1_daily_022',
        effects: [
          { type: 'stat', target: 'bonding', value: 4 },
          { type: 'flag', target: 'shared_dreams', value: true },
        ],
      },
    ],
  },

  {
    id: 'ch1_daily_022',
    type: 'cutscene',
    chapter: 1,
    text: '不知不觉间，天边已经泛起了鱼肚白。你们在星光和晨光的交替中度过了一个难忘的夜晚。这段记忆，将成为你们羁绊的基石。\n\n——日常与羁绊 完——',
    background: 'bg_dormitory',
    bgm: 'bgm_peaceful_daily',
    effects: [{ type: 'flag', target: 'chapter1_daily_complete', value: true }],
    next: 'ch1_daily_extra_001',
  },

  // --- 日常额外选择点 ---
  {
    id: 'ch1_daily_extra_001',
    type: 'choice',
    chapter: 1,
    text: '学院祭前一天，大家都在紧张地做最后的准备。你发现了一件小事需要决定——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_de001_a', text: '帮同学们搬运道具。', nextNode: 'ch1_daily_extra_002', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'affection', target: 'hoshino_sakura', value: 2 }] },
      { id: 'choice_de001_b', text: '检查舞台的安全性。', nextNode: 'ch1_daily_extra_002', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'checked_stage_safety', value: true }] },
      { id: 'choice_de001_c', text: '去各个摊位看看其他班的准备情况。', nextNode: 'ch1_daily_extra_002', effects: [{ type: 'flag', target: 'scouted_other_classes', value: true }] },
    ],
  },
  {
    id: 'ch1_daily_extra_002',
    type: 'choice',
    chapter: 1,
    text: '午休时间，石神葵悄悄找到你，递给你一个小瓶子。他说这是他特制的「魔力增幅药水」，在紧急时刻可以使用。你要——',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_de002_a', text: '感激地收下。', nextNode: 'ch1_daily_extra_003', effects: [{ type: 'item', target: 'power_boost_potion', value: 1 }, { type: 'affection', target: 'ishigami_aoi', value: 5 }] },
      { id: 'choice_de002_b', text: '问他这药水的原理。', nextNode: 'ch1_daily_extra_003', effects: [{ type: 'item', target: 'power_boost_potion', value: 1 }, { type: 'affection', target: 'ishigami_aoi', value: 3 }, { type: 'stat', target: 'intelligence', value: 2 }] },
      { id: 'choice_de002_c', text: '犹豫是否应该接受。', nextNode: 'ch1_daily_extra_003', effects: [{ type: 'item', target: 'power_boost_potion', value: 1 }, { type: 'affection', target: 'ishigami_aoi', value: 1 }] },
    ],
  },
  {
    id: 'ch1_daily_extra_003',
    type: 'choice',
    chapter: 1,
    text: '下午，月岛凛来检查进度时，破天荒地夸奖了你们班的准备工作。她难得地露出了一丝微笑。你觉得——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_de003_a', text: '「凛同学笑起来很好看呢。」', nextNode: 'ch1_daily_extra_004', effects: [{ type: 'affection', target: 'kishima_rin', value: 8 }, { type: 'flag', target: 'complimented_rin', value: true }] },
      { id: 'choice_de003_b', text: '「谢谢夸奖，大家都很努力。」', nextNode: 'ch1_daily_extra_004', effects: [{ type: 'affection', target: 'kishima_rin', value: 3 }] },
      { id: 'choice_de003_c', text: '有些惊讶地看着她。', nextNode: 'ch1_daily_extra_004', effects: [{ type: 'affection', target: 'kishima_rin', value: 2 }] },
    ],
  },
  {
    id: 'ch1_daily_extra_004',
    type: 'choice',
    chapter: 1,
    text: '傍晚，真白来找你，说想在祭典前一起去看花园里的「星见之花」——据说这种花只在学院祭前夕绽放。你——',
    background: 'bg_garden',
    choices: [
      { id: 'choice_de004_a', text: '「好啊，一起去吧！」', nextNode: 'ch1_daily_extra_005', effects: [{ type: 'affection', target: 'shiraishi_mashiro', value: 8 }, { type: 'flag', target: 'saw_star_flower', value: true }] },
      { id: 'choice_de004_b', text: '「能叫上其他同学一起去吗？」', nextNode: 'ch1_daily_extra_005', effects: [{ type: 'affection', target: 'shiraishi_mashiro', value: 3 }, { type: 'flag', target: 'group_star_flower', value: true }] },
    ],
  },
  {
    id: 'ch1_daily_extra_005',
    type: 'choice',
    chapter: 1,
    text: '站在花园中，美丽的星见之花在月光下缓缓绽放。花瓣上闪烁着如同星辰般的光芒。这一刻——',
    background: 'bg_starry_sky',
    choices: [
      { id: 'choice_de005_a', text: '静静欣赏这美丽的景象。', nextNode: 'ch1_daily_extra_006', effects: [{ type: 'stat', target: 'empathy', value: 3 }] },
      { id: 'choice_de005_b', text: '尝试用魔力与花朵产生共鸣。', nextNode: 'ch1_daily_extra_006', effects: [{ type: 'stat', target: 'magic_control', value: 3 }, { type: 'flag', target: 'resonated_with_flower', value: true }] },
      { id: 'choice_de005_c', text: '摘一朵花带回去做纪念。', nextNode: 'ch1_daily_extra_006', effects: [{ type: 'item', target: 'star_flower', value: 1 }] },
    ],
  },
  {
    id: 'ch1_daily_extra_006',
    type: 'choice',
    chapter: 1,
    text: '回到宿舍，你收到了所有同学发来的学院祭邀请。明天会是很热闹的一天。你最后检查了一下——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_de006_a', text: '确认明天的日程安排。', nextNode: 'ch1_daily_extra_007', effects: [{ type: 'flag', target: 'confirmed_schedule', value: true }, { type: 'stat', target: 'intelligence', value: 2 }] },
      { id: 'choice_de006_b', text: '准备好要送给朋友们的小礼物。', nextNode: 'ch1_daily_extra_007', effects: [{ type: 'flag', target: 'prepared_gifts', value: true }, { type: 'stat', target: 'empathy', value: 2 }] },
      { id: 'choice_de006_c', text: '什么都不想，期待明天的到来。', nextNode: 'ch1_daily_extra_007', effects: [{ type: 'flag', target: 'excited_for_festival', value: true }] },
    ],
  },
  {
    id: 'ch1_daily_extra_007',
    type: 'choice',
    chapter: 1,
    text: '入睡前，你突然意识到——来到这个学院已经两周了。你最大的收获是——',
    background: 'bg_dorm_room_night',
    choices: [
      { id: 'choice_de007_a', text: '学会了基础的魔法。', nextNode: 'ch1_festival_001', effects: [{ type: 'stat', target: 'magic_control', value: 3 }] },
      { id: 'choice_de007_b', text: '结交了一群好朋友。', nextNode: 'ch1_festival_001', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'flag', target: 'valued_friendship', value: true }] },
      { id: 'choice_de007_c', text: '找到了属于自己的力量。', nextNode: 'ch1_festival_001', effects: [{ type: 'stat', target: 'courage', value: 3 }, { type: 'flag', target: 'found_own_strength', value: true }] },
    ],
  },

  // ============================================================
  // PART 5: 第一章终幕 - 学院祭 (Chapter 1 Finale - Academy Festival)
  // ============================================================

  // --- 学院祭开幕 ---
  {
    id: 'ch1_festival_001',
    type: 'cutscene',
    chapter: 1,
    text: '终于，学院祭的日子到来了。整个校园被装饰得如同童话世界——彩旗飘扬，灯笼高挂，各处都是热闹的摊位和表演。空气中弥漫着各种美食的香气和欢笑声。',
    background: 'bg_festival_day',
    bgm: 'bgm_festival',
    effects: [{ type: 'flag', target: 'festival_started', value: true }],
    next: 'ch1_festival_002',
  },
  {
    id: 'ch1_festival_002',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '学院祭开始啦！！！今天是一年中最快乐的日子！快快快，我们去逛摊位！',
    background: 'bg_festival_day',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'ecstatic' },
    ],
    next: 'ch1_festival_003',
  },
  {
    id: 'ch1_festival_003',
    type: 'cutscene',
    chapter: 1,
    text: '你和同学们一起在祭典上尽情游玩。有射击摊位、占卜屋、魔法甜品店、召唤兽互动区……每一个角落都充满了惊喜。',
    background: 'bg_festival_day',
    bgm: 'bgm_festival',
    next: 'ch1_festival_choice_001',
  },

  // --- 选择点25：参加哪个祭典活动 ---
  {
    id: 'ch1_festival_choice_001',
    type: 'choice',
    chapter: 1,
    text: '学院祭上有各种各样的活动。你首先想参加哪个？',
    background: 'bg_festival_day',
    choices: [
      {
        id: 'choice_025_a',
        text: '魔法射击游戏',
        nextNode: 'ch1_festival_004_shooting',
        effects: [
          { type: 'flag', target: 'festival_shooting', value: true },
          { type: 'stat', target: 'magic_control', value: 3 },
        ],
      },
      {
        id: 'choice_025_b',
        text: '命运占卜屋',
        nextNode: 'ch1_festival_004_fortune',
        effects: [
          { type: 'flag', target: 'festival_fortune', value: true },
        ],
      },
      {
        id: 'choice_025_c',
        text: '魔法甜品大赛',
        nextNode: 'ch1_festival_004_sweets',
        effects: [
          { type: 'flag', target: 'festival_sweets', value: true },
        ],
      },
      {
        id: 'choice_025_d',
        text: '召唤兽互动区',
        nextNode: 'ch1_festival_004_summon',
        effects: [
          { type: 'flag', target: 'festival_summon', value: true },
          { type: 'stat', target: 'empathy', value: 3 },
        ],
      },
    ],
  },

  // 射击游戏
  {
    id: 'ch1_festival_004_shooting',
    type: 'cutscene',
    chapter: 1,
    text: '你来到了魔法射击游戏的摊位。目标是用魔法击中移动的靶子。天音柚已经在这里了，她完美地击中了每一个靶子，正在得意洋洋地炫耀。',
    background: 'bg_festival_day',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'center', emotion: 'smug' },
    ],
    next: 'ch1_festival_005_activity',
  },
  // 占卜屋
  {
    id: 'ch1_festival_004_fortune',
    type: 'cutscene',
    chapter: 1,
    text: '你走进了命运占卜屋。昏暗的灯光中，一个神秘的水晶球散发着柔和的光芒。占卜师是一位看起来很年轻的女性，但她的眼神深邃得让人不敢直视。',
    background: 'bg_shrine',
    bgm: 'bgm_mysterious',
    next: 'ch1_festival_005_activity',
  },
  // 甜品大赛
  {
    id: 'ch1_festival_004_sweets',
    type: 'cutscene',
    chapter: 1,
    text: '你来到了魔法甜品大赛的现场。参赛者需要用魔法来制作甜品。白石真白也在参赛，她正在用治愈系魔法制作一款据说能治愈心灵创伤的蛋糕。',
    background: 'bg_festival_day',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'focused' },
    ],
    next: 'ch1_festival_005_activity',
  },
  // 召唤兽
  {
    id: 'ch1_festival_004_summon',
    type: 'cutscene',
    chapter: 1,
    text: '你来到了召唤兽互动区。各种各样的魔法生物在这里与学生们互动。一只小小的光精灵飞到了你的肩膀上，亲昵地蹭着你的脸。',
    background: 'bg_festival_day',
    next: 'ch1_festival_005_activity',
  },

  // 活动结束汇合
  {
    id: 'ch1_festival_005_activity',
    type: 'cutscene',
    chapter: 1,
    text: '上午的活动时间飞快地过去了。到了下午，各班级的节目开始了。',
    background: 'bg_festival_day',
    bgm: 'bgm_festival',
    next: 'ch1_festival_extra_001',
  },

  // --- 学院祭额外选择点 ---
  {
    id: 'ch1_festival_extra_001',
    type: 'choice',
    chapter: 1,
    text: '上午的活动中，你遇到了一些有趣的事情。你注意到了——',
    background: 'bg_festival_day',
    choices: [
      { id: 'choice_fea001_a', text: '一个神秘的占卜师在注视着你。', nextNode: 'ch1_festival_extra_002', effects: [{ type: 'flag', target: 'noticed_fortune_teller', value: true }] },
      { id: 'choice_fea001_b', text: '铃在某个摊位前兴奋地向你招手。', nextNode: 'ch1_festival_extra_002', effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }] },
      { id: 'choice_fea001_c', text: '石神葵独自坐在角落里研究什么。', nextNode: 'ch1_festival_extra_002', effects: [{ type: 'affection', target: 'ishigami_aoi', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_extra_002',
    type: 'choice',
    chapter: 1,
    text: '你买了一些学院祭限定的魔法零食。味道出乎意料的好。你决定——',
    background: 'bg_festival_day',
    choices: [
      { id: 'choice_fea002_a', text: '多买一些分给朋友们。', nextNode: 'ch1_festival_extra_003', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'flag', target: 'shared_snacks', value: true }] },
      { id: 'choice_fea002_b', text: '尝试每一种口味。', nextNode: 'ch1_festival_extra_003', effects: [{ type: 'flag', target: 'tried_all_flavors', value: true }] },
      { id: 'choice_fea002_c', text: '留一些带回去给还没来的朋友。', nextNode: 'ch1_festival_extra_003', effects: [{ type: 'flag', target: 'saved_snacks', value: true }, { type: 'stat', target: 'empathy', value: 2 }] },
    ],
  },
  {
    id: 'ch1_festival_extra_003',
    type: 'choice',
    chapter: 1,
    text: '一个低年级的学生不小心撞到了你，手中的冰淇淋弄脏了你的衣服。他非常害怕地道歉。你——',
    background: 'bg_festival_day',
    choices: [
      { id: 'choice_fea003_a', text: '微笑着说「没关系，今天是开心的日子嘛！」', nextNode: 'ch1_festival_extra_004', effects: [{ type: 'stat', target: 'empathy', value: 5 }, { type: 'flag', target: 'forgave_student', value: true }] },
      { id: 'choice_fea003_b', text: '用魔法清洁了衣服，然后安慰他。', nextNode: 'ch1_festival_extra_004', effects: [{ type: 'stat', target: 'magic_control', value: 2 }, { type: 'stat', target: 'empathy', value: 3 }] },
      { id: 'choice_fea003_c', text: '让他带你去冰淇淋摊，请你吃一个作为补偿。', nextNode: 'ch1_festival_extra_004', effects: [{ type: 'flag', target: 'got_free_icecream', value: true }] },
    ],
  },
  {
    id: 'ch1_festival_extra_004',
    type: 'choice',
    chapter: 1,
    text: '班级节目马上就要开始了。后台一片忙碌。你最后检查了一下——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_fea004_a', text: '鼓励紧张的同学们。', nextNode: 'ch1_festival_extra_005', effects: [{ type: 'stat', target: 'leadership', value: 3 }, { type: 'flag', target: 'encouraged_classmates', value: true }] },
      { id: 'choice_fea004_b', text: '确认每个环节的流程。', nextNode: 'ch1_festival_extra_005', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'verified流程', value: true }] },
      { id: 'choice_fea004_c', text: '给自己打气，深呼吸。', nextNode: 'ch1_festival_extra_005', effects: [{ type: 'stat', target: 'courage', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_extra_005',
    type: 'choice',
    chapter: 1,
    text: '节目结束后，观众的掌声经久不息。在后台，所有人都在欢呼庆祝。此时你想——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_fea005_a', text: '和所有人一起拥抱庆祝。', nextNode: 'ch1_festival_006', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'flag', target: 'celebrated_with_all', value: true }] },
      { id: 'choice_fea005_b', text: '悄悄离开，去天台透透气。', nextNode: 'ch1_festival_006', effects: [{ type: 'flag', target: 'quiet_reflection', value: true }] },
      { id: 'choice_fea005_c', text: '向一直支持你的同学们道谢。', nextNode: 'ch1_festival_006', effects: [{ type: 'affection', target: 'hoshino_sakura', value: 3 }, { type: 'affection', target: 'shiraishi_mashiro', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_006',
    type: 'cutscene',
    chapter: 1,
    text: '你和同学们的班级节目获得了巨大的成功！观众们掌声雷动，大家的脸上都洋溢着自豪和喜悦。',
    background: 'bg_festival_day',
    bgm: 'bgm_festival',
    next: 'ch1_festival_007',
  },
  {
    id: 'ch1_festival_007',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '太棒了！！我们做到了！！你作为负责人做得真好！',
    background: 'bg_festival_day',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'ecstatic' },
    ],
    next: 'ch1_festival_008',
  },
  {
    id: 'ch1_festival_008',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……作为学生会副会长，我承认你们班的节目水准很高。不错。',
    background: 'bg_festival_day',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'right', emotion: 'approving' },
    ],
    next: 'ch1_festival_009',
  },

  // --- 黄昏时分 ---
  {
    id: 'ch1_festival_009',
    type: 'cutscene',
    chapter: 1,
    text: '随着夕阳西下，学院祭进入了最高潮——「星辉之夜」。整个学院被无数发光的灯笼和魔法光球点缀得如同星空一般璀璨。学生们三三两两地聚在一起，享受着这美好的夜晚。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    next: 'ch1_festival_choice_002',
  },

  // --- 选择点26：星辉之夜与谁共度 ---
  {
    id: 'ch1_festival_choice_002',
    type: 'choice',
    chapter: 1,
    text: '「星辉之夜」开始了。在这个特别的夜晚，你想和谁一起度过？',
    background: 'bg_festival_night',
    choices: [
      {
        id: 'choice_026_a',
        text: '和风间铃一起逛夜市',
        nextNode: 'ch1_festival_010_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 10 },
          { type: 'flag', target: 'starry_night_rin', value: true },
        ],
      },
      {
        id: 'choice_026_b',
        text: '和星野樱一起看烟火',
        nextNode: 'ch1_festival_010_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 10 },
          { type: 'flag', target: 'starry_night_sakura', value: true },
        ],
      },
      {
        id: 'choice_026_c',
        text: '和白石真白在花园散步',
        nextNode: 'ch1_festival_010_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 10 },
          { type: 'flag', target: 'starry_night_mashiro', value: true },
        ],
      },
      {
        id: 'choice_026_d',
        text: '和月岛凛在钟楼看夜景',
        nextNode: 'ch1_festival_010_kishima',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 10 },
          { type: 'flag', target: 'starry_night_kishima', value: true },
        ],
      },
      {
        id: 'choice_026_e',
        text: '独自去寻找之前占卜师说的「命运之所」',
        nextNode: 'ch1_festival_010_alone',
        effects: [
          { type: 'flag', target: 'starry_night_alone', value: true },
        ],
      },
    ],
  },

  // --- 铃的星辉之夜 ---
  {
    id: 'ch1_festival_010_rin',
    type: 'cutscene',
    chapter: 1,
    text: '你和铃手牵手穿梭在热闹的夜市中。铃的精灵耳朵在灯光下微微发光，她兴奋地拉着你尝试各种小吃和游戏。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'ecstatic' },
    ],
    next: 'ch1_festival_011_rin',
  },
  {
    id: 'ch1_festival_011_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '你知道吗……在精灵的传说中，「星辉之夜」是有特殊含义的。据说在这一天，两个命中注定的人如果一起仰望星空，他们的命运就会永远交织在一起。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'gentle' },
    ],
    next: 'ch1_festival_011b_rin',
  },
  {
    id: 'ch1_festival_011b_rin',
    type: 'cutscene',
    chapter: 1,
    text: '铃说完这句话，悄悄靠近了你一些。她的手在身侧微微颤抖，然后鼓起勇气，轻轻勾住了你的小指。风之精灵在她周围欢快地盘旋，撒下一片细碎的银色光粉，如同为她壮胆。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_festival_011c_rin',
  },
  {
    id: 'ch1_festival_011c_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '呐……如果传说真的就好了。我……我希望，我的命运能和你交织在一起。从第一天见到你开始，我就……就一直这么想了。你、你会觉得我很奇怪吗？',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'shy' },
    ],
    next: 'ch1_festival_011d_rin',
  },
  {
    id: 'ch1_festival_011d_rin',
    type: 'choice',
    chapter: 1,
    text: '夜风轻拂，铃的小指还勾着你的。她仰起头，紫色的眼眸在星光下闪烁，里面倒映着整片星空——以及你的身影。你——',
    background: 'bg_festival_night',
    choices: [
      {
        id: 'choice_026b_a',
        text: '反握住她的手，十指相扣，「我也有同样的想法。星辉之夜的传说——我信。」',
        nextNode: 'ch1_festival_011e_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 15 },
          { type: 'flag', target: 'rin_star_night_promise', value: true },
        ],
      },
      {
        id: 'choice_026b_b',
        text: '将她拉入怀中，轻声说，「那从今以后，你的命运里就有我了。」',
        nextNode: 'ch1_festival_011e_rin',
        effects: [
          { type: 'affection', target: 'kazane_rin', value: 18 },
          { type: 'flag', target: 'rin_star_night_embrace', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_festival_011e_rin',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '……嗯。我相信你。今晚的星星，还有精灵们……都是见证。从今以后，无论你去哪里，风都会带着我的思念追随你——因为，你就是我想要守护一辈子的人。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'center', emotion: 'tearful_happy' },
    ],
    next: 'ch1_festival_012',
  },

  // --- 樱的星辉之夜 ---
  {
    id: 'ch1_festival_010_sakura',
    type: 'cutscene',
    chapter: 1,
    text: '你和樱来到了学院的观景台。绚丽的魔法烟火在夜空中绽放，每一朵烟花都是由不同属性的魔法师共同释放的——火焰、雷电、冰霜、风暴交织在一起，美不胜收。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'wonder' },
    ],
    next: 'ch1_festival_011_sakura',
  },
  {
    id: 'ch1_festival_011_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '真美啊……你知道吗，我以前一直觉得只要成为最强就好了。但来到这个学院之后……和你们在一起的日子让我明白，有些东西比强大更重要。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'tender' },
    ],
    next: 'ch1_festival_011b_sakura',
  },
  {
    id: 'ch1_festival_011b_sakura',
    type: 'cutscene',
    chapter: 1,
    text: '一朵巨大的金色烟火在夜空中炸开，将整个观景台照得如同白昼。樱下意识地往你身边靠了靠，肩膀贴上了你的手臂。她似乎想缩回去，但最终没有动——只是把脸偏向另一边，装作在看远处的烟火。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_festival_011c_sakura',
  },
  {
    id: 'ch1_festival_011c_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '……我啊，从小就被说是火系天才。大家都只看到我强大的那一面，没有人问过我累不累、怕不怕。但你不一样。你是第一个问我「要不要休息一下」的人……也是第一个让我觉得，不用一直逞强也可以的人。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'vulnerable' },
    ],
    next: 'ch1_festival_011d_sakura',
  },
  {
    id: 'ch1_festival_011d_sakura',
    type: 'choice',
    chapter: 1,
    text: '又一朵烟火在头顶绽放，红粉色的光芒映在樱的脸上。她的眼角微微泛红——不是因为烟火的光，而是某种一直压在心底的情绪终于决堤。你——',
    background: 'bg_festival_night',
    choices: [
      {
        id: 'choice_026c_a',
        text: '伸手揽住她的肩膀，「从今以后，你不用一个人逞强了。累了就靠着我。」',
        nextNode: 'ch1_festival_011e_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 15 },
          { type: 'flag', target: 'sakura_lean_on_me', value: true },
        ],
      },
      {
        id: 'choice_026c_b',
        text: '侧头认真看着她，「真实的你，比逞强的你更可爱。我想守护这个真实的你。」',
        nextNode: 'ch1_festival_011e_sakura',
        effects: [
          { type: 'affection', target: 'hoshino_sakura', value: 18 },
          { type: 'flag', target: 'sakura_true_self', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_festival_011e_sakura',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '……笨蛋，谁要你守护啊。……但是，如果你真的这么想的话……那我就勉强接受吧。只是今晚！只有今晚可以让你这样！……才怪。以后……以后也可以。但我绝对不会说第二次的，你给我记住！',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'center', emotion: 'shy_happy' },
    ],
    next: 'ch1_festival_012',
  },

  // --- 真白的星辉之夜 ---
  {
    id: 'ch1_festival_010_mashiro',
    type: 'cutscene',
    chapter: 1,
    text: '你和真白漫步在月光下的花园中。夜晚的魔法花卉散发着柔和的荧光，如同地上的星辰。真白采了一朵花，轻轻别在你的衣领上。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
    ],
    next: 'ch1_festival_011_mashiro',
  },
  {
    id: 'ch1_festival_011_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '谢谢你选择和我一起度过这个夜晚。我……很开心。你知道吗，治愈魔法的最高境界不是治愈身体的伤痛，而是治愈心灵。而你……让我感受到了这种力量。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'touched' },
    ],
    next: 'ch1_festival_011b_mashiro',
  },
  {
    id: 'ch1_festival_011b_mashiro',
    type: 'cutscene',
    chapter: 1,
    text: '真白停下脚步，转身面对你。月光下，她白色的长发如瀑布般倾泻，发梢的荧光花瓣如同散落的星辰。她轻轻握住你的手，将你的手心贴在她的脸颊上——温热的，带着治愈魔法师特有的柔和暖意。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'tender' },
    ],
    next: 'ch1_festival_011c_mashiro',
  },
  {
    id: 'ch1_festival_011c_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '你知道吗……治愈师有一个秘密——我们能通过触碰感知到对方心底的伤痛。从第一天握住你的手开始，我就感知到了。你心底有一处空缺，那是来到这个世界之前的孤独。而我……我想要用一生去治愈那处空缺。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'emotional' },
    ],
    next: 'ch1_festival_011d_mashiro',
  },
  {
    id: 'ch1_festival_011d_mashiro',
    type: 'choice',
    chapter: 1,
    text: '真白的眼眶微微泛红，月光下的她美得如同不真实的画。她的手还带着你的体温，掌心相对的位置能清晰地感到彼此的心跳。你——',
    background: 'bg_festival_night',
    choices: [
      {
        id: 'choice_026d_a',
        text: '用拇指轻轻拭去她眼角的泪光，「那处空缺，已经被你填满了。从今以后，换我来守护你。」',
        nextNode: 'ch1_festival_011e_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 18 },
          { type: 'flag', target: 'mashiro_heal_promise', value: true },
        ],
      },
      {
        id: 'choice_026d_b',
        text: '俯身在她额头上落下一个轻吻，「那从今以后，我们互相治愈。这是我的承诺。」',
        nextNode: 'ch1_festival_011e_mashiro',
        effects: [
          { type: 'affection', target: 'shiraishi_mashiro', value: 20 },
          { type: 'flag', target: 'mashiro_forehead_kiss', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_festival_011e_mashiro',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '……嗯。我信你。今晚的月光、花香、还有夜风，都会成为我们承诺的见证。无论未来的路多么艰难，只要想起今晚，我的心就会找到归宿——因为，归宿就在你身边。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'blissful' },
    ],
    next: 'ch1_festival_012',
  },

  // --- 凛的星辉之夜 ---
  {
    id: 'ch1_festival_010_kishima',
    type: 'cutscene',
    chapter: 1,
    text: '你邀请凛一起到钟楼看夜景。她犹豫了一下，但还是答应了。从钟楼的最高处，整个学院尽收眼底——灯火通明，如同人间仙境。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'rare_gentle' },
    ],
    next: 'ch1_festival_011_kishima',
  },
  {
    id: 'ch1_festival_011_kishima',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……我很久没有像这样停下来看风景了。作为学生会副会长，每天都有处理不完的事情。……谢谢你邀请我。偶尔这样……也不错。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'rare_gentle' },
    ],
    next: 'ch1_festival_011b_kishima',
  },
  {
    id: 'ch1_festival_011b_kishima',
    type: 'cutscene',
    chapter: 1,
    text: '夜风吹起凛银色的长发，她下意识地抱住了手臂。你脱下外套，轻轻披在她肩上。她僵硬了一下，却没有拒绝——只是偏过头，让你看不到她的表情。但你能看到，她攥紧外套的手指微微发白。',
    background: 'bg_festival_night',
    bgm: 'bgm_romance',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'blushing' },
    ],
    next: 'ch1_festival_011c_kishima',
  },
  {
    id: 'ch1_festival_011c_kishima',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……你总是这样，不经意地做出让人困扰的举动。你知道吗？月岛家教导我，感情是弱者的东西——所以我一直把它们压在心底，用责任和规则代替。但遇到你之后……那些被压制的东西，好像都开始躁动了。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'vulnerable' },
    ],
    next: 'ch1_festival_011d_kishima',
  },
  {
    id: 'ch1_festival_011d_kishima',
    type: 'choice',
    chapter: 1,
    text: '凛终于转过头来，银色的眼眸在月光下泛着水光。她一向冷若冰霜的脸上，此刻写满了挣扎与柔软——那是她从未让任何人见过的表情。你——',
    background: 'bg_festival_night',
    choices: [
      {
        id: 'choice_026e_a',
        text: '轻声说，「感情不是软弱，凛。愿意面对感情的人，才是真正的强者。」',
        nextNode: 'ch1_festival_011e_kishima',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 15 },
          { type: 'flag', target: 'kishima_emotion_strength', value: true },
        ],
      },
      {
        id: 'choice_026e_b',
        text: '握住她攥紧外套的手，「那就让它们躁动吧。我会接住你——无论你展现哪一面。」',
        nextNode: 'ch1_festival_011e_kishima',
        effects: [
          { type: 'affection', target: 'kishima_rin', value: 18 },
          { type: 'flag', target: 'kishima_all_sides', value: true },
        ],
      },
    ],
  },
  {
    id: 'ch1_festival_011e_kishima',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……你这个人，真的很犯规。……我不会说那些甜言蜜语，但有一件事我可以确定——在所有人都只看到「学生会副会长月岛凛」的时候，只有你看到了「只是凛」的那个我。仅凭这一点……你就已经是特别的存在了。',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'rare_tender' },
    ],
    next: 'ch1_festival_012',
  },

  // --- 独自探索 ---
  {
    id: 'ch1_festival_010_alone',
    type: 'cutscene',
    chapter: 1,
    text: '你回想起占卜师的话：「在星辉之夜，去寻找学院中央那棵千年古树。你的命运之种就埋藏在那里。」你决定独自前往。',
    background: 'bg_festival_night',
    bgm: 'bgm_mysterious',
    next: 'ch1_festival_011_alone',
  },
  {
    id: 'ch1_festival_011_alone',
    type: 'cutscene',
    chapter: 1,
    text: '你来到了学院中央的千年古树下。巨大的树冠如同一把华盖，树叶上闪烁着点点星光。你将手放在树干上——一股温暖的力量涌入你的体内。',
    background: 'bg_starry_sky',
    bgm: 'bgm_mysterious',
    effects: [{ type: 'flag', target: 'touched_world_tree', value: true }],
    next: 'ch1_festival_012',
  },

  // --- 神秘事件发生 ---
  {
    id: 'ch1_festival_012',
    type: 'cutscene',
    chapter: 1,
    text: '就在学院祭最热闹的时刻，天空突然暗了下来。一道漆黑的裂缝出现在夜空中，如同一只巨大的眼睛正在注视着学院。所有人都惊恐地抬头看向天空。',
    background: 'bg_festival_night',
    bgm: 'bgm_dramatic',
    effects: [{ type: 'flag', target: 'dark_rift_appeared', value: true }],
    next: 'ch1_festival_013',
  },
  {
    id: 'ch1_festival_013',
    type: 'dialogue',
    chapter: 1,
    speaker: '???',
    text: '「找到了……终于找到了……那个力量……」',
    emotion: 'dark',
    background: 'bg_festival_night',
    next: 'ch1_festival_014',
  },
  {
    id: 'ch1_festival_014',
    type: 'cutscene',
    chapter: 1,
    text: '从裂缝中涌出了大量暗影生物！它们如同潮水般向学院涌来。赫利俄斯教授和高年级学生们立刻组成了防线，但暗影生物的数量实在太多了。',
    background: 'bg_festival_night',
    bgm: 'bgm_boss_battle',
    next: 'ch1_festival_015',
  },
  {
    id: 'ch1_festival_015',
    type: 'dialogue',
    chapter: 1,
    speaker: 'professor_helios',
    text: '所有新生立刻撤退到避难所！高年级战斗组上前！——等等，那个孩子……！',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'professor_helios', position: 'center', emotion: 'alarmed' },
    ],
    next: 'ch1_festival_016',
  },
  {
    id: 'ch1_festival_016',
    type: 'cutscene',
    chapter: 1,
    text: '你感到胸口的星光吊坠开始剧烈震动。一股强大的力量在你体内苏醒——和之前训练时完全不同，这次的力量更加纯粹、更加浩瀚。你被这股力量推向了战场的中心。',
    background: 'bg_festival_night',
    bgm: 'bgm_dramatic',
    effects: [{ type: 'flag', target: 'power_awakening_2', value: true }],
    next: 'ch1_festival_crisis_001',
  },

  // --- 危机期间额外选择点 ---
  {
    id: 'ch1_festival_crisis_001',
    type: 'choice',
    chapter: 1,
    text: '力量在体内翻涌，你必须在混乱中保持冷静。你首先想到的是——',
    background: 'bg_festival_night',
    choices: [
      { id: 'choice_fc001_a', text: '「同学们在哪里？他们安全吗？」', nextNode: 'ch1_festival_crisis_002', effects: [{ type: 'stat', target: 'empathy', value: 5 }, { type: 'flag', target: 'worried_about_friends', value: true }] },
      { id: 'choice_fc001_b', text: '「这股力量……我能控制住吗？」', nextNode: 'ch1_festival_crisis_002', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'questioned_power', value: true }] },
      { id: 'choice_fc001_c', text: '「不管怎样，我必须行动！」', nextNode: 'ch1_festival_crisis_002', effects: [{ type: 'stat', target: 'courage', value: 5 }, { type: 'flag', target: 'acted_decisively', value: true }] },
    ],
  },
  {
    id: 'ch1_festival_crisis_002',
    type: 'choice',
    chapter: 1,
    text: '暗影生物向你扑来！你本能地举起手——',
    background: 'bg_festival_night',
    choices: [
      { id: 'choice_fc002_a', text: '释放火焰驱散暗影！', nextNode: 'ch1_festival_crisis_003', effects: [{ type: 'flag', target: 'used_fire_crisis', value: true }, { type: 'stat', target: 'magic_power', value: 3 }] },
      { id: 'choice_fc002_b', text: '建立防护罩保护自己！', nextNode: 'ch1_festival_crisis_003', effects: [{ type: 'flag', target: 'used_shield_crisis', value: true }, { type: 'stat', target: 'magic_control', value: 3 }] },
      { id: 'choice_fc002_c', text: '用全元素之力反击！', nextNode: 'ch1_festival_crisis_003', effects: [{ type: 'flag', target: 'used_all_elements_crisis', value: true }, { type: 'stat', target: 'magic_power', value: 5 }] },
    ],
  },
  {
    id: 'ch1_festival_crisis_003',
    type: 'choice',
    chapter: 1,
    text: '铃、樱、真白、柚、葵——所有人都在你身边战斗。你看到凛正在组织高年级学生建立防线。你想对大家说——',
    background: 'bg_festival_night',
    choices: [
      { id: 'choice_fc003_a', text: '「大家退后，让我来！」', nextNode: 'ch1_festival_crisis_004', effects: [{ type: 'flag', target: 'heroic_speech', value: true }, { type: 'stat', target: 'courage', value: 5 }] },
      { id: 'choice_fc003_b', text: '「我们一起上！团结就是力量！」', nextNode: 'ch1_festival_crisis_004', effects: [{ type: 'flag', target: 'teamwork_speech', value: true }, { type: 'stat', target: 'leadership', value: 5 }] },
      { id: 'choice_fc003_c', text: '「不要慌！跟着我的节奏来！」', nextNode: 'ch1_festival_crisis_004', effects: [{ type: 'flag', target: 'calm_speech', value: true }, { type: 'stat', target: 'intelligence', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_crisis_004',
    type: 'choice',
    chapter: 1,
    text: '裂缝中传来一个低沉的声音，似乎在呼唤你。你感到一股强大的引力——',
    background: 'bg_festival_night',
    choices: [
      { id: 'choice_fc004_a', text: '抵抗这股引力，坚守阵地！', nextNode: 'ch1_festival_crisis_005', effects: [{ type: 'flag', target: 'resisted_pull', value: true }, { type: 'stat', target: 'courage', value: 5 }] },
      { id: 'choice_fc004_b', text: '倾听这个声音，试图理解它的意图。', nextNode: 'ch1_festival_crisis_005', effects: [{ type: 'flag', target: 'listened_to_voice', value: true }, { type: 'stat', target: 'empathy', value: 5 }] },
      { id: 'choice_fc004_c', text: '大声回应：「你是谁？！」', nextNode: 'ch1_festival_crisis_005', effects: [{ type: 'flag', target: 'confronted_voice', value: true }] },
    ],
  },
  {
    id: 'ch1_festival_crisis_005',
    type: 'choice',
    chapter: 1,
    text: '在做出最终决定之前，你回头看了一眼身后的同伴们。他们的眼神中充满了信任和期待。这一刻，你——',
    background: 'bg_festival_night',
    choices: [
      { id: 'choice_fc005_a', text: '感受到了前所未有的力量和责任。', nextNode: 'ch1_festival_choice_003', effects: [{ type: 'stat', target: 'courage', value: 3 }, { type: 'flag', target: 'felt_responsibility', value: true }] },
      { id: 'choice_fc005_b', text: '感到害怕，但还是决定前进。', nextNode: 'ch1_festival_choice_003', effects: [{ type: 'stat', target: 'empathy', value: 3 }, { type: 'flag', target: 'brave_despite_fear', value: true }] },
      { id: 'choice_fc005_c', text: '微笑了一下，然后转身面对裂缝。', nextNode: 'ch1_festival_choice_003', effects: [{ type: 'flag', target: 'smiled_before_battle', value: true }, { type: 'affection', target: 'kazane_rin', value: 2 }, { type: 'affection', target: 'hoshino_sakura', value: 2 }, { type: 'affection', target: 'shiraishi_mashiro', value: 2 }] },
    ],
  },

  // --- 选择点27：关键分歧选项 ---
  {
    id: 'ch1_festival_choice_003',
    type: 'choice',
    chapter: 1,
    text: '暗影生物正从裂缝中源源不断地涌出。你感受到体内的力量正在觉醒——你必须做出一个决定！',
    background: 'bg_festival_night',
    bgm: 'bgm_dramatic',
    choices: [
      {
        id: 'choice_027_a',
        text: '释放全部力量，尝试封印裂缝！',
        nextNode: 'ch1_festival_017_seal',
        effects: [
          { type: 'flag', target: 'chose_to_seal', value: true },
          { type: 'stat', target: 'heroism', value: 10 },
        ],
      },
      {
        id: 'choice_027_b',
        text: '保护身边的同学们！',
        nextNode: 'ch1_festival_017_protect',
        effects: [
          { type: 'flag', target: 'chose_to_protect', value: true },
          { type: 'stat', target: 'empathy', value: 10 },
        ],
      },
      {
        id: 'choice_027_c',
        text: '冲进裂缝，寻找暗影的源头！',
        nextNode: 'ch1_festival_017_enter_rift',
        effects: [
          { type: 'flag', target: 'chose_to_enter_rift', value: true },
          { type: 'stat', target: 'courage', value: 10 },
        ],
      },
    ],
  },

  // --- 封印路线 ---
  {
    id: 'ch1_festival_017_seal',
    type: 'cutscene',
    chapter: 1,
    text: '你将双手举向天空，体内的全元素之力如同洪水般涌出。七彩的光芒化作一道巨大的屏障，开始缓缓封印裂缝。但裂缝中的暗影力量也在疯狂抵抗——',
    background: 'bg_festival_night',
    bgm: 'bgm_boss_battle',
    next: 'ch1_festival_018_seal',
  },
  {
    id: 'ch1_festival_018_seal',
    type: 'cutscene',
    chapter: 1,
    text: '就在你快要支撑不住的时候，同学们的力量汇聚到了你身上。樱的火焰、柚的雷电、真白的治愈、铃的风之祝福、葵的炼金支援——所有人的力量都融入了你的封印术式中。',
    background: 'bg_starry_sky_bright',
    bgm: 'bgm_epilogue',
    next: 'ch1_festival_019',
  },

  // --- 保护路线 ---
  {
    id: 'ch1_festival_017_protect',
    type: 'cutscene',
    chapter: 1,
    text: '你张开双臂，在同学们周围建立了一道七彩的防护罩。暗影生物的攻击被完全阻挡在外。你的力量虽然没有直接用于攻击，但防护罩内的温度、空气、一切都恢复了正常。',
    background: 'bg_festival_night',
    bgm: 'bgm_boss_battle',
    next: 'ch1_festival_018_protect',
  },
  {
    id: 'ch1_festival_018_protect',
    type: 'cutscene',
    chapter: 1,
    text: '在你的保护下，同学们获得了喘息的机会。他们重新振作起来，组成了联合阵型，一起向暗影发起了反击。最终，众人合力封印了裂缝。',
    background: 'bg_starry_sky_bright',
    bgm: 'bgm_epilogue',
    next: 'ch1_festival_019',
  },

  // --- 进入裂缝路线 ---
  {
    id: 'ch1_festival_017_enter_rift',
    type: 'cutscene',
    chapter: 1,
    text: '你纵身一跃，冲进了那道漆黑的裂缝之中。裂缝内部是一个扭曲的空间——到处都是暗影和混沌。在最深处，你看到了一个模糊的身影。',
    background: 'bg_starry_sky',
    bgm: 'bgm_boss_battle',
    next: 'ch1_festival_018_rift',
  },
  {
    id: 'ch1_festival_018_rift',
    type: 'dialogue',
    chapter: 1,
    speaker: '???',
    text: '「终于有人来了……继承者……我等你已经很久了。这不是我们的最后一次见面……记住，光明与黑暗本为一体……」',
    background: 'bg_starry_sky',
    next: 'ch1_festival_019',
  },

  // --- 危机解除 ---
  {
    id: 'ch1_festival_019',
    type: 'cutscene',
    chapter: 1,
    text: '裂缝终于闭合了。暗影消散，星光重新洒满大地。你重重地倒在了地上，耗尽了所有的力量。在意识模糊之前，你看到了同伴们焦急的脸庞。',
    background: 'bg_festival_night',
    bgm: 'bgm_sad',
    next: 'ch1_festival_020',
  },
  {
    id: 'ch1_festival_020',
    type: 'dialogue',
    chapter: 1,
    speaker: 'shiraishi_mashiro',
    text: '不要担心……有我在呢。治愈之光——',
    background: 'bg_festival_night',
    characterSprites: [
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'worried' },
    ],
    next: 'ch1_festival_021',
  },
  {
    id: 'ch1_festival_021',
    type: 'cutscene',
    chapter: 1,
    text: '真白的治愈魔法温暖地包裹了你。在柔和的光芒中，你沉沉睡去。',
    background: 'bg_starry_sky',
    bgm: 'bgm_romance',
    next: 'ch1_festival_022',
  },

  // --- 学院祭结局 ---
  {
    id: 'ch1_festival_022',
    type: 'cutscene',
    chapter: 1,
    text: '第二天清晨，你在医疗室醒来。阳光透过窗户洒在你的脸上，温暖而宁静。窗外，学院正在恢复秩序，一切仿佛只是一场梦。',
    background: 'bg_classroom',
    bgm: 'bgm_peaceful_daily',
    next: 'ch1_festival_ending_extra_001',
  },

  // --- 结局额外选择点 ---
  {
    id: 'ch1_festival_ending_extra_001',
    type: 'choice',
    chapter: 1,
    text: '醒来后，你发现胸口的吊坠比以前更加明亮了。经历了那场战斗，你的力量似乎有了质的飞跃。你觉得——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_fee001_a', text: '试着感受新的力量。', nextNode: 'ch1_festival_ending_extra_002', effects: [{ type: 'stat', target: 'magic_power', value: 5 }, { type: 'flag', target: 'explored_new_power', value: true }] },
      { id: 'choice_fee001_b', text: '对新力量感到不安。', nextNode: 'ch1_festival_ending_extra_002', effects: [{ type: 'flag', target: 'uneasy_about_power', value: true }] },
      { id: 'choice_fee001_c', text: '思考如何更好地运用它。', nextNode: 'ch1_festival_ending_extra_002', effects: [{ type: 'stat', target: 'intelligence', value: 3 }, { type: 'flag', target: 'planned_power_usage', value: true }] },
    ],
  },
  {
    id: 'ch1_festival_ending_extra_002',
    type: 'choice',
    chapter: 1,
    text: '朋友们围在你身边。铃紧紧握着你的手，樱红着眼眶，真白在施展治愈魔法。你想对他们说——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_fee002_a', text: '「谢谢你们……有你们在真好。」', nextNode: 'ch1_festival_ending_extra_003', effects: [{ type: 'affection', target: 'kazane_rin', value: 5 }, { type: 'affection', target: 'hoshino_sakura', value: 5 }, { type: 'affection', target: 'shiraishi_mashiro', value: 5 }] },
      { id: 'choice_fee002_b', text: '「我没事，别担心。」', nextNode: 'ch1_festival_ending_extra_003', effects: [{ type: 'affection', target: 'shiraishi_mashiro', value: 3 }] },
      { id: 'choice_fee002_c', text: '「对不起，让大家担心了。」', nextNode: 'ch1_festival_ending_extra_003', effects: [{ type: 'affection', target: 'kazane_rin', value: 3 }, { type: 'stat', target: 'empathy', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_ending_extra_003',
    type: 'choice',
    chapter: 1,
    text: '月岛凛走进医疗室，带来了学院长的口信。她说学院长想单独见你。但在那之前，你可以——',
    background: 'bg_classroom',
    choices: [
      { id: 'choice_fee003_a', text: '先和凛聊聊她在这次危机中的表现。', nextNode: 'ch1_festival_ending_extra_004', effects: [{ type: 'affection', target: 'kishima_rin', value: 8 }, { type: 'flag', target: 'praised_rin', value: true }] },
      { id: 'choice_fee003_b', text: '问问学院长是什么样的人。', nextNode: 'ch1_festival_ending_extra_004', effects: [{ type: 'flag', target: 'asked_about_headmaster', value: true }] },
      { id: 'choice_fee003_c', text: '整理一下思绪再去。', nextNode: 'ch1_festival_ending_extra_004', effects: [{ type: 'stat', target: 'intelligence', value: 2 }] },
    ],
  },
  {
    id: 'ch1_festival_ending_extra_004',
    type: 'choice',
    chapter: 1,
    text: '在去见学院长的路上，你经过了被暗影破坏的校园。部分建筑受损，但学生们已经在自发地修复。你心中想——',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_fee004_a', text: '「我一定要保护好这个地方。」', nextNode: 'ch1_festival_ending_extra_005', effects: [{ type: 'flag', target: 'vowed_to_protect', value: true }, { type: 'stat', target: 'courage', value: 3 }] },
      { id: 'choice_fee004_b', text: '「这次的敌人还会再来吗？」', nextNode: 'ch1_festival_ending_extra_005', effects: [{ type: 'flag', target: 'worried_about_future', value: true }, { type: 'stat', target: 'intelligence', value: 3 }] },
      { id: 'choice_fee004_c', text: '「大家都在努力，我也不能落后。」', nextNode: 'ch1_festival_ending_extra_005', effects: [{ type: 'flag', target: 'inspired_by_others', value: true }, { type: 'stat', target: 'empathy', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_ending_extra_005',
    type: 'choice',
    chapter: 1,
    text: '在学院长的办公室门前，你深吸了一口气。门后的人掌握着关于你力量的所有答案。你准备好了吗？',
    background: 'bg_corridor',
    choices: [
      { id: 'choice_fee005_a', text: '是的，不管真相是什么，我都会面对。', nextNode: 'ch1_festival_ending_extra_006', effects: [{ type: 'flag', target: 'ready_for_truth', value: true }, { type: 'stat', target: 'courage', value: 5 }] },
      { id: 'choice_fee005_b', text: '有些紧张，但好奇心更强烈。', nextNode: 'ch1_festival_ending_extra_006', effects: [{ type: 'flag', target: 'curious_and_nervous', value: true }] },
      { id: 'choice_fee005_c', text: '回头看了一眼来时的路，然后推开门。', nextNode: 'ch1_festival_ending_extra_006', effects: [{ type: 'flag', target: 'looked_back_before_truth', value: true }] },
    ],
  },
  {
    id: 'ch1_festival_ending_extra_006',
    type: 'choice',
    chapter: 1,
    text: '学院长是一位看起来非常年轻的女性，但你从她身上感受到了深不可测的力量。她微笑着对你说：「你做得很好，孩子。」这一刻，你——',
    background: 'bg_office',
    choices: [
      { id: 'choice_fee006_a', text: '「请告诉我关于我力量的真相。」', nextNode: 'ch1_festival_choice_004', effects: [{ type: 'flag', target: 'demanded_truth', value: true }] },
      { id: 'choice_fee006_b', text: '「我只是做了应该做的事。」', nextNode: 'ch1_festival_choice_004', effects: [{ type: 'flag', target: 'humble_response_headmaster', value: true }, { type: 'stat', target: 'empathy', value: 3 }] },
      { id: 'choice_fee006_c', text: '「那个暗影……它还会回来吗？」', nextNode: 'ch1_festival_choice_004', effects: [{ type: 'flag', target: 'asked_about_shadow', value: true }, { type: 'stat', target: 'intelligence', value: 3 }] },
    ],
  },
  {
    id: 'ch1_festival_023',
    type: 'cutscene',
    chapter: 1,
    text: '门口传来了脚步声。推开门的，是所有你在学院里结识的朋友们——',
    background: 'bg_classroom',
    next: 'ch1_festival_024',
  },
  {
    id: 'ch1_festival_024',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kazane_rin',
    text: '你终于醒了！我们都担心死了！',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'kazane_rin', position: 'left' as const, emotion: 'relieved' },
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'happy' },
      { characterId: 'shiraishi_mashiro', position: 'center', emotion: 'gentle_smile' },
      { characterId: 'ishigami_aoi', position: 'right', emotion: 'neutral' },
      { characterId: 'amane_yuzu', position: 'right' as const, emotion: 'tsundere_worried' },
    ],
    next: 'ch1_festival_025',
  },
  {
    id: 'ch1_festival_025',
    type: 'dialogue',
    chapter: 1,
    speaker: 'hoshino_sakura',
    text: '你昨天太帅了！一个人对抗那么大的裂缝，简直是英雄！',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'hoshino_sakura', position: 'left', emotion: 'excited' },
    ],
    next: 'ch1_festival_026',
  },
  {
    id: 'ch1_festival_026',
    type: 'dialogue',
    chapter: 1,
    speaker: 'amane_yuzu',
    text: '……哼。别以为我会感谢你。但……这次你确实做得还不错。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'amane_yuzu', position: 'right', emotion: 'tsundere_worried' },
    ],
    next: 'ch1_festival_027',
  },
  {
    id: 'ch1_festival_027',
    type: 'dialogue',
    chapter: 1,
    speaker: 'kishima_rin',
    text: '……学院长想要见你。关于昨天的事，他有一些话要对你说。不过……在那之前，先好好休息。',
    background: 'bg_classroom',
    characterSprites: [
      { characterId: 'kishima_rin', position: 'center', emotion: 'gentle' },
    ],
    next: 'ch1_festival_028',
  },

  // --- 最终选择：通往不同路线 ---
  {
    id: 'ch1_festival_028',
    type: 'cutscene',
    chapter: 1,
    text: '在朋友们的陪伴下，你感到前所未有的温暖。你开始思考——这段冒险才刚刚开始。接下来，你要——',
    background: 'bg_classroom',
    bgm: 'bgm_main_theme',
    next: 'ch1_festival_choice_004',
  },

  // --- 选择点28：第一章最终路线分歧 ---
  {
    id: 'ch1_festival_choice_004',
    type: 'choice',
    chapter: 1,
    text: '第一章即将结束。你决定接下来的道路是——',
    background: 'bg_classroom',
    choices: [
      {
        id: 'choice_028_a',
        text: '「我要变得更强，保护所有人！」——战斗路线',
        nextNode: 'ch1_festival_029_battle',
        effects: [
          { type: 'flag', target: 'route_battle', value: true },
          { type: 'stat', target: 'courage', value: 15 },
        ],
      },
      {
        id: 'choice_028_b',
        text: '「我要解开我身上力量的谜团。」——探索路线',
        nextNode: 'ch1_festival_029_explore',
        effects: [
          { type: 'flag', target: 'route_explore', value: true },
          { type: 'stat', target: 'intelligence', value: 15 },
        ],
      },
      {
        id: 'choice_028_c',
        text: '「我想珍惜现在的每一天，和大家一起。」——羁绊路线',
        nextNode: 'ch1_festival_029_bond',
        effects: [
          { type: 'flag', target: 'route_bond', value: true },
          { type: 'stat', target: 'empathy', value: 15 },
        ],
      },
    ],
  },

  // 战斗路线结局
  {
    id: 'ch1_festival_029_battle',
    type: 'cutscene',
    chapter: 1,
    text: '你握紧了拳头。经历了这一切之后，你深刻地认识到了力量的重要性。为了保护重要的人，你必须变得更强。战斗的道路在你脚下展开——',
    background: 'bg_rooftop',
    bgm: 'bgm_main_theme',
    next: 'ch1_festival_ending',
  },

  // 探索路线结局
  {
    id: 'ch1_festival_029_explore',
    type: 'cutscene',
    chapter: 1,
    text: '你低头看着胸口的星光吊坠。那个声音、那个幻象、那股「全元素共鸣」的力量……一切都指向一个巨大的谜团。你决定去寻找真相——',
    background: 'bg_starry_sky',
    bgm: 'bgm_mysterious',
    next: 'ch1_festival_ending',
  },

  // 羁绊路线结局
  {
    id: 'ch1_festival_029_bond',
    type: 'cutscene',
    chapter: 1,
    text: '你微笑着看向身边的朋友们。在这个充满未知和危险的魔法世界中，这些温暖的羁绊才是你最强大的力量。你想和他们一起，创造更多美好的回忆——',
    background: 'bg_garden',
    bgm: 'bgm_romance',
    next: 'ch1_festival_ending',
  },

  // --- 第一章终幕 ---
  {
    id: 'ch1_festival_ending',
    type: 'cutscene',
    chapter: 1,
    text: '第一章·入学篇 完\n\n星光照耀着星辉魔法学院的每一个角落。在这里，你找到了新的力量、新的羁绊、新的自己。但这只是故事的开始——更广阔的魔法世界、更深层的谜团、更激烈的战斗，都在前方等待着你。\n\n「继承者啊，你的旅途才刚刚开始……」\n\n——敬请期待 第二章·试炼篇——',
    background: 'bg_starry_sky_bright',
    bgm: 'bgm_epilogue',
    effects: [
      { type: 'flag', target: 'chapter1_complete', value: true },
      { type: 'unlock', target: 'chapter2', value: true },
    ],
    next: undefined,
  },
];
