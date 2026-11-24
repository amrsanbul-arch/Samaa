'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { sceneImageSrc } from '@/lib/landmarks';
import { buildEffects } from '@/lib/weather';
import ForecastStrip from './ForecastStrip';
import WeatherCard from './WeatherCard';
import WeatherEffects from './WeatherEffects';

type Scene = Pick<Landmark, 'landmark' | 'description' | 'image' | 'credit' | 'focus' | 'zoom'>;

type Props = {
  place: Place;
  scene: Scene;
  weather: WeatherBundle;
  onBack: () => void;
};

export default function WeatherView({ place, scene, weather, onBack }: Props) {
  const effects = useMemo(
    () =>
      buildEffects({
        condition: weather.current.condition,
        precipitation: weather.current.precipitation,
        cloudCover: weather.current.cloudCover,
        windSpeed: weather.current.windSpeed,
        isDay: weather.current.isDay,
      }),
    [weather]
  );

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-night-950">
      <Image
        key={scene.image}
        src={sceneImageSrc(scene.image)}
        alt={scene.landmark}
        fill
        priority
        sizes="100vw"
        style={
          {
            objectPosition: scene.focus ?? '50% 50%',
            transformOrigin: scene.zoom ? '50% 100%' : scene.focus ?? '50% 50%',
            '--scene-zoom': scene.zoom ? String(scene.zoom) : undefined,
          } as CSSProperties
        }
        className="scene-image animate-kenburns object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-night-950/80 via-night-950/10 to-night-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/30 to-transparent" />

      <WeatherEffects effects={effects} />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-4 pb-[max(1rem,var(--safe-bottom))] pt-[max(1rem,var(--safe-top))] sm:px-6 lg:px-10">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="glass-soft focus-ring group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 active:scale-[0.98] sm:text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            رجوع
          </button>

          <div className="flex items-center gap-2 text-white/70">
            <span className="font-display text-sm font-bold tracking-wide text-white/80">سماء</span>
            <span className="h-1 w-1 rounded-full bg-sand-300/70" />
            <span className="text-[10px] tracking-wide text-white/40">طقس المدن العربية</span>
          </div>
        </header>

        <div className="mt-3 hidden max-w-2xl animate-fadeIn sm:mt-12 sm:block">
          <p className="hidden text-[10px] tracking-[0.35em] text-sand-300/70 sm:block">مشهد اليوم</p>
          <h2 className="font-display text-lg font-bold leading-tight text-shadow-cinema sm:mt-1 sm:text-4xl">
            {scene.landmark}
          </h2>
          <div className="mt-2 h-px w-14 bg-gradient-to-l from-sand-300/70 to-transparent" />
        </div>

        <div className="mt-auto w-full pt-4 sm:pt-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="lg:w-[25rem] lg:shrink-0">
              <WeatherCard place={place} landmark={scene} weather={weather} effects={effects} />
            </div>
            <div className="lg:max-w-2xl lg:flex-1">
              <ForecastStrip daily={weather.daily} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
