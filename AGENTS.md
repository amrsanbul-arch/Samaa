# AGENTS.md

Cinematic weather app (سماء / Samaa) for cities worldwide. Next.js 14 App Router, Tailwind 3, react-globe.gl. Five UI languages: ar (RTL), en, de, ru, it.

Curated landmarks cover major cities on every continent; any other city falls back to the neutral scene.

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
- `/api/weather` is the resilience layer: `AbortSignal.timeout(3500)` on Open-Meteo, a 10-minute in-memory cache keyed by rounded coordinates, stale-on-error, a 5-minute circuit breaker after two failures, and a MET Norway (`locationforecast/2.0/compact`) fallback that maps `symbol_code` → WMO, aggregates hourly data into 7 daily rows and computes sunrise/sunset with `lib/solar.ts`. The client passes `cc` (country code) so the fallback knows the time zone via `lib/timezones.ts`.
- All backdrop images are routed through `app/api/scene?u=…` (host allow-list + long cache). Wikimedia URLs must use `Special:FilePath`; direct `upload.wikimedia.org` thumb URLs get rate-limited (429) and `thumb.wikimedia.org` paths drift.
- Backdrops are `object-cover`; on phones a landscape photo crops to a narrow vertical slice, so each landmark may set `focus` (object-position) and `zoom` (bottom-anchored scale, applied only under `@media (max-aspect-ratio: 4/5)`).
- `lib/weather.ts` maps WMO codes to `ConditionKey`s (labels live in `lib/i18n.ts`) and to the effect config consumed by `components/WeatherEffects.tsx` and `lib/ambience.ts`.
- Localisation: `lib/i18n.ts` holds the UI dictionary, condition and compass labels plus `detectLang`; `lib/landmark-i18n.ts` holds per-city copy keyed by landmark `id` (Arabic stays on the landmark). `LangProvider` sets `<html lang dir>` and persists to `samaa:lang`.
- Globe texture follows the device clock (06:00–18:00 → `earth-day.jpg`), recomputed every minute in `app/page.tsx`. `GlobeStage` takes `paused` so the render loop stops while the scene covers the globe.
- `lang`/`dir` are rendered on the server from the `samaa:lang` cookie, falling back to `Accept-Language` (`lib/i18n.ts#fromAcceptLanguage`), so `/` is dynamic. The provider writes the cookie whenever the language changes; do not move detection back into a client effect or the first paint flips direction.

## Conventions

- UI copy comes from `t()` in `lib/i18n.ts` — never hardcode a string in a component. Use logical Tailwind utilities (`ms-*`, `me-*`, `start-*`, `end-*`) and mirror directional icons with `rtl:rotate-180` / `ltr:rotate-180`.
- Each city resolves to a palette in `lib/theme.ts` (`nile` / `sea` / `sunset`), rendered as a `.theme-*` class on the scene and on the landing. Those classes set `--brand-rgb`, `--scrim-rgb`, `--cream-rgb`, `--panel-rgb`, `--extra-rgb` plus `--font-display`/`--font-body`; Tailwind reads the colour channels through `brand`/`scrim`/`cream`/`panel`/`extra`, so a new colour must be added in `tailwind.config.ts` and as a channel in `globals.css`. Arabic pairs Cairo/Tajawal/Amiri with the theme; Latin and Cyrillic fall back to Montserrat/Poppins/Playfair via `html:not([lang='ar'])`.
- Forecast times are wall-clock strings from the API. Format them with `timeLabel(iso, lang)` — never `new Date(iso)` plus a `timeZone`, that shifts sunrise/sunset by the visitor's offset.
- The landing `<main>` is kept mounted for the exit animation and switched to `inert` while the scene is open; keep it that way so hidden chips stay unclickable and out of the tab order.
- Tailwind opacity modifiers must come from the default scale (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) or use arbitrary values (`bg-white/[0.06]`). Values like `/8`, `/12`, `/35`, `/45` are silently dropped.
- Keep animations CSS/SVG based; the app targets mid-range phones.

## Auth

- `/login` is the entry point. `components/AuthGate.tsx` keeps the globe and the city scenes behind a Supabase session and sends visitors without one to `/login`.
- `lib/supabase.ts` reads the environment **on the server** (`readAuthConfig`) because Next only inlines `NEXT_PUBLIC_*` into the browser bundle; the deployment's `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_ENABLE_APPLE_LOGIN` names are accepted too. Missing values mean `configured: false`: no client is created, the login form is disabled behind a banner, and nothing throws.
- `components/AuthProvider.tsx` owns the session (`getSession` + `onAuthStateChange`), `signIn`, `signUp`, `signInWithProvider`, `resetPassword` and `signOut`. `lib/auth-errors.ts` maps Supabase's English messages onto `t()` keys; never surface `error.message` directly.
- Supabase validates OAuth providers server-side, so a disabled provider never reaches our code — it comes back as `#error=…&error_description=…`. `LoginScreen` reads that on mount, translates it and strips the hash with `replaceState`.
- The login page is deliberately monochrome (Resend reference): `#F0F0F0` text on `#191B1E` fields, `#333B3E` borders, `#141517` inverted primary, Inter for Latin and Cairo for Arabic, no panels, no accent colour and no GitHub button. The overlay is `bg-black/[0.76]` plus a black radial; that pair is what keeps the `#A1A4A5` labels above 4.5:1 over the brightest part of the Nile photo.
- The `?city=` deep link waits for `session` before running: its `history.replaceState` desyncs the App Router while `AuthGate` is navigating to `/login`, which leaves a blank page.

## Gotchas

- After `npm run build`, restart `next start` — a running server keeps the old build manifest and serves stale CSS/JS.
- Theme classes live outside `@layer` on purpose: Tailwind drops class selectors placed in `@layer base`, which silently strips the palette.
- Changing the `next/font` set requires `rm -rf .next`; a stale font cache makes `next/font` fail with `Cannot read properties of null (reading '1')`.
- The same error appears on a cold cache when Google serves the legacy `l/font?kit=` CSS, whose URLs have no font extension. Static Playfair Display instances do this, so Playfair is declared without `weight` (variable axis, 400–900) and must stay that way; if the error still appears, re-run the build.
- `npm run lint` is not wired up (no ESLint config), so it prompts instead of running; `npx tsc --noEmit` plus a production build is the check.
- Headless Chromium screenshots for mobile checks: `chromium --headless=new --no-sandbox --disable-gpu --window-size=390,844 --force-device-scale-factor=2 --screenshot=out.png URL`.
