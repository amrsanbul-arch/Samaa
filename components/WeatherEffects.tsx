'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { EffectConfig } from '@/lib/weather';

type Particle = {
  x: number;
  y: number;
  len: number;
  speed: number;
  size: number;
  sway: number;
  phase: number;
};

export default function WeatherEffects({ effects }: { effects: EffectConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const isSnow = effects.snow > 0.2;
  const precip = isSnow ? effects.snow : effects.rain;
  const animate = precip > 0.05 && !reducedMotion;

  useEffect(() => {
    if (!animate) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let last = performance.now();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = isSnow ? 1 / 6000 : 1 / 3200;
      const target = Math.round(width * height * density * (0.4 + precip));
      const count = Math.min(240, Math.max(36, target));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: isSnow ? 0 : 8 + Math.random() * 16,
        speed: isSnow ? 22 + Math.random() * 46 : 480 + Math.random() * 620,
        size: isSnow ? 1 + Math.random() * 2.1 : 0.7 + Math.random() * 0.9,
        sway: 10 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (now: number) => {
      const delta = Math.min(48, now - last) / 1000;
      last = now;
      ctx.clearRect(0, 0, width, height);

      if (isSnow) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        for (const particle of particles) {
          particle.phase += delta * 1.6;
          particle.y += particle.speed * delta;
          particle.x += Math.sin(particle.phase) * particle.sway * delta + effects.wind * 26 * delta;
          if (particle.y > height + 6) {
            particle.y = -6;
            particle.x = Math.random() * width;
          }
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const slant = 1.4 + effects.wind * 5;
        ctx.strokeStyle = 'rgba(190, 220, 255, 0.62)';
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        for (const particle of particles) {
          particle.y += particle.speed * delta;
          particle.x -= particle.speed * delta * slant * 0.16;
          if (particle.y > height + 30) {
            particle.y = -30;
            particle.x = Math.random() * width * 1.2;
          }
          if (particle.x < -40) particle.x = width + 20;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.len * slant * 0.16, particle.y - particle.len);
        }
        ctx.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    build();
    frame = requestAnimationFrame(draw);

    const observer = new ResizeObserver(build);
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [animate, isSnow, precip, effects.wind]);

  const streaks = useMemo(() => {
    if (effects.wind < 0.22 || reducedMotion) return [];
    const count = Math.round(3 + effects.wind * 7);
    return Array.from({ length: count }, (_, index) => ({
      top: `${8 + ((index * 37) % 74)}%`,
      width: `${24 + ((index * 13) % 30)}vw`,
      duration: `${2.6 + (index % 4) * 0.7}s`,
      delay: `${(index * 0.9) % 4}s`,
      opacity: 0.18 + effects.wind * 0.35,
    }));
  }, [effects.wind, reducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* sun / lens flare */}
      {effects.sun > 0.2 && (
        <div className="absolute inset-0" style={{ opacity: 0.22 + effects.sun * 0.38 }}>
          <div
            className="absolute -top-[22vmax] end-[-14vmax] h-[64vmax] w-[64vmax] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255,236,196,0.85) 0%, rgba(255,199,110,0.32) 38%, rgba(255,170,80,0.08) 62%, transparent 75%)',
              animation: reducedMotion ? undefined : 'flarePulse 9s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -top-[6vmax] end-[6vmax] h-[22vmax] w-[22vmax] rounded-full opacity-60 blur-2xl"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255,226,170,0.5), transparent 22%, rgba(255,226,170,0.35) 48%, transparent 70%)',
              animation: reducedMotion ? undefined : 'flareSpin 70s linear infinite',
            }}
          />
          <div className="absolute inset-x-[18%] top-[16%] h-px bg-gradient-to-l from-transparent via-cream/25 to-transparent blur-[1px]" />
        </div>
      )}

      {/* drifting clouds */}
      {effects.clouds > 0.32 && (
        <div className="absolute inset-0" style={{ opacity: 0.12 + effects.clouds * 0.26 }}>
          {[
            { top: '-14%', start: '2%', size: '46vmax', duration: 52, delay: 0 },
            { top: '6%', start: '52%', size: '38vmax', duration: 68, delay: -12 },
            { top: '34%', start: '-10%', size: '50vmax', duration: 78, delay: -30 },
          ].map((cloud, index) => (
            <div
              key={index}
              className="absolute rounded-full blur-3xl"
              style={{
                top: cloud.top,
                insetInlineStart: cloud.start,
                width: cloud.size,
                height: `calc(${cloud.size} * 0.55)`,
                background:
                  'radial-gradient(closest-side, rgba(226,233,244,0.4), rgba(186,200,224,0.1) 60%, transparent 78%)',
                animation: reducedMotion
                  ? undefined
                  : `cloudDrift ${cloud.duration}s ease-in-out ${cloud.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* fog bands */}
      {effects.fog > 0.2 && (
        <div className="absolute inset-0" style={{ opacity: 0.55 }}>
          {[
            { top: '46%', h: '22vh', d: 46 },
            { top: '62%', h: '28vh', d: 62 },
          ].map((band, index) => (
            <div
              key={index}
              className="absolute inset-x-[-20%] blur-3xl"
              style={{
                top: band.top,
                height: band.h,
                background:
                  'linear-gradient(90deg, transparent, rgba(226,232,240,0.35) 35%, rgba(226,232,240,0.42) 60%, transparent)',
                animation: reducedMotion
                  ? undefined
                  : `fogDrift ${band.d}s ease-in-out ${index * -8}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* wind streaks */}
      {streaks.length > 0 && (
        <div className="absolute inset-0">
          {streaks.map((streak, index) => (
            <div
              key={index}
              className="absolute h-px rounded-full bg-gradient-to-l from-transparent via-white/60 to-transparent"
              style={{
                top: streak.top,
                insetInlineEnd: '-30vw',
                width: streak.width,
                opacity: streak.opacity,
                animation: `windStreak ${streak.duration} linear ${streak.delay} infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* lightning */}
      {effects.lightning && !reducedMotion && (
        <>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(214,232,255,0.9),rgba(140,170,255,0.35)_40%,transparent_70%)]"
            style={{ animation: 'lightningFlash 11s linear infinite' }}
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.8),transparent_65%)]"
            style={{ animation: 'lightningFlash 17s linear 5s infinite' }}
          />
        </>
      )}

      {/* rain / snow particles */}
      {animate && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}

      {/* film grain + vignette for the cinematic look */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
