/**
 * 星辉魔法学院 - 约会事件数据
 * 包含所有角色的约会事件、对话、选项和奖励
 */

// 约会事件接口定义
export interface DateEvent {
  id: string;
  characterId: string;
  title: string;
  description: string;
  location: string;
  requiredAffection: number;
  chapter: number;
  dialogues: {
    id: string;
    speaker: string;
    text: string;
    emotion: string;
  }[];
  choices: {
    id: string;
    text: string;
    affectionChange: number;
    response: string;
    isBestChoice: boolean;
  }[];
  rewards: {
    affectionGain: number;
    cgUnlocked?: string;
    cardObtained?: string;
    flagSet?: Record<string, boolean>;
  };
  giftOptions?: {
    id: string;
    name: string;
    description: string;
    cost: number;
    affectionBonus: number;
  }[];
}

// ==================== 星野樱（火属性）约会事件 ====================

const sakuraHanabi: DateEvent = {
  id: 'date_sakura_hanabi',
  characterId: 'sakura',
  title: '烟火大会',
  description: '与星野樱一起参加学院举办的夏季烟火大会，在绚烂的烟火下度过难忘的夜晚。',
  location: '学院广场',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'sh_d1', speaker: 'sakura', text: '哇！好多人啊！烟火大会比我想象的还要热闹！', emotion: 'excited' },
    { id: 'sh_d2', speaker: 'narrator', text: '星野樱穿着一袭红色浴衣，发间别着火焰形状的发饰，在人群中格外耀眼。', emotion: 'neutral' },
    { id: 'sh_d3', speaker: 'sakura', text: '快看快看！那边有射击游戏摊位，我们去试试吧！', emotion: 'happy' },
    { id: 'sh_d4', speaker: 'player', text: '你射击技术怎么样？', emotion: 'neutral' },
    { id: 'sh_d5', speaker: 'sakura', text: '哼哼，别小看我！我可是火属性的魔法师，对准目标可是我的强项！', emotion: 'confident' },
    { id: 'sh_d6', speaker: 'narrator', text: '烟火在夜空中绽放，五彩斑斓的光芒映照在樱的脸上。', emotion: 'neutral' },
    { id: 'sh_d7', speaker: 'sakura', text: '……好美啊。你知道吗，我从小就梦想能和喜欢的人一起看烟火。', emotion: 'shy' },
  ],
  choices: [
    {
      id: 'sh_c1',
      text: '我也一直期待着这样的时刻。',
      affectionChange: 15,
      response: '真的吗？那…那我们以后每年都来看吧！',
      isBestChoice: true,
    },
    {
      id: 'sh_c2',
      text: '烟火确实很美。',
      affectionChange: 5,
      response: '嗯…是啊，很美。',
      isBestChoice: false,
    },
    {
      id: 'sh_c3',
      text: '那边有苹果糖，我去买给你。',
      affectionChange: 10,
      response: '哇！你真贴心！我要草莓味的！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_sakura_hanabi',
    flagSet: { sakura_hanabi_complete: true },
  },
  giftOptions: [
    { id: 'gift_hanabi_fan', name: '烟火团扇', description: '绘有精美烟火图案的团扇', cost: 500, affectionBonus: 8 },
    { id: 'gift_hanabi_hairpin', name: '火焰发饰', description: '红色水晶制成的发饰', cost: 1200, affectionBonus: 15 },
  ],
};

const sakuraCooking: DateEvent = {
  id: 'date_sakura_cooking',
  characterId: 'sakura',
  title: '烹饪教室',
  description: '和樱一起参加烹饪课程，学习制作魔法料理。',
  location: '学院厨房',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'sc_d1', speaker: 'sakura', text: '今天的课程是制作火焰咖喱！听起来就很酷对不对！', emotion: 'excited' },
    { id: 'sc_d2', speaker: 'narrator', text: '星野樱系上围裙，认真地阅读着食谱。', emotion: 'neutral' },
    { id: 'sc_d3', speaker: 'sakura', text: '等等…这个辣椒要放多少来着？三勺？还是三十勺？', emotion: 'confused' },
    { id: 'sc_d4', speaker: 'player', text: '应该是三勺吧…三十勺会出人命的。', emotion: 'worried' },
    { id: 'sc_d5', speaker: 'sakura', text: '诶？可是我觉得多放点辣椒才够味啊！', emotion: 'pouty' },
    { id: 'sc_d6', speaker: 'narrator', text: '樱一边搅拌锅里的咖喱，一边用火焰魔法精准控制火候。', emotion: 'neutral' },
    { id: 'sc_d7', speaker: 'sakura', text: '完成了！来，你先尝尝看！这是我特制的星野流火焰咖喱！', emotion: 'proud' },
    { id: 'sc_d8', speaker: 'narrator', text: '咖喱出乎意料地美味，辣度恰到好处，还带着一丝温暖的甜味。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'sc_c1',
      text: '太好吃了！你以后一定能成为出色的料理魔法师！',
      affectionChange: 20,
      response: '真…真的吗？那我以后天天做给你吃！',
      isBestChoice: true,
    },
    {
      id: 'sc_c2',
      text: '味道不错，但还可以再辣一点。',
      affectionChange: 10,
      response: '对吧对吧！我就说要多放辣椒嘛！',
      isBestChoice: false,
    },
    {
      id: 'sc_c3',
      text: '还行吧，中规中矩。',
      affectionChange: -5,
      response: '哼…你嘴巴也太刁了吧！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 15,
    cgUnlocked: 'cg_sakura_cooking',
    cardObtained: 'card_sakura_cooking',
  },
};

const sakuraTraining: DateEvent = {
  id: 'date_sakura_training',
  characterId: 'sakura',
  title: '训练场切磋',
  description: '与樱在训练场进行一场友好的魔法切磋。',
  location: '学院训练场',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'st_d1', speaker: 'sakura', text: '终于等到这一天了！来吧，让我看看你真正的实力！', emotion: 'determined' },
    { id: 'st_d2', speaker: 'narrator', text: '樱的周身燃烧着炽热的火焰，眼中闪烁着战意。', emotion: 'neutral' },
    { id: 'st_d3', speaker: 'sakura', text: '炎爆术！', emotion: 'fierce' },
    { id: 'st_d4', speaker: 'narrator', text: '巨大的火球呼啸而来，你急忙施展防御魔法。', emotion: 'neutral' },
    { id: 'st_d5', speaker: 'sakura', text: '不错嘛！那这招呢？凤凰烈焰斩！', emotion: 'excited' },
    { id: 'st_d6', speaker: 'narrator', text: '激烈的切磋过后，两人都气喘吁吁地坐在训练场边。', emotion: 'neutral' },
    { id: 'st_d7', speaker: 'sakura', text: '哈…哈…好久没这么畅快了！你真的很强呢。', emotion: 'happy' },
  ],
  choices: [
    {
      id: 'st_c1',
      text: '你才是，火焰魔法的造诣令人佩服。',
      affectionChange: 15,
      response: '嘻嘻，被你这么夸奖，我都不好意思了。',
      isBestChoice: false,
    },
    {
      id: 'st_c2',
      text: '下次我们再比一场吧。',
      affectionChange: 20,
      response: '一言为定！不过下次我可不会输了！',
      isBestChoice: true,
    },
    {
      id: 'st_c3',
      text: '你刚才手下留情了吧？',
      affectionChange: 10,
      response: '才…才没有！我是认真的！好吧，也许只留了一点点…',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 20,
    cgUnlocked: 'cg_sakura_training',
    flagSet: { sakura_training_complete: true },
  },
};

const sakuraOnsen: DateEvent = {
  id: 'date_sakura_onsen',
  characterId: 'sakura',
  title: '温泉旅行',
  description: '与樱一起前往学院附近的温泉旅馆放松身心。',
  location: '星辉温泉旅馆',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'so_d1', speaker: 'sakura', text: '温泉温泉！我最喜欢泡温泉了！', emotion: 'excited' },
    { id: 'so_d2', speaker: 'narrator', text: '温泉旅馆坐落在山间，周围环绕着茂密的森林。', emotion: 'neutral' },
    { id: 'so_d3', speaker: 'sakura', text: '这个露天温泉好棒啊！水温刚刚好！', emotion: 'relaxed' },
    { id: 'so_d4', speaker: 'player', text: '难得看你这么安静。', emotion: 'neutral' },
    { id: 'so_d5', speaker: 'sakura', text: '因为泡温泉的时候很放松嘛…而且，和你在一起的时候，我总觉得很安心。', emotion: 'gentle' },
    { id: 'so_d6', speaker: 'narrator', text: '星空下，温泉的蒸汽袅袅上升，樱的脸颊因为热水而微微泛红。', emotion: 'neutral' },
    { id: 'so_d7', speaker: 'sakura', text: '那个…谢谢你陪我来这里。这可能是我最开心的一天了。', emotion: 'shy' },
  ],
  choices: [
    {
      id: 'so_c1',
      text: '能让你开心，我也很开心。',
      affectionChange: 25,
      response: '你这样说…我真的好高兴…',
      isBestChoice: true,
    },
    {
      id: 'so_c2',
      text: '以后我们常来吧。',
      affectionChange: 15,
      response: '嗯！说好了哦！',
      isBestChoice: false,
    },
    {
      id: 'so_c3',
      text: '这里的风景确实不错。',
      affectionChange: 5,
      response: '是啊…风景…嗯…',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 25,
    cgUnlocked: 'cg_sakura_onsen',
    cardObtained: 'card_sakura_onsen',
  },
};

const sakuraAltar: DateEvent = {
  id: 'date_sakura_altar',
  characterId: 'sakura',
  title: '火焰祭坛',
  description: '与樱一起探索学院深处的古老火焰祭坛。',
  location: '火焰祭坛',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'sa_d1', speaker: 'sakura', text: '传说这个祭坛是古代火之贤者建造的…我一直想来看看。', emotion: 'curious' },
    { id: 'sa_d2', speaker: 'narrator', text: '古老的祭坛散发着温暖的光芒，墙壁上刻满了火焰纹样的符文。', emotion: 'neutral' },
    { id: 'sa_d3', speaker: 'sakura', text: '这些符文…好像在对我述说着什么…', emotion: 'focused' },
    { id: 'sa_d4', speaker: 'narrator', text: '樱伸出手触碰祭坛中心的火焰水晶，整个空间顿时被温暖的光芒包围。', emotion: 'neutral' },
    { id: 'sa_d5', speaker: 'sakura', text: '我感觉到了…先代火之贤者们的意志…', emotion: 'awed' },
    { id: 'sa_d6', speaker: 'sakura', text: '他们说…火焰的力量来源于守护重要之人的决心。', emotion: 'touched' },
    { id: 'sa_d7', speaker: 'sakura', text: '我现在终于明白了…我想要守护的人…就是你。', emotion: 'loving' },
    { id: 'sa_d8', speaker: 'narrator', text: '祭坛的火焰在两人周围舞动，仿佛在祝福着这对年轻人。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'sa_c1',
      text: '我也会永远守护你。',
      affectionChange: 30,
      response: '嗯…让我们一起，走向未来吧。',
      isBestChoice: true,
    },
    {
      id: 'sa_c2',
      text: '火焰的力量真了不起。',
      affectionChange: 10,
      response: '是啊…但更了不起的是，这份力量是因为你才觉醒的。',
      isBestChoice: false,
    },
    {
      id: 'sa_c3',
      text: '你的火焰魔法又变强了呢。',
      affectionChange: 15,
      response: '嗯！因为有你在我身边，我感觉自己无所不能！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_sakura_altar',
    cardObtained: 'card_sakura_altar',
    flagSet: { sakura_altar_bond: true },
  },
};

// ==================== 月岛凛（冰属性）约会事件 ====================

const rinLibrary: DateEvent = {
  id: 'date_rin_library',
  characterId: 'rin',
  title: '图书馆夜读',
  description: '与凛在学院图书馆度过一个安静的夜晚，一起阅读魔法典籍。',
  location: '学院图书馆',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'rl_d1', speaker: 'rin', text: '你来了。我帮你留了靠窗的位置。', emotion: 'calm' },
    { id: 'rl_d2', speaker: 'narrator', text: '月岛凛安静地坐在角落里，面前堆满了厚重的魔法书籍。', emotion: 'neutral' },
    { id: 'rl_d3', speaker: 'rin', text: '这本书记载了古代冰系魔法的奥秘…你要一起看吗？', emotion: 'neutral' },
    { id: 'rl_d4', speaker: 'player', text: '当然，听起来很有趣。', emotion: 'neutral' },
    { id: 'rl_d5', speaker: 'rin', text: '嗯…这里记载了一种叫做"永恒冰晶"的魔法…据说能将瞬间的美好永远保存。', emotion: 'thoughtful' },
    { id: 'rl_d6', speaker: 'narrator', text: '窗外的月光洒在凛的侧脸上，她的表情难得地柔和。', emotion: 'neutral' },
    { id: 'rl_d7', speaker: 'rin', text: '…谢谢你陪我。平时我都是一个人来这里。', emotion: 'gentle' },
  ],
  choices: [
    {
      id: 'rl_c1',
      text: '以后我都可以陪你。',
      affectionChange: 15,
      response: '…嗯。那就拜托你了。',
      isBestChoice: true,
    },
    {
      id: 'rl_c2',
      text: '这些书确实很有意思。',
      affectionChange: 10,
      response: '你对魔法理论也有研究吗？难得遇到同好。',
      isBestChoice: false,
    },
    {
      id: 'rl_c3',
      text: '夜深了，你不要熬夜。',
      affectionChange: 8,
      response: '…你还挺细心的。我知道了。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_rin_library',
    flagSet: { rin_library_complete: true },
  },
  giftOptions: [
    { id: 'gift_rin_book', name: '古籍抄本', description: '记载着失传冰系魔法的珍贵书籍', cost: 800, affectionBonus: 12 },
    { id: 'gift_rin_bookmark', name: '冰晶书签', description: '永不融化的精致冰晶书签', cost: 600, affectionBonus: 10 },
  ],
};

const rinTea: DateEvent = {
  id: 'date_rin_tea',
  characterId: 'rin',
  title: '茶道体验',
  description: '与凛一起体验传统茶道，感受日式美学的宁静。',
  location: '茶道室',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'rt_d1', speaker: 'rin', text: '茶道讲究的是"一期一会"的精神。每一次的相遇都是独一无二的。', emotion: 'composed' },
    { id: 'rt_d2', speaker: 'narrator', text: '凛身着淡蓝色和服，动作优雅地准备着茶具。', emotion: 'neutral' },
    { id: 'rt_d3', speaker: 'rin', text: '这是抹茶。先把茶粉放入碗中，然后用热水冲泡…', emotion: 'focused' },
    { id: 'rt_d4', speaker: 'narrator', text: '凛用茶筅熟练地打着茶，整个过程行云流水。', emotion: 'neutral' },
    { id: 'rt_d5', speaker: 'rin', text: '请用。小心烫。', emotion: 'polite' },
    { id: 'rt_d6', speaker: 'narrator', text: '抹茶的味道微苦回甘，带着淡淡的清香。', emotion: 'neutral' },
    { id: 'rt_d7', speaker: 'rin', text: '…你喝茶的样子，还不错。', emotion: 'slight_smile' },
  ],
  choices: [
    {
      id: 'rt_c1',
      text: '能品尝到你亲手泡的茶，我很荣幸。',
      affectionChange: 18,
      response: '…你还挺会说话的。那，再来一碗吧。',
      isBestChoice: true,
    },
    {
      id: 'rt_c2',
      text: '你的茶道技术真好。',
      affectionChange: 10,
      response: '只是学过一些皮毛而已。',
      isBestChoice: false,
    },
    {
      id: 'rt_c3',
      text: '有点苦，能加糖吗？',
      affectionChange: -5,
      response: '……你认真的吗？茶道是不加糖的。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 12,
    cgUnlocked: 'cg_rin_tea',
    cardObtained: 'card_rin_tea',
  },
};

const rinSnow: DateEvent = {
  id: 'date_rin_snow',
  characterId: 'rin',
  title: '雪景散步',
  description: '冬日里与凛一起在雪中漫步，欣赏银装素裹的校园。',
  location: '学院花园',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'rs_d1', speaker: 'rin', text: '下雪了。…要一起走走吗？', emotion: 'calm' },
    { id: 'rs_d2', speaker: 'narrator', text: '雪花纷纷扬扬地落下，整个校园披上了银白的外衣。', emotion: 'neutral' },
    { id: 'rs_d3', speaker: 'rin', text: '我最喜欢雪天。一切都变得安静而纯净。', emotion: 'peaceful' },
    { id: 'rs_d4', speaker: 'narrator', text: '凛伸出手，让雪花落在掌心，然后用魔法将它保存成永恒的冰晶。', emotion: 'neutral' },
    { id: 'rs_d5', speaker: 'rin', text: '送给你。这是今天的雪…永远都不会融化。', emotion: 'gentle' },
    { id: 'rs_d6', speaker: 'player', text: '谢谢，我会好好珍惜的。', emotion: 'touched' },
    { id: 'rs_d7', speaker: 'rin', text: '…嗯。就像我珍惜和你在一起的时光一样。', emotion: 'shy' },
  ],
  choices: [
    {
      id: 'rs_c1',
      text: '这是我收到过最特别的礼物。',
      affectionChange: 20,
      response: '……你要是再说这种话，我会…会…算了，没什么。',
      isBestChoice: true,
    },
    {
      id: 'rs_c2',
      text: '你的冰系魔法真的很厉害。',
      affectionChange: 10,
      response: '这不算什么。只是小小的技巧而已。',
      isBestChoice: false,
    },
    {
      id: 'rs_c3',
      text: '你不冷吗？披上我的外套吧。',
      affectionChange: 15,
      response: '我是冰属性的魔法师…不过，谢谢你的心意。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 18,
    cgUnlocked: 'cg_rin_snow',
    flagSet: { rin_snow_crystal: true },
  },
};

const rinConcert: DateEvent = {
  id: 'date_rin_concert',
  characterId: 'rin',
  title: '古典音乐会',
  description: '与凛一起欣赏学院举办的古典音乐会。',
  location: '学院音乐厅',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'rc_d1', speaker: 'rin', text: '今天的曲目是《冬之旅》…我很喜欢这首曲子。', emotion: 'pleased' },
    { id: 'rc_d2', speaker: 'narrator', text: '音乐厅内灯光昏暗，舞台上只有几束柔和的光。', emotion: 'neutral' },
    { id: 'rc_d3', speaker: 'rin', text: '…你听，这个乐章。它描述的是冬日里独自漫步的孤独旅人。', emotion: 'moved' },
    { id: 'rc_d4', speaker: 'narrator', text: '悠扬的旋律在空气中回荡，凛闭上眼睛，沉浸在音乐中。', emotion: 'neutral' },
    { id: 'rc_d5', speaker: 'rin', text: '以前听这首曲子的时候，我总是一个人…', emotion: 'melancholy' },
    { id: 'rc_d6', speaker: 'rin', text: '但现在…有你在身边，感觉这首曲子似乎变得温暖了。', emotion: 'warm' },
  ],
  choices: [
    {
      id: 'rc_c1',
      text: '以后的每一场音乐会，我都陪你来。',
      affectionChange: 25,
      response: '…说好了。不许反悔。',
      isBestChoice: true,
    },
    {
      id: 'rc_c2',
      text: '音乐真的很能打动人心。',
      affectionChange: 10,
      response: '嗯…特别是有共鸣的时候。',
      isBestChoice: false,
    },
    {
      id: 'rc_c3',
      text: '你闭眼听音乐的样子很美。',
      affectionChange: 18,
      response: '…你在看我吗？…笨蛋。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 22,
    cgUnlocked: 'cg_rin_concert',
    cardObtained: 'card_rin_concert',
  },
};

const rinIceGarden: DateEvent = {
  id: 'date_rin_ice_garden',
  characterId: 'rin',
  title: '冰之花园',
  description: '凛用冰系魔法创造出的梦幻花园，只有在最亲密的人面前才会展示。',
  location: '秘密冰花园',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'rig_d1', speaker: 'rin', text: '闭上眼睛。我有东西要给你看。', emotion: 'anticipating' },
    { id: 'rig_d2', speaker: 'narrator', text: '当你睁开眼睛时，眼前的景象令你屏住了呼吸。', emotion: 'neutral' },
    { id: 'rig_d3', speaker: 'rin', text: '这是…我用冰魔法创造的花园。每一朵花都是独一无二的。', emotion: 'proud' },
    { id: 'rig_d4', speaker: 'narrator', text: '冰晶花朵在月光下折射出七彩的光芒，如同童话世界一般。', emotion: 'neutral' },
    { id: 'rig_d5', speaker: 'rin', text: '我从未让任何人看过这里…因为这是我内心深处最柔软的地方。', emotion: 'vulnerable' },
    { id: 'rig_d6', speaker: 'rin', text: '你…愿意接受这样笨拙的我吗？', emotion: 'anxious' },
    { id: 'rig_d7', speaker: 'narrator', text: '凛的眼中闪烁着不安的光芒，双手紧紧握在胸前。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'rig_c1',
      text: '这是我见过最美的花园，也是最美的你。',
      affectionChange: 30,
      response: '……谢谢你。能遇见你…真的太好了。',
      isBestChoice: true,
    },
    {
      id: 'rig_c2',
      text: '你的冰系魔法已经登峰造极了。',
      affectionChange: 15,
      response: '技术什么的不重要…重要的是…算了。',
      isBestChoice: false,
    },
    {
      id: 'rig_c3',
      text: '你一点都不笨拙。',
      affectionChange: 20,
      response: '…真的吗？那我…可以经常为你创造这些吗？',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_rin_ice_garden',
    cardObtained: 'card_rin_ice_garden',
    flagSet: { rin_ice_garden_bond: true },
  },
};

// ==================== 风间铃（风属性）约会事件 ====================

const suzuKite: DateEvent = {
  id: 'date_suzu_kite',
  characterId: 'suzu',
  title: '风筝比赛',
  description: '与铃一起参加学院的风筝放飞比赛，在春风中尽情欢笑。',
  location: '学院操场',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'sk_d1', speaker: 'suzu', text: '快快快！风向变了！我们的风筝要飞得最高！', emotion: 'excited' },
    { id: 'sk_d2', speaker: 'narrator', text: '风间铃拉着风筝线在草地上奔跑，长发在风中飞舞。', emotion: 'neutral' },
    { id: 'sk_d3', speaker: 'suzu', text: '嘿嘿，有风属性的我帮忙，这场比赛稳赢啦！', emotion: 'confident' },
    { id: 'sk_d4', speaker: 'player', text: '这样算作弊吧？', emotion: 'amused' },
    { id: 'sk_d5', speaker: 'suzu', text: '才不算！这叫做…天赋优势！哈哈！', emotion: 'playful' },
    { id: 'sk_d6', speaker: 'narrator', text: '风筝在铃的魔法加持下飞到了不可思议的高度。', emotion: 'neutral' },
    { id: 'sk_d7', speaker: 'suzu', text: '看！我们的风筝是最高的！我们赢啦！', emotion: 'triumphant' },
  ],
  choices: [
    {
      id: 'sk_c1',
      text: '是我们一起赢的！',
      affectionChange: 15,
      response: '对！是我们一起的功劳！击掌！',
      isBestChoice: true,
    },
    {
      id: 'sk_c2',
      text: '你跑起来的样子真可爱。',
      affectionChange: 12,
      response: '诶？可…可爱什么的…我才没有！',
      isBestChoice: false,
    },
    {
      id: 'sk_c3',
      text: '下次不用魔法，公平比赛吧。',
      affectionChange: 5,
      response: '诶~好啦好啦，下次公平竞争！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_suzu_kite',
    flagSet: { suzu_kite_complete: true },
  },
  giftOptions: [
    { id: 'gift_suzu_bell', name: '风铃', description: '会随风歌唱的魔法风铃', cost: 500, affectionBonus: 10 },
    { id: 'gift_suzu_ribbon', name: '丝带手链', description: '飘逸的彩色丝带手链', cost: 400, affectionBonus: 8 },
  ],
};

const suzuFlowerField: DateEvent = {
  id: 'date_suzu_flower_field',
  characterId: 'suzu',
  title: '花海探险',
  description: '与铃一起探索学院后山的秘密花海。',
  location: '后山花海',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'sf_d1', speaker: 'suzu', text: '我发现了！后山有一片超级大的花海！我们去探险吧！', emotion: 'excited' },
    { id: 'sf_d2', speaker: 'narrator', text: '漫山遍野的野花在微风中轻轻摇曳，空气中弥漫着花香。', emotion: 'neutral' },
    { id: 'sf_d3', speaker: 'suzu', text: '哇啊啊啊！好多花啊！你看这朵，好漂亮！', emotion: 'ecstatic' },
    { id: 'sf_d4', speaker: 'narrator', text: '铃在花海中欢快地跳跃，不时停下来闻闻各种花朵。', emotion: 'neutral' },
    { id: 'sf_d5', speaker: 'suzu', text: '我用风魔法做一个花环送给你！看好了~', emotion: 'playful' },
    { id: 'sf_d6', speaker: 'narrator', text: '铃操控微风，将各色花瓣编织成一个精致的花环。', emotion: 'neutral' },
    { id: 'sf_d7', speaker: 'suzu', text: '当当！完成了！快戴上让我看看！', emotion: 'happy' },
  ],
  choices: [
    {
      id: 'sf_c1',
      text: '很美！你也戴一个吧，我帮你编。',
      affectionChange: 18,
      response: '真的吗？好呀好呀！我要最好看的那种！',
      isBestChoice: true,
    },
    {
      id: 'sf_c2',
      text: '你的风魔法越来越厉害了。',
      affectionChange: 10,
      response: '嘿嘿，那当然！我可是每天都在练习呢！',
      isBestChoice: false,
    },
    {
      id: 'sf_c3',
      text: '谢谢你，我会好好珍惜的。',
      affectionChange: 12,
      response: '不用谢啦！看到你开心我就开心！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 12,
    cgUnlocked: 'cg_suzu_flower_field',
    cardObtained: 'card_suzu_flower',
  },
};

const suzuAmusement: DateEvent = {
  id: 'date_suzu_amusement',
  characterId: 'suzu',
  title: '游乐园',
  description: '与铃一起到魔法游乐园度过充满欢笑的一天。',
  location: '魔法游乐园',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'sa_d1', speaker: 'suzu', text: '游乐园游乐园！我从小就梦想来这里！', emotion: 'ecstatic' },
    { id: 'sa_d2', speaker: 'narrator', text: '魔法游乐园到处都是奇幻的装饰和欢快的音乐。', emotion: 'neutral' },
    { id: 'sa_d3', speaker: 'suzu', text: '先坐过山车！然后是旋转木马！还有鬼屋！', emotion: 'hyper' },
    { id: 'sa_d4', speaker: 'narrator', text: '铃拉着你的手在游乐园里到处跑，一刻都停不下来。', emotion: 'neutral' },
    { id: 'sa_d5', speaker: 'suzu', text: '啊！！这个过山车好高啊！我有点怕…但是好刺激！', emotion: 'nervous_excited' },
    { id: 'sa_d6', speaker: 'narrator', text: '从过山车上下来后，铃紧紧抓着你的手臂，脸上还带着兴奋的红晕。', emotion: 'neutral' },
    { id: 'sa_d7', speaker: 'suzu', text: '今天真的太开心了！谢谢你带我来这里！', emotion: 'grateful' },
  ],
  choices: [
    {
      id: 'sa_c1',
      text: '看到你的笑容就是最大的幸福。',
      affectionChange: 20,
      response: '你…你说什么呢！害我都不好意思了！但是…我也很开心！',
      isBestChoice: true,
    },
    {
      id: 'sa_c2',
      text: '我们把每个项目都玩一遍吧！',
      affectionChange: 15,
      response: '好耶！下一个我们去坐摩天轮！',
      isBestChoice: false,
    },
    {
      id: 'sa_c3',
      text: '你在鬼屋的时候抓得我好紧。',
      affectionChange: 12,
      response: '那…那是因为鬼屋太可怕了！才不是因为…哼！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 18,
    cgUnlocked: 'cg_suzu_amusement',
    flagSet: { suzu_amusement_complete: true },
  },
};

const suzuCamping: DateEvent = {
  id: 'date_suzu_camping',
  characterId: 'suzu',
  title: '星空露营',
  description: '与铃一起在山顶露营，仰望满天繁星。',
  location: '星见山',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'scamp_d1', speaker: 'suzu', text: '星星好亮啊！在城市里根本看不到这么多星星！', emotion: 'amazed' },
    { id: 'scamp_d2', speaker: 'narrator', text: '篝火噼啪作响，漫天星斗在头顶闪烁。', emotion: 'neutral' },
    { id: 'scamp_d3', speaker: 'suzu', text: '那颗最亮的星星叫什么名字？', emotion: 'curious' },
    { id: 'scamp_d4', speaker: 'player', text: '那是北极星，它永远指向北方。', emotion: 'gentle' },
    { id: 'scamp_d5', speaker: 'suzu', text: '北极星…就像灯塔一样，永远为迷路的人指引方向。', emotion: 'thoughtful' },
    { id: 'scamp_d6', speaker: 'suzu', text: '你知道吗…对我来说，你就像北极星一样。', emotion: 'sincere' },
    { id: 'scamp_d7', speaker: 'narrator', text: '铃靠在你的肩上，眼睛里映着满天星光。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'scamp_c1',
      text: '你也是我夜空中最亮的星。',
      affectionChange: 25,
      response: '…！你、你说什么啊！呜…太犯规了啦！',
      isBestChoice: true,
    },
    {
      id: 'scamp_c2',
      text: '今晚的星空真的很美。',
      affectionChange: 10,
      response: '嗯…有你一起看，更美了。',
      isBestChoice: false,
    },
    {
      id: 'scamp_c3',
      text: '困了吗？明天还要看日出呢。',
      affectionChange: 12,
      response: '不困！我要等到日出！绝对不睡！…呼…',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 22,
    cgUnlocked: 'cg_suzu_camping',
    cardObtained: 'card_suzu_camping',
  },
};

const suzuFairyFest: DateEvent = {
  id: 'date_suzu_fairy_fest',
  characterId: 'suzu',
  title: '精灵庆典',
  description: '与铃一起参加风之精灵们举办的神秘庆典。',
  location: '精灵之森',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'sff_d1', speaker: 'suzu', text: '听到了吗？风精灵们在呼唤我们！', emotion: 'excited' },
    { id: 'sff_d2', speaker: 'narrator', text: '森林深处闪烁着无数萤火般的光芒，那是风之精灵们的身影。', emotion: 'neutral' },
    { id: 'sff_d3', speaker: 'suzu', text: '哇…它们在跳舞！好美啊！', emotion: 'mesmerized' },
    { id: 'sff_d4', speaker: 'narrator', text: '精灵们围绕着两人飞舞，带来花瓣和光芒。', emotion: 'neutral' },
    { id: 'sff_d5', speaker: 'suzu', text: '它们说…它们在祝福我们呢…', emotion: 'touched' },
    { id: 'sff_d6', speaker: 'suzu', text: '风精灵们从来没有对人类这么友善过…也许是因为…', emotion: 'hopeful' },
    { id: 'sff_d7', speaker: 'suzu', text: '…因为我真的很喜欢你，连精灵们都感受到了吧。', emotion: 'loving' },
  ],
  choices: [
    {
      id: 'sff_c1',
      text: '我也很喜欢你，铃。',
      affectionChange: 30,
      response: '嗯！让我们和精灵们一起，永远快乐下去吧！',
      isBestChoice: true,
    },
    {
      id: 'sff_c2',
      text: '你和精灵们的关系真好。',
      affectionChange: 15,
      response: '因为风就是我的朋友嘛！而你是…最重要的人。',
      isBestChoice: false,
    },
    {
      id: 'sff_c3',
      text: '这些精灵真可爱。',
      affectionChange: 10,
      response: '对吧对吧！它们还说你很温柔呢！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_suzu_fairy_fest',
    cardObtained: 'card_suzu_fairy',
    flagSet: { suzu_fairy_bond: true },
  },
};

// ==================== 石神葵（土属性）约会事件 ====================

const aoiMining: DateEvent = {
  id: 'date_aoi_mining',
  characterId: 'aoi',
  title: '矿石收集',
  description: '与葵一起在学院矿洞中寻找珍贵的魔法矿石。',
  location: '学院矿洞',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'am_d1', speaker: 'aoi', text: '这条矿脉里应该有不错的矿石…跟我来。', emotion: 'focused' },
    { id: 'am_d2', speaker: 'narrator', text: '石神葵熟练地检查着岩壁，不时用手触摸感受矿脉。', emotion: 'neutral' },
    { id: 'am_d3', speaker: 'aoi', text: '找到了！这是一块品质不错的魔晶石。', emotion: 'satisfied' },
    { id: 'am_d4', speaker: 'player', text: '你真厉害，一眼就能分辨出来。', emotion: 'impressed' },
    { id: 'am_d5', speaker: 'aoi', text: '和大地打交道久了，自然就能听懂岩石的语言。', emotion: 'calm' },
    { id: 'am_d6', speaker: 'narrator', text: '葵把找到的矿石仔细擦拭干净，递给你看。', emotion: 'neutral' },
    { id: 'am_d7', speaker: 'aoi', text: '送给你。虽然不是什么贵重的东西…但是我在最好的矿脉找到的。', emotion: 'shy' },
  ],
  choices: [
    {
      id: 'am_c1',
      text: '对我来说，这是最珍贵的礼物。',
      affectionChange: 18,
      response: '…你太夸张了。不过…谢谢你能喜欢。',
      isBestChoice: true,
    },
    {
      id: 'am_c2',
      text: '教我怎么辨别矿石吧！',
      affectionChange: 12,
      response: '好。首先要感受岩石的温度和纹理…来，伸出手。',
      isBestChoice: false,
    },
    {
      id: 'am_c3',
      text: '矿洞里好暗啊，小心点。',
      affectionChange: 8,
      response: '放心，我闭着眼睛都能走。这里的每一块石头我都认识。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_aoi_mining',
    flagSet: { aoimining_complete: true },
  },
  giftOptions: [
    { id: 'gift_aoi_pickaxe', name: '精工镐', description: '用稀有金属打造的采矿工具', cost: 700, affectionBonus: 12 },
    { id: 'gift_aoi_gem', name: '大地之心', description: '传说中的土属性宝石', cost: 1500, affectionBonus: 18 },
  ],
};

const aoiAlchemy: DateEvent = {
  id: 'date_aoi_alchemy',
  characterId: 'aoi',
  title: '炼金实验',
  description: '与葵一起在炼金实验室尝试制作新型魔法药剂。',
  location: '炼金实验室',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'aa_d1', speaker: 'aoi', text: '今天的课题是制作大地精华液。需要精确的配比。', emotion: 'focused' },
    { id: 'aa_d2', speaker: 'narrator', text: '实验台上摆满了各种矿石粉末和魔法材料。', emotion: 'neutral' },
    { id: 'aa_d3', speaker: 'aoi', text: '把三份水晶粉末和一份铁矿粉混合…然后加入催化剂…', emotion: 'concentrating' },
    { id: 'aa_d4', speaker: 'narrator', text: '葵专注地操作着实验器材，动作一丝不苟。', emotion: 'neutral' },
    { id: 'aa_d5', speaker: 'aoi', text: '注意观察颜色变化…从透明变成金色就说明成功了。', emotion: 'calm' },
    { id: 'aa_d6', speaker: 'narrator', text: '液体逐渐变成漂亮的金色，散发着温暖的光芒。', emotion: 'neutral' },
    { id: 'aa_d7', speaker: 'aoi', text: '成功了。…和你一起做实验，似乎成功率更高。', emotion: 'slight_smile' },
  ],
  choices: [
    {
      id: 'aa_c1',
      text: '那我们以后经常一起做实验吧。',
      affectionChange: 18,
      response: '…嗯。和你搭档…确实效率很高。',
      isBestChoice: true,
    },
    {
      id: 'aa_c2',
      text: '你做实验的样子真的很帅。',
      affectionChange: 15,
      response: '帅？…你在说什么啊。专心看实验。',
      isBestChoice: false,
    },
    {
      id: 'aa_c3',
      text: '这个药剂有什么用？',
      affectionChange: 8,
      response: '可以强化土属性魔法的效果。你上课没听吗？',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 12,
    cgUnlocked: 'cg_aoi_alchemy',
    cardObtained: 'card_aoi_alchemy',
  },
};

const aoiMuseum: DateEvent = {
  id: 'date_aoi_museum',
  characterId: 'aoi',
  title: '博物馆参观',
  description: '与葵一起参观学院附属的地质博物馆。',
  location: '地质博物馆',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'amu_d1', speaker: 'aoi', text: '这里收藏了上千种矿物标本…每一块都有它的故事。', emotion: 'enthusiastic' },
    { id: 'amu_d2', speaker: 'narrator', text: '博物馆里陈列着各种闪闪发光的矿石和化石。', emotion: 'neutral' },
    { id: 'amu_d3', speaker: 'aoi', text: '看这块，这是亿万年前形成的琥珀。里面还封存着古代的昆虫。', emotion: 'excited' },
    { id: 'amu_d4', speaker: 'narrator', text: '很少看到葵这么激动的样子，她对矿石的热爱显而易见。', emotion: 'neutral' },
    { id: 'amu_d5', speaker: 'aoi', text: '每一块石头都是地球的记忆…我喜欢这种感觉。', emotion: 'philosophical' },
    { id: 'amu_d6', speaker: 'aoi', text: '…谢谢你愿意陪我来这里。我知道不是所有人都觉得矿石有趣的。', emotion: 'grateful' },
  ],
  choices: [
    {
      id: 'amu_c1',
      text: '听你讲解，我才发现矿石这么有趣。',
      affectionChange: 20,
      response: '…真的吗？那…下次我带你去看更多特别的矿石！',
      isBestChoice: true,
    },
    {
      id: 'amu_c2',
      text: '你对矿石真的很了解啊。',
      affectionChange: 12,
      response: '毕竟研究了很多年了。这也是我为数不多的爱好。',
      isBestChoice: false,
    },
    {
      id: 'amu_c3',
      text: '这块琥珀真漂亮，就像你的眼睛。',
      affectionChange: 15,
      response: '…你在说什么…不要说这种奇怪的话…',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 15,
    cgUnlocked: 'cg_aoi_museum',
    flagSet: { aoimuseum_complete: true },
  },
};

const aoiRuin: DateEvent = {
  id: 'date_aoi_ruin',
  characterId: 'aoi',
  title: '地下遗迹',
  description: '与葵一起探索学院地下的古代遗迹。',
  location: '地下遗迹',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'ar_d1', speaker: 'aoi', text: '根据古籍记载，这里曾经是古代土之贤者的修炼之地。', emotion: 'serious' },
    { id: 'ar_d2', speaker: 'narrator', text: '巨大的地下空间中，岩壁上刻满了古老的符文。', emotion: 'neutral' },
    { id: 'ar_d3', speaker: 'aoi', text: '这些符文…是大地的语言。让我来解读…', emotion: 'focused' },
    { id: 'ar_d4', speaker: 'narrator', text: '葵将手放在石壁上，闭上眼睛感受着大地的脉动。', emotion: 'neutral' },
    { id: 'ar_d5', speaker: 'aoi', text: '这里记载的是…关于守护和承诺的魔法…', emotion: 'moved' },
    { id: 'ar_d6', speaker: 'aoi', text: '古代的贤者说…最坚固的魔法不是岩石，而是人与人之间的羁绊。', emotion: 'reflective' },
  ],
  choices: [
    {
      id: 'ar_c1',
      text: '那我们的羁绊，应该也挺坚固的吧？',
      affectionChange: 22,
      response: '…大概吧。我会用大地的力量来守护这份羁绊的。',
      isBestChoice: true,
    },
    {
      id: 'ar_c2',
      text: '你解读符文的样子很厉害。',
      affectionChange: 12,
      response: '这需要长年累月的练习。不过…我还在学习中。',
      isBestChoice: false,
    },
    {
      id: 'ar_c3',
      text: '这里有点可怕…',
      affectionChange: 10,
      response: '…别怕。有我在，大地不会伤害我们的。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 20,
    cgUnlocked: 'cg_aoi_ruin',
    cardObtained: 'card_aoi_ruin',
  },
};

const aoiStargazing: DateEvent = {
  id: 'date_aoi_stargazing',
  characterId: 'aoi',
  title: '山顶观星',
  description: '与葵一起在山顶的岩石上仰望星空，聆听大地的声音。',
  location: '磐石山顶',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'as_d1', speaker: 'aoi', text: '这里是我最喜欢的地方。大地的声音在这里最为清晰。', emotion: 'peaceful' },
    { id: 'as_d2', speaker: 'narrator', text: '山顶的巨石上，两人并肩而坐，头顶是无垠的星空。', emotion: 'neutral' },
    { id: 'as_d3', speaker: 'aoi', text: '你知道吗？脚下的这座山，已经有数亿年的历史了。', emotion: 'contemplative' },
    { id: 'as_d4', speaker: 'aoi', text: '在它面前，我们的时间不过是沧海一粟…', emotion: 'philosophical' },
    { id: 'as_d5', speaker: 'aoi', text: '但即使是沧海一粟…我也想和你一起度过。', emotion: 'sincere' },
    { id: 'as_d6', speaker: 'narrator', text: '葵难得地主动握住了你的手，她的手心温暖而有力。', emotion: 'neutral' },
    { id: 'as_d7', speaker: 'aoi', text: '大地会记住一切…包括今晚，包括我们。', emotion: 'loving' },
  ],
  choices: [
    {
      id: 'as_c1',
      text: '那就让大地为我们作证吧。',
      affectionChange: 30,
      response: '…嗯。我们的故事，会像这座山一样，永远存在。',
      isBestChoice: true,
    },
    {
      id: 'as_c2',
      text: '和你在一起的时间永远不会嫌多。',
      affectionChange: 20,
      response: '…你真是…让人没办法呢。',
      isBestChoice: false,
    },
    {
      id: 'as_c3',
      text: '山顶的风景真好。',
      affectionChange: 10,
      response: '嗯…有你在的风景，都很好。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_aoi_stargazing',
    cardObtained: 'card_aoi_stargazing',
    flagSet: { aoi_mountain_bond: true },
  },
};

// ==================== 天音柚（雷属性）约会事件 ====================

const yuzuArena: DateEvent = {
  id: 'date_yuzu_arena',
  characterId: 'yuzu',
  title: '雷神竞技',
  description: '与柚一起参加雷属性魔法竞技大赛。',
  location: '竞技场',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'ya_d1', speaker: 'yuzu', text: '嘿嘿！今天的竞技赛，我们组队参加吧！', emotion: 'fired_up' },
    { id: 'ya_d2', speaker: 'narrator', text: '天音柚浑身闪烁着电弧，跃跃欲试。', emotion: 'neutral' },
    { id: 'ya_d3', speaker: 'yuzu', text: '看我的！雷光一闪！', emotion: 'intense' },
    { id: 'ya_d4', speaker: 'narrator', text: '柚的雷电魔法在竞技场中大放异彩，速度快得令人眼花缭乱。', emotion: 'neutral' },
    { id: 'ya_d5', speaker: 'yuzu', text: '我们赢啦！太棒了！', emotion: 'triumphant' },
    { id: 'ya_d6', speaker: 'narrator', text: '赢得比赛后，柚兴奋地跳了起来，身上的电弧噼啪作响。', emotion: 'neutral' },
    { id: 'ya_d7', speaker: 'yuzu', text: '和你搭档就是默契！下次我们还要一起比赛！', emotion: 'happy' },
  ],
  choices: [
    {
      id: 'ya_c1',
      text: '你的雷电魔法真帅！',
      affectionChange: 15,
      response: '嘿嘿，那当然！不过你的配合也很棒啦！',
      isBestChoice: true,
    },
    {
      id: 'ya_c2',
      text: '好厉害，差点电到我。',
      affectionChange: 8,
      response: '啊！对不起对不起！我下次注意控制！',
      isBestChoice: false,
    },
    {
      id: 'ya_c3',
      text: '打得不错，但还有进步空间。',
      affectionChange: 10,
      response: '哼！我可是很强的！下次让你见识真正的力量！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_yuzu_arena',
    flagSet: { yuzu_arena_complete: true },
  },
  giftOptions: [
    { id: 'gift_yuzu_battery', name: '雷晶电池', description: '可以储存雷电能量的小道具', cost: 400, affectionBonus: 8 },
    { id: 'gift_yuzu_headband', name: '电光头带', description: '闪闪发光的运动头带', cost: 600, affectionBonus: 10 },
  ],
};

const yuzuShopping: DateEvent = {
  id: 'date_yuzu_shopping',
  characterId: 'yuzu',
  title: '购物约会',
  description: '与柚一起在商业街享受购物的乐趣。',
  location: '星辉商业街',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'ys_d1', speaker: 'yuzu', text: '商业街！我来啦！今天要把想买的东西都买了！', emotion: 'ecstatic' },
    { id: 'ys_d2', speaker: 'narrator', text: '柚像一阵旋风一样冲进了商业街，你赶紧跟上。', emotion: 'neutral' },
    { id: 'ys_d3', speaker: 'yuzu', text: '这个好可爱！那个也好可爱！哇，这个也想要！', emotion: 'overwhelmed' },
    { id: 'ys_d4', speaker: 'narrator', text: '柚在每家店前都停下来，对各种小物件爱不释手。', emotion: 'neutral' },
    { id: 'ys_d5', speaker: 'yuzu', text: '啊…买太多了…钱包要空了…', emotion: 'worried' },
    { id: 'ys_d6', speaker: 'narrator', text: '你帮柚提着大包小包，她则在一旁不好意思地笑着。', emotion: 'neutral' },
    { id: 'ys_d7', speaker: 'yuzu', text: '谢谢你帮我拿东西！下次我请你吃东西！', emotion: 'grateful' },
  ],
  choices: [
    {
      id: 'ys_c1',
      text: '不用客气，看你开心我就满足了。',
      affectionChange: 18,
      response: '你…你真是的！别老说这种话啦！但是…谢谢！',
      isBestChoice: true,
    },
    {
      id: 'ys_c2',
      text: '你买的东西都好可爱啊。',
      affectionChange: 12,
      response: '对吧对吧！我眼光很好的！',
      isBestChoice: false,
    },
    {
      id: 'ys_c3',
      text: '你的购物能力真可怕…',
      affectionChange: 5,
      response: '什么意思啦！这叫会享受生活！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 12,
    cgUnlocked: 'cg_yuzu_shopping',
    cardObtained: 'card_yuzu_shopping',
  },
};

const yuzuCookBattle: DateEvent = {
  id: 'date_yuzu_cook_battle',
  characterId: 'yuzu',
  title: '料理对决',
  description: '与柚进行一场充满火花的料理比赛。',
  location: '学院厨房',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'ycb_d1', speaker: 'yuzu', text: '料理对决开始！看谁做得更好吃！', emotion: 'competitive' },
    { id: 'ycb_d2', speaker: 'narrator', text: '两人的料理台相对而立，空气中弥漫着紧张的气息。', emotion: 'neutral' },
    { id: 'ycb_d3', speaker: 'yuzu', text: '我要做的是…电击烤肉！用雷电瞬间加热！', emotion: 'excited' },
    { id: 'ycb_d4', speaker: 'narrator', text: '柚用精准的雷电魔法控制火候，动作干净利落。', emotion: 'neutral' },
    { id: 'ycb_d5', speaker: 'yuzu', text: '完成了！来，互相品尝吧！', emotion: 'confident' },
    { id: 'ycb_d6', speaker: 'narrator', text: '两人的料理各有特色，难分高下。', emotion: 'neutral' },
    { id: 'ycb_d7', speaker: 'yuzu', text: '平局！不过…和你一起做饭真的很开心！', emotion: 'joyful' },
  ],
  choices: [
    {
      id: 'ycb_c1',
      text: '以后我们经常一起做饭吧。',
      affectionChange: 20,
      response: '好呀！我还要挑战你一百次！',
      isBestChoice: true,
    },
    {
      id: 'ycb_c2',
      text: '你的电击烤肉太厉害了！',
      affectionChange: 12,
      response: '嘿嘿！这是我的独门绝技！',
      isBestChoice: false,
    },
    {
      id: 'ycb_c3',
      text: '你的料理出乎意料地好吃。',
      affectionChange: 10,
      response: '什么叫出乎意料啊！我一直都很会做好吗！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 18,
    cgUnlocked: 'cg_yuzu_cook_battle',
    flagSet: { yuzu_cook_battle_complete: true },
  },
};

const yuzuArcade: DateEvent = {
  id: 'date_yuzu_arcade',
  characterId: 'yuzu',
  title: '电玩城',
  description: '与柚一起在电玩城度过充满欢笑的时光。',
  location: '魔法电玩城',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'yarc_d1', speaker: 'yuzu', text: '电玩城！这里是我的主场！', emotion: 'triumphant' },
    { id: 'yarc_d2', speaker: 'narrator', text: '闪烁的霓虹灯和欢快的电子音乐充满了整个空间。', emotion: 'neutral' },
    { id: 'yarc_d3', speaker: 'yuzu', text: '来比赛赛车游戏！我可是全服第一！', emotion: 'boastful' },
    { id: 'yarc_d4', speaker: 'narrator', text: '柚的操作速度快得惊人，反应能力堪比真正的闪电。', emotion: 'neutral' },
    { id: 'yarc_d5', speaker: 'yuzu', text: '啊！我赢了！再来再来！这次玩格斗游戏！', emotion: 'gloating' },
    { id: 'yarc_d6', speaker: 'narrator', text: '两人在各种游戏机前玩得不亦乐乎，笑声不断。', emotion: 'neutral' },
    { id: 'yarc_d7', speaker: 'yuzu', text: '今天真开心！和你一起玩游戏比自己玩有意思多了！', emotion: 'content' },
  ],
  choices: [
    {
      id: 'yarc_c1',
      text: '因为你是个好对手，也很好的同伴。',
      affectionChange: 22,
      response: '嘿嘿…你也一样！下次我们再来！',
      isBestChoice: true,
    },
    {
      id: 'yarc_c2',
      text: '你的反应速度太快了，我根本追不上。',
      affectionChange: 12,
      response: '哈哈！这可是雷属性的天赋优势！',
      isBestChoice: false,
    },
    {
      id: 'yarc_c3',
      text: '玩够了吧，该回去了。',
      affectionChange: 5,
      response: '诶~再玩一会儿嘛！就一会儿！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 22,
    cgUnlocked: 'cg_yuzu_arcade',
    cardObtained: 'card_yuzu_arcade',
  },
};

const yuzuObservatory: DateEvent = {
  id: 'date_yuzu_observatory',
  characterId: 'yuzu',
  title: '天文台',
  description: '与柚一起在天文台观测星空和雷暴云层。',
  location: '学院天文台',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'yo_d1', speaker: 'yuzu', text: '今晚有雷暴！在天文台上看一定很壮观！', emotion: 'thrilled' },
    { id: 'yo_d2', speaker: 'narrator', text: '远处的天际电闪雷鸣，而头顶却是繁星点点。', emotion: 'neutral' },
    { id: 'yo_d3', speaker: 'yuzu', text: '你看！那道闪电好漂亮！它好像在跳舞！', emotion: 'awestruck' },
    { id: 'yo_d4', speaker: 'narrator', text: '柚的眼中映着闪电的光芒，她的表情比任何时候都要灿烂。', emotion: 'neutral' },
    { id: 'yo_d5', speaker: 'yuzu', text: '闪电虽然只有一瞬间…但那一瞬间却是最耀眼的。', emotion: 'philosophical' },
    { id: 'yo_d6', speaker: 'yuzu', text: '就像…遇见你的那一刻。虽然短暂，却改变了我的一切。', emotion: 'sincere' },
    { id: 'yo_d7', speaker: 'narrator', text: '柚靠在你的怀里，一起看着远处的闪电在云层间跳跃。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'yo_c1',
      text: '你比任何闪电都要耀眼。',
      affectionChange: 30,
      response: '…！你…你总是说这种话…呜…太犯规了…',
      isBestChoice: true,
    },
    {
      id: 'yo_c2',
      text: '雷暴确实很壮观。',
      affectionChange: 10,
      response: '嗯！大自然的力量真了不起！',
      isBestChoice: false,
    },
    {
      id: 'yo_c3',
      text: '和你在一起的每一刻都很耀眼。',
      affectionChange: 25,
      response: '你…你…呜呜，我要怎么回你这种话啦！',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_yuzu_observatory',
    cardObtained: 'card_yuzu_observatory',
    flagSet: { yuzu_lightning_bond: true },
  },
};

// ==================== 白石真白（光属性）约会事件 ====================

const mashiroChurch: DateEvent = {
  id: 'date_mashiro_church',
  characterId: 'mashiro',
  title: '教堂祈祷',
  description: '与真白一起在学院的小教堂中祈祷，感受光之魔法的温暖。',
  location: '学院教堂',
  requiredAffection: 30,
  chapter: 2,
  dialogues: [
    { id: 'mch_d1', speaker: 'mashiro', text: '这里好安静…让人心情平静。', emotion: 'peaceful' },
    { id: 'mch_d2', speaker: 'narrator', text: '阳光透过彩色玻璃窗洒进来，在地面上投下斑斓的光影。', emotion: 'neutral' },
    { id: 'mch_d3', speaker: 'mashiro', text: '我每天都会来这里祈祷…祈祷大家都能幸福。', emotion: 'gentle' },
    { id: 'mch_d4', speaker: 'player', text: '你真的很善良。', emotion: 'warm' },
    { id: 'mch_d5', speaker: 'mashiro', text: '没有啦…我只是觉得，如果能为别人做些什么，自己也会很开心。', emotion: 'humble' },
    { id: 'mch_d6', speaker: 'narrator', text: '真白双手合十，金色的光芒从她身上散发出来，充满了整个教堂。', emotion: 'neutral' },
    { id: 'mch_d7', speaker: 'mashiro', text: '今天的祈祷里…我加上了你的名字哦。', emotion: 'shy' },
  ],
  choices: [
    {
      id: 'mch_c1',
      text: '谢谢你，我也为你祈祷了。',
      affectionChange: 18,
      response: '真的吗？…我好高兴…谢谢你。',
      isBestChoice: true,
    },
    {
      id: 'mch_c2',
      text: '你的光魔法真的很温暖。',
      affectionChange: 12,
      response: '这是光之魔法的本质…温暖每一个人的心。',
      isBestChoice: false,
    },
    {
      id: 'mch_c3',
      text: '教堂的氛围确实让人心安。',
      affectionChange: 8,
      response: '嗯…而且和你一起，就更安心了。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 10,
    cgUnlocked: 'cg_mashiro_church',
    flagSet: { mashiro_church_complete: true },
  },
  giftOptions: [
    { id: 'gift_mashiro_rosary', name: '光之念珠', description: '蕴含光之力的祈祷念珠', cost: 800, affectionBonus: 12 },
    { id: 'gift_mashiro_candle', name: '永恒之烛', description: '永不熄灭的祝福之烛', cost: 600, affectionBonus: 10 },
  ],
};

const mashiroPicnic: DateEvent = {
  id: 'date_mashiro_picnic',
  characterId: 'mashiro',
  title: '花园野餐',
  description: '与真白一起在学院花园中享受悠闲的野餐时光。',
  location: '学院花园',
  requiredAffection: 45,
  chapter: 3,
  dialogues: [
    { id: 'mp_d1', speaker: 'mashiro', text: '我做了便当！希望合你的口味…', emotion: 'hopeful' },
    { id: 'mp_d2', speaker: 'narrator', text: '真白铺好野餐垫，打开精心准备的便当盒。', emotion: 'neutral' },
    { id: 'mp_d3', speaker: 'mashiro', text: '有饭团、玉子烧、还有炸虾…都是我亲手做的。', emotion: 'proud' },
    { id: 'mp_d4', speaker: 'narrator', text: '便当做得非常精致，每一样都让人食欲大开。', emotion: 'neutral' },
    { id: 'mp_d5', speaker: 'mashiro', text: '啊，蝴蝶！好漂亮…', emotion: 'delighted' },
    { id: 'mp_d6', speaker: 'narrator', text: '一只白色的蝴蝶停在了真白的指尖，仿佛被她的光之气息吸引。', emotion: 'neutral' },
    { id: 'mp_d7', speaker: 'mashiro', text: '能和你一起这样悠闲地吃午饭…真的好幸福。', emotion: 'content' },
  ],
  choices: [
    {
      id: 'mp_c1',
      text: '你的便当太好吃了！每天都想吃！',
      affectionChange: 18,
      response: '真的吗？那…我每天都给你做！',
      isBestChoice: true,
    },
    {
      id: 'mp_c2',
      text: '蝴蝶都被你的温柔吸引了。',
      affectionChange: 15,
      response: '才…才没有那回事…不过，蝴蝶真的很可爱呢。',
      isBestChoice: false,
    },
    {
      id: 'mp_c3',
      text: '这个三明治味道不错。',
      affectionChange: 8,
      response: '太好了…我研究了好久食谱呢。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 12,
    cgUnlocked: 'cg_mashiro_picnic',
    cardObtained: 'card_mashiro_picnic',
  },
};

const mashiroVolunteer: DateEvent = {
  id: 'date_mashiro_volunteer',
  characterId: 'mashiro',
  title: '义工活动',
  description: '与真白一起参加社区义工活动，帮助有需要的人。',
  location: '社区中心',
  requiredAffection: 60,
  chapter: 4,
  dialogues: [
    { id: 'mv_d1', speaker: 'mashiro', text: '今天要帮忙照顾社区里的老人家们，你准备好了吗？', emotion: 'determined' },
    { id: 'mv_d2', speaker: 'narrator', text: '真白熟练地和老人们打招呼，她的笑容让每个人都感到温暖。', emotion: 'neutral' },
    { id: 'mv_d3', speaker: 'mashiro', text: '奶奶，我来帮您量血压。放心，不会疼的。', emotion: 'caring' },
    { id: 'mv_d4', speaker: 'narrator', text: '真白用光之魔法治愈了一位老人的小伤，对方感激地握住她的手。', emotion: 'neutral' },
    { id: 'mv_d5', speaker: 'mashiro', text: '帮助别人的时候，我会觉得自己的存在是有意义的。', emotion: 'fulfilled' },
    { id: 'mv_d6', speaker: 'narrator', text: '忙碌了一整天，真白虽然疲惫但眼神中充满了满足。', emotion: 'neutral' },
    { id: 'mv_d7', speaker: 'mashiro', text: '谢谢你今天来帮忙…有你在，我能做更多的事情。', emotion: 'grateful' },
  ],
  choices: [
    {
      id: 'mv_c1',
      text: '能和你一起帮助别人，我也很开心。',
      affectionChange: 22,
      response: '…我们以后也一起继续做义工吧！',
      isBestChoice: true,
    },
    {
      id: 'mv_c2',
      text: '你对每个人都很温柔。',
      affectionChange: 12,
      response: '因为大家都值得被温柔对待啊。',
      isBestChoice: false,
    },
    {
      id: 'mv_c3',
      text: '你累了吧？休息一下。',
      affectionChange: 15,
      response: '嗯…有你关心，疲劳都减轻了。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 18,
    cgUnlocked: 'cg_mashiro_volunteer',
    flagSet: { mashiro_volunteer_complete: true },
  },
};

const mashiroMoonwalk: DateEvent = {
  id: 'date_mashiro_moonwalk',
  characterId: 'mashiro',
  title: '月下散步',
  description: '与真白一起在月光下散步，享受宁静的夜晚。',
  location: '学院湖畔',
  requiredAffection: 80,
  chapter: 5,
  dialogues: [
    { id: 'mm_d1', speaker: 'mashiro', text: '今晚的月亮好圆好亮啊…', emotion: 'dreamy' },
    { id: 'mm_d2', speaker: 'narrator', text: '湖面上倒映着皎洁的月光，四周静谧而美好。', emotion: 'neutral' },
    { id: 'mm_d3', speaker: 'mashiro', text: '月光和我的光魔法…虽然不一样，但都希望能照亮别人的路。', emotion: 'reflective' },
    { id: 'mm_d4', speaker: 'narrator', text: '真白轻轻伸出手，金色的光芒与银白的月光交织在一起。', emotion: 'neutral' },
    { id: 'mm_d5', speaker: 'mashiro', text: '以前我总觉得自己的光不够亮…', emotion: 'vulnerable' },
    { id: 'mm_d6', speaker: 'mashiro', text: '但是遇见你之后…我感觉自己变得更有力量了。', emotion: 'hopeful' },
    { id: 'mm_d7', speaker: 'narrator', text: '真白抬头看着你，月光下的她美得不可方物。', emotion: 'neutral' },
  ],
  choices: [
    {
      id: 'mm_c1',
      text: '你的光一直都很耀眼，只是你没发现而已。',
      affectionChange: 25,
      response: '…谢谢你。能被你这样说…我真的好开心…',
      isBestChoice: true,
    },
    {
      id: 'mm_c2',
      text: '月光下的你格外美丽。',
      affectionChange: 18,
      response: '你…你在说什么啦…不要看我…',
      isBestChoice: false,
    },
    {
      id: 'mm_c3',
      text: '今晚的风景确实很美。',
      affectionChange: 10,
      response: '嗯…和你一起看的风景，都特别美。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 22,
    cgUnlocked: 'cg_mashiro_moonwalk',
    cardObtained: 'card_mashiro_moonwalk',
  },
};

const mashiroCeremony: DateEvent = {
  id: 'date_mashiro_ceremony',
  characterId: 'mashiro',
  title: '圣光仪式',
  description: '与真白一起参加古老的圣光仪式，见证光之魔法的奇迹。',
  location: '圣光大殿',
  requiredAffection: 100,
  chapter: 7,
  dialogues: [
    { id: 'mcer_d1', speaker: 'mashiro', text: '今天是百年一度的圣光仪式…我一直期待着这一天。', emotion: 'reverent' },
    { id: 'mcer_d2', speaker: 'narrator', text: '圣光大殿中，无数光之结晶悬浮在空中，散发出温暖的光芒。', emotion: 'neutral' },
    { id: 'mcer_d3', speaker: 'mashiro', text: '传说在圣光仪式上，光之精灵会降临，祝福真心相爱的人。', emotion: 'hopeful' },
    { id: 'mcer_d4', speaker: 'narrator', text: '真白站在光之结晶的中心，她的身上绽放出耀眼的金色光芒。', emotion: 'neutral' },
    { id: 'mcer_d5', speaker: 'mashiro', text: '光精灵们…我听到了它们的声音…', emotion: 'awed' },
    { id: 'mcer_d6', speaker: 'mashiro', text: '它们说…我们的爱…是真实而纯粹的…', emotion: 'overwhelmed' },
    { id: 'mcer_d7', speaker: 'narrator', text: '圣光环绕着两人，仿佛整个世界都在祝福着这对有情人。', emotion: 'neutral' },
    { id: 'mcer_d8', speaker: 'mashiro', text: '这是最美好的祝福…谢谢你，一直在我身边。', emotion: 'loving' },
  ],
  choices: [
    {
      id: 'mcer_c1',
      text: '这是我最大的幸福，能和你在一起。',
      affectionChange: 30,
      response: '嗯…让我们一起，把这份光明带给更多的人吧。',
      isBestChoice: true,
    },
    {
      id: 'mcer_c2',
      text: '你和光精灵们一样美丽。',
      affectionChange: 20,
      response: '我才没有那么厉害…不过，谢谢你。',
      isBestChoice: false,
    },
    {
      id: 'mcer_c3',
      text: '这个仪式真的很神圣。',
      affectionChange: 15,
      response: '嗯…有你在身边，这份神圣变得更加真实了。',
      isBestChoice: false,
    },
  ],
  rewards: {
    affectionGain: 30,
    cgUnlocked: 'cg_mashiro_ceremony',
    cardObtained: 'card_mashiro_ceremony',
    flagSet: { mashiro_light_bond: true },
  },
};

// ==================== 导出所有约会事件 ====================

export const DATE_EVENTS: DateEvent[] = [
  // 星野樱的约会事件
  sakuraHanabi,
  sakuraCooking,
  sakuraTraining,
  sakuraOnsen,
  sakuraAltar,
  // 月岛凛的约会事件
  rinLibrary,
  rinTea,
  rinSnow,
  rinConcert,
  rinIceGarden,
  // 风间铃的约会事件
  suzuKite,
  suzuFlowerField,
  suzuAmusement,
  suzuCamping,
  suzuFairyFest,
  // 石神葵的约会事件
  aoiMining,
  aoiAlchemy,
  aoiMuseum,
  aoiRuin,
  aoiStargazing,
  // 天音柚的约会事件
  yuzuArena,
  yuzuShopping,
  yuzuCookBattle,
  yuzuArcade,
  yuzuObservatory,
  // 白石真白的约会事件
  mashiroChurch,
  mashiroPicnic,
  mashiroVolunteer,
  mashiroMoonwalk,
  mashiroCeremony,
];

/**
 * 根据角色ID获取该角色的所有约会事件
 * @param characterId 角色ID
 * @returns 该角色的约会事件数组
 */
export function getDateEventsByCharacter(characterId: string): DateEvent[] {
  return DATE_EVENTS.filter(event => event.characterId === characterId);
}

/**
 * 根据章节获取该章节可触发的约会事件
 * @param chapter 章节号
 * @returns 该章节的约会事件数组
 */
export function getDateEventsByChapter(chapter: number): DateEvent[] {
  return DATE_EVENTS.filter(event => event.chapter === chapter);
}

/**
 * 根据好感度获取当前可触发的约会事件
 * @param characterId 角色ID
 * @param affection 当前好感度
 * @returns 可触发的约会事件数组
 */
export function getAvailableDateEvents(characterId: string, affection: number): DateEvent[] {
  return DATE_EVENTS.filter(
    event => event.characterId === characterId && event.requiredAffection <= affection
  );
}

/**
 * 根据ID获取特定的约会事件
 * @param eventId 事件ID
 * @returns 约会事件或undefined
 */
export function getDateEventById(eventId: string): DateEvent | undefined {
  return DATE_EVENTS.find(event => event.id === eventId);
}
