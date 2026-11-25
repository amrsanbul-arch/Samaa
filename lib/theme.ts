import type { ThemeName } from './types';

/**
 * Palette + type pairing per city. `nile` is the golden default, `sea` the cool
 * coastal one and `sunset` the warm desert one.
 */
const THEMES: Record<ThemeName, string[]> = {
  nile: [
    'cairo',
    'riyadh',
    'dubai',
    'abudhabi',
    'doha',
    'kuwait',
    'manama',
    'amman',
    'baghdad',
    'damascus',
    'beirut',
    'sanaa',
    'london',
    'paris',
    'berlin',
    'amsterdam',
    'moscow',
    'madrid',
    'new-york',
    'toronto',
    'los-angeles',
    'tokyo',
    'beijing',
    'shanghai',
    'seoul',
    'delhi',
    'mumbai',
    'karachi',
    'kuala-lumpur',
  ],
  sea: [
    'alexandria',
    'jeddah',
    'muscat',
    'tunis',
    'casablanca',
    'athens',
    'rio',
    'sydney',
    'singapore',
    'jakarta',
    'bangkok',
    'cape-town',
    'lagos',
    'hurghada',
  ],
  sunset: [
    'luxor',
    'petra',
    'makkah',
    'madinah',
    'alula',
    'marrakech',
    'rome',
    'istanbul',
    'mexico-city',
    'buenos-aires',
    'nairobi',
  ],
};

const BY_ID = new Map<string, ThemeName>(
  (Object.entries(THEMES) as [ThemeName, string[]][]).flatMap(([theme, ids]) =>
    ids.map((id) => [id, theme] as [string, ThemeName])
  )
);

export type ThemeSource = {
  id?: string | number;
  theme?: ThemeName;
  latitude?: number;
};

/** Theme for a curated landmark, or for a search result with no scene of its own. */
export function themeFor(target?: ThemeSource | null): ThemeName {
  if (!target) return 'nile';
  if (target.theme) return target.theme;
  if (typeof target.id === 'string') {
    const curated = BY_ID.get(target.id);
    if (curated) return curated;
  }
  // Cities without a curated scene borrow the tropical backdrop near the equator.
  if (typeof target.latitude === 'number' && Math.abs(target.latitude) < 23.5) return 'sea';
  return 'nile';
}

/** Literal class names so the CSS selectors survive production minification. */
export const THEME_CLASS: Record<ThemeName, string> = {
  nile: 'theme-nile',
  sea: 'theme-sea',
  sunset: 'theme-sunset',
};

export function themeClass(target?: ThemeSource | null): string {
  return THEME_CLASS[themeFor(target)];
}
