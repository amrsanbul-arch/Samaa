import { NextResponse } from 'next/server';
import type { WeatherBundle } from '@/lib/types';
import { conditionOf } from '@/lib/weather';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'إحداثيات غير صالحة' }, { status: 400 });
  }

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

  try {
    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) throw new Error(`open-meteo ${response.status}`);

    const data = (await response.json()) as OpenMeteoResponse;

    const bundle: WeatherBundle = {
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
      timezone: data.timezone,
      utcOffsetSeconds: data.utc_offset_seconds,
      sunrise: data.daily.sunrise[0] ?? null,
      sunset: data.daily.sunset[0] ?? null,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(bundle);
  } catch {
    return NextResponse.json(
      { error: 'تعذّر جلب بيانات الطقس، حاول مرة أخرى' },
      { status: 502 }
    );
  }
}
