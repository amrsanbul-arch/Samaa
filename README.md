# سماء · Samaa

سماء (Samaa) is an Arabic-first, cinematic weather experience for Arab cities. It opens on a slowly rotating 3D Earth, flies to the city you search for, and then reveals a full-screen landmark scene with live weather, a 7-day forecast, and weather effects that react to the real conditions.

## Features

- **3D globe landing** — `react-globe.gl` / three.js night Earth with a starfield, city beacons and slow auto-rotation.
- **Search** — Arabic or English city names, with debounced suggestions from the Open-Meteo geocoding API.
- **Cinematic flight** — the globe rotates and zooms into the selected coordinates before the scene opens.
- **Live weather** — current conditions (temperature, wind, humidity, rain chance, sunrise/sunset) plus a 7-day forecast from Open-Meteo. No API key.
- **Landmark scenes** — a curated backdrop per city (Pyramids, Burj Khalifa, Kingdom Centre, Hassan II Mosque…), with a Ken Burns drift and a glass card overlay.
- **Weather effects** — rain, snow, fog, clouds, lightning and a sun flare driven by the fetched conditions, all CSS/SVG based so they stay smooth on phones.
- **RTL Arabic UI** — Cairo/Tajawal typography, logical properties, safe-area padding, fully responsive from 360 px up.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 |
| 3D | react-globe.gl + three.js |
| Data | Open-Meteo (geocoding + forecast), no key required |

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
  page.tsx              landing ⇄ scene state machine, deep links (?city=)
  layout.tsx            fonts, RTL <html dir="rtl" lang="ar">, metadata
  globals.css           glass surfaces, starfield, flare and cloud keyframes
  api/geocode/route.ts  proxy for the Open-Meteo geocoding API
  api/weather/route.ts  proxy for the Open-Meteo forecast API
  api/scene/route.ts    allow-listed, cached image proxy for the backdrops
components/
  GlobeStage.tsx        hero: globe + headline + search + city chips
  GlobeScene.tsx        react-globe.gl wrapper (textures, arcs, flight)
  SearchBar.tsx         input, debounced suggestions, keyboard support
  WeatherView.tsx       full-screen landmark scene
  WeatherCard.tsx       glass card: city, temperature, metrics, description
  ForecastStrip.tsx     7-day forecast
  WeatherEffects.tsx    rain / snow / fog / clouds / lightning / flare layers
  WeatherIcon.tsx       SVG condition icons
lib/
  landmarks.ts          curated cities, aliases, backdrops, matching helpers
  weather.ts            WMO code → Arabic label/condition, effect config
  arabic.ts             Arabic normalisation for fuzzy city matching
  types.ts              shared types
public/textures/        local Earth textures (night, topology, water)
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

Cities without an entry still work — they fall back to a generic Arab skyline scene.

## Notes

- **Image proxy.** Wikimedia and Unsplash block or throttle direct hotlinking from browsers, and `next/image` refuses responses it cannot verify. `app/api/scene` re-serves the allow-listed hosts with a long cache, so the optimizer always receives a clean image. Wikimedia URLs go through `Special:FilePath`, which resolves to the canonical thumbnail.
- **Deep links.** `/?city=الرياض` opens straight into that city's scene, which makes sharing and reloading safe.
- **Textures.** The globe uses local files in `public/textures`, so the landing page has no third-party dependency at runtime.

## Credits

Weather and geocoding by [Open-Meteo](https://open-meteo.com/). Landmark photography by [Unsplash](https://unsplash.com) and [Wikimedia Commons](https://commons.wikimedia.org) — individual credits are linked inside each scene.
