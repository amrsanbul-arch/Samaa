import { NextResponse } from 'next/server';
import { isExcludedCountryQuery, isExcludedPlaceCode } from '@/lib/excluded';

type OpenMeteoResult = {
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

/** Case- and accent-insensitive form used to spot exact name matches. */
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const lang = searchParams.get('lang') ?? 'ar';
  // Region of the visitor's UI language: a soft hint, never a hard filter.
  const hint = (searchParams.get('cc') ?? '').trim().toUpperCase();

  // A country the site does not serve is not a city: answer like any other miss.
  if (query.length < 2 || isExcludedCountryQuery(query)) {
    return NextResponse.json({ results: [] });
  }

  const build = (language: string) => {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', query);
    url.searchParams.set('count', '20');
    url.searchParams.set('language', language);
    url.searchParams.set('format', 'json');
    return url;
  };

  try {
    // Names come back localised ("Roma" for an Italian UI), so a Latin pass runs
    // alongside: matching either spelling keeps "Rome" resolving to Rome, Italy
    // instead of the same-named town that happens to share the query's spelling.
    const [localized, latin] = await Promise.all([
      fetch(build(lang), { next: { revalidate: 60 * 60 * 24 } }),
      lang === 'en'
        ? Promise.resolve(null)
        : fetch(build('en'), { next: { revalidate: 60 * 60 * 24 } }),
    ]);
    if (!localized.ok) throw new Error(`geocoding ${localized.status}`);

    const primary = (await localized.json()) as { results?: OpenMeteoResult[] };
    const secondary = latin?.ok
      ? ((await latin.json()) as { results?: OpenMeteoResult[] })
      : { results: [] };

    const latinNames = new Map<number, string>();
    for (const item of secondary.results ?? []) latinNames.set(item.id, item.name);

    const merged = new Map<number, { item: OpenMeteoResult; index: number }>();
    [...(primary.results ?? []), ...(secondary.results ?? [])].forEach((item, index) => {
      if (isExcludedPlaceCode(item.country_code)) return;
      if (!merged.has(item.id)) merged.set(item.id, { item, index });
    });

    const needle = normalize(query);

    const scored = [...merged.values()].map(({ item, index }) => {
      const names = [item.name, latinNames.get(item.id) ?? item.name].map(normalize);
      const exact = names.some((name) => name === needle);
      const partial =
        !exact &&
        needle.length >= 3 &&
        names.some((name) => name.startsWith(needle) || needle.startsWith(name));
      const population = item.population ?? 0;
      const inHint = hint.length === 2 && item.country_code?.toUpperCase() === hint;
      // Exact name first, then the biggest place that carries it: searching
      // "Paris" must reach Paris in France, not a same-named town. The country
      // hint only breaks near-ties, so a famous city still wins from abroad.
      const score =
        (exact ? 60 : 0) + (partial ? 8 : 0) + (inHint ? 12 : 0) + Math.log10(population + 1) * 12;

      return {
        place: {
          id: item.id,
          name: item.name,
          country: item.country ?? '',
          countryCode: item.country_code ?? '',
          admin1: item.admin1,
          latitude: item.latitude,
          longitude: item.longitude,
          population,
          timezone: item.timezone,
        },
        index,
        population,
        score,
      };
    });

    // Hamlets share names with real cities; prefer settlements big enough to
    // be what the visitor meant, and never pad the list with duplicates.
    const big = scored.filter((entry) => entry.population >= 15000);
    const pool = big.length > 0 ? big : scored.filter((entry) => entry.population >= 5000);
    const candidates = pool.length > 0 ? pool : scored;

    const seen = new Set<string>();
    const results = candidates
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .filter((entry) => {
        const key = `${entry.place.name}|${entry.place.country}|${entry.place.admin1 ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6)
      .map((entry) => entry.place);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: 'تعذّر الوصول إلى خدمة البحث عن المدن' },
      { status: 502 }
    );
  }
}
