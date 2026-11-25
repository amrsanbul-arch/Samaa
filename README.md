# سماء · Samaa

سماء (Samaa) is a cinematic weather experience for cities around the world in five languages. It opens on a slowly rotating 3D Earth, flies to the city you search for, and then reveals a full-screen landmark scene with live weather, a 7-day forecast, ambient sound, and weather effects that react to the real conditions.

## Features

- **Five languages** — Arabic (RTL), English, German, Russian and Italian. The language is auto-detected from the browser, can be switched from the header, is stored locally, and can be forced with `?lang=de`. UI copy, weather conditions, dates, city names and landmark descriptions are all localised.
- **3D globe landing** — `react-globe.gl` / three.js Earth with a starfield, city beacons and slow auto-rotation. The texture follows the visitor's device clock: blue-marble day map between 06:00 and 18:00, city-lights night map after that.
- **Search** — any city on Earth, typed in Arabic, English or its translated name, with debounced suggestions from the Open-Meteo geocoding API (requested in the active language and ranked by the provider's relevance, so the biggest matching city comes first).
- **Instant entry** — the scene opens as soon as the place resolves (about 40 ms for curated cities); the photo paints first and the glass card follows when the forecast lands. The globe dive itself is a 700 ms zoom.
- **Cinematic exit** — pressing back pulls the camera out to orbit altitude while the scene fades, so you always return to the globe rather than cutting to it.
- **Live weather** — current conditions (temperature, wind, humidity, rain chance, sunrise/sunset) plus a 7-day forecast. Open-Meteo is the primary source; if it times out or refuses the request, the route transparently falls back to MET Norway, so the scene still fills in. No API key for either.
- **Landmark scenes** — a curated backdrop for 52 cities across every continent (Pyramids, Burj Khalifa, Eiffel Tower, Shibuya, Table Mountain, Sydney Opera House…), with a Ken Burns drift and a glass card overlay. Any other city gets a neutral scene picked by latitude band: tropical, temperate or northern.
- **Weather effects** — rain, snow, fog, clouds, lightning and a sun flare driven by the fetched conditions, all CSS/SVG based so they stay smooth on phones.
- **Ambient sound** — rain, wind and fog beds plus thunder are synthesised with the Web Audio API (no audio files), toggled by the speaker button and remembered across visits.
- **Swipe-up card** — on phones the glass card starts as a peek and rises on swipe, so the landmark photo is unobstructed on arrival.
- **Honest loading state** — if the forecast really cannot be fetched the card shows a short message and a retry button instead of an endless skeleton, and the credit line names the provider that answered.
- **RTL + LTR** — Cairo/Tajawal for Arabic and Inter for Latin/Cyrillic, logical properties, mirrored icons, safe-area padding, responsive from 360 px up.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 |
| 3D | react-globe.gl + three.js |
| Data | Open-Meteo (geocoding + forecast, primary), MET Norway (forecast fallback), no keys required |
| Audio | Web Audio API (procedural ambience) |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

Node 18+ is required.

## Project layout

```
app/
  page.tsx              landing ⇄ scene state machine, deep links (?city=, ?lang=)
  layout.tsx            fonts (Cairo, Tajawal, Inter), LangProvider, metadata
  globals.css           glass surfaces, starfield, flare and cloud keyframes
  api/geocode/route.ts  proxy for the Open-Meteo geocoding API
  api/weather/route.ts  forecast proxy: 3.5 s timeout, 10 min cache, breaker, MET Norway fallback
  api/scene/route.ts    allow-listed, cached image proxy for the backdrops
components/
  LangProvider.tsx      language context: detection, persistence, <html lang dir>
  LanguageSwitcher.tsx  header dropdown with the five locales
  SoundToggle.tsx       ambience on/off, persists the choice
  GlobeStage.tsx        hero: globe + headline + search + city chips
  GlobeScene.tsx        react-globe.gl wrapper (day/night textures, flight, zoom-out)
  SearchBar.tsx         input, debounced suggestions, keyboard support
  WeatherView.tsx       full-screen landmark scene, swipe-up sheet, skeleton state
  WeatherCard.tsx       glass card: city, temperature, metrics, description
  ForecastStrip.tsx     7-day forecast
  WeatherEffects.tsx    rain / snow / fog / clouds / lightning / flare layers
  WeatherIcon.tsx       SVG condition icons
lib/
  i18n.ts               language table, UI dictionary, condition + compass labels, Accept-Language parsing
  solar.ts              NOAA sunrise/sunset (used by the fallback provider)
  timezones.ts          country → IANA zone lookup for the fallback provider
  landmark-i18n.ts      localised city/landmark copy for the four Latin locales
  landmarks.ts          curated cities, aliases, backdrops, matching helpers
  weather.ts            WMO code → localised label/condition, effect config
  ambience.ts           Web Audio rain/wind/fog beds and thunder
  arabic.ts             Arabic normalisation for fuzzy city matching
  types.ts              shared types
public/textures/        local Earth textures (day, night, topology, water)
```

## Adding a city

Append an entry to `LANDMARKS` in `lib/landmarks.ts`:

```ts
{
  id: 'muscat',
  city: 'مسقط',
  cityEn: 'Muscat',
  country: 'عُمان',
  countryCode: 'OM',
  landmark: 'دار الأوبرا السلطانية',
  description: '…',
  image: commons('File_name_on_Commons.jpg'), // or unsplash('photo-id')
  credit: credit('File_name_on_Commons.jpg'),
  latitude: 23.588,
  longitude: 58.3829,
  aliases: ['مسقط', 'muscat'],
  focus: '50% 55%', // optional CSS object-position for the backdrop
  zoom: 1.3,        // optional extra zoom on tall screens
}
```

Cities without an entry still work — they fall back to a neutral horizon scene (tropical, temperate or northern, chosen by latitude) with localised copy. To localise a new city, add its copy to `LANDMARK_I18N` in `lib/landmark-i18n.ts` (keyed by the landmark `id`); Arabic lives on the landmark itself.

## Notes

- **Image proxy.** Wikimedia and Unsplash block or throttle direct hotlinking from browsers, and `next/image` refuses responses it cannot verify. `app/api/scene` re-serves the allow-listed hosts with a long cache, so the optimizer always receives a clean image. Wikimedia URLs go through `Special:FilePath`, which resolves to the canonical thumbnail.
- **Deep links.** `/?city=الرياض` opens straight into that city's scene, and `?lang=it` forces a language, which makes sharing and reloading safe.
- **Times.** Forecast, sunrise and sunset are shown exactly as the city's wall clock — the API already returns local times, so they are never re-converted through the visitor's time zone.
- **First paint.** The root layout reads the `samaa:lang` cookie (or the browser's `Accept-Language`) so `<html lang dir>` is correct in the server HTML, with no RTL/LTR flash on reload.
- **Resilience.** `/api/weather` answers from a 10-minute in-memory cache, aborts a slow upstream after 3.5 s, opens a 5-minute circuit breaker after repeated Open-Meteo failures, and serves a stale reading rather than nothing.
- **Typography.** `html[lang]` drives the font stack: Arabic switches to Cairo/Tajawal, every other locale uses Inter (Latin + Cyrillic). `dir` flips with the language and the arrow icons mirror through `rtl:`/`ltr:` variants.
- **Sound.** Browsers only allow audio after a gesture, so the ambience starts muted; the toggle is the gesture that unlocks the AudioContext.
- **Textures.** The globe uses local files in `public/textures`, so the landing page has no third-party dependency at runtime.

## Credits

Weather and geocoding by [Open-Meteo](https://open-meteo.com/). Landmark photography by [Unsplash](https://unsplash.com) and [Wikimedia Commons](https://commons.wikimedia.org) — individual credits are linked inside each scene.
