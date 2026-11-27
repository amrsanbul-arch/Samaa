'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  isExcludedPlace,
  isSceneCity,
  landmarkForPlace,
  localizedText,
  placeCountryName,
  placeFromLandmark,
  sceneImageSrc,
  scenesForPlace,
} from '@/lib/landmarks';
import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { themeFor } from '@/lib/theme';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/components/AuthProvider';
import LogoutButton from '@/components/LogoutButton';
import { localeRegion, type Lang } from '@/lib/i18n';
import { readHomeCity, saveHomeCity } from '@/lib/home-city';

type HomeResponse = { place?: Place | null };

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

function sceneFor(place: Place | null, lang: Lang, item: Landmark | null) {
  if (!item) {
    return { ...fallbackSceneImage(place?.latitude), ...fallbackSceneText(lang) };
  }
  const text = localizedText(item, lang);
  return {
    landmark: text.landmark,
    country: text.country,
    // Only the city itself is a capital: Hebron borrows Jerusalem's scene, not its title.
    capital: Boolean(item.capital && isSceneCity(item, place?.name ?? '')),
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
  const [homeChecked, setHomeChecked] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [daytime, setDaytime] = useState(true);
  const [pendingText, setPendingText] = useState('');
  const [curatedId, setCuratedId] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const lastQuery = useRef('');
  const placeRef = useRef<Place | null>(null);
  const langRef = useRef(lang);
  placeRef.current = place;

  // A city can hold several curated views (Jerusalem, Doha); the anchor is the one
  // the search resolved to, and `curatedId` lets the card switch between them.
  const anchor = useMemo(() => landmarkForPlace(place), [place]);
  const scenes = useMemo(() => (place ? scenesForPlace(place, anchor) : []), [place, anchor]);
  const activeScene = useMemo(
    () => scenes.find((item) => item.id === curatedId) ?? anchor ?? null,
    [scenes, curatedId, anchor]
  );
  const scene = useMemo(() => sceneFor(place, lang, activeScene), [place, lang, activeScene]);
  const theme = useMemo(() => themeFor(activeScene ?? place), [activeScene, place]);
  const { loading: authLoading } = useAuth();
  const homeResolved = useRef(false);

  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      setDaytime(hour >= 6 && hour < 18);
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

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

  /** Shows a resolved place at once; the backdrop paints while the weather lands. */
  const openPlace = useCallback(
    (resolved: Place, match: Landmark | null, query: string) => {
      warmImage(sceneFor(resolved, lang, match).image);
      setPlace(resolved);
      setWeather(null);
      setWeatherError(null);
      setCuratedId(match?.id ?? null);
      lastQuery.current = query;
      setError(null);
      setSearchOpen(false);
      window.history.replaceState(null, '', `?city=${encodeURIComponent(resolved.name)}`);
      void loadWeather(resolved);
    },
    [lang, loadWeather]
  );

  /** Opens a place that arrived already resolved (saved city, IP location). */
  const openResolved = useCallback(
    (target: Place) => {
      const match = landmarkForPlace(target);
      const localized =
        match && isSceneCity(match, target.name) ? placeFromLandmark(match, lang) : target;
      openPlace(
        { ...localized, country: placeCountryName(localized, lang) || localized.country },
        match,
        target.name
      );
    },
    [lang, openPlace]
  );

  const runSearch = useCallback(
    async (payload: { place: Place | null; text: string }) => {
      if (pending) return false;

      setError(null);
      setPending(true);
      setPendingText(payload.text);

      try {
        const curated = payload.place
          ? landmarkForPlace(payload.place)
          : findLandmark(payload.text);
        // A curated city skips the geocoder; a landmark name or an alias ("Hebron")
        // still geocodes, so the card keeps the name of the city that was searched.
        let resolved =
          payload.place ??
          (curated && isSceneCity(curated, payload.text) ? placeFromLandmark(curated, lang) : null);

        if (!resolved) {
          resolved = await geocodeFirst(payload.text, lang);
          // "Blue Lagoon" is also a lake in South Africa: when the geocoder lands
          // on a place with no curated scene, the landmark the visitor typed wins.
          if (curated && resolved && !landmarkForPlace(resolved)) resolved = null;
        }

        // A place in an excluded country is treated as not found, not as a scene.
        if (isExcludedPlace(resolved)) resolved = null;

        if (!resolved && curated) resolved = placeFromLandmark(curated, lang);

        if (!resolved) {
          setError(t('notFound', { q: payload.text }));
          return false;
        }

        // A geocoded name ("Chichén Itzá", "Giza") keeps the archive backdrop, so
        // the card should carry the curated, translated name of that scene.
        const curatedMatch = curated ?? landmarkForPlace(resolved);
        if (curatedMatch && isSceneCity(curatedMatch, resolved.name)) {
          const localized = localizedText(curatedMatch, lang);
          resolved = { ...resolved, name: localized.city, country: localized.country };
        }

        resolved = { ...resolved, country: placeCountryName(resolved, lang) };

        openPlace(resolved, curatedMatch, payload.text);
        // Every city the visitor picks becomes the city `/` opens next time.
        saveHomeCity(resolved);
        return true;
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : '';
        setError(
          message === 'weather'
            ? t('weatherError')
            : message === 'geocode'
              ? t('geocodeError')
              : t('genericError')
        );
        setPlace(null);
        return false;
      } finally {
        setPending(false);
      }
    },
    [pending, lang, t, openPlace]
  );

  // Re-resolve the place name when the language changes: curated cities are
  // translated locally, everything else is geocoded again in the new language.
  useEffect(() => {
    if (langRef.current === lang) return;
    langRef.current = lang;

    const current = placeRef.current;
    if (!current) return;

    // A city that only borrowed a scene ("Hebron") keeps its own name and is looked
    // up again; the scene's city itself is translated locally.
    if (curatedId) {
      const item = LANDMARKS.find((entry) => entry.id === curatedId);
      if (item && isSceneCity(item, current.name)) {
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
        setPlace({
          ...next,
          country: placeCountryName(next, lang) || next.country,
        });
        window.history.replaceState(null, '', `?city=${encodeURIComponent(next.name)}`);
      })
      .catch(() => {
        /* keep the previous name */
      });

    return () => {
      cancelled = true;
    };
  }, [lang, curatedId]);


  const selectScene = useCallback(
    (id: string) => {
      const item = scenes.find((entry) => entry.id === id);
      if (!item) return;
      warmImage(item.image);
      setCuratedId(id);
    },
    [scenes]
  );

  const handleBack = useCallback(() => {
    setPlace(null);
    setWeather(null);
    setWeatherError(null);
    setCuratedId(null);
    setError(null);
    setSearchOpen(false);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  /**
   * `/` opens the visitor's city directly: the deep link when there is one, else
   * the city this browser saved, else the edge's IP location, else the search box.
   */
  useEffect(() => {
    if (!langReady || authLoading || homeResolved.current) return;
    homeResolved.current = true;

    const city = new URLSearchParams(window.location.search).get('city');
    if (city) {
      void runSearch({ place: null, text: city });
      return;
    }

    const saved = readHomeCity();
    if (saved) {
      openResolved(saved);
      setHomeChecked(true);
      return;
    }

    let cancelled = false;
    fetch('/api/home-city')
      .then((response) => (response.ok ? (response.json() as Promise<HomeResponse>) : null))
      .then((data) => {
        if (cancelled) return;
        const next = data?.place ?? null;
        if (next) {
          saveHomeCity(next);
          openResolved(next);
        }
        setHomeChecked(true);
      })
      .catch(() => {
        if (!cancelled) setHomeChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, langReady, runSearch, openResolved]);

  const pickLandmark = (landmark: Landmark) => {
    runSearch({ place: placeFromLandmark(landmark, lang), text: landmark.city });
  };

  const handleOverlaySearch = useCallback(
    async (payload: { place: Place | null; text: string }) => {
      const opened = await runSearch(payload);
      if (opened) setSearchOpen(false);
    },
    [runSearch]
  );

  return (
    <AuthGate>
      {!place && (
      <main className="theme-nile relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220]">
        <Starfield dim={daytime} daylight={daytime} />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[68svh] sm:h-[74svh]">
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

        <div className="relative z-20 flex flex-1 flex-col justify-center px-4 pb-[max(1.25rem,var(--safe-bottom))] pt-6 sm:px-8">
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

            <p className="mt-5 text-center text-[10px] leading-relaxed text-cream/35">
              {t('footerNote')} ·{' '}
              <a href="/credits" className="underline-offset-2 transition hover:text-cream/60 hover:underline">
                {t('creditsLink')}
              </a>
            </p>
          </div>
        </div>

        {(!homeChecked || pending) && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
            <div className="panel flex items-center gap-3 rounded-full px-5 py-3 text-sm text-cream/90 animate-fadeIn">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/25 border-t-brand" />
              {homeChecked ? t('flying', { city: pendingText }) : t('detectingCity')}
            </div>
          </div>
        )}
      </main>
      )}

      {place && (
        <div className="fixed inset-0 z-40 animate-fadeIn">
          <WeatherView
            place={place}
            scene={scene}
            theme={theme}
            scenes={scenes.map((item) => ({
              id: item.id,
              label: localizedText(item, lang).landmark,
            }))}
            activeSceneId={activeScene?.id ?? null}
            onSelectScene={selectScene}
            error={weatherError}
            onRetry={() => {
              if (place) void loadWeather(place);
            }}
            weather={weather}
            onBack={handleBack}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </div>
      )}

      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('changeCity')}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 pt-[max(4rem,12svh)] backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="panel mx-auto w-full max-w-xl rounded-2xl p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold text-white">{t('changeCity')}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-cream/50">{t('changeCityHint')}</p>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label={t('closeSearch')}
                className="panel-solid focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/80 transition hover:bg-panel active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <SearchBar onSubmit={handleOverlaySearch} pending={pending} />

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthGate>
  );
}
