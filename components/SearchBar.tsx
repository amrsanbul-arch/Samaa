'use client';

import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/types';
import { localeRegion } from '@/lib/i18n';
import { useLang } from './LangProvider';

type Props = {
  onSubmit: (payload: { place: Place | null; text: string }) => void;
  pending?: boolean;
  autoFocus?: boolean;
  compact?: boolean;
  placeholder?: string;
};

export default function SearchBar({
  onSubmit,
  pending = false,
  autoFocus = false,
  compact = false,
  placeholder,
}: Props) {
  const { lang, t } = useLang();
  const [text, setText] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const query = text.trim();
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const region = localeRegion();
        const hint = region ? `&cc=${region}` : '';
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}${hint}`,
          { signal: controller.signal }
        );
        const data = (await response.json()) as { results: Place[] };
        setResults(data.results ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        /* aborted or offline: keep the previous suggestions */
      } finally {
        setLoading(false);
      }
    }, 240);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [text, lang]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const submit = (place: Place | null) => {
    const query = place?.name ?? text.trim();
    if (!query) return;
    setOpen(false);
    if (place) setText(place.name);
    onSubmit({ place, text: query });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      submit(active >= 0 ? results[active] : null);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`panel-solid flex items-center gap-2 rounded-[14px] p-1.5 transition-colors duration-300 focus-within:border-brand/60 ${
          compact ? 'sm:gap-2' : ''
        }`}
      >
        <div className="flex flex-1 items-center gap-2 ps-3">
          <svg
            viewBox="0 0 24 24"
            className={`shrink-0 text-brand ${compact ? 'h-4 w-4' : 'h-5 w-5'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>

          <input
            ref={inputRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onFocus={() => setOpen(results.length > 0)}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            inputMode="search"
            enterKeyHint="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls="city-suggestions"
            aria-autocomplete="list"
            aria-label={t('searchAria')}
            placeholder={placeholder ?? t('searchPlaceholder')}
            className={`w-full bg-transparent text-white outline-none placeholder:text-[13px] placeholder:text-cream/45 sm:placeholder:text-base ${
              compact ? 'py-2 text-sm' : 'py-3 text-base sm:text-lg'
            }`}
          />

          {loading && (
            <span className="me-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cream/25 border-t-brand" />
          )}

          {!loading && text && (
            <button
              type="button"
              onClick={() => {
                setText('');
                setResults([]);
                inputRef.current?.focus();
              }}
              aria-label="×"
              className="me-1 shrink-0 rounded-full p-1 text-cream/50 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => submit(active >= 0 ? results[active] : null)}
          disabled={pending || (!text.trim() && active < 0)}
          className={`group flex shrink-0 items-center gap-2 rounded-[10px] bg-brand font-semibold text-[#0B1220] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
            compact ? 'px-4 py-2 text-sm' : 'px-5 py-3 text-sm sm:px-6 sm:text-base'
          }`}
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B1220]/30 border-t-[#0B1220]" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{t('searchButton')}</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 ltr:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </>
          )}
        </button>
      </div>

      {showList && (
        <ul
          id="city-suggestions"
          role="listbox"
          className="panel absolute inset-x-0 bottom-[calc(100%+0.6rem)] z-50 max-h-[46vh] overflow-y-auto rounded-[14px] p-1.5 no-scrollbar animate-fadeIn"
        >
          {results.map((place, index) => (
            <li key={`${place.id}-${index}`} role="option" aria-selected={index === active}>
              <button
                type="button"
                onClick={() => submit(place)}
                onMouseEnter={() => setActive(index)}
                className={`flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-start transition ${
                  index === active ? 'bg-cream/10' : 'hover:bg-cream/10'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white sm:text-base">
                    {place.name}
                  </span>
                  <span className="block truncate text-xs text-cream/50">
                    {[place.admin1, place.country].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-cream/20 px-2 py-0.5 text-[10px] tracking-wide text-cream/55">
                  {place.countryCode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
