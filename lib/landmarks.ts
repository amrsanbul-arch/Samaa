import type { Landmark, Place } from './types';
import { normalizeArabic } from './arabic';
import type { Lang } from './i18n';
import { COUNTRIES, COUNTRY_NAMES, commons, credit, type CountryScene } from './countries';

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

/** Finds the curated backdrop that best matches a searched city. */
export function findLandmark(query: string): Landmark | null {
  const q = normalizeArabic(query);
  if (!q) return null;

  let best: { item: Landmark; score: number } | null = null;

  for (const { item, keys } of normalized) {
    for (const key of keys) {
      let score = 0;
      if (key === q) score = 100;
      else if (q.length >= 3 && (key.startsWith(q) || q.startsWith(key))) score = 70;
      else if (q.length >= 4 && (key.includes(q) || q.includes(key))) score = 50;
      // Ties go to the later entry, so a newly curated scene supersedes an older
      // one for the same city (Doha's Museum of Islamic Art over the West Bay view).
      if (score && (!best || score >= best.score)) best = { item, score };
    }
  }

  return best?.item ?? null;
}

export function landmarkById(id: string): Landmark | null {
  return LANDMARKS.find((item) => item.id === id) ?? null;
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
