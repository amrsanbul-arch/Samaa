import type { Lang } from './i18n';
import type { PhotoCredit, ThemeName } from './types';
import { PHOTO_CREDITS } from './photo-credits';

/**
 * The city catalogue behind every landing scene: one object per curated place, with
 * its landmark photo, IANA time zone, coordinates and copy in all five languages.
 *
 * To add a country, append one object to `COUNTRIES` (and its name to `COUNTRY_NAMES`
 * if the country is new) — nothing else needs to change. Countries with several
 * scenes (Egypt, Saudi Arabia, the US, China, India) simply have several entries.
 *
 * `timezone` is the landmark city's zone, not the country's: the US, Canada, Brazil,
 * Mexico and Australia span several, and sunrise/sunset depend on getting it right.
 */

export type SceneText = {
  city: string;
  landmark: string;
  description: string;
};

export type CountryName = Record<Lang, string>;

export type CountryScene = {
  id: string;
  countryCode: string;
  /** IANA zone of the landmark city. */
  timezone: string;
  latitude: number;
  longitude: number;
  image: string;
  credit: PhotoCredit;
  aliases: string[];
  copy: Record<Lang, SceneText>;
  /** Marks a capital city, so the card can say «Capital of …» instead of the bare country. */
  capital?: boolean;
  /** CSS object-position used to keep the subject in frame on tall screens. */
  focus?: string;
  /** Extra zoom on tall screens, anchored at the bottom so low subjects stay visible. */
  zoom?: number;
  theme?: ThemeName;
};

// File names arrive either percent-encoded or plain, so both helpers normalise to the
// decoded name first: the credits map and the file page URL are keyed by that name.
const fileName = (path: string) => {
  const raw = path.split('/').pop() ?? path;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

// Special:FilePath resolves to the canonical thumbnail for any file name, so the
// stored paths cannot drift out of sync with Wikimedia's hash directories.
export const commons = (path: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName(path))}?width=${width}`;

const DEFAULT_CHANGES =
  "Resized to 1600 px wide by the site's image proxy; cropped to fill the screen. No other changes.";

/**
 * Builds the attribution for a Commons file from the verified metadata in
 * `photo-credits.ts`. Unknown files still link to their source page rather than
 * inventing a photographer.
 */
export const credit = (file: string): PhotoCredit => {
  const name = fileName(file);
  const meta = PHOTO_CREDITS[name];
  return {
    photographer: meta?.photographer ?? 'Wikimedia Commons contributor',
    license: meta?.license ?? 'See source page',
    licenseUrl: meta?.licenseUrl,
    source: 'Wikimedia Commons',
    url: meta?.url ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,
    changes: meta?.changes ?? DEFAULT_CHANGES,
    label: meta ? `${meta.photographer} · ${meta.license}` : 'Wikimedia Commons',
  };
};

/** Localised country names, keyed by ISO 3166-1 alpha-2 code. */
export const COUNTRY_NAMES: Record<string, CountryName> = {
  BD: { ar: 'بنغلاديش', en: 'Bangladesh', de: 'Bangladesch', ru: 'Бангладеш', it: 'Bangladesh' },
  LK: { ar: 'سريلانكا', en: 'Sri Lanka', de: 'Sri Lanka', ru: 'Шри-Ланка', it: 'Sri Lanka' },
  NP: { ar: 'نيبال', en: 'Nepal', de: 'Nepal', ru: 'Непал', it: 'Nepal' },
  BT: { ar: 'بوتان', en: 'Bhutan', de: 'Bhutan', ru: 'Бутан', it: 'Bhutan' },
  MV: { ar: 'المالديف', en: 'Maldives', de: 'Malediven', ru: 'Мальдивы', it: 'Maldive' },
  MM: { ar: 'ميانمار', en: 'Myanmar', de: 'Myanmar', ru: 'Мьянма', it: 'Myanmar' },
  LA: { ar: 'لاوس', en: 'Laos', de: 'Laos', ru: 'Лаос', it: 'Laos' },
  MN: { ar: 'منغوليا', en: 'Mongolia', de: 'Mongolei', ru: 'Монголия', it: 'Mongolia' },
  KZ: { ar: 'كازاخستان', en: 'Kazakhstan', de: 'Kasachstan', ru: 'Казахстан', it: 'Kazakistan' },
  UZ: { ar: 'أوزبكستان', en: 'Uzbekistan', de: 'Usbekistan', ru: 'Узбекистан', it: 'Uzbekistan' },
  KG: { ar: 'قيرغيزستان', en: 'Kyrgyzstan', de: 'Kirgisistan', ru: 'Киргизия', it: 'Kirghizistan' },
  TJ: { ar: 'طاجيكستان', en: 'Tajikistan', de: 'Tadschikistan', ru: 'Таджикистан', it: 'Tagikistan' },
  TM: { ar: 'تركمانستان', en: 'Turkmenistan', de: 'Turkmenistan', ru: 'Туркменистан', it: 'Turkmenistan' },
  AZ: { ar: 'أذربيجان', en: 'Azerbaijan', de: 'Aserbaidschan', ru: 'Азербайджан', it: 'Azerbaigian' },
  AM: { ar: 'أرمينيا', en: 'Armenia', de: 'Armenien', ru: 'Армения', it: 'Armenia' },
  GE: { ar: 'جورجيا', en: 'Georgia', de: 'Georgien', ru: 'Грузия', it: 'Georgia' },
  UA: { ar: 'أوكرانيا', en: 'Ukraine', de: 'Ukraine', ru: 'Украина', it: 'Ucraina' },
  RO: { ar: 'رومانيا', en: 'Romania', de: 'Rumänien', ru: 'Румыния', it: 'Romania' },
  BG: { ar: 'بلغاريا', en: 'Bulgaria', de: 'Bulgarien', ru: 'Болгария', it: 'Bulgaria' },
  RS: { ar: 'صربيا', en: 'Serbia', de: 'Serbien', ru: 'Сербия', it: 'Serbia' },
  EG: { ar: 'مصر', en: 'Egypt', de: 'Ägypten', ru: 'Египет', it: 'Egitto' },
  DZ: { ar: 'الجزائر', en: 'Algeria', de: 'Algerien', ru: 'Алжир', it: 'Algeria' },
  SD: { ar: 'السودان', en: 'Sudan', de: 'Sudan', ru: 'Судан', it: 'Sudan' },
  AE: { ar: 'الإمارات', en: 'United Arab Emirates', de: 'Vereinigte Arabische Emirate', ru: 'ОАЭ', it: 'Emirati Arabi Uniti' },
  SA: { ar: 'السعودية', en: 'Saudi Arabia', de: 'Saudi-Arabien', ru: 'Саудовская Аравия', it: 'Arabia Saudita' },
  QA: { ar: 'قطر', en: 'Qatar', de: 'Katar', ru: 'Катар', it: 'Qatar' },
  KW: { ar: 'الكويت', en: 'Kuwait', de: 'Kuwait', ru: 'Кувейт', it: 'Kuwait' },
  BH: { ar: 'البحرين', en: 'Bahrain', de: 'Bahrain', ru: 'Бахрейн', it: 'Bahrein' },
  OM: { ar: 'عُمان', en: 'Oman', de: 'Oman', ru: 'Оман', it: 'Oman' },
  JO: { ar: 'الأردن', en: 'Jordan', de: 'Jordanien', ru: 'Иордания', it: 'Giordania' },
  LB: { ar: 'لبنان', en: 'Lebanon', de: 'Libanon', ru: 'Ливан', it: 'Libano' },
  SY: { ar: 'سوريا', en: 'Syria', de: 'Syrien', ru: 'Сирия', it: 'Siria' },
  IQ: { ar: 'العراق', en: 'Iraq', de: 'Irak', ru: 'Ирак', it: 'Iraq' },
  MA: { ar: 'المغرب', en: 'Morocco', de: 'Marokko', ru: 'Марокко', it: 'Marocco' },
  TN: { ar: 'تونس', en: 'Tunisia', de: 'Tunesien', ru: 'Тунис', it: 'Tunisia' },
  YE: { ar: 'اليمن', en: 'Yemen', de: 'Jemen', ru: 'Йемен', it: 'Yemen' },
  GB: { ar: 'المملكة المتحدة', en: 'United Kingdom', de: 'Vereinigtes Königreich', ru: 'Великобритания', it: 'Regno Unito' },
  FR: { ar: 'فرنسا', en: 'France', de: 'Frankreich', ru: 'Франция', it: 'Francia' },
  IT: { ar: 'إيطاليا', en: 'Italy', de: 'Italien', ru: 'Италия', it: 'Italia' },
  TR: { ar: 'تركيا', en: 'Türkiye', de: 'Türkei', ru: 'Турция', it: 'Turchia' },
  DE: { ar: 'ألمانيا', en: 'Germany', de: 'Deutschland', ru: 'Германия', it: 'Germania' },
  ES: { ar: 'إسبانيا', en: 'Spain', de: 'Spanien', ru: 'Испания', it: 'Spagna' },
  RU: { ar: 'روسيا', en: 'Russia', de: 'Russland', ru: 'Россия', it: 'Russia' },
  NL: { ar: 'هولندا', en: 'Netherlands', de: 'Niederlande', ru: 'Нидерланды', it: 'Paesi Bassi' },
  CH: { ar: 'سويسرا', en: 'Switzerland', de: 'Schweiz', ru: 'Швейцария', it: 'Svizzera' },
  AT: { ar: 'النمسا', en: 'Austria', de: 'Österreich', ru: 'Австрия', it: 'Austria' },
  PT: { ar: 'البرتغال', en: 'Portugal', de: 'Portugal', ru: 'Португалия', it: 'Portogallo' },
  PE: { ar: 'بيرو', en: 'Peru', de: 'Peru', ru: 'Перу', it: 'Perù' },
  CZ: { ar: 'التشيك', en: 'Czechia', de: 'Tschechien', ru: 'Чехия', it: 'Cechia' },
  HU: { ar: 'المجر', en: 'Hungary', de: 'Ungarn', ru: 'Венгрия', it: 'Ungheria' },
  PL: { ar: 'بولندا', en: 'Poland', de: 'Polen', ru: 'Польша', it: 'Polonia' },
  IE: { ar: 'أيرلندا', en: 'Ireland', de: 'Irland', ru: 'Ирландия', it: 'Irlanda' },
  BE: { ar: 'بلجيكا', en: 'Belgium', de: 'Belgien', ru: 'Бельгия', it: 'Belgio' },
  SE: { ar: 'السويد', en: 'Sweden', de: 'Schweden', ru: 'Швеция', it: 'Svezia' },
  NO: { ar: 'النرويج', en: 'Norway', de: 'Norwegen', ru: 'Норвегия', it: 'Norvegia' },
  GR: { ar: 'اليونان', en: 'Greece', de: 'Griechenland', ru: 'Греция', it: 'Grecia' },
  US: { ar: 'الولايات المتحدة', en: 'United States', de: 'Vereinigte Staaten', ru: 'США', it: 'Stati Uniti' },
  CA: { ar: 'كندا', en: 'Canada', de: 'Kanada', ru: 'Канада', it: 'Canada' },
  MX: { ar: 'المكسيك', en: 'Mexico', de: 'Mexiko', ru: 'Мексика', it: 'Messico' },
  BR: { ar: 'البرازيل', en: 'Brazil', de: 'Brasilien', ru: 'Бразилия', it: 'Brasile' },
  AR: { ar: 'الأرجنتين', en: 'Argentina', de: 'Argentinien', ru: 'Аргентина', it: 'Argentina' },
  JP: { ar: 'اليابان', en: 'Japan', de: 'Japan', ru: 'Япония', it: 'Giappone' },
  CN: { ar: 'الصين', en: 'China', de: 'China', ru: 'Китай', it: 'Cina' },
  KR: { ar: 'كوريا الجنوبية', en: 'South Korea', de: 'Südkorea', ru: 'Южная Корея', it: 'Corea del Sud' },
  SG: { ar: 'سنغافورة', en: 'Singapore', de: 'Singapur', ru: 'Сингапур', it: 'Singapore' },
  TH: { ar: 'تايلاند', en: 'Thailand', de: 'Thailand', ru: 'Таиланд', it: 'Thailandia' },
  IN: { ar: 'الهند', en: 'India', de: 'Indien', ru: 'Индия', it: 'India' },
  MY: { ar: 'ماليزيا', en: 'Malaysia', de: 'Malaysia', ru: 'Малайзия', it: 'Malesia' },
  ID: { ar: 'إندونيسيا', en: 'Indonesia', de: 'Indonesien', ru: 'Индонезия', it: 'Indonesia' },
  AU: { ar: 'أستراليا', en: 'Australia', de: 'Australien', ru: 'Австралия', it: 'Australia' },
  ZA: { ar: 'جنوب أفريقيا', en: 'South Africa', de: 'Südafrika', ru: 'ЮАР', it: 'Sudafrica' },
  NG: { ar: 'نيجيريا', en: 'Nigeria', de: 'Nigeria', ru: 'Нигерия', it: 'Nigeria' },
  KE: { ar: 'كينيا', en: 'Kenya', de: 'Kenia', ru: 'Кения', it: 'Kenya' },
  PK: { ar: 'باكستان', en: 'Pakistan', de: 'Pakistan', ru: 'Пакистан', it: 'Pakistan' },
  DK: { ar: 'الدنمارك', en: 'Denmark', de: 'Dänemark', ru: 'Дания', it: 'Danimarca' },
  FI: { ar: 'فنلندا', en: 'Finland', de: 'Finnland', ru: 'Финляндия', it: 'Finlandia' },
  IS: { ar: 'آيسلندا', en: 'Iceland', de: 'Island', ru: 'Исландия', it: 'Islanda' },
  HR: { ar: 'كرواتيا', en: 'Croatia', de: 'Kroatien', ru: 'Хорватия', it: 'Croazia' },
  VN: { ar: 'فيتنام', en: 'Vietnam', de: 'Vietnam', ru: 'Вьетнам', it: 'Vietnam' },
  KH: { ar: 'كمبوديا', en: 'Cambodia', de: 'Kambodscha', ru: 'Камбоджа', it: 'Cambogia' },
  PH: { ar: 'الفلبين', en: 'Philippines', de: 'Philippinen', ru: 'Филиппины', it: 'Filippine' },
  NZ: { ar: 'نيوزيلندا', en: 'New Zealand', de: 'Neuseeland', ru: 'Новая Зеландия', it: 'Nuova Zelanda' },
  CL: { ar: 'تشيلي', en: 'Chile', de: 'Chile', ru: 'Чили', it: 'Cile' },
  CO: { ar: 'كولومبيا', en: 'Colombia', de: 'Kolumbien', ru: 'Колумбия', it: 'Colombia' },
  IL: { ar: 'إسرائيل', en: 'Israel', de: 'Israel', ru: 'Израиль', it: 'Israele' },
  PS: { ar: 'فلسطين', en: 'Palestine', de: 'Palästina', ru: 'Палестина', it: 'Palestina' },
  IR: { ar: 'إيران', en: 'Iran', de: 'Iran', ru: 'Иран', it: 'Iran' },
};

export const COUNTRIES: CountryScene[] = [
  {
    id: 'cairo',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    image: commons('Cairo%20Tower%20and%20Qasr%20El%20Nil%20Bridge.jpg'),
    credit: credit('Cairo%20Tower%20and%20Qasr%20El%20Nil%20Bridge.jpg'),
    aliases: [
      'القاهرة', 'القاهره', 'مصر', 'cairo', 'برج القاهرة', 'cairo tower',
    ],
    focus: '55% 42%',
    copy: {
      ar: {
        city: 'القاهرة',
        landmark: 'برج القاهرة',
        description:
          'برج خرساني بارتفاع ١٨٧ متراً على جزيرة الزمالك وسط النيل، صمّمه نعوم شبيب واكتمل عام ١٩٦١ على هيئة زهرة لوتس فرعونية. من سطحه الدوار يظهر النيل وكوبري قصر النيل.',
      },
      en: {
        city: 'Cairo',
        landmark: 'Cairo Tower',
        description:
          'A 187-metre concrete tower on Gezira Island in the middle of the Nile, designed by Naoum Shebib and completed in 1961 as a pharaonic lotus flower. From its revolving deck you see the river and Qasr El Nil Bridge.',
      },
      de: {
        city: 'Kairo',
        landmark: 'Kairo Tower',
        description:
          'Ein 187 Meter hoher Betonturm auf der Gezira-Insel mitten im Nil, entworfen von Naoum Shebib und 1961 fertiggestellt – in Form einer pharaonischen Lotusblume. Von der drehbaren Plattform blickt man über den Fluss und die Qasr-el-Nil-Brücke.',
      },
      ru: {
        city: 'Каир',
        landmark: 'Каирская башня',
        description:
          'Бетонная башня высотой 187 метров на острове Гезира посреди Нила. Проект Наума Шебиба, завершена в 1961 году в форме фараоновского лотоса. С вращающейся площадки видны река и мост Каср-эль-Нил.',
      },
      it: {
        city: 'Il Cairo',
        landmark: 'Torre del Cairo',
        description:
          'Una torre di cemento alta 187 metri sull’isola di Gezira, in mezzo al Nilo: disegnata da Naoum Shebib e completata nel 1961 a forma di fiore di loto faraonico. Dalla terrazza girevole si guardano il fiume e il ponte Qasr El Nil.',
      },
    },
  },
  {
    id: 'giza',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 29.9792,
    longitude: 31.1342,
    image: commons('All Gizah Pyramids.jpg'),
    credit: credit('All Gizah Pyramids.jpg'),
    aliases: [
      'الجيزة', 'جيزة', 'giza', 'الهرم', 'الأهرامات', 'أهرامات الجيزة', 'اهرامات الجيزة',
      'pyramids', 'pyramids of giza', 'giza pyramids', 'the pyramids', 'ابو الهول', 'sphinx',
    ],
    focus: '50% 55%',
    copy: {
      ar: {
        city: 'الجيزة',
        landmark: 'أهرامات الجيزة وأبو الهول',
        description:
          'هضبة الجيزة غرب القاهرة، حيث تقف أهرامات خوفو وخفرع ومنقرع وأبو الهول. هرم خوفو، الذي اكتمل نحو ٢٥٦٠ قبل الميلاد، ظلّ أطول بناء في العالم أربعة آلاف سنة.',
      },
      en: {
        city: 'Giza',
        landmark: 'The Pyramids of Giza and the Sphinx',
        description:
          'The Giza plateau west of Cairo, where the pyramids of Khufu, Khafre and Menkaure stand beside the Sphinx. Khufu’s pyramid, finished around 2560 BC, was the tallest building on earth for four thousand years.',
      },
      de: {
        city: 'Gizeh',
        landmark: 'Die Pyramiden von Gizeh und die Sphinx',
        description:
          'Das Plateau von Gizeh westlich von Kairo, wo die Pyramiden von Cheops, Chephren und Mykerinos neben der Sphinx stehen. Die Cheops-Pyramide, um 2560 v. Chr. vollendet, blieb viertausend Jahre das höchste Bauwerk der Welt.',
      },
      ru: {
        city: 'Гиза',
        landmark: 'Пирамиды Гизы и Сфинкс',
        description:
          'Плато Гиза к западу от Каира, где рядом со Сфинксом стоят пирамиды Хеопса, Хефрена и Микерина. Пирамида Хеопса, завершённая около 2560 года до н. э., четыре тысячи лет оставалась самым высоким зданием мира.',
      },
      it: {
        city: 'Giza',
        landmark: 'Le Piramidi di Giza e la Sfinge',
        description:
          'L’altopiano di Giza a ovest del Cairo, dove le piramidi di Cheope, Chefren e Micerino sorgono accanto alla Sfinge. La piramide di Cheope, ultimata intorno al 2560 a.C., restò l’edificio più alto del mondo per quattromila anni.',
      },
    },
  },
  {
    id: 'dubai',
    countryCode: 'AE',
    timezone: 'Asia/Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    image: commons('Dubai Skyline mit Burj Khalifa (18241030269).jpg'),
    credit: credit('Dubai Skyline mit Burj Khalifa (18241030269).jpg'),
    aliases: [
      'دبي', 'دوبي', 'اماره دبي', 'dubai',
    ],
    copy: {
      ar: {
        city: 'دبي',
        landmark: 'برج خليفة وأفق الخليج',
        description:
          'أفق دبي يعلوه برج خليفة، أطول بناء شيّده الإنسان بارتفاع ٨٢٨ متراً، وسط أضواء المدينة المنعكسة على مياه الخليج العربي.',
      },
      en: {
        city: 'Dubai',
        landmark: 'Burj Khalifa and the Gulf skyline',
        description:
          'Dubai’s skyline crowned by Burj Khalifa, the tallest structure ever built at 828 metres, above lights mirrored in the Arabian Gulf.',
      },
      de: {
        city: 'Dubai',
        landmark: 'Burj Khalifa und die Skyline des Golfs',
        description:
          'Dubais Skyline mit dem Burj Khalifa, mit 828 Metern das höchste Bauwerk der Welt, über Lichtern, die sich im Golf spiegeln.',
      },
      ru: {
        city: 'Дубай',
        landmark: 'Бурдж-Халифа и панорама залива',
        description:
          'Скайлайн Дубая во главе с Бурдж-Халифой — самым высоким зданием мира высотой 828 метров — над огнями, отражёнными в заливе.',
      },
      it: {
        city: 'Dubai',
        landmark: 'Burj Khalifa e lo skyline del Golfo',
        description:
          'Lo skyline di Dubai dominato dal Burj Khalifa, la struttura più alta mai costruita con 828 metri, sopra luci riflesse nel Golfo.',
      },
    },
  },
  {
    id: 'riyadh',
    countryCode: 'SA',
    timezone: 'Asia/Riyadh',
    latitude: 24.7136,
    longitude: 46.6753,
    image: commons('Riyadh_Skyline.jpg'),
    credit: credit('Riyadh_Skyline.jpg'),
    aliases: [
      'الرياض', 'رياض', 'riyadh', 'الرياض السعودية',
    ],
    focus: '80% 50%',
    copy: {
      ar: {
        city: 'الرياض',
        landmark: 'مركز المملكة',
        description:
          'قلب الجزيرة العربية النابض، حيث يقف مركز المملكة بجسرته الشهيرة فوق مدينة تتوسّع بلا توقف، وسماء تتوهج بلون العنبر قبل المغيب.',
      },
      en: {
        city: 'Riyadh',
        landmark: 'Kingdom Centre',
        description:
          'The beating heart of Arabia, where the Kingdom Centre and its famous sky bridge rise above a city that never stops growing.',
      },
      de: {
        city: 'Riad',
        landmark: 'Kingdom Centre',
        description:
          'Das Herz Arabiens, wo das Kingdom Centre mit seiner berühmten Himmelsbrücke über einer ständig wachsenden Stadt steht.',
      },
      ru: {
        city: 'Эр-Рияд',
        landmark: 'Kingdom Centre',
        description:
          'Сердце Аравии: башня Kingdom Centre со знаменитым небесным мостом над городом, который непрерывно растёт.',
      },
      it: {
        city: 'Riad',
        landmark: 'Kingdom Centre',
        description:
          'Il cuore pulsante dell’Arabia, dove il Kingdom Centre e il suo celebre ponte sospeso dominano una città in continua crescita.',
      },
    },
  },
  {
    id: 'alexandria',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 31.2001,
    longitude: 29.9187,
    image: commons('The_Citadel_of_Qaitbay.jpg'),
    credit: credit('The_Citadel_of_Qaitbay.jpg'),
    aliases: [
      'الإسكندرية', 'الاسكندرية', 'اسكندرية', 'alexandria', 'اسكندريه',
    ],
    copy: {
      ar: {
        city: 'الإسكندرية',
        landmark: 'قلعة قايتباي',
        description:
          'قلعة قايتباي تقف على موقع منارة الإسكندرية القديمة، إحدى عجائب الدنيا السبع، وتطلّ على بحر أبيض متوسط لا يهدأ.',
      },
      en: {
        city: 'Alexandria',
        landmark: 'Qaitbay Citadel',
        description:
          'Qaitbay Citadel stands on the site of the ancient Lighthouse of Alexandria, one of the seven wonders, facing a restless Mediterranean.',
      },
      de: {
        city: 'Alexandria',
        landmark: 'Zitadelle von Qaitbay',
        description:
          'Die Zitadelle von Qaitbay steht auf dem Grund des antiken Leuchtturms von Alexandria und blickt auf ein ruheloses Mittelmeer.',
      },
      ru: {
        city: 'Александрия',
        landmark: 'Цитадель Кайт-Бей',
        description:
          'Цитадель Кайт-Бей стоит на месте древнего Александрийского маяка и смотрит на неспокойное Средиземное море.',
      },
      it: {
        city: 'Alessandria',
        landmark: 'Cittadella di Qaitbay',
        description:
          'La cittadella di Qaitbay sorge sul sito dell’antico Faro di Alessandria e guarda un Mediterraneo inquieto.',
      },
    },
  },
  {
    id: 'hurghada',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 27.2579,
    longitude: 33.8116,
    image: commons('Red%20sea4%20-%20panoramio.jpg'),
    credit: credit('Red%20sea4%20-%20panoramio.jpg'),
    aliases: [
      'الغردقة', 'الغردقه', 'hurghada', 'الغردقه البحر الاحمر',
    ],
    focus: '50% 62%',
    zoom: 1.45,
    copy: {
      ar: {
        city: 'الغردقة',
        landmark: 'شعاب البحر الأحمر',
        description:
          'مياه فيروزية ضحلة وأرصفة خشبية تمتد فوق الشعاب المرجانية، ومراكب حية تغادر نحو الجزر. الغردقة أول مدينة غوص على البحر الأحمر، وشمسها لا تغيب كثيراً.',
      },
      en: {
        city: 'Hurghada',
        landmark: 'Red Sea reefs',
        description:
          'Shallow turquoise water, wooden jetties over the reef and dive boats heading for the islands. Hurghada is Egypt’s first diving town, and the sun rarely leaves.',
      },
      de: {
        city: 'Hurghada',
        landmark: 'Riffe des Roten Meeres',
        description:
          'Flaches türkisfarbenes Wasser, Holzstege über dem Riff und Tauchboote auf dem Weg zu den Inseln. Hurghada ist Ägyptens erste Tauchstadt – und die Sonne bleibt selten aus.',
      },
      ru: {
        city: 'Хургада',
        landmark: 'Рифы Красного моря',
        description:
          'Бирюзовая мелкая вода, деревянные пирсы над рифом и дайв-боты, уходящие к островам. Хургада — первый дайв-город Египта, и солнце здесь почти не уходит.',
      },
      it: {
        city: 'Hurghada',
        landmark: 'Le barriere del Mar Rosso',
        description:
          'Acqua turchese e bassa, pontili di legno sopra la barriera e barche dei subacquei dirette alle isole. Hurghada è la prima città subacquea d’Egitto, e il sole quasi non se ne va.',
      },
    },
  },
  {
    id: 'luxor',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 25.6872,
    longitude: 32.6396,
    image: commons('Templo%20de%20Karnak%2C%20Luxor%2C%20Egipto%2C%202022-04-03%2C%20DD%20139.jpg'),
    credit: credit('Templo%20de%20Karnak%2C%20Luxor%2C%20Egipto%2C%202022-04-03%2C%20DD%20139.jpg'),
    aliases: [
      'الأقصر', 'الاقصر', 'اقصر', 'luxor', 'الاقصر مصر',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'الأقصر',
        landmark: 'معبد الكرنك',
        description:
          'طريق الكباش المؤدي إلى صرح معبد الكرنك، حيث بدأ البناء قبل نحو أربعة آلاف عام ولم يتوقف قروناً. الأقصر أكبر متحف مفتوح في العالم.',
      },
      en: {
        city: 'Luxor',
        landmark: 'Karnak Temple',
        description:
          'The avenue of ram-headed sphinxes leading to the pylon of Karnak, begun almost four thousand years ago and built for centuries after. Luxor is the world’s largest open-air museum.',
      },
      de: {
        city: 'Luxor',
        landmark: 'Karnak-Tempel',
        description:
          'Die Allee der widderköpfigen Sphinxe führt zum Pylon von Karnak – begonnen vor fast viertausend Jahren und über Jahrhunderte weitergebaut. Luxor ist das größte Freilichtmuseum der Welt.',
      },
      ru: {
        city: 'Луксор',
        landmark: 'Карнакский храм',
        description:
          'Аллея сфинксов с бараньими головами ведёт к пилону Карнака: строительство началось почти четыре тысячи лет назад и шло веками. Луксор — крупнейший музей под открытым небом.',
      },
      it: {
        city: 'Luxor',
        landmark: 'Tempio di Karnak',
        description:
          'Il viale delle sfingi a testa di ariete che porta al pilone di Karnak, iniziato quasi quattromila anni fa e costruito per secoli. Luxor è il più grande museo all’aperto del mondo.',
      },
    },
  },
  {
    id: 'makkah',
    countryCode: 'SA',
    timezone: 'Asia/Riyadh',
    latitude: 21.4225,
    longitude: 39.8262,
    image: commons('The Kaaba during Hajj - edited.jpg'),
    credit: credit('The Kaaba during Hajj - edited.jpg'),
    aliases: [
      'مكة', 'مكه', 'مكة المكرمة', 'مكه المكرمه', 'makkah', 'mecca', 'المسجد الحرام',
    ],
    copy: {
      ar: {
        city: 'مكة المكرمة',
        landmark: 'المسجد الحرام والكعبة',
        description:
          'الكعبة المشرفة في قلب المسجد الحرام، قبلة أكثر من مليار مسلم، تتوسطها أفواج الطائفين ليلاً ونهاراً منذ أربعة عشر قرناً.',
      },
      en: {
        city: 'Makkah',
        landmark: 'The Grand Mosque and the Kaaba',
        description:
          'The Kaaba at the heart of the Grand Mosque, the qibla of more than a billion Muslims, encircled by pilgrims day and night for fourteen centuries.',
      },
      de: {
        city: 'Mekka',
        landmark: 'Die Große Moschee und die Kaaba',
        description:
          'Die Kaaba im Herzen der Großen Moschee, Qibla für über eine Milliarde Muslime, seit vierzehn Jahrhunderten Tag und Nacht umrundet.',
      },
      ru: {
        city: 'Мекка',
        landmark: 'Заповедная мечеть и Кааба',
        description:
          'Кааба в сердце Заповедной мечети — кибла более миллиарда мусульман, вокруг которой днём и ночью идут паломники уже четырнадцать веков.',
      },
      it: {
        city: 'La Mecca',
        landmark: 'La Grande Moschea e la Kaaba',
        description:
          'La Kaaba nel cuore della Grande Moschea, qibla di oltre un miliardo di musulmani, circondata dai pellegrini da quattordici secoli.',
      },
    },
  },
  {
    id: 'madinah',
    countryCode: 'SA',
    timezone: 'Asia/Riyadh',
    latitude: 24.4672,
    longitude: 39.6111,
    image: commons('Mezquita del Profeta, Medina, Arabia Saudita, 2025-05-22, DD 02.jpg'),
    credit: credit('Mezquita del Profeta, Medina, Arabia Saudita, 2025-05-22, DD 02.jpg'),
    aliases: [
      'المدينة', 'المدينه', 'المدينة المنورة', 'المدينه المنوره', 'madinah', 'medina',
    ],
    focus: '70% 50%',
    zoom: 1.45,
    copy: {
      ar: {
        city: 'المدينة المنورة',
        landmark: 'المسجد النبوي',
        description:
          'المسجد النبوي وقبّته الخضراء، ثاني أقدس موقع في الإسلام، يهبط الضوء الهادئ على ساحاته الواسعة عند الفجر والمغيب.',
      },
      en: {
        city: 'Madinah',
        landmark: 'The Prophet\'s Mosque',
        description:
          'The Prophet\'s Mosque and its green dome, the second holiest site in Islam, where soft light falls across wide courtyards at dawn and dusk.',
      },
      de: {
        city: 'Medina',
        landmark: 'Die Prophetenmoschee',
        description:
          'Die Prophetenmoschee mit ihrer grünen Kuppel, der zweitheiligste Ort des Islam, in dem Morgen- und Abendlicht über die weiten Höfe fällt.',
      },
      ru: {
        city: 'Медина',
        landmark: 'Мечеть Пророка',
        description:
          'Мечеть Пророка с зелёным куполом — вторая святыня ислама, где на рассвете и в сумерках мягкий свет ложится на широкие дворы.',
      },
      it: {
        city: 'Medina',
        landmark: 'La Moschea del Profeta',
        description:
          'La Moschea del Profeta con la sua cupola verde, il secondo luogo più sacro dell’Islam, dove all’alba e al tramonto una luce morbida invade i cortili.',
      },
    },
  },
  {
    id: 'jeddah',
    countryCode: 'SA',
    timezone: 'Asia/Riyadh',
    latitude: 21.4858,
    longitude: 39.1925,
    image: commons('Jeddah_-_87654.jpg'),
    credit: credit('Jeddah_-_87654.jpg'),
    aliases: [
      'جدة', 'جده', 'jeddah', 'jiddah',
    ],
    copy: {
      ar: {
        city: 'جدة',
        landmark: 'مسجد الرحمة العائم',
        description:
          'مسجد الرحمة العائم على شاطئ جدة، يبدو كأنه يطفو فوق البحر الأحمر عند المد، وتحيط به زرقة الماء من كل جهة.',
      },
      en: {
        city: 'Jeddah',
        landmark: 'Al-Rahma Floating Mosque',
        description:
          'The floating mosque on the Jeddah shore seems to drift on the Red Sea at high tide, blue water on every side.',
      },
      de: {
        city: 'Dschidda',
        landmark: 'Die schwimmende Moschee',
        description:
          'Die Al-Rahma-Moschee scheint bei Flut auf dem Roten Meer zu treiben, ringsum nur blaues Wasser.',
      },
      ru: {
        city: 'Джидда',
        landmark: 'Плавучая мечеть',
        description:
          'Мечеть Ар-Рахма у берега Джидды кажется плывущей по Красному морю в прилив, вода окружает её со всех сторон.',
      },
      it: {
        city: 'Gedda',
        landmark: 'La moschea galleggiante',
        description:
          'La moschea Al-Rahma sulla costa di Gedda sembra galleggiare sul Mar Rosso con l’alta marea, circondata d’acqua.',
      },
    },
  },
  {
    id: 'abudhabi',
    countryCode: 'AE',
    timezone: 'Asia/Dubai',
    latitude: 24.4539,
    longitude: 54.3773,
    image: commons('Abu_dhabi_skylines_2014.jpg'),
    credit: credit('Abu_dhabi_skylines_2014.jpg'),
    aliases: [
      'أبوظبي', 'ابوظبي', 'ابو ظبي', 'abu dhabi', 'abudhabi',
    ],
    zoom: 1.3,
    copy: {
      ar: {
        city: 'أبوظبي',
        landmark: 'كورنيش أبوظبي',
        description:
          'أبراج أبوظبي على كورنيش الخليج، مدينة تحوّلت من قرية صيد صغيرة إلى عاصمة حديثة في نصف قرن فقط.',
      },
      en: {
        city: 'Abu Dhabi',
        landmark: 'The Abu Dhabi Corniche',
        description:
          'The towers of Abu Dhabi along the Gulf corniche — a fishing village turned modern capital in only fifty years.',
      },
      de: {
        city: 'Abu Dhabi',
        landmark: 'Die Corniche von Abu Dhabi',
        description:
          'Die Türme Abu Dhabis an der Corniche — aus einem Fischerdorf wurde in nur fünfzig Jahren eine moderne Hauptstadt.',
      },
      ru: {
        city: 'Абу-Даби',
        landmark: 'Корниш Абу-Даби',
        description:
          'Башни Абу-Даби на набережной Корниш: рыбацкая деревня превратилась в современную столицу всего за пятьдесят лет.',
      },
      it: {
        city: 'Abu Dhabi',
        landmark: 'La Corniche di Abu Dhabi',
        description:
          'Le torri di Abu Dhabi lungo la Corniche: da villaggio di pescatori a capitale moderna in soli cinquant’anni.',
      },
    },
  },
  {
    id: 'doha',
    countryCode: 'QA',
    timezone: 'Asia/Qatar',
    latitude: 25.2854,
    longitude: 51.531,
    image: commons('Doha_-_West_Bay_Skyline_04.jpg'),
    credit: credit('Doha_-_West_Bay_Skyline_04.jpg'),
    aliases: [
      'الدوحة', 'الدوحه', 'دوحه', 'doha', 'قطر',
    ],
    zoom: 1.35,
    copy: {
      ar: {
        city: 'الدوحة',
        landmark: 'أبراج الخليج الغربي',
        description:
          'أبراج الخليج الغربي في الدوحة ترسم خطاً معمارياً جريئاً على ساحل الخليج العربي، وتضيء ككتلة ضوء واحدة بعد الغروب.',
      },
      en: {
        city: 'Doha',
        landmark: 'West Bay towers',
        description:
          'Doha’s West Bay towers draw a bold architectural line along the Gulf coast and glow as a single block of light after sunset.',
      },
      de: {
        city: 'Doha',
        landmark: 'Die Türme der West Bay',
        description:
          'Die Türme der West Bay ziehen eine kühne Linie an der Golfküste und leuchten nach Sonnenuntergang wie ein einziger Lichtblock.',
      },
      ru: {
        city: 'Доха',
        landmark: 'Башни Вест-Бэй',
        description:
          'Башни Вест-Бэй в Дохе прочерчивают смелую линию вдоль берега залива и после заката светятся единым блоком света.',
      },
      it: {
        city: 'Doha',
        landmark: 'Le torri di West Bay',
        description:
          'Le torri di West Bay disegnano una linea audace sulla costa del Golfo e dopo il tramonto brillano come un unico blocco di luce.',
      },
    },
  },
  {
    id: 'kuwait',
    countryCode: 'KW',
    timezone: 'Asia/Kuwait',
    latitude: 29.3759,
    longitude: 47.9774,
    image: commons('Kuwait Towers2025.jpg'),
    credit: credit('Kuwait Towers2025.jpg'),
    aliases: [
      'الكويت', 'مدينة الكويت', 'kuwait', 'kuwait city',
    ],
    zoom: 1.3,
    copy: {
      ar: {
        city: 'الكويت',
        landmark: 'أبراج الكويت',
        description:
          'أبراج الكويت على ساحل الخليج، أيقونة معمارية بناها يورن أوتزون عام ١٩٧٩، وترتفع فوق الماء كثلاث مآذن مستقبلية.',
      },
      en: {
        city: 'Kuwait City',
        landmark: 'The Kuwait Towers',
        description:
          'The Kuwait Towers on the Gulf shore, an architectural icon by Jørn Utzon built in 1979, rising from the water like three futuristic minarets.',
      },
      de: {
        city: 'Kuwait-Stadt',
        landmark: 'Die Kuwait Towers',
        description:
          'Die Kuwait Towers an der Golfküste, ein Wahrzeichen von Jørn Utzon (1979), ragen wie drei futuristische Minarette aus dem Wasser.',
      },
      ru: {
        city: 'Эль-Кувейт',
        landmark: 'Кувейтские башни',
        description:
          'Кувейтские башни на берегу залива — символ Йорна Утзона 1979 года, поднимающийся из воды как три футуристических минарета.',
      },
      it: {
        city: 'Kuwait City',
        landmark: 'Le Torri del Kuwait',
        description:
          'Le Torri del Kuwait sulla costa del Golfo, icona di Jørn Utzon del 1979, emergono dall’acqua come tre minareti futuristici.',
      },
    },
  },
  {
    id: 'manama',
    countryCode: 'BH',
    timezone: 'Asia/Bahrain',
    latitude: 26.2285,
    longitude: 50.586,
    image: commons('Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_1.jpg'),
    credit: credit('Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_1.jpg'),
    aliases: [
      'المنامة', 'المنامه', 'manama', 'البحرين', 'bahrain',
    ],
    copy: {
      ar: {
        city: 'المنامة',
        landmark: 'مركز البحرين التجاري العالمي',
        description:
          'مركز البحرين التجاري العالمي، أول ناطحة سحاب في العالم تدمج توربينات الرياح داخل هيكلها، يرتفع فوق مرفأ المنامة.',
      },
      en: {
        city: 'Manama',
        landmark: 'Bahrain World Trade Center',
        description:
          'The Bahrain World Trade Center, the first skyscraper to weave wind turbines into its structure, rising above Manama harbour.',
      },
      de: {
        city: 'Manama',
        landmark: 'Bahrain World Trade Center',
        description:
          'Das Bahrain World Trade Center, der erste Wolkenkratzer mit integrierten Windturbinen, erhebt sich über dem Hafen von Manama.',
      },
      ru: {
        city: 'Манама',
        landmark: 'Всемирный торговый центр Бахрейна',
        description:
          'Всемирный торговый центр Бахрейна — первый небоскрёб с ветряными турбинами в конструкции — поднимается над гаванью Манамы.',
      },
      it: {
        city: 'Manama',
        landmark: 'Bahrain World Trade Center',
        description:
          'Il Bahrain World Trade Center, il primo grattacielo con turbine eoliche integrate nella struttura, svetta sul porto di Manama.',
      },
    },
  },
  {
    id: 'muscat',
    countryCode: 'OM',
    timezone: 'Asia/Muscat',
    latitude: 23.588,
    longitude: 58.3829,
    image: commons('Sultan_Qaboos_Grand_Mosque_(19889998133).jpg'),
    credit: credit('Sultan_Qaboos_Grand_Mosque_(19889998133).jpg'),
    aliases: [
      'مسقط', 'muscat', 'سلطنة عمان',
      'sultan qaboos grand mosque', 'grand mosque muscat',
      'جامع السلطان قابوس', 'جامع السلطان قابوس الأكبر',
    ],
    zoom: 1.3,
    copy: {
      ar: {
        city: 'مسقط',
        landmark: 'جامع السلطان قابوس الأكبر',
        description:
          'جامع السلطان قابوس الأكبر، تحفة من الرخام والزخارف الإسلامية تحت سماء عُمان، ومآذنه ترسم ظلاً طويلاً على الرمل عند الغروب.',
      },
      en: {
        city: 'Muscat',
        landmark: 'Sultan Qaboos Grand Mosque',
        description:
          'The Sultan Qaboos Grand Mosque, a masterpiece of marble and Islamic ornament under Omani skies, its minarets drawing long shadows on the sand at sunset.',
      },
      de: {
        city: 'Maskat',
        landmark: 'Große Sultan-Qabus-Moschee',
        description:
          'Die Große Sultan-Qabus-Moschee, ein Meisterwerk aus Marmor und islamischer Ornamentik, deren Minarette bei Sonnenuntergang lange Schatten werfen.',
      },
      ru: {
        city: 'Маскат',
        landmark: 'Большая мечеть султана Кабуса',
        description:
          'Большая мечеть султана Кабуса — шедевр мрамора и исламского орнамента под небом Омана; на закате её минареты бросают длинные тени.',
      },
      it: {
        city: 'Mascate',
        landmark: 'La Grande Moschea del Sultano Qaboos',
        description:
          'La Grande Moschea del Sultano Qaboos, capolavoro di marmo e ornamenti islamici, i cui minareti al tramonto disegnano lunghe ombre sulla sabbia.',
      },
    },
  },
  {
    id: 'amman',
    countryCode: 'JO',
    timezone: 'Asia/Amman',
    latitude: 31.9539,
    longitude: 35.9106,
    image: commons('Amman_-_Roman_Theatre_seen_from_the_Citadel.jpg'),
    credit: credit('Amman_-_Roman_Theatre_seen_from_the_Citadel.jpg'),
    aliases: [
      'عمان', 'عمّان', 'amman', 'الاردن',
    ],
    copy: {
      ar: {
        city: 'عمّان',
        landmark: 'المدرج الروماني',
        description:
          'المدرج الروماني في قلب عمّان، محفور في الجبل منذ القرن الثاني الميلادي، يطلّ على بيوت المدينة البيضاء المتراكمة على التلال.',
      },
      en: {
        city: 'Amman',
        landmark: 'The Roman Theatre',
        description:
          'The Roman Theatre in the heart of Amman, carved into the hill in the 2nd century AD, overlooking white houses stacked across the hills.',
      },
      de: {
        city: 'Amman',
        landmark: 'Das römische Theater',
        description:
          'Das römische Theater im Herzen Ammans, im 2. Jahrhundert n. Chr. in den Hang gehauen, blickt auf weiße Häuser, die sich über die Hügel stapeln.',
      },
      ru: {
        city: 'Амман',
        landmark: 'Римский театр',
        description:
          'Римский театр в центре Аммана, вырубленный в склоне во II веке, смотрит на белые дома, каскадом спускающиеся по холмам.',
      },
      it: {
        city: 'Amman',
        landmark: 'Il Teatro Romano',
        description:
          'Il Teatro Romano nel cuore di Amman, scavato nella collina nel II secolo d.C., domina le case bianche ammassate sui pendii.',
      },
    },
  },
  {
    id: 'petra',
    countryCode: 'JO',
    timezone: 'Asia/Amman',
    latitude: 30.3285,
    longitude: 35.4444,
    image: commons('Petra_%2C_Al-Khazneh_2.jpg'),
    credit: credit('Petra_%2C_Al-Khazneh_2.jpg'),
    aliases: [
      'البتراء', 'البترا', 'بتراء', 'petra', 'الخزنة',
    ],
    focus: '70% 45%',
    copy: {
      ar: {
        city: 'البتراء',
        landmark: 'الخزنة',
        description:
          'الخزنة في البتراء، مدينة الأنباط الوردية المنحوتة في الصخر، تُكشف فجأة عند نهاية ممر السيق في مشهد لا يشبه شيئاً آخر.',
      },
      en: {
        city: 'Petra',
        landmark: 'Al-Khazneh, the Treasury',
        description:
          'Al-Khazneh in Petra, the rose-red Nabataean city carved into rock, revealed all at once at the end of the Siq.',
      },
      de: {
        city: 'Petra',
        landmark: 'Al-Khazneh (Das Schatzhaus)',
        description:
          'Al-Khazneh in Petra, die rosarote Nabatäerstadt aus dem Fels, erscheint am Ende des Siq ganz plötzlich.',
      },
      ru: {
        city: 'Петра',
        landmark: 'Аль-Хазне (Сокровищница)',
        description:
          'Аль-Хазне в Петре — розово-красный набатейский город, вырубленный в скале, — открывается внезапно в конце ущелья Сик.',
      },
      it: {
        city: 'Petra',
        landmark: 'Al-Khazneh (Il Tesoro)',
        description:
          'Al-Khazneh a Petra, la città nabatea rosa scolpita nella roccia, appare all’improvviso alla fine del Siq.',
      },
    },
  },
  {
    id: 'beirut',
    countryCode: 'LB',
    timezone: 'Asia/Beirut',
    latitude: 33.8938,
    longitude: 35.5018,
    image: commons('The Rock of Raouché, or Pigeon Rock.jpg'),
    credit: credit('The Rock of Raouché, or Pigeon Rock.jpg'),
    aliases: [
      'بيروت', 'beirut', 'لبنان',
      'pigeon rocks', 'pigeon rock', 'raouche', 'raouché', 'صخرة الروشة', 'صخور الروشة', 'الروشة',
    ],
    copy: {
      ar: {
        city: 'بيروت',
        landmark: 'صخرة الروشة',
        description:
          'صخرة الروشة في بيروت، قوس حجري واقف في البحر الأبيض المتوسط يلتقط آخر ضوء الشمس كل مساء.',
      },
      en: {
        city: 'Beirut',
        landmark: 'Pigeon Rocks',
        description:
          'The Pigeon Rocks of Beirut, a stone arch standing in the Mediterranean that catches the last light every evening.',
      },
      de: {
        city: 'Beirut',
        landmark: 'Die Taubenfelsen',
        description:
          'Die Taubenfelsen von Beirut, ein Steinbogen im Mittelmeer, der jeden Abend das letzte Licht einfängt.',
      },
      ru: {
        city: 'Бейрут',
        landmark: 'Скалы Рауше',
        description:
          'Скалы Рауше в Бейруте — каменная арка в Средиземном море, ловящая последний свет каждый вечер.',
      },
      it: {
        city: 'Beirut',
        landmark: 'Le Rocce dei Piccioni',
        description:
          'Le Rocce dei Piccioni a Beirut, un arco di pietra nel Mediterraneo che ogni sera cattura l’ultima luce.',
      },
    },
  },
  {
    id: 'damascus',
    countryCode: 'SY',
    timezone: 'Asia/Damascus',
    latitude: 33.5138,
    longitude: 36.2765,
    image: commons('Damascus%2C_Syria%2C_The_Umayyad_Mosque%2C_The_Courtyard%2C_Islamic_Art.jpg'),
    credit: credit('Damascus%2C_Syria%2C_The_Umayyad_Mosque%2C_The_Courtyard%2C_Islamic_Art.jpg'),
    aliases: [
      'دمشق', 'damascus', 'سوريا',
    ],
    copy: {
      ar: {
        city: 'دمشق',
        landmark: 'الجامع الأموي',
        description:
          'الجامع الأموي الكبير في دمشق، من أقدم مساجد العالم وأكثرها هيبة، بصحنه الفسيح وأعمدته الرخامية ومآذنه التي تعانق السماء.',
      },
      en: {
        city: 'Damascus',
        landmark: 'The Umayyad Mosque',
        description:
          'The Great Umayyad Mosque of Damascus, one of the oldest and most majestic mosques in the world, with its vast courtyard, marble columns and soaring minarets.',
      },
      de: {
        city: 'Damaskus',
        landmark: 'Die Umayyaden-Moschee',
        description:
          'Die große Umayyaden-Moschee von Damaskus, eine der ältesten und ehrwürdigsten Moscheen der Welt, mit weitem Hof, Marmorsäulen und hohen Minaretten.',
      },
      ru: {
        city: 'Дамаск',
        landmark: 'Омейядская мечеть',
        description:
          'Большая Омейядская мечеть Дамаска — одна из древнейших и величественных мечетей мира с огромным двором, мраморными колоннами и высокими минаретами.',
      },
      it: {
        city: 'Damasco',
        landmark: 'La Moschea degli Omayyadi',
        description:
          'La Grande Moschea degli Omayyadi di Damasco, tra le più antiche e maestose del mondo, con il vasto cortile, le colonne di marmo e i minareti slanciati.',
      },
    },
  },
  {
    id: 'baghdad',
    countryCode: 'IQ',
    timezone: 'Asia/Baghdad',
    latitude: 33.3152,
    longitude: 44.3661,
    image: commons('%D8%A7%D9%84%D8%B9%D9%84%D9%85%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%D9%8A%20%D9%81%D9%8A%20%D9%82%D9%84%D8%A8%20%D9%86%D8%B5%D8%A8%20%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%AF%20%E2%80%93%20%D8%A8%D8%BA%D8%AF%D8%A7%D8%AF%D8%8C%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82.jpg'),
    credit: credit('%D8%A7%D9%84%D8%B9%D9%84%D9%85%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%D9%8A%20%D9%81%D9%8A%20%D9%82%D9%84%D8%A8%20%D9%86%D8%B5%D8%A8%20%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%AF%20%E2%80%93%20%D8%A8%D8%BA%D8%AF%D8%A7%D8%AF%D8%8C%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82.jpg'),
    aliases: [
      'بغداد', 'baghdad', 'العراق',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'بغداد',
        landmark: 'نصب الشهيد',
        description:
          'قبّتان فيروزيتان تنشقّان عن قلب واحد في نصب الشهيد، شُيّدتا تخليداً لأرواح العراقيين، وتقفان اليوم على ضفّة دجلة شاهداً على ذاكرة بغداد.',
      },
      en: {
        city: 'Baghdad',
        landmark: 'Al-Shaheed Monument',
        description:
          'Two turquoise domes split open around a single heart: the Martyrs’ Monument on the Tigris, a witness to Baghdad’s memory.',
      },
      de: {
        city: 'Bagdad',
        landmark: 'Al-Shaheed-Denkmal',
        description:
          'Zwei türkisfarbene Kuppeln, die sich um ein einziges Herz öffnen: das Märtyrerdenkmal am Tigris, Zeuge der Erinnerung Bagdads.',
      },
      ru: {
        city: 'Багдад',
        landmark: 'Монумент шахидов',
        description:
          'Два бирюзовых купола, раскрывающихся вокруг одного сердца: монумент шахидов на Тигре, свидетель памяти Багдада.',
      },
      it: {
        city: 'Baghdad',
        landmark: 'Il Monumento ai Martiri',
        description:
          'Due cupole turchesi aperte attorno a un solo cuore: il Monumento ai Martiri sul Tigri, testimone della memoria di Baghdad.',
      },
    },
  },
  {
    id: 'casablanca',
    countryCode: 'MA',
    timezone: 'Africa/Casablanca',
    latitude: 33.5731,
    longitude: -7.5898,
    image: commons('Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber\'s_portfolio.jpg'),
    credit: credit('Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber\'s_portfolio.jpg'),
    aliases: [
      'الدار البيضاء', 'الدار البيضه', 'كازابلانكا', 'casablanca', 'الدارالبيضاء',
    ],
    copy: {
      ar: {
        city: 'الدار البيضاء',
        landmark: 'مسجد الحسن الثاني',
        description:
          'مسجد الحسن الثاني يقف على حافة المحيط الأطلسي، أطول مئذنة في العالم بارتفاع ٢١٠ أمتار، تضيء الشمس على رخامه كل مغيب.',
      },
      en: {
        city: 'Casablanca',
        landmark: 'Hassan II Mosque',
        description:
          'The Hassan II Mosque on the edge of the Atlantic, its 210-metre minaret the tallest in the world, catching the sun on marble at every sunset.',
      },
      de: {
        city: 'Casablanca',
        landmark: 'Hassan-II.-Moschee',
        description:
          'Die Hassan-II.-Moschee am Atlantik, deren 210 Meter hohes Minarett das höchste der Welt ist und bei jedem Sonnenuntergang auf Marmor glänzt.',
      },
      ru: {
        city: 'Касабланка',
        landmark: 'Мечеть Хасана II',
        description:
          'Мечеть Хасана II на краю Атлантики: её минарет высотой 210 метров — самый высокий в мире, и каждый закат играет на мраморе.',
      },
      it: {
        city: 'Casablanca',
        landmark: 'La Moschea di Hassan II',
        description:
          'La Moschea di Hassan II sull’Atlantico, con il minareto di 210 metri più alto del mondo, illuminata dal sole sul marmo a ogni tramonto.',
      },
    },
  },
  {
    id: 'marrakech',
    countryCode: 'MA',
    timezone: 'Africa/Casablanca',
    latitude: 31.6295,
    longitude: -7.9811,
    image: commons('Jemaa el-Fnaa Marrakech at sunset.jpg'),
    credit: credit('Jemaa el-Fnaa Marrakech at sunset.jpg'),
    aliases: [
      'مراكش', 'marrakech', 'marrakesh', 'المغرب',
    ],
    copy: {
      ar: {
        city: 'مراكش',
        landmark: 'المدينة الحمراء وجبال الأطلس',
        description:
          'مراكش الحمراء عند سفح جبال الأطلس، حيث يختلط لون المدينة الطيني بثلج القمم، ويصدح الأذان فوق ساحة جامع الفنا.',
      },
      en: {
        city: 'Marrakech',
        landmark: 'The red city and the Atlas',
        description:
          'Marrakech at the foot of the Atlas, where the ochre of the medina meets snow on the peaks and the call to prayer rises over Jemaa el-Fna.',
      },
      de: {
        city: 'Marrakesch',
        landmark: 'Die rote Stadt und der Atlas',
        description:
          'Marrakesch am Fuße des Atlas, wo das Ocker der Medina auf Schnee auf den Gipfeln trifft und der Gebetsruf über den Jemaa el-Fna steigt.',
      },
      ru: {
        city: 'Марракеш',
        landmark: 'Красный город и Атлас',
        description:
          'Марракеш у подножия Атласа, где охра медины встречается со снегом на вершинах, а азан поднимается над площадью Джемаа эль-Фна.',
      },
      it: {
        city: 'Marrakech',
        landmark: 'La città rossa e l’Atlante',
        description:
          'Marrakech ai piedi dell’Atlante, dove l’ocra della medina incontra la neve delle vette e il richiamo alla preghiera sale su Jemaa el-Fna.',
      },
    },
  },
  {
    id: 'tunis',
    countryCode: 'TN',
    timezone: 'Africa/Tunis',
    latitude: 36.8065,
    longitude: 10.1815,
    image: commons('Tunisia-3029B_(7846578812).jpg'),
    credit: credit('Tunisia-3029B_(7846578812).jpg'),
    aliases: [
      'تونس', 'tunis', 'سيدي بوسعيد',
    ],
    copy: {
      ar: {
        city: 'تونس',
        landmark: 'سيدي بوسعيد',
        description:
          'سيدي بوسعيد فوق خليج تونس، بيوت بيضاء وأبواب زرقاء تطلّ على البحر المتوسط، وتلال تضيء بالأزرق عند العصر.',
      },
      en: {
        city: 'Tunis',
        landmark: 'Sidi Bou Said',
        description:
          'Sidi Bou Said above the Gulf of Tunis: white houses and blue doors over the Mediterranean, hills turning blue in the afternoon.',
      },
      de: {
        city: 'Tunis',
        landmark: 'Sidi Bou Said',
        description:
          'Sidi Bou Said über dem Golf von Tunis: weiße Häuser und blaue Türen über dem Mittelmeer, Hügel, die am Nachmittag blau leuchten.',
      },
      ru: {
        city: 'Тунис',
        landmark: 'Сиди-Бу-Саид',
        description:
          'Сиди-Бу-Саид над Тунисским заливом: белые дома и синие двери над Средиземным морем, холмы, синеющие к вечеру.',
      },
      it: {
        city: 'Tunisi',
        landmark: 'Sidi Bou Said',
        description:
          'Sidi Bou Said sopra il golfo di Tunisi: case bianche e porte blu sul Mediterraneo, colline che si tingono di blu nel pomeriggio.',
      },
    },
  },
  {
    id: 'sanaa',
    countryCode: 'YE',
    timezone: 'Asia/Aden',
    latitude: 15.3694,
    longitude: 44.191,
    image: commons('Tower-House_in_the_Old_City_of_Sana\'a_(2286782876).jpg'),
    credit: credit('Tower-House_in_the_Old_City_of_Sana\'a_(2286782876).jpg'),
    aliases: [
      'صنعاء', 'صنعا', 'sanaa', 'sana', 'اليمن',
    ],
    copy: {
      ar: {
        city: 'صنعاء',
        landmark: 'المدينة القديمة',
        description:
          'صنعاء القديمة، بيوتها البرجية المزخرفة بالجبس الأبيض، عمرها أكثر من ألف عام وترتفع كغابة من الحجر في الهواء.',
      },
      en: {
        city: 'Sanaa',
        landmark: 'The Old City',
        description:
          'Old Sanaa, its tower houses trimmed with white gypsum, more than a thousand years old and rising like a forest of stone.',
      },
      de: {
        city: 'Sanaa',
        landmark: 'Die Altstadt',
        description:
          'Die Altstadt von Sanaa, ihre Turmhäuser mit weißem Gips verziert, über tausend Jahre alt und wie ein Wald aus Stein.',
      },
      ru: {
        city: 'Сана',
        landmark: 'Старый город',
        description:
          'Старая Сана с башенными домами в белом гипсе — ей больше тысячи лет, и она поднимается как каменный лес.',
      },
      it: {
        city: 'Sana’a',
        landmark: 'La città vecchia',
        description:
          'La vecchia Sana’a, le sue case-torre rifinite con gesso bianco, più che millenaria, si innalza come una foresta di pietra.',
      },
    },
  },
  {
    id: 'alula',
    countryCode: 'SA',
    timezone: 'Asia/Riyadh',
    latitude: 26.6175,
    longitude: 37.9161,
    image: commons('Qasr_al-Farid%2C_a_1st-century_AD_Nabatean_unfinished_tomb_carved_into_a_giant_boulder_in_Hegra_(Mada\'in_Salih)%2C_the_kingdom\'s_second_Nabatean_capital_after_Petra%2C_Saudi_Arabia_-_53534952258.jpg'),
    credit: credit('Qasr_al-Farid%2C_a_1st-century_AD_Nabatean_unfinished_tomb_carved_into_a_giant_boulder_in_Hegra_(Mada\'in_Salih)%2C_the_kingdom\'s_second_Nabatean_capital_after_Petra%2C_Saudi_Arabia_-_53534952258.jpg'),
    aliases: [
      'العلا', 'alula', 'al ula', 'الحجر', 'هجر',
    ],
    copy: {
      ar: {
        city: 'العلا',
        landmark: 'قصر الفريد في الحِجر',
        description:
          'قصر الفريد في الحِجر بالعلا، مقبرة نبطية منحوتة في صخرة واحدة قبل ألفي عام، تقف وحدها في صحراء واسعة.',
      },
      en: {
        city: 'AlUla',
        landmark: 'Qasr al-Farid, Hegra',
        description:
          'Qasr al-Farid in Hegra, a Nabataean tomb carved from a single rock two thousand years ago, standing alone in the open desert.',
      },
      de: {
        city: 'AlUla',
        landmark: 'Qasr al-Farid, Hegra',
        description:
          'Qasr al-Farid in Hegra, ein nabatäisches Grab, vor zweitausend Jahren aus einem einzigen Fels gehauen, steht allein in der Wüste.',
      },
      ru: {
        city: 'Аль-Ула',
        landmark: 'Каср аль-Фарид, Хегра',
        description:
          'Каср аль-Фарид в Хегре — набатейская гробница, высеченная из цельной скалы две тысячи лет назад, стоит одна в пустыне.',
      },
      it: {
        city: 'AlUla',
        landmark: 'Qasr al-Farid, Hegra',
        description:
          'Qasr al-Farid a Hegra, tomba nabatea scolpita duemila anni fa in un unico masso, sola nel deserto aperto.',
      },
    },
  },
  {
    id: 'london',
    countryCode: 'GB',
    timezone: 'Europe/London',
    latitude: 51.5074,
    longitude: -0.1278,
    image: commons('Tower%20Bridge%20from%20the%20Shard%20London%20Bridge.%20Evening%202019-09-22.jpg'),
    credit: credit('Tower%20Bridge%20from%20the%20Shard%20London%20Bridge.%20Evening%202019-09-22.jpg'),
    aliases: [
      'لندن', 'لندن الكبرى', 'london',
    ],
    copy: {
      ar: {
        city: 'لندن',
        landmark: 'برج لندن وبيغ بن',
        description:
          'جسر برج لندن يفتح ذراعيه فوق نهر التايمز منذ 1894، وعلى مرمى النظر يقف بيغ بن حارساً على مقاعد البرلمان. في الغسق يتحول النهر إلى مرآة تنعكس عليها أضواء المدينة.',
      },
      en: {
        city: 'London',
        landmark: 'Tower Bridge and Big Ben',
        description:
          'Tower Bridge has been opening its arms over the Thames since 1894, with Big Ben keeping watch over the Houses of Parliament just upstream. At dusk the river becomes a mirror for the city’s lights.',
      },
      de: {
        city: 'London',
        landmark: 'Tower Bridge und Big Ben',
        description:
          'Die Tower Bridge öffnet seit 1894 ihre Flügel über der Themse, während Big Ben flussaufwärts über das Parlament wacht. In der Dämmerung wird der Fluss zum Spiegel der Stadtlichter.',
      },
      ru: {
        city: 'Лондон',
        landmark: 'Тауэрский мост и Биг-Бен',
        description:
          'Тауэрский мост разводит свои крылья над Темзой с 1894 года, а Биг-Бен выше по течению охраняет здание парламента. В сумерках река становится зеркалом городских огней.',
      },
      it: {
        city: 'Londra',
        landmark: 'Tower Bridge e Big Ben',
        description:
          'Il Tower Bridge apre le sue braccia sul Tamigi dal 1894, mentre Big Ben veglia sul Parlamento poco più a monte. Al crepuscolo il fiume diventa lo specchio delle luci della città.',
      },
    },
  },
  {
    id: 'paris',
    countryCode: 'FR',
    timezone: 'Europe/Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    image: commons('Eiffel%20Tower%20sunset%20skyline%20(Unsplash).jpg'),
    credit: credit('Eiffel%20Tower%20sunset%20skyline%20(Unsplash).jpg'),
    aliases: [
      'باريس', 'paris',
    ],
    copy: {
      ar: {
        city: 'باريس',
        landmark: 'برج إيفل',
        description:
          'برج إيفل يرفع 330 متراً من الحديد فوق حدائق شامب دي مارس، وقد رفضه أهل باريس أول الأمر ثم صار رمزها. عند الغروب يشتعل البرج بالذهب فوق أسطح المدينة الرمادية.',
      },
      en: {
        city: 'Paris',
        landmark: 'The Eiffel Tower',
        description:
          'The Eiffel Tower lifts 330 metres of iron above the Champ de Mars; Parisians first rejected it, then made it their symbol. At sunset the tower burns gold above the grey rooftops.',
      },
      de: {
        city: 'Paris',
        landmark: 'Der Eiffelturm',
        description:
          'Der Eiffelturm hebt 330 Meter Eisen über das Champ de Mars; die Pariser lehnten ihn zuerst ab und machten ihn dann zu ihrem Wahrzeichen. Bei Sonnenuntergang glüht er golden über den grauen Dächern.',
      },
      ru: {
        city: 'Париж',
        landmark: 'Эйфелева башня',
        description:
          'Эйфелева башня поднимает 330 метров железа над Марсовым полем; парижане сначала отвергли её, а потом сделали своим символом. На закате башня горит золотом над серыми крышами.',
      },
      it: {
        city: 'Parigi',
        landmark: 'La Torre Eiffel',
        description:
          'La Torre Eiffel solleva 330 metri di ferro sopra il Campo di Marte; i parigini la rifiutarono, poi ne fecero il loro simbolo. Al tramonto brucia d’oro sopra i tetti grigi.',
      },
    },
  },
  {
    id: 'rome',
    countryCode: 'IT',
    timezone: 'Europe/Rome',
    latitude: 41.9028,
    longitude: 12.4964,
    image: commons('Colosseum%20Rome%20at%20evening.JPG'),
    credit: credit('Colosseum%20Rome%20at%20evening.JPG'),
    aliases: [
      'روما', 'rome', 'roma',
    ],
    copy: {
      ar: {
        city: 'روما',
        landmark: 'الكولوسيوم',
        description:
          'الكولوسيوم، أكبر مدرّج في الإمبراطورية الرومانية، كان يتسع لخمسين ألف متفرج قبل ألفي عام. مع غروب الشمس تتحول حجارته إلى لون العنبر ويظهر قوس قسطنطين في الخلف.',
      },
      en: {
        city: 'Rome',
        landmark: 'The Colosseum',
        description:
          'The Colosseum, the largest amphitheatre of the Roman Empire, held fifty thousand spectators two thousand years ago. At sunset its stone turns amber, with the Arch of Constantine behind it.',
      },
      de: {
        city: 'Rom',
        landmark: 'Das Kolosseum',
        description:
          'Das Kolosseum, das größte Amphitheater des Römischen Reiches, fasste vor zweitausend Jahren fünfzigtausend Zuschauer. Bei Sonnenuntergang färbt sich sein Stein bernsteinfarben, dahinter der Konstantinsbogen.',
      },
      ru: {
        city: 'Рим',
        landmark: 'Колизей',
        description:
          'Колизей, крупнейший амфитеатр Римской империи, две тысячи лет назад вмещал пятьдесят тысяч зрителей. На закате его камень становится янтарным, а позади видна арка Константина.',
      },
      it: {
        city: 'Roma',
        landmark: 'Il Colosseo',
        description:
          'Il Colosseo, il più grande anfiteatro dell’Impero romano, duemila anni fa accoglieva cinquantamila spettatori. Al tramonto la sua pietra diventa ambrata, con l’Arco di Costantino sullo sfondo.',
      },
    },
  },
  {
    id: 'istanbul',
    countryCode: 'TR',
    timezone: 'Europe/Istanbul',
    latitude: 41.0082,
    longitude: 28.9784,
    image: commons('Sultan%20Ahmed%20Mosque%20and%20Hagia%20Sophia%20by%20sun%20down.JPG'),
    credit: credit('Sultan%20Ahmed%20Mosque%20and%20Hagia%20Sophia%20by%20sun%20down.JPG'),
    aliases: [
      'إسطنبول', 'اسطنبول', 'استانبول', 'istanbul',
    ],
    copy: {
      ar: {
        city: 'إسطنبول',
        landmark: 'آيا صوفيا ومضيق البوسفور',
        description:
          'آيا صوفيا بقبتها العظيمة تقف على الضفة الأوروبية للبوسفور، ومآذن المدينة ترسم خط الأفق عند الغروب. العبارات تعبر بين قارتين تحت سماء واحدة.',
      },
      en: {
        city: 'Istanbul',
        landmark: 'Hagia Sophia and the Bosphorus',
        description:
          'Hagia Sophia stands on the European shore of the Bosphorus, its great dome above a skyline of minarets at sunset. Ferries cross between two continents under one sky.',
      },
      de: {
        city: 'Istanbul',
        landmark: 'Hagia Sophia und der Bosporus',
        description:
          'Die Hagia Sophia steht am europäischen Ufer des Bosporus, ihre große Kuppel über einer Silhouette aus Minaretten im Abendlicht. Fähren pendeln zwischen zwei Kontinenten unter einem Himmel.',
      },
      ru: {
        city: 'Стамбул',
        landmark: 'Святая София и Босфор',
        description:
          'Святая София стоит на европейском берегу Босфора, её огромный купол поднимается над силуэтом минаретов на закате. Паромы снуют между двумя континентами под одним небом.',
      },
      it: {
        city: 'Istanbul',
        landmark: 'Santa Sofia e il Bosforo',
        description:
          'Santa Sofia si affaccia sulla riva europea del Bosforo, la grande cupola sopra una skyline di minareti al tramonto. I traghetti attraversano tra due continenti sotto lo stesso cielo.',
      },
    },
  },
  {
    id: 'berlin',
    countryCode: 'DE',
    timezone: 'Europe/Berlin',
    latitude: 52.52,
    longitude: 13.405,
    image: commons('Brandenburg%20gate%20Berlin%20at%20night%202022-12-09%2001.jpg'),
    credit: credit('Brandenburg%20gate%20Berlin%20at%20night%202022-12-09%2001.jpg'),
    aliases: [
      'برلين', 'berlin',
    ],
    copy: {
      ar: {
        city: 'برلين',
        landmark: 'بوابة براندنبورغ',
        description:
          'بوابة براندنبورغ، شاهدة على قرنين من تاريخ أوروبا، تغلق محور شارع أونتر دن ليندن. ليلاً تُضاء أعمدتها وتصبح الساحة نقطة التقاء المدينة.',
      },
      en: {
        city: 'Berlin',
        landmark: 'The Brandenburg Gate',
        description:
          'The Brandenburg Gate, witness to two centuries of European history, closes the axis of Unter den Linden. At night its columns are lit and the square becomes the city’s meeting point.',
      },
      de: {
        city: 'Berlin',
        landmark: 'Das Brandenburger Tor',
        description:
          'Das Brandenburger Tor, Zeuge zweier Jahrhunderte europäischer Geschichte, schließt die Achse des Boulevards Unter den Linden. Nachts strahlen seine Säulen im Licht und der Platz wird zum Treffpunkt der Stadt.',
      },
      ru: {
        city: 'Берлин',
        landmark: 'Бранденбургские ворота',
        description:
          'Бранденбургские ворота, свидетели двух веков европейской истории, замыкают ось Унтер-ден-Линден. Ночью их колонны заливает свет, и площадь становится местом встречи города.',
      },
      it: {
        city: 'Berlino',
        landmark: 'La Porta di Brandeburgo',
        description:
          'La Porta di Brandeburgo, testimone di due secoli di storia europea, chiude l’asse di Unter den Linden. Di notte le sue colonne si illuminano e la piazza diventa il punto d’incontro della città.',
      },
    },
  },
  {
    id: 'madrid',
    countryCode: 'ES',
    timezone: 'Europe/Madrid',
    latitude: 40.4168,
    longitude: -3.7038,
    image: commons('Plaza%20Mayor%20-%20Madrid%20-%20Enero%202026%2001.jpg'),
    credit: credit('Plaza%20Mayor%20-%20Madrid%20-%20Enero%202026%2001.jpg'),
    aliases: [
      'مدريد', 'madrid',
    ],
    copy: {
      ar: {
        city: 'مدريد',
        landmark: 'ساحة مايور والقصر الملكي',
        description:
          'ساحة مايور، التي بُنيت في القرن السابع عشر، تحيط بها أروقة من ثلاث طبقات ونوافذ خشبية. مساءً تضيء الفوانيس الحجر وتصدح أصوات الناس حتى منتصف الليل.',
      },
      en: {
        city: 'Madrid',
        landmark: 'Plaza Mayor and the Royal Palace',
        description:
          'Plaza Mayor, laid out in the seventeenth century, is ringed by three storeys of arcades and wooden balconies. In the evening lanterns light the stone and the square stays loud until midnight.',
      },
      de: {
        city: 'Madrid',
        landmark: 'Plaza Mayor und der Königspalast',
        description:
          'Die Plaza Mayor aus dem 17. Jahrhundert wird von drei Stockwerken Arkaden und Holzbalkonen umschlossen. Abends erleuchten Laternen den Stein, und der Platz bleibt bis Mitternacht laut.',
      },
      ru: {
        city: 'Мадрид',
        landmark: 'Пласа-Майор и Королевский дворец',
        description:
          'Пласа-Майор, заложенная в XVII веке, окружена тремя ярусами аркад и деревянными балконами. Вечером фонари освещают камень, и площадь не затихает до полуночи.',
      },
      it: {
        city: 'Madrid',
        landmark: 'Plaza Mayor e il Palazzo Reale',
        description:
          'Plaza Mayor, nata nel Seicento, è circondata da tre ordini di arcate e balconi in legno. La sera i lampioni illuminano la pietra e la piazza resta viva fino a mezzanotte.',
      },
    },
  },
  {
    id: 'barcelona',
    countryCode: 'ES',
    timezone: 'Europe/Madrid',
    latitude: 41.4036,
    longitude: 2.1744,
    image: commons('SF maig 2 cropped.jpg'),
    credit: credit('SF maig 2 cropped.jpg'),
    aliases: [
      'برشلونة', 'برشلونه', 'barcelona', 'ساجرادا', 'sagrada familia', 'la sagrada familia',
    ],
    focus: '50% 28%',
    copy: {
      ar: {
        city: 'برشلونة',
        landmark: 'ساغرادا فاميليا',
        description:
          'كنيسة غاودي التي لم تكتمل بعد: بدأت عام ١٨٨٢ وما زالت تُبنى، أبراجها تتسلّق كأشجار حجرية وأبوابها محفورة حتى آخر تفصيل، وتُرى من كل أرجاء برشلونة.',
      },
      en: {
        city: 'Barcelona',
        landmark: 'The Sagrada Família',
        description:
          'Gaudí’s unfinished basilica, begun in 1882 and still under construction: towers that rise like stone trees and portals carved edge to edge, visible from every part of Barcelona.',
      },
      de: {
        city: 'Barcelona',
        landmark: 'Die Sagrada Família',
        description:
          'Gaudís unvollendete Basilika, 1882 begonnen und bis heute im Bau: Türme, die wie steinerne Bäume wachsen, und bis ins Letzte behauene Portale, von überall in Barcelona zu sehen.',
      },
      ru: {
        city: 'Барселона',
        landmark: 'Саграда Фамилия',
        description:
          'Незаконченная базилика Гауди, начатая в 1882 году и строящаяся до сих пор: башни, поднимающиеся как каменные деревья, и порталы, вырезанные целиком, видны из любой части Барселоны.',
      },
      it: {
        city: 'Barcellona',
        landmark: 'La Sagrada Família',
        description:
          'La basilica incompiuta di Gaudí, iniziata nel 1882 e ancora in costruzione: torri che salgono come alberi di pietra e portali scolpiti in ogni dettaglio, visibili da tutta Barcellona.',
      },
    },
  },
  {
    id: 'moscow',
    countryCode: 'RU',
    timezone: 'Europe/Moscow',
    latitude: 55.7558,
    longitude: 37.6173,
    image: commons('Saint%20Basil\'s%20Cathedral%2C%20Red%20Square%2C%202009-06-19-3.jpg'),
    credit: credit('Saint%20Basil\'s%20Cathedral%2C%20Red%20Square%2C%202009-06-19-3.jpg'),
    aliases: [
      'موسكو', 'moscow', 'moskva',
    ],
    copy: {
      ar: {
        city: 'موسكو',
        landmark: 'كاتدرائية القديس باسيل',
        description:
          'كاتدرائية القديس باسيل بقبابها التسع الملوّنة تغلق الساحة الحمراء، وقد بُنيت بأمر إيفان الرهيب في القرن السادس عشر. في الشتاء يستقر الثلج على القباب ويلمع الطوب الأحمر تحتها.',
      },
      en: {
        city: 'Moscow',
        landmark: 'Saint Basil’s Cathedral',
        description:
          'Saint Basil’s Cathedral and its nine painted domes close the Red Square, built on Ivan the Terrible’s orders in the sixteenth century. In winter snow settles on the domes and the red brick glows beneath.',
      },
      de: {
        city: 'Moskau',
        landmark: 'Die Basilius-Kathedrale',
        description:
          'Die Basilius-Kathedrale mit ihren neun bemalten Kuppeln schließt den Roten Platz; Iwan der Schreckliche ließ sie im 16. Jahrhundert errichten. Im Winter liegt Schnee auf den Kuppeln und der rote Backstein leuchtet.',
      },
      ru: {
        city: 'Москва',
        landmark: 'Собор Василия Блаженного',
        description:
          'Собор Василия Блаженного с девятью расписными куполами замыкает Красную площадь; его построили при Иване Грозном в XVI веке. Зимой снег ложится на купола, а красный кирпич светится.',
      },
      it: {
        city: 'Mosca',
        landmark: 'La Cattedrale di San Basilio',
        description:
          'La Cattedrale di San Basilio con le sue nove cupole dipinte chiude la Piazza Rossa, voluta da Ivan il Terribile nel Cinquecento. D’inverno la neve copre le cupole e il mattone rosso brilla.',
      },
    },
  },
  {
    id: 'amsterdam',
    countryCode: 'NL',
    timezone: 'Europe/Amsterdam',
    latitude: 52.3676,
    longitude: 4.9041,
    image: commons('Amsterdam%20Evening%20-%20Flickr%20-%20radkuch.13.jpg'),
    credit: credit('Amsterdam%20Evening%20-%20Flickr%20-%20radkuch.13.jpg'),
    aliases: [
      'أمستردام', 'امستردام', 'amsterdam',
    ],
    copy: {
      ar: {
        city: 'أمستردام',
        landmark: 'قنوات أمستردام',
        description:
          'قنوات أمستردام، التي حُفرت في القرن السابع عشر، تصطف على جانبيها بيوت تجارية ضيقة بأسقف جملونية. عند الغروب تنعكس الواجهات الطوبية في الماء وتصمت المدينة إلا من صوت الدراجات.',
      },
      en: {
        city: 'Amsterdam',
        landmark: 'Amsterdam’s canals',
        description:
          'Amsterdam’s canals were dug in the seventeenth century, lined with narrow merchant houses under gabled roofs. At dusk the brick facades drop into the water and the city falls quiet except for bicycles.',
      },
      de: {
        city: 'Amsterdam',
        landmark: 'Amsterdams Grachten',
        description:
          'Amsterdams Grachten wurden im 17. Jahrhundert gegraben, gesäumt von schmalen Kaufmannshäusern mit Giebeldächern. In der Dämmerung spiegeln sich die Backsteinfassaden im Wasser, und nur die Fahrräder sind zu hören.',
      },
      ru: {
        city: 'Амстердам',
        landmark: 'Каналы Амстердама',
        description:
          'Каналы Амстердама прорыли в XVII веке; вдоль них стоят узкие купеческие дома с островерхими крышами. В сумерках кирпичные фасады опускаются в воду, и город затихает, кроме велосипедов.',
      },
      it: {
        city: 'Amsterdam',
        landmark: 'I canali di Amsterdam',
        description:
          'I canali di Amsterdam furono scavati nel Seicento, fiancheggiati da strette case mercantili con tetti a frontone. Al crepuscolo le facciate di mattoni scendono nell’acqua e la città tace, salvo le biciclette.',
      },
    },
  },
  {
    id: 'athens',
    countryCode: 'GR',
    timezone: 'Europe/Athens',
    latitude: 37.9838,
    longitude: 23.7275,
    image: commons('Attica%2006-13%20Athens%2050%20View%20from%20Philopappos%20-%20Acropolis%20Hill.jpg'),
    credit: credit('Attica%2006-13%20Athens%2050%20View%20from%20Philopappos%20-%20Acropolis%20Hill.jpg'),
    aliases: [
      'أثينا', 'اثينا', 'athens', 'athina',
    ],
    copy: {
      ar: {
        city: 'أثينا',
        landmark: 'الأكروبوليس',
        description:
          'الأكروبوليس يقف على صخرة ترتفع 156 متراً فوق أثينا، والبارثينون في قمته منذ 2400 عام. عند الغروب يتحول الرخام إلى لون العسل وتمتد المدينة حتى البحر.',
      },
      en: {
        city: 'Athens',
        landmark: 'The Acropolis',
        description:
          'The Acropolis stands on a rock 156 metres above Athens, the Parthenon crowning it for 2,400 years. At sunset the marble turns honey-coloured and the city runs all the way to the sea.',
      },
      de: {
        city: 'Athen',
        landmark: 'Die Akropolis',
        description:
          'Die Akropolis erhebt sich auf einem Felsen 156 Meter über Athen, gekrönt vom Parthenon seit 2.400 Jahren. Bei Sonnenuntergang wird der Marmor honigfarben, und die Stadt reicht bis zum Meer.',
      },
      ru: {
        city: 'Афины',
        landmark: 'Акрополь',
        description:
          'Акрополь стоит на скале в 156 метрах над Афинами, а Парфенон венчает его уже 2400 лет. На закате мрамор становится медовым, и город тянется до самого моря.',
      },
      it: {
        city: 'Atene',
        landmark: 'L’Acropoli',
        description:
          'L’Acropoli si erge su una rocca 156 metri sopra Atene, con il Partenone in cima da 2.400 anni. Al tramonto il marmo diventa color miele e la città corre fino al mare.',
      },
    },
  },
  {
    id: 'new-york',
    countryCode: 'US',
    timezone: 'America/New_York',
    latitude: 40.7128,
    longitude: -74.006,
    image: commons('Statue of Liberty-New York City.jpg'),
    credit: credit('Statue of Liberty-New York City.jpg'),
    aliases: [
      'نيويورك', 'نيو يورك', 'نيويورك سيتي', 'new york', 'new york city', 'manhattan',
      'statue of liberty', 'تمثال الحرية', 'liberty island', 'nyc',
    ],
    focus: '50% 42%',
    copy: {
      ar: {
        city: 'نيويورك',
        landmark: 'تمثال الحرية',
        description:
          'تمثال الحرية نحتٌ نحاسي فرنسي بارتفاع ٩٣ متراً مع قاعدته، أُهدي إلى الولايات المتحدة عام ١٨٨٦ ووقف عند مدخل ميناء نيويورك شاهداً على وصول الملايين. خلفه يرتفع أفق مانهاتن من الماء.',
      },
      en: {
        city: 'New York',
        landmark: 'The Statue of Liberty',
        description:
          'A 93-metre copper figure with its pedestal, a French gift dedicated in 1886, standing at the mouth of New York Harbour as the first thing millions of arrivals saw. Manhattan rises from the water behind it.',
      },
      de: {
        city: 'New York',
        landmark: 'Die Freiheitsstatue',
        description:
          'Eine 93 Meter hohe Kupferfigur samt Sockel, ein französisches Geschenk von 1886, das am Eingang des Hafens von New York steht – das Erste, was Millionen Ankommende sahen. Dahinter wächst Manhattan aus dem Wasser.',
      },
      ru: {
        city: 'Нью-Йорк',
        landmark: 'Статуя Свободы',
        description:
          'Медная статуя высотой 93 метра с постаментом — французский дар 1886 года у входа в нью-йоркскую гавань, первое, что видели миллионы прибывающих. За ней из воды поднимается Манхэттен.',
      },
      it: {
        city: 'New York',
        landmark: 'La Statua della Libertà',
        description:
          'Una figura di rame di 93 metri con il piedistallo, dono francese del 1886, all’ingresso del porto di New York: la prima cosa che videro milioni di arrivi. Dietro, Manhattan sale dall’acqua.',
      },
    },
  },
  {
    id: 'los-angeles',
    countryCode: 'US',
    timezone: 'America/Los_Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
    image: commons('Skyline%20of%20Los%20Angeles%2C%20Downtown%20Los%20Angeles%2C%20California%2013.jpg'),
    credit: credit('Skyline%20of%20Los%20Angeles%2C%20Downtown%20Los%20Angeles%2C%20California%2013.jpg'),
    aliases: [
      'لوس أنجلوس', 'لوس انجلوس', 'los angeles',
    ],
    copy: {
      ar: {
        city: 'لوس أنجلوس',
        landmark: 'أفق وسط المدينة',
        description:
          'وسط لوس أنجلوس يرفع أبراجه الزجاجية من السهل، وخلفه تلال هوليوود بحروفها البيضاء. عند الغروب يتحول الأفق إلى وردي فوق الطرق السريعة.',
      },
      en: {
        city: 'Los Angeles',
        landmark: 'Downtown Los Angeles',
        description:
          'Downtown Los Angeles lifts its glass towers out of the plain, with the Hollywood hills and their white letters behind. At sunset the skyline turns pink above the freeways.',
      },
      de: {
        city: 'Los Angeles',
        landmark: 'Downtown Los Angeles',
        description:
          'Downtown Los Angeles hebt seine Glastürme aus der Ebene, dahinter die Hügel von Hollywood mit ihren weißen Buchstaben. Bei Sonnenuntergang färbt sich die Skyline rosa über den Highways.',
      },
      ru: {
        city: 'Лос-Анджелес',
        landmark: 'Даунтаун Лос-Анджелеса',
        description:
          'Даунтаун Лос-Анджелеса поднимает стеклянные башни над равниной, а позади — холмы Голливуда с белыми буквами. На закате скайлайн становится розовым над автострадами.',
      },
      it: {
        city: 'Los Angeles',
        landmark: 'Il centro di Los Angeles',
        description:
          'Il centro di Los Angeles solleva le sue torri di vetro dalla pianura, con le colline di Hollywood e le loro lettere bianche dietro. Al tramonto la skyline diventa rosa sopra le autostrade.',
      },
    },
  },
  {
    id: 'toronto',
    countryCode: 'CA',
    timezone: 'America/Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    image: commons('Toronto%20Downtown%20West%2C%20August%2020%2C%202009.JPG'),
    credit: credit('Toronto%20Downtown%20West%2C%20August%2020%2C%202009.JPG'),
    aliases: [
      'تورونتو', 'toronto',
    ],
    focus: 'center 60%',
    copy: {
      ar: {
        city: 'تورونتو',
        landmark: 'برج CN',
        description:
          'برج CN يرتفع 553 متراً فوق بحيرة أونتاريو، وكان أطول بناء قائم في العالم عند افتتاحه عام 1976. عند الغروب يقف البرج أسود أمام سماء حمراء وينعكس في الماء.',
      },
      en: {
        city: 'Toronto',
        landmark: 'The CN Tower',
        description:
          'The CN Tower climbs 553 metres above Lake Ontario, the tallest free-standing structure in the world when it opened in 1976. At sunset it stands black against a red sky, mirrored in the lake.',
      },
      de: {
        city: 'Toronto',
        landmark: 'Der CN Tower',
        description:
          'Der CN Tower ragt 553 Meter über den Ontariosee; bei seiner Eröffnung 1976 war er das höchste freistehende Bauwerk der Welt. Bei Sonnenuntergang steht er schwarz vor rotem Himmel und spiegelt sich im See.',
      },
      ru: {
        city: 'Торонто',
        landmark: 'Башня CN',
        description:
          'Башня CN поднимается на 553 метра над озером Онтарио; при открытии в 1976 году она была самым высоким отдельно стоящим сооружением мира. На закате она чернеет на красном небе и отражается в воде.',
      },
      it: {
        city: 'Toronto',
        landmark: 'La CN Tower',
        description:
          'La CN Tower sale 553 metri sopra il lago Ontario; all’inaugurazione nel 1976 era la struttura più alta del mondo. Al tramonto si staglia nera su un cielo rosso e si specchia nel lago.',
      },
    },
  },
  {
    id: 'mexico-city',
    countryCode: 'MX',
    timezone: 'America/Mexico_City',
    latitude: 19.4326,
    longitude: -99.1332,
    image: commons('Palacio%20de%20Bellas%20Artes%2C%20Ciudad%20de%20M%C3%A9xico%2C%20M%C3%A9xico%2C%202015-07-18%2C%20DD%2010.JPG'),
    credit: credit('Palacio%20de%20Bellas%20Artes%2C%20Ciudad%20de%20M%C3%A9xico%2C%20M%C3%A9xico%2C%202015-07-18%2C%20DD%2010.JPG'),
    aliases: [
      'مكسيكو سيتي', 'مكسيكو', 'مكسيكو سيتى', 'mexico city', 'ciudad de mexico',
    ],
    copy: {
      ar: {
        city: 'مكسيكو سيتي',
        landmark: 'قصر الفنون الجميلة',
        description:
          'قصر الفنون الجميلة بقبته البرتقالية وقاعاته الرخامية بُني على أنقاض مدينة الأزتك على ارتفاع 2240 متراً. مساءً تُضاء الواجهة ويظهر البركانان في الأفق البعيد.',
      },
      en: {
        city: 'Mexico City',
        landmark: 'Palacio de Bellas Artes',
        description:
          'The Palacio de Bellas Artes, with its orange dome and marble halls, was built over the ruins of the Aztec city at 2,240 metres. In the evening the facade is lit and the volcanoes show on the far horizon.',
      },
      de: {
        city: 'Mexiko-Stadt',
        landmark: 'Palacio de Bellas Artes',
        description:
          'Der Palacio de Bellas Artes mit seiner orangen Kuppel und den Marmorsälen wurde über den Ruinen der Aztekenstadt errichtet, auf 2.240 Metern Höhe. Abends wird die Fassade angestrahlt, und am fernen Horizont zeigen sich die Vulkane.',
      },
      ru: {
        city: 'Мехико',
        landmark: 'Дворец изящных искусств',
        description:
          'Дворец изящных искусств с оранжевым куполом и мраморными залами построен на руинах города ацтеков на высоте 2240 метров. Вечером фасад подсвечивают, а на дальнем горизонте видны вулканы.',
      },
      it: {
        city: 'Città del Messico',
        landmark: 'Il Palacio de Bellas Artes',
        description:
          'Il Palacio de Bellas Artes, con la cupola arancione e le sale di marmo, fu costruito sulle rovine della città azteca a 2.240 metri. La sera la facciata si illumina e all’orizzonte appaiono i vulcani.',
      },
    },
  },
  {
    id: 'chichen-itza',
    countryCode: 'MX',
    timezone: 'America/Merida',
    latitude: 20.6843,
    longitude: -88.5678,
    image: commons('Chichen Itza 3.jpg'),
    credit: credit('Chichen Itza 3.jpg'),
    aliases: [
      'تشيتشن إيتزا', 'تشيتشن', 'chichen itza', 'chichén itzá', 'el castillo', 'tinum', 'تينوم',
      'يوكاتان', 'yucatan',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'تشيتشن إيتزا',
        landmark: 'معبد الكاستيو',
        description:
          'هرم ماياوي من تسع درجات في بلدية تينوم بولاية يوكاتان، بُني بين القرنين التاسع والثاني عشر. في الاعتدالين تنسحب الظلال على درجاته على هيئة أفعى تنزل نحو الأرض.',
      },
      en: {
        city: 'Chichén Itzá',
        landmark: 'El Castillo',
        description:
          'A nine-terraced Maya pyramid in the municipality of Tinum, Yucatán, built between the ninth and twelfth centuries. At the equinoxes the shadow on its stairs forms a serpent sliding down to the earth.',
      },
      de: {
        city: 'Chichén Itzá',
        landmark: 'El Castillo',
        description:
          'Eine neunstufige Maya-Pyramide in der Gemeinde Tinum, Yucatán, erbaut zwischen dem neunten und zwölften Jahrhundert. Zu den Tagundnachtgleichen bildet der Schatten auf den Stufen eine Schlange, die zur Erde gleitet.',
      },
      ru: {
        city: 'Чичен-Ица',
        landmark: 'Эль-Кастильо',
        description:
          'Майяская пирамида из девяти ярусов в муниципалитете Тинум, Юкатан, построенная между IX и XII веками. В дни равноденствия тень на ступенях складывается в змею, спускающуюся к земле.',
      },
      it: {
        city: 'Chichén Itzá',
        landmark: 'El Castillo',
        description:
          'Una piramide maya a nove terrazze nel comune di Tinum, Yucatán, costruita tra il IX e il XII secolo. Agli equinozi l’ombra sulle scale disegna un serpente che scende verso terra.',
      },
    },
  },
  {
    id: 'rio',
    countryCode: 'BR',
    timezone: 'America/Sao_Paulo',
    latitude: -22.9068,
    longitude: -43.1729,
    image: commons('Rio%20de%20Janeiro%20skyline%20and%20Sugarloaf%20Mountain%20at%20sunset%2C%20Brazil%204.jpg'),
    credit: credit('Rio%20de%20Janeiro%20skyline%20and%20Sugarloaf%20Mountain%20at%20sunset%2C%20Brazil%204.jpg'),
    aliases: [
      'ريو دي جانيرو', 'ريو', 'rio de janeiro', 'rio',
    ],
    copy: {
      ar: {
        city: 'ريو دي جانيرو',
        landmark: 'تمثال المسيح الفادي',
        description:
          'تمثال المسيح الفادي يقف بـ38 متراً على قمة كوركوفادو، ويطل على خليج غوانابارا وجبل السكر. عند الغروب يغطي الضباب الخليج ويبقى التمثال مضاءً فوق السحاب.',
      },
      en: {
        city: 'Rio de Janeiro',
        landmark: 'Christ the Redeemer',
        description:
          'Christ the Redeemer stands 38 metres tall on Corcovado, looking down on Guanabara Bay and Sugarloaf Mountain. At sunset mist fills the bay while the statue stays lit above the clouds.',
      },
      de: {
        city: 'Rio de Janeiro',
        landmark: 'Christus der Erlöser',
        description:
          'Christus der Erlöser steht 38 Meter hoch auf dem Corcovado und blickt über die Guanabara-Bucht und den Zuckerhut. Bei Sonnenuntergang füllt Nebel die Bucht, während die Statue über den Wolken leuchtet.',
      },
      ru: {
        city: 'Рио-де-Жанейро',
        landmark: 'Статуя Христа-Искупителя',
        description:
          'Статуя Христа-Искупителя высотой 38 метров стоит на Корковаду над бухтой Гуанабара и горой Сахарная голова. На закате туман заливает бухту, а статуя продолжает светиться над облаками.',
      },
      it: {
        city: 'Rio de Janeiro',
        landmark: 'Il Cristo Redentore',
        description:
          'Il Cristo Redentore, alto 38 metri, veglia sul Corcovado sopra la baia di Guanabara e il Pan di Zucchero. Al tramonto la foschia riempie la baia mentre la statua resta illuminata sopra le nuvole.',
      },
    },
  },
  {
    id: 'buenos-aires',
    countryCode: 'AR',
    timezone: 'America/Argentina/Buenos_Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    image: commons('Obelisco%20de%20Buenos%20Aires%20(2)%2C%20AA%202014.jpg'),
    credit: credit('Obelisco%20de%20Buenos%20Aires%20(2)%2C%20AA%202014.jpg'),
    aliases: [
      'بوينس آيرس', 'بوينوس ايرس', 'buenos aires',
    ],
    copy: {
      ar: {
        city: 'بوينس آيرس',
        landmark: 'المسلة',
        description:
          'المسلة ترتفع 67 متراً في وسط شارع 9 دي خوليو، أوسع شارع في العالم، منذ 1936. ليلاً يمر تحتها ضوء المسارح وتظل واقفة كعلامة على المدينة.',
      },
      en: {
        city: 'Buenos Aires',
        landmark: 'The Obelisco',
        description:
          'The Obelisco rises 67 metres in the middle of Avenida 9 de Julio, the widest avenue in the world, since 1936. At night the theatre lights pass beneath it and it stays standing as the city’s marker.',
      },
      de: {
        city: 'Buenos Aires',
        landmark: 'Der Obelisk',
        description:
          'Der Obelisk steht seit 1936 mitten auf der Avenida 9 de Julio, der breitesten Straße der Welt, 67 Meter hoch. Nachts ziehen die Lichter der Theater an ihm vorbei, und er bleibt das Wahrzeichen der Stadt.',
      },
      ru: {
        city: 'Буэнос-Айрес',
        landmark: 'Обелиск',
        description:
          'Обелиск высотой 67 метров стоит с 1936 года посреди Авениды 9 Июля, самой широкой улицы мира. Ночью под ним течёт свет театров, а он остаётся знаком города.',
      },
      it: {
        city: 'Buenos Aires',
        landmark: 'L’Obelisco',
        description:
          'L’Obelisco, alto 67 metri, sta dal 1936 in mezzo all’Avenida 9 de Julio, il viale più largo del mondo. Di notte le luci dei teatri scorrono ai suoi piedi e lui resta il segno della città.',
      },
    },
  },
  {
    id: 'tokyo',
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    image: commons('Shinjuku%20nights%20-%20Flickr%20-%20Franck%20Michel.jpg'),
    credit: credit('Shinjuku%20nights%20-%20Flickr%20-%20Franck%20Michel.jpg'),
    aliases: [
      'طوكيو', 'tokyo',
    ],
    copy: {
      ar: {
        city: 'طوكيو',
        landmark: 'برج طوكيو وشيبويا',
        description:
          'طوكيو مدينة من طبقات: أبراج شينجوكو الزجاجية، وبرج طوكيو الأحمر، وشوارع شيبويا التي لا تنام. عند الغروب تشتعل اللافتات النيونية ويصبح الأفق بحراً من الضوء.',
      },
      en: {
        city: 'Tokyo',
        landmark: 'Tokyo Tower and Shibuya',
        description:
          'Tokyo is a city of layers: the glass towers of Shinjuku, the red lattice of Tokyo Tower, and the streets of Shibuya that never sleep. At dusk the neon comes on and the skyline becomes a sea of light.',
      },
      de: {
        city: 'Tokio',
        landmark: 'Tokyo Tower und Shibuya',
        description:
          'Tokio ist eine Stadt aus Schichten: die Glastürme von Shinjuku, das rote Gitter des Tokyo Tower und die Straßen von Shibuya, die nie schlafen. In der Dämmerung springt das Neon an, und der Horizont wird zu einem Meer aus Licht.',
      },
      ru: {
        city: 'Токио',
        landmark: 'Токийская башня и Сибуя',
        description:
          'Токио — город слоёв: стеклянные башни Синдзюку, красная решётка Токийской башни и улицы Сибуи, которые не спят. В сумерках загорается неон, и горизонт становится морем света.',
      },
      it: {
        city: 'Tokyo',
        landmark: 'La Tokyo Tower e Shibuya',
        description:
          'Tokyo è una città a strati: le torri di vetro di Shinjuku, il reticolo rosso della Tokyo Tower e le strade di Shibuya che non dormono mai. Al crepuscolo si accende il neon e la skyline diventa un mare di luce.',
      },
    },
  },
  {
    id: 'fujiyoshida',
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    latitude: 35.4875,
    longitude: 138.8078,
    image: commons('Chureito Pagoda, Fujiyoshida (34126027751).jpg'),
    credit: credit('Chureito Pagoda, Fujiyoshida (34126027751).jpg'),
    aliases: [
      'فوجي', 'فوجيوشيدا', 'جبل فوجي', 'fuji', 'mount fuji', 'mt fuji', 'fujiyoshida',
      'chureito', 'تشوري تو',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'فوجيوشيدا',
        landmark: 'جبل فوجي من معبد تشوري-تو',
        description:
          'من سطح معبد تشوري-تو في فوجيوشيدا يظهر جبل فوجي، أعلى قمم اليابان عند ٣٧٧٦ متراً، خلف الباغودا الخمسة، وفي الربيع يغطّي الكرز المدرّجات المؤدية إليه.',
      },
      en: {
        city: 'Fujiyoshida',
        landmark: 'Mount Fuji from Chureito Pagoda',
        description:
          'From the Chureito Pagoda in Fujiyoshida, Mount Fuji — Japan’s highest peak at 3,776 metres — rises behind the five-storey pagoda, with cherry trees stepping down the hillside in spring.',
      },
      de: {
        city: 'Fujiyoshida',
        landmark: 'Der Fuji von der Chureito-Pagode',
        description:
          'Von der Chureito-Pagode in Fujiyoshida steigt der Fuji, mit 3.776 Metern Japans höchster Gipfel, hinter der fünfstöckigen Pagode auf; im Frühling blühen die Kirschbäume am Hang.',
      },
      ru: {
        city: 'Фудзиёсида',
        landmark: 'Фудзи и пагода Тюрэйто',
        description:
          'С пагоды Тюрэйто в Фудзиёсиде гора Фудзи — высочайшая вершина Японии, 3776 метров — поднимается за пятиэтажной пагодой, а весной склон покрывается сакурой.',
      },
      it: {
        city: 'Fujiyoshida',
        landmark: 'Il Monte Fuji dalla pagoda Chureito',
        description:
          'Dalla pagoda Chureito di Fujiyoshida il Monte Fuji — la vetta più alta del Giappone, 3.776 metri — si alza dietro la pagoda a cinque piani, con i ciliegi che scendono lungo il pendio in primavera.',
      },
    },
  },
  {
    id: 'beijing',
    countryCode: 'CN',
    timezone: 'Asia/Shanghai',
    latitude: 39.9042,
    longitude: 116.4074,
    image: commons('Badaling China Great-Wall-of-China-01.jpg'),
    credit: credit('Badaling China Great-Wall-of-China-01.jpg'),
    aliases: [
      'بكين', 'بيجينغ', 'beijing', 'peking', 'great wall', 'the great wall', 'سور الصين العظيم',
      'badaling', 'بادالينغ',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'بكين',
        landmark: 'سور الصين العظيم في بادالينغ',
        description:
          'سور حجري يمتد آلاف الكيلومترات على قمم شمال الصين، بُني وأُعيد بناؤه على مدى قرون لحماية الحدود. مقطع بادالينغ، على سبعين كيلومتراً من بكين، هو الأشهر: أبراج وممرات تتسلّق الجبال حتى الأفق.',
      },
      en: {
        city: 'Beijing',
        landmark: 'The Great Wall at Badaling',
        description:
          'A stone wall running thousands of kilometres along the ridges of northern China, built and rebuilt over centuries to guard the frontier. The Badaling stretch, seventy kilometres from Beijing, is the best known: watchtowers and walkways climbing into the hills.',
      },
      de: {
        city: 'Peking',
        landmark: 'Die Chinesische Mauer bei Badaling',
        description:
          'Eine Steinmauer, die über Tausende Kilometer den Graten Nordchinas folgt und über Jahrhunderte gebaut und erneuert wurde. Der Abschnitt bei Badaling, siebzig Kilometer von Peking entfernt, ist der berühmteste: Wachtürme und Wege, die in die Berge steigen.',
      },
      ru: {
        city: 'Пекин',
        landmark: 'Великая Китайская стена в Бадалинге',
        description:
          'Каменная стена длиной в тысячи километров идёт по хребтам северного Китая, её строили и перестраивали веками. Участок Бадалин в семидесяти километрах от Пекина — самый известный: башни и пролёты, поднимающиеся в горы.',
      },
      it: {
        city: 'Pechino',
        landmark: 'La Grande Muraglia a Badaling',
        description:
          'Una muraglia di pietra che corre per migliaia di chilometri lungo i crinali del nord della Cina, costruita e ricostruita per secoli. Il tratto di Badaling, a settanta chilometri da Pechino, è il più celebre: torri e camminamenti che salgono tra i monti.',
      },
    },
  },
  {
    id: 'shanghai',
    countryCode: 'CN',
    timezone: 'Asia/Shanghai',
    latitude: 31.2304,
    longitude: 121.4737,
    image: commons('Lujiazui%20skyline%20by%20night%20from%20Bund%2C%20fully%20illuminated.jpg'),
    credit: credit('Lujiazui%20skyline%20by%20night%20from%20Bund%2C%20fully%20illuminated.jpg'),
    aliases: [
      'شنغهاي', 'شانغهاي', 'shanghai',
    ],
    copy: {
      ar: {
        city: 'شنغهاي',
        landmark: 'أفق بودونغ',
        description:
          'أفق بودونغ يجمع برج شنغهاي وبرج اللؤلؤة الشرقية وبرج جينماو، ثلاثة أجيال من الأبراج على ضفة واحدة. ليلاً تنعكس الأضواء في نهر هوانغبو وتتحول الواجهة إلى شاشة.',
      },
      en: {
        city: 'Shanghai',
        landmark: 'The Pudong skyline',
        description:
          'The Pudong skyline holds the Shanghai Tower, the Oriental Pearl and the Jin Mao — three generations of towers on one riverbank. At night they pour their lights into the Huangpu and the waterfront becomes a screen.',
      },
      de: {
        city: 'Shanghai',
        landmark: 'Die Skyline von Pudong',
        description:
          'Die Skyline von Pudong vereint den Shanghai Tower, die Oriental Pearl und den Jin Mao — drei Turm-Generationen an einem Ufer. Nachts fließen ihre Lichter in den Huangpu, und die Uferpromenade wird zur Leinwand.',
      },
      ru: {
        city: 'Шанхай',
        landmark: 'Скайлайн Пудуна',
        description:
          'В скайлайне Пудуна — Шанхайская башня, «Восточная жемчужина» и Цзинь Мао: три поколения башен на одном берегу. Ночью их свет стекает в Хуанпу, и набережная становится экраном.',
      },
      it: {
        city: 'Shanghai',
        landmark: 'La skyline di Pudong',
        description:
          'La skyline di Pudong riunisce la Shanghai Tower, la Oriental Pearl e la Jin Mao: tre generazioni di torri su una sola riva. Di notte le loro luci si riversano nello Huangpu e il lungofiume diventa uno schermo.',
      },
    },
  },
  {
    id: 'seoul',
    countryCode: 'KR',
    timezone: 'Asia/Seoul',
    latitude: 37.5796,
    longitude: 126.977,
    image: commons('Gyeonghoeru (Royal Banquet Hall) at Gyeongbokgung Palace, Seoul.jpg'),
    credit: credit('Gyeonghoeru (Royal Banquet Hall) at Gyeongbokgung Palace, Seoul.jpg'),
    aliases: [
      'سيول', 'سول', 'seoul', 'gyeongbokgung', 'قصر جيونغ بوك',
    ],
    copy: {
      ar: {
        city: 'سيول',
        landmark: 'قصر جيونغ بوك',
        description:
          'قصر سلالة جوسون الذي بُني عام 1395 عند سفح جبل بوغاك، وفيه قاعة العرش وبحيرة هيانغوونجيونغ. الحرّاس بزيّهم التقليدي يتبادلون الحراسة أمام بوابته كل ساعة.',
      },
      en: {
        city: 'Seoul',
        landmark: 'Gyeongbokgung Palace',
        description:
          'The Joseon palace built in 1395 at the foot of Bugaksan, with the throne hall and the Hyangwonjeong pavilion on its pond. Guards in traditional dress change at its gate every hour.',
      },
      de: {
        city: 'Seoul',
        landmark: 'Der Gyeongbokgung-Palast',
        description:
          'Der Palast der Joseon-Dynastie, 1395 am Fuß des Bugaksan errichtet, mit Thronhalle und dem Pavillon Hyangwonjeong auf seinem Teich. Vor dem Tor wechselt stündlich die Wache in traditioneller Kleidung.',
      },
      ru: {
        city: 'Сеул',
        landmark: 'Дворец Кёнбоккун',
        description:
          'Дворец династии Чосон, построенный в 1395 году у подножия Пугаксана: тронный зал и павильон Хянгвонджон на пруду. У ворот каждый час сменяется караул в традиционной одежде.',
      },
      it: {
        city: 'Seul',
        landmark: 'Il palazzo Gyeongbokgung',
        description:
          'Il palazzo della dinastia Joseon, costruito nel 1395 ai piedi del Bugaksan, con la sala del trono e il padiglione Hyangwonjeong sul laghetto. Davanti al cancello ogni ora cambia la guardia in abiti tradizionali.',
      },
    },
  },
  {
    id: 'singapore',
    countryCode: 'SG',
    timezone: 'Asia/Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    image: commons('Singapore%20(SG)%2C%20ArtScience%20Museum%20and%20Marina%20Bay%20Sands%20Hotel%20--%202019%20--%204679.jpg'),
    credit: credit('Singapore%20(SG)%2C%20ArtScience%20Museum%20and%20Marina%20Bay%20Sands%20Hotel%20--%202019%20--%204679.jpg'),
    aliases: [
      'سنغافورة', 'سنغفورة', 'singapore',
    ],
    copy: {
      ar: {
        city: 'سنغافورة',
        landmark: 'مارينا باي ساندز',
        description:
          'مارينا باي ساندز يرفع ثلاثة أبراج وسطحاً يشبه سفينة من قلب الماء في وسط المدينة. ليلاً تُضاء الحدائق والزهرة البيضاء وتنعكس في الخليج.',
      },
      en: {
        city: 'Singapore',
        landmark: 'Marina Bay Sands',
        description:
          'Marina Bay Sands raises three towers and a ship-like roof deck out of the water in the heart of the city. At night the gardens and the white lotus pavilion light up and drop into the bay.',
      },
      de: {
        city: 'Singapur',
        landmark: 'Marina Bay Sands',
        description:
          'Marina Bay Sands hebt drei Türme und ein schiffsartiges Dach aus dem Wasser im Herzen der Stadt. Nachts leuchten die Gärten und der weiße Lotus-Pavillon und spiegeln sich in der Bucht.',
      },
      ru: {
        city: 'Сингапур',
        landmark: 'Marina Bay Sands',
        description:
          'Marina Bay Sands поднимает три башни и крышу-корабль прямо из воды в центре города. Ночью загораются сады и белый павильон-лотос, отражаясь в заливе.',
      },
      it: {
        city: 'Singapore',
        landmark: 'Marina Bay Sands',
        description:
          'Marina Bay Sands solleva tre torri e una terrazza a forma di nave dall’acqua nel cuore della città. Di notte i giardini e il padiglione bianco a loto si illuminano e si riflettono nella baia.',
      },
    },
  },
  {
    id: 'bangkok',
    countryCode: 'TH',
    timezone: 'Asia/Bangkok',
    latitude: 13.7563,
    longitude: 100.5018,
    image: commons('Chakra Maha Prasat Throne Hall Grand Palace Bangkok aerial photo by Don Ramey Logan.jpg'),
    credit: credit('Chakra Maha Prasat Throne Hall Grand Palace Bangkok aerial photo by Don Ramey Logan.jpg'),
    aliases: [
      'بانكوك', 'بانكوك تايلاند', 'bangkok', 'grand palace', 'القصر الكبير', 'القصر الملكي',
      'wat phra kaew', 'معبد الزمرد',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'بانكوك',
        landmark: 'القصر الكبير ومعبد الزمرد',
        description:
          'مجمع القصر الكبير على ضفة نهر تشاو فرايا، مقرّ ملوك تايلاند منذ ١٧٨٢: أسطح مذهّبة وبروج ملوّنة وقاعات تمرّ بالزائر إلى معبد الزمرد، أقدس مزار بوذي في البلاد.',
      },
      en: {
        city: 'Bangkok',
        landmark: 'The Grand Palace and the Emerald Buddha',
        description:
          'The Grand Palace complex on the Chao Phraya, home of Thai kings since 1782: gilded roofs, coloured spires and halls that lead to Wat Phra Kaew, the holiest Buddhist shrine in the country.',
      },
      de: {
        city: 'Bangkok',
        landmark: 'Der Große Palast und der Smaragd-Buddha',
        description:
          'Der Palastkomplex am Chao Phraya, seit 1782 Residenz der thailändischen Könige: vergoldete Dächer, bunte Spitzen und Hallen, die zum Wat Phra Kaew führen, dem heiligsten buddhistischen Heiligtum des Landes.',
      },
      ru: {
        city: 'Бангкок',
        landmark: 'Большой дворец и Изумрудный Будда',
        description:
          'Дворцовый комплекс на Чао-Прайе, резиденция тайских королей с 1782 года: золочёные крыши, разноцветные шпили и залы, ведущие к Ват Пхра Кеу — главной буддийской святыне страны.',
      },
      it: {
        city: 'Bangkok',
        landmark: 'Il Grande Palazzo e il Buddha di Smeraldo',
        description:
          'Il complesso del Grande Palazzo sul Chao Phraya, residenza dei re thailandesi dal 1782: tetti dorati, guglie colorate e sale che portano al Wat Phra Kaew, il santuario buddhista più sacro del paese.',
      },
    },
  },
  {
    id: 'mumbai',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    latitude: 19.076,
    longitude: 72.8777,
    image: commons('Gateway%20of%20India%20in%20the%20evening%2C%20Mumbai%2C%20India.jpg'),
    credit: credit('Gateway%20of%20India%20in%20the%20evening%2C%20Mumbai%2C%20India.jpg'),
    aliases: [
      'مومباي', 'بومباي', 'mumbai', 'bombay',
    ],
    copy: {
      ar: {
        city: 'مومباي',
        landmark: 'بوابة الهند',
        description:
          'بوابة الهند، القوس البازلتي الذي بُني عام 1924 على واجهة البحر، تقف عند نهاية شارع كولابا. مساءً يتحول الحجر إلى برتقالي عميق تحت أضواء الميناء.',
      },
      en: {
        city: 'Mumbai',
        landmark: 'The Gateway of India',
        description:
          'The Gateway of India, the basalt arch raised in 1924 on the waterfront, closes the end of Colaba. In the evening the stone turns deep orange under the harbour lights.',
      },
      de: {
        city: 'Mumbai',
        landmark: 'Das Gateway of India',
        description:
          'Das Gateway of India, der 1924 am Wasser errichtete Basaltbogen, schließt das Ende von Colaba. Abends wird der Stein unter den Hafenlichtern tief orange.',
      },
      ru: {
        city: 'Мумбаи',
        landmark: 'Ворота Индии',
        description:
          'Ворота Индии — базальтовая арка 1924 года на набережной — замыкают Коллабу. Вечером камень становится глубоко-оранжевым в свете порта.',
      },
      it: {
        city: 'Mumbai',
        landmark: 'Il Gateway of India',
        description:
          'Il Gateway of India, l’arco di basalto eretto nel 1924 sul lungomare, chiude Colaba. La sera la pietra diventa arancio intenso sotto le luci del porto.',
      },
    },
  },
  {
    id: 'delhi',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    latitude: 28.6139,
    longitude: 77.209,
    image: commons('India%20Gate%20on%20an%20evening.jpg'),
    credit: credit('India%20Gate%20on%20an%20evening.jpg'),
    aliases: [
      'نيودلهي', 'نيو دلهي', 'دلهي', 'new delhi', 'delhi',
    ],
    copy: {
      ar: {
        city: 'نيودلهي',
        landmark: 'بوابة الهند التذكارية',
        description:
          'بوابة الهند التذكارية، القوس الحجري الذي يبلغ 42 متراً، تغلق محور شارع كارتافيا في قلب العاصمة. عند الغروب يتوهج الحجر الرملي وتمتلئ المروج بالناس.',
      },
      en: {
        city: 'New Delhi',
        landmark: 'India Gate',
        description:
          'India Gate, the 42-metre stone arch, closes the Kartavya Path axis at the heart of the capital. At sunset the sandstone glows and the lawns fill with people.',
      },
      de: {
        city: 'Neu-Delhi',
        landmark: 'Das India Gate',
        description:
          'Das India Gate, der 42 Meter hohe Steinbogen, schließt die Achse des Kartavya Path im Herzen der Hauptstadt. Bei Sonnenuntergang glüht der Sandstein und die Rasenflächen füllen sich.',
      },
      ru: {
        city: 'Нью-Дели',
        landmark: 'Монумент India Gate',
        description:
          'Монумент India Gate — 42-метровая каменная арка — замыкает ось Картавья-Патх в центре столицы. На закате песчаник светится, а газоны заполняются людьми.',
      },
      it: {
        city: 'Nuova Delhi',
        landmark: 'India Gate',
        description:
          'India Gate, l’arco di pietra alto 42 metri, chiude l’asse di Kartavya Path nel cuore della capitale. Al tramonto l’arenaria brilla e i prati si riempiono di gente.',
      },
    },
  },
  {
    id: 'agra',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    latitude: 27.1751,
    longitude: 78.0421,
    image: commons('Aks The Reflection Taj Mahal.jpg'),
    credit: credit('Aks The Reflection Taj Mahal.jpg'),
    aliases: [
      'أغرا', 'agra', 'تاج محل', 'taj mahal',
    ],
    focus: '50% 40%',
    copy: {
      ar: {
        city: 'أغرا',
        landmark: 'تاج محل',
        description:
          'ضريح من الرخام الأبيض بناه شاه جهان لزوجته ممتاز محل على ضفة نهر يامونا واكتمل عام ١٦٥٣. عند الفجر تلتقي القبّة بانعكاسها في الماء، فيبدو المبنى معلّقاً بين سماءين.',
      },
      en: {
        city: 'Agra',
        landmark: 'The Taj Mahal',
        description:
          'A white marble tomb raised by Shah Jahan for his wife Mumtaz Mahal on the Yamuna and finished in 1653. At dawn the dome meets its reflection, and the building seems suspended between two skies.',
      },
      de: {
        city: 'Agra',
        landmark: 'Das Taj Mahal',
        description:
          'Ein Grabmal aus weißem Marmor, das Shah Jahan für seine Frau Mumtaz Mahal am Yamuna errichten ließ und 1653 vollendete. Im Morgengrauen treffen Kuppel und Spiegelbild aufeinander, und das Bauwerk schwebt zwischen zwei Himmeln.',
      },
      ru: {
        city: 'Агра',
        landmark: 'Тадж-Махал',
        description:
          'Белый мраморный мавзолей, возведённый Шах-Джаханом для жены Мумтаз-Махал на берегу Джамны и завершённый в 1653 году. На рассвете купол встречается со своим отражением, и здание словно висит между двумя небесами.',
      },
      it: {
        city: 'Agra',
        landmark: 'Il Taj Mahal',
        description:
          'Un mausoleo di marmo bianco fatto costruire da Shah Jahan per la moglie Mumtaz Mahal sullo Yamuna e ultimato nel 1653. All’alba la cupola incontra il suo riflesso, e l’edificio sembra sospeso tra due cieli.',
      },
    },
  },
  {
    id: 'kuala-lumpur',
    countryCode: 'MY',
    timezone: 'Asia/Kuala_Lumpur',
    latitude: 3.139,
    longitude: 101.6869,
    image: commons('Kuala%20Lumpur%2C%20Malaysia%2C%20Petronas%20Towers%20at%20night%2C%20glitter.jpg'),
    credit: credit('Kuala%20Lumpur%2C%20Malaysia%2C%20Petronas%20Towers%20at%20night%2C%20glitter.jpg'),
    aliases: [
      'كوالالمبور', 'كوالا لمبور', 'kuala lumpur',
    ],
    copy: {
      ar: {
        city: 'كوالالمبور',
        landmark: 'أبراج بتروناس',
        description:
          'أبراج بتروناس التوأم ترتفع 452 متراً، ويصل بينهما جسر مزدوج في الطابق الحادي والأربعين. ليلاً تلمع واجهاتها الفولاذية فوق حدائق KLCC.',
      },
      en: {
        city: 'Kuala Lumpur',
        landmark: 'The Petronas Towers',
        description:
          'The Petronas Towers rise 452 metres and are joined by a double skybridge on the forty-first floor. At night their steel skins shine above the KLCC park.',
      },
      de: {
        city: 'Kuala Lumpur',
        landmark: 'Die Petronas Towers',
        description:
          'Die Petronas Towers ragen 452 Meter hoch und sind durch eine doppelte Himmelsbrücke im 41. Stock verbunden. Nachts glänzen ihre Stahlfassaden über dem KLCC-Park.',
      },
      ru: {
        city: 'Куала-Лумпур',
        landmark: 'Башни Петронас',
        description:
          'Башни Петронас поднимаются на 452 метра, их соединяет двойной мост на 41-м этаже. Ночью стальные фасады сияют над парком KLCC.',
      },
      it: {
        city: 'Kuala Lumpur',
        landmark: 'Le Petronas Towers',
        description:
          'Le Petronas Towers salgono per 452 metri e sono unite da un doppio ponte al quarantunesimo piano. Di notte le facciate d’acciaio brillano sopra il parco KLCC.',
      },
    },
  },
  {
    id: 'jakarta',
    countryCode: 'ID',
    timezone: 'Asia/Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    image: commons('Jakarta%20Panorama.jpg'),
    credit: credit('Jakarta%20Panorama.jpg'),
    aliases: [
      'جاكرتا', 'jakarta',
    ],
    copy: {
      ar: {
        city: 'جاكرتا',
        landmark: 'نصب موناس الوطني',
        description:
          'نصب موناس الوطني يرتفع 137 متراً في قلب جاكرتا، وفي قمته شعلة مطلية بالذهب. عند الغروب تتحول المدينة إلى بحر من الأضواء تحت سماء استوائية سريعة المطر.',
      },
      en: {
        city: 'Jakarta',
        landmark: 'The National Monument',
        description:
          'The National Monument rises 137 metres in the heart of Jakarta, a gold-covered flame at its tip. At sunset the city becomes a sea of lights under a fast-moving tropical sky.',
      },
      de: {
        city: 'Jakarta',
        landmark: 'Das Nationaldenkmal',
        description:
          'Das Nationaldenkmal ragt 137 Meter in das Herz von Jakarta, eine vergoldete Flamme an der Spitze. Bei Sonnenuntergang wird die Stadt zu einem Meer aus Lichtern unter einem schnellen Tropenhimmel.',
      },
      ru: {
        city: 'Джакарта',
        landmark: 'Национальный монумент',
        description:
          'Национальный монумент поднимается на 137 метров в центре Джакарты, его вершину венчает позолоченное пламя. На закате город становится морем огней под быстрым тропическим небом.',
      },
      it: {
        city: 'Giacarta',
        landmark: 'Il Monumento Nazionale',
        description:
          'Il Monumento Nazionale sale 137 metri nel cuore di Giacarta, con una fiamma dorata in cima. Al tramonto la città diventa un mare di luci sotto un cielo tropicale in movimento.',
      },
    },
  },
  {
    id: 'sydney',
    countryCode: 'AU',
    timezone: 'Australia/Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    image: commons('Sydney%20Opera%20House%20and%20Harbour%20Bridge%20Dusk%20(2)%202019-06-21.jpg'),
    credit: credit('Sydney%20Opera%20House%20and%20Harbour%20Bridge%20Dusk%20(2)%202019-06-21.jpg'),
    aliases: [
      'سيدني', 'sydney',
    ],
    copy: {
      ar: {
        city: 'سيدني',
        landmark: 'دار الأوبرا',
        description:
          'دار أوبرا سيدني بأصدافها البيضاء تجلس على الماء في الخليج، وخلفها يقوس جسر الميناء. عند الغروب تتحول الأصداف إلى وردي وتضاء من الداخل.',
      },
      en: {
        city: 'Sydney',
        landmark: 'The Opera House',
        description:
          'The Sydney Opera House sits on the water with its white shells, and the Harbour Bridge arcs behind it. At sunset the shells turn pink and are lit from within.',
      },
      de: {
        city: 'Sydney',
        landmark: 'Das Opernhaus',
        description:
          'Das Opernhaus von Sydney liegt mit seinen weißen Schalen am Wasser, dahinter spannt sich die Harbour Bridge. Bei Sonnenuntergang werden die Schalen rosa und leuchten von innen.',
      },
      ru: {
        city: 'Сидней',
        landmark: 'Сиднейский оперный театр',
        description:
          'Сиднейский оперный театр с белыми «парусами» стоит у самой воды, а позади изгибается мост Харбор-Бридж. На закате паруса розовеют и светятся изнутри.',
      },
      it: {
        city: 'Sydney',
        landmark: 'La Sydney Opera House',
        description:
          'La Sydney Opera House con le sue conchiglie bianche siede sull’acqua, e dietro si incurva l’Harbour Bridge. Al tramonto le conchiglie diventano rosa e si illuminano dall’interno.',
      },
    },
  },
  {
    id: 'cape-town',
    countryCode: 'ZA',
    timezone: 'Africa/Johannesburg',
    latitude: -33.9249,
    longitude: 18.4241,
    image: commons('Cape%20Town%20dawn%20cityscape%20with%20Table%20Mountain.jpg'),
    credit: credit('Cape%20Town%20dawn%20cityscape%20with%20Table%20Mountain.jpg'),
    aliases: [
      'كيب تاون', 'كيب تاون جنوب أفريقيا', 'cape town',
    ],
    copy: {
      ar: {
        city: 'كيب تاون',
        landmark: 'جبل الطاولة',
        description:
          'جبل الطاولة، بقمته المسطحة على ارتفاع 1085 متراً، يقف خلف المدينة كأنه مائدة عملاقة. عند الفجر تتدفق سحابة الطاولة الشهيرة على الحافة ويسقط ضوء وردي على الشوارع.',
      },
      en: {
        city: 'Cape Town',
        landmark: 'Table Mountain',
        description:
          'Table Mountain, its flat summit 1,085 metres high, rises behind the city like a giant table. At dawn its famous tablecloth cloud pours over the edge and pink light falls on the streets.',
      },
      de: {
        city: 'Kapstadt',
        landmark: 'Der Tafelberg',
        description:
          'Der Tafelberg mit seinem 1.085 Meter hohen Plateau steht hinter der Stadt wie ein riesiger Tisch. Im Morgengrauen wälzt sich die berühmte Wolkendecke über die Kante und rosa Licht fällt auf die Straßen.',
      },
      ru: {
        city: 'Кейптаун',
        landmark: 'Столовая гора',
        description:
          'Столовая гора с плоской вершиной высотой 1085 метров поднимается за городом, как гигантский стол. На рассвете её знаменитая облачная «скатерть» переливается через край, и на улицы падает розовый свет.',
      },
      it: {
        city: 'Città del Capo',
        landmark: 'La Table Mountain',
        description:
          'La Table Mountain, con la sua cima piatta a 1.085 metri, si alza dietro la città come un tavolo gigante. All’alba la sua celebre tovaglia di nuvole si riversa oltre il bordo e una luce rosa cade sulle strade.',
      },
    },
  },
  {
    id: 'lagos',
    countryCode: 'NG',
    timezone: 'Africa/Lagos',
    latitude: 6.5244,
    longitude: 3.3792,
    image: commons('A%20long%20Exposure%20of%20the%20Third%20Mainland%20bridge%20in%20front%20of%20University%20of%20lagos.jpg'),
    credit: credit('A%20long%20Exposure%20of%20the%20Third%20Mainland%20bridge%20in%20front%20of%20University%20of%20lagos.jpg'),
    aliases: [
      'لاغوس', 'لاجوس', 'lagos',
    ],
    copy: {
      ar: {
        city: 'لاغوس',
        landmark: 'جسر ثيرد مينلاند',
        description:
          'جسر ثيرد مينلاند، أطول جسر في أفريقيا بطول 11.8 كيلومتر، يعبر بحيرة لاغوس ويربط الجزيرة بالبر الرئيسي. ليلاً يتحول إلى خط من الضوء فوق ماء أسود.',
      },
      en: {
        city: 'Lagos',
        landmark: 'Third Mainland Bridge',
        description:
          'Third Mainland Bridge, the longest in Africa at 11.8 kilometres, crosses Lagos Lagoon and links the island to the mainland. At night it becomes a line of light over black water.',
      },
      de: {
        city: 'Lagos',
        landmark: 'Die Third Mainland Bridge',
        description:
          'Die Third Mainland Bridge, mit 11,8 Kilometern die längste Brücke Afrikas, überquert die Lagune von Lagos und verbindet die Insel mit dem Festland. Nachts wird sie zu einer Linie aus Licht über schwarzem Wasser.',
      },
      ru: {
        city: 'Лагос',
        landmark: 'Третий мост через лагуну',
        description:
          'Третий мост через лагуну — самый длинный в Африке, 11,8 километра — соединяет остров с материком. Ночью он превращается в линию света над чёрной водой.',
      },
      it: {
        city: 'Lagos',
        landmark: 'Il Third Mainland Bridge',
        description:
          'Il Third Mainland Bridge, il più lungo d’Africa con 11,8 chilometri, attraversa la laguna di Lagos e collega l’isola alla terraferma. Di notte diventa una linea di luce sull’acqua nera.',
      },
    },
  },
  {
    id: 'nairobi',
    countryCode: 'KE',
    timezone: 'Africa/Nairobi',
    latitude: -1.2921,
    longitude: 36.8219,
    image: commons('Buffalo%20Nairobi%20Skyline%20Savannah%20Kenya%20May19%20R1600769.jpg'),
    credit: credit('Buffalo%20Nairobi%20Skyline%20Savannah%20Kenya%20May19%20R1600769.jpg'),
    aliases: [
      'نيروبي', 'nairobi',
    ],
    copy: {
      ar: {
        city: 'نيروبي',
        landmark: 'أفق نيروبي',
        description:
          'نيروبي هي العاصمة الوحيدة التي تجاور محمية طبيعية كاملة، وأفقها يرتفع خلف سهول السافانا مباشرة. عند الغروب يهبط الضوء الذهبي على العشب وتبدو المدينة بعيدة كسراب.',
      },
      en: {
        city: 'Nairobi',
        landmark: 'The Nairobi skyline',
        description:
          'Nairobi is the only capital that borders a full national park, and its skyline rises directly behind the savannah. At sunset gold light falls on the grass and the city looks as distant as a mirage.',
      },
      de: {
        city: 'Nairobi',
        landmark: 'Die Skyline von Nairobi',
        description:
          'Nairobi ist die einzige Hauptstadt, die an einen vollständigen Nationalpark grenzt, und ihre Skyline steigt direkt hinter der Savanne auf. Bei Sonnenuntergang fällt goldenes Licht auf das Gras, und die Stadt wirkt fern wie eine Fata Morgana.',
      },
      ru: {
        city: 'Найроби',
        landmark: 'Скайлайн Найроби',
        description:
          'Найроби — единственная столица, граничащая с целым национальным парком, и её скайлайн поднимается прямо за саванной. На закате золотой свет ложится на траву, и город кажется далёким миражом.',
      },
      it: {
        city: 'Nairobi',
        landmark: 'La skyline di Nairobi',
        description:
          'Nairobi è l’unica capitale che confina con un parco nazionale intero, e la sua skyline sale subito dietro la savana. Al tramonto la luce dorata cade sull’erba e la città sembra lontana come un miraggio.',
      },
    },
  },
  {
    id: 'karachi',
    countryCode: 'PK',
    timezone: 'Asia/Karachi',
    latitude: 24.8607,
    longitude: 67.0011,
    image: commons('Mazar-e-Quaid%20Karachi.jpg'),
    credit: credit('Mazar-e-Quaid%20Karachi.jpg'),
    aliases: [
      'كراتشي', 'karachi',
    ],
    copy: {
      ar: {
        city: 'كراتشي',
        landmark: 'ضريح قائد أعظم',
        description:
          'ضريح قائد أعظم بقبته البيضاء من الرخام يقف على تل فوق كراتشي منذ 1971. عند الغروب يلمع الرخام الأبيض ويبدو الضريح كأنه يطفو فوق المدينة.',
      },
      en: {
        city: 'Karachi',
        landmark: 'Mazar-e-Quaid',
        description:
          'Mazar-e-Quaid, its white marble dome, has stood on a hill above Karachi since 1971. At sunset the marble shines and the mausoleum seems to float above the city.',
      },
      de: {
        city: 'Karatschi',
        landmark: 'Das Mazar-e-Quaid',
        description:
          'Das Mazar-e-Quaid mit seiner weißen Marmorkuppel steht seit 1971 auf einem Hügel über Karatschi. Bei Sonnenuntergang glänzt der Marmor, und das Mausoleum scheint über der Stadt zu schweben.',
      },
      ru: {
        city: 'Карачи',
        landmark: 'Мавзолей Мазар-э-Кайд',
        description:
          'Мавзолей Мазар-э-Кайд с белым мраморным куполом стоит на холме над Карачи с 1971 года. На закате мрамор сияет, и мавзолей словно парит над городом.',
      },
      it: {
        city: 'Karachi',
        landmark: 'Il Mazar-e-Quaid',
        description:
          'Il Mazar-e-Quaid, con la cupola di marmo bianco, sta su una collina sopra Karachi dal 1971. Al tramonto il marmo brilla e il mausoleo sembra galleggiare sopra la città.',
      },
    },
  },
  {
    id: 'kinderdijk',
    countryCode: 'NL',
    timezone: 'Europe/Amsterdam',
    latitude: 51.8842,
    longitude: 4.6389,
    image: commons('KinderdijkMolens02.jpg'),
    credit: credit('KinderdijkMolens02.jpg'),
    aliases: [
      'كيندردايك', 'كندردايك', 'kinderdijk',
    ],
    copy: {
      ar: {
        city: 'كيندردايك',
        landmark: 'طواحين كيندردايك',
        description:
          'تسع عشرة طاحونة هوائية بُنيت حول 1740 ما زالت تضخ الماء من الأراضي المنخفضة، مصطفّة على الجداول التي تصبّ في نهر ليك. عند الغروب تقف على ماء ساكن ولا يبقى في القصب إلا صوت الريح.',
      },
      en: {
        city: 'Kinderdijk',
        landmark: 'The Kinderdijk windmills',
        description:
          'Nineteen windmills built around 1740 still pump water off the low fields, strung along the canals that drain into the Lek. At dusk they stand on still water and the wind is the only sound in the reeds.',
      },
      de: {
        city: 'Kinderdijk',
        landmark: 'Die Windmühlen von Kinderdijk',
        description:
          'Neunzehn um 1740 erbaute Windmühlen pumpen noch immer Wasser aus den tiefen Feldern, aufgereiht an den Kanälen zur Lek. In der Dämmerung stehen sie am stillen Wasser, und im Schilf ist nur der Wind zu hören.',
      },
      ru: {
        city: 'Киндердейк',
        landmark: 'Мельницы Киндердейка',
        description:
          'Девятнадцать мельниц, построенных около 1740 года, до сих пор откачивают воду с низких полей вдоль каналов, ведущих к Леку. В сумерках они стоят над тихой водой, и в камышах слышен только ветер.',
      },
      it: {
        city: 'Kinderdijk',
        landmark: 'I mulini di Kinderdijk',
        description:
          'Diciannove mulini costruiti attorno al 1740 pompano ancora l’acqua dai campi bassi, allineati lungo i canali che portano al Lek. Al tramonto stanno sull’acqua ferma e nei canneti resta solo il vento.',
      },
    },
  },
  {
    id: 'zermatt',
    countryCode: 'CH',
    timezone: 'Europe/Zurich',
    latitude: 46.0207,
    longitude: 7.7491,
    image: commons('Matterhorn_from_Domhütte_-_2.jpg'),
    credit: credit('Matterhorn_from_Domhütte_-_2.jpg'),
    aliases: [
      'زيرمات', 'زرمات', 'zermatt', 'matterhorn', 'ماترهورن',
    ],
    copy: {
      ar: {
        city: 'زيرمات',
        landmark: 'قمة ماترهورن',
        description:
          'هرم من الجرانيت يرتفع 4478 متراً فوق زيرمات، القرية الخالية من السيارات في وادي ماتر. في الصباح الباكر يتورّد وجهه الشمالي بينما يبقى الوادي في الظل.',
      },
      en: {
        city: 'Zermatt',
        landmark: 'The Matterhorn',
        description:
          'A 4,478-metre granite pyramid above Zermatt, a village with no cars in the Matter valley. Early in the morning its north face turns pink while the valley stays in shadow.',
      },
      de: {
        city: 'Zermatt',
        landmark: 'Das Matterhorn',
        description:
          'Eine 4.478 Meter hohe Granitpyramide über Zermatt, einem autofreien Dorf im Mattertal. Früh am Morgen färbt sich die Nordwand rosa, während das Tal noch im Schatten liegt.',
      },
      ru: {
        city: 'Церматт',
        landmark: 'Маттерхорн',
        description:
          'Гранитная пирамида высотой 4 478 метров над Церматтом, деревней без автомобилей в долине Маттер. Ранним утром северная стена розовеет, а долина остаётся в тени.',
      },
      it: {
        city: 'Zermatt',
        landmark: 'Il Cervino',
        description:
          'Una piramide di granito di 4.478 metri sopra Zermatt, paese senza auto nella Mattertal. Al mattino presto la parete nord si colora di rosa mentre la valle resta in ombra.',
      },
    },
  },
  {
    id: 'vienna',
    countryCode: 'AT',
    timezone: 'Europe/Vienna',
    latitude: 48.1845,
    longitude: 16.3122,
    image: commons('Wien_-_Schloss_Schönbrunn.JPG'),
    credit: credit('Wien_-_Schloss_Schönbrunn.JPG'),
    aliases: [
      'فيينا', 'vienna', 'wien', 'schönbrunn', 'schonbrunn', 'شونبرون',
    ],
    copy: {
      ar: {
        city: 'فيينا',
        landmark: 'قصر شونبرون',
        description:
          'قصر هايزبورغ الصيفي الذي صمّمه فيشر فون إرلاخ في نهاية القرن السابع عشر: 1441 غرفة وحدائق هندسية تصعد إلى تل غلوريت. عند الغروب يصعد الناس التل ليروا القصر في ضوء منخفض.',
      },
      en: {
        city: 'Vienna',
        landmark: 'Schönbrunn Palace',
        description:
          'The Habsburg summer palace, designed by Fischer von Erlach at the end of the seventeenth century: 1,441 rooms and formal gardens climbing to the Gloriette. At sunset people walk up the hill to see the palace in low light.',
      },
      de: {
        city: 'Wien',
        landmark: 'Schloss Schönbrunn',
        description:
          'Das Sommerpalais der Habsburger, Ende des 17. Jahrhunderts von Fischer von Erlach entworfen: 1.441 Räume und barocke Gärten bis zur Gloriette. Bei Sonnenuntergang gehen die Menschen auf den Hügel, um das Schloss im flachen Licht zu sehen.',
      },
      ru: {
        city: 'Вена',
        landmark: 'Дворец Шёнбрунн',
        description:
          'Летний дворец Габсбургов, спроектированный Фишером фон Эрлахом в конце XVII века: 1 441 зал и регулярные сады, поднимающиеся к Глориетте. На закате люди поднимаются на холм, чтобы увидеть дворец в низком свете.',
      },
      it: {
        city: 'Vienna',
        landmark: 'La reggia di Schönbrunn',
        description:
          'La residenza estiva degli Asburgo, progettata da Fischer von Erlach alla fine del Seicento: 1.441 stanze e giardini formali che salgono alla Gloriette. Al tramonto la gente sale sulla collina per vedere il palazzo nella luce bassa.',
      },
    },
  },
  {
    id: 'lisbon',
    countryCode: 'PT',
    timezone: 'Europe/Lisbon',
    latitude: 38.6916,
    longitude: -9.216,
    image: commons('Torre_Belém_April_2009-4a.jpg'),
    credit: credit('Torre_Belém_April_2009-4a.jpg'),
    aliases: [
      'لشبونة', 'لشبونه', 'lisbon', 'lisboa', 'lisbona', 'torre de belém',
    ],
    copy: {
      ar: {
        city: 'لشبونة',
        landmark: 'برج بيليم',
        description:
          'برج من عصر الاكتشافات اكتمل عام 1519 على ضفة نهر تاجة ليحرس ميناء لشبونة. حجره المنحوت كالحبال وشرفاته المطلة على الماء جعلته رمزاً للبرتغال.',
      },
      en: {
        city: 'Lisbon',
        landmark: 'Belém Tower',
        description:
          'A tower from the Age of Discovery, finished in 1519 on the Tagus to guard the harbour of Lisbon. Stone carved to look like ropes and a terrace over the water made it the emblem of Portugal.',
      },
      de: {
        city: 'Lissabon',
        landmark: 'Der Torre de Belém',
        description:
          'Ein Turm aus dem Zeitalter der Entdeckungen, 1519 am Tejo vollendet, um den Hafen von Lissabon zu schützen. Wie Taue gehauener Stein und die Terrasse über dem Wasser machten ihn zum Wahrzeichen Portugals.',
      },
      ru: {
        city: 'Лиссабон',
        landmark: 'Башня Белен',
        description:
          'Башня эпохи Великих географических открытий, достроенная в 1519 году на Тежу для защиты лиссабонской гавани. Камень, вырезанный как канаты, и терраса над водой сделали её символом Португалии.',
      },
      it: {
        city: 'Lisbona',
        landmark: 'La Torre di Belém',
        description:
          'Una torre dell’età delle scoperte, completata nel 1519 sul Tago per difendere il porto di Lisbona. La pietra intagliata come corde e la terrazza sull’acqua l’hanno resa l’emblema del Portogallo.',
      },
    },
  },
  {
    id: 'cusco',
    countryCode: 'PE',
    timezone: 'America/Lima',
    latitude: -13.5319,
    longitude: -71.9675,
    image: commons('Machu_Picchu,_2023_(012).jpg'),
    credit: credit('Machu_Picchu,_2023_(012).jpg'),
    aliases: [
      'كوسكو', 'كوزكو', 'cusco', 'cuzco', 'machu picchu', 'ماتشو بيتشو',
    ],
    copy: {
      ar: {
        city: 'كوسكو',
        landmark: 'ماتشو بيتشو',
        description:
          'قلعة الإنكا على حافة جرف على ارتفاع 2430 متراً، بين قمم الأنديز ووادي أوروبامبا. بُنيت من حجارة تنتظم دون ملاط قبل نحو ستة قرون، وظلّت مجهولة للعالم حتى 1911.',
      },
      en: {
        city: 'Cusco',
        landmark: 'Machu Picchu',
        description:
          'An Inca citadel on a ridge at 2,430 metres, between Andean peaks and the Urubamba valley. Built of stone fitted without mortar some six centuries ago, it stayed unknown to the world until 1911.',
      },
      de: {
        city: 'Cusco',
        landmark: 'Machu Picchu',
        description:
          'Eine Inkafestung auf einem Grat auf 2.430 Metern, zwischen Andengipfeln und dem Urubamba-Tal. Vor rund sechs Jahrhunderten ohne Mörtel gefügt, blieb sie bis 1911 unbekannt.',
      },
      ru: {
        city: 'Куско',
        landmark: 'Мачу-Пикчу',
        description:
          'Крепость инков на гребне высотой 2 430 метров между вершинами Анд и долиной Урубамбы. Сложенная из камня без раствора около шести веков назад, она оставалась неизвестной до 1911 года.',
      },
      it: {
        city: 'Cusco',
        landmark: 'Machu Picchu',
        description:
          'Una cittadella inca su un crinale a 2.430 metri, tra le vette andine e la valle dell’Urubamba. Costruita in pietra senza malta circa sei secoli fa, rimase sconosciuta al mondo fino al 1911.',
      },
    },
  },
  {
    id: 'magelang',
    countryCode: 'ID',
    timezone: 'Asia/Jakarta',
    latitude: -7.4698,
    longitude: 110.2177,
    image: commons('Borobudur Sunrise and Volcano View.jpg'),
    credit: credit('Borobudur Sunrise and Volcano View.jpg'),
    aliases: [
      'ماجيلانج', 'ماجيلانغ', 'magelang', 'borobudur', 'بوروبودور',
    ],
    copy: {
      ar: {
        city: 'ماجيلانج',
        landmark: 'معبد بوروبودور',
        description:
          'أكبر معبد بوذي في العالم، بُني في القرن التاسع من ست طبقات مربعة وثلاث دائرية تحمل 504 تماثيل بوذا. عند الفجر يرتفع الضباب عن الوادي ويظهر بركان ميرابي خلف المعبد.',
      },
      en: {
        city: 'Magelang',
        landmark: 'Borobudur',
        description:
          'The largest Buddhist temple in the world, raised in the ninth century as six square terraces and three round ones carrying 504 Buddha figures. At dawn mist lifts off the valley and Mount Merapi appears behind it.',
      },
      de: {
        city: 'Magelang',
        landmark: 'Borobudur',
        description:
          'Der größte buddhistische Tempel der Welt, im 9. Jahrhundert aus sechs quadratischen und drei runden Terrassen mit 504 Buddha-Figuren errichtet. Im Morgengrauen steigt der Nebel aus dem Tal, und der Merapi erscheint dahinter.',
      },
      ru: {
        city: 'Магеланг',
        landmark: 'Боробудур',
        description:
          'Крупнейший буддийский храм мира, возведённый в IX веке: шесть квадратных и три круглых террасы с 504 статуями Будды. На рассвете туман поднимается из долины, и за храмом показывается Мерапи.',
      },
      it: {
        city: 'Magelang',
        landmark: 'Borobudur',
        description:
          'Il più grande tempio buddhista del mondo, eretto nel IX secolo con sei terrazze quadrate e tre circolari che portano 504 figure di Buddha. All’alba la nebbia sale dalla valle e dietro appare il Merapi.',
      },
    },
  },
  {
    id: 'prague',
    countryCode: 'CZ',
    timezone: 'Europe/Prague',
    latitude: 50.0865,
    longitude: 14.4114,
    image: commons('Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg'),
    credit: credit('Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg'),
    aliases: [
      'براغ', 'براج', 'prague', 'praha', 'praga', 'charles bridge', 'جسر تشارلز',
    ],
    copy: {
      ar: {
        city: 'براغ',
        landmark: 'جسر تشارلز',
        description:
          'بدأ بناء الجسر عام 1357 ليصل البلدة القديمة بقلعة براغ عبر نهر فلتافا، وتنتصب على جانبيه ثلاثون منحوتة. في الصباح الباكر يخلو من الزحام ويستقر ضوء الفجر على الحجر.',
      },
      en: {
        city: 'Prague',
        landmark: 'Charles Bridge',
        description:
          'Begun in 1357 to link the Old Town with Prague Castle across the Vltava, with thirty statues along its parapet. Early in the morning it empties of crowds and dawn light sits on the stone.',
      },
      de: {
        city: 'Prag',
        landmark: 'Die Karlsbrücke',
        description:
          '1357 begonnen, um die Altstadt über die Moldau mit der Prager Burg zu verbinden, mit dreißig Statuen an der Brüstung. Früh am Morgen leert sie sich, und das Morgenlicht liegt auf dem Stein.',
      },
      ru: {
        city: 'Прага',
        landmark: 'Карлов мост',
        description:
          'Мост начали строить в 1357 году, чтобы связать Старый город с Пражским градом через Влтаву; на парапете тридцать статуй. Ранним утром толпа расходится, и рассветный свет ложится на камень.',
      },
      it: {
        city: 'Praga',
        landmark: 'Il Ponte Carlo',
        description:
          'Iniziato nel 1357 per collegare la Città Vecchia al Castello di Praga attraverso la Moldava, con trenta statue sulla balaustra. Al mattino presto si svuota e la luce dell’alba resta sulla pietra.',
      },
    },
  },
  {
    id: 'budapest',
    countryCode: 'HU',
    timezone: 'Europe/Budapest',
    latitude: 47.5072,
    longitude: 19.0457,
    image: commons('Hungarian_Parliament_Building_from_across_the_Danube,_2025-01-11.jpg'),
    credit: credit('Hungarian_Parliament_Building_from_across_the_Danube,_2025-01-11.jpg'),
    aliases: [
      'بودابست', 'بودابيست', 'budapest', 'hungarian parliament',
    ],
    copy: {
      ar: {
        city: 'بودابست',
        landmark: 'مبنى البرلمان الهنغاري',
        description:
          'مبنى قوطي جديد اكتمل عام 1904 على ضفة الدانوب، بقبة مركزية و691 غرفة وأبراج مستوحاة من العمارة القوطية الإنجليزية. ليلاً يضاء بكامله وينعكس في النهر.',
      },
      en: {
        city: 'Budapest',
        landmark: 'The Hungarian Parliament',
        description:
          'A neo-Gothic parliament finished in 1904 on the Danube, with a central dome, 691 rooms and spires borrowed from English Gothic. At night it is lit end to end and doubled in the river.',
      },
      de: {
        city: 'Budapest',
        landmark: 'Das ungarische Parlament',
        description:
          'Ein neugotisches Parlament, 1904 an der Donau vollendet, mit Kuppel, 691 Räumen und Türmen nach englischem Vorbild. Nachts ist es ganz beleuchtet und verdoppelt sich im Fluss.',
      },
      ru: {
        city: 'Будапешт',
        landmark: 'Здание венгерского парламента',
        description:
          'Неоготический парламент, достроенный в 1904 году на Дунае: центральный купол, 691 зал и шпили в духе английской готики. Ночью он освещён целиком и повторяется в реке.',
      },
      it: {
        city: 'Budapest',
        landmark: 'Il Parlamento ungherese',
        description:
          'Un parlamento neogotico completato nel 1904 sul Danubio, con cupola centrale, 691 stanze e guglie di gusto gotico inglese. Di notte è illuminato per intero e si raddoppia nel fiume.',
      },
    },
  },
  {
    id: 'krakow',
    countryCode: 'PL',
    timezone: 'Europe/Warsaw',
    latitude: 50.054,
    longitude: 19.9354,
    image: commons('Wawel_(4).jpg'),
    credit: credit('Wawel_(4).jpg'),
    aliases: [
      'كراكوف', 'كراكاو', 'krakow', 'kraków', 'cracow', 'krakau', 'wawel', 'فافل',
    ],
    copy: {
      ar: {
        city: 'كراكوف',
        landmark: 'قلعة فافل',
        description:
          'مقر ملوك بولندا على تل فوق نهر فيستولا، وفيه كاتدرائية تاجوا فيها قروناً وفناء نهضوي من القرن السادس عشر. تحت القلعة يمتد كهف التنين الذي يحرس المدينة في الحكاية.',
      },
      en: {
        city: 'Krakow',
        landmark: 'Wawel Castle',
        description:
          'The seat of Poland’s kings on a hill above the Vistula, with the cathedral where they were crowned and a Renaissance courtyard. Below it runs the dragon’s cave that guards the city in legend.',
      },
      de: {
        city: 'Krakau',
        landmark: 'Das Wawel-Schloss',
        description:
          'Der Sitz der polnischen Könige auf einem Hügel über der Weichsel, mit der Krönungskathedrale und einem Renaissance-Innenhof. Darunter liegt die Drachenhöhle, die in der Sage die Stadt bewacht.',
      },
      ru: {
        city: 'Краков',
        landmark: 'Вавельский замок',
        description:
          'Резиденция польских королей на холме над Вислой: собор, где их короновали, и ренессансный двор. Под холмом — пещера дракона, который в легенде охраняет город.',
      },
      it: {
        city: 'Cracovia',
        landmark: 'Il castello del Wawel',
        description:
          'La sede dei re di Polonia su una collina sopra la Vistola, con la cattedrale delle incoronazioni e un cortile rinascimentale. Sotto corre la grotta del drago che nella leggenda protegge la città.',
      },
    },
  },
  {
    id: 'cliffs-of-moher',
    countryCode: 'IE',
    timezone: 'Europe/Dublin',
    latitude: 52.9715,
    longitude: -9.4309,
    image: commons('Cliffs-Of-Moher-OBriens-From-South.JPG'),
    credit: credit('Cliffs-Of-Moher-OBriens-From-South.JPG'),
    aliases: [
      'منحدرات موهر', 'مقاطعة كلير', 'cliffs of moher', 'moher', 'county clare',
    ],
    copy: {
      ar: {
        city: 'مقاطعة كلير',
        landmark: 'منحدرات موهر',
        description:
          'جرف بحري يرتفع 214 متراً فوق المحيط الأطلسي على الساحل الغربي لأيرلندا. على قمته برج أوبراين الذي بُني عام 1835، وفي الأيام الصافية تظهر جزر آران في الأفق.',
      },
      en: {
        city: 'County Clare',
        landmark: 'The Cliffs of Moher',
        description:
          'Sea cliffs rising 214 metres straight out of the Atlantic on Ireland’s west coast, with O’Brien’s Tower built in 1835 on the highest point. On clear days the Aran Islands sit on the horizon.',
      },
      de: {
        city: 'County Clare',
        landmark: 'Die Cliffs of Moher',
        description:
          '214 Meter hohe Klippen, die an Irlands Westküste senkrecht in den Atlantik fallen; auf dem höchsten Punkt steht O’Brien’s Tower von 1835. An klaren Tagen liegen die Aran-Inseln am Horizont.',
      },
      ru: {
        city: 'Графство Клэр',
        landmark: 'Скалы Мохер',
        description:
          'Скалы высотой 214 метров, отвесно падающие в Атлантику на западе Ирландии; на высшей точке стоит башня О’Брайена, построенная в 1835 году. В ясные дни на горизонте видны Аранские острова.',
      },
      it: {
        city: 'Contea di Clare',
        landmark: 'Le Cliffs of Moher',
        description:
          'Falesie alte 214 metri che cadono a picco sull’Atlantico sulla costa occidentale irlandese, con la O’Brien’s Tower del 1835 sul punto più alto. Nelle giornate limpide all’orizzonte si vedono le isole Aran.',
      },
    },
  },
  {
    id: 'brussels',
    countryCode: 'BE',
    timezone: 'Europe/Brussels',
    latitude: 50.8467,
    longitude: 4.3525,
    image: commons('Grand-Place,_Brussels_-_panorama,_June_2018.jpg'),
    credit: credit('Grand-Place,_Brussels_-_panorama,_June_2018.jpg'),
    aliases: [
      'بروكسل', 'بروكسيل', 'brussels', 'bruxelles', 'brüssel', 'grand place',
    ],
    copy: {
      ar: {
        city: 'بروكسل',
        landmark: 'الساحة الكبرى',
        description:
          'ساحة تحيط بها بيوت النقابات من القرون الوسطى أعيد بناؤها بعد قصف 1695، ويقف في صدرها برج البلدية بارتفاع 96 متراً. كل سنتين في آب/أغسطس تُفرش الحجارة ببساط من زهور البغونية.',
      },
      en: {
        city: 'Brussels',
        landmark: 'The Grand-Place',
        description:
          'A square enclosed by medieval guildhalls rebuilt after the 1695 bombardment, with the 96-metre town hall spire at its head. Every second August the stones are covered with a carpet of begonias.',
      },
      de: {
        city: 'Brüssel',
        landmark: 'Der Grand-Place',
        description:
          'Ein Platz, umschlossen von mittelalterlichen Zunfthäusern, die nach dem Beschuss von 1695 neu errichtet wurden; vorn steht der 96 Meter hohe Rathausturm. Jeden zweiten August liegt ein Teppich aus Begonien auf dem Pflaster.',
      },
      ru: {
        city: 'Брюссель',
        landmark: 'Гранд-Плас',
        description:
          'Площадь в кольце средневековых цеховых домов, отстроенных после обстрела 1695 года; впереди — 96-метровая башня ратуши. Каждые два года в августе камни покрывает ковёр из бегоний.',
      },
      it: {
        city: 'Bruxelles',
        landmark: 'La Grand-Place',
        description:
          'Una piazza chiusa tra le case delle corporazioni medievali ricostruite dopo il bombardamento del 1695, con la torre del municipio alta 96 metri. Ogni due anni in agosto le pietre si coprono di un tappeto di begonie.',
      },
    },
  },
  {
    id: 'stockholm',
    countryCode: 'SE',
    timezone: 'Europe/Stockholm',
    latitude: 59.3268,
    longitude: 18.0717,
    image: commons('The_Royal_Palace_(15891592359).jpg'),
    credit: credit('The_Royal_Palace_(15891592359).jpg'),
    aliases: [
      'ستوكهولم', 'stockholm', 'stockholms slott',
    ],
    copy: {
      ar: {
        city: 'ستوكهولم',
        landmark: 'القصر الملكي',
        description:
          'أكبر قصر في أوروبا ما زال مسكناً ملكياً: 1430 غرفة خلف واجهة بُنيت بين 1697 و1760 على الماء. ليلاً يضاء وجهه الجنوبي وينعكس في الميناء القديم.',
      },
      en: {
        city: 'Stockholm',
        landmark: 'The Royal Palace',
        description:
          'The largest palace in Europe still used as a royal residence: 1,430 rooms behind a facade built between 1697 and 1760 on the water. At night its south front is lit and doubled in the old harbour.',
      },
      de: {
        city: 'Stockholm',
        landmark: 'Das Königliche Schloss',
        description:
          'Das größte Schloss Europas, das noch als Residenz dient: 1.430 Räume hinter einer Fassade von 1697 bis 1760 am Wasser. Nachts ist die Südfront beleuchtet und spiegelt sich im alten Hafen.',
      },
      ru: {
        city: 'Стокгольм',
        landmark: 'Королевский дворец',
        description:
          'Крупнейший дворец Европы, до сих пор служащий резиденцией: 1 430 залов за фасадом, построенным между 1697 и 1760 годами у воды. Ночью южный фасад подсвечен и повторяется в Старой гавани.',
      },
      it: {
        city: 'Stoccolma',
        landmark: 'Il Palazzo Reale',
        description:
          'Il più grande palazzo d’Europa ancora residenza reale: 1.430 stanze dietro una facciata costruita tra il 1697 e il 1760 sull’acqua. Di notte la fronte sud è illuminata e si raddoppia nel porto vecchio.',
      },
    },
  },
  {
    id: 'geiranger',
    countryCode: 'NO',
    timezone: 'Europe/Oslo',
    latitude: 62.101,
    longitude: 7.2065,
    image: commons('Geirangerfjord_.jpg'),
    credit: credit('Geirangerfjord_.jpg'),
    aliases: [
      'جيرانجير', 'غيرانغير', 'geiranger', 'geirangerfjord',
    ],
    copy: {
      ar: {
        city: 'جيرانجير',
        landmark: 'مضيق جيرانجير',
        description:
          'فرع من مضيق ستورفيورد يبلغ عمقه 260 متراً بين جدران ترتفع 1700 متر، وفيه شلالات «الأخوات السبع». القرية على الضفة تعيش على العبّارات وسفن الصيف.',
      },
      en: {
        city: 'Geiranger',
        landmark: 'Geirangerfjord',
        description:
          'A branch of the Storfjord 260 metres deep between walls that rise 1,700 metres, with the Seven Sisters falls dropping into it. The village on the shore lives by the ferries and the summer ships.',
      },
      de: {
        city: 'Geiranger',
        landmark: 'Der Geirangerfjord',
        description:
          'Ein 260 Meter tiefer Arm des Storfjords zwischen Wänden, die 1.700 Meter aufragen, mit den Sieben Schwestern, die hineinfallen. Das Dorf am Ufer lebt von Fähren und Sommerschiffen.',
      },
      ru: {
        city: 'Гейрангер',
        landmark: 'Гейрангер-фьорд',
        description:
          'Ответвление Стур-фьорда глубиной 260 метров между стенами высотой 1 700 метров, с водопадом «Семь сестёр». Деревня на берегу живёт паромами и летними судами.',
      },
      it: {
        city: 'Geiranger',
        landmark: 'Il Geirangerfjord',
        description:
          'Un ramo dello Storfjord profondo 260 metri tra pareti alte 1.700 metri, con le Sette Sorelle che vi cadono dentro. Il villaggio sulla riva vive di traghetti e navi estive.',
      },
    },
  },
  {
    id: 'copenhagen',
    countryCode: 'DK',
    timezone: 'Europe/Copenhagen',
    latitude: 55.6929,
    longitude: 12.5993,
    image: commons('KleineMeerjungfrauUndAmagerBakke001.jpg'),
    credit: credit('KleineMeerjungfrauUndAmagerBakke001.jpg'),
    aliases: [
      'كوبنهاغن', 'كوبنهاجن', 'copenhagen', 'københavn',
      'kobenhavn', 'denmark', 'الدنمارك', 'little mermaid',
      'the little mermaid', 'حورية البحر الصغيرة', 'حورية البحر', 'langelinie',
    ],
    focus: '50% 55%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'كوبنهاغن',
        landmark: 'حورية البحر الصغيرة',
        description:
          'تمثال برونزي صغير لحورية بحر على صخرة عند ميناء لانغيلينيه، أهداه كارل جاكوبسن للمدينة عام ١٩١٣ ونحته إدفارد إريكسن. يجلس التمثال على حجر عند حافة الماء ويواجه المدخل البحري.',
      },
      en: {
        city: 'Copenhagen',
        landmark: 'The Little Mermaid',
        description:
          'A small bronze mermaid on a granite rock at the Langelinie waterfront, given to the city by Carl Jacobsen in 1913 and sculpted by Edvard Eriksen. She sits at the water’s edge facing the harbour entrance.',
      },
      de: {
        city: 'Kopenhagen',
        landmark: 'Die kleine Meerjungfrau',
        description:
          'Eine kleine Bronzemeerjungfrau auf einem Granitfelsen am Langelinie-Ufer, 1913 von Carl Jacobsen gestiftet und von Edvard Eriksen geschaffen. Sie sitzt am Wasser und blickt zur Hafeneinfahrt.',
      },
      ru: {
        city: 'Копенгаген',
        landmark: 'Русалочка',
        description:
          'Маленькая бронзовая русалочка на гранитной скале у набережной Лангелиние, подаренная городу Карлом Якобсеном в 1913 году и созданная Эдвардом Эриксеном. Она сидит у самой воды лицом к входу в гавань.',
      },
      it: {
        city: 'Copenaghen',
        landmark: 'La Sirenetta',
        description:
          'Una piccola sirena di bronzo su una roccia di granito sul lungomare di Langelinie, donata alla città da Carl Jacobsen nel 1913 e scolpita da Edvard Eriksen. Siede sull’acqua davanti all’ingresso del porto.',
      },
    },
  },
  {
    id: 'helsinki',
    countryCode: 'FI',
    timezone: 'Europe/Helsinki',
    latitude: 60.1704,
    longitude: 24.9522,
    image: commons('Helsinki Senate Square and Helsinki Cathedral in May 2026.jpg'),
    credit: credit('Helsinki Senate Square and Helsinki Cathedral in May 2026.jpg'),
    aliases: [
      'هلسنكي', 'helsinki', 'helsingfors', 'finland',
      'فنلندا', 'helsinki cathedral', 'كاتدرائية هلسنكي', 'tuomiokirkko',
    ],
    focus: '50% 42%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'هلسنكي',
        landmark: 'كاتدرائية هلسنكي',
        description:
          'كاتدرائية إنجيلية بيضاء بقبة خضراء وأربع قباب صغيرة تعلو سلالم واسعة في ساحة سيناتينتوري. صمّمها كارل لودفيغ إنجل واكتملت عام ١٨٥٢، وهي رمز المدينة.',
      },
      en: {
        city: 'Helsinki',
        landmark: 'Helsinki Cathedral',
        description:
          'A white Lutheran cathedral with a green dome and four smaller domes above the broad steps of Senate Square. Designed by Carl Ludvig Engel and finished in 1852, it is the city’s symbol.',
      },
      de: {
        city: 'Helsinki',
        landmark: 'Dom von Helsinki',
        description:
          'Eine weiße evangelische Kathedrale mit grüner Kuppel und vier kleineren Kuppeln über der breiten Treppe des Senatsplatzes. Carl Ludvig Engel entwarf sie; 1852 vollendet, ist sie das Wahrzeichen der Stadt.',
      },
      ru: {
        city: 'Хельсинки',
        landmark: 'Кафедральный собор Хельсинки',
        description:
          'Белый лютеранский собор с зелёным куполом и четырьмя малыми куполами над широкой лестницей Сенатской площади. Его спроектировал Карл Людвиг Энгель, строительство завершилось в 1852 году; это символ города.',
      },
      it: {
        city: 'Helsinki',
        landmark: 'Cattedrale di Helsinki',
        description:
          'Una cattedrale luterana bianca con cupola verde e quattro cupole minori sopra l’ampia scalinata di Piazza del Senato. Progettata da Carl Ludvig Engel e ultimata nel 1852, è il simbolo della città.',
      },
    },
  },
  {
    id: 'grindavik',
    countryCode: 'IS',
    timezone: 'Atlantic/Reykjavik',
    latitude: 63.8804,
    longitude: -22.4495,
    image: commons('Blue Lagoon Geothermal Spa, Grindavík, Iceland (37917013312).jpg'),
    credit: credit('Blue Lagoon Geothermal Spa, Grindavík, Iceland (37917013312).jpg'),
    aliases: [
      'جريندافيك', 'grindavik', 'grindavík', 'iceland',
      'آيسلندا', 'blue lagoon', 'البحيرة الزرقاء', 'bláa lónið',
      'blaa lonid', 'reykjanes',
      // Reykjavík has no scene of its own; the Blue Lagoon is the curated view
      // most searches for the Icelandic capital expect.
      'reykjavik', 'reykjavík', 'ريكيافيك', 'höfuðborgarsvæðið',
    ],
    focus: '50% 55%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'جريندافيك',
        landmark: 'البحيرة الزرقاء',
        description:
          'بحيرة جيوحرارية بلون حليبي أزرق في حقل حمم على شبه جزيرة ريكيانيس، مياهها غنية بالسيليكا والمعادن. تقع قرب قرية جريندافيك على بعد نحو خمسين كيلومتراً من ريكيافيك.',
      },
      en: {
        city: 'Grindavík',
        landmark: 'Blue Lagoon',
        description:
          'A milky blue geothermal lagoon in a lava field on the Reykjanes peninsula, fed by silica- and mineral-rich water. It sits beside Grindavík, about fifty kilometres from Reykjavík.',
      },
      de: {
        city: 'Grindavík',
        landmark: 'Blaue Lagune',
        description:
          'Eine milchig blaue Geothermallagune in einem Lavafeld auf der Halbinsel Reykjanes, gespeist von silikatreichem Mineralwasser. Sie liegt bei Grindavík, rund fünfzig Kilometer von Reykjavík.',
      },
      ru: {
        city: 'Гриндавик',
        landmark: 'Голубая лагуна',
        description:
          'Молочно-голубая геотермальная лагуна в лавовом поле на полуострове Рейкьянес, питаемая водой, богатой кремнием и минералами. Она находится у Гриндавика, примерно в пятидесяти километрах от Рейкьявика.',
      },
      it: {
        city: 'Grindavík',
        landmark: 'Blue Lagoon',
        description:
          'Una laguna geotermica azzurro latte in un campo di lava sulla penisola di Reykjanes, alimentata da acqua ricca di silice e minerali. Si trova accanto a Grindavík, a circa cinquanta chilometri da Reykjavík.',
      },
    },
  },
  {
    id: 'dubrovnik',
    countryCode: 'HR',
    timezone: 'Europe/Zagreb',
    latitude: 42.6407,
    longitude: 18.1077,
    image: commons('The walls of the fortress and View of the old city. panorama.jpg'),
    credit: credit('The walls of the fortress and View of the old city. panorama.jpg'),
    aliases: [
      'دوبروفنيك', 'dubrovnik', 'croatia', 'كرواتيا',
      'city walls', 'أسوار دوبروفنيك', 'stari grad', 'dalmatia',
    ],
    focus: '50% 50%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'دوبروفنيك',
        landmark: 'أسوار دوبروفنيك',
        description:
          'أسوار حجرية بطول نحو كيلومترين تحيط بالمدينة القديمة، مع أبراج وحصون تعود إلى القرنين الثالث عشر والسابع عشر. من أعلاها يظهر البحر الأدرياتيكي وأسطح القرميد الحمراء.',
      },
      en: {
        city: 'Dubrovnik',
        landmark: 'The City Walls',
        description:
          'Stone walls almost two kilometres long ring the old town, with towers and bastions built between the thirteenth and seventeenth centuries. From the parapet you see the Adriatic and the red tile roofs.',
      },
      de: {
        city: 'Dubrovnik',
        landmark: 'Die Stadtmauern',
        description:
          'Fast zwei Kilometer lange Steinmauern umschließen die Altstadt, mit Türmen und Bastionen aus dem 13. bis 17. Jahrhundert. Von der Brüstung blickt man auf die Adria und die roten Ziegeldächer.',
      },
      ru: {
        city: 'Дубровник',
        landmark: 'Городские стены',
        description:
          'Почти двухкилометровые каменные стены окружают старый город, с башнями и бастионами XIII–XVII веков. С гребня стены видны Адриатика и красные черепичные крыши.',
      },
      it: {
        city: 'Dubrovnik',
        landmark: 'Le mura della città',
        description:
          'Mura di pietra lunghe quasi due chilometri circondano la città vecchia, con torri e bastioni costruiti tra il XIII e il XVII secolo. Dal cammino di ronda si vedono l’Adriatico e i tetti di tegole rosse.',
      },
    },
  },
  {
    id: 'halong',
    countryCode: 'VN',
    timezone: 'Asia/Ho_Chi_Minh',
    latitude: 20.9101,
    longitude: 107.1839,
    image: commons('Ha Long Bay in 2019.jpg'),
    credit: credit('Ha Long Bay in 2019.jpg'),
    aliases: [
      'ها لونغ', 'هالونغ', 'ha long', 'halong',
      'ha long bay', 'خليج ها لونغ', 'vietnam', 'فيتنام',
      'hạ long', 'bai chay',
    ],
    focus: '50% 55%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'ها لونغ',
        landmark: 'خليج ها لونغ',
        description:
          'خليج في خليج تونكين تنتشر فيه نحو ألفي جزيرة من الحجر الجيري وقمم كارستية، وقد أُدرج في قائمة اليونسكو عام ١٩٩٤. القوارب الشراعية تمر بين الجزر عند الفجر.',
      },
      en: {
        city: 'Ha Long',
        landmark: 'Ha Long Bay',
        description:
          'A bay in the Gulf of Tonkin scattered with some two thousand limestone islands and karst pillars, a UNESCO site since 1994. Junks thread between the islets at dawn.',
      },
      de: {
        city: 'Hạ Long',
        landmark: 'Die Halong-Bucht',
        description:
          'Eine Bucht im Golf von Tonkin mit rund zweitausend Kalksteininseln und Karstfelsen, seit 1994 UNESCO-Welterbe. Dschunken fahren im Morgengrauen zwischen den Inseln.',
      },
      ru: {
        city: 'Халонг',
        landmark: 'Бухта Халонг',
        description:
          'Бухта в Тонкинском заливе с почти двумя тысячами известняковых островов и карстовых скал, объект ЮНЕСКО с 1994 года. На рассвете между островами проходят джонки.',
      },
      it: {
        city: 'Ha Long',
        landmark: 'La baia di Ha Long',
        description:
          'Una baia nel golfo del Tonchino punteggiata da circa duemila isole calcaree e guglie carsiche, patrimonio UNESCO dal 1994. All’alba le giunche passano tra gli isolotti.',
      },
    },
  },
  {
    id: 'siem-reap',
    countryCode: 'KH',
    timezone: 'Asia/Phnom_Penh',
    latitude: 13.4125,
    longitude: 103.867,
    image: commons('Angkor Wat.jpg'),
    credit: credit('Angkor Wat.jpg'),
    aliases: [
      'سييم ريب', 'siem reap', 'cambodia', 'كمبوديا',
      'angkor', 'angkor wat', 'أنغكور وات', 'انغكور وات',
      'khmer',
    ],
    focus: '50% 45%',
    theme: 'sunset',
    copy: {
      ar: {
        city: 'سييم ريب',
        landmark: 'أنغكور وات',
        description:
          'أكبر معبد هندوسي في العالم، بناه سوريا فارمان الثاني في القرن الثاني عشر لفيشنو ثم تحوّل إلى معبد بوذي. تعكس خنادقه المائية أبراجه الخمس عند الفجر.',
      },
      en: {
        city: 'Siem Reap',
        landmark: 'Angkor Wat',
        description:
          'The largest Hindu temple in the world, built by Suryavarman II in the twelfth century for Vishnu and later turned Buddhist. Its moat mirrors the five towers at dawn.',
      },
      de: {
        city: 'Siem Reap',
        landmark: 'Angkor Wat',
        description:
          'Der größte Hindutempel der Welt, im 12. Jahrhundert von Suryavarman II. für Vishnu errichtet und später buddhistisch. Sein Wassergraben spiegelt im Morgengrauen die fünf Türme.',
      },
      ru: {
        city: 'Сиемреап',
        landmark: 'Ангкор-Ват',
        description:
          'Крупнейший индуистский храм мира, построенный Сурьяварманом II в XII веке в честь Вишну и позже ставший буддийским. На рассвете его ров отражает пять башен.',
      },
      it: {
        city: 'Siem Reap',
        landmark: 'Angkor Wat',
        description:
          'Il più grande tempio induista del mondo, costruito da Suryavarman II nel XII secolo per Vishnu e poi divenuto buddista. All’alba il fossato riflette le cinque torri.',
      },
    },
  },
  {
    id: 'bohol',
    countryCode: 'PH',
    timezone: 'Asia/Manila',
    latitude: 9.9194,
    longitude: 124.1697,
    image: commons('Chocolate Hills Carmen Bohol 2019.jpg'),
    credit: credit('Chocolate Hills Carmen Bohol 2019.jpg'),
    aliases: [
      'بوهول', 'bohol', 'philippines', 'الفلبين',
      'chocolate hills', 'تلال الشوكولاتة', 'carmen', 'كارمن',
      'visayas',
    ],
    focus: '50% 55%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'بوهول',
        landmark: 'تلال الشوكولاتة',
        description:
          'أكثر من ألف تلة مخروطية من الحجر الجيري تتحول إلى اللون البني في موسم الجفاف، وسط جزيرة بوهول. تُعدّ من أشهر معالم الفلبين وأُدرجت في قائمة اليونسكو المؤقتة.',
      },
      en: {
        city: 'Bohol',
        landmark: 'The Chocolate Hills',
        description:
          'More than a thousand conical limestone hills that turn brown in the dry season, in the middle of Bohol island. They are among the Philippines’ best-known sights and a tentative UNESCO site.',
      },
      de: {
        city: 'Bohol',
        landmark: 'Die Chocolate Hills',
        description:
          'Über tausend kegelförmige Kalksteinhügel, die in der Trockenzeit braun werden, mitten auf der Insel Bohol. Sie gehören zu den bekanntesten Motiven der Philippinen.',
      },
      ru: {
        city: 'Бохол',
        landmark: 'Шоколадные холмы',
        description:
          'Более тысячи конических известняковых холмов, буреющих в сухой сезон, в центре острова Бохол. Это одна из самых известных достопримечательностей Филиппин.',
      },
      it: {
        city: 'Bohol',
        landmark: 'Le Chocolate Hills',
        description:
          'Oltre mille colline calcaree coniche che in stagione secca diventano marroni, nel cuore dell’isola di Bohol. Sono tra le immagini più note delle Filippine.',
      },
    },
  },
  {
    id: 'milford-sound',
    countryCode: 'NZ',
    timezone: 'Pacific/Auckland',
    latitude: -44.6414,
    longitude: 167.8974,
    image: commons('Milford Sound Mitre Peak Cabbage tree Toetoe.JPG'),
    credit: credit('Milford Sound Mitre Peak Cabbage tree Toetoe.JPG'),
    aliases: [
      'ميلفورد ساوند', 'milford sound', 'milford', 'new zealand',
      'نيوزيلندا', 'southland', 'ساوثلاند', 'fiordland',
      'mitre peak', 'piopiotahi',
    ],
    focus: '50% 55%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'ميلفورد ساوند',
        landmark: 'مضيق ميلفورد',
        description:
          'مضيق عميق في فيوردلاند تطل عليه قمة ميترا بارتفاع ١٦٩٢ متراً وشلالات تتدفق من الجروف. وصفه روديارد كيبلنغ بأنه الأعجوبة الثامنة في العالم.',
      },
      en: {
        city: 'Milford Sound',
        landmark: 'Milford Sound and Mitre Peak',
        description:
          'A deep fiord in Fiordland beneath Mitre Peak, which rises 1,692 metres, with waterfalls dropping straight off the cliffs. Rudyard Kipling called it the eighth wonder of the world.',
      },
      de: {
        city: 'Milford Sound',
        landmark: 'Der Milford Sound',
        description:
          'Ein tiefer Fjord im Fiordland unter dem 1.692 Meter hohen Mitre Peak, mit Wasserfällen, die von den Klippen stürzen. Rudyard Kipling nannte ihn das achte Weltwunder.',
      },
      ru: {
        city: 'Милфорд-Саунд',
        landmark: 'Милфорд-Саунд',
        description:
          'Глубокий фьорд в Фьордленде под пиком Митре высотой 1692 метра, с водопадами, падающими прямо со скал. Редьярд Киплинг назвал его восьмым чудом света.',
      },
      it: {
        city: 'Milford Sound',
        landmark: 'Il Milford Sound',
        description:
          'Un fiordo profondo nel Fiordland sotto il Mitre Peak, alto 1.692 metri, con cascate che precipitano dalle pareti. Rudyard Kipling lo chiamò l’ottava meraviglia del mondo.',
      },
    },
  },
  {
    id: 'hanga-roa',
    countryCode: 'CL',
    timezone: 'Pacific/Easter',
    latitude: -27.1258,
    longitude: -109.2769,
    image: commons('Ahu Tongariki.jpg'),
    credit: credit('Ahu Tongariki.jpg'),
    aliases: [
      'هانغا روا', 'hanga roa', 'chile', 'تشيلي',
      'easter island', 'جزيرة الفصح', 'rapa nui', 'moai',
      'تماثيل موآي', 'ahu tongariki',
    ],
    focus: '50% 50%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'هانغا روا',
        landmark: 'تماثيل موآي',
        description:
          'خمسة عشر تمثالاً ضخماً من حجر البازلت على منصة واحدة في آهو تونغاريكي، أعيد نصبها في التسعينيات بعد تسونامي ١٩٦٠. حُمِلت التماثيل من محجر رانو راراكو على بعد عدة كيلومترات.',
      },
      en: {
        city: 'Hanga Roa',
        landmark: 'The Moai of Easter Island',
        description:
          'Fifteen colossal basalt moai on a single platform at Ahu Tongariki, re-erected in the 1990s after the 1960 tsunami. The statues were hauled from the Rano Raraku quarry kilometres away.',
      },
      de: {
        city: 'Hanga Roa',
        landmark: 'Die Moai der Osterinsel',
        description:
          'Fünfzehn gewaltige Basalt-Moai auf einer Plattform in Ahu Tongariki, in den 1990er-Jahren nach dem Tsunami von 1960 wieder aufgerichtet. Sie wurden vom Steinbruch Rano Raraku hergeschafft.',
      },
      ru: {
        city: 'Ханга-Роа',
        landmark: 'Моаи острова Пасхи',
        description:
          'Пятнадцать колоссальных базальтовых моаи на одной платформе Аху Тонгарики, вновь установленных в 1990-х после цунами 1960 года. Статуи перевозили из каменоломни Рано Рараку.',
      },
      it: {
        city: 'Hanga Roa',
        landmark: 'I moai dell’Isola di Pasqua',
        description:
          'Quindici colossali moai di basalto su un’unica piattaforma ad Ahu Tongariki, rialzati negli anni Novanta dopo lo tsunami del 1960. Furono trasportati dalla cava di Rano Raraku.',
      },
    },
  },
  {
    id: 'cartagena',
    countryCode: 'CO',
    timezone: 'America/Bogota',
    latitude: 10.422,
    longitude: -75.533,
    image: commons('Cartagena, view from old city walls.jpg'),
    credit: credit('Cartagena, view from old city walls.jpg'),
    aliases: [
      'كارتاخينا', 'قرطاجنة', 'cartagena', 'colombia',
      'كولومبيا', 'walled city', 'المدينة المسورة', 'ciudad amurallada',
      'cartagena de indias',
    ],
    focus: '50% 50%',
    theme: 'sunset',
    copy: {
      ar: {
        city: 'كارتاخينا',
        landmark: 'المدينة المسوّرة',
        description:
          'مدينة استعمارية محاطة بأسوار وحصون بناها الإسبان بين القرنين السادس عشر والثامن عشر لحماية ميناء الذهب. أعلنت اليونسكو المدينة القديمة وسورها موقع تراث عام ١٩٨٤.',
      },
      en: {
        city: 'Cartagena',
        landmark: 'The Walled City',
        description:
          'A colonial city ringed by walls and forts that Spain built between the sixteenth and eighteenth centuries to guard its gold port. UNESCO listed the old town and its defences in 1984.',
      },
      de: {
        city: 'Cartagena',
        landmark: 'Die ummauerte Altstadt',
        description:
          'Eine Kolonialstadt mit Mauern und Festungen, die Spanien vom 16. bis 18. Jahrhundert zum Schutz seines Goldhafens errichtete. Seit 1984 ist die Altstadt UNESCO-Welterbe.',
      },
      ru: {
        city: 'Картахена',
        landmark: 'Обнесённый стеной старый город',
        description:
          'Колониальный город в кольце стен и крепостей, построенных Испанией в XVI–XVIII веках для защиты золотого порта. Старый город внесён в список ЮНЕСКО в 1984 году.',
      },
      it: {
        city: 'Cartagena',
        landmark: 'La città murata',
        description:
          'Una città coloniale cinta da mura e fortezze costruite dalla Spagna tra XVI e XVIII secolo per proteggere il porto dell’oro. La città vecchia è patrimonio UNESCO dal 1984.',
      },
    },
  },
  {
    id: 'doha-mia',
    countryCode: 'QA',
    timezone: 'Asia/Qatar',
    latitude: 25.2955,
    longitude: 51.539,
    image: commons('Museum of Islamic Art (6188166880).jpg'),
    credit: credit('Museum of Islamic Art (6188166880).jpg'),
    aliases: [
      'الدوحة', 'doha', 'qatar', 'قطر',
      'museum of islamic art', 'متحف الفن الإسلامي', 'mia', 'الدوحة متحف',
    ],
    focus: '55% 50%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'الدوحة',
        landmark: 'متحف الفن الإسلامي',
        description:
          'متحف صمّمه آي إم باي وافتُتح عام ٢٠٠٨ على رصيف بحري خاص، بقبة هرمية من الحجر الرملي ونوافذ تطل على الخليج. يضم مجموعة من الفن الإسلامي تمتد من الأندلس إلى آسيا الوسطى.',
      },
      en: {
        city: 'Doha',
        landmark: 'Museum of Islamic Art',
        description:
          'A museum designed by I. M. Pei and opened in 2008 on its own corniche island, with a stepped sandstone dome and windows framing the Gulf. Its collection spans Islamic art from Andalusia to Central Asia.',
      },
      de: {
        city: 'Doha',
        landmark: 'Museum für Islamische Kunst',
        description:
          'Ein Museum von I. M. Pei, 2008 auf einer eigenen Corniche-Insel eröffnet, mit gestufter Sandsteinkuppel und Blick auf den Golf. Die Sammlung reicht von Andalusien bis Zentralasien.',
      },
      ru: {
        city: 'Доха',
        landmark: 'Музей исламского искусства',
        description:
          'Музей, спроектированный И. М. Пеем и открытый в 2008 году на отдельном острове у набережной, со ступенчатым куполом из песчаника и видом на залив. Коллекция охватывает исламское искусство от Андалусии до Средней Азии.',
      },
      it: {
        city: 'Doha',
        landmark: 'Museo d’arte islamica',
        description:
          'Un museo progettato da I. M. Pei e aperto nel 2008 su un’isola della corniche, con cupola a gradoni in arenaria e finestre sul golfo. La collezione va dall’Andalusia all’Asia centrale.',
      },
    },
  },
  {
    id: 'jerusalem',
    countryCode: 'PS',
    timezone: 'Asia/Hebron',
    latitude: 31.7767,
    longitude: 35.2345,
    image: commons('Westernwall2.jpg'),
    credit: credit('Westernwall2.jpg'),
    aliases: [
      'القدس', 'jerusalem', 'palestine', 'فلسطين',
      'western wall', 'حائط البراق', 'الحائط الغربي', 'kotel',
      'wailing wall',
    ],
    capital: true,
    focus: '50% 45%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'القدس',
        landmark: 'الحائط الغربي',
        description:
          'الجدار الغربي للمسجد الأقصى، بقايا السور الاستنادي لهيرودس الكبير، وهو أقدس مكان يصلّي عنده اليهود. يبلغ طول الظاهر منه نحو ٥٧ متراً وتُدسّ بين حجارته قصاصات الأمنيات.',
      },
      en: {
        city: 'Jerusalem',
        landmark: 'The Western Wall',
        description:
          'The western retaining wall of the Temple Mount, left from Herod the Great’s expansion and the holiest place where Jews pray. About 57 metres are exposed, and written prayers are pressed between the stones.',
      },
      de: {
        city: 'Jerusalem',
        landmark: 'Die Westmauer',
        description:
          'Die westliche Stützmauer des Tempelbergs aus der Erweiterung Herodes’ des Großen und der heiligste Ort jüdischen Gebets. Rund 57 Meter sind sichtbar; Gebetszettel werden zwischen die Steine gesteckt.',
      },
      ru: {
        city: 'Иерусалим',
        landmark: 'Западная стена',
        description:
          'Западная подпорная стена Храмовой горы, оставшаяся от расширения Ирода Великого, святейшее место иудейской молитвы. Открыто около 57 метров; записки с молитвами вкладывают между камнями.',
      },
      it: {
        city: 'Gerusalemme',
        landmark: 'Il Muro Occidentale',
        description:
          'Il muro di contenimento occidentale del Monte del Tempio, lasciato dall’ampliamento di Erode il Grande e il luogo più sacro della preghiera ebraica. Sono visibili circa 57 metri; biglietti con preghiere sono infilati tra le pietre.',
      },
    },
  },
  {
    id: 'jerusalem-al-aqsa',
    countryCode: 'PS',
    timezone: 'Asia/Hebron',
    latitude: 31.7781,
    longitude: 35.2354,
    image: commons('Jerusalem DomeoftheRock J65 (cropped).JPG'),
    credit: credit('Jerusalem DomeoftheRock J65 (cropped).JPG'),
    aliases: [
      'القدس', 'jerusalem', 'palestine', 'فلسطين',
      'dome of the rock', 'قبة الصخرة', 'المسجد الأقصى', 'al-aqsa',
      'haram al-sharif', 'الحرم القدسي',
      'hebron', 'الخليل', 'خليل الرحمن',
    ],
    capital: true,
    focus: '50% 45%',
    theme: 'sunset',
    copy: {
      ar: {
        city: 'القدس',
        landmark: 'قبة الصخرة',
        description:
          'قبة ذهبية فوق مسجد ثماني الأضلاع على الحرم القدسي، بناها عبد الملك بن مروان بين ٦٩١ و٦٩٢. صخرتها المقدسة وقبابها الفسيفسائية تجعلها من أقدم المباني الإسلامية الباقية.',
      },
      en: {
        city: 'Jerusalem',
        landmark: 'Dome of the Rock',
        description:
          'A golden dome over an octagonal shrine on the Haram al-Sharif, built by Abd al-Malik between 691 and 692. Its rock and mosaic interior make it one of the oldest surviving Islamic buildings.',
      },
      de: {
        city: 'Jerusalem',
        landmark: 'Der Felsendom',
        description:
          'Eine goldene Kuppel über einem achteckigen Heiligtum auf dem Haram al-Sharif, 691–692 von Abd al-Malik erbaut. Fels und Mosaike machen sie zu einem der ältesten erhaltenen islamischen Bauwerke.',
      },
      ru: {
        city: 'Иерусалим',
        landmark: 'Купол Скалы',
        description:
          'Золотой купол над восьмигранным святилищем на Харам аль-Шариф, построенным Абд аль-Маликом в 691–692 годах. Скала и мозаики делают его одним из древнейших сохранившихся исламских зданий.',
      },
      it: {
        city: 'Gerusalemme',
        landmark: 'La Cupola della Roccia',
        description:
          'Una cupola dorata su un santuario ottagonale sull’Haram al-Sharif, costruito da Abd al-Malik tra il 691 e il 692. La roccia e i mosaici ne fanno uno degli edifici islamici più antichi conservati.',
      },
    },
  },
  {
    id: 'tehran',
    countryCode: 'IR',
    timezone: 'Asia/Tehran',
    latitude: 35.6997,
    longitude: 51.338,
    image: commons('Azadi Tower (29358497718).jpg'),
    credit: credit('Azadi Tower (29358497718).jpg'),
    aliases: [
      'طهران', 'تهران', 'tehran', 'iran',
      'إيران', 'azadi tower', 'برج آزادي', 'برج الحرية',
    ],
    focus: '50% 50%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'طهران',
        landmark: 'برج آزادي',
        description:
          'برج من الرخام الأبيض عند مدخل طهران الغربي، صمّمه حسين أمانت واكتمل عام ١٩٧١ بمناسبة احتفالات الإمبراطورية الفارسية. قوسه المقلوب يجمع بين العمارة الساسانية والقوطية.',
      },
      en: {
        city: 'Tehran',
        landmark: 'Azadi Tower',
        description:
          'A white marble tower at Tehran’s western gateway, designed by Hossein Amanat and completed in 1971 for the Persian Empire’s anniversary. Its inverted arch blends Sasanian and Gothic forms.',
      },
      de: {
        city: 'Teheran',
        landmark: 'Azadi-Turm',
        description:
          'Ein Turm aus weißem Marmor am westlichen Tor Teherans, von Hossein Amanat entworfen und 1971 zum Jubiläum des Perserreichs vollendet. Der umgekehrte Bogen verbindet sasanidische und gotische Formen.',
      },
      ru: {
        city: 'Тегеран',
        landmark: 'Башня Азади',
        description:
          'Башня из белого мрамора у западного въезда в Тегеран, спроектированная Хоссейном Аманатом и открытая в 1971 году к юбилею Персидской империи. Перевёрнутая арка соединяет сасанидские и готические формы.',
      },
      it: {
        city: 'Teheran',
        landmark: 'Torre Azadi',
        description:
          'Una torre di marmo bianco all’ingresso occidentale di Teheran, progettata da Hossein Amanat e ultimata nel 1971 per l’anniversario dell’Impero persiano. L’arco rovesciato unisce forme sasanidi e gotiche.',
      },
    },
  },
  {
    id: 'erbil',
    countryCode: 'IQ',
    timezone: 'Asia/Baghdad',
    latitude: 36.1911,
    longitude: 44.0092,
    image: commons('Panorama view of the Erbil Citadel, Erbil Governorate, Iraqi Kurdistan.jpg'),
    credit: credit('Panorama view of the Erbil Citadel, Erbil Governorate, Iraqi Kurdistan.jpg'),
    aliases: [
      'أربيل', 'اربيل', 'erbil', 'arbil',
      'hawler', 'iraq', 'العراق', 'erbil citadel',
      'قلعة أربيل',
    ],
    focus: '50% 50%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'أربيل',
        landmark: 'قلعة أربيل',
        description:
          'قلعة على تلّ اصطناعي يعلو المدينة، سكنها الناس نحو ستة آلاف سنة، وهي من أقدم المواقع المأهولة باستمرار. أُدرجت في قائمة اليونسكو عام ٢٠١٤ بعد ترميم بوابتها وأزقتها.',
      },
      en: {
        city: 'Erbil',
        landmark: 'The Citadel of Erbil',
        description:
          'A citadel on a tell above the city, inhabited for roughly six thousand years and among the oldest continuously settled sites. UNESCO listed it in 2014 after its gate and lanes were restored.',
      },
      de: {
        city: 'Erbil',
        landmark: 'Die Zitadelle von Erbil',
        description:
          'Eine Zitadelle auf einem Siedlungshügel über der Stadt, seit rund sechstausend Jahren bewohnt und damit einer der ältesten dauerhaft besiedelten Orte. 2014 UNESCO-Welterbe.',
      },
      ru: {
        city: 'Эрбиль',
        landmark: 'Цитадель Эрбиля',
        description:
          'Цитадель на телле над городом, заселённая около шести тысяч лет и относящаяся к древнейшим постоянно обитаемым местам. В 2014 году внесена в список ЮНЕСКО.',
      },
      it: {
        city: 'Erbil',
        landmark: 'La cittadella di Erbil',
        description:
          'Una cittadella su un tell sopra la città, abitata da circa seimila anni e tra i più antichi insediamenti continui. Patrimonio UNESCO dal 2014.',
      },
    },
  },
  {
    id: 'lahore',
    countryCode: 'PK',
    timezone: 'Asia/Karachi',
    latitude: 31.5882,
    longitude: 74.3096,
    image: commons('Badshahi Mosque front picture.jpg'),
    credit: credit('Badshahi Mosque front picture.jpg'),
    aliases: [
      'لاهور', 'lahore', 'pakistan', 'باكستان',
      'badshahi mosque', 'مسجد بادشاهي', 'badshahi', 'punjab',
    ],
    focus: '50% 45%',
    theme: 'sunset',
    copy: {
      ar: {
        city: 'لاهور',
        landmark: 'مسجد بادشاهي',
        description:
          'مسجد من الحجر الرملي الأحمر بناه أورنكزيب عام ١٦٧٣، ويتسع لأكثر من خمسين ألف مصلٍّ. تقابله قلعة لاهور وحدائق شاليمار، وقد بُني على طراز المسجد الجامع في دلهي.',
      },
      en: {
        city: 'Lahore',
        landmark: 'Badshahi Mosque',
        description:
          'A red sandstone mosque built by Aurangzeb in 1673 that holds more than fifty thousand worshippers. It faces Lahore Fort and the Shalimar Gardens, and follows the plan of Delhi’s Jama Masjid.',
      },
      de: {
        city: 'Lahore',
        landmark: 'Badschahi-Moschee',
        description:
          'Eine Moschee aus rotem Sandstein, 1673 von Aurangzeb erbaut, mit Platz für über fünfzigtausend Betende. Sie liegt gegenüber dem Fort von Lahore und folgt dem Plan der Jama Masjid in Delhi.',
      },
      ru: {
        city: 'Лахор',
        landmark: 'Мечеть Бадшахи',
        description:
          'Мечеть из красного песчаника, построенная Аурангзебом в 1673 году и вмещающая более пятидесяти тысяч молящихся. Она обращена к Лахорской крепости и повторяет план делийской Джама Масджид.',
      },
      it: {
        city: 'Lahore',
        landmark: 'Moschea Badshahi',
        description:
          'Una moschea in arenaria rossa costruita da Aurangzeb nel 1673, che accoglie oltre cinquantamila fedeli. Fronteggia il Forte di Lahore e segue il modello della Jama Masjid di Delhi.',
      },
    },
  },
  {
    id: 'aswan',
    countryCode: 'EG',
    timezone: 'Africa/Cairo',
    latitude: 24.0243,
    longitude: 32.8843,
    image: commons('Philae Temple Complex, Agilkia Island, Aswan, AG, EGY (48027052466).jpg'),
    credit: credit('Philae Temple Complex, Agilkia Island, Aswan, AG, EGY (48027052466).jpg'),
    aliases: [
      'أسوان', 'aswan', 'assuan', 'egypt', 'مصر',
      'philae', 'فيلة', 'معبد فيلة', 'agilkia', 'أجليكا',
    ],
    focus: '50% 55%',
    theme: 'sunset',
    copy: {
      ar: {
        city: 'أسوان',
        landmark: 'معبد فيلة',
        description:
          'معبد إيزيس على جزيرة أجليكا، أنقذته اليونسكو في السبعينيات من غرق بحيرة ناصر بعد أن كان على جزيرة فيلة. بدأه البطالمة وأكملته روما، ولا يزال الوصول إليه بالقارب وسط النيل.',
      },
      en: {
        city: 'Aswan',
        landmark: 'Philae Temple',
        description:
          'The temple of Isis on Agilkia Island, moved stone by stone in the 1970s before Lake Nasser drowned its old island. Begun under the Ptolemies and finished under Rome, it is still reached by boat across the Nile.',
      },
      de: {
        city: 'Assuan',
        landmark: 'Philae-Tempel',
        description:
          'Der Isis-Tempel auf der Insel Agilkia, den die UNESCO in den 1970er-Jahren vor dem Nassersee rettete. Unter den Ptolemäern begonnen und von Rom vollendet, erreicht man ihn noch immer per Boot über den Nil.',
      },
      ru: {
        city: 'Асуан',
        landmark: 'Храм Филе',
        description:
          'Храм Исиды на острове Агилкия, который ЮНЕСКО спасла от затопления водохранилищем Насер в 1970-е годы. Начатый при Птолемеях и достроенный Римом, он до сих пор доступен только по Нилу на лодке.',
      },
      it: {
        city: 'Assuan',
        landmark: 'Tempio di File',
        description:
          'Il tempio di Iside sull’isola di Agilkia, salvato dall’UNESCO negli anni Settanta prima che il lago Nasser sommergesse l’isola originale. Iniziato sotto i Tolomei e completato da Roma, si raggiunge ancora in barca sul Nilo.',
      },
    },
  },
  {
    id: 'algiers',
    countryCode: 'DZ',
    timezone: 'Africa/Algiers',
    latitude: 36.7459,
    longitude: 3.0694,
    image: commons('Martyrs Memorial. Algiers, Algeria.jpg'),
    credit: credit('Martyrs Memorial. Algiers, Algeria.jpg'),
    aliases: [
      'الجزائر', 'الجزائر العاصمة', 'algiers', 'alger', 'algeria',
      'martyrs memorial', 'مقام الشهيد', 'maqam echahid', 'el madania',
    ],
    focus: '50% 45%',
    theme: 'sea',
    copy: {
      ar: {
        city: 'الجزائر',
        landmark: 'مقام الشهيد',
        description:
          'نصب بارتفاع ٩٢ متراً على تلال المنادية يطل على خليج الجزائر، شُيّد عام ١٩٨٢ لذكرى شهداء حرب التحرير، وتلتقي أوراقه الثلاث صاعدة كما تنمو النخيل.',
      },
      en: {
        city: 'Algiers',
        landmark: 'The Martyrs’ Memorial',
        description:
          'A 92-metre monument on the hills of El Madania above the bay, raised in 1982 for the martyrs of the independence war. Its three leaves meet as they rise, like palms growing upward.',
      },
      de: {
        city: 'Algier',
        landmark: 'Märtyrerdenkmal',
        description:
          'Ein 92 Meter hohes Denkmal auf den Hügeln von El Madania über der Bucht, 1982 für die Märtyrer des Unabhängigkeitskrieges errichtet. Seine drei Blätter steigen wie Palmen empor.',
      },
      ru: {
        city: 'Алжир',
        landmark: 'Мемориал мучеников',
        description:
          '92-метровый монумент на холмах Эль-Мадания над бухтой, воздвигнутый в 1982 году в память о погибших в войне за независимость. Три его «листа» возносятся вверх, как пальмы.',
      },
      it: {
        city: 'Algeri',
        landmark: 'Memoriale dei Martiri',
        description:
          'Un monumento di 92 metri sulle colline di El Madania sopra la baia, eretto nel 1982 per i martiri della guerra d’indipendenza. Le sue tre foglie salgono come palme.',
      },
    },
  },
  {
    id: 'khartoum',
    countryCode: 'SD',
    timezone: 'Africa/Khartoum',
    latitude: 15.6063,
    longitude: 32.5322,
    image: commons('Corinthia Burj AlFatih Hotel (33232862443).jpg'),
    credit: credit('Corinthia Burj AlFatih Hotel (33232862443).jpg'),
    aliases: [
      'الخرطوم', 'khartoum', 'sudan', 'السودان', 'burj al fateh',
      'burj al-fatih', 'برج الفاتح', 'corinthia', 'المقرن', 'al mogran',
    ],
    focus: '50% 50%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'الخرطوم',
        landmark: 'برج الفاتح',
        description:
          'فندق على ضفة النيل الأزرق عند نقطة التقاء النيلين، بارتفاع ١٣٠ متراً وبشكل شراع يذكّر بسفن النيل. أهدته ليبيا للسودان وافتُتح عام ٢٠٠٨، وأصبح أشهر معالم العاصمة.',
      },
      en: {
        city: 'Khartoum',
        landmark: 'Burj Al-Fateh',
        description:
          'A 130-metre hotel on the Blue Nile where the two Niles meet, shaped like a lateen sail on the river. A gift from Libya opened in 2008, it has become the mark of the capital.',
      },
      de: {
        city: 'Khartum',
        landmark: 'Burj al-Fatih',
        description:
          'Ein 130 Meter hohes Hotel am Blauen Nil an der Stelle, wo sich beide Nile treffen, geformt wie ein Segel. Ein Geschenk Libyens, 2008 eröffnet, ist es heute das Wahrzeichen der Hauptstadt.',
      },
      ru: {
        city: 'Хартум',
        landmark: 'Бурдж аль-Фатих',
        description:
          '130-метровый отель на Голубом Ниле у места слияния двух рек, по форме напоминающий парус. Подарок Ливии, открытый в 2008 году, стал главным ориентиром столицы.',
      },
      it: {
        city: 'Khartum',
        landmark: 'Burj Al-Fateh',
        description:
          'Un albergo di 130 metri sul Nilo Azzurro nel punto in cui i due Nili si incontrano, a forma di vela. Dono della Libia inaugurato nel 2008, è oggi il simbolo della capitale.',
      },
    },
  },
  {
    id: 'dhaka',
    countryCode: 'BD',
    timezone: 'Asia/Dhaka',
    latitude: 23.7086,
    longitude: 90.4061,
    image: commons('Ahsan Manzil-Front View.jpg'),
    credit: credit('Ahsan Manzil-Front View.jpg'),
    aliases: [
      'دكا', 'dhaka', 'dacca', 'bangladesh', 'بنغلاديش', 'ahsan manzil', 'قصر أحسن منزل',
      'القصر الوردي', 'pink palace',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'دكا',
        landmark: 'قصر أحسن منزل',
        description:
          'قصر وردي على ضفة نهر بوريجانغا، كان مقر عائلة نواب دكا ثم صار متحفاً وطنياً. شرفته المزدوجة وقبته المضيئة من معالم المدينة القديمة.',
      },
      en: {
        city: 'Dhaka',
        landmark: 'Ahsan Manzil',
        description:
          'A pink palace on the bank of the Buriganga, once the residence of the Nawabs of Dhaka and now a national museum. Its twin staircase and dome mark the old city.',
      },
      de: {
        city: 'Dhaka',
        landmark: 'Ahsan Manzil',
        description:
          'Ein rosafarbener Palast am Ufer des Buriganga, einst Residenz der Nawabs von Dhaka und heute ein Nationalmuseum. Die doppelte Freitreppe und die Kuppel prägen die Altstadt.',
      },
      ru: {
        city: 'Дакка',
        landmark: 'Ахсан Манзил',
        description:
          'Розовый дворец на берегу Буриганги, бывшая резиденция навабов Дакки, а теперь национальный музей. Двойная лестница и купол стали приметой старого города.',
      },
      it: {
        city: 'Dacca',
        landmark: 'Ahsan Manzil',
        description:
          'Un palazzo rosa sulla riva del Buriganga, un tempo residenza dei Nawab di Dacca e oggi museo nazionale. La doppia scalinata e la cupola segnano la città vecchia.',
      },
    },
  },
  {
    id: 'sigiriya',
    countryCode: 'LK',
    timezone: 'Asia/Colombo',
    latitude: 7.9563,
    longitude: 80.7603,
    image: commons('Sigiriya Luftbild (29781064900).jpg'),
    credit: credit('Sigiriya Luftbild (29781064900).jpg'),
    aliases: [
      'سيجيريا', 'sigiriya', 'sri lanka', 'سريلانكا', 'sigiriya rock', 'قلعة صخرة سيجيريا',
      'صخرة سيجيريا', 'colombo', 'كولومبو',
    ],
    copy: {
      ar: {
        city: 'سيجيريا',
        landmark: 'قلعة صخرة سيجيريا',
        description:
          'صخرة جرانيتية ترتفع نحو مئتي متر من السهل، بناها الملك كاسيابا في القرن الخامس فجعل فوقها قصره وحصنه. جداريات وجهها الغربي أشهر ما فيها.',
      },
      en: {
        city: 'Sigiriya',
        landmark: 'Sigiriya Rock Fortress',
        description:
          'A granite rock rising some 200 metres from the plain, crowned by King Kashyapa’s fifth-century palace and fortress. The frescoes on its western face are the most famous part of the site.',
      },
      de: {
        city: 'Sigiriya',
        landmark: 'Felsenfestung Sigiriya',
        description:
          'Ein Granitfelsen, der rund 200 Meter aus der Ebene ragt und die Palastfestung König Kashyapas aus dem 5. Jahrhundert trägt. Berühmt sind die Wandmalereien an seiner Westwand.',
      },
      ru: {
        city: 'Сигирия',
        landmark: 'Скальная крепость Сигирия',
        description:
          'Гранитная скала высотой около 200 метров, на которой в V веке царь Кашьяпа построил дворец-крепость. Знамениты фрески на её западной стене.',
      },
      it: {
        city: 'Sigiriya',
        landmark: 'Fortezza rupestre di Sigiriya',
        description:
          'Una roccia di granito che si alza di circa 200 metri dalla pianura, con il palazzo-fortezza del re Kashyapa del V secolo. Famose le pitture murali sulla parete ovest.',
      },
    },
  },
  {
    id: 'kathmandu',
    countryCode: 'NP',
    timezone: 'Asia/Kathmandu',
    latitude: 27.7214,
    longitude: 85.3619,
    image: commons('Boudha Stupa 2018 04.jpg'),
    credit: credit('Boudha Stupa 2018 04.jpg'),
    aliases: [
      'كاتماندو', 'kathmandu', 'nepal', 'نيبال', 'boudhanath', 'بودانات', 'boudha', 'bodnath',
      'ستوبا بودانات', 'boudhanath stupa',
    ],
    capital: true,
    focus: '60% 45%',
    copy: {
      ar: {
        city: 'كاتماندو',
        landmark: 'ستوبا بودانات',
        description:
          'أكبر ستوبا في نيبال وأحد أقدس مواقع البوذية التبتية، بعينين مرسومتين تراقبان الوادي وأعلام صلاة ترفرف حول قبتها البيضاء.',
      },
      en: {
        city: 'Kathmandu',
        landmark: 'Boudhanath Stupa',
        description:
          'The largest stupa in Nepal and one of the holiest sites of Tibetan Buddhism, with painted eyes watching the valley and prayer flags around its white dome.',
      },
      de: {
        city: 'Kathmandu',
        landmark: 'Boudhanath-Stupa',
        description:
          'Die größte Stupa Nepals und einer der heiligsten Orte des tibetischen Buddhismus, mit gemalten Augen über dem Tal und Gebetsfahnen um den weißen Dom.',
      },
      ru: {
        city: 'Катманду',
        landmark: 'Ступа Боднатх',
        description:
          'Крупнейшая ступа Непала и одно из святейших мест тибетского буддизма: нарисованные глаза над долиной и молитвенные флаги вокруг белого купола.',
      },
      it: {
        city: 'Kathmandu',
        landmark: 'Stupa di Boudhanath',
        description:
          'La più grande stupa del Nepal e uno dei luoghi più sacri del buddismo tibetano, con gli occhi dipinti sul valle e bandiere di preghiera attorno alla cupola bianca.',
      },
    },
  },
  {
    id: 'paro',
    countryCode: 'BT',
    timezone: 'Asia/Thimphu',
    latitude: 27.4917,
    longitude: 89.3633,
    image: commons('Paro Taktsang, Bhutan (edited).jpg'),
    credit: credit('Paro Taktsang, Bhutan (edited).jpg'),
    aliases: [
      'بارو', 'paro', 'bhutan', 'بوتان', 'tiger\'s nest', 'tigers nest', 'taktsang', 'تاكسانغ',
      'دير عش النمر', 'عش النمر', 'thimphu', 'تيمفو',
    ],
    focus: '40% 50%',
    copy: {
      ar: {
        city: 'بارو',
        landmark: 'دير عش النمر',
        description:
          'دير بوذي معلق على جرف صخري على ارتفاع ٣١٢٠ متراً، يُصعد إليه على ممر ضيق بين أشجار الصنوبر. اسمه المحلي تاكسانغ، أي عرين النمر.',
      },
      en: {
        city: 'Paro',
        landmark: 'Tiger’s Nest Monastery',
        description:
          'A Buddhist monastery clinging to a cliff at 3,120 metres, reached by a narrow path through pine forest. Its local name, Taktsang, means the tiger’s lair.',
      },
      de: {
        city: 'Paro',
        landmark: 'Kloster Tigers Nest',
        description:
          'Ein buddhistisches Kloster an einer Felswand auf 3.120 Metern, erreichbar über einen schmalen Pfad durch den Kiefernwald. Sein Name Taktsang bedeutet „Tigernest“.',
      },
      ru: {
        city: 'Паро',
        landmark: 'Монастырь Такцанг',
        description:
          'Буддийский монастырь, прилепившийся к скале на высоте 3 120 метров; к нему ведёт узкая тропа через сосновый лес. Местное имя Такцанг — «гнездо тигра».',
      },
      it: {
        city: 'Paro',
        landmark: 'Monastero del Nido della Tigre',
        description:
          'Un monastero buddista aggrappato a una parete rocciosa a 3.120 metri, raggiunto da un sentiero tra i pini. Il nome locale Taktsang significa «nido della tigre».',
      },
    },
  },
  {
    id: 'male',
    countryCode: 'MV',
    timezone: 'Indian/Maldives',
    latitude: 4.1755,
    longitude: 73.5093,
    image: commons('Male\' Hukuru Miskiy 1.jpg'),
    credit: credit('Male\' Hukuru Miskiy 1.jpg'),
    aliases: [
      'ماليه', 'male', 'malé', 'maldives', 'المالديف', 'hukuru miskiy', 'مسجد هوكورو مسكي',
      'friday mosque', 'المسجد القديم',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'ماليه',
        landmark: 'مسجد هوكورو مسكي',
        description:
          'أقدم مسجد في ماليه، بُني في القرن السابع عشر من حجر مرجاني منحوت ونُقشت آيات قرآنية على سقفه الخشبي. مئذنته البيضاء تطل على سوق السمك.',
      },
      en: {
        city: 'Malé',
        landmark: 'Hukuru Miskiy',
        description:
          'The oldest mosque in Malé, built in the seventeenth century from carved coral stone, with Quranic verses carved into its wooden ceiling. Its white minaret stands over the fish market.',
      },
      de: {
        city: 'Malé',
        landmark: 'Hukuru Miskiy',
        description:
          'Die älteste Moschee von Malé, im 17. Jahrhundert aus behauenem Korallenstein errichtet, mit Koranversen in der Holzdecke. Ihr weißes Minarett steht über dem Fischmarkt.',
      },
      ru: {
        city: 'Мале',
        landmark: 'Мечеть Хукуру Миский',
        description:
          'Старейшая мечеть Мале, построенная в XVII веке из резного кораллового камня; на деревянном потолке вырезаны коранические строки. Белый минарет поднимается над рыбным рынком.',
      },
      it: {
        city: 'Malé',
        landmark: 'Hukuru Miskiy',
        description:
          'La più antica moschea di Malé, costruita nel Seicento in pietra corallina intagliata, con versetti coranici incisi nel soffitto di legno. Il minareto bianco sovrasta il mercato del pesce.',
      },
    },
  },
  {
    id: 'yangon',
    countryCode: 'MM',
    timezone: 'Asia/Yangon',
    latitude: 16.7988,
    longitude: 96.1489,
    image: commons('Shwedagon Zedi Daw Yangon 4.jpg'),
    credit: credit('Shwedagon Zedi Daw Yangon 4.jpg'),
    aliases: [
      'يانغون', 'yangon', 'rangoon', 'myanmar', 'ميانمار', 'shwedagon', 'شويداغون',
      'shwedagon pagoda', 'معبد شويداغون', 'naypyidaw', 'نايبيداو',
    ],
    copy: {
      ar: {
        city: 'يانغون',
        landmark: 'معبد شويداغون',
        description:
          'معبد ذهبي مهيب على تل سينغوتارا، قمته مغطاة بألواح ذهبية وتعلوها أحجار كريمة، ويُعد أقدس معبد بوذي في ميانمار.',
      },
      en: {
        city: 'Yangon',
        landmark: 'Shwedagon Pagoda',
        description:
          'A golden pagoda on Singuttara Hill, its spire covered in gold plates and set with precious stones; it is the holiest Buddhist shrine in Myanmar.',
      },
      de: {
        city: 'Yangon',
        landmark: 'Shwedagon-Pagode',
        description:
          'Eine goldene Pagode auf dem Singuttara-Hügel, deren Turm mit Goldplatten verkleidet und mit Edelsteinen besetzt ist; sie gilt als heiligster buddhistischer Ort Myanmars.',
      },
      ru: {
        city: 'Янгон',
        landmark: 'Пагода Шведагон',
        description:
          'Золотая пагода на холме Сингутара: шпиль покрыт золотыми пластинами и украшен драгоценными камнями, это главная буддийская святыня Мьянмы.',
      },
      it: {
        city: 'Yangon',
        landmark: 'Pagoda Shwedagon',
        description:
          'Una pagoda dorata sulla collina di Singuttara, con la guglia rivestita d’oro e incrostata di pietre preziose: è il santuario buddista più sacro del Myanmar.',
      },
    },
  },
  {
    id: 'vientiane',
    countryCode: 'LA',
    timezone: 'Asia/Vientiane',
    latitude: 17.9763,
    longitude: 102.635,
    image: commons('Pha That Luang Sunrise Panorama BLS.jpg'),
    credit: credit('Pha That Luang Sunrise Panorama BLS.jpg'),
    aliases: [
      'فيينتيان', 'vientiane', 'laos', 'لاوس', 'pha that luang', 'فاتات لوانغ', 'فا ذات لوانغ',
      'that luang',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'فيينتيان',
        landmark: 'فا ذات لوانغ',
        description:
          'ستوبا ذهبية ضخمة تُعد الرمز الوطني للاوس، قام أصلها في القرن السادس عشر وتحيط بها ساحة مغلقة وأديرة. قمتها المدببة مغطاة بالذهب.',
      },
      en: {
        city: 'Vientiane',
        landmark: 'Pha That Luang',
        description:
          'The great golden stupa that is Laos’ national symbol, first built in the sixteenth century and ringed by a cloister and monasteries. Its spire is covered in gold.',
      },
      de: {
        city: 'Vientiane',
        landmark: 'Pha That Luang',
        description:
          'Die große goldene Stupa, das Nationalsymbol von Laos, im 16. Jahrhundert begründet und von einem Kreuzgang und Klöstern umgeben. Ihre Spitze ist mit Gold verkleidet.',
      },
      ru: {
        city: 'Вьентьян',
        landmark: 'Пха Тхат Луанг',
        description:
          'Большая золотая ступа, национальный символ Лаоса, основанная в XVI веке и окружённая галереей и монастырями. Её шпиль покрыт золотом.',
      },
      it: {
        city: 'Vientiane',
        landmark: 'Pha That Luang',
        description:
          'La grande stupa dorata, simbolo nazionale del Laos, fondata nel Cinquecento e circondata da un chiostro e da monasteri. La guglia è rivestita d’oro.',
      },
    },
  },
  {
    id: 'tsonjin-boldog',
    countryCode: 'MN',
    timezone: 'Asia/Ulaanbaatar',
    latitude: 47.808,
    longitude: 106.53,
    image: commons('Genghis Khan Equestrian Statue, photo by Vaiz Ha.jpg'),
    credit: credit('Genghis Khan Equestrian Statue, photo by Vaiz Ha.jpg'),
    aliases: [
      'تسونجين بولدوج', 'tsonjin boldog', 'mongolia', 'منغوليا', 'genghis khan', 'جنكيز خان',
      'genghis khan statue', 'تمثال جنكيز خان', 'ulaanbaatar', 'أولان باتور',
    ],
    focus: '40% 50%',
    copy: {
      ar: {
        city: 'تسونجين بولدوج',
        landmark: 'تمثال جنكيز خان الفارس',
        description:
          'تمثال من الفولاذ المقاوم للصدأ لجنكيز خان على ظهر جواده، يبلغ ارتفاعه أربعين متراً ويقف على تلة في تسونجين بولدوج شرق أولان باتور.',
      },
      en: {
        city: 'Tsonjin Boldog',
        landmark: 'Genghis Khan Equestrian Statue',
        description:
          'A 40-metre stainless-steel statue of Genghis Khan on horseback, standing on a hill at Tsonjin Boldog east of Ulaanbaatar.',
      },
      de: {
        city: 'Tsonjin Boldog',
        landmark: 'Reiterstatue des Dschingis Khan',
        description:
          'Eine 40 Meter hohe Reiterstatue aus Edelstahl, die Dschingis Khan auf einem Hügel bei Tsonjin Boldog östlich von Ulaanbaatar zeigt.',
      },
      ru: {
        city: 'Цонжин-Болдог',
        landmark: 'Конная статуя Чингисхана',
        description:
          '40-метровая конная статуя Чингисхана из нержавеющей стали на холме в Цонжин-Болдоге к востоку от Улан-Батора.',
      },
      it: {
        city: 'Tsonjin Boldog',
        landmark: 'Statua equestre di Gengis Khan',
        description:
          'Una statua equestre di 40 metri in acciaio inox dedicata a Gengis Khan, su una collina a Tsonjin Boldog, a est di Ulan Bator.',
      },
    },
  },
  {
    id: 'astana',
    countryCode: 'KZ',
    timezone: 'Asia/Almaty',
    latitude: 51.1251,
    longitude: 71.4317,
    image: commons('Night at Esil District, Astana (P1190721).jpg'),
    credit: credit('Night at Esil District, Astana (P1190721).jpg'),
    aliases: [
      'أستانا', 'astana', 'nur-sultan', 'nursultan', 'kazakhstan', 'كازاخستان', 'baiterek',
      'بايتيريك', 'baiterek tower', 'برج بايتيريك',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'أستانا',
        landmark: 'برج بايتيريك',
        description:
          'برج أبيض ارتفاعه سبعة وتسعون متراً في قلب أستانا، تحمله ساق متسعة وتعلوه كرة زجاجية ذهبية، وهو رمز العاصمة الكازاخية.',
      },
      en: {
        city: 'Astana',
        landmark: 'Baiterek Tower',
        description:
          'A 97-metre white tower in the heart of Astana, held up by a splayed leg and crowned with a golden glass sphere; it is the emblem of the Kazakh capital.',
      },
      de: {
        city: 'Astana',
        landmark: 'Baiterek-Turm',
        description:
          'Ein 97 Meter hoher weißer Turm im Zentrum von Astana, getragen von einem sich weitenden Schaft und gekrönt von einer goldenen Glaskugel; er gilt als Wahrzeichen der Hauptstadt.',
      },
      ru: {
        city: 'Астана',
        landmark: 'Башня Байтерек',
        description:
          'Белая башня высотой 97 метров в центре Астаны: её держит расширяющаяся опора, а венчает золотая стеклянная сфера. Это символ казахстанской столицы.',
      },
      it: {
        city: 'Astana',
        landmark: 'Torre Baiterek',
        description:
          'Una torre bianca di 97 metri nel cuore di Astana, sorretta da una gamba che si allarga e coronata da una sfera di vetro dorata: è l’emblema della capitale kazaka.',
      },
    },
  },
  {
    id: 'samarkand',
    countryCode: 'UZ',
    timezone: 'Asia/Samarkand',
    latitude: 39.6548,
    longitude: 66.9757,
    image: commons('Registan 01.jpg'),
    credit: credit('Registan 01.jpg'),
    aliases: [
      'سمرقند', 'samarkand', 'samarqand', 'uzbekistan', 'أوزبكستان', 'registan', 'ريجستان',
      'registan square', 'ساحة ريجستان', 'tashkent', 'طشقند',
    ],
    copy: {
      ar: {
        city: 'سمرقند',
        landmark: 'ساحة ريجستان',
        description:
          'ثلاث مدارس إسلامية كُسيت واجهاتها بالقاشاني الفيروزي وتواجه ساحة واحدة، بُنيت بين القرنين الخامس عشر والسابع عشر، وهي قلب سمرقند التاريخي.',
      },
      en: {
        city: 'Samarkand',
        landmark: 'Registan Square',
        description:
          'Three madrasas faced in turquoise tile around a single square, built between the fifteenth and seventeenth centuries: the historic heart of Samarkand.',
      },
      de: {
        city: 'Samarkand',
        landmark: 'Registan',
        description:
          'Drei mit Türkisfliesen verkleidete Medresen um einen Platz, zwischen dem 15. und 17. Jahrhundert erbaut – das historische Herz von Samarkand.',
      },
      ru: {
        city: 'Самарканд',
        landmark: 'Площадь Регистан',
        description:
          'Три медресе в бирюзовых изразцах, выстроенные вокруг площади в XV–XVII веках, — историческое сердце Самарканда.',
      },
      it: {
        city: 'Samarcanda',
        landmark: 'Piazza Registan',
        description:
          'Tre madrase rivestite di piastrelle turchesi attorno a un’unica piazza, costruite tra Quattro e Seicento: il cuore storico di Samarcanda.',
      },
    },
  },
  {
    id: 'tokmok',
    countryCode: 'KG',
    timezone: 'Asia/Bishkek',
    latitude: 42.7464,
    longitude: 75.2501,
    image: commons('Burana Tower, Kyrgyzstan 01.jpg'),
    credit: credit('Burana Tower, Kyrgyzstan 01.jpg'),
    aliases: [
      'توكموك', 'tokmok', 'kyrgyzstan', 'قيرغيزستان', 'burana', 'بورانا', 'burana tower',
      'برج بورانا', 'bishkek', 'بيشكيك',
    ],
    copy: {
      ar: {
        city: 'توكموك',
        landmark: 'برج بورانا',
        description:
          'مئذنة من الطوب تعود إلى القرن الحادي عشر وترتفع أربعة وعشرين متراً، وهي ما بقي من مدينة بلاساغون القديمة في وادي تشوي قرب توكموك.',
      },
      en: {
        city: 'Tokmok',
        landmark: 'Burana Tower',
        description:
          'An eleventh-century brick minaret 24 metres tall, the last survivor of the ancient city of Balasagun in the Chuy valley near Tokmok.',
      },
      de: {
        city: 'Tokmok',
        landmark: 'Burana-Turm',
        description:
          'Ein 24 Meter hohes Backsteinminarett aus dem 11. Jahrhundert, der letzte Rest der Stadt Balasagun im Tschüi-Tal bei Tokmok.',
      },
      ru: {
        city: 'Токмок',
        landmark: 'Башня Бурана',
        description:
          'Кирпичный минарет XI века высотой 24 метра — всё, что осталось от города Баласагун в Чуйской долине близ Токмока.',
      },
      it: {
        city: 'Tokmok',
        landmark: 'Torre Burana',
        description:
          'Un minareto di mattoni dell’XI secolo alto 24 metri, ultimo resto dell’antica Balasagun nella valle del Čüj, vicino a Tokmok.',
      },
    },
  },
  {
    id: 'dushanbe',
    countryCode: 'TJ',
    timezone: 'Asia/Dushanbe',
    latitude: 38.5358,
    longitude: 68.779,
    image: commons('Ismoili Somoni monument Dushanbe 2026.jpg'),
    credit: credit('Ismoili Somoni monument Dushanbe 2026.jpg'),
    aliases: [
      'دوشنبه', 'dushanbe', 'tajikistan', 'طاجيكستان', 'ismoil somoni', 'إسماعيل ساماني',
      'ismail samani', 'نصب إسماعيل ساماني', 'somoni monument',
    ],
    capital: true,
    focus: '45% 50%',
    copy: {
      ar: {
        city: 'دوشنبه',
        landmark: 'نصب إسماعيل ساماني',
        description:
          'نصب مهيب لإسماعيل الساماني، مؤسس الدولة السامانية، يقف في وسط دوشنبه تحت قوس ذهبي يعلوه تاج.',
      },
      en: {
        city: 'Dushanbe',
        landmark: 'Ismoil Somoni Monument',
        description:
          'A towering monument to Ismoil Somoni, founder of the Samanid state, standing in central Dushanbe beneath a golden arch and crown.',
      },
      de: {
        city: 'Duschanbe',
        landmark: 'Ismoil-Somoni-Denkmal',
        description:
          'Ein hoch aufragendes Denkmal für Ismoil Somoni, den Begründer des Samanidenstaats, im Zentrum von Duschanbe unter einem goldenen Bogen.',
      },
      ru: {
        city: 'Душанбе',
        landmark: 'Монумент Исмоила Сомони',
        description:
          'Внушительный монумент Исмоилу Сомони, основателю Саманидского государства, в центре Душанбе под золотой аркой и короной.',
      },
      it: {
        city: 'Dušanbe',
        landmark: 'Monumento a Ismoil Somoni',
        description:
          'Un monumento imponente a Ismoil Somoni, fondatore dello Stato samanide, nel centro di Dušanbe sotto un arco dorato e una corona.',
      },
    },
  },
  {
    id: 'ashgabat',
    countryCode: 'TM',
    timezone: 'Asia/Ashgabat',
    latitude: 37.8826,
    longitude: 58.3334,
    image: commons('Rustam Minnikhanov\'s trip to Turkmenistan 2008 11.jpg'),
    credit: credit('Rustam Minnikhanov\'s trip to Turkmenistan 2008 11.jpg'),
    aliases: [
      'عشق آباد', 'ashgabat', 'turkmenistan', 'تركمانستان', 'turkmenbasy ruhy mosque',
      'turkmenbashi mosque', 'gypjak', 'غيبتشاك', 'جامع تركمانباشي', 'مسجد تركمانباشي',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'عشق آباد',
        landmark: 'جامع تركمانباشي الروحي',
        description:
          'مسجد ضخم من الرخام الأبيض بقبة ذهبية وأربع مآذن في غيبجاك على أطراف عشق آباد، بناه تركمانباشي تخليداً لوالده، وهو أكبر مسجد في البلاد.',
      },
      en: {
        city: 'Ashgabat',
        landmark: 'Türkmenbaşy Ruhy Mosque',
        description:
          'A vast white-marble mosque with one golden dome and four minarets at Gypjak on the edge of Ashgabat, built by Türkmenbaşy in memory of his father; it is the largest mosque in the country.',
      },
      de: {
        city: 'Aschgabat',
        landmark: 'Türkmenbaşy-Ruhy-Moschee',
        description:
          'Eine gewaltige Moschee aus weißem Marmor mit einer goldenen Kuppel und vier Minaretten in Gypjak am Rand von Aschgabat, von Türkmenbaşy zum Gedenken an seinen Vater erbaut; sie ist die größte Moschee des Landes.',
      },
      ru: {
        city: 'Ашхабад',
        landmark: 'Мечеть Туркменбаши Рухы',
        description:
          'Огромная мечеть из белого мрамора с золотым куполом и четырьмя минаретами в Гипджаке на окраине Ашхабада, построенная Туркменбаши в память об отце; крупнейшая мечеть страны.',
      },
      it: {
        city: 'Ašgabat',
        landmark: 'Moschea Türkmenbaşy Ruhy',
        description:
          'Una vasta moschea di marmo bianco con una cupola dorata e quattro minareti a Gypjak, ai margini di Ašgabat, fatta costruire da Türkmenbaşy in memoria del padre: è la più grande del paese.',
      },
    },
  },
  {
    id: 'baku',
    countryCode: 'AZ',
    timezone: 'Asia/Baku',
    latitude: 40.3777,
    longitude: 49.892,
    image: commons('Flame towers from Baku boulevard.JPG'),
    credit: credit('Flame towers from Baku boulevard.JPG'),
    aliases: [
      'باكو', 'baku', 'azerbaijan', 'أذربيجان', 'flame towers', 'أبراج اللهب', 'flame tower',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'باكو',
        landmark: 'أبراج اللهب',
        description:
          'ثلاثة أبراج من الزجاج والفولاذ على تلة تطل على خليج باكو، تُضاء ليلاً بشرائط ضوء تشبه ألسنة اللهب.',
      },
      en: {
        city: 'Baku',
        landmark: 'Flame Towers',
        description:
          'Three towers of glass and steel on a hill above Baku bay, lit at night with flame-shaped bands of light.',
      },
      de: {
        city: 'Baku',
        landmark: 'Flammenstürme',
        description:
          'Drei Türme aus Glas und Stahl auf einem Hügel über der Bucht von Baku, nachts mit flammenartigen Lichtbändern erleuchtet.',
      },
      ru: {
        city: 'Баку',
        landmark: 'Пламенные башни',
        description:
          'Три башни из стекла и стали на холме над Бакинской бухтой; ночью их фасады светятся полосами, похожими на пламя.',
      },
      it: {
        city: 'Baku',
        landmark: 'Torri della Fiamma',
        description:
          'Tre torri di vetro e acciaio su una collina sopra la baia di Baku, illuminate di notte da fasce di luce a forma di fiamma.',
      },
    },
  },
  {
    id: 'yerevan',
    countryCode: 'AM',
    timezone: 'Asia/Yerevan',
    latitude: 40.19,
    longitude: 44.5155,
    image: commons('Cascade, Yerevan, July 2023 17 27 24 039000.jpeg'),
    credit: credit('Cascade, Yerevan, July 2023 17 27 24 039000.jpeg'),
    aliases: [
      'يريفان', 'yerevan', 'armenia', 'أرمينيا', 'cascade', 'كاسكيد', 'cascade complex',
      'مجمع كاسكيد',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'يريفان',
        landmark: 'مجمع كاسكيد',
        description:
          'خمس مصاطب من الحدائق والنوافير والتماثيل تتسلق تلة في وسط يريفان على امتداد ثلاثمئة متر، ومن أعلاها يمتد النظر إلى جبل أرارات.',
      },
      en: {
        city: 'Yerevan',
        landmark: 'Cascade Complex',
        description:
          'Five terraces of gardens, fountains and sculptures climb a hill in central Yerevan for 302 metres; from the top the view runs over the city to Mount Ararat.',
      },
      de: {
        city: 'Jerewan',
        landmark: 'Kaskadenkomplex',
        description:
          'Fünf Terrassen mit Gärten, Brunnen und Skulpturen steigen 302 Meter den Hügel im Zentrum von Jerewan hinauf; oben reicht der Blick über die Stadt zum Ararat.',
      },
      ru: {
        city: 'Ереван',
        landmark: 'Каскад',
        description:
          'Пять террас с садами, фонтанами и скульптурами поднимаются на 302 метра по холму в центре Еревана; сверху открывается вид на город и Арарат.',
      },
      it: {
        city: 'Erevan',
        landmark: 'Complesso del Cascade',
        description:
          'Cinque terrazze di giardini, fontane e sculture salgono per 302 metri su una collina nel centro di Erevan; dall’alto lo sguardo corre sulla città fino all’Ararat.',
      },
    },
  },
  {
    id: 'tbilisi',
    countryCode: 'GE',
    timezone: 'Asia/Tbilisi',
    latitude: 41.6972,
    longitude: 44.8162,
    image: commons('Samebao0000.jpg'),
    credit: credit('Samebao0000.jpg'),
    aliases: [
      'تبليسي', 'tbilisi', 'georgia', 'جورجيا', 'sameba', 'ساميبا', 'holy trinity cathedral',
      'كاتدرائية الثالوث الأقدس', 'trinity cathedral',
    ],
    capital: true,
    focus: '60% 35%',
    copy: {
      ar: {
        city: 'تبليسي',
        landmark: 'كاتدرائية الثالوث الأقدس (ساميبا)',
        description:
          'أكبر كاتدرائية في جورجيا، بُنيت بين عامي ١٩٩٥ و٢٠٠٤ على تلة في تبليسي، وقبتها الذهبية تُرى من كل أحياء المدينة.',
      },
      en: {
        city: 'Tbilisi',
        landmark: 'Holy Trinity Cathedral (Sameba)',
        description:
          'The largest cathedral in Georgia, built between 1995 and 2004 on a hill in Tbilisi, its gilded dome visible from every quarter of the city.',
      },
      de: {
        city: 'Tiflis',
        landmark: 'Kathedrale der Heiligen Dreifaltigkeit (Sameba)',
        description:
          'Die größte Kathedrale Georgiens, 1995 bis 2004 auf einem Hügel in Tiflis erbaut; ihre vergoldete Kuppel ist aus allen Vierteln der Stadt zu sehen.',
      },
      ru: {
        city: 'Тбилиси',
        landmark: 'Собор Святой Троицы (Самеба)',
        description:
          'Крупнейший собор Грузии, построенный в 1995–2004 годах на холме в Тбилиси; его золочёный купол виден из всех районов города.',
      },
      it: {
        city: 'Tbilisi',
        landmark: 'Cattedrale della Santissima Trinità (Sameba)',
        description:
          'La più grande cattedrale della Georgia, costruita tra il 1995 e il 2004 su una collina di Tbilisi: la cupola dorata si vede da ogni quartiere.',
      },
    },
  },
  {
    id: 'kyiv',
    countryCode: 'UA',
    timezone: 'Europe/Kyiv',
    latitude: 50.4529,
    longitude: 30.5143,
    image: commons('80-391-0151 Kyiv St.Sophia\'s Cathedral RB 18 2.jpg'),
    credit: credit('80-391-0151 Kyiv St.Sophia\'s Cathedral RB 18 2.jpg'),
    aliases: [
      'كييف', 'kyiv', 'kiev', 'ukraine', 'أوكرانيا', 'saint sophia', 'القديسة صوفيا',
      'saint sophia cathedral', 'كاتدرائية القديسة صوفيا',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'كييف',
        landmark: 'كاتدرائية القديسة صوفيا',
        description:
          'كاتدرائية من القرن الحادي عشر في قلب كييف مع برج جرسها الأزرق المائل، وتحفظ في داخلها أكبر مجموعة باقية من فسيفساء وجداريات ذلك القرن في أوكرانيا.',
      },
      en: {
        city: 'Kyiv',
        landmark: 'Saint Sophia Cathedral',
        description:
          'An eleventh-century cathedral in the heart of Kyiv with its leaning blue bell tower; inside it keeps the largest surviving set of eleventh-century mosaics and frescoes in Ukraine.',
      },
      de: {
        city: 'Kyjiw',
        landmark: 'Sophienkathedrale',
        description:
          'Eine Kathedrale aus dem 11. Jahrhundert im Herzen Kyjiws mit ihrem schiefen blauen Glockenturm; innen bewahrt sie das größte erhaltene Mosaik- und Freskenensemble der Ukraine aus dieser Zeit.',
      },
      ru: {
        city: 'Киев',
        landmark: 'Софийский собор',
        description:
          'Собор XI века в центре Киева с наклонившейся синей колокольней; внутри сохранился крупнейший в Украине ансамбль мозаик и фресок XI века.',
      },
      it: {
        city: 'Kyiv',
        landmark: 'Cattedrale di Santa Sofia',
        description:
          'Una cattedrale dell’XI secolo nel cuore di Kyiv con il campanile blu pendente; all’interno conserva il più ampio ciclo di mosaici e affreschi dell’XI secolo in Ucraina.',
      },
    },
  },
  {
    id: 'bran',
    countryCode: 'RO',
    timezone: 'Europe/Bucharest',
    latitude: 45.5151,
    longitude: 25.3672,
    image: commons('Bran Castle (Toerzburg or Castelul Bran)-05ASD.jpg'),
    credit: credit('Bran Castle (Toerzburg or Castelul Bran)-05ASD.jpg'),
    aliases: [
      'بران', 'bran', 'romania', 'رومانيا', 'bran castle', 'قلعة بران', 'dracula castle',
      'قلعة دراكولا', 'bucharest', 'بوخارست',
    ],
    copy: {
      ar: {
        city: 'بران',
        landmark: 'قلعة بران',
        description:
          'قلعة على صخرة عند ممر جبلي بين ترانسلفانيا ووالاشيا، بدأ بناؤها في القرن الرابع عشر، وربطتها الحكايات بدراكولا.',
      },
      en: {
        city: 'Bran',
        landmark: 'Bran Castle',
        description:
          'A castle on a rock at a mountain pass between Transylvania and Wallachia, begun in the fourteenth century and tied in legend to Dracula.',
      },
      de: {
        city: 'Bran',
        landmark: 'Schloss Bran',
        description:
          'Eine Burg auf einem Felsen an einem Gebirgspass zwischen Siebenbürgen und der Walachei, im 14. Jahrhundert begonnen und der Legende nach mit Dracula verbunden.',
      },
      ru: {
        city: 'Бран',
        landmark: 'Замок Бран',
        description:
          'Замок на скале у горного перевала между Трансильванией и Валахией, заложенный в XIV веке и связанный легендой с Дракулой.',
      },
      it: {
        city: 'Bran',
        landmark: 'Castello di Bran',
        description:
          'Un castello su una roccia a un passo di montagna tra Transilvania e Valacchia, iniziato nel Trecento e legato dalla leggenda a Dracula.',
      },
    },
  },
  {
    id: 'sofia',
    countryCode: 'BG',
    timezone: 'Europe/Sofia',
    latitude: 42.6961,
    longitude: 23.3333,
    image: commons('Saint Alexander Nevsky Cathedral, Façade from Northeast.jpg'),
    credit: credit('Saint Alexander Nevsky Cathedral, Façade from Northeast.jpg'),
    aliases: [
      'صوفيا', 'sofia', 'bulgaria', 'بلغاريا', 'alexander nevsky', 'ألكسندر نيفسكي',
      'alexander nevsky cathedral', 'كاتدرائية ألكسندر نيفسكي',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'صوفيا',
        landmark: 'كاتدرائية ألكسندر نيفسكي',
        description:
          'كاتدرائية أرثوذكسية بقباب ذهبية وقبة مركزية خضراء، بُنيت بين عامي ١٨٨٢ و١٩١٢ تكريماً للجنود الروس الذين سقطوا في حرب ١٨٧٧ و١٨٧٨.',
      },
      en: {
        city: 'Sofia',
        landmark: 'Alexander Nevsky Cathedral',
        description:
          'An Orthodox cathedral of golden domes and a great green cupola, built between 1882 and 1912 to honour the Russian soldiers who fell in the war of 1877–78.',
      },
      de: {
        city: 'Sofia',
        landmark: 'Alexander-Newski-Kathedrale',
        description:
          'Eine orthodoxe Kathedrale mit goldenen Kuppeln und großer grüner Mittelkuppel, 1882 bis 1912 zum Gedenken an die russischen Gefallenen des Krieges 1877/78 erbaut.',
      },
      ru: {
        city: 'София',
        landmark: 'Собор Александра Невского',
        description:
          'Православный собор с золотыми куполами и большой зелёной главой, построенный в 1882–1912 годах в память о русских воинах, павших в войне 1877–1878 годов.',
      },
      it: {
        city: 'Sofia',
        landmark: 'Cattedrale di Aleksandr Nevskij',
        description:
          'Una cattedrale ortodossa dalle cupole dorate e dalla grande cupola verde, costruita tra il 1882 e il 1912 in memoria dei soldati russi caduti nella guerra del 1877-78.',
      },
    },
  },
  {
    id: 'belgrade',
    countryCode: 'RS',
    timezone: 'Europe/Belgrade',
    latitude: 44.804,
    longitude: 20.4651,
    image: commons('P037152-661920 - Belgrade fortress stand at the downtown of Belgrade.jpg'),
    credit: credit('P037152-661920 - Belgrade fortress stand at the downtown of Belgrade.jpg'),
    aliases: [
      'بلغراد', 'belgrade', 'beograd', 'serbia', 'صربيا', 'kalemegdan', 'كالميغدان',
      'belgrade fortress', 'قلعة بلغراد',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'بلغراد',
        landmark: 'قلعة بلغراد (كالميغدان)',
        description:
          'قلعة على الحرف الذي يلتقي فيه نهر سافا بالدانوب، وقد صار متنزه كالميغدان اليوم ممراً للمشاة ومطلّاً على قلب بلغراد.',
      },
      en: {
        city: 'Belgrade',
        landmark: 'Belgrade Fortress (Kalemegdan)',
        description:
          'A fortress on the ridge where the Sava meets the Danube; its Kalemegdan park is now the promenade and lookout of central Belgrade.',
      },
      de: {
        city: 'Belgrad',
        landmark: 'Belgrader Festung (Kalemegdan)',
        description:
          'Eine Festung auf dem Grat, an dem die Save in die Donau mündet; ihr Kalemegdan-Park ist heute Flaniermeile und Aussichtspunkt im Zentrum Belgrads.',
      },
      ru: {
        city: 'Белград',
        landmark: 'Белградская крепость (Калемегдан)',
        description:
          'Крепость на гребне у впадения Савы в Дунай; её парк Калемегдан стал прогулочной зоной и смотровой площадкой центра Белграда.',
      },
      it: {
        city: 'Belgrado',
        landmark: 'Fortezza di Belgrado (Kalemegdan)',
        description:
          'Una fortezza sul crinale dove la Sava incontra il Danubio; il suo parco Kalemegdan è oggi il passeggio e il belvedere del centro di Belgrado.',
      },
    },
  },
];
