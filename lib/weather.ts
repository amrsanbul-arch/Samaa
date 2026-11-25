import type { Condition, DailyWeather } from './types';
import { compassLabel, conditionLabel, localeOf, type ConditionKey, type Lang } from './i18n';

type CodeInfo = { key: ConditionKey; condition: Condition };

const WMO: Record<number, CodeInfo> = {
  0: { key: 'clear', condition: 'clear' },
  1: { key: 'mainlyClear', condition: 'clear' },
  2: { key: 'partly', condition: 'partly' },
  3: { key: 'overcast', condition: 'cloudy' },
  45: { key: 'fog', condition: 'fog' },
  48: { key: 'fog', condition: 'fog' },
  51: { key: 'drizzle', condition: 'drizzle' },
  53: { key: 'drizzle', condition: 'drizzle' },
  55: { key: 'drizzle', condition: 'drizzle' },
  56: { key: 'drizzle', condition: 'drizzle' },
  57: { key: 'drizzle', condition: 'drizzle' },
  61: { key: 'rainLight', condition: 'rain' },
  63: { key: 'rain', condition: 'rain' },
  65: { key: 'rainHeavy', condition: 'rain' },
  66: { key: 'freezingRain', condition: 'rain' },
  67: { key: 'freezingRain', condition: 'rain' },
  71: { key: 'snowLight', condition: 'snow' },
  73: { key: 'snow', condition: 'snow' },
  75: { key: 'snowHeavy', condition: 'snow' },
  77: { key: 'snowLight', condition: 'snow' },
  80: { key: 'showers', condition: 'rain' },
  81: { key: 'showers', condition: 'rain' },
  82: { key: 'rainHeavy', condition: 'rain' },
  85: { key: 'showers', condition: 'snow' },
  86: { key: 'snowHeavy', condition: 'snow' },
  95: { key: 'thunder', condition: 'thunder' },
  96: { key: 'thunderHail', condition: 'thunder' },
  99: { key: 'thunderHail', condition: 'thunder' },
};

const FALLBACK: CodeInfo = { key: 'variable', condition: 'cloudy' };

export function describeCode(code: number): CodeInfo {
  return WMO[code] ?? FALLBACK;
}

export function conditionOf(code: number): Condition {
  return describeCode(code).condition;
}

/** Human readable condition for a WMO code in the given language. */
export function describeCodeLabel(lang: Lang, code: number): string {
  return conditionLabel(lang, describeCode(code).key);
}

export function describeDay(day: DailyWeather, lang: Lang): string {
  return describeCodeLabel(lang, day.code);
}

export function windDirectionLabel(lang: Lang, degrees: number): string {
  return compassLabel(lang, degrees);
}

export function formatTemp(value: number): string {
  return `${Math.round(value)}`;
}

export type EffectConfig = {
  rain: number;
  snow: number;
  wind: number;
  fog: number;
  sun: number;
  clouds: number;
  lightning: boolean;
  /** Drives the accent colour of the glass card. */
  tone: 'sun' | 'night' | 'rain' | 'snow' | 'fog';
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function buildEffects(input: {
  condition: Condition;
  precipitation: number;
  cloudCover: number;
  windSpeed: number;
  isDay: boolean;
}): EffectConfig {
  const { condition, precipitation, cloudCover, windSpeed, isDay } = input;

  const rainBase: Record<Condition, number> = {
    clear: 0,
    partly: 0,
    cloudy: 0,
    fog: 0,
    drizzle: 0.35,
    rain: 0.6,
    snow: 0,
    thunder: 0.85,
  };

  const rain = clamp01(Math.max(rainBase[condition], precipitation / 6));
  const snow = condition === 'snow' ? 1 : 0;
  const fog = condition === 'fog' ? 1 : 0;
  const clouds = clamp01(Math.max(cloudCover / 100, condition === 'cloudy' ? 0.8 : 0));
  const wind = clamp01((windSpeed - 12) / 38);
  const sun =
    !isDay || rain > 0.2 || snow > 0 || fog > 0
      ? 0
      : condition === 'partly'
        ? 0.55
        : condition === 'clear'
          ? 1
          : 0;

  const tone: EffectConfig['tone'] =
    snow > 0 ? 'snow' : fog > 0 ? 'fog' : rain > 0.2 ? 'rain' : !isDay ? 'night' : 'sun';

  return { rain, snow, wind, fog, sun, clouds, lightning: condition === 'thunder', tone };
}

export const ACCENT: Record<EffectConfig['tone'], { text: string; ring: string; glow: string }> = {
  sun: { text: 'text-sand-300', ring: 'ring-sand-400/30', glow: 'rgba(220,174,99,0.35)' },
  night: { text: 'text-sky-300', ring: 'ring-sky-400/25', glow: 'rgba(108,194,255,0.28)' },
  rain: { text: 'text-sky-300', ring: 'ring-sky-400/25', glow: 'rgba(108,194,255,0.32)' },
  snow: { text: 'text-sky-200', ring: 'ring-sky-200/30', glow: 'rgba(200,230,255,0.3)' },
  fog: { text: 'text-slate-200', ring: 'ring-white/20', glow: 'rgba(226,232,240,0.22)' },
};

export function weekdayLabel(dateISO: string, index: number, lang: Lang, todayLabel: string): string {
  if (index === 0) return todayLabel;
  const date = new Date(`${dateISO}T12:00:00`);
  return new Intl.DateTimeFormat(localeOf(lang), { weekday: 'long' }).format(date);
}

export function shortDate(dateISO: string, lang: Lang): string {
  const date = new Date(`${dateISO}T12:00:00`);
  return new Intl.DateTimeFormat(localeOf(lang), { day: 'numeric', month: 'short' }).format(date);
}

const clockOptions = (lang: Lang, timeZone?: string) => ({
  hour: '2-digit',
  minute: '2-digit',
  hour12: lang === 'ar' || lang === 'en',
  timeZone,
}) as Intl.DateTimeFormatOptions;

export function localClock(timezone: string, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(localeOf(lang), clockOptions(lang, timezone)).format(new Date());
  } catch {
    return new Intl.DateTimeFormat(localeOf(lang), clockOptions(lang)).format(new Date());
  }
}

export function timeLabel(iso: string | null, timezone: string, lang: Lang): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(localeOf(lang), clockOptions(lang, timezone)).format(new Date(iso));
  } catch {
    return '—';
  }
}
