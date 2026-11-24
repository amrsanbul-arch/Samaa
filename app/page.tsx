'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GlobeStage from '@/components/GlobeStage';
import SearchBar from '@/components/SearchBar';
import Starfield from '@/components/Starfield';
import WeatherView from '@/components/WeatherView';
import {
  FALLBACK_SCENE,
  FEATURED_LANDMARKS,
  findLandmark,
  placeFromLandmark,
  sceneImageSrc,
} from '@/lib/landmarks';
import type { Landmark, Place, WeatherBundle } from '@/lib/types';

type Stage = 'idle' | 'flying' | 'weather';

const FLIGHT_MS = 2500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeFirst(query: string): Promise<Place | null> {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('تعذّر الوصول إلى خدمة البحث عن المدن');
  const data = (await response.json()) as { results?: Place[] };
  return data.results?.[0] ?? null;
}

async function fetchWeather(place: Place): Promise<WeatherBundle> {
  const response = await fetch(
    `/api/weather?lat=${place.latitude.toFixed(4)}&lon=${place.longitude.toFixed(4)}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error ?? 'تعذّر جلب بيانات الطقس');
  return data as WeatherBundle;
}

function sceneFor(place: Place | null) {
  if (!place) return FALLBACK_SCENE;
  return (
    findLandmark(place.name) ??
    (place.admin1 ? findLandmark(place.admin1) : null) ??
    FALLBACK_SCENE
  );
}

function warmImage(url: string) {
  if (typeof window === 'undefined') return;
  const image = new window.Image();
  image.src = sceneImageSrc(url);
}

export default function HomePage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const scene = useMemo(() => sceneFor(place), [place]);
  const deepLinkDone = useRef(false);

  const runSearch = useCallback(
    async (payload: { place: Place | null; text: string }) => {
      if (pending) return;

      setError(null);
      setPending(true);

      try {
        const resolved = payload.place ?? (await geocodeFirst(payload.text));

        if (!resolved) {
          setError(`لم نجد «${payload.text}». جرّب اسماً آخر مثل القاهرة أو دبي.`);
          return;
        }

        const targetScene = sceneFor(resolved);
        warmImage(targetScene.image);

        setPlace(resolved);
        setFlyTo({ lat: resolved.latitude, lng: resolved.longitude });
        setStage('flying');

        const [bundle] = await Promise.all([fetchWeather(resolved), sleep(FLIGHT_MS)]);

        setWeather(bundle);
        setStage('weather');
        window.history.replaceState(null, '', `?city=${encodeURIComponent(resolved.name)}`);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'حدث خطأ غير متوقع');
        setStage('idle');
        setFlyTo(null);
      } finally {
        setPending(false);
      }
    },
    [pending]
  );

  const handleBack = useCallback(() => {
    setStage('idle');
    setFlyTo(null);
    setWeather(null);
    setError(null);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    if (deepLinkDone.current) return;
    deepLinkDone.current = true;
    const city = new URLSearchParams(window.location.search).get('city');
    if (city) runSearch({ place: null, text: city });
  }, [runSearch]);

  const pickLandmark = (landmark: Landmark) => {
    runSearch({ place: placeFromLandmark(landmark), text: landmark.city });
  };

  if (stage === 'weather' && place && weather) {
    return <WeatherView place={place} scene={scene} weather={weather} onBack={handleBack} />;
  }

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <Starfield />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[68svh] sm:h-[74svh]">
        <div className="pointer-events-auto absolute left-1/2 top-1/2 aspect-square w-[min(100vw,72svh,700px)] -translate-x-1/2 -translate-y-1/2">
          <GlobeStage className="h-full w-full" flyTo={flyTo} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-night-950" />
      </div>

      <header className="relative z-20 flex items-start justify-between gap-4 px-5 pt-[max(1.25rem,var(--safe-top))] sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-sand-300/40 bg-sand-300/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-sand-300" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9 12 3.5Z" />
            </svg>
          </span>
          <div>
            <p className="font-display text-base font-bold leading-none text-white">سماء</p>
            <p className="mt-1 text-[10px] tracking-wide text-white/40">طقس المدن العربية</p>
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] tracking-wide text-white/40 backdrop-blur">
          مباشر · Open-Meteo
        </span>
      </header>

      <div className="relative z-10 flex-1" />

      <div className="relative z-20 px-4 pb-[max(1.25rem,var(--safe-bottom))] sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-4 text-center sm:text-start">
            <h1 className="font-display text-[1.75rem] font-bold leading-tight text-shadow-cinema sm:text-4xl">
              إلى أين نسافر اليوم؟
            </h1>
            <p className="mt-1.5 text-xs text-white/50 sm:text-sm">
              اكتب اسم مدينة عربية، وستحلّق الكرة الأرضية إلى مشهدها.
            </p>
          </div>

          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-xs text-red-100 backdrop-blur">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <SearchBar onSubmit={runSearch} pending={pending} />

          <p className="mt-4 text-[10px] tracking-wide text-white/30">الأكثر بحثاً</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {FEATURED_LANDMARKS.map((landmark) => (
              <button
                key={landmark.id}
                type="button"
                onClick={() => pickLandmark(landmark)}
                disabled={pending}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[11px] text-white/70 backdrop-blur transition hover:border-sand-300/40 hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:opacity-50"
              >
                {landmark.city}
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-[10px] leading-relaxed text-white/25">
            اسحب الكرة لتدويرها · البيانات من Open-Meteo · الصور من Unsplash وويكيميديا كومنز
          </p>
        </div>
      </div>

      {stage === 'flying' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-30 grid place-items-center">
          <div className="glass flex items-center gap-3 rounded-full px-5 py-3 text-sm text-white/90 animate-fadeIn">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-sand-300" />
            جارٍ التحليق إلى {place?.name ?? 'مدينتك'}…
          </div>
        </div>
      )}
    </main>
  );
}
