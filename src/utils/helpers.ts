/**
 * 星辉魔法学院 - 工具函数
 * 包含游戏中常用的辅助函数
 */

/**
 * 格式化游戏时间
 * @param seconds 秒数
 * @returns 格式化的时间字符串 (HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

/**
 * 格式化日期（用于存档槽位显示）
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化的日期字符串 (YYYY/MM/DD HH:MM)
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * 限制数值在指定范围内
 * @param value 要限制的值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 * @param a 起始值
 * @param b 目标值
 * @param t 插值参数 (0-1)
 * @returns 插值结果
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fisher-Yates 洗牌算法
 * @param arr 要打乱的数组
 * @returns 打乱后的新数组
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * 获取章节显示名称
 * @param chapter 章节号
 * @returns 章节名称
 */
export function getChapterName(chapter: number): string {
  const chapterNames: Record<number, string> = {
    1: '序章：命运的相遇',
    2: '第一章：魔法的觉醒',
    3: '第二章：羁绊的萌芽',
    4: '第三章：试炼与成长',
    5: '第四章：心灵的共鸣',
    6: '第五章：暗流涌动',
    7: '第六章：永恒的誓言',
    8: '终章：星辉永恒',
  };

  return chapterNames[chapter] || `第${chapter}章`;
}

/**
 * 获取元素显示颜色
 * @param element 元素类型
 * @returns 颜色代码
 */
export function getElementColor(element: string): string {
  const elementColors: Record<string, string> = {
    fire: '#FF4444',      // 火属性 - 红色
    ice: '#44AAFF',       // 冰属性 - 蓝色
    wind: '#44FF88',      // 风属性 - 绿色
    earth: '#CC8844',     // 土属性 - 棕色
    lightning: '#FFEE44', // 雷属性 - 黄色
    light: '#FFDD88',     // 光属性 - 金色
    dark: '#8844CC',      // 暗属性 - 紫色
  };

  return elementColors[element.toLowerCase()] || '#FFFFFF';
}

/**
 * 获取稀有度星级显示
 * @param rarity 稀有度
 * @returns 星级显示字符串
 */
export function getRarityStars(rarity: string): string {
  const rarityStars: Record<string, string> = {
    common: '★',           // 普通 - 1星
    uncommon: '★★',       // 稀有 - 2星
    rare: '★★★',          // 史诗 - 3星
    epic: '★★★★',        // 传说 - 4星
    legendary: '★★★★★',  // 神话 - 5星
  };

  return rarityStars[rarity.toLowerCase()] || '★';
}

/**
 * 根据经验值计算等级
 * @param exp 当前经验值
 * @returns 等级信息
 */
export function calculateLevel(exp: number): { level: number; currentExp: number; nextLevelExp: number } {
  // 每级所需经验值递增
  let level = 1;
  let totalExpRequired = 0;
  let expForNextLevel = 100;

  while (totalExpRequired + expForNextLevel <= exp) {
    totalExpRequired += expForNextLevel;
    level++;
    // 每级所需经验增加10%
    expForNextLevel = Math.floor(expForNextLevel * 1.1);
  }

  return {
    level,
    currentExp: exp - totalExpRequired,
    nextLevelExp: expForNextLevel,
  };
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${randomPart}`;
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
}

/**
 * 判断是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 安全解析JSON
 * @param json JSON字符串
 * @param defaultValue 默认值
 * @returns 解析结果或默认值
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 格式化数字（添加千位分隔符）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}
