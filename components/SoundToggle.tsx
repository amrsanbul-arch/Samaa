'use client';

import { useEffect, useRef, useState } from 'react';
import { Ambience } from '@/lib/ambience';
import type { EffectConfig } from '@/lib/weather';
import { useLang } from './LangProvider';

const STORAGE_KEY = 'samaa:sound';

export default function SoundToggle({ effects }: { effects: EffectConfig }) {
  const { t } = useLang();
  const engine = useRef<Ambience | null>(null);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setReady(stored === 'on');
  }, []);

  useEffect(() => {
    if (!ready) return;
    const instance = engine.current ?? new Ambience();
    engine.current = instance;
    let cancelled = false;
    instance.start().then(() => {
      if (cancelled) return;
      setOn(true);
      window.localStorage.setItem(STORAGE_KEY, 'on');
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    engine.current?.set({
      rain: effects.rain,
      wind: effects.wind,
      fog: effects.fog,
    });
  }, [effects.rain, effects.wind, effects.fog, on]);

  useEffect(() => {
    if (!on || !effects.lightning) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        engine.current?.thunder();
        schedule();
      }, 6000 + Math.random() * 7000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [on, effects.lightning]);

  useEffect(() => () => engine.current?.stop(), []);

  const toggle = () => {
    const instance = engine.current ?? new Ambience();
    engine.current = instance;
    if (on) {
      instance.stop();
      setOn(false);
      setReady(false);
      window.localStorage.setItem(STORAGE_KEY, 'off');
    } else {
      setReady(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? t('soundOn') : t('soundOff')}
      title={on ? t('soundOn') : t('soundOff')}
      className="glass-soft focus-ring grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 active:scale-95"
    >
      {on ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 9.5h3l4.5-3.5v12L7 14.5H4z" />
          <path d="M16 8.5a5 5 0 0 1 0 7M18.8 6a8.5 8.5 0 0 1 0 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 9.5h3l4.5-3.5v12L7 14.5H4z" />
          <path d="m16 9.5 5 5M21 9.5l-5 5" />
        </svg>
      )}
    </button>
  );
}
