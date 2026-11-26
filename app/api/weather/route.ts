import { NextResponse } from 'next/server';
import type { CurrentWeather, DailyWeather, WeatherBundle } from '@/lib/types';
import { conditionOf } from '@/lib/weather';
import { sunTimes } from '@/lib/solar';
import { isIanaZone, tzForCountry, tzForLongitude } from '@/lib/timezones';

const OM_TIMEOUT_MS = 3500;
const MET_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const STALE_TTL_MS = 60 * 60 * 1000;
const BREAKER_MS = 5 * 60 * 1000;
const BREAKER_THRESHOLD = 2;
const MAX_ENTRIES = 200;

type CacheEntry = { at: number; data: WeatherBundle };

const cache = new Map<string, CacheEntry>();
let omFailures = 0;
let omDownUntil = 0;

const cacheKey = (lat: number, lon: number) => `${lat.toFixed(2)},${lon.toFixed(2)}`;

function remember(key: string, data: WeatherBundle) {
  cache.set(key, { at: Date.now(), data });
  if (cache.size > MAX_ENTRIES) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) cache.delete(oldest[0]);
  }
}

function openMeteoIsDown() {
  return Date.now() < omDownUntil;
}

function noteOpenMeteoFailure() {
  omFailures += 1;
  if (omFailures >= BREAKER_THRESHOLD) {
    omDownUntil = Date.now() + BREAKER_MS;
    omFailures = 0;
  }
}

/* ------------------------------------------------------------------ Open-Meteo */

type OpenMeteoResponse = {
  timezone: string;
  utc_offset_seconds: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

async function fromOpenMeteo(lat: number, lon: number, timeZone: string): Promise<WeatherBundle> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(',')
  );
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
    ].join(',')
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(OM_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`open-meteo ${response.status}`);

  const data = (await response.json()) as OpenMeteoResponse;

  return {
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      isDay: data.current.is_day === 1,
      code: data.current.weather_code,
      condition: conditionOf(data.current.weather_code),
    },
    daily: data.daily.time.map((date, index) => ({
      date,
      code: data.daily.weather_code[index],
      condition: conditionOf(data.daily.weather_code[index]),
      max: data.daily.temperature_2m_max[index],
      min: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0,
      windMax: data.daily.wind_speed_10m_max[index],
    })),
    // Open-Meteo derives the zone from its own boundary data, which can disagree
    // with the curated zone for a landmark (northern Vietnam maps to Bangkok).
    // Keep the curated zone whenever the UTC offset matches, so the clock, the
    // sunrise and the catalogue all name the same zone.
    timezone:
      data.utc_offset_seconds === offsetSeconds(new Date(), timeZone) ? timeZone : data.timezone,
    utcOffsetSeconds: data.utc_offset_seconds,
    sunrise: data.daily.sunrise[0] ?? null,
    sunset: data.daily.sunset[0] ?? null,
    fetchedAt: new Date().toISOString(),
    source: 'open-meteo',
  };
}

/* ------------------------------------------------------------------- MET Norway */

const SYMBOL_TO_WMO: Record<string, number> = {
  clearsky: 0,
  fair: 1,
  partlycloudy: 2,
  cloudy: 3,
  fog: 45,
  lightdrizzle: 51,
  drizzle: 51,
  lightrain: 61,
  rain: 63,
  heavyrain: 65,
  lightrainshowers: 80,
  rainshowers: 81,
  heavyrainshowers: 82,
  lightsleet: 66,
  sleet: 66,
  heavysleet: 67,
  lightsleetshowers: 66,
  sleetshowers: 67,
  lightsnow: 71,
  snow: 73,
  heavysnow: 75,
  lightsnowshowers: 85,
  snowshowers: 85,
  heavysnowshowers: 86,
  rainandthunder: 95,
  heavyrainandthunder: 95,
  rainshowersandthunder: 95,
  sleetandthunder: 96,
  snowandthunder: 95,
  lightssandthunder: 95,
};

type MetDetails = {
  air_temperature: number;
  relative_humidity: number;
  wind_speed: number;
  wind_from_direction: number;
  cloud_area_fraction: number;
};

type MetPeriod = {
  summary?: { symbol_code?: string };
  details?: { precipitation_amount?: number; probability_of_precipitation?: number };
};

type MetEntry = {
  time: string;
  data: {
    instant: { details: MetDetails };
    next_1_hours?: MetPeriod;
    next_6_hours?: MetPeriod;
    next_12_hours?: MetPeriod;
  };
};

function wmoForSymbol(symbol?: string): number {
  if (!symbol) return 3;
  const base = symbol.replace(/_(day|night|polartwilight)$/, '');
  return SYMBOL_TO_WMO[base] ?? 3;
}

function localParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
  const hour = get('hour') === '24' ? '00' : get('hour');
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    clock: `${hour}:${get('minute')}`,
    minutes: Number(hour) * 60 + Number(get('minute')),
  };
}

function offsetSeconds(instant: Date, timeZone: string) {
  const local = localParts(instant, timeZone);
  const utc = instant.getTime();
  const asUtc = Date.UTC(
    Number(local.date.slice(0, 4)),
    Number(local.date.slice(5, 7)) - 1,
    Number(local.date.slice(8, 10)),
    Math.floor(local.minutes / 60),
    local.minutes % 60
  );
  return Math.round((asUtc - utc) / 1000);
}

async function fromMetNorway(lat: number, lon: number, timeZone: string): Promise<WeatherBundle> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(MET_TIMEOUT_MS),
    headers: {
      'User-Agent': 'SamaaWeather/1.0 (cinematic weather scenes; +https://github.com/samaa-weather)',
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error(`met.no ${response.status}`);

  const payload = (await response.json()) as { properties: { timeseries: MetEntry[] } };
  const series = payload.properties.timeseries ?? [];
  if (!series.length) throw new Error('met.no empty');

  const now = Date.now();
  const rows = series.map((entry) => {
    const instant = new Date(entry.time);
    const details = entry.data.instant.details;
    const period = entry.data.next_1_hours ?? entry.data.next_6_hours ?? entry.data.next_12_hours;
    const local = localParts(instant, timeZone);
    return {
      at: instant.getTime(),
      date: local.date,
      minutes: local.minutes,
      clock: local.clock,
      temp: details.air_temperature,
      humidity: details.relative_humidity,
      wind: details.wind_speed * 3.6,
      windDirection: details.wind_from_direction,
      cloud: details.cloud_area_fraction,
      precip: period?.details?.precipitation_amount ?? 0,
      probability: period?.details?.probability_of_precipitation ?? null,
      symbol: period?.summary?.symbol_code,
    };
  });

  const currentRow =
    rows.find((row) => row.at >= now - 45 * 60 * 1000) ?? rows[0];

  const today = currentRow.date;
  const { sunrise, sunset } = sunTimes(lat, lon, today, timeZone);
  const minutesOf = (iso: string | null) => {
    if (!iso) return null;
    const match = iso.match(/T(\d{2}):(\d{2})/);
    return match ? Number(match[1]) * 60 + Number(match[2]) : null;
  };
  const sunriseMinutes = minutesOf(sunrise);
  const sunsetMinutes = minutesOf(sunset);
  const isDay =
    sunriseMinutes === null || sunsetMinutes === null
      ? currentRow.minutes >= 360 && currentRow.minutes < 1080
      : currentRow.minutes >= sunriseMinutes && currentRow.minutes < sunsetMinutes;

  const dates = [...new Set(rows.map((row) => row.date))].slice(0, 7);

  const daily: DailyWeather[] = dates.map((date) => {
    const dayRows = rows.filter((row) => row.date === date);
    const temps = dayRows.map((row) => row.temp);
    const noon = dayRows.reduce((best, row) =>
      Math.abs(row.minutes - 780) < Math.abs(best.minutes - 780) ? row : best
    );
    const totalPrecip = dayRows.reduce((sum, row) => sum + (row.precip ?? 0), 0);
    const probabilities = dayRows
      .map((row) => row.probability)
      .filter((value): value is number => typeof value === 'number');
    const code = wmoForSymbol(noon.symbol ?? dayRows[0].symbol);

    return {
      date,
      code,
      condition: conditionOf(code),
      max: Math.round(Math.max(...temps) * 10) / 10,
      min: Math.round(Math.min(...temps) * 10) / 10,
      precipitationProbability:
        probabilities.length > 0
          ? Math.round(Math.max(...probabilities))
          : totalPrecip < 0.1
            ? 0
            : Math.min(95, Math.round(35 + totalPrecip * 15)),
      windMax: Math.round(Math.max(...dayRows.map((row) => row.wind)) * 10) / 10,
    };
  });

  const code = wmoForSymbol(currentRow.symbol);

  const current: CurrentWeather = {
    time: `${currentRow.date}T${currentRow.clock}`,
    temperature: currentRow.temp,
    apparentTemperature: Math.round((currentRow.temp - Math.max(0, currentRow.wind) / 12) * 10) / 10,
    humidity: currentRow.humidity,
    windSpeed: Math.round(currentRow.wind * 10) / 10,
    windDirection: currentRow.windDirection,
    precipitation: currentRow.precip ?? 0,
    cloudCover: currentRow.cloud,
    isDay,
    code,
    condition: conditionOf(code),
  };

  return {
    current,
    daily,
    timezone: timeZone,
    utcOffsetSeconds: offsetSeconds(new Date(), timeZone),
    sunrise,
    sunset,
    fetchedAt: new Date().toISOString(),
    source: 'met.no',
  };
}

/* ------------------------------------------------------------------------- route */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));
  const requestedTz = searchParams.get('tz');
  const country = searchParams.get('cc');

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'invalid-coordinates' }, { status: 400 });
  }

  const timeZone =
    (isIanaZone(requestedTz) ? requestedTz : null) ??
    tzForCountry(country) ??
    tzForLongitude(lon);

  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  const age = cached ? Date.now() - cached.at : Infinity;

  if (cached && age < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const stale = cached && age < STALE_TTL_MS ? cached.data : null;

  if (!openMeteoIsDown()) {
    try {
      const bundle = await fromOpenMeteo(lat, lon, timeZone);
      omFailures = 0;
      remember(key, bundle);
      return NextResponse.json(bundle);
    } catch {
      noteOpenMeteoFailure();
    }
  }

  try {
    const bundle = await fromMetNorway(lat, lon, timeZone);
    remember(key, bundle);
    return NextResponse.json(bundle);
  } catch {
    if (stale) return NextResponse.json({ ...stale, stale: true });
    return NextResponse.json({ error: 'weather-unavailable' }, { status: 504 });
  }
}
