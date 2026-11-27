import type { Place } from './types';

/**
 * The visitor's home city, remembered in the browser so `/` can open straight into
 * that scene without a geocoding round trip.
 */
const KEY = 'samaa:home-city';

const isPlace = (value: unknown): value is Place => {
  if (!value || typeof value !== 'object') return false;
  const place = value as Partial<Place>;
  return (
    typeof place.name === 'string' &&
    place.name.length > 0 &&
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude)
  );
};

export function readHomeCity(): Place | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isPlace(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveHomeCity(place: Place): void {
  if (typeof window === 'undefined') return;
  const { id, name, country, countryCode, admin1, latitude, longitude, timezone } = place;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ id, name, country, countryCode, admin1, latitude, longitude, timezone })
    );
  } catch {
    /* a full or blocked storage must not break the visit */
  }
}

export function clearHomeCity(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
