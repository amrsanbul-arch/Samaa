/**
 * Sunrise/sunset from the NOAA solar position algorithm.
 * Only used for providers that do not return them (the MET Norway fallback).
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const ZENITH = 90.833;

const norm = (value: number, span: number) => ((value % span) + span) % span;

function offsetMinutes(timeZone: string, at: Date): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const parts = formatter.formatToParts(at);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
    const asUtc = Date.UTC(
      get('year'),
      get('month') - 1,
      get('day'),
      get('hour') % 24,
      get('minute'),
      get('second')
    );
    return Math.round((asUtc - at.getTime()) / 60000);
  } catch {
    return 0;
  }
}

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}

/** Minutes after midnight (local wall clock) of the event, or null when the sun never crosses. */
function eventMinutes(lat: number, lon: number, day: number, sunrise: boolean): number | null {
  const lngHour = lon / 15;
  const t = day + ((sunrise ? 6 : 18) - lngHour) / 24;
  const m = 0.9856 * t - 3.289;
  let l = m + 1.916 * Math.sin(m * RAD) + 0.02 * Math.sin(2 * m * RAD) + 282.634;
  l = norm(l, 360);

  let ra = Math.atan(0.91764 * Math.tan(l * RAD)) * DEG;
  ra = norm(ra, 360);
  ra += Math.floor(l / 90) * 90 - Math.floor(ra / 90) * 90;
  ra /= 15;

  const sinDec = 0.39782 * Math.sin(l * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(ZENITH * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
  if (cosH > 1 || cosH < -1) return null;

  const h = (sunrise ? 360 - Math.acos(cosH) * DEG : Math.acos(cosH) * DEG) / 15;
  const ut = norm(h + ra - 0.06571 * t - 6.622 - lngHour, 24);
  return Math.round(ut * 60);
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Local wall-clock ISO strings ("YYYY-MM-DDTHH:mm"), matching the Open-Meteo shape. */
export function sunTimes(
  lat: number,
  lon: number,
  dateISO: string,
  timeZone: string
): { sunrise: string | null; sunset: string | null } {
  const date = new Date(`${dateISO}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return { sunrise: null, sunset: null };

  const shift = offsetMinutes(timeZone, date);
  const day = dayOfYear(date);

  const toLocal = (minutes: number | null) => {
    if (minutes === null) return null;
    const total = norm(minutes + shift, 1440);
    return `${dateISO}T${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
  };

  return {
    sunrise: toLocal(eventMinutes(lat, lon, day, true)),
    sunset: toLocal(eventMinutes(lat, lon, day, false)),
  };
}
