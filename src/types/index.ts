/**
 * @file 星辉魔法学院 - 类型定义入口文件
 * @description 统一导出所有游戏相关类型定义
 *
 * 使用方式：
 * ```typescript
 * import { StoryNode, Character, Card, GameState } from '@/types';
 * ```
 */

// 从 game.ts 导出所有类型
export type {
  // 基础枚举类型
  ElementType,
  CardRarity,
  CardType,
  StoryNodeType,
  BattlePhase,
  EndingType,
  ConditionType,
  ConditionOperator,
  EffectType,
  ChapterNumber,

  // 基础映射类型
  SpriteMap,
  FlagMap,
  NumberMap,
  StringMap,

  // 游戏实体类型
  Condition,
  Effect,
  Choice,
  CharacterSprite,
  StoryNode,
  AffectionLevel,
  Character,
  Card,
  BuffDebuff,
  BattleState,
  DateEvent,
  Ending,
  Tutorial,

  // 系统状态类型
  GameSettings,
  SaveData,
  GameState,
  ChoiceRecord,
  BattleEvent,
  CGGalleryEntry,
  Achievement,
  Item,
  ChapterDefinition,
  DialogueRecord,
  ElementRelation,
  ResourceConfig,
  SceneBackground,
} from './game';
