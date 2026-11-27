import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isExcludedPlaceCode } from '@/lib/excluded';
import { isSceneCity, landmarkForPlace, placeFromLandmark } from '@/lib/landmarks';
import type { Place } from '@/lib/types';

/** Per-visitor answer: never cached, never shared. */
export const dynamic = 'force-dynamic';

type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
  timezone?: string;
};

const decodeHeader = (value: string | null) => {
  if (!value) return '';
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
};

const reply = (place: Place | null, source: string) =>
  NextResponse.json({ place, source }, { headers: { 'Cache-Control': 'no-store' } });

/** Geocoder fallback for a city the curated catalogue does not know. */
async function geocode(name: string, countryCode: string): Promise<Place | null> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) return null;
    const payload = (await response.json()) as { results?: GeoResult[] };
    const usable = (payload.results ?? []).filter((item) => !isExcludedPlaceCode(item.country_code));
    const pool = usable.filter((item) => item.country_code?.toUpperCase() === countryCode);
    const candidates = pool.length ? pool : usable;
    const best = candidates.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0];
    if (!best) return null;
    return {
      id: best.id,
      name: best.name,
      country: best.country ?? '',
      countryCode: best.country_code ?? '',
      admin1: best.admin1,
      latitude: best.latitude,
      longitude: best.longitude,
      population: best.population,
      timezone: best.timezone,
    };
  } catch {
    return null;
  }
}

/**
 * The visitor's home city from the edge's IP geolocation, so `/` can open that
 * scene directly. Answers `place: null` when nothing reliable is known, or when
 * the visitor sits in a country the site does not serve.
 */
export async function GET() {
  const requestHeaders = headers();
  const country = decodeHeader(requestHeaders.get('x-vercel-ip-country')).toUpperCase();
  if (isExcludedPlaceCode(country)) return reply(null, 'excluded');

  const city = decodeHeader(requestHeaders.get('x-vercel-ip-city'));
  const latitude = Number.parseFloat(decodeHeader(requestHeaders.get('x-vercel-ip-latitude')));
  const longitude = Number.parseFloat(decodeHeader(requestHeaders.get('x-vercel-ip-longitude')));
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  if (!city && !hasCoords) return reply(null, 'none');

  const hint: Place = {
    id: -1,
    name: city,
    country: '',
    countryCode: country,
    latitude: hasCoords ? latitude : 0,
    longitude: hasCoords ? longitude : 0,
  };

  if (city) {
    const curated = landmarkForPlace(hint);
    if (curated && isSceneCity(curated, city)) {
      return reply(placeFromLandmark(curated, 'ar'), 'curated');
    }

    const geocoded = await geocode(city, country);
    if (geocoded) return reply(geocoded, 'geocoder');
  }

  if (hasCoords) {
    const nearby = landmarkForPlace({ ...hint, name: '', admin1: undefined });
    if (nearby) return reply(placeFromLandmark(nearby, 'ar'), 'nearby');
  }

  return reply(null, 'none');
}
