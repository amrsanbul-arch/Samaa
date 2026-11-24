import type { DailyWeather } from '@/lib/types';
import { shortDate, weekdayLabel } from '@/lib/weather';
import WeatherIcon from './WeatherIcon';

export default function ForecastStrip({ daily }: { daily: DailyWeather[] }) {
  const weekMin = Math.min(...daily.map((day) => day.min));
  const weekMax = Math.max(...daily.map((day) => day.max));
  const span = Math.max(1, weekMax - weekMin);

  return (
    <div className="glass rounded-3xl p-2.5 sm:p-4">
      <div className="mb-1.5 flex items-center justify-between px-1 sm:mb-2">
        <h2 className="text-xs font-semibold tracking-wide text-white/60">توقعات سبعة أيام</h2>
        <span className="hidden text-[10px] text-white/30 sm:inline">العظمى والصغرى</span>
      </div>

      <ul className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-7 md:overflow-visible">
        {daily.map((day, index) => {
          const left = ((day.min - weekMin) / span) * 100;
          const width = Math.max(8, ((day.max - day.min) / span) * 100);
          return (
            <li
              key={day.date}
              className="min-w-[70px] flex-1 snap-start rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 text-center sm:py-3 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <p className={`text-[11px] ${index === 0 ? 'font-bold text-sand-300' : 'text-white/60'}`}>
                {weekdayLabel(day.date, index)}
              </p>
              <p className="mt-0.5 text-[10px] text-white/30">{shortDate(day.date)}</p>

              <WeatherIcon
                condition={day.condition}
                className="mx-auto my-1.5 h-6 w-6 text-white/80"
              />

              <p className="text-sm font-bold leading-none" dir="ltr">
                {Math.round(day.max)}°
                <span className="ms-1 text-xs font-medium text-white/40">{Math.round(day.min)}°</span>
              </p>

              <div className="relative mx-auto mt-2 h-1 w-10 overflow-hidden rounded-full bg-white/10">
                <span
                  className="absolute inset-y-0 rounded-full bg-gradient-to-l from-sand-300 to-sky-400"
                  style={{ insetInlineStart: `${left}%`, width: `${width}%` }}
                />
              </div>

              {day.precipitationProbability >= 20 && (
                <p className="mt-1.5 text-[10px] text-sky-300/80" dir="ltr">
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
