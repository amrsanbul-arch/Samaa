import type { DailyWeather } from '@/lib/types';
import { langMeta } from '@/lib/i18n';
import { weekdayLabel } from '@/lib/weather';
import WeatherIcon from './WeatherIcon';
import { useLang } from './LangProvider';

export default function ForecastStrip({ daily }: { daily: DailyWeather[] }) {
  const { lang, t } = useLang();
  const locale = langMeta(lang).locale;

  // Arabic keeps the full weekday name; Latin/Cyrillic scripts read better short.
  const dayLabel = (date: string, index: number) => {
    if (index === 0) return t('today');
    if (lang === 'ar') return weekdayLabel(date, index, lang, t('today'));
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(`${date}T12:00:00`)
    );
  };

  return (
    <div className="panel p-2.5 sm:p-3.5 lg:rounded-2xl lg:p-5">
      <div className="mb-1.5 flex items-center gap-1.5 px-1 sm:mb-2 lg:mb-3">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        >
          <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
        </svg>
        <h2 className="truncate text-[11px] font-semibold text-cream/75 sm:text-xs lg:text-sm">
          {t('forecastTitle')}
        </h2>
      </div>

      <ul className="grid grid-cols-7 gap-1 sm:gap-1.5 lg:gap-2">
        {daily.map((day, index) => {
          const isToday = index === 0;
          return (
            <li
              key={day.date}
              className={`rounded-[10px] px-0.5 py-1.5 text-center transition-colors sm:py-2 lg:rounded-xl lg:py-3 ${
                isToday ? 'bg-extra' : ''
              }`}
            >
              <p
                className={`truncate text-[9px] leading-tight sm:text-[10.5px] ${
                  isToday ? 'font-bold text-cream' : 'text-cream/60'
                } lg:text-xs`}
              >
                {dayLabel(day.date, index)}
              </p>

              <WeatherIcon
                condition={day.condition}
                className="mx-auto my-1 h-[22px] w-[22px] lg:my-2 lg:h-7 lg:w-7"
              />

              <p className="text-[12.5px] font-bold leading-none text-white sm:text-sm lg:text-base" dir="ltr">
                {Math.round(day.max)}°
              </p>
              <p className="mt-0.5 text-[10px] leading-none text-cream/60 sm:text-[11px] lg:mt-1 lg:text-xs" dir="ltr">
                {Math.round(day.min)}°
              </p>

              {day.precipitationProbability >= 40 && (
                <p className="mt-0.5 text-[9px] leading-none text-brand lg:mt-1 lg:text-[10px]" dir="ltr">
                  {Math.round(day.precipitationProbability)}%
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
