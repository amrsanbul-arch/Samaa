import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'images.unsplash.com',
  'commons.wikimedia.org',
  'thumb.wikimedia.org',
  'upload.wikimedia.org',
]);

const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * Streams landmark photos from the allow-listed image CDNs.
 * Browsers get blocked or rate limited by Wikimedia when hot-linking, so the
 * backdrop is fetched server side once and then served from cache.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('u');

  if (!raw) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 400 });
  }

  // Wikimedia intermittently throttles a cold fetch (429/503), which used to leave
  // a blank backdrop until the next visit; one retry covers the transient case.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const upstream = await fetch(target, {
        headers: {
          'User-Agent': 'SamaaWeather/1.0 (landmark backdrop proxy)',
          Accept: 'image/jpeg,image/png,image/*;q=0.8',
        },
        next: { revalidate: ONE_WEEK },
      });

      const contentType = upstream.headers.get('content-type') ?? '';
      if (upstream.ok && upstream.body && contentType.startsWith('image/')) {
        return new Response(upstream.body, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': `public, max-age=${ONE_WEEK}, s-maxage=${ONE_WEEK}, immutable`,
          },
        });
      }
    } catch {
      /* retry once before giving up */
    }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return NextResponse.json({ error: 'upstream failed' }, { status: 502 });
}
