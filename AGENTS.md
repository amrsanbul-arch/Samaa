# AGENTS.md

Cinematic weather app (سماء / Samaa) for cities worldwide. Next.js 14 App Router, Tailwind 3. Five UI languages: ar (RTL), en, de, ru, it. There is no 3D globe and no WebGL: a visitor lands straight in a city scene, and a plain search screen is the only fallback.

Curated landmarks cover major cities on every continent; any other city falls back to the neutral scene.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build (also runs lint + type check)
- `npm start` — serve the built app
- `npx tsc --noEmit` — type check only

## Architecture notes

- `app/page.tsx` is a two-state view: no place (search screen) or a place (the scene, `fixed inset-0 z-40`). `?city=` and `?lang=` deep links are resolved once, and only after `useLang().ready` so the place name matches the detected language.
- `/` opens the visitor's own city, in this order: the `?city=` deep link, then the city saved in this browser (`lib/home-city.ts`, `samaa:home-city`), then the city the edge reports for the request IP via `GET /api/home-city`. That route reads `x-vercel-ip-city/country/latitude/longitude`, refuses excluded countries, prefers a curated scene whose own city matches the reported name, else geocodes the name, else takes the nearest curated scene to the coordinates, and never caches (`no-store`). Anything the visitor picks through the search box is saved as the new home city, so the next visit opens it.
- With nothing to go on, the search screen stays; the scene header carries a «تغيير مدينتي» button that opens the same search in a `role="dialog"` overlay, so no visitor is ever trapped in one city.
- `weather` may be `null` inside `WeatherView` — the scene renders with a skeleton card while the first forecast loads. Do not gate the overlay on weather.
- City data lives in `lib/countries.ts`: one `COUNTRIES` object per curated place, carrying the photo, credit, IANA `timezone`, coordinates, aliases and copy in all five languages, plus `COUNTRY_NAMES` for localised country names. Adding a country or city means appending one object at the end of `COUNTRIES` (plus its name in `COUNTRY_NAMES` if it is new) — no other file changes, which is how the country batches land. `lib/landmarks.ts` only derives from it (`LANDMARKS`, `findLandmark`, `localizedText`, `placeFromLandmark`).
- `timezone` is per landmark, not per country: the US, Canada, Brazil, Mexico and Australia span several zones, and sunrise/sunset (and the night palette) depend on the right one.
- Scene lookup lives in `lib/landmarks.ts`. `findLandmarks()` matches Arabic-normalised keys (id, both city names, aliases, all five translations) and returns every scene tied on the best score, in `COUNTRIES` order; `normalizeArabic` folds punctuation, so `chichen-itza` matches `Chichén Itzá`. `findLandmark()` is its first result.
- `landmarkForPlace()` adds the geocoder: a name shared by two countries resolves to the scene in the place's own country ("Jerusalem" + IL → Western Wall, + PS → Dome of the Rock), otherwise to the nearest scene of that name within 120 km; failing that it takes the nearest scene within 60 km inside the same country, so a translated name ("روما", "Rom") still lands. A name that only matches a far-away country stays generic on purpose ("Paris", Texas must not borrow the Eiffel Tower).
- Country labels never come straight from the geocoder: `placeCountry()` in `lib/landmarks.ts` returns the name, ISO code and district to show. Palestinian places are labelled «Palestine»/«فلسطين» (Open-Meteo leaves their country empty), and a city sitting inside a curated Palestinian scene — Jerusalem, which the geocoder files under a neighbouring country — takes that scene's label and drops the foreign district name. `EXCLUDED_COUNTRY_CODES` in that file (and `EXCLUDED_COUNTRIES` in `app/api/geocode/route.ts`) is the list of countries the site refuses to serve: their places never reach a suggestion, a scene or a label. Scenes flagged `capital` print «عاصمة …» / «Capital of …» instead of the bare country, but only for the capital's own city: a city that borrows a neighbouring scene keeps its own name and title.
- A city with two curated views (`scenesForPlace()`, scenes within 15 km) shows a pager of dots beside the landmark name in `components/WeatherCard.tsx`; `curatedId` in `app/page.tsx` holds the chosen scene. Do not rely on tie-breaking to pick between them — both must stay reachable, and the city, geocoded weather and timezone stay those of the searched place.
- Weather/geocoding calls go through `app/api/geocode` and `app/api/weather` so responses can be cached server-side and the client never talks to Open-Meteo directly.
- `/api/geocode` runs the query twice (UI language + English) so a translated name ("Roma") still matches a Latin query ("Rome"), then ranks by exact name, country hint (`cc`, from the browser locale) and population — so "Paris" reaches Paris in France, not a same-named town.
- `/api/weather` is the resilience layer: `AbortSignal.timeout(3500)` on Open-Meteo, a 10-minute in-memory cache keyed by rounded coordinates, stale-on-error, a 5-minute circuit breaker after two failures, and a MET Norway (`locationforecast/2.0/compact`) fallback that maps `symbol_code` → WMO, aggregates hourly data into 7 daily rows and computes sunrise/sunset with `lib/solar.ts`. The client passes `cc` (country code) so the fallback knows the time zone via `lib/timezones.ts`.
- All backdrop images are routed through `app/api/scene?u=…` (host allow-list + long cache, three attempts with exponential backoff because Wikimedia throttles cold fetches with 429/403/503). Wikimedia URLs must use `Special:FilePath`; direct `upload.wikimedia.org` thumb URLs get rate-limited (429) and `thumb.wikimedia.org` paths drift. Store file names in either plain or percent-encoded form — `fileName()` decodes before re-encoding. When spot-checking images by hand, decode the stored name first, otherwise `%26` becomes `%2526` and the check returns a false 502.
- Backdrops are `object-cover`; on phones a landscape photo crops to a narrow vertical slice, so each landmark may set `focus` (object-position) and `zoom` (bottom-anchored scale, applied only under `@media (max-aspect-ratio: 4/5)`).
- `lib/weather.ts` maps WMO codes to `ConditionKey`s (labels live in `lib/i18n.ts`) and to the effect config consumed by `components/WeatherEffects.tsx` and `lib/ambience.ts`.
- Localisation: `lib/i18n.ts` holds the UI dictionary, condition and compass labels plus `detectLang`; per-city copy lives in `lib/countries.ts` (`copy.ar|en|de|ru|it`) and is surfaced by `localizedText()`. `LangProvider` sets `<html lang dir>` and persists to `samaa:lang`.
- Two localised clock times must never be concatenated into one Arabic string: bidi reorders the markers around the digits. Wrap each in an `[unicode-bidi:isolate]` element inside a `dir="ltr"` line, as the sunrise/sunset pair in `components/WeatherCard.tsx` does.
- `app/favicon.ico` mirrors `app/icon.svg` (same mark, 16/32/48/64 px) so clients that request the legacy path get the logo instead of a 404; regenerate it if the icon changes.
- `lang`/`dir` are rendered on the server from the `samaa:lang` cookie, falling back to `Accept-Language` (`lib/i18n.ts#fromAcceptLanguage`), so `/` is dynamic. The provider writes the cookie whenever the language changes; do not move detection back into a client effect or the first paint flips direction.

## Photo attribution

- Every scene's `image` must have a matching entry in `lib/photo-credits.ts` (`PHOTO_CREDITS`, keyed by the decoded file name) with photographer, licence name + licence URL, the Commons file page and a `changes` note. `credit()` in `lib/countries.ts` builds the caption from that map; a missing entry degrades to "Wikimedia Commons contributor" instead of an invented name. The `changes` note is stored once in English: `CHANGES_STANDARD` / `CHANGES_VARIANT` in `lib/photo-credits.ts` are the only two values, and `/credits` renders them through `t('changesStandard')` / `t('changesVariant')` so no English leaks into the Arabic page.
- Verify metadata from Commons before adding a file: `https://commons.wikimedia.org/w/api.php?action=query&titles=File:NAME&prop=imageinfo&iiprop=extmetadata&format=json` (Artist, LicenseShortName, LicenseUrl, ImageDescription). Do not infer a licence from the file page's layout.
- The credit is visible twice: as the caption under the card blurb (`components/WeatherCard.tsx`, links to the file page, tooltip carries photographer + licence) and on `/credits`, which lists every landmark with a thumbnail, photographer, licence link, source and the change made. `/credits` is public, unlike the scenes.
- Trim import noise from artist strings ("… from Hamm, Deutschland", long Commons templates) when regenerating credits; keep the real name, not the uploader's signature block.
- Pick photos whose subject survives the card overlay: the weather card covers the left ~40% of the viewport, so a landmark centred or right of centre reads better. Long, thin panoramas and heavy window reflections look fine in a thumbnail sheet and bad as a backdrop.
- When Commons search finds nothing for an obscure landmark, query by coordinates (`action=query&list=geosearch&gscoord=lat|lon&gsradius=4000&gsnamespace=6`) or walk the category; both surface files that the text index misses. `Special:FilePath` returns 404 if the file name is truncated, so store the exact `title` returned by `imageinfo`, never a shortened one.
- A handful of Commons files carry {{Copyrighted free use}} instead of a CC tag (e.g. the Alele Museum photo). They are usable: record the licence as "Copyrighted free use" and link `https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use` in `licenseUrl`, since `LicenseUrl` is empty for them.

## Conventions

- UI copy comes from `t()` in `lib/i18n.ts` — never hardcode a string in a component. Use logical Tailwind utilities (`ms-*`, `me-*`, `start-*`, `end-*`) and mirror directional icons with `rtl:rotate-180` / `ltr:rotate-180`.
- Each city resolves to a palette in `lib/theme.ts` (`nile` / `sea` / `sunset`), rendered as a `.theme-*` class on the scene and on the landing. Those classes set `--brand-rgb`, `--scrim-rgb`, `--cream-rgb`, `--panel-rgb`, `--extra-rgb` plus `--font-display`/`--font-body`; Tailwind reads the colour channels through `brand`/`scrim`/`cream`/`panel`/`extra`, so a new colour must be added in `tailwind.config.ts` and as a channel in `globals.css`. Arabic pairs Cairo/Tajawal/Amiri with the theme; Latin and Cyrillic fall back to Montserrat/Poppins/Playfair via `html:not([lang='ar'])`.
- Forecast times are wall-clock strings from the API. Format them with `timeLabel(iso, lang)` — never `new Date(iso)` plus a `timeZone`, that shifts sunrise/sunset by the visitor's offset.
- Tailwind opacity modifiers must come from the default scale (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) or use arbitrary values (`bg-white/[0.06]`). Values like `/8`, `/12`, `/35`, `/45` are silently dropped.
- Keep animations CSS/SVG based; the app targets mid-range phones.
- Small controls need a real target: the scene pager dots are 6 px visuals inside 32×32 buttons in their own row (`components/WeatherCard.tsx`), and the temperature block is `pointer-events-none`, or the glyph box swallows the taps.
- The empty search box is not a dead end: pressing the search action focuses the input and shows `t('searchEmptyHint')` instead of doing nothing, and the action keeps an `aria-label` because its label is icon-only on phones.
- Unknown addresses land on `app/not-found.tsx`: Arabic, RTL, brand-marked, with links home and to `/credits`.

## Auth

- `/login` is the entry point. `components/AuthGate.tsx` keeps the city scenes behind a Supabase session and sends visitors without one to `/login`.
- `lib/supabase.ts` reads the environment **on the server** (`readAuthConfig`) because Next only inlines `NEXT_PUBLIC_*` into the browser bundle; the deployment's `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_ENABLE_APPLE_LOGIN` names are accepted too. Missing values mean `configured: false`: no client is created, the login form is disabled behind a banner, and nothing throws.
- `components/AuthProvider.tsx` owns the session (`getSession` + `onAuthStateChange`), `signIn`, `signUp`, `signInWithProvider`, `resetPassword` and `signOut`. `lib/auth-errors.ts` maps Supabase's English messages onto `t()` keys; never surface `error.message` directly.
- Supabase validates OAuth providers server-side, so a disabled provider never reaches our code — it comes back as `#error=…&error_description=…`. `LoginScreen` reads that on mount, translates it and strips the hash with `replaceState`.
- The login page is deliberately monochrome (Resend reference): `#F0F0F0` text on `#191B1E` fields, `#333B3E` borders, `#141517` inverted primary, Inter for Latin and Cairo for Arabic, no panels, no accent colour and no GitHub button — the official four-colour Google "G" inside the Google button is the only colour on the page. The overlay is `bg-black/[0.76]` plus a black radial; that pair is what keeps the `#A1A4A5` labels above 4.5:1 over the brightest part of the Nile photo.
- The `?city=` deep link (and the home-city resolution) waits for `session` before running: its `history.replaceState` desyncs the App Router while `AuthGate` is navigating to `/login`, which leaves a blank page.

## Gotchas

- After `npm run build`, restart `next start` — a running server keeps the old build manifest and serves stale CSS/JS.
- Theme classes live outside `@layer` on purpose: Tailwind drops class selectors placed in `@layer base`, which silently strips the palette.
- Changing the `next/font` set requires `rm -rf .next`; a stale font cache makes `next/font` fail with `Cannot read properties of null (reading '1')`.
- The same error appears on a cold cache when Google serves the legacy `l/font?kit=` CSS, whose URLs have no font extension. Static Playfair Display instances do this, so Playfair is declared without `weight` (variable axis, 400–900) and must stay that way; if the error still appears, re-run the build.
- `npm run lint` is not wired up (no ESLint config), so it prompts instead of running; `npx tsc --noEmit` plus a production build is the check.
- Headless Chromium screenshots for mobile checks: `chromium --headless=new --no-sandbox --disable-gpu --window-size=390,844 --force-device-scale-factor=2 --screenshot=out.png URL`.
