'use client';

import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { normalizeArabic } from '@/lib/arabic';
import type { EffectConfig } from '@/lib/weather';
import {
  ACCENT,
  describeCode,
  localClock,
  timeLabel,
  windDirectionLabel,
} from '@/lib/weather';
import WeatherIcon from './WeatherIcon';

type Props = {
  place: Place;
  landmark: Landmark | { landmark: string; description: string; credit: { label: string; url: string } };
  weather: WeatherBundle;
  effects: EffectConfig;
};

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <div className="flex items-center gap-1.5 text-white/40">
        <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        <span className="text-[10px] tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white/95" dir="ltr">
        {value}
      </p>
      {hint && <p className="truncate text-[10px] text-white/40">{hint}</p>}
    </div>
  );
}

const icons = {
  drop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 3.5c3.2 3.6 5.5 6.6 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.8 5.5-9.4Z" />
    </svg>
  ),
  wind: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5M3 12h14a2.5 2.5 0 1 1-2.5 2.5M3 16h7" />
    </svg>
  ),
  umbrella: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 4a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8Zm0 8v5.5a2 2 0 0 0 4 0" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  ),
};

export default function WeatherCard({ place, landmark, weather, effects }: Props) {
  const { current, daily, timezone } = weather;
  const info = describeCode(current.code);
  const today = daily[0];
  const accent = ACCENT[effects.tone];
  const region = [place.country, place.admin1]
    .filter((value): value is string => Boolean(value))
    .filter((value) => normalizeArabic(value) !== normalizeArabic(place.name))
    .join(' · ');

  return (
    <section className="glass animate-fadeUp rounded-[28px] p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] text-white/50">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            <span className="truncate">{region}</span>
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight text-shadow-cinema sm:text-4xl">
            {place.name}
          </h1>
          <p className={`mt-0.5 text-xs font-medium ${accent.text}`}>{landmark.landmark}</p>
        </div>

        <div className="shrink-0 text-end">
          <p className="text-[10px] tracking-wide text-white/40">التوقيت المحلي</p>
          <p className="text-sm font-semibold text-white/80" dir="ltr">
            {localClock(timezone)}
          </p>
          <p className="mt-1 text-[10px] text-white/30">
            {timeLabel(weather.sunrise, timezone)} · {timeLabel(weather.sunset, timezone)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
        <div className="flex items-start">
          <span
            className="font-display text-[3.75rem] font-bold leading-[0.85] tracking-tight text-shadow-cinema sm:text-[5.5rem]"
            dir="ltr"
          >
            {Math.round(current.temperature)}
          </span>
          <span className="mt-1 text-2xl font-light text-white/60 sm:text-3xl">°C</span>
        </div>

        <div className="flex items-center gap-2.5 text-end">
          <WeatherIcon
            condition={current.condition}
            isDay={current.isDay}
            className="h-9 w-9 text-white/90 sm:h-11 sm:w-11"
          />
          <div>
            <p className="text-sm font-semibold sm:text-base">{info.label}</p>
            <p className="text-[11px] text-white/50">
              يُحسّ كـ {Math.round(current.apparentTemperature)}°
            </p>
            <p className="mt-0.5 text-[11px] text-white/40" dir="ltr">
              {Math.round(today.max)}° / {Math.round(today.min)}°
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
        <Metric icon={icons.drop} label="الرطوبة" value={`${Math.round(current.humidity)}%`} />
        <Metric
          icon={icons.wind}
          label="الرياح"
          value={`${Math.round(current.windSpeed)} كم/س`}
          hint={windDirectionLabel(current.windDirection)}
        />
        <Metric
          icon={icons.umbrella}
          label="احتمال المطر"
          value={`${Math.round(today.precipitationProbability)}%`}
        />
        <Metric
          icon={current.isDay ? icons.sun : icons.moon}
          label={current.isDay ? 'الغروب' : 'الشروق'}
          value={timeLabel(current.isDay ? weather.sunset : weather.sunrise, timezone)}
        />
      </div>

      <div className="my-2.5 h-px bg-white/10" />

      <p className="line-clamp-2 text-[12.5px] leading-relaxed text-white/60 sm:line-clamp-3">
        {landmark.description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-white/30">
        <a
          href={landmark.credit.url}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate underline-offset-2 transition hover:text-white/60 hover:underline"
        >
          الصورة: {landmark.credit.label}
        </a>
        <span className="shrink-0">البيانات: Open-Meteo</span>
      </div>
    </section>
  );
}
