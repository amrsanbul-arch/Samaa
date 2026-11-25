# AGENTS.md

Cinematic weather app (سماء / Samaa) for Arab cities. Next.js 14 App Router, Tailwind 3, react-globe.gl. Five UI languages: ar (RTL), en, de, ru, it.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build (also runs lint + type check)
- `npm start` — serve the built app
- `npx tsc --noEmit` — type check only

## Architecture notes

- `app/page.tsx` is the state machine: `idle` (globe) → `flying` (only while geocoding) → `weather` → `leaving` (scene fades while the globe pulls back). `?city=` and `?lang=` deep links are resolved once, and only after `useLang().ready` so the place name matches the detected language.
- The landing is never unmounted: the scene is a `fixed inset-0 z-40` overlay, and the globe stays behind it so the exit zoom-out is visible.
- `weather` may be `null` inside `WeatherView` — the scene renders with a skeleton card while the first forecast loads. Do not gate the overlay on weather.
- City data lives in `lib/landmarks.ts`. `matchLandmark()` resolves a query against curated cities (Arabic-normalised aliases) before falling back to geocoding.
- Weather/geocoding calls go through `app/api/geocode` and `app/api/weather` so responses can be cached server-side and the client never talks to Open-Meteo directly.
- All backdrop images are routed through `app/api/scene?u=…` (host allow-list + long cache). Wikimedia URLs must use `Special:FilePath`; direct `upload.wikimedia.org` thumb URLs get rate-limited (429) and `thumb.wikimedia.org` paths drift.
- Backdrops are `object-cover`; on phones a landscape photo crops to a narrow vertical slice, so each landmark may set `focus` (object-position) and `zoom` (bottom-anchored scale, applied only under `@media (max-aspect-ratio: 4/5)`).
- `lib/weather.ts` maps WMO codes to `ConditionKey`s (labels live in `lib/i18n.ts`) and to the effect config consumed by `components/WeatherEffects.tsx` and `lib/ambience.ts`.
- Localisation: `lib/i18n.ts` holds the UI dictionary, condition and compass labels plus `detectLang`; `lib/landmark-i18n.ts` holds per-city copy keyed by landmark `id` (Arabic stays on the landmark). `LangProvider` sets `<html lang dir>` and persists to `samaa:lang`.
- Globe texture follows the device clock (06:00–18:00 → `earth-day.jpg`), recomputed every minute in `app/page.tsx`.

## Conventions

- UI copy comes from `t()` in `lib/i18n.ts` — never hardcode a string in a component. Use logical Tailwind utilities (`ms-*`, `me-*`, `start-*`, `end-*`) and mirror directional icons with `rtl:rotate-180` / `ltr:rotate-180`.
- `html[lang]` picks the font stack (Cairo/Tajawal for Arabic, Inter for the rest); `.font-display` is overridden the same way in `globals.css`.
- Tailwind opacity modifiers must come from the default scale (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) or use arbitrary values (`bg-white/[0.06]`). Values like `/8`, `/12`, `/35`, `/45` are silently dropped.
- Keep animations CSS/SVG based; the app targets mid-range phones.

## Gotchas

- After `npm run build`, restart `next start` — a running server keeps the old build manifest and serves stale CSS/JS.
- Headless Chromium screenshots for mobile checks: `chromium --headless=new --no-sandbox --disable-gpu --window-size=390,844 --force-device-scale-factor=2 --screenshot=out.png URL`.
