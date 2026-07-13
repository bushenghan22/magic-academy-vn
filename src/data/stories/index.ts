/**
 * @file 故事数据索引 - 星辉魔法学院
 * @description 静态导入 + 延迟构建Map。首次 getNodeById 调用时才遍历构建索引。
 */

import { CHAPTER_1_NODES } from './chapter1';
import { CHAPTER_2_NODES } from './chapter2';
import { CHAPTER_3_NODES } from './chapter3';

// ============================================================================
// 类型定义
// ============================================================================

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
  type: 'dialogue' | 'choice' | 'battle' | 'cutscene' | 'date' | 'branch' | 'ending';
  chapter: number;
  speaker?: string;
  text: string;
  emotion?: string;
  portrait?: string;
  background?: string;
  bgm?: string;
  music?: string;
  sfx?: string;
  next?: string;
  nextNode?: string;
  defaultOption?: StoryChoice;
  choices?: StoryChoice[];
  effects?: StoryEffect[];
  flags?: Record<string, boolean>;
  characterSprites?: CharacterSprite[];
  animation?: string;
  enemyId?: string;
}

export interface ChapterPart {
  id: string;
  title: string;
  startNode: string;
  nodeCount: number;
}

export interface ChapterInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  parts: ChapterPart[];
  startNode: string;
  totalNodes: number;
}

// ============================================================================
// 章节元数据
// ============================================================================

export const CHAPTERS: ChapterInfo[] = [
  {
    id: 1, title: '入学篇', subtitle: 'The Enrollment',
    description: '平凡少年觉醒魔法力量，踏入星辉魔法学院的大门。',
    parts: [
      { id: 'prologue', title: '序章 - 觉醒', startNode: 'ch1_prologue_001', nodeCount: 32 },
      { id: 'class', title: '第一课 - 魔法基础', startNode: 'ch1_classroom_001', nodeCount: 42 },
      { id: 'forest', title: '森林探索', startNode: 'ch1_forest_001', nodeCount: 52 },
      { id: 'daily', title: '日常与羁绊', startNode: 'ch1_daily_001', nodeCount: 42 },
      { id: 'festival', title: '学院祭', startNode: 'ch1_festival_001', nodeCount: 40 },
    ],
    startNode: 'ch1_prologue_001', totalNodes: 308,
  },
  {
    id: 2, title: '暗涌篇', subtitle: 'Shadows Rising',
    description: '新学期开始，暗影裂缝频繁出现，古老的封印正在松动，同伴们的秘密逐渐浮出水面。',
    parts: [
      { id: 'new_semester', title: '新学期', startNode: 'ch2_new_001', nodeCount: 52 },
      { id: 'shadows', title: '阴影浮现', startNode: 'ch2_shadow_001', nodeCount: 64 },
      { id: 'route_sakura', title: '星野樱路线', startNode: 'ch2_route_sakura_001', nodeCount: 18 },
      { id: 'route_rin', title: '月岛凛路线', startNode: 'ch2_route_rin_001', nodeCount: 16 },
      { id: 'route_suzu', title: '风间铃路线', startNode: 'ch2_route_suzu_001', nodeCount: 16 },
      { id: 'route_aoi', title: '石神葵路线', startNode: 'ch2_route_aoi_001', nodeCount: 16 },
      { id: 'route_yuzu', title: '天音柚路线', startNode: 'ch2_route_yuzu_001', nodeCount: 16 },
      { id: 'route_mashiro', title: '白石真白路线', startNode: 'ch2_route_mashiro_001', nodeCount: 16 },
      { id: 'turning_point', title: '转折点', startNode: 'ch2_turn_001', nodeCount: 62 },
      { id: 'finale', title: '第二章终幕', startNode: 'ch2_end_001', nodeCount: 52 },
    ],
    startNode: 'ch2_new_001', totalNodes: 328,
  },
  {
    id: 3, title: '星辉篇', subtitle: 'The Stellar Arc',
    description: '最终决战与命运的抉择。',
    parts: [
      { id: 'eve', title: '最终决战前夜', startNode: 'ch3_eve_001', nodeCount: 55 },
      { id: 'labyrinth', title: '暗影迷宫', startNode: 'ch3_labyrinth_001', nodeCount: 65 },
      { id: 'truth', title: '真相大白', startNode: 'ch3_truth_001', nodeCount: 55 },
      { id: 'final', title: '最终决战', startNode: 'ch3_battle_001', nodeCount: 65 },
      { id: 'endings', title: '结局', startNode: 'ch3_ending_sakura_good_001', nodeCount: 80 },
    ],
    startNode: 'ch3_eve_001', totalNodes: 320,
  },
];

// ============================================================================
// 延迟构建的节点索引（首次访问时才遍历，不阻塞模块加载）
// ============================================================================

let _allNodesMap: Map<string, StoryNode> | null = null;
let _chapterNodes: Map<number, StoryNode[]> | null = null;

function ensureInitialized(): Map<string, StoryNode> {
  if (_allNodesMap) return _allNodesMap;

  _allNodesMap = new Map();
  _chapterNodes = new Map();

  // 将所有章节的节点合并到映射表中
  for (const node of CHAPTER_1_NODES as StoryNode[]) {
    _allNodesMap.set(node.id, node);
    if (!_chapterNodes.has(node.chapter)) _chapterNodes.set(node.chapter, []);
    _chapterNodes.get(node.chapter)!.push(node);
  }
  for (const node of CHAPTER_2_NODES as StoryNode[]) {
    _allNodesMap.set(node.id, node);
    if (!_chapterNodes.has(node.chapter)) _chapterNodes.set(node.chapter, []);
    _chapterNodes.get(node.chapter)!.push(node);
  }
  for (const node of CHAPTER_3_NODES as StoryNode[]) {
    _allNodesMap.set(node.id, node);
    if (!_chapterNodes.has(node.chapter)) _chapterNodes.set(node.chapter, []);
    _chapterNodes.get(node.chapter)!.push(node);
  }

  return _allNodesMap;
}

// ============================================================================
// 预加载（异步兼容，实际同步执行）
// ============================================================================

export async function preloadChapter1(): Promise<void> {
  // 同步构建索引（非常快，只需遍历约600个对象）
  ensureInitialized();
}

export async function loadChapter(chapter: number): Promise<StoryNode[]> {
  ensureInitialized();
  return _chapterNodes?.get(chapter) || [];
}

// ============================================================================
// 查询函数
// ============================================================================

export function getNodeById(id: string): StoryNode | undefined {
  return ensureInitialized().get(id);
}

export function getChapterNodes(chapter: number): StoryNode[] {
  ensureInitialized();
  return _chapterNodes?.get(chapter) || [];
}

export function getCharacterNodes(characterId: string): StoryNode[] {
  const result: StoryNode[] = [];
  for (const node of ensureInitialized().values()) {
    if (node.speaker === characterId) result.push(node);
  }
  return result;
}

export function getChoiceNodes(): StoryNode[] {
  const result: StoryNode[] = [];
  for (const node of ensureInitialized().values()) {
    if (node.type === 'choice') result.push(node);
  }
  return result;
}

export function getEndingNodes(): StoryNode[] {
  const result: StoryNode[] = [];
  for (const node of ensureInitialized().values()) {
    if (node.next === undefined && (node.type === 'cutscene' || node.type === 'branch')) {
      const isEnding = node.effects?.some(
        (e) => (e.type === 'flag' && String(e.target).startsWith('ending_')) ||
               (e.type === 'unlock' && String(e.target).startsWith('ending_')),
      );
      if (isEnding) result.push(node);
    }
  }
  return result;
}

export function getNextNode(currentId: string, choiceId?: string): StoryNode | undefined {
  const currentNode = getNodeById(currentId);
  if (!currentNode) return undefined;

  if (currentNode.type === 'choice' && currentNode.choices) {
    if (!choiceId) return undefined;
    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return undefined;
    return getNodeById(choice.nextNode);
  }

  if (currentNode.next) return getNodeById(currentNode.next);
  return undefined;
}

export function getNodesByPrefix(prefix: string): StoryNode[] {
  const result: StoryNode[] = [];
  for (const node of ensureInitialized().values()) {
    if (node.id.startsWith(prefix)) result.push(node);
  }
  result.sort((a, b) => a.id.localeCompare(b.id));
  return result;
}

export function getStoryStats() {
  ensureInitialized();
  const result: any[] = [];
  if (_chapterNodes) {
    for (const [chapter, nodes] of _chapterNodes) {
      const stats = { chapter, totalNodes: nodes.length, totalChoices: 0, totalDialogues: 0, totalCutscenes: 0, totalBattles: 0 };
      for (const node of nodes) {
        if (node.type === 'choice') stats.totalChoices++;
        if (node.type === 'dialogue') stats.totalDialogues++;
        if (node.type === 'cutscene') stats.totalCutscenes++;
        if (node.type === 'battle') stats.totalBattles++;
      }
      result.push(stats);
    }
  }
  result.sort((a: any, b: any) => a.chapter - b.chapter);
  return result;
}

export function validateNodeReferences(): string[] {
  const issues: string[] = [];
  const allNodes = ensureInitialized();
  for (const node of allNodes.values()) {
    if (node.next && !allNodes.has(node.next)) {
      issues.push(`节点 "${node.id}" 的 next 指向不存在的节点 "${node.next}"`);
    }
    if (node.choices) {
      for (const choice of node.choices) {
        if (!allNodes.has(choice.nextNode)) {
          issues.push(`节点 "${node.id}" 的选项 "${choice.id}" 指向不存在的节点 "${choice.nextNode}"`);
        }
      }
    }
  }
  return issues;
}
