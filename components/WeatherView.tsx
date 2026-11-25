'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { sceneImageSrc } from '@/lib/landmarks';
import { buildEffects, type EffectConfig } from '@/lib/weather';
import ForecastStrip from './ForecastStrip';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from './LangProvider';
import SoundToggle from './SoundToggle';
import WeatherCard from './WeatherCard';
import WeatherEffects from './WeatherEffects';

type Scene = Pick<Landmark, 'landmark' | 'description' | 'image' | 'credit' | 'focus' | 'zoom'>;

type Props = {
  place: Place;
  scene: Scene;
  /** Null while the first forecast is still in flight. */
  weather: WeatherBundle | null;
  onBack: () => void;
  leaving?: boolean;
};

const CALM: EffectConfig = {
  rain: 0,
  snow: 0,
  wind: 0,
  fog: 0,
  sun: 0,
  clouds: 0,
  lightning: false,
  tone: 'night',
};

/** Height of the sheet that stays on screen while it is collapsed. */
const PEEK = 172;

function CardSkeleton() {
  return (
    <div className="glass rounded-[28px] p-4 sm:p-6" aria-hidden>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-7 w-32 animate-pulse rounded-full bg-white/12" />
          <div className="h-2.5 w-24 animate-pulse rounded-full bg-white/8" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="h-14 w-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-4 w-24 animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-12 animate-pulse rounded-2xl bg-white/8" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-full animate-pulse rounded-full bg-white/8" />
        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-white/8" />
      </div>
    </div>
  );
}

export default function WeatherView({ place, scene, weather, onBack, leaving = false }: Props) {
  const { t } = useLang();
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [drag, setDrag] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [desktop, setDesktop] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const effects = useMemo(
    () =>
      weather
        ? buildEffects({
            condition: weather.current.condition,
            precipitation: weather.current.precipitation,
            cloudCover: weather.current.cloudCover,
            windSpeed: weather.current.windSpeed,
            isDay: weather.current.isDay,
          })
        : CALM,
    [weather]
  );

  useEffect(() => {
    const element = sheetRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setSheetHeight(element.offsetHeight));
    observer.observe(element);
    setSheetHeight(element.offsetHeight);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const collapsedOffset = Math.max(0, sheetHeight - PEEK);
  const base = expanded ? 0 : collapsedOffset;
  const offset = desktop ? 0 : Math.min(collapsedOffset, Math.max(0, base + drag));

  const onPointerDown = (event: React.PointerEvent) => {
    if (desktop) return;
    dragStart.current = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDrag(event.clientY - dragStart.current);
  };

  const onPointerUp = () => {
    if (dragStart.current === null) return;
    const delta = drag;
    dragStart.current = null;
    setDrag(0);
    if (delta < -36) setExpanded(true);
    else if (delta > 36) setExpanded(false);
  };

  return (
    <section className="relative isolate h-[100svh] w-full overflow-hidden bg-night-950">
      <Image
        key={scene.image}
        src={sceneImageSrc(scene.image)}
        alt={scene.landmark}
        fill
        priority
        unoptimized
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        style={
          {
            objectPosition: scene.focus ?? '50% 50%',
            transformOrigin: scene.zoom ? '50% 100%' : scene.focus ?? '50% 50%',
            '--scene-zoom': scene.zoom ? String(scene.zoom) : undefined,
          } as CSSProperties
        }
        className={`scene-image animate-kenburns object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-night-950/70 via-night-950/10 to-night-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent" />

      <WeatherEffects effects={effects} />

      <div className="relative z-10 flex h-full flex-col px-4 pb-[max(0.75rem,var(--safe-bottom))] pt-[max(1rem,var(--safe-top))] sm:px-6 lg:px-10">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={leaving}
            className="glass-soft focus-ring group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 active:scale-[0.98] sm:text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M13 18l-6-6 6-6" />
            </svg>
            {t('back')}
          </button>

          <div className="flex items-center gap-2">
            <SoundToggle effects={effects} />
            <LanguageSwitcher tone="dark" />
          </div>
        </header>

        <div className="mt-4 max-w-2xl animate-fadeIn sm:mt-12">
          <p className="text-[10px] tracking-[0.35em] text-sand-300/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
            {t('sceneEyebrow')}
          </p>
          <h2 className="mt-1 font-display text-xl font-bold leading-tight [text-shadow:0_2px_28px_rgba(0,0,0,0.92),0_1px_3px_rgba(0,0,0,0.85)] sm:text-4xl">
            {scene.landmark}
          </h2>
          <div className="mt-2 h-px w-14 bg-gradient-to-l from-sand-300/70 to-transparent rtl:bg-gradient-to-r" />
        </div>

        <div className="mt-auto w-full pt-4">
          <div
            ref={sheetRef}
            className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
            style={{
              transform: `translateY(${offset}px)`,
              transition: dragStart.current === null ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          >
            <div className="lg:w-[28rem] lg:shrink-0">
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  aria-expanded={expanded}
                  aria-label={t('dragHint')}
                  className="flex w-full touch-none flex-col items-center gap-1 pb-1.5 pt-0.5"
                >
                  <span className="h-1 w-10 rounded-full bg-white/35" />
                  <span className="flex items-center gap-1 text-[10px] text-white/45">
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="m6 15 6-6 6 6" />
                    </svg>
                    <span className={expanded ? 'sr-only' : ''}>{t('dragHint')}</span>
                  </span>
                </button>
              </div>

              {weather ? (
                <WeatherCard place={place} landmark={scene} weather={weather} effects={effects} />
              ) : (
                <CardSkeleton />
              )}
            </div>

            {weather && (
              <div className="lg:max-w-2xl lg:flex-1">
                <ForecastStrip daily={weather.daily} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
