'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Landmark, Place, ThemeName, WeatherBundle } from '@/lib/types';
import { sceneImageSrc } from '@/lib/landmarks';
import { THEME_CLASS } from '@/lib/theme';
import { buildEffects, type EffectConfig } from '@/lib/weather';
import ForecastStrip from './ForecastStrip';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from './LangProvider';
import SoundToggle from './SoundToggle';
import LogoutButton from './LogoutButton';
import WeatherCard from './WeatherCard';
import WeatherEffects from './WeatherEffects';

type Scene = Pick<Landmark, 'landmark' | 'description' | 'image' | 'credit' | 'focus' | 'zoom'>;

type Props = {
  place: Place;
  scene: Scene;
  theme: ThemeName;
  /** Null while the first forecast is still in flight. */
  weather: WeatherBundle | null;
  /** Localised message when the forecast could not be loaded. */
  error?: string | null;
  onRetry?: () => void;
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
const PEEK = 224;

function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useLang();
  return (
    <div className="panel p-5 text-center sm:p-6">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/15">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 8v5M12 16.5v.5" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <p className="mt-3 text-sm text-cream/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-extra px-5 py-2 text-sm font-semibold text-cream transition active:scale-[0.98]"
        >
          {t('retry')}
        </button>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="panel p-4 sm:p-5" aria-hidden>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-cream/10" />
          <div className="h-7 w-32 animate-pulse rounded-full bg-cream/15" />
          <div className="h-2.5 w-24 animate-pulse rounded-full bg-cream/10" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-full bg-cream/10" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="h-16 w-28 animate-pulse rounded-xl bg-cream/10" />
        <div className="h-4 w-24 animate-pulse rounded-full bg-cream/10" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-11 animate-pulse rounded-xl bg-cream/10" />
        ))}
      </div>
    </div>
  );
}

export default function WeatherView({
  place,
  scene,
  theme,
  weather,
  error = null,
  onRetry,
  onBack,
  leaving = false,
}: Props) {
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
    <section
      className={`${THEME_CLASS[theme]} relative isolate h-[100svh] w-full overflow-hidden bg-[#0B1220]`}
    >
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

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--scrim-rgb)/0.55)_0%,rgb(var(--scrim-rgb)/0)_35%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_top,rgb(var(--scrim-rgb)/0.75)_0%,rgb(var(--scrim-rgb)/0)_100%)]" />

      <WeatherEffects effects={effects} />

      <div className="relative z-10 flex h-full flex-col px-4 pb-[max(0.75rem,var(--safe-bottom))] pt-[max(1rem,var(--safe-top))] sm:px-6 lg:px-10">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              disabled={leaving}
              aria-label={t('back')}
              className="panel-solid focus-ring grid h-10 w-10 place-items-center rounded-full text-white/85 transition hover:bg-panel active:scale-95"
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
            </button>

            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/15 text-brand">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="9.5" cy="9" r="3.1" />
                  <path d="M9.5 3.4v1.2M3.9 9h1.2M5.5 5l.9.9M13.5 5l-.9.9" />
                  <path d="M8.4 19.4h8.1a2.9 2.9 0 0 0 .2-5.8 4.6 4.6 0 0 0-8.7 1.1 2.5 2.5 0 0 0 .4 4.7Z" fill="currentColor" fillOpacity="0.18" />
                </svg>
              </span>
              <div className="leading-none">
                <p className="font-display text-base font-extrabold text-white">{t('brand')}</p>
                <p className="mt-1 hidden text-[10px] text-cream/60 sm:block">{t('tagline')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SoundToggle effects={effects} />
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </header>

        <div className="mt-4 max-w-2xl animate-fadeIn sm:mt-10">
          <p className="text-[10px] tracking-[0.3em] text-brand [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
            {t('sceneEyebrow')}
          </p>
          <h2 className="mt-1 font-display text-xl font-bold leading-tight text-shadow-cinema sm:text-4xl">
            {scene.landmark}
          </h2>
          <div className="mt-2 h-px w-14 bg-brand/60" />
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
                  <span className="h-1 w-10 rounded-full bg-cream/35" />
                  <span className="flex items-center gap-1 text-[10px] text-cream/55">
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
                <WeatherCard
                  place={place}
                  landmark={scene}
                  weather={weather}
                  showDescription={desktop || expanded}
                />
              ) : error ? (
                <ErrorCard message={error} onRetry={onRetry} />
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
