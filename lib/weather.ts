import type { Condition, DailyWeather } from './types';

type CodeInfo = { label: string; condition: Condition };

const WMO: Record<number, CodeInfo> = {
  0: { label: 'سماء صافية', condition: 'clear' },
  1: { label: 'صافٍ غالباً', condition: 'clear' },
  2: { label: 'غيوم متفرقة', condition: 'partly' },
  3: { label: 'غائم', condition: 'cloudy' },
  45: { label: 'ضباب', condition: 'fog' },
  48: { label: 'ضباب متجمّد', condition: 'fog' },
  51: { label: 'رذاذ خفيف', condition: 'drizzle' },
  53: { label: 'رذاذ', condition: 'drizzle' },
  55: { label: 'رذاذ كثيف', condition: 'drizzle' },
  56: { label: 'رذاذ متجمّد', condition: 'drizzle' },
  57: { label: 'رذاذ متجمّد كثيف', condition: 'drizzle' },
  61: { label: 'مطر خفيف', condition: 'rain' },
  63: { label: 'مطر', condition: 'rain' },
  65: { label: 'مطر غزير', condition: 'rain' },
  66: { label: 'مطر متجمّد', condition: 'rain' },
  67: { label: 'مطر متجمّد غزير', condition: 'rain' },
  71: { label: 'ثلج خفيف', condition: 'snow' },
  73: { label: 'ثلج', condition: 'snow' },
  75: { label: 'ثلج كثيف', condition: 'snow' },
  77: { label: 'حبيبات ثلجية', condition: 'snow' },
  80: { label: 'زخات مطر خفيفة', condition: 'rain' },
  81: { label: 'زخات مطر', condition: 'rain' },
  82: { label: 'زخات مطر عنيفة', condition: 'rain' },
  85: { label: 'زخات ثلجية', condition: 'snow' },
  86: { label: 'زخات ثلجية كثيفة', condition: 'snow' },
  95: { label: 'عاصفة رعدية', condition: 'thunder' },
  96: { label: 'عاصفة رعدية مع برد', condition: 'thunder' },
  99: { label: 'عاصفة رعدية شديدة', condition: 'thunder' },
};

const FALLBACK: CodeInfo = { label: 'طقس متغيّر', condition: 'cloudy' };

export function describeCode(code: number): CodeInfo {
  return WMO[code] ?? FALLBACK;
}

export function conditionOf(code: number): Condition {
  return describeCode(code).condition;
}

export function describeDay(day: DailyWeather): string {
  return describeCode(day.code).label;
}

const COMPASS = [
  'الشمال',
  'الشمال الشرقي',
  'الشرق',
  'الجنوب الشرقي',
  'الجنوب',
  'الجنوب الغربي',
  'الغرب',
  'الشمال الغربي',
];

export function windDirectionLabel(degrees: number): string {
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return COMPASS[index];
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

const AR = 'ar-u-nu-latn';

export function weekdayLabel(dateISO: string, index: number): string {
  if (index === 0) return 'اليوم';
  const date = new Date(`${dateISO}T12:00:00`);
  return new Intl.DateTimeFormat(AR, { weekday: 'long' }).format(date);
}

export function shortDate(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00`);
  return new Intl.DateTimeFormat(AR, { day: 'numeric', month: 'short' }).format(date);
}

export function localClock(timezone: string): string {
  try {
    return new Intl.DateTimeFormat(AR, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat(AR, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  }
}

export function timeLabel(iso: string | null, timezone: string): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(AR, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return '—';
  }
}
