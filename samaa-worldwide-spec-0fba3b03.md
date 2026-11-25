# Samaa: توسيع التطبيق ليغطي العالم كله (Implementation Spec)

الهدف: التطبيق دلوقتي متصمم للعالم العربي بس. المطلوب إنه يبقى لكل مدن العالم، من غير ما نكسر أي حاجة شغالة. الملف ده مكتوب عشان تديه لـ OpenHands agent ينفذه.

الأساس بالفعل شغال: الـ geocoding من Open-Meteo بيدور على أي مدينة في العالم، والـ weather والـ timezone بيشتغلوا لأي إحداثيات. المشكلة في 5 أماكن بس: (1) ترتيب البحث بيفضّل العرب، (2) بيانات المشاهد (landmarks) كلها عربية، (3) الـ chips بتاعة "الأكثر بحثاً" كلها عربية، (4) نصوص الـ branding، (5) الـ fallback scene بتاع "أفق عربي".

ملحوظة عامة: ما تغيرش أي حاجة تانية، وبعد التعديلات شغّل `npx tsc --noEmit` و `npm run build` وتأكد إنهم بيعدّوا.

---

## 1) `app/api/geocode/route.ts`: شيل تفضيل الدول العربية

دلوقتي فيه `ARAB_COUNTRIES` وحقل `arab` في الترتيب، فلما حد يكتب "Alexandria" مثلا بيطلع الإسكندرية قبل أي مدينة تانية حتى لو أصغر، وأي مدينة عالمية بتتأخر.

التعديل:
- امسح الـ `ARAB_COUNTRIES` Set بالكامل.
- امسح سطر `arab: ARAB_COUNTRIES.has(...)` من الـ `scored.map`.
- في الـ `.sort`، شيل الشرط `if (a.arab !== b.arab) ...`. الترتيب النهائي يبقى: exact match الأول، وبعدين الـ population الأكبر.
- خلي `count` بتاع Open-Meteo يبقى `'20'` بدل `'10'` (عشان بعد فلترة الـ population والتكرار يفضل عندنا نتايج كفاية)، وسيب `.slice(0, 6)` زي ما هو.
- الفلتر `population >= 15000` ثم `>= 5000` سيبه زي ما هو، هو سليم للعالم كله.
- رسالة الـ error العربي في الـ catch (`'تعذّر الوصول إلى خدمة البحث عن المدن'`) سيبها، العميل بيستخدم `geocodeError` من الـ i18n.

---

## 2) `lib/landmarks.ts`: ضيف مدن العالم

دلوقتي `LANDMARKS` فيه 22 مدينة عربية بس (cairo, dubai, riyadh, alexandria, makkah, madinah, jeddah, abudhabi, doha, kuwait, manama, muscat, amman, petra, beirut, damascus, baghdad, casablanca, marrakech, tunis, sanaa, alula).

### 2.1 غيّر الكومنت
الكومنت فوق `LANDMARKS` بيقول "Curated cinematic backdrops for major Arab cities". خليه "for major cities around the world".

### 2.2 ضيف المدن دي (بنفس شكل الـ `Landmark` type بالظبط)
كل مدينة محتاجة: `id`, `city` (بالعربي), `cityEn`, `country` (بالعربي), `countryCode`, `landmark` (بالعربي), `description` (جملتين بالعربي)، `image`, `credit`, `latitude`, `longitude`, `aliases` (عربي + إنجليزي + أي تهجئة شائعة)، و `focus` لو الصورة محتاجة.

| id | cityEn | countryCode | Landmark |
|---|---|---|---|
| london | London | GB | Tower Bridge / Big Ben |
| paris | Paris | FR | Eiffel Tower |
| rome | Rome | IT | Colosseum |
| istanbul | Istanbul | TR | Hagia Sophia / Bosphorus |
| berlin | Berlin | DE | Brandenburg Gate |
| madrid | Madrid | ES | Plaza Mayor / Royal Palace |
| moscow | Moscow | RU | Saint Basil's Cathedral |
| amsterdam | Amsterdam | NL | canals |
| athens | Athens | GR | Acropolis |
| new-york | New York | US | Manhattan skyline |
| los-angeles | Los Angeles | US | Hollywood sign / skyline |
| toronto | Toronto | CA | CN Tower |
| mexico-city | Mexico City | MX | Zócalo / Angel of Independence |
| rio | Rio de Janeiro | BR | Christ the Redeemer |
| buenos-aires | Buenos Aires | AR | Obelisco |
| tokyo | Tokyo | JP | Tokyo Tower / Shibuya |
| beijing | Beijing | CN | Forbidden City |
| shanghai | Shanghai | CN | Pudong skyline |
| seoul | Seoul | KR | N Seoul Tower |
| singapore | Singapore | SG | Marina Bay Sands |
| bangkok | Bangkok | TH | Wat Arun |
| mumbai | Mumbai | IN | Gateway of India |
| delhi | New Delhi | IN | India Gate |
| kuala-lumpur | Kuala Lumpur | MY | Petronas Towers |
| jakarta | Jakarta | ID | Monas |
| sydney | Sydney | AU | Opera House |
| cape-town | Cape Town | ZA | Table Mountain |
| lagos | Lagos | NG | skyline |
| nairobi | Nairobi | KE | skyline |
| karachi | Karachi | PK | Mazar-e-Quaid |

الأرقام دي نقطة بداية، لو صورة مدينة مش متاحة بجودة كويسة اتخطاها بدل ما تحط صورة وحشة. الأهم إن الأرقام دي تغطي كل قارة.

### 2.3 قواعد الصور
- استخدم الـ helper `commons('File_Name.jpg')` (مع `credit('File_Name.jpg')`) أو `unsplash('<photo-id>')`.
- ممنوع تخمّن أي photo id أو اسم ملف. كل URL لازم تفتحه وتتأكد إنه بيرجع صورة حقيقية قبل ما تضيفه (نفس الكومنت اللي في الملف: "Every URL was checked to resolve to a real image"). الصور لازم تكون من الـ hosts اللي في `ALLOWED_HOSTS` في `app/api/scene/route.ts` (`images.unsplash.com`, `commons.wikimedia.org`, `thumb.wikimedia.org`, `upload.wikimedia.org`). متضيفش host جديد.
- الصورة لازم تبقى ليلية/نهارية مناسبة كخلفية full screen، وجرّب `focus` لو الموضوع مش في النص.

### 2.4 الـ aliases وتجنب التضارب
الـ `findLandmark` بيعمل match بـ startsWith / includes، فخلي بالك:
- الـ aliases القصيرة جدا (أقل من 4 حروف) ممكن تعمل match غلط. مثلا "روما" و "rome" كويسين، لكن متحطش اختصارات زي "NY" أو "LA". حط "new york", "نيويورك", "نيويورك سيتي" لـ new-york.
- في الـ aliases الموجودة، alias `'مصر'` على القاهرة و `'الرياض السعودية'` وغيرهم مقبولين كده. بس تأكد إن مفيش alias جديد يطابق اسم بلد كامل (زي "فرنسا" على باريس) لأن الـ geocode بيرجع مدن مش دول.
- ضيف لكل مدينة الاسم بالعربي والإنجليزي والألماني والروسي والإيطالي (الأسماء المترجمة بتتجمع تلقائي من `LANDMARK_I18N` في `normalized`، فكفاية تملأ الجدول في الخطوة 3).
- لو اسم مدينة موجودة في أكتر من بلد (Alexandria, London في أونتاريو، Paris في تكساس...)، الـ match بالاسم بس ممكن يعرض صورة المدينة الشهيرة لمدينة تانية بنفس الاسم. عشان كده في `app/page.tsx` (راجع الخطوة 5) اتأكد إن الـ landmark بيتطبق بس لو `countryCode` بتاع النتيجة بيساوي `countryCode` بتاع الـ landmark (لما يكون موجود).

### 2.5 `FEATURED_IDS` (الـ chips)
دلوقتي: `['cairo', 'dubai', 'riyadh', 'makkah', 'alexandria', 'doha']`. غيّرها لمزيج عالمي، وخليها 8 بدل 6:
```ts
export const FEATURED_IDS = ['cairo', 'dubai', 'london', 'paris', 'new-york', 'tokyo', 'istanbul', 'sydney'];
```
وفي `app/page.tsx` سطر 119 فيه `FEATURED_LANDMARKS.slice(0, 6)`، غيّره لـ `slice(0, 8)` (أو شيل الـ slice لو الـ layout بيسمح). اتأكد إن الـ chips بتلف على سطرين كويس على موبايل 360px.

### 2.6 الـ Fallback scene
- `FALLBACK_SCENE.landmark` دلوقتي `'أفق عربي مفتوح'` والـ description بيقول `'مدينة عربية أخرى تحت سماء واحدة...'`. غيّرهم لنص عالمي:
  - landmark: `'أفق مفتوح'`
  - description: `'مدينة أخرى تحت سماء واحدة. لا توجد بعد صورة أرشيفية لهذه المدينة، لكن الطقس هنا حقيقي وحيّ الآن.'`
- الصورة نفسها (desert dune من Unsplash) مش مناسبة لمدينة زي أوسلو. خلّيها صورة محايدة (سماء/أفق/غيوم)، أو الأحسن: اعمل 3 صور fallback حسب خط العرض والـ `Condition`:
  - `|latitude| < 23.5`: مشهد استوائي/ساحلي.
  - بين 23.5 و 55: مدينة/أفق عام.
  - أكتر من 55: مشهد شمالي/جليدي.
  ولو ده كتير، اكتفي بصورة سماء محايدة واحدة. المهم إن الصحرا تتشال كـ default.

---

## 3) `lib/landmark-i18n.ts`: ترجمات المدن الجديدة

- ضيف لكل id جديد (من 2.2) مدخل في `en`, `de`, `ru`, `it` جوه `LANDMARK_I18N` بنفس الشكل `{ city, country, landmark, description }`. الأسماء الرسمية للمدن والدول بكل لغة (مثلا Kairo/Каир/Il Cairo موجودين بالفعل كنموذج).
- في `FALLBACK_I18N` (آخر الملف، سطر ~641) غيّر النص العربي الضمني:
  - en: landmark `'An open horizon'`, description `'Another city under the same sky. There is no archive photo for this place yet, but the weather here is live and real.'`
  - de: `'Ein offener Horizont'` / `'Eine weitere Stadt unter demselben Himmel. Für diesen Ort gibt es noch kein Archivfoto, aber das Wetter hier ist live und echt.'`
  - ru: `'Открытый горизонт'` / `'Ещё один город под одним небом. Для этого места пока нет архивного фото, но погода здесь настоящая и в реальном времени.'`
  - it: `'Un orizzonte aperto'` / `'Un'altra città sotto lo stesso cielo. Non c'è ancora una foto d'archivio per questo posto, ma il meteo qui è reale e in tempo reale.'`
- راجع الـ descriptions الموجودة اللي فيها "Arab" كوصف جغرافي (زي "Arabian Gulf", "heart of Arabia") دي سليمة وملهاش علاقة بالـ branding، سيبها.

---

## 4) `lib/i18n.ts`: الـ branding والنصوص

| key | اللغة | قبل | بعد |
|---|---|---|---|
| tagline | ar | `طقس المدن العربية` | `طقس مدن العالم` |
| tagline | en | `Weather of the Arab world` | `Weather around the world` |
| tagline | de | `Wetter der arabischen Welt` | `Wetter rund um die Welt` |
| tagline | ru | `Погода арабского мира` | `Погода по всему миру` |
| tagline | it | `Il meteo del mondo arabo` | `Il meteo di tutto il mondo` |

- `searchPlaceholder`: بدل الأمثلة العربية بأمثلة عالمية:
  - ar: `ابحث عن مدينة… القاهرة، لندن، طوكيو`
  - en: `Search a city… Cairo, London, Tokyo`
  - de: `Stadt suchen… Kairo, London, Tokio`
  - ru: `Найдите город… Каир, Лондон, Токио`
  - it: `Cerca una città… Il Cairo, Londra, Tokyo`
  (اللغة الروسية والإيطالية، شوف الصيغة الحالية في الملف وحافظ عليها بس غيّر الأسماء).
- `notFound` (ar): `لم نجد «{q}». جرّب اسماً آخر مثل القاهرة أو دبي.` غيّرها لـ `... مثل القاهرة أو لندن.` وعدّل المقابل في باقي اللغات لو فيه أمثلة عربية.
- `popular`: سيبه، نص "الأكثر بحثاً" سليم.
- متغيرش الـ `DEFAULT_LANG` ولا `detectLang`، دي مش branding.

---

## 5) `app/layout.tsx` و `app/page.tsx`

### `app/layout.tsx` (metadata)
- `title`: `'سماء · طقس المدن العربية'` ← `'سماء · طقس مدن العالم'`
- `description`: `'تجربة سينمائية للطقس في المدن العربية: ...'` ← `'تجربة سينمائية للطقس في مدن العالم: كرة أرضية ثلاثية الأبعاد، طقس مباشر، وتوقعات سبعة أيام.'`
- لو فيه `openGraph` أو `twitter` metadata بنفس الكلام عدّلهم.

### `app/page.tsx`
- سطر ~119: `FEATURED_LANDMARKS.slice(0, 6)` ← `slice(0, 8)`.
- أماكن استخدام `findLandmark(...)`: لما النتيجة جاية من الـ geocode (Place له `countryCode`)، اقبل الـ landmark بس لو `place.countryCode` فاضي أو بيساوي `landmark.countryCode`. ده بيمنع "Paris, Texas" من إنها تاخد صورة برج إيفل.
- الـ language-change effect (اللي بيعمل re-resolve) سليم، مفيش تغيير، بس اتأكد إنه شغال مع المدن الجديدة (curatedId + `placeFromLandmark`).
- التأكد إن الـ fallback بتاع المدن اللي ملهاش landmark بيستخدم `fallbackSceneText(lang)` الجديد.

---

## 6) `components/GlobeScene.tsx` و `components/GlobeStage.tsx`

- `GlobeScene` بيرسم نقط لكل `LANDMARKS`، فهتتوزع على العالم تلقائيا بعد الإضافة. اتأكد إن عدد النقط (~52) مش بيبطّئ الـ globe على موبايل، ولو بطّأ قلل حجم النقطة أو ارسم الـ `FEATURED` بس.
- اتأكد من إن الـ `flyTo` شغال لأي lat/lng (نصف الكرة الغربي والجنوبي كمان). مفيش افتراض لإحداثيات عربية في الكود اللي قريته، لكن جرّب فعليا طوكيو وريو ونيويورك.

---

## 7) `lib/timezones.ts`: تغطية الدول

`COUNTRY_TZ` فيه حوالي 50 دولة وهو بيُستخدم بس لما العميل ما يبعتش timezone (fallback providers). دولة ناقصة هتروح على `tzForLongitude` اللي بتدي offset ثابت من غير DST (غلط في الصيف/الشتا).

- ضيف الدول الناقصة بالأهمية (كل دولة بمنطقة واحدة، والدول متعددة المناطق زي US/CA/BR/AU/RU/MX/ID/CN ملاحظتها أدناه): `MX: 'America/Mexico_City'`, `AR: 'America/Argentina/Buenos_Aires'`, `CL: 'America/Santiago'`, `CO: 'America/Bogota'`, `PE: 'America/Lima'`, `VE: 'America/Caracas'`, `NZ: 'Pacific/Auckland'`, `PH: 'Asia/Manila'`, `VN: 'Asia/Ho_Chi_Minh'`, `BD: 'Asia/Dhaka'`, `LK: 'Asia/Colombo'`, `NP: 'Asia/Kathmandu'`, `AF: 'Asia/Kabul'`, `KZ: 'Asia/Almaty'`, `UZ: 'Asia/Tashkent'`, `IL: 'Asia/Jerusalem'`, `CH: 'Europe/Zurich'`, `AT: 'Europe/Vienna'`, `BE: 'Europe/Brussels'`, `DK: 'Europe/Copenhagen'`, `FI: 'Europe/Helsinki'`, `CZ: 'Europe/Prague'`, `HU: 'Europe/Budapest'`, `RO: 'Europe/Bucharest'`, `BG: 'Europe/Sofia'`, `RS: 'Europe/Belgrade'`, `HR: 'Europe/Zagreb'`, `IS: 'Atlantic/Reykjavik'`, `GH: 'Africa/Accra'`, `SN: 'Africa/Dakar'`, `TZ: 'Africa/Dar_es_Salaam'`, `UG: 'Africa/Kampala'`, `AO: 'Africa/Luanda'`, `CU: 'America/Havana'`.
- الدول المتعددة المناطق (US, CA, BR, AU, RU, MX, ID, CN, KZ): الـ fallback بالدولة ممكن يديك timezone غلط لمدن بعيدة (لوس أنجلوس هتاخد New_York). الحل الأفضل: في `app/api/weather/route.ts` و `lib/weather.ts` اعتمد على الـ `timezone` اللي بيرجع من Open-Meteo في الرد (`timezone=auto`) وهو الأساسي، واستخدم `tzForCountry` بس لما الـ upstream ما يرجعش timezone (MET Norway fallback). في الحالة دي، لو الدولة متعددة المناطق، استخدم `tzForLongitude` أو ابعت `tz` من العميل (الـ client بيعرف الـ IANA zone من Open-Meteo geocoding، ومعاه حقل `timezone` في الـ geocoding response، فممكن نضيفه لـ `Place` ونمرره). ضيف `timezone?: string` للـ `Place` في `lib/types.ts` واملاه من `item.timezone` في `geocode/route.ts`، وابعته في الـ params للـ weather request كـ `tz` (اتأكد إن `isIanaZone` بتتحقق منه).
- الـ User-Agent في `lib/weather.ts` (سطر ~244) فيه `'Arabic weather scenes'`، غيّره لـ `'SamaaWeather/1.0 (cinematic weather scenes; ...)'`.

---

## 8) Docs

- `README.md` سطر 3: `cinematic weather experience for Arab cities` ← `for cities around the world`.
- `AGENTS.md` سطر 3: `for Arab cities` ← `for cities worldwide`. ضيف سطر: "Curated landmarks cover major cities on every continent; any other city falls back to the neutral scene."
- `README.md` سطر ~98 ("Cities without an entry still work — they fall back to a desert-dune scene") عدّله للـ fallback الجديد.
- سطر 9 في الـ README لو بيذكر ترتيب عربي في البحث، شيله.

---

## Acceptance checklist (شغّلها قبل ما تقول خلصت)

1. `npx tsc --noEmit` و `npm run build` بيعدّوا.
2. بحث عن "Tokyo" و "London" و "New York" و "São Paulo" و "Sydney" بيطلع النتيجة الصح أول واحدة، والمشهد بتاعها بيفتح بصورة حقيقية.
3. بحث عن "Alexandria" لسه بيدي الإسكندرية، وبحث عن "Paris" بيدي باريس فرنسا قبل Paris, Texas.
4. مدينة من غير landmark (مثلا "Oslo" أو "Lima") بتفتح مشهد fallback محايد من غير كلمة "عربي".
5. الشروق والغروب لطوكيو ونيويورك وسيدني بتظهر بتوقيتهم المحلي (مش توقيت القاهرة).
6. تغيير اللغة جوه مشهد مدينة جديدة (مثلا Tokyo) بيترجم الاسم في الخمس لغات.
7. `grep -ri "arab\|عرب" app components lib README.md AGENTS.md` ملوش نتايج في الـ branding/copy. المسموح بس: `normalizeArabic` والـ subset `'arabic'` للخط، وكلمات زي "Arabian Gulf" في أوصاف المدن العربية، وقائمة اللغات.
8. الـ chips بتظهر 8 مدن عالمية من غير overflow على شاشة 360px.
