/**
 * @file 角色立绘和背景资源管理
 * @description 管理所有角色立绘图片路径和背景图片路径
 */

// ============================================================================
// 角色立绘资源映射
// ============================================================================

/** 服饰类型 */
export type OutfitType = 'default' | 'battle' | 'casual' | 'formal' | 'pajama' | 'swimsuit';

/** 故事数据中的角色ID → 立绘文件夹名 映射 */
const CHARACTER_ID_MAP: Record<string, string> = {
  hoshino_sakura: 'sakura',
  sakura: 'sakura',
  kazane_rin: 'suzu',
  suzu: 'suzu',
  kishima_rin: 'rin',
  rin: 'rin',
  ishigami_aoi: 'aoi',
  aoi: 'aoi',
  amane_yuzu: 'yuzu',
  yuzu: 'yuzu',
  shiraishi_mashiro: 'mashiro',
  mashiro: 'mashiro',
  professor_helios: 'helios_professor',
  helios_professor: 'helios_professor',
  helios: 'helios_professor',
  helio: 'helios_professor',
  elder_helios: 'helios_elder',
  helios_elder: 'helios_elder',
  shadow_king: 'shadow_king',
  voice_of_stars: 'stellar_voice',
  stellar_voice: 'stellar_voice',
  star_voice: 'stellar_voice',
  kurosaki_soma: 'kurosaki_soma',
  soma: 'kurosaki_soma',
  shiratori_yuma: 'shiratori_yuma',
  yuma: 'shiratori_yuma',
  enomori: 'enomori',
};

/** 角色立绘路径映射：文件夹名 -> outfitType -> image path */
const SPRITE_PATHS: Record<string, Record<OutfitType, string>> = {
  sakura: {
    default: '/images/characters/sakura/default.png',
    battle: '/images/characters/sakura/battle.png',
    casual: '/images/characters/sakura/casual.png',
    formal: '/images/characters/sakura/formal.png',
    pajama: '/images/characters/sakura/default.png',
    swimsuit: '/images/characters/sakura/default.png',
  },
  rin: {
    default: '/images/characters/rin/default.png',
    battle: '/images/characters/rin/battle.png',
    casual: '/images/characters/rin/casual.png',
    formal: '/images/characters/rin/formal.png',
    pajama: '/images/characters/rin/default.png',
    swimsuit: '/images/characters/rin/default.png',
  },
  suzu: {
    default: '/images/characters/suzu/default.png',
    battle: '/images/characters/suzu/battle.png',
    casual: '/images/characters/suzu/casual.png',
    formal: '/images/characters/suzu/formal.png',
    pajama: '/images/characters/suzu/default.png',
    swimsuit: '/images/characters/suzu/default.png',
  },
  aoi: {
    default: '/images/characters/aoi/default.png',
    battle: '/images/characters/aoi/battle.png',
    casual: '/images/characters/aoi/casual.png',
    formal: '/images/characters/aoi/formal.png',
    pajama: '/images/characters/aoi/default.png',
    swimsuit: '/images/characters/aoi/default.png',
  },
  yuzu: {
    default: '/images/characters/yuzu/default.png',
    battle: '/images/characters/yuzu/battle.png',
    casual: '/images/characters/yuzu/casual.png',
    formal: '/images/characters/yuzu/formal.png',
    pajama: '/images/characters/yuzu/default.png',
    swimsuit: '/images/characters/yuzu/default.png',
  },
  mashiro: {
    default: '/images/characters/mashiro/default.png',
    battle: '/images/characters/mashiro/battle.png',
    casual: '/images/characters/mashiro/casual.png',
    formal: '/images/characters/mashiro/formal.png',
    pajama: '/images/characters/mashiro/default.png',
    swimsuit: '/images/characters/mashiro/default.png',
  },
  helios_professor: {
    default: '/images/characters/helios_professor/default.png',
    battle: '/images/characters/helios_professor/battle.png',
    casual: '/images/characters/helios_professor/default.png',
    formal: '/images/characters/helios_professor/formal.png',
    pajama: '/images/characters/helios_professor/default.png',
    swimsuit: '/images/characters/helios_professor/default.png',
  },
  helios_elder: {
    default: '/images/characters/helios_elder/default.png',
    battle: '/images/characters/helios_elder/battle.png',
    casual: '/images/characters/helios_elder/default.png',
    formal: '/images/characters/helios_elder/default.png',
    pajama: '/images/characters/helios_elder/default.png',
    swimsuit: '/images/characters/helios_elder/default.png',
  },
  shadow_king: {
    default: '/images/characters/shadow_king/default.png',
    battle: '/images/characters/shadow_king/battle.png',
    casual: '/images/characters/shadow_king/default.png',
    formal: '/images/characters/shadow_king/default.png',
    pajama: '/images/characters/shadow_king/default.png',
    swimsuit: '/images/characters/shadow_king/default.png',
  },
  stellar_voice: {
    default: '/images/characters/stellar_voice/default.png',
    battle: '/images/characters/stellar_voice/default.png',
    casual: '/images/characters/stellar_voice/default.png',
    formal: '/images/characters/stellar_voice/default.png',
    pajama: '/images/characters/stellar_voice/default.png',
    swimsuit: '/images/characters/stellar_voice/default.png',
  },
  kurosaki_soma: {
    default: '/images/characters/kurosaki_soma/default.png',
    battle: '/images/characters/kurosaki_soma/default.png',
    casual: '/images/characters/kurosaki_soma/default.png',
    formal: '/images/characters/kurosaki_soma/default.png',
    pajama: '/images/characters/kurosaki_soma/default.png',
    swimsuit: '/images/characters/kurosaki_soma/default.png',
  },
  shiratori_yuma: {
    default: '/images/characters/shiratori_yuma/default.png',
    battle: '/images/characters/shiratori_yuma/default.png',
    casual: '/images/characters/shiratori_yuma/default.png',
    formal: '/images/characters/shiratori_yuma/default.png',
    pajama: '/images/characters/shiratori_yuma/default.png',
    swimsuit: '/images/characters/shiratori_yuma/default.png',
  },
  enomori: {
    default: '/images/characters/enomori/default.png',
    battle: '/images/characters/enomori/default.png',
    casual: '/images/characters/enomori/default.png',
    formal: '/images/characters/enomori/default.png',
    pajama: '/images/characters/enomori/default.png',
    swimsuit: '/images/characters/enomori/default.png',
  },
};

// ============================================================================
// 背景图片资源映射
// ============================================================================

/** 背景ID到图片路径的映射 */
export const BACKGROUND_IMAGES: Record<string, string> = {
  'bg_academy_gate': '/images/backgrounds/academy_gate.jpg',
  'bg_academy_gate_night': '/images/backgrounds/night_sky.jpg',
  'bg_lobby': '/images/backgrounds/academy_gate.jpg',
  'bg_office': '/images/backgrounds/library.jpg',
  'bg_classroom': '/images/backgrounds/classroom.jpg',
  'bg_classroom_evening': '/images/backgrounds/classroom.jpg',
  'bg_library': '/images/backgrounds/library.jpg',
  'bg_cafeteria': '/images/backgrounds/cafeteria.jpg',
  'bg_dormitory': '/images/backgrounds/dormitory.jpg',
  'bg_dormitory_night': '/images/backgrounds/dormitory.jpg',
  'bg_dorm_room': '/images/backgrounds/dormitory.jpg',
  'bg_dorm_room_night': '/images/backgrounds/dormitory.jpg',
  'bg_garden': '/images/backgrounds/forest.jpg',
  'bg_forest': '/images/backgrounds/forest.jpg',
  'bg_forest_deep': '/images/backgrounds/forest.jpg',
  'bg_ruins_entrance': '/images/backgrounds/forest.jpg',
  'bg_ruins_interior': '/images/backgrounds/forest.jpg',
  'bg_arena': '/images/backgrounds/academy_gate.jpg',
  'bg_festival_day': '/images/backgrounds/academy_gate.jpg',
  'bg_festival_night': '/images/backgrounds/night_sky.jpg',
  'bg_rooftop': '/images/backgrounds/night_sky.jpg',
  'bg_rooftop_night': '/images/backgrounds/night_sky.jpg',
  'bg_training_ground': '/images/backgrounds/academy_gate.jpg',
  'bg_alchemy_lab': '/images/backgrounds/library.jpg',
  'bg_night': '/images/backgrounds/night_sky.jpg',
  'bg_starry_sky': '/images/backgrounds/night_sky.jpg',
  'bg_starry_sky_bright': '/images/backgrounds/night_sky.jpg',
  'bg_academy_hall': '/images/backgrounds/academy_gate.jpg',
  'bg_shrine': '/images/backgrounds/forest.jpg',
  'bg_corridor': '/images/backgrounds/classroom.jpg',
  'bg_city_sunset': '/images/backgrounds/academy_gate.jpg',
  'bg_auditorium': '/images/backgrounds/auditorium.jpg',
  'bg_music_room': '/images/backgrounds/music_room.jpg',
  'bg_lake': '/images/backgrounds/lake.jpg',
  'bg_rooftop_garden': '/images/backgrounds/rooftop_garden.jpg',
  'bg_workshop': '/images/backgrounds/workshop.jpg',
  'bg_star_tower': '/images/backgrounds/star_tower.jpg',
};

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 获取角色立绘图片路径
 * 自动将故事数据中的角色ID（如 kazane_rin）映射到立绘文件夹名（如 suzu）
 * @param characterId - 角色ID（可以是全名或简称）
 * @param outfit - 服饰类型，默认为 'default'
 * @returns 图片路径
 */
export function getCharacterSprite(characterId: string, outfit: OutfitType = 'default'): string {
  const folderName = CHARACTER_ID_MAP[characterId] || characterId;
  const sprites = SPRITE_PATHS[folderName];
  if (!sprites) return '';
  const path = sprites[outfit] || sprites.default || '';
  return path ? process.env.PUBLIC_URL + path : '';
}

/**
 * 获取背景图片路径
 * @param backgroundId - 背景ID
 * @returns 图片路径，如果不存在返回空字符串
 */
export function getBackgroundImage(backgroundId: string): string {
  const path = BACKGROUND_IMAGES[backgroundId] || '';
  return path ? process.env.PUBLIC_URL + path : '';
}

/**
 * 判断是否有真实的背景图片（而非CSS渐变）
 */
export function hasRealBackground(backgroundId: string): boolean {
  return backgroundId in BACKGROUND_IMAGES;
}
