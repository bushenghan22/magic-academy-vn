import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { getNodeById as getStoryNodeById } from '../data/stories';

// ─── 类型定义 ───────────────────────────────────────────────────────────────

export type BattleElement = 'fire' | 'ice' | 'water' | 'wind' | 'earth' | 'lightning' | 'light' | 'dark' | 'neutral';

// ─── 战斗辅助：元素克制 ──────────────────────────────────────────────

const BATTLE_ELEMENT_RELATIONS: Record<BattleElement, Record<BattleElement, number>> = {
  fire:    { fire: 1, ice: 1.5, water: 0.7, wind: 1.2, earth: 0.8, lightning: 1, light: 1, dark: 1, neutral: 1 },
  ice:     { fire: 0.7, ice: 1, water: 1.2, wind: 1, earth: 1.3, lightning: 0.8, light: 1, dark: 1, neutral: 1 },
  water:   { fire: 1.5, ice: 0.8, water: 1, wind: 0.8, earth: 1.3, lightning: 1.2, light: 1, dark: 1, neutral: 1 },
  wind:    { fire: 0.8, ice: 1, water: 1.2, wind: 1, earth: 0.7, lightning: 1.3, light: 1, dark: 1, neutral: 1 },
  earth:   { fire: 1.2, ice: 0.7, water: 0.8, wind: 1.3, earth: 1, lightning: 0.8, light: 1, dark: 1, neutral: 1 },
  lightning:{fire: 1, ice: 1.2, water: 0.8, wind: 0.7, earth: 1.3, lightning: 1, light: 1, dark: 1.2, neutral: 1 },
  light:   { fire: 1, ice: 1, water: 1, wind: 1, earth: 1, lightning: 1, light: 1, dark: 1.8, neutral: 1 },
  dark:    { fire: 1, ice: 1, water: 1, wind: 1, earth: 1, lightning: 0.8, light: 0.6, dark: 1, neutral: 1 },
  neutral: { fire: 1, ice: 1, water: 1, wind: 1, earth: 1, lightning: 1, light: 1, dark: 1, neutral: 1 },
};

const ELEMENT_NAMES: Record<BattleElement, string> = {
  fire: '🔥火', ice: '❄️冰', water: '💧水', wind: '🌪️风',
  earth: '🪨土', lightning: '⚡雷', light: '✨光', dark: '🌑暗', neutral: '◇无',
};

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getElementMultiplier(atk: BattleElement, def: BattleElement): number {
  return BATTLE_ELEMENT_RELATIONS[atk]?.[def] ?? 1.0;
}

function getStarterDeck(): BattleCard[] {
  return [
    { id: 'atk_fire', name: '火球术', description: '发射火球造成伤害', cost: 1, damage: 6, heal: 0, shield: 0, type: 'attack', rarity: 'common', element: 'fire', effect: '造成6点火焰伤害' },
    { id: 'atk_ice', name: '冰锥', description: '发射冰锥造成伤害', cost: 1, damage: 5, heal: 0, shield: 0, type: 'attack', rarity: 'common', element: 'ice', effect: '造成5点冰霜伤害' },
    { id: 'atk_wind', name: '风刃', description: '风刃切割敌人', cost: 1, damage: 5, heal: 0, shield: 0, type: 'attack', rarity: 'common', element: 'wind', effect: '造成5点风系伤害' },
    { id: 'atk_lightning', name: '雷击', description: '召唤闪电', cost: 2, damage: 10, heal: 0, shield: 0, type: 'spell', rarity: 'uncommon', element: 'lightning', effect: '造成10点雷电伤害' },
    { id: 'def_shield', name: '魔力护盾', description: '生成护盾', cost: 1, damage: 0, heal: 0, shield: 6, type: 'defense', rarity: 'common', element: 'neutral', effect: '获得6点护盾' },
    { id: 'def_earth', name: '岩壁', description: '召唤岩壁防御', cost: 2, damage: 0, heal: 0, shield: 10, type: 'defense', rarity: 'uncommon', element: 'earth', effect: '获得10点护盾' },
    { id: 'heal_light', name: '治愈之光', description: '圣光恢复生命', cost: 1, damage: 0, heal: 8, shield: 0, type: 'heal', rarity: 'common', element: 'light', effect: '恢复8点HP' },
    { id: 'atk_water', name: '水弹', description: '高压水流攻击', cost: 1, damage: 5, heal: 0, shield: 0, type: 'attack', rarity: 'common', element: 'water', effect: '造成5点水系伤害' },
    { id: 'atk_fire2', name: '烈焰弹', description: '更强力的火球', cost: 2, damage: 12, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'fire', effect: '造成12点火焰伤害' },
    { id: 'spell_heal2', name: '圣光沐浴', description: '大量恢复生命', cost: 2, damage: 0, heal: 15, shield: 0, type: 'heal', rarity: 'rare', element: 'light', effect: '恢复15点HP' },
    { id: 'atk_light', name: '圣光箭', description: '光系箭矢贯穿黑暗', cost: 1, damage: 7, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'light', effect: '造成7点光系伤害（对暗系1.8倍）' },
    { id: 'atk_light2', name: '星辉斩', description: '凝聚星辉之力的斩击', cost: 2, damage: 14, heal: 0, shield: 0, type: 'attack', rarity: 'rare', element: 'light', effect: '造成14点光系伤害（对暗系1.8倍）' },
  ];
}

function getFinalBattleDeck(): BattleCard[] {
  const base = getStarterDeck();
  return [
    ...base,
    { id: 'spell_bond', name: '羁绊之光', description: '六位女主的羁绊汇聚而成', cost: 2, damage: 20, heal: 10, shield: 0, type: 'spell', rarity: 'legendary', element: 'light', effect: '造成20点光系伤害并恢复10HP（同伴羁绊加成）' },
    { id: 'atk_six_elements', name: '六元素共鸣', description: '六大元素同时爆发', cost: 3, damage: 30, heal: 0, shield: 0, type: 'spell', rarity: 'legendary', element: 'light', effect: '造成30点真实伤害（元素共鸣必杀技）' },
    { id: 'def_friendship', name: '友情之盾', description: '同伴们的守护', cost: 1, damage: 0, heal: 0, shield: 12, type: 'defense', rarity: 'rare', element: 'light', effect: '获得12点护盾' },
  ];
}

// ─── 女主羁绊专属卡（好感度解锁） ───────────────────────────────────────

const BOND_CARDS: Record<string, { card: BattleCard; threshold: number }[]> = {
  hoshino_sakura: [
    { threshold: 30, card: { id: 'bond_sakura_1', name: '樱花守护', description: '樱的温柔守护治愈伤痛', cost: 1, damage: 0, heal: 8, shield: 4, type: 'heal', rarity: 'rare', element: 'light', effect: '恢复8点HP并获得4点护盾' } },
    { threshold: 60, card: { id: 'bond_sakura_2', name: '樱之誓约', description: '与樱的羁绊化作力量', cost: 2, damage: 15, heal: 8, shield: 0, type: 'spell', rarity: 'legendary', element: 'fire', effect: '造成15点火焰伤害并恢复8点HP' } },
  ],
  kishima_rin: [
    { threshold: 30, card: { id: 'bond_rin_1', name: '月华流转', description: '琳的月华之力流转周身', cost: 2, damage: 0, heal: 0, shield: 10, type: 'defense', rarity: 'rare', element: 'ice', effect: '获得10点护盾，下一次受击反弹5点伤害' } },
    { threshold: 60, card: { id: 'bond_rin_2', name: '千年冰华', description: '琳施展传承千年的冰华秘术', cost: 3, damage: 22, heal: 0, shield: 0, type: 'spell', rarity: 'legendary', element: 'ice', effect: '造成22点冰霜伤害，30%几率冰冻敌人' } },
  ],
  kazane_rin: [
    { threshold: 30, card: { id: 'bond_kazane_1', name: '清风祝福', description: '风音铃的祝福如清风般轻盈', cost: 1, damage: 8, heal: 3, shield: 0, type: 'spell', rarity: 'rare', element: 'wind', effect: '造成8点风系伤害并恢复3点HP' } },
    { threshold: 60, card: { id: 'bond_kazane_2', name: '天籁风神', description: '风音铃的歌声召唤风神之力', cost: 2, damage: 18, heal: 0, shield: 0, type: 'spell', rarity: 'legendary', element: 'wind', effect: '造成18点风系伤害，抽一张牌' } },
  ],
  ishigami_aoi: [
    { threshold: 30, card: { id: 'bond_aoi_1', name: '碧海潮生', description: '葵的碧海之潮汹涌而来', cost: 2, damage: 12, heal: 0, shield: 0, type: 'attack', rarity: 'rare', element: 'water', effect: '造成12点水系伤害，吸取2点HP' } },
    { threshold: 60, card: { id: 'bond_aoi_2', name: '深渊蓝心', description: '葵敞开的心扉化作深渊之力', cost: 3, damage: 25, heal: 5, shield: 0, type: 'spell', rarity: 'legendary', element: 'water', effect: '造成25点水系伤害，恢复5点HP' } },
  ],
  amane_yuzu: [
    { threshold: 30, card: { id: 'bond_yuzu_1', name: '雷光闪耀', description: '柚的雷光闪耀战场', cost: 1, damage: 10, heal: 0, shield: 0, type: 'attack', rarity: 'rare', element: 'lightning', effect: '造成10点雷电伤害，先手+1' } },
    { threshold: 60, card: { id: 'bond_yuzu_2', name: '天罚雷霆', description: '柚释放禁忌级雷霆天罚', cost: 3, damage: 28, heal: 0, shield: 0, type: 'spell', rarity: 'legendary', element: 'lightning', effect: '造成28点雷电伤害，50%几率麻痹1回合' } },
  ],
  shiraishi_mashiro: [
    { threshold: 30, card: { id: 'bond_mashiro_1', name: '白光庇佑', description: '真白的圣洁白光庇佑着你', cost: 2, damage: 0, heal: 6, shield: 6, type: 'heal', rarity: 'rare', element: 'light', effect: '恢复6点HP并获得6点护盾，净化1个负面状态' } },
    { threshold: 60, card: { id: 'bond_mashiro_2', name: '圣光救赎', description: '真白的圣光救赎世间万物', cost: 3, damage: 20, heal: 15, shield: 0, type: 'spell', rarity: 'legendary', element: 'light', effect: '造成20点光系伤害，治疗15点HP，对暗系敌人伤害翻倍' } },
  ],
};

// ─── 战斗后可获得的卡牌池（按敌人元素分类） ────────────────────────────

const REWARD_CARDS_POOL: Record<BattleElement, BattleCard[]> = {
  fire: [
    { id: 'rw_fire_1', name: '炎爆术', description: '剧烈的火焰爆炸', cost: 2, damage: 10, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'fire', effect: '造成10点火焰伤害' },
    { id: 'rw_fire_2', name: '烈焰之拳', description: '燃烧的拳头重击', cost: 2, damage: 12, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'fire', effect: '造成12点火焰伤害' },
    { id: 'rw_fire_3', name: '灼烧之心', description: '燃烧斗志恢复魔力', cost: 0, damage: 0, heal: 0, shield: 0, type: 'spell', rarity: 'rare', element: 'fire', effect: '恢复2点能量，下次攻击+3' },
  ],
  ice: [
    { id: 'rw_ice_1', name: '冰晶箭', description: '凝聚冰晶射出', cost: 2, damage: 9, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'ice', effect: '造成9点冰霜伤害' },
    { id: 'rw_ice_2', name: '寒霜之壁', description: '冰墙抵挡攻击', cost: 2, damage: 0, heal: 0, shield: 10, type: 'defense', rarity: 'uncommon', element: 'ice', effect: '获得10点护盾' },
    { id: 'rw_ice_3', name: '永冻之心', description: '冰封的意志驱散痛苦', cost: 1, damage: 0, heal: 6, shield: 3, type: 'heal', rarity: 'rare', element: 'ice', effect: '恢复6点HP和3点护盾' },
  ],
  water: [
    { id: 'rw_water_1', name: '水龙弹', description: '水之巨龙冲撞敌人', cost: 2, damage: 11, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'water', effect: '造成11点水系伤害' },
    { id: 'rw_water_2', name: '治愈之泉', description: '清澈泉水治愈伤痛', cost: 2, damage: 0, heal: 10, shield: 0, type: 'heal', rarity: 'uncommon', element: 'water', effect: '恢复10点HP' },
    { id: 'rw_water_3', name: '潮汐护盾', description: '潮汐之力形成护盾', cost: 1, damage: 0, heal: 0, shield: 8, type: 'defense', rarity: 'rare', element: 'water', effect: '获得8点护盾，反弹2点伤害' },
  ],
  wind: [
    { id: 'rw_wind_1', name: '旋风斩', description: '旋风席卷敌人', cost: 1, damage: 8, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'wind', effect: '造成8点风系伤害' },
    { id: 'rw_wind_2', name: '疾风连刺', description: '高速连击', cost: 2, damage: 14, heal: 0, shield: 0, type: 'attack', rarity: 'rare', element: 'wind', effect: '造成14点风系伤害' },
    { id: 'rw_wind_3', name: '风之加护', description: '风之精灵的庇护', cost: 1, damage: 0, heal: 5, shield: 3, type: 'heal', rarity: 'uncommon', element: 'wind', effect: '恢复5点HP和3点护盾' },
  ],
  earth: [
    { id: 'rw_earth_1', name: '岩石投掷', description: '巨石砸向敌人', cost: 2, damage: 11, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'earth', effect: '造成11点地系伤害' },
    { id: 'rw_earth_2', name: '大地之盾', description: '大地的守护坚不可摧', cost: 2, damage: 0, heal: 0, shield: 14, type: 'defense', rarity: 'rare', element: 'earth', effect: '获得14点护盾' },
  ],
  lightning: [
    { id: 'rw_ltn_1', name: '闪电链', description: '闪电在敌间跳跃', cost: 2, damage: 12, heal: 0, shield: 0, type: 'spell', rarity: 'uncommon', element: 'lightning', effect: '造成12点雷电伤害' },
    { id: 'rw_ltn_2', name: '雷神降临', description: '召唤雷神之锤', cost: 3, damage: 18, heal: 0, shield: 0, type: 'spell', rarity: 'rare', element: 'lightning', effect: '造成18点雷电伤害，20%麻痹' },
    { id: 'rw_ltn_3', name: '电磁护盾', description: '电磁场偏转攻击', cost: 2, damage: 0, heal: 0, shield: 9, type: 'defense', rarity: 'uncommon', element: 'lightning', effect: '获得9点护盾，受击反弹3点' },
  ],
  light: [
    { id: 'rw_light_1', name: '圣光箭', description: '圣洁光箭穿透黑暗', cost: 2, damage: 11, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'light', effect: '造成11点光系伤害，对暗系+50%' },
    { id: 'rw_light_2', name: '神圣治愈', description: '神之慈爱治愈重伤', cost: 3, damage: 0, heal: 15, shield: 0, type: 'heal', rarity: 'rare', element: 'light', effect: '恢复15点HP' },
    { id: 'rw_light_3', name: '光之障壁', description: '圣光屏障隔绝一切邪恶', cost: 2, damage: 0, heal: 0, shield: 12, type: 'defense', rarity: 'rare', element: 'light', effect: '获得12点护盾，免疫暗系伤害' },
  ],
  dark: [
    { id: 'rw_dark_1', name: '暗影突袭', description: '从暗影中突袭', cost: 1, damage: 9, heal: 0, shield: 0, type: 'attack', rarity: 'uncommon', element: 'dark', effect: '造成9点暗系伤害，先手+2' },
    { id: 'rw_dark_2', name: '生命汲取', description: '吸取敌人生命', cost: 2, damage: 8, heal: 6, shield: 0, type: 'spell', rarity: 'rare', element: 'dark', effect: '造成8点暗系伤害，恢复6点HP' },
    { id: 'rw_dark_3', name: '虚空之刃', description: '撕裂空间的黑刃', cost: 3, damage: 16, heal: 0, shield: 0, type: 'attack', rarity: 'rare', element: 'dark', effect: '造成16点暗系伤害，无视护盾' },
  ],
  neutral: [
    { id: 'rw_neu_1', name: '重击', description: '强力一击', cost: 2, damage: 10, heal: 0, shield: 0, type: 'attack', rarity: 'common', element: 'neutral', effect: '造成10点物理伤害' },
    { id: 'rw_neu_2', name: '铁壁', description: '坚不可摧的防御', cost: 1, damage: 0, heal: 0, shield: 10, type: 'defense', rarity: 'uncommon', element: 'neutral', effect: '获得10点护盾' },
    { id: 'rw_neu_3', name: '冥想', description: '冥想恢复精力', cost: 0, damage: 0, heal: 4, shield: 0, type: 'heal', rarity: 'uncommon', element: 'neutral', effect: '恢复4点HP和2点能量' },
  ],
};

function rollBattleRewards(enemyId: string, enemyElement: BattleElement): string[] {
  const rewards: string[] = [];
  const pool = REWARD_CARDS_POOL[enemyElement] || REWARD_CARDS_POOL.neutral;
  const isBoss = enemyId.includes('guardian') || enemyId.includes('knight') || enemyId.includes('dragon') || enemyId.includes('giant') || enemyId.includes('shadow_king');
  const isMiniBoss = enemyId.includes('golem') || enemyId.includes('assassin') || enemyId.includes('spirit');

  const numRewards = isBoss ? 3 : isMiniBoss ? 2 : 1;
  const rareChance = isBoss ? 0.5 : isMiniBoss ? 0.3 : 0.15;

  const usedIds = new Set<string>();
  for (let i = 0; i < numRewards; i++) {
    const wantRare = Math.random() < rareChance;
    const candidates = pool.filter(c => !usedIds.has(c.id) && (wantRare ? c.rarity === 'rare' : c.rarity !== 'legendary'));
    const pool2 = candidates.length > 0 ? candidates : pool.filter(c => !usedIds.has(c.id));
    if (pool2.length === 0) break;
    const picked = pool2[Math.floor(Math.random() * pool2.length)];
    rewards.push(picked.id);
    usedIds.add(picked.id);
  }
  return rewards;
}

function checkBondCardUnlocks(affection: Record<string, number>, ownedCards: string[]): string[] {
  const newlyUnlocked: string[] = [];
  for (const [charId, entries] of Object.entries(BOND_CARDS)) {
    const aff = affection[charId] ?? 0;
    for (const { threshold, card } of entries) {
      if (aff >= threshold && !ownedCards.includes(card.id)) {
        newlyUnlocked.push(card.id);
      }
    }
  }
  return newlyUnlocked;
}

function buildPlayerDeck(ownedCardIds: string[]): BattleCard[] {
  const base = getStarterDeck();
  const allRewardCards: BattleCard[] = Object.values(REWARD_CARDS_POOL).flat();
  const allBondCards: BattleCard[] = Object.values(BOND_CARDS).flat().map(e => e.card);
  const extraCards = [...allRewardCards, ...allBondCards];
  const ownedExtras: BattleCard[] = [];
  for (const id of ownedCardIds) {
    if (base.some(c => c.id === id)) continue;
    const found = extraCards.find(c => c.id === id);
    if (found) ownedExtras.push({ ...found });
  }
  const deck = [...base];
  const limitedExtras = ownedExtras.slice(0, 6);
  deck.push(...limitedExtras);
  return deck;
}

function findBattleCardById(id: string): BattleCard | undefined {
  const allRewardCards: BattleCard[] = Object.values(REWARD_CARDS_POOL).flat();
  const allBondCards: BattleCard[] = Object.values(BOND_CARDS).flat().map(e => e.card);
  return [...getStarterDeck(), ...getFinalBattleDeck(), ...allRewardCards, ...allBondCards].find(c => c.id === id);
}

const CHAR_DISPLAY_NAMES: Record<string, string> = {
  hoshino_sakura: '星野樱', sakura: '星野樱',
  kishima_rin: '岸岛琳', rin: '岸岛琳',
  kazane_rin: '风音铃', suzu: '风音铃',
  ishigami_aoi: '石葵', aoi: '石葵',
  amane_yuzu: '天音柚', yuzu: '天音柚',
  shiraishi_mashiro: '白石真白', mashiro: '白石真白',
  kurosaki_soma: '崎飒真', soma: '崎飒真',
  shiratori_yuma: '白鸟悠真', yuma: '白鸟悠真',
};

function getCharDisplayName(id: string): string {
  return CHAR_DISPLAY_NAMES[id] || id;
}

const ENEMY_DATABASE: Record<string, {
  name: string; hp: number; attack: number; element: BattleElement; sprite: string;
  attacks: Array<{ name: string; type: 'attack' | 'defend' | 'buff' | 'special'; value: number; desc: string }>;
}> = {
  'frost_wolf': {
    name: '冰霜巨狼', hp: 35, attack: 6, element: 'ice', sprite: '🐺',
    attacks: [
      { name: '冰牙撕咬', type: 'attack', value: 6, desc: '冰牙撕咬' },
      { name: '寒冰吐息', type: 'attack', value: 9, desc: '寒冰吐息' },
      { name: '冰霜护体', type: 'defend', value: 4, desc: '冰霜护体' },
    ],
  },
  'star_guardian': {
    name: '星辉之守卫', hp: 65, attack: 8, element: 'light', sprite: '🗿',
    attacks: [
      { name: '星辉冲击', type: 'attack', value: 8, desc: '星辉冲击' },
      { name: '古代结界', type: 'defend', value: 10, desc: '古代结界' },
      { name: '星光爆裂', type: 'special', value: 14, desc: '星光爆裂（强力）' },
    ],
  },
  'shadow_wolf': {
    name: '暗影狼', hp: 45, attack: 7, element: 'dark', sprite: '🐺',
    attacks: [
      { name: '暗影撕咬', type: 'attack', value: 7, desc: '暗影撕咬' },
      { name: '影袭', type: 'attack', value: 10, desc: '影袭（高伤）' },
      { name: '暗影护盾', type: 'defend', value: 5, desc: '暗影护盾' },
    ],
  },
  'fire_elemental': {
    name: '火元素', hp: 40, attack: 10, element: 'fire', sprite: '🔥',
    attacks: [
      { name: '火焰喷射', type: 'attack', value: 10, desc: '火焰喷射' },
      { name: '爆裂', type: 'special', value: 14, desc: '爆裂（强力攻击）' },
      { name: '燃烧之怒', type: 'buff', value: 3, desc: '燃烧之怒（提升攻击）' },
    ],
  },
  'ice_golem': {
    name: '冰魔像', hp: 70, attack: 6, element: 'ice', sprite: '🧊',
    attacks: [
      { name: '冰霜重击', type: 'attack', value: 6, desc: '冰霜重击' },
      { name: '冰甲', type: 'defend', value: 12, desc: '冰甲（高护盾）' },
      { name: '寒冰之息', type: 'attack', value: 9, desc: '寒冰之息' },
    ],
  },
  'shadow_assassin': {
    name: '暗影刺客', hp: 45, attack: 10, element: 'dark', sprite: '🗡️',
    attacks: [
      { name: '暗刃斩', type: 'attack', value: 10, desc: '暗刃斩' },
      { name: '致命一击', type: 'special', value: 15, desc: '致命一击' },
      { name: '烟幕', type: 'defend', value: 4, desc: '烟幕（低护盾）' },
    ],
  },
  'shadow_knight': {
    name: '暗影骑士', hp: 70, attack: 10, element: 'dark', sprite: '⚔️',
    attacks: [
      { name: '黑暗斩击', type: 'attack', value: 10, desc: '黑暗斩击' },
      { name: '暗影盾', type: 'defend', value: 12, desc: '暗影盾' },
      { name: '深渊冲击', type: 'special', value: 14, desc: '深渊冲击' },
    ],
  },
  'shadow_crystal': {
    name: '暗影晶核', hp: 30, attack: 10, element: 'dark', sprite: '💎',
    attacks: [
      { name: '暗影脉冲', type: 'attack', value: 8, desc: '暗影脉冲' },
      { name: '能量爆发', type: 'special', value: 13, desc: '能量爆发（强力）' },
      { name: '晶核再生', type: 'defend', value: 8, desc: '晶核再生' },
    ],
  },
  'corrupted_spirit': {
    name: '堕落精灵', hp: 45, attack: 8, element: 'dark', sprite: '👻',
    attacks: [
      { name: '腐化之触', type: 'attack', value: 8, desc: '腐化之触' },
      { name: '灵魂尖啸', type: 'special', value: 12, desc: '灵魂尖啸' },
      { name: '虚无之壁', type: 'defend', value: 6, desc: '虚无之壁' },
    ],
  },
  'shadow_dragon_whelp': {
    name: '暗影幼龙', hp: 90, attack: 11, element: 'dark', sprite: '🐉',
    attacks: [
      { name: '暗影吐息', type: 'attack', value: 11, desc: '暗影吐息' },
      { name: '龙鳞护体', type: 'defend', value: 14, desc: '龙鳞护体' },
      { name: '毁灭之息', type: 'special', value: 17, desc: '毁灭之息' },
    ],
  },
  'shadow_king': {
    name: '暗影之王·艾利奥斯', hp: 140, attack: 12, element: 'dark', sprite: '👑',
    attacks: [
      { name: '暗影风暴', type: 'attack', value: 12, desc: '暗影风暴' },
      { name: '深渊之盾', type: 'defend', value: 14, desc: '深渊之盾' },
      { name: '黑暗吞噬', type: 'special', value: 20, desc: '黑暗吞噬（危险）' },
      { name: '暗影之怒', type: 'buff', value: 3, desc: '暗影之怒（强化攻击）' },
    ],
  },
  'shadow_king_giant': {
    name: '暗影巨人·艾利奥斯', hp: 160, attack: 14, element: 'dark', sprite: '👹',
    attacks: [
      { name: '暗影巨拳', type: 'attack', value: 14, desc: '暗影巨拳' },
      { name: '深渊壁垒', type: 'defend', value: 18, desc: '深渊壁垒' },
      { name: '毁灭冲击', type: 'special', value: 24, desc: '毁灭冲击（致命）' },
      { name: '暗影狂怒', type: 'buff', value: 4, desc: '暗影狂怒（大幅强化）' },
    ],
  },
  'shadow_flame_beast': {
    name: '暗影火焰兽', hp: 45, attack: 8, element: 'fire', sprite: '🔥',
    attacks: [
      { name: '黑焰喷射', type: 'attack', value: 8, desc: '黑焰喷射' },
      { name: '爆裂', type: 'special', value: 12, desc: '爆裂' },
      { name: '火焰护甲', type: 'defend', value: 5, desc: '火焰护甲' },
    ],
  },
  'shadow_ice_elemental': {
    name: '暗影冰元素', hp: 50, attack: 7, element: 'ice', sprite: '❄️',
    attacks: [
      { name: '暗影冰锥', type: 'attack', value: 7, desc: '暗影冰锥' },
      { name: '冰霜之壁', type: 'defend', value: 9, desc: '冰霜之壁' },
      { name: '冰封', type: 'special', value: 12, desc: '冰封' },
    ],
  },
  'shadow_thunder_spirit': {
    name: '暗影雷电精灵', hp: 40, attack: 9, element: 'lightning', sprite: '⚡',
    attacks: [
      { name: '黑雷轰击', type: 'attack', value: 9, desc: '黑雷轰击' },
      { name: '电弧护盾', type: 'defend', value: 5, desc: '电弧护盾' },
      { name: '雷霆万钧', type: 'special', value: 14, desc: '雷霆万钧' },
    ],
  },
  'shadow_guardian': {
    name: '暗影守护者', hp: 90, attack: 11, element: 'dark', sprite: '🗿',
    attacks: [
      { name: '暗影重击', type: 'attack', value: 11, desc: '暗影重击' },
      { name: '巨型护盾', type: 'defend', value: 15, desc: '巨型护盾' },
      { name: '暗影激光', type: 'special', value: 17, desc: '暗影激光（强力）' },
    ],
  },
};

// ─── 类型定义 ───────────────────────────────────────────────────────────────

export interface StoryNode {
  id: string;
  chapter: number;
  text: string;
  type?: 'dialogue' | 'choice' | 'cutscene' | 'branch' | 'battle';
  speaker?: string;
  emotion?: string;
  portrait?: string;
  background?: string;
  bgm?: string;
  music?: string;
  characterSprites?: Array<{
    characterId: string;
    position: string;
    emotion?: string;
    outfit?: string;
  }>;
  choices?: Choice[];
  defaultOption?: Choice;
  nextNode?: string;
  next?: string;
  enemyId?: string;
  effects?: NodeEffect[];
}

export interface Choice {
  id: string;
  text: string;
  nextNode?: string;
  conditions?: ChoiceCondition[];
  condition?: ChoiceCondition;
  effects?: NodeEffect[];
}

export interface ChoiceCondition {
  type: 'flag' | 'affection' | 'chapter' | 'hasCard' | 'hasItem' | 'all_affections_min' | 'choice';
  key?: string;
  characterId?: string;
  cardId?: string;
  itemId?: string;
  value?: number | boolean | string;
  target?: string;
  targets?: string[];
  min?: number;
  operator?: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
}

export interface NodeEffect {
  type: 'setFlag' | 'flag' | 'affection' | 'addCard' | 'removeCard' | 'unlockCG' | 'cg_unlock' | 'addItem' | 'unlock' | 'achievement' | 'title_unlock' | 'item_unlock' | 'ending' | 'choice';
  key?: string;
  value?: boolean | number | string;
  target?: string;
  characterId?: string;
  amount?: number;
  cardId?: string;
  cgId?: string;
  itemId?: string;
}

export interface BattleCard {
  id: string;
  name: string;
  description: string;
  cost: number;
  damage: number;
  heal: number;
  shield: number;
  type: 'attack' | 'defense' | 'spell' | 'heal';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  element: BattleElement;
  effect?: string;
}

export interface BattleEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  element: BattleElement;
  sprite?: string;
  intent?: 'attack' | 'defend' | 'buff' | 'special';
  intentValue?: number;
  shield: number;
  enraged: boolean;
}

export interface BattleState {
  enemy: BattleEnemy;
  playerHp: number;
  playerMaxHp: number;
  playerShield: number;
  playerEnergy: number;
  playerMaxEnergy: number;
  playerElement: BattleElement;
  hand: BattleCard[];
  drawPile: BattleCard[];
  discardPile: BattleCard[];
  isPlayerTurn: boolean;
  turn: number;
  combo: number;
  lastPlayedElement: BattleElement | null;
  damagePopup: { value: number; type: 'damage' | 'heal' | 'shield' | 'crit' | 'weak'; target: 'player' | 'enemy' } | null;
  battleLog: string[];
  turnCount: number;
}

export interface GameState {
  playerName: string;
  currentNodeId: string;
  currentChapter: number;
  flags: Record<string, boolean>;
  affection: Record<string, number>;
  cards: string[];
  unlockedCGs: string[];
  unlockedBgm: string[];
  inventory: string[];
  choiceHistory: string[];
  dialogueHistory: Array<{ speaker?: string; text: string; nodeId: string }>;
  readNodes: string[];
  totalPlayTime: number;
  lastSaveTimestamp: number;
  battle: BattleState | null;
  currentEndingId: string | null;
  lastBattleRewards: string[];
}

export interface GameSettings {
  textSpeed: 'slow' | 'medium' | 'fast' | 'instant';
  autoSpeed: number;
  skipSpeed: number;
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  isFullscreen: boolean;
  language: 'zh-CN' | 'en';
  showCharacterNames: boolean;
  skipRead: boolean;
  resolution: '720p' | '1080p' | '1440p';
}

export interface SaveData {
  id: number;
  gameState: GameState;
  screenshot?: string;
  timestamp: number;
  chapter: number;
  nodeName: string;
  isEmpty: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  duration: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TutorialState {
  isActive: boolean;
  currentStepId: string;
  completedSteps: string[];
}

// ─── Store 状态接口 ────────────────────────────────────────────────────────

export interface GameStore {
  // UI State
  currentScreen: string;
  isMenuOpen: boolean;
  isDialogueVisible: boolean;
  showTutorial: boolean;
  isAutoMode: boolean;
  isSkipping: boolean;
  textDisplayProgress: number;
  notifications: Notification[];

  // Game State
  gameState: GameState | null;
  saveSlots: SaveData[];
  settings: GameSettings;

  // Tutorial State
  tutorial: TutorialState;

  // Dialogue Actions
  advanceDialogue: () => void;
  selectChoice: (choiceId: string) => void;
  setTextProgress: (progress: number) => void;
  setAutoMode: (enabled: boolean) => void;
  setSkipping: (enabled: boolean) => void;

  // Game Actions
  startNewGame: (playerName: string) => void;
  loadGame: (saveData: SaveData) => void;
  saveGame: (slotId: number) => void;
  deleteSave: (slotId: number) => void;
  getCurrentNode: () => StoryNode | null;
  getAvailableChoices: () => Choice[];
  setFlag: (key: string, value: boolean) => void;
  getFlag: (key: string) => boolean;
  addAffection: (characterId: string, amount: number) => void;
  getAffection: (characterId: string) => number;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  unlockCG: (cgId: string) => void;
  unlockBgm: (bgmId: string) => void;
  addToInventory: (itemId: string) => void;
  isInChapter: (chapter: number) => boolean;
  recordChoice: (choiceId: string) => void;

  // Battle Actions
  initBattle: (enemyId: string) => void;
  playCard: (cardId: string, targetId?: string) => void;
  endTurn: () => void;
  drawCards: (count: number) => void;
  getBattleState: () => BattleState | null;

  // Ending Actions
  triggerEnding: (endingId: string) => void;
  returnToTitle: () => void;

  // Story Flow / Chapter Review
  jumpToNode: (nodeId: string) => void;

  // Settings Actions
  updateSettings: (partial: Partial<GameSettings>) => void;
  resetSettings: () => void;

  // Auto-save
  autoSave: () => void;
  loadAutoSave: () => void;

  // Tutorial Actions
  startTutorial: () => void;
  completeTutorialStep: (stepId: string) => void;
  dismissTutorial: () => void;

  // UI Actions
  setCurrentScreen: (screen: string) => void;
  toggleMenu: () => void;
  setDialogueVisible: (visible: boolean) => void;
  addNotification: (message: string, type: Notification['type'], duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ─── 辅助常量 ─────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'medium',
  autoSpeed: 2000,
  skipSpeed: 80,
  bgmVolume: 0.7,
  sfxVolume: 0.8,
  voiceVolume: 0.8,
  isFullscreen: false,
  language: 'zh-CN',
  showCharacterNames: true,
  skipRead: true,
  resolution: '1080p',
};

const EMPTY_SAVE: (id: number) => SaveData = (id) => ({
  id,
  gameState: {} as GameState,
  timestamp: 0,
  chapter: 0,
  nodeName: '',
  isEmpty: true,
});

const STORAGE_KEY = 'magic-academy-vn-store';
const AUTO_SAVE_KEY = 'magic-academy-vn-autosave';
const SAVE_SLOTS_COUNT = 20;

// ─── 辅助函数 ─────────────────────────────────────────────────────────────

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function evaluateCondition(
  condition: ChoiceCondition,
  state: GameState,
): boolean {
  switch (condition.type) {
    case 'flag': {
      const flagKey = condition.key ?? condition.target;
      if (flagKey === undefined) return true;
      const flagVal = state.flags[flagKey] ?? false;
      return typeof condition.value === 'boolean'
        ? flagVal === condition.value
        : !!flagVal;
    }

    case 'affection': {
      const charId = condition.characterId ?? condition.target;
      if (!charId) return true;
      const current = state.affection[charId] ?? 0;
      const target = (condition.value as number) ?? (condition.min ?? 0);
      const op = condition.operator ?? 'gte';
      switch (op) {
        case 'eq':  return current === target;
        case 'gt':  return current > target;
        case 'gte': return current >= target;
        case 'lt':  return current < target;
        case 'lte': return current <= target;
        default:    return true;
      }
    }

    case 'all_affections_min': {
      const targets = condition.targets ?? [];
      const minVal = condition.min ?? (condition.value as number) ?? 0;
      return targets.every(charId => (state.affection[charId] ?? 0) >= minVal);
    }

    case 'choice': {
      const choiceKey = condition.key ?? condition.target;
      if (!choiceKey) return true;
      return state.flags['choice_' + choiceKey] === condition.value;
    }

    case 'chapter':
      return condition.value !== undefined
        ? state.currentChapter === (condition.value as number)
        : true;

    case 'hasCard':
      return condition.cardId
        ? state.cards.includes(condition.cardId)
        : true;

    case 'hasItem':
      return condition.itemId
        ? state.inventory.includes(condition.itemId)
        : true;

    default:
      return true;
  }
}

function isChoiceAvailable(choice: Choice, state: GameState): boolean {
  if (choice.condition) {
    if (!evaluateCondition(choice.condition, state)) return false;
  }
  if (choice.conditions && choice.conditions.length > 0) {
    if (!choice.conditions.every(c => evaluateCondition(c, state))) return false;
  }
  return true;
}

function applyNodeEffects(effects: NodeEffect[], state: GameState): GameState {
  const next: GameState = { ...state };

  for (const effect of effects) {
    switch (effect.type) {
      case 'setFlag':
        if (effect.key) {
          next.flags = { ...next.flags, [effect.key]: effect.value as boolean };
        }
        break;
      case 'affection':
        if (effect.characterId && effect.amount !== undefined) {
          const current = next.affection[effect.characterId] ?? 0;
          next.affection = {
            ...next.affection,
            [effect.characterId]: Math.max(0, Math.min(100, current + effect.amount)),
          };
        }
        break;
      case 'addCard':
        if (effect.cardId && !next.cards.includes(effect.cardId)) {
          next.cards = [...next.cards, effect.cardId];
        }
        break;
      case 'removeCard':
        if (effect.cardId) {
          next.cards = next.cards.filter((c) => c !== effect.cardId);
        }
        break;
      case 'unlockCG':
        if (effect.cgId && !next.unlockedCGs.includes(effect.cgId)) {
          next.unlockedCGs = [...next.unlockedCGs, effect.cgId];
        }
        break;
      case 'addItem':
        if (effect.itemId && !next.inventory.includes(effect.itemId)) {
          next.inventory = [...next.inventory, effect.itemId];
        }
        break;
    }
  }

  return next;
}

// ─── 效果格式标准化 ─────────────────────────────────────────────────────
// 章节数据使用 { type: 'flag', target, value } 格式
// store 使用 { type: 'setFlag', key, value } 格式
// 统一标准化为 store 格式

function normalizeEffect(effect: any): NodeEffect {
  if (!effect) return effect;

  // flag → setFlag
  if (effect.type === 'flag') {
    return {
      type: 'setFlag',
      key: effect.target || effect.key,
      value: effect.value,
    };
  }
  // affection: target → characterId, value → amount
  if (effect.type === 'affection') {
    return {
      type: 'affection',
      characterId: effect.target || effect.characterId,
      amount: effect.value !== undefined ? effect.value : effect.amount,
    };
  }
  // unlock / cg_unlock → unlockCG
  if (effect.type === 'unlock' || effect.type === 'cg_unlock') {
    return {
      type: 'unlockCG',
      cgId: effect.target || effect.cgId,
    };
  }
  // item / item_unlock → addItem
  if (effect.type === 'item' || effect.type === 'item_unlock') {
    return {
      type: 'addItem',
      itemId: effect.target || effect.itemId,
    };
  }
  // title_unlock → setFlag title
  if (effect.type === 'title_unlock') {
    return {
      type: 'setFlag',
      key: 'title_' + (effect.target || ''),
      value: true,
    };
  }
  // achievement → setFlag ach
  if (effect.type === 'achievement') {
    return {
      type: 'setFlag',
      key: 'ach_' + (effect.target || ''),
      value: true,
    };
  }
  // ending → setFlag ending_xxx (与type:'flag'直接设置ending_xxx保持一致)
  if (effect.type === 'ending') {
    return {
      type: 'setFlag',
      key: 'ending_' + (effect.target || ''),
      value: true,
    };
  }
  // choice → setFlag for choice record
  if (effect.type === 'choice') {
    return {
      type: 'setFlag',
      key: 'choice_' + (effect.target || ''),
      value: effect.value || true,
    };
  }
  return effect as NodeEffect;
}

function normalizeEffects(effects: any[] | undefined): NodeEffect[] | undefined {
  if (!effects || effects.length === 0) return undefined;
  return effects.map(normalizeEffect);
}

function normalizeChapterNode(node: any): StoryNode {
  if (!node) return node;
  return {
    ...node,
    nextNode: node.nextNode ?? node.next,
    bgm: node.bgm ?? node.music,
    effects: normalizeEffects(node.effects),
    defaultOption: node.defaultOption ? {
      ...node.defaultOption,
      nextNode: node.defaultOption.nextNode ?? node.defaultOption.next,
      effects: normalizeEffects(node.defaultOption.effects),
    } : undefined,
    choices: node.choices?.map((c: any) => ({
      ...c,
      nextNode: c.nextNode ?? c.next,
      condition: c.condition ? c.condition : undefined,
      conditions: c.conditions,
      effects: normalizeEffects(c.effects),
    })),
  };
}

// ─── 故事节点访问（使用懒加载数据）────────────────────────────────────

const storyNodes: Record<string, StoryNode> = new Proxy({} as Record<string, StoryNode>, {
  get(_target, prop: string) {
    const node = getStoryNodeById(prop);
    if (!node) return undefined;
    return normalizeChapterNode(node);
  },
});

// ─── 章节起始节点映射 ──────────────────────────────────────────────────────

const CHAPTER_START_NODES: Record<number, string> = {
  1: 'ch1_prologue_001',
  2: 'ch2_new_001',
  3: 'ch3_eve_001',
};

// ─── 创建 Store ──────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ── 初始 UI 状态 ──────────────────────────────────────────────
        currentScreen: 'title',
        isMenuOpen: false,
        isDialogueVisible: false,
        showTutorial: false,
        isAutoMode: false,
        isSkipping: false,
        textDisplayProgress: 0,
        notifications: [],

        // ── 初始游戏状态 ──────────────────────────────────────────────
        gameState: null,
        saveSlots: Array.from({ length: SAVE_SLOTS_COUNT }, (_, i) => EMPTY_SAVE(i)),
        settings: { ...DEFAULT_SETTINGS },

        // ── 初始教程状态 ──────────────────────────────────────────────
        tutorial: {
          isActive: false,
          currentStepId: '',
          completedSteps: [],
        },

        // ── 对话动作 ─────────────────────────────────────────────────

        advanceDialogue: () => {
          const { gameState } = get();
          if (!gameState) return;

          const node = storyNodes[gameState.currentNodeId];
          if (!node) return;

          // 记录当前节点为已读
          let updated = { ...gameState };
          const isFirstVisit = !updated.readNodes.includes(node.id);
          if (isFirstVisit) {
            updated.readNodes = [...updated.readNodes, node.id];
          }

          // 记录对话到历史（只记录有文本的节点，最多保留200条）
          if (node.text && node.type !== 'battle') {
            const speaker = node.speaker === 'narrator' || node.speaker === '旁白' || !node.speaker ? undefined : node.speaker;
            const historyEntry = { speaker, text: node.text, nodeId: node.id };
            const newHistory = [...(updated.dialogueHistory || []), historyEntry];
            updated.dialogueHistory = newHistory.slice(-200);
          }

          // 首次访问时执行节点效果（防止重新进入时重复执行）
          if (isFirstVisit && node.effects && node.effects.length > 0) {
            updated = applyNodeEffects(node.effects, updated);
          }

          const nextTarget = node.nextNode ?? node.next;
          if (nextTarget && !node.choices?.length) {
            updated.currentNodeId = nextTarget;
            set({
              gameState: updated,
              textDisplayProgress: 0,
              isDialogueVisible: true,
            });
          } else if (!nextTarget && !node.choices?.length) {
            // 检查是否触发了结局flag（格式：ending_xxx）
            const endingFlagKey = Object.keys(updated.flags).find(
              (k) => k.startsWith('ending_') && updated.flags[k] === true
            );
            if (endingFlagKey) {
              const endingId = endingFlagKey.replace(/^ending_/, '');
              updated.currentEndingId = endingId;
              set({
                gameState: updated,
                currentScreen: 'ending',
                textDisplayProgress: 0,
                isDialogueVisible: false,
              });
              get().autoSave();
              return;
            }
            // 章节结束，推进到下一章节的起始节点
            const nextChapter = updated.currentChapter + 1;
            const nextChapterStart = CHAPTER_START_NODES[nextChapter];
            updated.currentChapter = nextChapter;
            if (nextChapterStart) {
              updated.currentNodeId = nextChapterStart;
              set({
                gameState: updated,
                textDisplayProgress: 0,
                isDialogueVisible: true,
              });
            } else {
              set({
                gameState: updated,
                textDisplayProgress: 0,
                isDialogueVisible: false,
              });
            }
            get().autoSave();
          }
        },

        selectChoice: (choiceId: string) => {
          const { gameState } = get();
          if (!gameState) return;

          const node = storyNodes[gameState.currentNodeId];
          if (!node?.choices) return;

          const choice = node.choices.find((c) => c.id === choiceId);
          if (!choice) return;

          let updated = { ...gameState };
          updated.currentNodeId = choice.nextNode;
          updated.choiceHistory = [...updated.choiceHistory, choiceId];

          if (choice.effects && choice.effects.length > 0) {
            updated = applyNodeEffects(choice.effects, updated);
          }

          set({
            gameState: updated,
            textDisplayProgress: 0,
            isDialogueVisible: true,
          });
        },

        setTextProgress: (progress: number) => {
          set({ textDisplayProgress: Math.max(0, Math.min(1, progress)) });
        },

        setAutoMode: (enabled: boolean) => {
          set({ isAutoMode: enabled, isSkipping: false });
        },

        setSkipping: (enabled: boolean) => {
          set({ isSkipping: enabled, isAutoMode: false });
        },

        // ── 游戏动作 ─────────────────────────────────────────────────

        startNewGame: (playerName: string) => {
          const newGameState: GameState = {
            playerName,
            currentNodeId: 'ch1_prologue_001',
            currentChapter: 1,
            flags: {},
            affection: {},
            cards: [],
            unlockedCGs: [],
            unlockedBgm: ['title_bgm'],
            inventory: [],
            choiceHistory: [],
            dialogueHistory: [],
            readNodes: [],
            totalPlayTime: 0,
            lastSaveTimestamp: Date.now(),
            battle: null,
            currentEndingId: null,
            lastBattleRewards: [],
          };

          set({
            gameState: newGameState,
            currentScreen: 'game',
            isDialogueVisible: true,
            textDisplayProgress: 0,
            isAutoMode: false,
            isSkipping: false,
          });

          get().addNotification('冒险开始了！', 'info', 3000);
        },

        loadGame: (saveData: SaveData) => {
          if (saveData.isEmpty) return;
          const loaded = { ...saveData.gameState };
          if (!loaded.readNodes) loaded.readNodes = [];
          if (!loaded.dialogueHistory) loaded.dialogueHistory = [];
          if (!loaded.unlockedBgm) loaded.unlockedBgm = ['title_bgm'];
          if (!loaded.lastBattleRewards) loaded.lastBattleRewards = [];
          if (!loaded.cards) loaded.cards = [];
          set({
            gameState: loaded,
            currentScreen: 'game',
            isDialogueVisible: true,
            textDisplayProgress: 0,
          });
          get().addNotification('存档已加载', 'success', 2000);
        },

        saveGame: (slotId: number) => {
          const { gameState, saveSlots } = get();
          if (!gameState || slotId < 0 || slotId >= SAVE_SLOTS_COUNT) return;

          const node = storyNodes[gameState.currentNodeId];
          const saveData: SaveData = {
            id: slotId,
            gameState: { ...gameState, lastSaveTimestamp: Date.now() },
            timestamp: Date.now(),
            chapter: gameState.currentChapter,
            nodeName: node?.text?.slice(0, 20) ?? '',
            isEmpty: false,
          };

          const newSlots = [...saveSlots];
          newSlots[slotId] = saveData;
          set({ saveSlots: newSlots });
          get().addNotification(`已保存到存档位 ${slotId + 1}`, 'success', 2000);
        },

        deleteSave: (slotId: number) => {
          const { saveSlots } = get();
          if (slotId < 0 || slotId >= SAVE_SLOTS_COUNT) return;
          const newSlots = [...saveSlots];
          newSlots[slotId] = EMPTY_SAVE(slotId);
          set({ saveSlots: newSlots });
          get().addNotification('存档已删除', 'info', 1500);
        },

        getCurrentNode: (): StoryNode | null => {
          const { gameState } = get();
          if (!gameState) return null;
          return storyNodes[gameState.currentNodeId] ?? null;
        },

        getAvailableChoices: (): Choice[] => {
          const node = get().getCurrentNode();
          if (!node?.choices) return [];

          const { gameState } = get();
          if (!gameState) return [];

          return node.choices.filter((choice) => isChoiceAvailable(choice, gameState));
        },

        setFlag: (key: string, value: boolean) => {
          const { gameState } = get();
          if (!gameState) return;
          set({
            gameState: {
              ...gameState,
              flags: { ...gameState.flags, [key]: value },
            },
          });
        },

        getFlag: (key: string): boolean => {
          const { gameState } = get();
          if (!gameState) return false;
          return gameState.flags[key] ?? false;
        },

        addAffection: (characterId: string, amount: number) => {
          const { gameState } = get();
          if (!gameState) return;
          const current = gameState.affection[characterId] ?? 0;
          const newValue = Math.max(0, Math.min(100, current + amount));
          const beforeUnlocks = checkBondCardUnlocks({ ...gameState.affection, [characterId]: current }, gameState.cards);
          const afterUnlocks = checkBondCardUnlocks({ ...gameState.affection, [characterId]: newValue }, gameState.cards);
          const newBondCards = afterUnlocks.filter(id => !beforeUnlocks.includes(id) && !gameState.cards.includes(id));
          set({
            gameState: {
              ...gameState,
              affection: { ...gameState.affection, [characterId]: newValue },
              cards: [...gameState.cards, ...newBondCards],
            },
          });
          if (amount > 0) {
            get().addNotification(`${getCharDisplayName(characterId)} 好感度 +${amount}`, 'achievement', 2000);
          }
          for (const cid of newBondCards) {
            const c = findBattleCardById(cid);
            if (c) {
              get().addNotification(`✨ 好感度解锁羁绊卡牌：${c.name}！`, 'achievement', 5000);
            }
          }
        },

        getAffection: (characterId: string): number => {
          const { gameState } = get();
          if (!gameState) return 0;
          return gameState.affection[characterId] ?? 0;
        },

        addCard: (cardId: string) => {
          const { gameState } = get();
          if (!gameState || gameState.cards.includes(cardId)) return;
          set({
            gameState: {
              ...gameState,
              cards: [...gameState.cards, cardId],
            },
          });
          get().addNotification('获得新卡牌！', 'achievement', 3000);
        },

        removeCard: (cardId: string) => {
          const { gameState } = get();
          if (!gameState) return;
          set({
            gameState: {
              ...gameState,
              cards: gameState.cards.filter((c) => c !== cardId),
            },
          });
        },

        unlockCG: (cgId: string) => {
          const { gameState } = get();
          if (!gameState || gameState.unlockedCGs.includes(cgId)) return;
          set({
            gameState: {
              ...gameState,
              unlockedCGs: [...gameState.unlockedCGs, cgId],
            },
          });
          get().addNotification('解锁了新CG！', 'achievement', 3000);
        },

        unlockBgm: (bgmId: string) => {
          const { gameState } = get();
          if (!gameState || gameState.unlockedBgm.includes(bgmId)) return;
          set({
            gameState: {
              ...gameState,
              unlockedBgm: [...gameState.unlockedBgm, bgmId],
            },
          });
          get().addNotification(`🎵 解锁新音乐！`, 'achievement', 2500);
        },

        addToInventory: (itemId: string) => {
          const { gameState } = get();
          if (!gameState || gameState.inventory.includes(itemId)) return;
          set({
            gameState: {
              ...gameState,
              inventory: [...gameState.inventory, itemId],
            },
          });
          get().addNotification('获得道具！', 'info', 2000);
        },

        isInChapter: (chapter: number): boolean => {
          const { gameState } = get();
          if (!gameState) return false;
          return gameState.currentChapter === chapter;
        },

        recordChoice: (choiceId: string) => {
          const { gameState } = get();
          if (!gameState) return;
          set({
            gameState: {
              ...gameState,
              choiceHistory: [...gameState.choiceHistory, choiceId],
            },
          });
        },

        // ── 战斗动作 ─────────────────────────────────────────────────

        initBattle: (enemyId: string) => {
          const { gameState } = get();
          if (!gameState) return;

          const enemyInfo = ENEMY_DATABASE[enemyId] ?? {
            name: enemyId, hp: 45, attack: 8, element: 'dark' as BattleElement, sprite: '👹',
            attacks: [
              { name: '暗影攻击', type: 'attack' as const, value: 8, desc: '暗影攻击' },
              { name: '防御', type: 'defend' as const, value: 5, desc: '防御' },
              { name: '重击', type: 'special' as const, value: 12, desc: '重击' },
            ],
          };

          const isFinalBoss = enemyId === 'shadow_king' || enemyId === 'shadow_king_giant';
          const baseDeck = isFinalBoss ? getFinalBattleDeck() : buildPlayerDeck(gameState.cards);
          const deck = fisherYatesShuffle(baseDeck);
          const playerMaxHp = isFinalBoss ? 120 : 100;
          const playerMaxEnergy = isFinalBoss ? 4 : 3;

          const firstAttack = enemyInfo.attacks[0];
          const battle: BattleState = {
            enemy: {
              id: enemyId,
              name: enemyInfo.name,
              hp: enemyInfo.hp,
              maxHp: enemyInfo.hp,
              attack: enemyInfo.attack,
              element: enemyInfo.element,
              sprite: enemyInfo.sprite,
              intent: firstAttack.type,
              intentValue: firstAttack.value,
              shield: 0,
              enraged: false,
            },
            playerHp: playerMaxHp,
            playerMaxHp,
            playerShield: 0,
            playerEnergy: playerMaxEnergy,
            playerMaxEnergy,
            playerElement: 'light',
            hand: [],
            drawPile: deck,
            discardPile: [],
            isPlayerTurn: true,
            turn: 1,
            combo: 0,
            lastPlayedElement: null,
            damagePopup: null,
            battleLog: isFinalBoss
              ? [`⚔ 最终决战！${enemyInfo.name}出现了！`, `✨ 六位女主的羁绊与你同在！`]
              : [`⚔ 遭遇了 ${enemyInfo.name}！`],
            turnCount: 1,
          };

          set({ gameState: { ...gameState, battle } });
          get().drawCards(5);
        },

        playCard: (cardId: string, _targetId?: string) => {
          const { gameState } = get();
          if (!gameState?.battle) return;

          const battle = { ...gameState.battle };
          const cardIndex = battle.hand.findIndex((c) => c.id === cardId);
          if (cardIndex === -1) return;

          const card = battle.hand[cardIndex];
          if (card.cost > battle.playerEnergy) return;

          battle.playerEnergy -= card.cost;
          const newLog = [...battle.battleLog];
          let popup: BattleState['damagePopup'] = null;

          // 元素连击：相同元素连续使用+15%伤害
          let comboMult = 1.0;
          if (battle.lastPlayedElement === card.element && (card.type === 'attack' || card.type === 'spell')) {
            battle.combo += 1;
            comboMult = 1 + battle.combo * 0.15;
            newLog.push(`🔥 ${battle.combo}连击！伤害+${Math.round((comboMult - 1) * 100)}%`);
          } else if (card.type === 'attack' || card.type === 'spell') {
            battle.combo = 0;
          }
          battle.lastPlayedElement = (card.type === 'attack' || card.type === 'spell') ? card.element : battle.lastPlayedElement;

          // 元素克制
          const elemMult = getElementMultiplier(card.element, battle.enemy.element);
          let isCrit = false;
          let isWeak = false;

          if (card.damage > 0) {
            let rawDmg = Math.floor(card.damage * comboMult * elemMult);
            if (elemMult >= 1.5) {
              // 暴击判定：克制时有30%暴击率
              isCrit = Math.random() < 0.3;
              if (isCrit) rawDmg = Math.floor(rawDmg * 1.8);
            }
            if (elemMult <= 0.75) {
              isWeak = true;
            }

            const afterShield = Math.max(0, rawDmg - battle.enemy.shield);
            battle.enemy.shield = Math.max(0, battle.enemy.shield - rawDmg);
            battle.enemy.hp = Math.max(0, battle.enemy.hp - afterShield);

            popup = { value: afterShield, type: isCrit ? 'crit' : isWeak ? 'weak' : 'damage', target: 'enemy' };
            const elemLabel = ELEMENT_NAMES[card.element];
            let msg = `${elemLabel} ${card.name} → ${afterShield}伤害`;
            if (isCrit) msg += ' 💥暴击！';
            if (isWeak) msg += ' 效果不佳…';
            if (elemMult >= 1.5 && !isCrit) msg += ' 效果拔群！';
            newLog.push(msg);
          }
          if (card.shield > 0) {
            battle.playerShield += card.shield;
            popup = { value: card.shield, type: 'shield', target: 'player' };
            newLog.push(`🛡 ${card.name} → +${card.shield}护盾`);
          }
          if (card.heal > 0) {
            const healed = Math.min(card.heal, battle.playerMaxHp - battle.playerHp);
            battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + card.heal);
            popup = { value: healed, type: 'heal', target: 'player' };
            newLog.push(`💚 ${card.name} → +${healed}HP`);
          }

          battle.hand = battle.hand.filter((_, i) => i !== cardIndex);
          battle.discardPile = [...battle.discardPile, card];
          battle.damagePopup = popup;
          battle.battleLog = newLog.slice(-8);

          if (battle.enemy.hp <= 0) {
            newLog.push(`🎉 击败了 ${battle.enemy.name}！`);
            battle.battleLog = newLog.slice(-8);
            set({ gameState: { ...gameState, battle } });
            setTimeout(() => {
              const { gameState: gs } = get();
              if (gs?.battle?.enemy.hp === 0) {
                const rewardCardIds = rollBattleRewards(battle.enemy.id, battle.enemy.element);
                const bondUnlocks = checkBondCardUnlocks(gs.affection, gs.cards);
                const newCardIds = [...new Set([...rewardCardIds, ...bondUnlocks])].filter(id => !gs.cards.includes(id));
                const updatedCards = [...gs.cards, ...newCardIds];
                const rewardNames = newCardIds.map(id => {
                  const c = findBattleCardById(id);
                  return c ? c.name : id;
                });
                set({ gameState: { ...gs, battle: null, cards: updatedCards, lastBattleRewards: newCardIds } });
                get().addNotification(`战斗胜利！获得 ${rewardNames.length > 0 ? rewardNames.join('、') : '经验'}`, 'success', 4000);
                for (const cid of newCardIds) {
                  const c = findBattleCardById(cid);
                  if (c && c.rarity === 'legendary') {
                    get().addNotification(`✨ 解锁羁绊卡牌：${c.name}！`, 'achievement', 5000);
                  } else if (c && c.rarity === 'rare') {
                    get().addNotification(`💎 获得稀有卡牌：${c.name}`, 'success', 3500);
                  }
                }
              }
            }, 1200);
            return;
          }

          // 敌人HP低于30%狂暴
          if (!battle.enemy.enraged && battle.enemy.hp < battle.enemy.maxHp * 0.3) {
            battle.enemy.enraged = true;
            battle.enemy.attack = Math.floor(battle.enemy.attack * 1.4);
            newLog.push(`⚠️ ${battle.enemy.name}进入狂暴状态！攻击力提升！`);
            battle.battleLog = newLog.slice(-8);
          }

          set({ gameState: { ...gameState, battle } });

          // 清除popup
          setTimeout(() => {
            const { gameState: gs2 } = get();
            if (gs2?.battle) {
              set({ gameState: { ...gs2, battle: { ...gs2.battle, damagePopup: null } } });
            }
          }, 800);
        },

        endTurn: () => {
          const { gameState } = get();
          if (!gameState?.battle) return;

          const battle = { ...gameState.battle };
          battle.isPlayerTurn = false;
          const newLog = [...battle.battleLog];

          const enemyInfo = ENEMY_DATABASE[battle.enemy.id];
          let action = enemyInfo?.attacks[battle.turn % enemyInfo.attacks.length];

          // AI智能选择：低血时倾向防御/特殊，玩家有盾时用特殊
          if (enemyInfo) {
            const hpPct = battle.enemy.hp / battle.enemy.maxHp;
            if (battle.enemy.enraged) {
              const specials = enemyInfo.attacks.filter(a => a.type === 'special' || a.type === 'attack');
              action = specials[Math.floor(Math.random() * specials.length)];
            } else if (battle.playerShield > 10) {
              const bigAttacks = enemyInfo.attacks.filter(a => a.type === 'special' || a.value > 10);
              action = bigAttacks.length > 0 ? bigAttacks[Math.floor(Math.random() * bigAttacks.length)] : enemyInfo.attacks[0];
            } else if (hpPct < 0.4) {
              const heals = enemyInfo.attacks.filter(a => a.type === 'defend' || a.type === 'buff');
              action = heals.length > 0 && Math.random() < 0.5 ? heals[Math.floor(Math.random() * heals.length)] : enemyInfo.attacks[0];
            } else {
              action = enemyInfo.attacks[Math.floor(Math.random() * enemyInfo.attacks.length)];
            }
          }

          if (!action) action = { name: '攻击', type: 'attack' as const, value: battle.enemy.attack, desc: '攻击' };

          battle.enemy.intent = action.type;
          battle.enemy.intentValue = action.value;

          setTimeout(() => {
            const { gameState: gs3 } = get();
            if (!gs3?.battle) return;
            const b = { ...gs3.battle };
            const log = [...b.battleLog];
            let dmgPopup: BattleState['damagePopup'] = null;

            if (action.type === 'attack' || action.type === 'special') {
              const elemMult = getElementMultiplier(b.enemy.element, b.playerElement);
              let dmg = Math.floor(action.value * elemMult);
              if (b.enemy.enraged) dmg = Math.floor(dmg * 1.2);
              const reduced = Math.max(0, dmg - b.playerShield);
              b.playerShield = Math.max(0, b.playerShield - dmg);
              b.playerHp = Math.max(0, b.playerHp - reduced);
              dmgPopup = { value: reduced, type: dmg > 15 ? 'crit' : 'damage', target: 'player' };
              log.push(`💢 ${b.enemy.name} 使用「${action.name}」→ ${reduced}伤害`);
              if (elemMult >= 1.5) log.push(`⚠ 属性克制！受到更多伤害！`);
            } else if (action.type === 'defend') {
              b.enemy.shield += action.value;
              dmgPopup = { value: action.value, type: 'shield', target: 'enemy' };
              log.push(`🛡 ${b.enemy.name} 使用「${action.name}」→ +${action.value}护盾`);
            } else if (action.type === 'buff') {
              b.enemy.attack += action.value;
              log.push(`⬆ ${b.enemy.name} 使用「${action.name}」→ 攻击力+${action.value}`);
            }

            b.damagePopup = dmgPopup;
            b.battleLog = log.slice(-8);

            if (b.playerHp <= 0) {
              log.push(`💀 你被 ${b.enemy.name} 击败了……`);
              b.battleLog = log.slice(-8);
              set({ gameState: { ...gs3, battle: b } });
              setTimeout(() => {
                const { gameState: gs4 } = get();
                if (!gs4) return;
                // 最终boss战败 → 黑暗结局剧情
                if (b.enemy.id === 'shadow_king' || b.enemy.id === 'shadow_king_giant') {
                  set({
                    gameState: { ...gs4, battle: null, currentNodeId: 'ch3_ending_dark_001' },
                    textDisplayProgress: 0,
                    isDialogueVisible: true,
                  });
                  get().addNotification('你被暗影之王击败了……', 'error', 3000);
                  return;
                }
                // 普通战斗战败 → 重试（重新初始化战斗）
                get().addNotification(`战斗失败……重新挑战 ${b.enemy.name}`, 'error', 2500);
                const enemyInfo2 = ENEMY_DATABASE[b.enemy.id];
                if (!enemyInfo2) return;
                const retryDeckBase = (b.enemy.id === 'shadow_king' || b.enemy.id === 'shadow_king_giant') ? getFinalBattleDeck() : buildPlayerDeck(gs4.cards);
                const deck2 = fisherYatesShuffle(retryDeckBase);
                const firstAtk = enemyInfo2.attacks[0];
                const battle2: BattleState = {
                  enemy: {
                    id: b.enemy.id, name: enemyInfo2.name, hp: enemyInfo2.hp, maxHp: enemyInfo2.hp,
                    attack: enemyInfo2.attack, element: enemyInfo2.element, sprite: enemyInfo2.sprite,
                    intent: firstAtk.type, intentValue: firstAtk.value, shield: 0, enraged: false,
                  },
                  playerHp: 100, playerMaxHp: 100, playerShield: 0,
                  playerEnergy: 3, playerMaxEnergy: 3, playerElement: 'light',
                  hand: [], drawPile: deck2, discardPile: [],
                  isPlayerTurn: true, turn: 1, combo: 0, lastPlayedElement: null,
                  damagePopup: null, battleLog: [`⚔ 再次挑战 ${enemyInfo2.name}！`], turnCount: 1,
                };
                set({ gameState: { ...gs4, battle: battle2 } });
                get().drawCards(5);
              }, 1500);
              return;
            }

            // 新回合
            b.turn += 1;
            b.turnCount = b.turn;
            b.playerEnergy = b.playerMaxEnergy + (b.turn > 5 ? 1 : 0);
            b.playerShield = 0;
            b.combo = 0;
            b.isPlayerTurn = true;

            b.discardPile = [...b.discardPile, ...b.hand];
            b.hand = [];

            // 设置下一回合意图预览
            const nextAttacks = ENEMY_DATABASE[b.enemy.id]?.attacks ?? enemyInfo?.attacks ?? [];
            if (nextAttacks.length > 0) {
              const nextAction = nextAttacks[b.turn % nextAttacks.length];
              b.enemy.intent = nextAction.type;
              b.enemy.intentValue = nextAction.type === 'attack' || nextAction.type === 'special'
                ? nextAction.value + (b.enemy.enraged ? 3 : 0)
                : nextAction.value;
            }

            set({ gameState: { ...gs3, battle: b } });
            get().drawCards(5);

            setTimeout(() => {
              const { gameState: gs5 } = get();
              if (gs5?.battle) {
                set({ gameState: { ...gs5, battle: { ...gs5.battle, damagePopup: null } } });
              }
            }, 800);
          }, 900);

          battle.battleLog = newLog.slice(-8);
          set({ gameState: { ...gameState, battle } });
        },

        drawCards: (count: number) => {
          const { gameState } = get();
          if (!gameState?.battle) return;

          const battle = { ...gameState.battle };
          const cardsToDraw: BattleCard[] = [];

          for (let i = 0; i < count; i++) {
            if (battle.drawPile.length === 0) {
              if (battle.discardPile.length === 0) break;
              battle.drawPile = fisherYatesShuffle(battle.discardPile);
              battle.discardPile = [];
            }
            const drawn = battle.drawPile.shift();
            if (drawn) cardsToDraw.push(drawn);
          }

          battle.hand = [...battle.hand, ...cardsToDraw];
          set({ gameState: { ...gameState, battle } });
        },

        getBattleState: (): BattleState | null => {
          return get().gameState?.battle ?? null;
        },

        // ── 结局动作 ─────────────────────────────────────────────────

        triggerEnding: (endingId: string) => {
          const { gameState } = get();
          if (!gameState) return;
          const flags = { ...gameState.flags, [`ending_reached_${endingId}`]: true };
          set({
            gameState: { ...gameState, currentEndingId: endingId, flags },
            currentScreen: 'ending',
            isDialogueVisible: false,
            isAutoMode: false,
            isSkipping: false,
          });
        },

        returnToTitle: () => {
          set({
            gameState: null,
            currentScreen: 'title',
            isDialogueVisible: false,
            isMenuOpen: false,
          });
        },

        jumpToNode: (nodeId: string) => {
          const { gameState } = get();
          if (!gameState) return;
          const node = getStoryNodeById(nodeId);
          if (!node) return;
          set({
            gameState: {
              ...gameState,
              currentNodeId: nodeId,
              currentChapter: node.chapter,
              battle: null,
              currentEndingId: null,
            },
            currentScreen: 'game',
            isDialogueVisible: true,
            textDisplayProgress: 0,
            isMenuOpen: false,
            isAutoMode: false,
            isSkipping: false,
          });
          get().addNotification(`已跳转至第${node.chapter}章场景`, 'info', 2000);
        },

        // ── 设置动作 ─────────────────────────────────────────────────

        updateSettings: (partial: Partial<GameSettings>) => {
          const { settings } = get();
          set({ settings: { ...settings, ...partial } });
        },

        resetSettings: () => {
          set({ settings: { ...DEFAULT_SETTINGS } });
        },

        // ── 自动保存 ─────────────────────────────────────────────────

        autoSave: () => {
          const { gameState } = get();
          if (!gameState) return;

          try {
            const autoSaveData: SaveData = {
              id: -1,
              gameState: { ...gameState, lastSaveTimestamp: Date.now() },
              timestamp: Date.now(),
              chapter: gameState.currentChapter,
              nodeName: storyNodes[gameState.currentNodeId]?.text?.slice(0, 20) ?? '',
              isEmpty: false,
            };
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
          } catch {
            // localStorage 不可用时静默失败
          }
        },

        loadAutoSave: () => {
          try {
            const raw = localStorage.getItem(AUTO_SAVE_KEY);
            if (!raw) {
              get().addNotification('没有找到自动存档', 'warning', 2000);
              return;
            }
            const data: SaveData = JSON.parse(raw);
            if (data.isEmpty) {
              get().addNotification('自动存档为空', 'warning', 2000);
              return;
            }
            const loaded = { ...data.gameState };
            if (!loaded.readNodes) loaded.readNodes = [];
            set({
              gameState: loaded,
              currentScreen: 'game',
              isDialogueVisible: true,
              textDisplayProgress: 0,
            });
            get().addNotification('自动存档已加载', 'success', 2000);
          } catch {
            get().addNotification('加载自动存档失败', 'error', 2000);
          }
        },

        // ── 教程动作 ─────────────────────────────────────────────────

        startTutorial: () => {
          set({
            showTutorial: true,
            tutorial: {
              isActive: true,
              currentStepId: 'welcome',
              completedSteps: [],
            },
          });
        },

        completeTutorialStep: (stepId: string) => {
          const { tutorial } = get();
          if (!tutorial.isActive) return;
          if (tutorial.completedSteps.includes(stepId)) return;

          const nextSteps: Record<string, string> = {
            'welcome': 'dialogue',
            'dialogue': 'choices',
            'choices': 'menu',
            'menu': 'complete',
          };

          const nextStepId = nextSteps[stepId] ?? '';
          const completedSteps = [...tutorial.completedSteps, stepId];

          if (nextStepId === 'complete') {
            set({
              showTutorial: false,
              tutorial: {
                isActive: false,
                currentStepId: '',
                completedSteps,
              },
            });
            get().setFlag('tutorial_complete', true);
            get().addNotification('教程完成！', 'achievement', 3000);
          } else {
            set({
              tutorial: {
                ...tutorial,
                currentStepId: nextStepId,
                completedSteps,
              },
            });
          }
        },

        dismissTutorial: () => {
          set({
            showTutorial: false,
            tutorial: {
              isActive: false,
              currentStepId: '',
              completedSteps: [],
            },
          });
        },

        // ── UI 辅助动作 ──────────────────────────────────────────────

        setCurrentScreen: (screen: string) => {
          set({ currentScreen: screen });
        },

        toggleMenu: () => {
          const { isMenuOpen } = get();
          set({ isMenuOpen: !isMenuOpen });
        },

        setDialogueVisible: (visible: boolean) => {
          set({ isDialogueVisible: visible });
        },

        addNotification: (
          message: string,
          type: Notification['type'] = 'info',
          duration: number = 3000,
        ) => {
          const id = generateNotificationId();
          const { notifications } = get();
          const newNotif: Notification = { id, message, type, duration };
          set({ notifications: [...notifications, newNotif] });

          // 自动移除
          if (duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }
        },

        removeNotification: (id: string) => {
          const { notifications } = get();
          set({ notifications: notifications.filter((n) => n.id !== id) });
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({
          settings: state.settings,
          saveSlots: state.saveSlots,
          tutorial: state.tutorial,
        }),
      },
    ),
    { name: 'MagicAcademyVN' },
  ),
);

// ─── 选择器（用于组件优化）──────────────────────────────────────────────

export const useGameState = () => useGameStore((s) => s.gameState);
export const useSettings = () => useGameStore((s) => s.settings);
export const useSaveSlots = () => useGameStore((s) => s.saveSlots);
export const useNotifications = () => useGameStore((s) => s.notifications);
export const useBattle = () => useGameStore((s) => s.gameState?.battle ?? null);
export const useTutorial = () => useGameStore((s) => s.tutorial);
export const useCurrentScreen = () => useGameStore((s) => s.currentScreen);
export const useIsDialogueVisible = () => useGameStore((s) => s.isDialogueVisible);
export const useTextProgress = () => useGameStore((s) => s.textDisplayProgress);
export const useIsAutoMode = () => useGameStore((s) => s.isAutoMode);
export const useIsSkipping = () => useGameStore((s) => s.isSkipping);
export const useIsMenuOpen = () => useGameStore((s) => s.isMenuOpen);

export function getBattleCardById(id: string): BattleCard | undefined {
  return findBattleCardById(id);
}

export const BATTLE_RARITY_COLORS: Record<BattleCard['rarity'], string> = {
  common: '#9E9E9E',
  uncommon: '#4FC3F7',
  rare: '#CE93D8',
  legendary: '#FFD54F',
};

export const BATTLE_ELEMENT_COLORS: Record<BattleElement, string> = {
  fire: '#FF6B35', ice: '#6EC6FF', water: '#29B6F6', wind: '#81C784',
  earth: '#BCAAA4', lightning: '#FFEB3B', light: '#FFF59D', dark: '#B39DDB', neutral: '#E0E0E0',
};
