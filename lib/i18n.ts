export type Lang = 'ar' | 'en' | 'de' | 'ru' | 'it';

export const LANGS: { code: Lang; native: string; dir: 'rtl' | 'ltr'; locale: string }[] = [
  { code: 'ar', native: 'العربية', dir: 'rtl', locale: 'ar-u-nu-latn' },
  { code: 'en', native: 'English', dir: 'ltr', locale: 'en-GB' },
  { code: 'de', native: 'Deutsch', dir: 'ltr', locale: 'de-DE' },
  { code: 'ru', native: 'Русский', dir: 'ltr', locale: 'ru-RU' },
  { code: 'it', native: 'Italiano', dir: 'ltr', locale: 'it-IT' },
];

export const DEFAULT_LANG: Lang = 'ar';

export function langMeta(lang: Lang) {
  return LANGS.find((item) => item.code === lang) ?? LANGS[0];
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && LANGS.some((item) => item.code === value);
}

const UI_KEYS = [
  'brand',
  'tagline',
  'heroTitle',
  'heroSubtitle',
  'searchPlaceholder',
  'searchButton',
  'searchAria',
  'popular',
  'footerNote',
  'flying',
  'notFound',
  'geocodeError',
  'weatherError',
  'genericError',
  'retry',
  'back',
  'sceneEyebrow',
  'humidity',
  'wind',
  'rain',
  'sunset',
  'sunrise',
  'feelsLike',
  'localTime',
  'forecastTitle',
  'forecastHint',
  'today',
  'dataLabel',
  'imageLabel',
  'dragHint',
  'soundOn',
  'soundOff',
  'language',
  'live',
  'windUnit',
] as const;

export type UiKey = (typeof UI_KEYS)[number];
type Dict = Record<UiKey, string>;

const ar: Dict = {
  brand: 'سماء',
  tagline: 'طقس مدن العالم',
  heroTitle: 'إلى أين نسافر اليوم؟',
  heroSubtitle: 'اكتب اسم مدينة، وستحلّق الكرة الأرضية إلى مشهدها.',
  searchPlaceholder: 'ابحث عن مدينة… القاهرة، لندن، طوكيو',
  searchButton: 'استكشف',
  searchAria: 'ابحث عن مدينة',
  popular: 'الأكثر بحثاً',
  footerNote: 'اسحب الكرة لتدويرها · البيانات من Open-Meteo · الصور من Unsplash وويكيميديا كومنز',
  flying: 'جارٍ التحليق إلى {city}…',
  notFound: 'لم نجد «{q}». جرّب اسماً آخر مثل القاهرة أو لندن.',
  geocodeError: 'تعذّر الوصول إلى خدمة البحث عن المدن',
  weatherError: 'تعذّر جلب بيانات الطقس',
  genericError: 'حدث خطأ غير متوقع',
  retry: 'حاول مرة أخرى',
  back: 'رجوع',
  sceneEyebrow: 'مشهد اليوم',
  humidity: 'الرطوبة',
  wind: 'الرياح',
  rain: 'المطر',
  sunset: 'الغروب',
  sunrise: 'الشروق',
  feelsLike: 'يُحسّ كـ {t}°',
  localTime: 'التوقيت المحلي',
  forecastTitle: 'توقعات سبعة أيام',
  forecastHint: 'العظمى والصغرى',
  today: 'اليوم',
  dataLabel: 'البيانات',
  imageLabel: 'الصورة',
  dragHint: 'اسحب للأعلى للتفاصيل',
  soundOn: 'إيقاف الصوت',
  soundOff: 'تشغيل الصوت',
  language: 'اللغة',
  live: 'مباشر',
  windUnit: 'كم/س',
};

const en: Dict = {
  brand: 'Samaa',
  tagline: 'Weather around the world',
  heroTitle: 'Where shall we fly today?',
  heroSubtitle: 'Type a city and the globe will fly to its scene.',
  searchPlaceholder: 'Search a city… Cairo, London, Tokyo',
  searchButton: 'Explore',
  searchAria: 'Search for a city',
  popular: 'Most searched',
  footerNote: 'Drag the globe to spin it · Data by Open-Meteo · Photos by Unsplash and Wikimedia Commons',
  flying: 'Flying to {city}…',
  notFound: 'We could not find “{q}”. Try another name, like Cairo or London.',
  geocodeError: 'The city search service is unreachable',
  weatherError: 'Weather data could not be loaded',
  genericError: 'Something went wrong',
  retry: 'Try again',
  back: 'Back',
  sceneEyebrow: 'Today’s scene',
  humidity: 'Humidity',
  wind: 'Wind',
  rain: 'Rain',
  sunset: 'Sunset',
  sunrise: 'Sunrise',
  feelsLike: 'Feels like {t}°',
  localTime: 'Local time',
  forecastTitle: 'Seven-day forecast',
  forecastHint: 'High and low',
  today: 'Today',
  dataLabel: 'Data',
  imageLabel: 'Photo',
  dragHint: 'Swipe up for details',
  soundOn: 'Mute sound',
  soundOff: 'Play sound',
  language: 'Language',
  live: 'Live',
  windUnit: 'km/h',
};

const de: Dict = {
  brand: 'Samaa',
  tagline: 'Wetter rund um die Welt',
  heroTitle: 'Wohin fliegen wir heute?',
  heroSubtitle: 'Gib eine Stadt ein, und der Globus fliegt zu ihrer Kulisse.',
  searchPlaceholder: 'Stadt suchen… Kairo, London, Tokio',
  searchButton: 'Entdecken',
  searchAria: 'Nach einer Stadt suchen',
  popular: 'Beliebteste',
  footerNote: 'Globus zum Drehen ziehen · Daten von Open-Meteo · Fotos von Unsplash und Wikimedia Commons',
  flying: 'Flug nach {city}…',
  notFound: '„{q}“ wurde nicht gefunden. Versuche einen anderen Namen, etwa Kairo oder London.',
  geocodeError: 'Der Städtesuchdienst ist nicht erreichbar',
  weatherError: 'Wetterdaten konnten nicht geladen werden',
  genericError: 'Etwas ist schiefgelaufen',
  retry: 'Erneut versuchen',
  back: 'Zurück',
  sceneEyebrow: 'Szene des Tages',
  humidity: 'Feuchte',
  wind: 'Wind',
  rain: 'Regen',
  sunset: 'Sonnenuntergang',
  sunrise: 'Sonnenaufgang',
  feelsLike: 'Gefühlt {t}°',
  localTime: 'Ortszeit',
  forecastTitle: 'Sieben-Tage-Vorhersage',
  forecastHint: 'Höchst- und Tiefstwerte',
  today: 'Heute',
  dataLabel: 'Daten',
  imageLabel: 'Foto',
  dragHint: 'Nach oben wischen für Details',
  soundOn: 'Ton aus',
  soundOff: 'Ton an',
  language: 'Sprache',
  live: 'Live',
  windUnit: 'km/h',
};

const ru: Dict = {
  brand: 'Samaa',
  tagline: 'Погода по всему миру',
  heroTitle: 'Куда полетим сегодня?',
  heroSubtitle: 'Введите город — и глобус полетит к его сцене.',
  searchPlaceholder: 'Найдите город… Каир, Лондон, Токио',
  searchButton: 'Вперёд',
  searchAria: 'Поиск города',
  popular: 'Популярное',
  footerNote: 'Потяните глобус, чтобы вращать · Данные Open-Meteo · Фото Unsplash и Wikimedia Commons',
  flying: 'Летим в {city}…',
  notFound: 'Не удалось найти «{q}». Попробуйте другое название, например Каир или Лондон.',
  geocodeError: 'Сервис поиска городов недоступен',
  weatherError: 'Не удалось загрузить данные о погоде',
  genericError: 'Что-то пошло не так',
  retry: 'Повторить',
  back: 'Назад',
  sceneEyebrow: 'Сцена дня',
  humidity: 'Влажность',
  wind: 'Ветер',
  rain: 'Дождь',
  sunset: 'Закат',
  sunrise: 'Рассвет',
  feelsLike: 'Ощущается как {t}°',
  localTime: 'Местное время',
  forecastTitle: 'Прогноз на семь дней',
  forecastHint: 'Максимум и минимум',
  today: 'Сегодня',
  dataLabel: 'Данные',
  imageLabel: 'Фото',
  dragHint: 'Смахните вверх для деталей',
  soundOn: 'Выключить звук',
  soundOff: 'Включить звук',
  language: 'Язык',
  live: 'Онлайн',
  windUnit: 'км/ч',
};

const it: Dict = {
  brand: 'Samaa',
  tagline: 'Il meteo di tutto il mondo',
  heroTitle: 'Dove voliamo oggi?',
  heroSubtitle: 'Scrivi una città e il globo volerà alla sua scena.',
  searchPlaceholder: 'Cerca una città… Il Cairo, Londra, Tokyo',
  searchButton: 'Esplora',
  searchAria: 'Cerca una città',
  popular: 'Più cercate',
  footerNote: 'Trascina il globo per ruotarlo · Dati di Open-Meteo · Foto di Unsplash e Wikimedia Commons',
  flying: 'Volo verso {city}…',
  notFound: 'Non abbiamo trovato «{q}». Prova un altro nome, come Il Cairo o Londra.',
  geocodeError: 'Il servizio di ricerca città non è raggiungibile',
  weatherError: 'Impossibile caricare i dati meteo',
  genericError: 'Qualcosa è andato storto',
  retry: 'Riprova',
  back: 'Indietro',
  sceneEyebrow: 'Scena del giorno',
  humidity: 'Umidità',
  wind: 'Vento',
  rain: 'Pioggia',
  sunset: 'Tramonto',
  sunrise: 'Alba',
  feelsLike: 'Percepiti {t}°',
  localTime: 'Ora locale',
  forecastTitle: 'Previsioni a sette giorni',
  forecastHint: 'Massime e minime',
  today: 'Oggi',
  dataLabel: 'Dati',
  imageLabel: 'Foto',
  dragHint: 'Scorri verso l’alto per i dettagli',
  soundOn: 'Disattiva audio',
  soundOff: 'Attiva audio',
  language: 'Lingua',
  live: 'Live',
  windUnit: 'km/h',
};

export const DICT: Record<Lang, Dict> = { ar, en, de, ru, it };

export function t(lang: Lang, key: UiKey, vars?: Record<string, string | number>): string {
  const template = DICT[lang][key] ?? DICT.ar[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export type ConditionKey =
  | 'clear'
  | 'mainlyClear'
  | 'partly'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rainLight'
  | 'rain'
  | 'rainHeavy'
  | 'freezingRain'
  | 'snowLight'
  | 'snow'
  | 'snowHeavy'
  | 'showers'
  | 'thunder'
  | 'thunderHail'
  | 'variable';

const CONDITIONS: Record<Lang, Record<ConditionKey, string>> = {
  ar: {
    clear: 'سماء صافية',
    mainlyClear: 'صافٍ غالباً',
    partly: 'غيوم متفرقة',
    overcast: 'غائم',
    fog: 'ضباب',
    drizzle: 'رذاذ',
    rainLight: 'مطر خفيف',
    rain: 'مطر',
    rainHeavy: 'مطر غزير',
    freezingRain: 'مطر متجمّد',
    snowLight: 'ثلج خفيف',
    snow: 'ثلج',
    snowHeavy: 'ثلج كثيف',
    showers: 'زخات مطر',
    thunder: 'عاصفة رعدية',
    thunderHail: 'عاصفة رعدية مع برد',
    variable: 'طقس متغيّر',
  },
  en: {
    clear: 'Clear sky',
    mainlyClear: 'Mostly clear',
    partly: 'Partly cloudy',
    overcast: 'Overcast',
    fog: 'Fog',
    drizzle: 'Drizzle',
    rainLight: 'Light rain',
    rain: 'Rain',
    rainHeavy: 'Heavy rain',
    freezingRain: 'Freezing rain',
    snowLight: 'Light snow',
    snow: 'Snow',
    snowHeavy: 'Heavy snow',
    showers: 'Showers',
    thunder: 'Thunderstorm',
    thunderHail: 'Thunderstorm with hail',
    variable: 'Changeable weather',
  },
  de: {
    clear: 'Klarer Himmel',
    mainlyClear: 'Überwiegend klar',
    partly: 'Teilweise bewölkt',
    overcast: 'Bedeckt',
    fog: 'Nebel',
    drizzle: 'Nieselregen',
    rainLight: 'Leichter Regen',
    rain: 'Regen',
    rainHeavy: 'Starker Regen',
    freezingRain: 'Gefrierender Regen',
    snowLight: 'Leichter Schneefall',
    snow: 'Schneefall',
    snowHeavy: 'Starker Schneefall',
    showers: 'Regenschauer',
    thunder: 'Gewitter',
    thunderHail: 'Gewitter mit Hagel',
    variable: 'Wechselhaft',
  },
  ru: {
    clear: 'Ясно',
    mainlyClear: 'Преимущественно ясно',
    partly: 'Переменная облачность',
    overcast: 'Пасмурно',
    fog: 'Туман',
    drizzle: 'Морось',
    rainLight: 'Небольшой дождь',
    rain: 'Дождь',
    rainHeavy: 'Сильный дождь',
    freezingRain: 'Ледяной дождь',
    snowLight: 'Небольшой снег',
    snow: 'Снег',
    snowHeavy: 'Сильный снег',
    showers: 'Ливни',
    thunder: 'Гроза',
    thunderHail: 'Гроза с градом',
    variable: 'Переменная погода',
  },
  it: {
    clear: 'Cielo sereno',
    mainlyClear: 'Prevalentemente sereno',
    partly: 'Parzialmente nuvoloso',
    overcast: 'Coperto',
    fog: 'Nebbia',
    drizzle: 'Pioviggine',
    rainLight: 'Pioggia debole',
    rain: 'Pioggia',
    rainHeavy: 'Pioggia intensa',
    freezingRain: 'Pioggia gelata',
    snowLight: 'Neve debole',
    snow: 'Neve',
    snowHeavy: 'Neve intensa',
    showers: 'Rovesci',
    thunder: 'Temporale',
    thunderHail: 'Temporale con grandine',
    variable: 'Meteo variabile',
  },
};

export function conditionLabel(lang: Lang, key: ConditionKey): string {
  return CONDITIONS[lang][key];
}

const COMPASS: Record<Lang, [string, string, string, string, string, string, string, string]> = {
  ar: ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'],
  en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
  ru: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'],
  it: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
};

export function compassLabel(lang: Lang, degrees: number): string {
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return COMPASS[lang][index];
}

export function localeOf(lang: Lang): string {
  return langMeta(lang).locale;
}

export function dirOf(lang: Lang): 'rtl' | 'ltr' {
  return langMeta(lang).dir;
}

export function isRtl(lang: Lang): boolean {
  return dirOf(lang) === 'rtl';
}

/** Picks the browser's preferred language when it is one we support. */
/** Picks a supported language from an Accept-Language header, honouring q-weights. */
export function fromAcceptLanguage(header?: string | null): Lang | null {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, weight] = part.trim().split(';q=');
      return { tag: (tag ?? '').trim().toLowerCase(), weight: weight ? Number(weight) : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.weight - a.weight);

  for (const entry of ranked) {
    const base = entry.tag.split('-')[0];
    if (isLang(base)) return base;
  }
  return null;
}

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const stored = window.localStorage.getItem('samaa:lang');
  if (isLang(stored)) return stored;
  for (const candidate of navigator.languages ?? [navigator.language]) {
    const base = candidate.split('-')[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}
