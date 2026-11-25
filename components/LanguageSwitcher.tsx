'use client';

import { useEffect, useRef, useState } from 'react';
import { LANGS, type Lang } from '@/lib/i18n';
import { useLang } from './LangProvider';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const current = LANGS.find((item) => item.code === lang) ?? LANGS[0];

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language')}
        className="panel-solid focus-ring flex items-center gap-1.5 rounded-[14px] px-3 py-2 text-[11px] text-cream/80 transition hover:text-white active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
        </svg>
        <span>{current.native}</span>
        <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="panel absolute end-0 top-[calc(100%+0.5rem)] z-50 w-40 overflow-hidden rounded-[14px] p-1 animate-fadeIn"
        >
          {LANGS.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang}
                onClick={() => {
                  setLang(item.code as Lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-xs transition ${
                  item.code === lang ? 'bg-brand/15 text-brand' : 'text-cream/75 hover:bg-cream/10'
                }`}
              >
                <span>{item.native}</span>
                <span className="text-[10px] uppercase tracking-wider text-cream/35">{item.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
