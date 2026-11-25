'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANG,
  dirOf,
  isLang,
  t as translate,
  type Lang,
  type UiKey,
} from '@/lib/i18n';

type LangContextValue = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  /** False until the browser language has been detected on the client. */
  ready: boolean;
  setLang: (lang: Lang) => void;
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (isLang(requested)) setLangState(requested);
    setReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dirOf(lang);
    try {
      window.localStorage.setItem('samaa:lang', lang);
    } catch {
      /* private mode: keep the choice for this session only */
    }
    // The cookie lets the server render the right lang/dir on the next request.
    document.cookie = `samaa:lang=${lang}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const t = useCallback(
    (key: UiKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  const value = useMemo<LangContextValue>(
    () => ({ lang, dir: dirOf(lang), ready, setLang, t }),
    [lang, ready, setLang, t]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used inside <LangProvider>');
  return context;
}
