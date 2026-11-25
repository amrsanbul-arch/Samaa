import { NextResponse } from 'next/server';

const ARAB_COUNTRIES = new Set([
  'SA', 'AE', 'EG', 'DZ', 'MA', 'TN', 'LY', 'SD', 'JO', 'LB', 'SY',
  'IQ', 'KW', 'QA', 'BH', 'OM', 'YE', 'PS', 'MR', 'SO', 'DJ', 'KM',
]);

type OpenMeteoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
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
  url.searchParams.set('count', '10');
  url.searchParams.set('language', lang);
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) throw new Error(`geocoding ${response.status}`);

    const data = (await response.json()) as { results?: OpenMeteoResult[] };

    const results = (data.results ?? [])
      .map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country ?? '',
        countryCode: item.country_code ?? '',
        admin1: item.admin1,
        latitude: item.latitude,
        longitude: item.longitude,
        population: item.population ?? 0,
      }))
      .sort((a, b) => {
        const aArab = ARAB_COUNTRIES.has(a.countryCode) ? 1 : 0;
        const bArab = ARAB_COUNTRIES.has(b.countryCode) ? 1 : 0;
        if (aArab !== bArab) return bArab - aArab;
        return (b.population ?? 0) - (a.population ?? 0);
      })
      .slice(0, 8);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: 'تعذّر الوصول إلى خدمة البحث عن المدن' },
      { status: 502 }
    );
  }
}
