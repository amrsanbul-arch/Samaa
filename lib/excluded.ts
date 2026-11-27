/**
 * Countries the site does not serve. Their places never become a suggestion, a
 * scene or a label: the geocoder drops them, the client refuses them, and a query
 * that names one of them is answered with the ordinary "not found" message.
 *
 * The blocklist holds ISO codes only; the names come from `Intl.DisplayNames`, so
 * every UI language is covered without hard-coding a country name here.
 */
export const EXCLUDED_COUNTRY_CODES = ['IL'] as const;

const NAME_LANGS = ['ar', 'en', 'de', 'ru', 'it'] as const;

/** Strip case, accents and punctuation so «إسرائيل» and «Israel» compare equal. */
function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();
}

let cached: string[] | null = null;

/** The excluded countries' names in every UI language, folded for comparison. */
export function excludedCountryNames(): string[] {
  if (cached) return cached;
  const names = new Set<string>();
  for (const lang of NAME_LANGS) {
    let display: Intl.DisplayNames | null = null;
    try {
      display = new Intl.DisplayNames([lang], { type: 'region' });
    } catch {
      display = null;
    }
    if (!display) continue;
    for (const code of EXCLUDED_COUNTRY_CODES) {
      const name = display.of(code);
      if (name) names.add(fold(name));
    }
  }
  cached = [...names];
  return cached;
}

/** True when the query is the name of an excluded country rather than a city. */
export function isExcludedCountryQuery(query: string): boolean {
  const folded = fold(query);
  return Boolean(folded) && excludedCountryNames().includes(folded);
}

/** True for a geocoded place the site refuses to serve. */
export function isExcludedPlaceCode(code: string | undefined | null): boolean {
  return EXCLUDED_COUNTRY_CODES.includes(
    (code ?? '').toUpperCase() as (typeof EXCLUDED_COUNTRY_CODES)[number]
  );
}
