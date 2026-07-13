/**
 * 星辉魔法学院 - 游戏结局数据
 * 包含所有结局的条件、对话预览和奖励
 */

// 结局接口定义
export interface Ending {
  id: string;
  characterId?: string;
  type: 'good' | 'bad' | 'true' | 'hidden';
  name: string;
  subtitle: string;
  description: string;
  conditions: { type: string; key: string; value: any }[];
  dialoguePreview: string[];
  cgImage: string;
  bgm: string;
  rewards: { type: string; id: string }[];
}

// ==================== 好结局 ====================

const sakuraGoodEnding: Ending = {
  id: 'ending_sakura_good',
  characterId: 'sakura',
  type: 'good',
  name: '永恒的火焰之誓',
  subtitle: '与星野樱的幸福未来',
  description: '你与樱的感情在火焰祭坛的见证下开花结果。两人携手并肩，共同守护着彼此和星辉魔法学院。樱的火焰因爱而更加炽热，而你也找到了愿意用一生守护的人。',
  conditions: [
    { type: 'affection', key: 'sakura', value: 120 },
    { type: 'flag', key: 'sakura_altar_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'sakura_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '樱：你真的愿意和我一起走下去吗？',
    '我：从今以后，无论是火焰还是风暴，我都会陪在你身边。',
    '樱：谢谢你…能遇见你，是我这辈子最大的幸福。',
    '（火焰祭坛的光芒将两人包围，象征着永恒的羁绊。）',
  ],
  cgImage: 'cg_ending_sakura_good',
  bgm: 'bgm_ending_fire',
  rewards: [
    { type: 'cg', id: 'cg_ending_sakura_good' },
    { type: 'card', id: 'card_sakura_ending' },
    { type: 'title', id: 'title_fire_guardian' },
  ],
};

const rinGoodEnding: Ending = {
  id: 'ending_rin_good',
  characterId: 'rin',
  type: 'good',
  name: '永恒冰晶之约',
  subtitle: '与月岛凛的温暖未来',
  description: '你融化了凛心中的坚冰，让她学会了信任与爱。冰之花园不再是秘密，而是两人共同的避风港。凛用永恒冰晶保存着每一个与你共度的美好瞬间。',
  conditions: [
    { type: 'affection', key: 'rin', value: 120 },
    { type: 'flag', key: 'rin_ice_garden_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'rin_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '凛：你…真的不后悔选择我吗？',
    '我：你是我见过最美的风景，比任何冰晶都要闪耀。',
    '凛：…笨蛋。这种话…我会记一辈子的。',
    '（冰之花园绽放出前所未有的光芒，仿佛在祝福着两人。）',
  ],
  cgImage: 'cg_ending_rin_good',
  bgm: 'bgm_ending_ice',
  rewards: [
    { type: 'cg', id: 'cg_ending_rin_good' },
    { type: 'card', id: 'card_rin_ending' },
    { type: 'title', id: 'title_ice_heart' },
  ],
};

const suzuGoodEnding: Ending = {
  id: 'ending_suzu_good',
  characterId: 'suzu',
  type: 'good',
  name: '风之精灵的祝福',
  subtitle: '与风间铃的欢乐未来',
  description: '你与铃的笑声成为了学院最美的风景。风精灵们见证了你们的爱情，赐予了永远陪伴的祝福。铃的风不再漂泊，因为她找到了归宿——你的怀抱。',
  conditions: [
    { type: 'affection', key: 'suzu', value: 120 },
    { type: 'flag', key: 'suzu_fairy_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'suzu_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '铃：你知道吗？风精灵们说它们很喜欢你！',
    '我：那它们有没有告诉你，我比它们更喜欢你？',
    '铃：呜…你又说这种话！但是…我也最喜欢你了！',
    '（风精灵们围绕着两人飞舞，带来花瓣和祝福。）',
  ],
  cgImage: 'cg_ending_suzu_good',
  bgm: 'bgm_ending_wind',
  rewards: [
    { type: 'cg', id: 'cg_ending_suzu_good' },
    { type: 'card', id: 'card_suzu_ending' },
    { type: 'title', id: 'title_wind_partner' },
  ],
};

const aoiGoodEnding: Ending = {
  id: 'ending_aoi_good',
  characterId: 'aoi',
  type: 'good',
  name: '大地的永恒誓言',
  subtitle: '与石神葵的坚定未来',
  description: '你成为了葵心中最珍贵的存在，比任何矿石都要闪耀。大地见证了你们的爱情，磐石山顶的誓言将永远铭刻在时间之中。葵学会了敞开心扉，而你收获了最坚实的依靠。',
  conditions: [
    { type: 'affection', key: 'aoi', value: 120 },
    { type: 'flag', key: 'aoi_mountain_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'aoi_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '葵：你确定要和一个只会和石头说话的人在一起吗？',
    '我：你比任何宝石都要珍贵，我愿意用一辈子来守护你。',
    '葵：…谢谢你接受这样的我。从今以后，我的大地就是你。',
    '（磐石山顶的星空下，两人的誓言融入了永恒的大地。）',
  ],
  cgImage: 'cg_ending_aoi_good',
  bgm: 'bgm_ending_earth',
  rewards: [
    { type: 'cg', id: 'cg_ending_aoi_good' },
    { type: 'card', id: 'card_aoi_ending' },
    { type: 'title', id: 'title_earth_keeper' },
  ],
};

const yuzuGoodEnding: Ending = {
  id: 'ending_yuzu_good',
  characterId: 'yuzu',
  type: 'good',
  name: '雷电中的永恒之光',
  subtitle: '与天音柚的闪耀未来',
  description: '你成为了柚生命中最耀眼的存在，比任何闪电都要夺目。雷电不再是孤独的闪光，而是两人共同谱写的乐章。柚学会了用温柔的心去感受世界，而你收获了最灿烂的笑容。',
  conditions: [
    { type: 'affection', key: 'yuzu', value: 120 },
    { type: 'flag', key: 'yuzu_lightning_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'yuzu_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '柚：嘿嘿，我终于找到比闪电还耀眼的东西了！',
    '我：是什么？',
    '柚：就是你啊！笨蛋！',
    '（雷电在远处闪烁，但两人的世界里只有温暖的光。）',
  ],
  cgImage: 'cg_ending_yuzu_good',
  bgm: 'bgm_ending_lightning',
  rewards: [
    { type: 'cg', id: 'cg_ending_yuzu_good' },
    { type: 'card', id: 'card_yuzu_ending' },
    { type: 'title', id: 'title_lightning_spark' },
  ],
};

const mashiroGoodEnding: Ending = {
  id: 'ending_mashiro_good',
  characterId: 'mashiro',
  type: 'good',
  name: '圣光中的永恒祝福',
  subtitle: '与白石真白的光明未来',
  description: '你成为了真白心中最温暖的光，照亮了她前行的道路。圣光仪式见证了你们的爱情，光精灵们降下了最真挚的祝福。真白的光芒因爱而更加闪耀，而你找到了愿意守护一生的天使。',
  conditions: [
    { type: 'affection', key: 'mashiro', value: 120 },
    { type: 'flag', key: 'mashiro_light_bond', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'choice', key: 'mashiro_final_choice', value: 'confess' },
  ],
  dialoguePreview: [
    '真白：我终于明白了…光的意义就是照亮身边的人。',
    '我：而你，就是照亮我生命的那束光。',
    '真白：谢谢你…让我知道被爱是什么感觉。',
    '（圣光环绕着两人，光精灵们唱起了祝福之歌。）',
  ],
  cgImage: 'cg_ending_mashiro_good',
  bgm: 'bgm_ending_light',
  rewards: [
    { type: 'cg', id: 'cg_ending_mashiro_good' },
    { type: 'card', id: 'card_mashiro_ending' },
    { type: 'title', id: 'title_light_guardian' },
  ],
};

// ==================== 坏结局 ====================

const sakuraBadEnding: Ending = {
  id: 'ending_sakura_bad',
  characterId: 'sakura',
  type: 'bad',
  name: '熄灭的火焰',
  subtitle: '与星野樱的遗憾离别',
  description: '因为好感度不足或关键选择失误，你与樱的关系渐行渐远。火焰祭坛的光芒黯淡，樱独自一人走向了远方。曾经炽热的感情，最终化为了灰烬。',
  conditions: [
    { type: 'affection', key: 'sakura', value: 60 },
    { type: 'comparison', key: 'sakura', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '樱：也许…我们不太合适吧。',
    '我：樱…',
    '樱：对不起，我需要时间一个人静一静。',
    '（火焰祭坛的光芒逐渐熄灭，只剩下冰冷的石壁。）',
  ],
  cgImage: 'cg_ending_sakura_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_sakura_bad' },
    { type: 'title', id: 'title_lost_flame' },
  ],
};

const rinBadEnding: Ending = {
  id: 'ending_rin_bad',
  characterId: 'rin',
  type: 'bad',
  name: '融化的冰晶',
  subtitle: '与月岛凛的无声告别',
  description: '你未能走进凛的内心世界，冰之花园的大门永远地关闭了。凛回到了一个人的世界，那些曾经的温暖瞬间，如同融化的冰晶般消失无踪。',
  conditions: [
    { type: 'affection', key: 'rin', value: 60 },
    { type: 'comparison', key: 'rin', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '凛：你不用再来了。',
    '我：凛…给我一次机会…',
    '凛：机会？我已经给过你很多次了。再见。',
    '（冰之花园的门缓缓关闭，将所有的温暖隔绝在外。）',
  ],
  cgImage: 'cg_ending_rin_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_rin_bad' },
    { type: 'title', id: 'title_frozen_heart' },
  ],
};

const suzuBadEnding: Ending = {
  id: 'ending_suzu_bad',
  characterId: 'suzu',
  type: 'bad',
  name: '消散的风',
  subtitle: '与风间铃的渐行渐远',
  description: '你没有珍惜与铃在一起的时光，风精灵们带走了它们的祝福。铃的笑容变得勉强，最终像风一样消失在你的世界里。',
  conditions: [
    { type: 'affection', key: 'suzu', value: 60 },
    { type: 'comparison', key: 'suzu', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '铃：你…是不是觉得我很烦？',
    '我：怎么会…',
    '铃：算了，不用安慰我了。风…也要去别的地方了。',
    '（铃转身离去，只留下一缕微风拂过你的脸庞。）',
  ],
  cgImage: 'cg_ending_suzu_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_suzu_bad' },
    { type: 'title', id: 'title_scattered_wind' },
  ],
};

const aoiBadEnding: Ending = {
  id: 'ending_aoi_bad',
  characterId: 'aoi',
  type: 'bad',
  name: '碎裂的矿石',
  subtitle: '与石神葵的沉默离别',
  description: '你未能理解葵沉默背后的温柔，大地之心碎裂成了无数碎片。葵回到了矿洞深处，将自己封闭在岩石的堡垒中，不再向任何人敞开心扉。',
  conditions: [
    { type: 'affection', key: 'aoi', value: 60 },
    { type: 'comparison', key: 'aoi', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '葵：你…不懂我。',
    '我：葵，我可以试着去理解…',
    '葵：不用了。有些东西碎了就碎了。再见。',
    '（葵转身走入矿洞深处，岩石的门缓缓关闭。）',
  ],
  cgImage: 'cg_ending_aoi_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_aoi_bad' },
    { type: 'title', id: 'title_broken_earth' },
  ],
};

const yuzuBadEnding: Ending = {
  id: 'ending_yuzu_bad',
  characterId: 'yuzu',
  type: 'bad',
  name: '暗淡的雷光',
  subtitle: '与天音柚的遗憾错过',
  description: '你没有回应柚的热情，她眼中的光芒逐渐黯淡。曾经闪耀如闪电的女孩，变得沉默寡言，最终消失在茫茫人海中。',
  conditions: [
    { type: 'affection', key: 'yuzu', value: 60 },
    { type: 'comparison', key: 'yuzu', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '柚：我…是不是太吵了？',
    '我：柚…',
    '柚：没关系，我明白了。以后…不会再来打扰你了。',
    '（柚转身离开，身上的电弧微弱地闪烁了几下，然后彻底熄灭。）',
  ],
  cgImage: 'cg_ending_yuzu_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_yuzu_bad' },
    { type: 'title', id: 'title_dim_thunder' },
  ],
};

const mashiroBadEnding: Ending = {
  id: 'ending_mashiro_bad',
  characterId: 'mashiro',
  type: 'bad',
  name: '黯淡的圣光',
  subtitle: '与白石真白的温柔离别',
  description: '你没有珍惜真白的温柔，她心中的光芒逐渐黯淡。教堂的祈祷变得空洞，曾经温暖的圣光只剩下冰冷的余晖。真白独自走向了远方，寻找属于自己的救赎。',
  conditions: [
    { type: 'affection', key: 'mashiro', value: 60 },
    { type: 'comparison', key: 'mashiro', value: '<120' },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '真白：也许…我的光不够亮，照不进你的心里。',
    '我：真白…',
    '真白：没关系，我会继续祈祷的…只是不再为你了。再见。',
    '（教堂的彩色玻璃窗失去了往日的光彩，只剩下灰暗的光线。）',
  ],
  cgImage: 'cg_ending_mashiro_bad',
  bgm: 'bgm_ending_sad',
  rewards: [
    { type: 'cg', id: 'cg_ending_mashiro_bad' },
    { type: 'title', id: 'title_fading_light' },
  ],
};

// ==================== 后宫结局（隐藏真结局·恋爱最高成就） ====================

const haremEnding: Ending = {
  id: 'ending_harem',
  type: 'hidden',
  name: '星辉后宫·六花齐放',
  subtitle: '与六位少女的永恒誓约',
  description: '当所有六位少女的好感度都达到满级（150+），完成所有羁绊事件，且在最终选择时做出了"想要守护所有人"的抉择，你将解锁这个终极结局。暗影之王被击败后，六位少女终于坦诚了彼此的心意——她们都深爱着你，而你也无法从中做出选择。在星辰之声的祝福下，七人缔结了永恒的羁绊，共同成为星辉魔法学院新的传说。从此，你被六位各有特色的美丽少女环绕，每天都充满了甜蜜、吵闹与幸福。这就是属于你的、独一无二的——星辉后宫。',
  conditions: [
    { type: 'affection', key: 'sakura', value: 150 },
    { type: 'affection', key: 'rin', value: 150 },
    { type: 'affection', key: 'suzu', value: 150 },
    { type: 'affection', key: 'aoi', value: 150 },
    { type: 'affection', key: 'yuzu', value: 150 },
    { type: 'affection', key: 'mashiro', value: 150 },
    { type: 'flag', key: 'sakura_altar_bond', value: true },
    { type: 'flag', key: 'rin_ice_garden_bond', value: true },
    { type: 'flag', key: 'suzu_fairy_bond', value: true },
    { type: 'flag', key: 'aoi_mountain_bond', value: true },
    { type: 'flag', key: 'yuzu_lightning_bond', value: true },
    { type: 'flag', key: 'mashiro_light_bond', value: true },
    { type: 'flag', key: 'harem_choice', value: true },
    { type: 'chapter', key: 'current', value: 8 },
  ],
  dialoguePreview: [
    '樱：我…我不想让你为难。但是…我真的好喜欢你…',
    '凛：…我也是。虽然平时装作不在意，但我的心…早已被你占据。',
    '铃：呜…我也喜欢！最喜欢了！比任何人都喜欢！',
    '葵：……我不擅长说话。但是…我想一直和你在一起。',
    '柚：嘿嘿…既然大家都这么说了，我也要！我要永远和你在一起！',
    '真白：我的光芒…只为你一人闪耀。所以…请允许我留在你身边。',
    '我：大家…谢谢你们。既然这样…那就让我们所有人都在一起吧！',
    '星辰之声：羁绊的力量超越了一切。这份爱，将被星辰永远祝福。',
    '（六种元素的光芒与星辉交织在一起，七双手紧紧相握。）',
    '众少女：从今以后，永远不分开——！',
  ],
  cgImage: 'cg_ending_harem',
  bgm: 'bgm_ending_harem',
  rewards: [
    { type: 'cg', id: 'cg_ending_harem' },
    { type: 'cg', id: 'cg_harem_hot_spring' },
    { type: 'cg', id: 'cg_harem_beach' },
    { type: 'cg', id: 'cg_harem_wedding' },
    { type: 'card', id: 'card_harem_ending' },
    { type: 'title', id: 'title_stellar_lover' },
    { type: 'title', id: 'title_harem_king' },
    { type: 'item', id: 'item_eternal_bond_ring' },
    { type: 'achievement', id: 'ach_harem_ending' },
    { type: 'unlock', id: 'harem_epilogue' },
  ],
};

// ==================== 真结局 ====================

const trueEnding: Ending = {
  id: 'ending_true',
  type: 'true',
  name: '星辉永恒',
  subtitle: '星辉魔法学院的真正传说',
  description: '当所有角色的好感度都达到最高，且完成所有关键事件后，你将解锁真正的结局。在这个结局中，你将了解到星辉魔法学院的真正秘密，以及你作为"调和者"的使命。六位少女的羁绊汇聚在一起，共同守护着这片魔法之地。',
  conditions: [
    { type: 'affection', key: 'all', value: 100 },
    { type: 'flag', key: 'all_bonds', value: true },
    { type: 'chapter', key: 'current', value: 8 },
    { type: 'collection', key: 'cg', value: 90 },
    { type: 'collection', key: 'cards', value: 80 },
  ],
  dialoguePreview: [
    '神秘之声：你终于来了，调和者。',
    '我：调和者？这是什么意思？',
    '神秘之声：你是连接六种元素的纽带，是星辉魔法学院的守护者。',
    '樱/凛/铃/葵/柚/真白：我们一起，守护这个学院！',
    '（六种元素的光芒汇聚在一起，形成了璀璨的星辉。）',
  ],
  cgImage: 'cg_ending_true',
  bgm: 'bgm_ending_true',
  rewards: [
    { type: 'cg', id: 'cg_ending_true' },
    { type: 'card', id: 'card_true_ending' },
    { type: 'title', id: 'title_harmonizer' },
    { type: 'item', id: 'item_star_crystal' },
    { type: 'achievement', id: 'ach_true_ending' },
  ],
};

// ==================== 隐藏结局 ====================

const hiddenEnding: Ending = {
  id: 'ending_hidden',
  type: 'hidden',
  name: '时间的轮回',
  subtitle: '超越命运的奇迹',
  description: '这是一个极其隐秘的结局，只有在完成真结局后，再次通关游戏并做出特定的选择才能触发。在这个结局中，你发现了时间的真相——你并非第一次经历这一切。无数次的轮回中，你一直在寻找着拯救学院和少女们的方法。这一次，你终于找到了打破轮回的钥匙。',
  conditions: [
    { type: 'flag', key: 'true_ending_seen', value: true },
    { type: 'flag', key: 'new_game_plus', value: true },
    { type: 'secret', key: 'time_crystal_found', value: true },
    { type: 'secret', key: 'all_memories', value: true },
    { type: 'choice', key: 'final_loop_choice', value: 'break_loop' },
  ],
  dialoguePreview: [
    '???：你…还记得我吗？',
    '我：这个声音…好像在哪里听过…',
    '???：这是你第108次来到这里了。每一次，你都选择了不同的道路。',
    '我：108次？难道我一直在轮回？',
    '???：是的。但这一次…也许会不一样。因为你已经找到了答案。',
    '（时间的齿轮开始转动，命运的锁链逐渐碎裂。）',
    '众少女：这一次，我们一起打破命运！',
  ],
  cgImage: 'cg_ending_hidden',
  bgm: 'bgm_ending_hidden',
  rewards: [
    { type: 'cg', id: 'cg_ending_hidden' },
    { type: 'card', id: 'card_hidden_ending' },
    { type: 'title', id: 'title_time_breaker' },
    { type: 'item', id: 'item_time_key' },
    { type: 'achievement', id: 'ach_hidden_ending' },
    { type: 'unlock', id: 'gallery_secret' },
  ],
};

// ==================== 导出所有结局 ====================

export const ENDINGS: Ending[] = [
  // 好结局
  sakuraGoodEnding,
  rinGoodEnding,
  suzuGoodEnding,
  aoiGoodEnding,
  yuzuGoodEnding,
  mashiroGoodEnding,
  // 坏结局
  sakuraBadEnding,
  rinBadEnding,
  suzuBadEnding,
  aoiBadEnding,
  yuzuBadEnding,
  mashiroBadEnding,
  // 真结局
  trueEnding,
  // 后宫结局（最高隐藏成就）
  haremEnding,
  // 隐藏结局
  hiddenEnding,
];

/**
 * 根据ID获取特定结局
 * @param endingId 结局ID
 * @returns 结局对象或undefined
 */
export function getEndingById(endingId: string): Ending | undefined {
  return ENDINGS.find(ending => ending.id === endingId);
}

/**
 * 根据类型获取结局列表
 * @param type 结局类型
 * @returns 该类型的所有结局
 */
export function getEndingsByType(type: Ending['type']): Ending[] {
  return ENDINGS.filter(ending => ending.type === type);
}

/**
 * 根据角色ID获取该角色的结局
 * @param characterId 角色ID
 * @returns 该角色的好结局和坏结局
 */
export function getEndingsByCharacter(characterId: string): Ending[] {
  return ENDINGS.filter(ending => ending.characterId === characterId);
}

/**
 * 检查是否满足结局条件
 * @param ending 结局对象
 * @param gameState 游戏状态
 * @returns 是否满足条件
 */
export function checkEndingConditions(
  ending: Ending,
  gameState: {
    affections: Record<string, number>;
    flags: Record<string, boolean>;
    chapter: number;
    collections: { cg: number; cards: number };
    secrets: Record<string, boolean>;
    choices: Record<string, string>;
  }
): boolean {
  return ending.conditions.every(condition => {
    switch (condition.type) {
      case 'affection':
        if (condition.key === 'all') {
          return Object.values(gameState.affections).every(
            affection => affection >= condition.value
          );
        }
        return (gameState.affections[condition.key] || 0) >= condition.value;
      case 'flag':
        return gameState.flags[condition.key] === condition.value;
      case 'chapter':
        return gameState.chapter >= condition.value;
      case 'collection':
        if (condition.key === 'cg') {
          return gameState.collections.cg >= condition.value;
        }
        return gameState.collections.cards >= condition.value;
      case 'secret':
        return gameState.secrets[condition.key] === condition.value;
      case 'choice':
        return gameState.choices[condition.key] === condition.value;
      case 'comparison':
        // 用于处理 "好感度在某个范围内" 的条件
        const affection = gameState.affections[condition.key] || 0;
        const [op, val] = condition.value.split(/([<>=]+)/);
        const numVal = parseInt(val);
        switch (op) {
          case '<': return affection < numVal;
          case '>': return affection > numVal;
          case '<=': return affection <= numVal;
          case '>=': return affection >= numVal;
          default: return false;
        }
      default:
        return false;
    }
  });
}

/**
 * 获取所有已解锁的结局
 * @param unlockedEndings 已解锁的结局ID列表
 * @returns 已解锁的结局对象数组
 */
export function getUnlockedEndings(unlockedEndings: string[]): Ending[] {
  return ENDINGS.filter(ending => unlockedEndings.includes(ending.id));
}

/**
 * 获取结局完成度
 * @param unlockedEndings 已解锁的结局ID列表
 * @returns 完成度百分比
 */
export function getEndingCompletionRate(unlockedEndings: string[]): number {
  return Math.round((unlockedEndings.length / ENDINGS.length) * 100);
}
