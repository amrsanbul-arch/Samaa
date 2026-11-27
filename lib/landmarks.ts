import type { Landmark, Place } from './types';
import { normalizeArabic } from './arabic';
import type { Lang } from './i18n';
import { COUNTRIES, COUNTRY_NAMES, commons, credit, type CountryScene } from './countries';
import { isExcludedPlaceCode } from './excluded';

export type LandmarkText = {
  city: string;
  country: string;
  landmark: string;
  description: string;
};

type TranslatedLang = Exclude<Lang, 'ar'>;

function countryName(scene: CountryScene | undefined, lang: Lang, fallback = ''): string {
  const names = scene ? COUNTRY_NAMES[scene.countryCode] : undefined;
  return names?.[lang] || names?.ar || fallback;
}

function toLandmark(scene: CountryScene): Landmark {
  return {
    id: scene.id,
    city: scene.copy.ar.city,
    cityEn: scene.copy.en.city,
    country: countryName(scene, 'ar'),
    countryCode: scene.countryCode,
    landmark: scene.copy.ar.landmark,
    description: scene.copy.ar.description,
    image: scene.image,
    credit: scene.credit,
    latitude: scene.latitude,
    longitude: scene.longitude,
    aliases: scene.aliases,
    timezone: scene.timezone,
    capital: scene.capital,
    focus: scene.focus,
    zoom: scene.zoom,
    theme: scene.theme,
  };
}

export const LANDMARKS: Landmark[] = COUNTRIES.map(toLandmark);

const SCENE_BY_ID = new Map(COUNTRIES.map((scene) => [scene.id, scene]));

/** Routes remote photos through the cached, allow-listed image proxy. */
export function sceneImageSrc(url: string): string {
  return `/api/scene?u=${encodeURIComponent(url)}`;
}

/** Same proxy, smaller render for the credits grid. */
export function sceneThumbSrc(url: string, width = 480): string {
  return sceneImageSrc(url.replace(/([?&]width=)\d+/, `$1${width}`));
}

/** Used when a city has no curated landmark yet. */
export const FALLBACK_SCENE = {
  landmark: 'أفق مفتوح',
  description:
    'مدينة أخرى تحت سماء واحدة. لا توجد بعد صورة أرشيفية لهذه المدينة، لكن الطقس هنا حقيقي وحيّ الآن.',
  image: commons('Sunset Beacons at the Edge of Conwy Bay, North Wales.jpg'),
  credit: credit('Sunset Beacons at the Edge of Conwy Bay, North Wales.jpg'),
};

const FALLBACK_TROPICAL = {
  image: commons('Palm (194041349).jpeg'),
  credit: credit('Palm (194041349).jpeg'),
};

const FALLBACK_NORDIC = {
  image: commons('Snow covers Hyatt Lake (54338859210).jpg'),
  credit: credit('Snow covers Hyatt Lake (54338859210).jpg'),
};

/** Neutral backdrop chosen by latitude band so the scene matches the climate. */
export function fallbackSceneImage(latitude?: number) {
  if (typeof latitude !== 'number') return FALLBACK_SCENE;
  const abs = Math.abs(latitude);
  if (abs < 23.5) return FALLBACK_TROPICAL;
  if (abs > 55) return FALLBACK_NORDIC;
  return FALLBACK_SCENE;
}

export const FEATURED_IDS = [
  'cairo',
  'dubai',
  'london',
  'paris',
  'new-york',
  'tokyo',
  'istanbul',
  'sydney',
];

const FALLBACK_I18N: Record<TranslatedLang, LandmarkText> = {
  en: {
    city: '',
    country: '',
    landmark: 'An open horizon',
    description:
      'Another city under the same sky. There is no archive photo for this place yet, but the weather here is live and real.',
  },
  de: {
    city: '',
    country: '',
    landmark: 'Ein offener Horizont',
    description:
      'Eine weitere Stadt unter demselben Himmel. Für diesen Ort gibt es noch kein Archivfoto, aber das Wetter hier ist live und echt.',
  },
  ru: {
    city: '',
    country: '',
    landmark: 'Открытый горизонт',
    description:
      'Ещё один город под одним небом. Для этого места пока нет архивного фото, но погода здесь настоящая и в реальном времени.',
  },
  it: {
    city: '',
    country: '',
    landmark: 'Un orizzonte aperto',
    description:
      'Un’altra città sotto lo stesso cielo. Non c’è ancora una foto d’archivio per questo posto, ma il meteo qui è reale e in tempo reale.',
  },
};

/** City, country, landmark and description in the requested UI language. */
export function localizedText(item: Landmark, lang: Lang): LandmarkText {
  const scene = SCENE_BY_ID.get(item.id);
  if (!scene) {
    return {
      city: lang === 'ar' ? item.city : item.cityEn,
      country: item.country,
      landmark: item.landmark,
      description: item.description,
    };
  }
  const copy = scene.copy[lang];
  return {
    city: copy.city,
    country: countryName(scene, lang, item.country),
    landmark: copy.landmark,
    description: copy.description,
  };
}

export function fallbackSceneText(lang: Lang): LandmarkText {
  if (lang === 'ar') {
    return {
      city: '',
      country: '',
      landmark: FALLBACK_SCENE.landmark,
      description: FALLBACK_SCENE.description,
    };
  }
  return FALLBACK_I18N[lang];
}

const normalized = LANDMARKS.map((item) => {
  const scene = SCENE_BY_ID.get(item.id);
  const translated = scene ? Object.values(scene.copy).map((copy) => copy.city) : [];
  return {
    item,
    keys: [item.id, item.city, item.cityEn, ...item.aliases, ...translated]
      .filter(Boolean)
      .map(normalizeArabic),
  };
});

function scoreKey(key: string, q: string): number {
  if (key === q) return 100;
  if (q.length >= 3 && (key.startsWith(q) || q.startsWith(key))) return 70;
  if (q.length >= 4 && (key.includes(q) || q.includes(key))) return 50;
  return 0;
}

/**
 * Every scene that matches the query equally well, in catalogue order. A city with
 * two curated views (Jerusalem, Doha) therefore answers with both.
 */
export function findLandmarks(query: string): Landmark[] {
  const q = normalizeArabic(query);
  if (!q) return [];

  const hits: { item: Landmark; score: number }[] = [];
  let best = 0;
  for (const { item, keys } of normalized) {
    let score = 0;
    for (const key of keys) score = Math.max(score, scoreKey(key, q));
    if (!score) continue;
    hits.push({ item, score });
    best = Math.max(best, score);
  }
  return hits.filter((hit) => hit.score === best).map((hit) => hit.item);
}

/** Finds the curated backdrop that best matches a searched city. */
export function findLandmark(query: string): Landmark | null {
  return findLandmarks(query)[0] ?? null;
}

/**
 * True when the query is a name of the scene's own city — not a landmark, an
 * alias or a neighbouring city that merely borrows the backdrop.
 */
export function isSceneCity(item: Landmark, query: string): boolean {
  const q = normalizeArabic(query);
  if (!q) return false;
  const scene = SCENE_BY_ID.get(item.id);
  const names = scene ? Object.values(scene.copy).map((copy) => copy.city) : [item.city, item.cityEn];
  return names.map(normalizeArabic).includes(q);
}

export function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** How far a curated scene may sit from a geocoded city and still represent it. */
const SCENE_RADIUS_KM = 60;
/** A name shared across a border ("Jerusalem") still needs the scene to be nearby. */
const SHARED_NAME_RADIUS_KM = 120;
/** Two scenes closer than this are views of the same city. */
const SAME_CITY_KM = 15;

function nearestLandmark(place: Place): Landmark | null {
  let best: { item: Landmark; km: number } | null = null;
  for (const item of LANDMARKS) {
    if (place.countryCode && item.countryCode !== place.countryCode) continue;
    const km = distanceKm(place.latitude, place.longitude, item.latitude, item.longitude);
    if (km <= SCENE_RADIUS_KM && (!best || km < best.km)) best = { item, km };
  }
  return best?.item ?? null;
}

/**
 * Scene for a geocoded place. The name is matched first, but a name that is shared
 * by two countries ("Jerusalem") resolves to the scene in the place's own country,
 * or failing that to the nearest scene of that name.
 */
export function landmarkForPlace(place: Place | null): Landmark | null {
  if (!place) return null;

  const named = findLandmarks(place.name);
  const candidates = named.length ? named : place.admin1 ? findLandmarks(place.admin1) : [];

  if (candidates.length) {
    const local = candidates.find(
      (item) => !place.countryCode || item.countryCode === place.countryCode
    );
    if (local) return local;

    let nearest: { item: Landmark; km: number } | null = null;
    for (const item of candidates) {
      const km = distanceKm(place.latitude, place.longitude, item.latitude, item.longitude);
      if (!nearest || km < nearest.km) nearest = { item, km };
    }
    // Paris, Texas must not borrow the Eiffel Tower.
    return nearest && nearest.km <= SHARED_NAME_RADIUS_KM ? nearest.item : null;
  }

  return nearestLandmark(place);
}

/** All curated scenes of the same city, primary first, so both views stay reachable. */
export function scenesForPlace(place: Place, primary: Landmark | null): Landmark[] {
  const near = (item: Landmark) =>
    distanceKm(place.latitude, place.longitude, item.latitude, item.longitude) <= SAME_CITY_KM;

  const others = LANDMARKS.filter(
    (item) => item.id !== primary?.id && near(item)
  );
  return primary ? [primary, ...others] : others;
}

export function landmarkById(id: string): Landmark | null {
  return LANDMARKS.find((item) => item.id === id) ?? null;
}

/** A curated Palestinian scene this close decides the label of the city. */
const LOCAL_SCENE_KM = 25;

/**
 * A place that still arrives from an excluded country is labelled Palestine
 * rather than named; the geocoder normally drops those places before this.
 */

/**
 * Country label for a geocoded place. Palestinian places get the localised name of
 * Palestine (the geocoder leaves their country blank), and a city whose curated
 * scene is Palestinian — Jerusalem — is labelled the same way as that scene.
 */
export function placeCountry(
  place: Place,
  lang: Lang
): { name: string; code: string; admin1?: string } {
  const code = (place.countryCode ?? '').toUpperCase();
  if (code === 'PS' || isExcludedPlaceCode(code)) {
    return { name: COUNTRY_NAMES.PS[lang], code: 'PS', admin1: place.admin1 };
  }

  const scene = landmarkForPlace(place);
  if (
    scene?.countryCode === 'PS' &&
    distanceKm(place.latitude, place.longitude, scene.latitude, scene.longitude) <= LOCAL_SCENE_KM
  ) {
    // The district the geocoder files Jerusalem under belongs to the other side of
    // this label, so only the country is shown.
    return { name: COUNTRY_NAMES.PS[lang], code: 'PS' };
  }

  return { name: place.country, code: place.countryCode, admin1: place.admin1 };
}

export function placeCountryName(place: Place, lang: Lang): string {
  return placeCountry(place, lang).name;
}

/** True for a place the site refuses to serve, whatever route produced it. */
export function isExcludedPlace(place: Place | null): boolean {
  return isExcludedPlaceCode(place?.countryCode);
}

export const FEATURED_LANDMARKS = FEATURED_IDS.map((id) => landmarkById(id)!).filter(Boolean);

/** Lets the quick-pick chips skip the geocoding round trip. */
export function placeFromLandmark(item: Landmark, lang: Lang = 'ar'): Place {
  const text = localizedText(item, lang);
  return {
    id: -(LANDMARKS.indexOf(item) + 1),
    name: text.city || item.cityEn,
    country: text.country || item.country,
    countryCode: item.countryCode,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  };
}
