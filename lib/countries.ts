import type { Lang } from './i18n';
import type { ThemeName } from './types';

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
  credit: { label: string; url: string };
  aliases: string[];
  copy: Record<Lang, SceneText>;
  /** CSS object-position used to keep the subject in frame on tall screens. */
  focus?: string;
  /** Extra zoom on tall screens, anchored at the bottom so low subjects stay visible. */
  zoom?: number;
  theme?: ThemeName;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=78`;

// Special:FilePath resolves to the canonical thumbnail for any file name, so the
// stored paths cannot drift out of sync with Wikimedia's hash directories.
export const commons = (path: string, width = 1600) => {
  const raw = path.split('/').pop() ?? path;
  let file = raw;
  try {
    file = decodeURIComponent(raw);
  } catch {
    /* keep the raw name when it is not valid percent-encoding */
  }
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
};

const UNSPLASH_CREDIT = { label: 'Unsplash', url: 'https://unsplash.com' };
export const credit = (file: string) => ({
  label: 'Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
});

/** Localised country names, keyed by ISO 3166-1 alpha-2 code. */
export const COUNTRY_NAMES: Record<string, CountryName> = {
  EG: { ar: 'مصر', en: 'Egypt', de: 'Ägypten', ru: 'Египет', it: 'Egitto' },
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
    image: unsplash('1512453979798-5ea266f8880c'),
    credit: UNSPLASH_CREDIT,
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
    image: unsplash('1564769625905-50e93615e769'),
    credit: UNSPLASH_CREDIT,
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
    image: unsplash('1591604129939-f1efa4d9f7fa'),
    credit: UNSPLASH_CREDIT,
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
    image: commons('Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg'),
    credit: credit('Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg'),
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
    credit: credit('Manama_Bahrain_World_Trade_Centre_%2526_Bahrain_Financial_Harbour_1.jpg'),
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
    image: commons('Pigeon_Rocks_at_sunset%2C_Beirut%2C_Lebanon.jpg'),
    credit: credit('Pigeon_Rocks_at_sunset%2C_Beirut%2C_Lebanon.jpg'),
    aliases: [
      'بيروت', 'beirut', 'لبنان',
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
    image: unsplash('1597212618440-806262de4f6b'),
    credit: UNSPLASH_CREDIT,
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
    latitude: 37.5665,
    longitude: 126.978,
    image: commons('Seoul%20night%20skyline%202018.jpg'),
    credit: credit('Seoul%20night%20skyline%202018.jpg'),
    aliases: [
      'سيول', 'سول', 'seoul',
    ],
    copy: {
      ar: {
        city: 'سيول',
        landmark: 'برج سيول N',
        description:
          'برج سيول N يقف على جبل نامسان في قلب العاصمة، وتحته يعبر نهر هان المدينة بين عشرات الجسور المضاءة. ليلاً يمتلئ الأفق بالضوء الأزرق والأحمر حتى الجبال.',
      },
      en: {
        city: 'Seoul',
        landmark: 'N Seoul Tower',
        description:
          'N Seoul Tower stands on Namsan in the middle of the capital, and below it the Han River crosses the city under dozens of lit bridges. At night the skyline fills with blue and red light out to the mountains.',
      },
      de: {
        city: 'Seoul',
        landmark: 'Der N Seoul Tower',
        description:
          'Der N Seoul Tower steht auf dem Namsan mitten in der Hauptstadt; darunter durchquert der Han-Fluss die Stadt unter Dutzenden beleuchteten Brücken. Nachts füllt sich der Horizont mit blauem und rotem Licht bis zu den Bergen.',
      },
      ru: {
        city: 'Сеул',
        landmark: 'Башня N Seoul',
        description:
          'Башня N Seoul стоит на горе Намсан в центре столицы, а под ней река Хан пересекает город под десятками освещённых мостов. Ночью горизонт наполняется синим и красным светом до самых гор.',
      },
      it: {
        city: 'Seul',
        landmark: 'La N Seoul Tower',
        description:
          'La N Seoul Tower sorge sul Namsan nel cuore della capitale, e sotto di essa il fiume Han attraversa la città fra decine di ponti illuminati. Di notte la skyline si riempie di luce blu e rossa fino alle montagne.',
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
];
