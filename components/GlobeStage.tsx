'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const GlobeScene = dynamic(() => import('./GlobeScene'), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

function GlobeSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative aspect-square w-[70%] max-w-[520px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#1c3155,#0a1220_60%,#05080f)] opacity-70" />
        <div className="absolute inset-0 animate-pulse rounded-full ring-1 ring-sky-400/20" />
      </div>
    </div>
  );
}

type Props = {
  flyTo?: { lat: number; lng: number } | null;
  daylight?: boolean;
  /** The globe is covered by the scene: stop rendering until it is visible again. */
  paused?: boolean;
  className?: string;
};

export default function GlobeStage({
  flyTo,
  daylight = false,
  paused = false,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} aria-hidden>
      {size.width > 0 && size.height > 0 ? (
        <GlobeScene
          width={size.width}
          height={size.height}
          flyTo={flyTo}
          daylight={daylight}
          paused={paused}
        />
      ) : (
        <GlobeSkeleton />
      )}
    </div>
  );
}
