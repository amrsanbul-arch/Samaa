# AGENTS.md

Arabic-first cinematic weather app (سماء / Samaa). Next.js 14 App Router, Tailwind 3, react-globe.gl.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build (also runs lint + type check)
- `npm start` — serve the built app
- `npx tsc --noEmit` — type check only

## Architecture notes

- `app/page.tsx` is the state machine: `landing` (globe) → `flying` → `weather` (landmark scene), plus `?city=` deep links resolved once via `deepLinkDone` ref.
- City data lives in `lib/landmarks.ts`. `matchLandmark()` resolves a query against curated cities (Arabic-normalised aliases) before falling back to geocoding.
- Weather/geocoding calls go through `app/api/geocode` and `app/api/weather` so responses can be cached server-side and the client never talks to Open-Meteo directly.
- All backdrop images are routed through `app/api/scene?u=…` (host allow-list + long cache). Wikimedia URLs must use `Special:FilePath`; direct `upload.wikimedia.org` thumb URLs get rate-limited (429) and `thumb.wikimedia.org` paths drift.
- Backdrops are `object-cover`; on phones a landscape photo crops to a narrow vertical slice, so each landmark may set `focus` (object-position) and `zoom` (bottom-anchored scale, applied only under `@media (max-aspect-ratio: 4/5)`).
- `lib/weather.ts` maps WMO codes to Arabic labels and to the effect config consumed by `components/WeatherEffects.tsx`.

## Conventions

- UI copy is Arabic and the document is `dir="rtl"`; use logical Tailwind utilities (`ms-*`, `me-*`, `start-*`, `end-*`).
- Tailwind opacity modifiers must come from the default scale (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) or use arbitrary values (`bg-white/[0.06]`). Values like `/8`, `/12`, `/35`, `/45` are silently dropped.
- Keep animations CSS/SVG based; the app targets mid-range phones.

## Gotchas

- After `npm run build`, restart `next start` — a running server keeps the old build manifest and serves stale CSS/JS.
- Headless Chromium screenshots for mobile checks: `chromium --headless=new --no-sandbox --disable-gpu --window-size=390,844 --force-device-scale-factor=2 --screenshot=out.png URL`.
