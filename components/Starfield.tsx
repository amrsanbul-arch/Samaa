'use client';

import { useMemo } from 'react';

type Star = { x: number; y: number; r: number; o: number; d: number };

function seededStars(count: number, seed = 7): Star[] {
  let s = seed;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    x: random() * 100,
    y: random() * 100,
    r: 0.18 + random() * 0.6,
    o: 0.2 + random() * 0.55,
    d: random() * 6,
  }));
}

/** Cheap CSS/SVG night sky: three star layers plus two soft nebulae. */
export default function Starfield({ dim = false, daylight = false }: { dim?: boolean; daylight?: boolean }) {
  const stars = useMemo(() => seededStars(220), []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
        dim ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-[#0B1220]" />

      <svg
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          daylight ? 'opacity-35' : 'opacity-100'
        }`}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {stars.map((star, index) => (
          <circle
            key={index}
            cx={star.x}
            cy={star.y}
            r={star.r / 6}
            fill="#ffffff"
            opacity={star.o}
            className="star-twinkle"
            style={{ animationDelay: `${star.d}s` }}
          />
        ))}
      </svg>

      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
