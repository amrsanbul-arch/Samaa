'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GlobeStage from '@/components/GlobeStage';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SearchBar from '@/components/SearchBar';
import Starfield from '@/components/Starfield';
import WeatherView from '@/components/WeatherView';
import { useLang } from '@/components/LangProvider';
import {
  FEATURED_LANDMARKS,
  LANDMARKS,
  fallbackSceneImage,
  fallbackSceneText,
  findLandmark,
  localizedText,
  placeFromLandmark,
  sceneImageSrc,
} from '@/lib/landmarks';
import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { themeFor } from '@/lib/theme';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/components/AuthProvider';
import LogoutButton from '@/components/LogoutButton';
import { localeRegion, type Lang } from '@/lib/i18n';

type Stage = 'idle' | 'flying' | 'weather' | 'leaving';

const EXIT_MS = 620;

async function geocodeFirst(query: string, lang: Lang): Promise<Place | null> {
  const region = localeRegion();
  const hint = region ? `&cc=${region}` : '';
  const response = await fetch(
    `/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}${hint}`
  );
  if (!response.ok) throw new Error('geocode');
  const data = (await response.json()) as { results?: Place[] };
  return data.results?.[0] ?? null;
}

async function fetchWeather(place: Place): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    lat: place.latitude.toFixed(4),
    lon: place.longitude.toFixed(4),
  });
  if (place.countryCode) params.set('cc', place.countryCode);
  if (place.timezone) params.set('tz', place.timezone);

  const response = await fetch(`/api/weather?${params.toString()}`, {
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error ?? 'weather');
  return data as WeatherBundle;
}

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = (value: number) => (value * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Curated scene whose own coordinates sit under the geocoded place. */
function nearestLandmark(place: Place): Landmark | null {
  let best: { item: Landmark; km: number } | null = null;
  for (const item of LANDMARKS) {
    if (item.countryCode !== place.countryCode) continue;
    const km = distanceKm(place.latitude, place.longitude, item.latitude, item.longitude);
    if (km <= 20 && (!best || km < best.km)) best = { item, km };
  }
  return best?.item ?? null;
}

function landmarkFor(place: Place | null): Landmark | null {
  if (!place) return null;
  const named = findLandmark(place.name) ?? (place.admin1 ? findLandmark(place.admin1) : null);
  // Paris, Texas must not borrow the Eiffel Tower.
  if (named) {
    if (place.countryCode && named.countryCode && place.countryCode !== named.countryCode) return null;
    return named;
  }
  // A geocoder translating the name ("روما", "Rom") still lands on the archive
  // scene when the coordinates match the curated city.
  return nearestLandmark(place);
}

function sceneFor(place: Place | null, lang: Lang) {
  const item = landmarkFor(place);
  if (!item) {
    return { ...fallbackSceneImage(place?.latitude), ...fallbackSceneText(lang) };
  }
  const text = localizedText(item, lang);
  return {
    landmark: text.landmark,
    description: text.description,
    image: item.image,
    credit: item.credit,
    focus: item.focus,
    zoom: item.zoom,
  };
}

function warmImage(url: string) {
  if (typeof window === 'undefined') return;
  const image = new window.Image();
  image.decoding = 'async';
  image.src = sceneImageSrc(url);
}

export default function HomePage() {
  const { lang, ready: langReady, t } = useLang();
  const [stage, setStage] = useState<Stage>('idle');
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [daytime, setDaytime] = useState(true);
  const [pendingText, setPendingText] = useState('');
  const [curatedId, setCuratedId] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const lastQuery = useRef('');
  const placeRef = useRef<Place | null>(null);
  const langRef = useRef(lang);
  const landingRef = useRef<HTMLElement | null>(null);
  placeRef.current = place;

  const scene = useMemo(() => sceneFor(place, lang), [place, lang]);
  const theme = useMemo(() => themeFor(landmarkFor(place) ?? place), [place]);
  const { session, loading: authLoading } = useAuth();
  const deepLinkDone = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      setDaytime(hour >= 6 && hour < 18);
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    []
  );

  // Warm the featured backdrops once the landing screen is idle so the first tap
  // paints instantly even on a slow connection.
  useEffect(() => {
    const featured = FEATURED_LANDMARKS.slice(0, 8);
    const timers = featured.map((landmark, index) =>
      setTimeout(() => warmImage(landmark.image), 1500 + index * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const loadWeather = useCallback(
    async (target: Place) => {
      setWeatherError(null);
      try {
        const bundle = await fetchWeather(target);
        setWeather(bundle);
      } catch {
        setWeatherError(t('weatherError'));
      }
    },
    [t]
  );

  const runSearch = useCallback(
    async (payload: { place: Place | null; text: string }) => {
      if (pending) return;

      setError(null);
      setPending(true);
      setPendingText(payload.text);
      if (exitTimer.current) clearTimeout(exitTimer.current);

      try {
        const curated = payload.place
          ? landmarkFor(payload.place)
          : findLandmark(payload.text);
        let resolved = payload.place ?? (curated ? placeFromLandmark(curated, lang) : null);

        if (!resolved) {
          setStage('flying');
          resolved = await geocodeFirst(payload.text, lang);
        }

        if (!resolved) {
          setError(t('notFound', { q: payload.text }));
          setStage('idle');
          return;
        }

        // A geocoded name ("Chichén Itzá", "Giza") keeps the archive backdrop, so
        // the card should carry the curated, translated name of that scene.
        const curatedMatch = curated ?? landmarkFor(resolved);
        if (curatedMatch) {
          const localized = localizedText(curatedMatch, lang);
          resolved = { ...resolved, name: localized.city, country: localized.country };
        }

        warmImage(sceneFor(resolved, lang).image);

        // Enter the scene immediately: the backdrop paints while the weather lands.
        setPlace(resolved);
        setWeather(null);
        setWeatherError(null);
        setCuratedId(curatedMatch?.id ?? null);
        lastQuery.current = payload.text;
        setFlyTo({ lat: resolved.latitude, lng: resolved.longitude });
        setStage('weather');
        window.history.replaceState(null, '', `?city=${encodeURIComponent(resolved.name)}`);

        void loadWeather(resolved);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : '';
        setError(
          message === 'weather'
            ? t('weatherError')
            : message === 'geocode'
              ? t('geocodeError')
              : t('genericError')
        );
        setStage('idle');
        setPlace(null);
        setFlyTo(null);
      } finally {
        setPending(false);
      }
    },
    [pending, lang, t, loadWeather]
  );

  // Re-resolve the place name when the language changes: curated cities are
  // translated locally, everything else is geocoded again in the new language.
  useEffect(() => {
    if (langRef.current === lang) return;
    langRef.current = lang;

    const current = placeRef.current;
    if (!current) return;

    if (curatedId) {
      const item = LANDMARKS.find((entry) => entry.id === curatedId);
      if (item) {
        const localized = placeFromLandmark(item, lang);
        setPlace(localized);
        window.history.replaceState(null, '', `?city=${encodeURIComponent(localized.name)}`);
        return;
      }
    }

    const query = lastQuery.current;
    if (!query) return;

    let cancelled = false;
    geocodeFirst(query, lang)
      .then((next) => {
        if (cancelled || !next) return;
        setPlace(next);
        window.history.replaceState(null, '', `?city=${encodeURIComponent(next.name)}`);
      })
      .catch(() => {
        /* keep the previous name */
      });

    return () => {
      cancelled = true;
    };
  }, [lang, curatedId]);


  const handleBack = useCallback(() => {
    setStage('leaving');
    // Pull the camera back at the same moment the scene fades, so the globe
    // zoom-out is revealed rather than played after the fact.
    setFlyTo(null);
    exitTimer.current = setTimeout(() => {
      setStage('idle');
      setPlace(null);
      setWeather(null);
      setWeatherError(null);
      setCuratedId(null);
      setError(null);
      window.history.replaceState(null, '', window.location.pathname);
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    if (authLoading || !session || !langReady || deepLinkDone.current) return;
    deepLinkDone.current = true;
    const city = new URLSearchParams(window.location.search).get('city');
    if (city) runSearch({ place: null, text: city });
  }, [authLoading, session, langReady, runSearch]);

  const pickLandmark = (landmark: Landmark) => {
    runSearch({ place: placeFromLandmark(landmark, lang), text: landmark.city });
  };

  const overlayOpen = (stage === 'weather' || stage === 'leaving') && Boolean(place);
  const landingHidden = stage === 'weather';

  // The landing stays mounted (the exit animation needs the globe) but must not
  // be focusable or clickable while the scene covers it.
  useEffect(() => {
    const node = landingRef.current as (HTMLElement & { inert?: boolean }) | null;
    if (node) node.inert = overlayOpen;
  }, [overlayOpen]);

  return (
    <AuthGate>
      <main
        ref={landingRef}
        className={`theme-nile relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220] transition-opacity duration-500 ${
          landingHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-hidden={overlayOpen}
      >
        <Starfield dim={daytime} daylight={daytime} />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[68svh] sm:h-[74svh]">
          <div className="pointer-events-auto absolute left-1/2 top-1/2 aspect-square w-[min(100vw,72svh,700px)] -translate-x-1/2 -translate-y-1/2">
            <GlobeStage
              className="h-full w-full"
              flyTo={flyTo}
              daylight={daytime}
              paused={stage === 'weather'}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0B1220]" />
        </div>

        <header className="relative z-20 flex items-start justify-between gap-4 px-5 pt-[max(1.25rem,var(--safe-top))] sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="9.5" cy="9" r="3.1" />
                <path d="M9.5 3.4v1.2M3.9 9h1.2M5.5 5l.9.9M13.5 5l-.9.9" />
                <path d="M8.4 19.4h8.1a2.9 2.9 0 0 0 .2-5.8 4.6 4.6 0 0 0-8.7 1.1 2.5 2.5 0 0 0 .4 4.7Z" fill="currentColor" fillOpacity="0.18" />
              </svg>
            </span>
            <div>
              <p className="font-display text-lg font-extrabold leading-none text-white">{t('brand')}</p>
              <p className="mt-1.5 text-[10px] text-cream/60">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-cream/15 px-3 py-1.5 text-[10px] tracking-wide text-cream/50 sm:inline">
              {t('live')} · Open-Meteo
            </span>
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </header>

        <div className="relative z-10 flex-1" />

        <div className="relative z-20 px-4 pb-[max(1.25rem,var(--safe-bottom))] sm:px-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-4 text-center sm:text-start">
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-shadow-cinema sm:text-4xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-1.5 text-xs text-cream/55 sm:text-sm">{t('heroSubtitle')}</p>
            </div>

            {error && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-xs text-red-100">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <SearchBar onSubmit={runSearch} pending={pending} />

            <p className="mt-4 text-[10px] tracking-wide text-cream/45">{t('popular')}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {FEATURED_LANDMARKS.map((landmark) => (
                <button
                  key={landmark.id}
                  type="button"
                  onClick={() => pickLandmark(landmark)}
                  onPointerEnter={() => warmImage(landmark.image)}
                  onFocus={() => warmImage(landmark.image)}
                  disabled={pending}
                  className="shrink-0 rounded-[10px] border border-cream/20 px-3.5 py-1.5 text-[11px] text-cream/75 transition hover:border-brand/50 hover:text-brand active:scale-[0.98] disabled:opacity-50"
                >
                  {localizedText(landmark, lang).city}
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-[10px] leading-relaxed text-cream/35">{t('footerNote')}</p>
          </div>
        </div>

        {stage === 'flying' && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
            <div className="panel flex items-center gap-3 rounded-full px-5 py-3 text-sm text-cream/90 animate-fadeIn">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/25 border-t-brand" />
              {t('flying', { city: place?.name ?? pendingText })}
            </div>
          </div>
        )}
      </main>

      {overlayOpen && place && (
        <div
          className={`fixed inset-0 z-40 ${
            stage === 'leaving' ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
        >
          <WeatherView
            place={place}
            scene={scene}
            theme={theme}
            error={weatherError}
            onRetry={() => {
              if (place) void loadWeather(place);
            }}
            weather={weather}
            onBack={handleBack}
            leaving={stage === 'leaving'}
          />
        </div>
      )}
    </AuthGate>
  );
}
