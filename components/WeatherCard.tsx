'use client';

import type { Landmark, Place, WeatherBundle } from '@/lib/types';
import { normalizeArabic } from '@/lib/arabic';
import { describeCodeLabel, localClock, timeLabel, windDirectionLabel } from '@/lib/weather';
import WeatherIcon from './WeatherIcon';
import { useLang } from './LangProvider';

type Props = {
  place: Place;
  landmark: Landmark | { landmark: string; description: string; credit: { label: string; url: string } };
  weather: WeatherBundle;
  /** The landmark blurb only appears in the expanded sheet and on desktop. */
  showDescription?: boolean;
};

function Metric({
  icon,
  label,
  value,
  hint,
  tight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  /** Slightly smaller value type for wider strings such as «13 كم/س». */
  tight?: boolean;
}) {
  return (
    <div className="panel-solid flex items-center gap-2.5 rounded-xl px-3 py-2">
      <span className="shrink-0 text-brand [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[10px] leading-tight text-cream/60">{label}</p>
        <p
          className={`truncate font-semibold leading-tight text-white ${
            tight ? 'text-[12px] sm:text-[13px]' : 'text-[13px] sm:text-sm'
          }`}
          dir="ltr"
        >
          {value}
        </p>
        {hint && <p className="truncate text-[9.5px] leading-tight text-cream/45">{hint}</p>}
      </div>
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
  sunrise: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18M12 4.5v3M5.6 9.1l1.9 1.9M18.4 9.1l-1.9 1.9" />
      <path d="M8.2 18a3.8 3.8 0 0 1 7.6 0" />
    </svg>
  ),
  sunset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18M12 3v4M4.9 8.6 6.6 10.3M19.1 8.6l-1.7 1.7" />
      <path d="M15.8 18a3.8 3.8 0 0 0-7.6 0" />
    </svg>
  ),
};

export default function WeatherCard({ place, landmark, weather, showDescription = false }: Props) {
  const { lang, t } = useLang();
  const { current, daily, timezone } = weather;
  const conditionText = describeCodeLabel(lang, current.code);
  const today = daily[0];
  const rainChance = Math.round(today?.precipitationProbability ?? 0);
  const region = [place.country, place.admin1]
    .filter((value): value is string => Boolean(value))
    .filter((value) => normalizeArabic(value) !== normalizeArabic(place.name))
    .join(' · ');

  return (
    <section className="panel animate-fadeUp p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] text-cream/70">
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            <span className="truncate">{region}</span>
          </p>
          <h1 className="font-display text-[2.125rem] font-extrabold leading-tight text-shadow-cinema sm:text-[2.5rem]">
            {place.name}
          </h1>
          <p className="mt-0.5 truncate text-xs font-semibold text-brand">{landmark.landmark}</p>
        </div>

        <div className="shrink-0 text-end">
          <p className="text-[10px] tracking-wide text-cream/50">{t('localTime')}</p>
          <p className="text-sm font-semibold text-white/85" dir="ltr">
            {localClock(timezone, lang)}
          </p>
          <p className="mt-0.5 text-[10px] text-cream/45" dir="ltr">
            {timeLabel(weather.sunrise, lang)} · {timeLabel(weather.sunset, lang)}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="flex items-start" dir="ltr">
          <span className="font-display text-[5.5rem] font-extrabold leading-[0.8] tracking-tight text-shadow-cinema sm:text-[8rem]">
            {Math.round(current.temperature)}
          </span>
          <span className="mt-1.5 text-2xl font-light text-white/70 sm:mt-3 sm:text-3xl">°C</span>
        </div>

        <div className="flex items-center gap-2 pb-1 text-end">
          <WeatherIcon condition={current.condition} isDay={current.isDay} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="text-sm font-semibold sm:text-base">{conditionText}</p>
            {rainChance >= 20 && (
              <p className="text-[11px] text-cream/65" dir="ltr">
                {t('rain')} {rainChance}%
              </p>
            )}
            <p className="text-[11px] text-cream/60">
              {t('feelsLike', { t: Math.round(current.apparentTemperature) })}
            </p>
            <p className="text-[11px] text-cream/50" dir="ltr">
              {Math.round(today?.max ?? current.temperature)}° / {Math.round(today?.min ?? current.temperature)}°
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric icon={icons.drop} label={t('humidity')} value={`${Math.round(current.humidity)}%`} />
        <Metric
          icon={icons.wind}
          label={t('wind')}
          value={`${Math.round(current.windSpeed)} ${t('windUnit')}`}
          hint={windDirectionLabel(lang, current.windDirection)}
          tight
        />
        <Metric
          icon={icons.sunrise}
          label={t('sunrise')}
          value={timeLabel(weather.sunrise, lang)}
          tight
        />
        <Metric icon={icons.sunset} label={t('sunset')} value={timeLabel(weather.sunset, lang)} tight />
      </div>

      {showDescription && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-cream/70">{landmark.description}</p>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] text-cream/40">
        <a
          href={landmark.credit.url}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate underline-offset-2 transition hover:text-cream/70 hover:underline"
        >
          {t('imageLabel')}: {landmark.credit.label}
        </a>
        <span className="shrink-0">
          {t('dataLabel')}: {weather.source === 'met.no' ? 'MET Norway' : 'Open-Meteo'}
        </span>
      </div>
    </section>
  );
}
