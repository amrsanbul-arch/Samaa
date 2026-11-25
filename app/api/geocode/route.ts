import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const lang = searchParams.get('lang') ?? 'ar';

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '20');
  url.searchParams.set('language', lang);
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) throw new Error(`geocoding ${response.status}`);

    const data = (await response.json()) as { results?: OpenMeteoResult[] };

    const scored = (data.results ?? []).map((item, index) => {
      return {
        place: {
          id: item.id,
          name: item.name,
          country: item.country ?? '',
          countryCode: item.country_code ?? '',
          admin1: item.admin1,
          latitude: item.latitude,
          longitude: item.longitude,
          population: item.population ?? 0,
          timezone: item.timezone,
        },
        // The provider already ranks exact names first and then by population.
        // Local exact-matching cannot be trusted because names arrive localized
        // (searching "Lima" in Arabic returns "ليما", which let Limay win).
        index,
        population: item.population ?? 0,
      };
    });

    // Hamlets share names with real cities; prefer settlements big enough to
    // be what the visitor meant, and never pad the list with duplicates.
    const big = scored.filter((entry) => entry.population >= 15000);
    const pool = big.length > 0 ? big : scored.filter((entry) => entry.population >= 5000);
    const candidates = pool.length > 0 ? pool : scored;

    const seen = new Set<string>();
    const results = candidates
      .sort((a, b) => a.index - b.index)
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
