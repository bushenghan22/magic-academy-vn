/**
 * MagicParticles - 星辉魔法学院粒子特效组件
 *
 * 使用 Canvas 2D 绘制魔法浮动粒子背景效果。
 * 粒子包含多种颜色（紫、青、金、白）、不同大小和闪烁效果，
 * 以极低透明度呈现，不干扰游戏主画面。
 */

import { useRef, useEffect, useCallback } from 'react';

// ===== 粒子颜色配置 =====
const PARTICLE_COLORS = [
  'rgba(180, 130, 255,',   // 紫色
  'rgba(130, 220, 255,',   // 青色
  'rgba(255, 215, 100,',   // 金色
  'rgba(255, 255, 255,',   // 白色
] as const;

// ===== 粒子接口 =====
interface Particle {
  x: number;           // 当前 X 坐标
  y: number;           // 当前 Y 坐标
  radius: number;      // 半径 (1 ~ 4 px)
  speedY: number;      // 上升速度
  speedX: number;      // 水平漂移速度
  color: string;       // 颜色前缀 (不含透明度)
  opacity: number;     // 当前透明度
  maxOpacity: number;  // 最大透明度 (0.1 ~ 0.4)
  twinkle: boolean;    // 是否闪烁
  twinkleSpeed: number;// 闪烁速度
  phase: number;       // 正弦波相位（水平摆动）
  waveAmp: number;     // 正弦波振幅
}

// ===== 创建单个粒子 =====
function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  const colorIndex = Math.floor(Math.random() * PARTICLE_COLORS.length);
  const maxOpacity = 0.1 + Math.random() * 0.3; // 0.1 ~ 0.4

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: 1 + Math.random() * 3,             // 1 ~ 4 px
    speedY: -(0.15 + Math.random() * 0.35),     // 缓慢向上
    speedX: (Math.random() - 0.5) * 0.3,        // 轻微水平漂移
    color: PARTICLE_COLORS[colorIndex],
    opacity: maxOpacity * (0.3 + Math.random() * 0.7),
    maxOpacity,
    twinkle: Math.random() > 0.5,               // 50% 粒子会闪烁
    twinkleSpeed: 0.01 + Math.random() * 0.03,
    phase: Math.random() * Math.PI * 2,          // 随机初始相位
    waveAmp: 0.3 + Math.random() * 0.7,          // 摆动振幅
  };
}

// ===== 绘制单个粒子 =====
function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  // 使用径向渐变实现发光效果
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
  gradient.addColorStop(0, `${p.color} ${p.opacity})`);
  gradient.addColorStop(0.4, `${p.color} ${p.opacity * 0.6})`);
  gradient.addColorStop(1, `${p.color} 0)`);

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// ===== 组件 =====

/**
 * MagicParticles 魔法粒子特效组件
 * 无 props，全屏 Canvas 覆盖，pointer-events: none
 */
export default function MagicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  /** 初始化所有粒子 */
  const initParticles = useCallback((width: number, height: number) => {
    const count = 60 + Math.floor(Math.random() * 40); // 60 ~ 100 个粒子
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(width, height));
    }
    particlesRef.current = particles;
  }, []);

  /** 更新单个粒子状态 */
  const updateParticle = useCallback(
    (p: Particle, width: number, height: number, time: number) => {
      // 上升移动
      p.y += p.speedY;

      // 水平正弦波摆动
      p.phase += 0.01;
      p.x += p.speedX + Math.sin(p.phase) * p.waveAmp * 0.1;

      // 闪烁效果
      if (p.twinkle) {
        p.opacity =
          p.maxOpacity *
          (0.3 + 0.7 * Math.abs(Math.sin(time * p.twinkleSpeed)));
      }

      // 超出画面顶部时，重置到底部
      if (p.y < -p.radius * 2) {
        p.y = height + p.radius * 2;
        p.x = Math.random() * width;
      }

      // 水平超出边界时回绕
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /** 设置画布尺寸 */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 首次或尺寸变化时重新初始化粒子
      initParticles(canvas.width, canvas.height);
    };

    resizeCanvas();

    /** 主动画循环 */
    const animate = () => {
      // 页面不可见时暂停动画以节省性能
      if (document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      timeRef.current += 1;

      // 更新并绘制每个粒子
      for (const particle of particlesRef.current) {
        updateParticle(particle, width, height, timeRef.current);
        drawParticle(ctx, particle);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画
    animationRef.current = requestAnimationFrame(animate);

    // 监听窗口尺寸变化
    window.addEventListener('resize', resizeCanvas);
    // 监听可见性变化，暂停/恢复动画
    const handleVisibility = () => {
      if (!document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 清理函数
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [initParticles, updateParticle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
