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
  AG: { ar: 'أنتيغوا وبربودا', en: 'Antigua and Barbuda', de: 'Antigua und Barbuda', ru: 'Антигуа и Барбуда', it: 'Antigua e Barbuda' },
  KN: { ar: 'سانت كيتس ونيفيس', en: 'Saint Kitts and Nevis', de: 'St. Kitts und Nevis', ru: 'Сент-Китс и Невис', it: 'Saint Kitts e Nevis' },
  VC: { ar: 'سانت فينسنت والغرينادين', en: 'Saint Vincent and the Grenadines', de: 'St. Vincent und die Grenadinen', ru: 'Сент-Винсент и Гренадины', it: 'Saint Vincent e Grenadine' },
  BZ: { ar: 'بليز', en: 'Belize', de: 'Belize', ru: 'Белиз', it: 'Belize' },
  GT: { ar: 'غواتيمالا', en: 'Guatemala', de: 'Guatemala', ru: 'Гватемала', it: 'Guatemala' },
  HN: { ar: 'هندوراس', en: 'Honduras', de: 'Honduras', ru: 'Гондурас', it: 'Honduras' },
  SV: { ar: 'السلفادور', en: 'El Salvador', de: 'El Salvador', ru: 'Сальвадор', it: 'El Salvador' },
  NI: { ar: 'نيكاراغوا', en: 'Nicaragua', de: 'Nicaragua', ru: 'Никарагуа', it: 'Nicaragua' },
  CR: { ar: 'كوستاريكا', en: 'Costa Rica', de: 'Costa Rica', ru: 'Коста-Рика', it: 'Costa Rica' },
  PA: { ar: 'بنما', en: 'Panama', de: 'Panama', ru: 'Панама', it: 'Panama' },
  EC: { ar: 'الإكوادور', en: 'Ecuador', de: 'Ecuador', ru: 'Эквадор', it: 'Ecuador' },
  VE: { ar: 'فنزويلا', en: 'Venezuela', de: 'Venezuela', ru: 'Венесуэла', it: 'Venezuela' },
  GY: { ar: 'غيانا', en: 'Guyana', de: 'Guyana', ru: 'Гайана', it: 'Guyana' },
  SR: { ar: 'سورينام', en: 'Suriname', de: 'Suriname', ru: 'Суринам', it: 'Suriname' },
  BO: { ar: 'بوليفيا', en: 'Bolivia', de: 'Bolivien', ru: 'Боливия', it: 'Bolivia' },
  PY: { ar: 'باراغواي', en: 'Paraguay', de: 'Paraguay', ru: 'Парагвай', it: 'Paraguay' },
  UY: { ar: 'أوروغواي', en: 'Uruguay', de: 'Uruguay', ru: 'Уругвай', it: 'Uruguay' },
  TL: { ar: 'تيمور الشرقية', en: 'Timor-Leste', de: 'Osttimor', ru: 'Восточный Тимор', it: 'Timor Est' },
  BN: { ar: 'بروناي', en: 'Brunei', de: 'Brunei', ru: 'Бруней', it: 'Brunei' },
  KP: { ar: 'كوريا الشمالية', en: 'North Korea', de: 'Nordkorea', ru: 'Северная Корея', it: 'Corea del Nord' },
  KI: { ar: 'كيريباتي', en: 'Kiribati', de: 'Kiribati', ru: 'Кирибати', it: 'Kiribati' },
  TV: { ar: 'توفالو', en: 'Tuvalu', de: 'Tuvalu', ru: 'Тувалу', it: 'Tuvalu' },
  NR: { ar: 'ناورو', en: 'Nauru', de: 'Nauru', ru: 'Науру', it: 'Nauru' },
  PW: { ar: 'بالاو', en: 'Palau', de: 'Palau', ru: 'Палау', it: 'Palau' },
  MH: { ar: 'جزر مارشال', en: 'Marshall Islands', de: 'Marshallinseln', ru: 'Маршалловы Острова', it: 'Isole Marshall' },
  FM: { ar: 'ميكرونيزيا', en: 'Micronesia', de: 'Mikronesien', ru: 'Микронезия', it: 'Micronesia' },
  DO: { ar: 'جمهورية الدومينيكان', en: 'Dominican Republic', de: 'Dominikanische Republik', ru: 'Доминиканская Республика', it: 'Repubblica Dominicana' },
  JM: { ar: 'جامايكا', en: 'Jamaica', de: 'Jamaika', ru: 'Ямайка', it: 'Giamaica' },
  CU: { ar: 'كوبا', en: 'Cuba', de: 'Kuba', ru: 'Куба', it: 'Cuba' },
  BS: { ar: 'الباهاما', en: 'Bahamas', de: 'Bahamas', ru: 'Багамские Острова', it: 'Bahamas' },
  HT: { ar: 'هايتي', en: 'Haiti', de: 'Haiti', ru: 'Гаити', it: 'Haiti' },
  TT: { ar: 'ترينيداد وتوباغو', en: 'Trinidad and Tobago', de: 'Trinidad und Tobago', ru: 'Тринидад и Тобаго', it: 'Trinidad e Tobago' },
  BB: { ar: 'بربادوس', en: 'Barbados', de: 'Barbados', ru: 'Барбадос', it: 'Barbados' },
  GD: { ar: 'غرينادا', en: 'Grenada', de: 'Grenada', ru: 'Гренада', it: 'Grenada' },
  LC: { ar: 'سانت لوسيا', en: 'Saint Lucia', de: 'St. Lucia', ru: 'Сент-Люсия', it: 'Saint Lucia' },
  DM: { ar: 'دومينيكا', en: 'Dominica', de: 'Dominica', ru: 'Доминика', it: 'Dominica' },
  DJ: { ar: 'جيبوتي', en: 'Djibouti', de: 'Dschibuti', ru: 'Джибути', it: 'Gibuti' },
  ER: { ar: 'إريتريا', en: 'Eritrea', de: 'Eritrea', ru: 'Эритрея', it: 'Eritrea' },
  MW: { ar: 'مالاوي', en: 'Malawi', de: 'Malawi', ru: 'Малави', it: 'Malawi' },
  SZ: { ar: 'إسواتيني', en: 'Eswatini', de: 'Eswatini', ru: 'Эсватини', it: 'Eswatini' },
  LS: { ar: 'ليسوتو', en: 'Lesotho', de: 'Lesotho', ru: 'Лесото', it: 'Lesotho' },
  KM: { ar: 'جزر القمر', en: 'Comoros', de: 'Komoren', ru: 'Коморы', it: 'Comore' },
  SC: { ar: 'سيشل', en: 'Seychelles', de: 'Seychellen', ru: 'Сейшельские Острова', it: 'Seychelles' },
  ST: { ar: 'ساو تومي وبرينسيبي', en: 'São Tomé and Príncipe', de: 'São Tomé und Príncipe', ru: 'Сан-Томе и Принсипи', it: 'São Tomé e Príncipe' },
  CV: { ar: 'الرأس الأخضر', en: 'Cabo Verde', de: 'Kap Verde', ru: 'Кабо-Верде', it: 'Capo Verde' },
  GQ: { ar: 'غينيا الاستوائية', en: 'Equatorial Guinea', de: 'Äquatorialguinea', ru: 'Экваториальная Гвинея', it: 'Guinea Equatoriale' },
  MR: { ar: 'موريتانيا', en: 'Mauritania', de: 'Mauretanien', ru: 'Мавритания', it: 'Mauritania' },
  AF: { ar: 'أفغانستان', en: 'Afghanistan', de: 'Afghanistan', ru: 'Афганистан', it: 'Afghanistan' },
  PG: { ar: 'بابوا غينيا الجديدة', en: 'Papua New Guinea', de: 'Papua-Neuguinea', ru: 'Папуа — Новая Гвинея', it: 'Papua Nuova Guinea' },
  FJ: { ar: 'فيجي', en: 'Fiji', de: 'Fidschi', ru: 'Фиджи', it: 'Figi' },
  SB: { ar: 'جزر سولومون', en: 'Solomon Islands', de: 'Salomonen', ru: 'Соломоновы Острова', it: 'Isole Salomone' },
  VU: { ar: 'فانواتو', en: 'Vanuatu', de: 'Vanuatu', ru: 'Вануату', it: 'Vanuatu' },
  WS: { ar: 'ساموا', en: 'Samoa', de: 'Samoa', ru: 'Самоа', it: 'Samoa' },
  TO: { ar: 'تونغا', en: 'Tonga', de: 'Tonga', ru: 'Тонга', it: 'Tonga' },
  GA: { ar: 'الغابون', en: 'Gabon', de: 'Gabun', ru: 'Габон', it: 'Gabon' },
  TD: { ar: 'تشاد', en: 'Chad', de: 'Tschad', ru: 'Чад', it: 'Ciad' },
  NE: { ar: 'النيجر', en: 'Niger', de: 'Niger', ru: 'Нигер', it: 'Niger' },
  ML: { ar: 'مالي', en: 'Mali', de: 'Mali', ru: 'Мали', it: 'Mali' },
  BF: { ar: 'بوركينا فاسو', en: 'Burkina Faso', de: 'Burkina Faso', ru: 'Буркина-Фасо', it: 'Burkina Faso' },
  SL: { ar: 'سيراليون', en: 'Sierra Leone', de: 'Sierra Leone', ru: 'Сьерра-Леоне', it: 'Sierra Leone' },
  LR: { ar: 'ليبيريا', en: 'Liberia', de: 'Liberia', ru: 'Либерия', it: 'Liberia' },
  GN: { ar: 'غينيا', en: 'Guinea', de: 'Guinea', ru: 'Гвинея', it: 'Guinea' },
  GW: { ar: 'غينيا بيساو', en: 'Guinea-Bissau', de: 'Guinea-Bissau', ru: 'Гвинея-Бисау', it: 'Guinea-Bissau' },
  GM: { ar: 'غامبيا', en: 'The Gambia', de: 'Gambia', ru: 'Гамбия', it: 'Gambia' },
  TG: { ar: 'توغو', en: 'Togo', de: 'Togo', ru: 'Того', it: 'Togo' },
  BJ: { ar: 'بنين', en: 'Benin', de: 'Benin', ru: 'Бенин', it: 'Benin' },
  CF: { ar: 'جمهورية أفريقيا الوسطى', en: 'Central African Republic', de: 'Zentralafrikanische Republik', ru: 'ЦАР', it: 'Repubblica Centrafricana' },
  SS: { ar: 'جنوب السودان', en: 'South Sudan', de: 'Südsudan', ru: 'Южный Судан', it: 'Sud Sudan' },
  SO: { ar: 'الصومال', en: 'Somalia', de: 'Somalia', ru: 'Сомали', it: 'Somalia' },
  ET: { ar: 'إثيوبيا', en: 'Ethiopia', de: 'Äthiopien', ru: 'Эфиопия', it: 'Etiopia' },
  TZ: { ar: 'تنزانيا', en: 'Tanzania', de: 'Tansania', ru: 'Танзания', it: 'Tanzania' },
  UG: { ar: 'أوغندا', en: 'Uganda', de: 'Uganda', ru: 'Уганда', it: 'Uganda' },
  GH: { ar: 'غانا', en: 'Ghana', de: 'Ghana', ru: 'Гана', it: 'Ghana' },
  CI: { ar: 'ساحل العاج', en: 'Côte d’Ivoire', de: 'Elfenbeinküste', ru: 'Кот-д’Ивуар', it: 'Costa d’Avorio' },
  SN: { ar: 'السنغال', en: 'Senegal', de: 'Senegal', ru: 'Сенегал', it: 'Senegal' },
  LY: { ar: 'ليبيا', en: 'Libya', de: 'Libyen', ru: 'Ливия', it: 'Libia' },
  AO: { ar: 'أنغولا', en: 'Angola', de: 'Angola', ru: 'Ангола', it: 'Angola' },
  ZM: { ar: 'زامبيا', en: 'Zambia', de: 'Sambia', ru: 'Замбия', it: 'Zambia' },
  ZW: { ar: 'زيمبابوي', en: 'Zimbabwe', de: 'Simbabwe', ru: 'Зимбабве', it: 'Zimbabwe' },
  BW: { ar: 'بوتسوانا', en: 'Botswana', de: 'Botsuana', ru: 'Ботсвана', it: 'Botswana' },
  NA: { ar: 'ناميبيا', en: 'Namibia', de: 'Namibia', ru: 'Намибия', it: 'Namibia' },
  MZ: { ar: 'موزمبيق', en: 'Mozambique', de: 'Mosambik', ru: 'Мозамбик', it: 'Mozambico' },
  MG: { ar: 'مدغشقر', en: 'Madagascar', de: 'Madagaskar', ru: 'Мадагаскар', it: 'Madagascar' },
  MU: { ar: 'موريشيوس', en: 'Mauritius', de: 'Mauritius', ru: 'Маврикий', it: 'Mauritius' },
  RW: { ar: 'رواندا', en: 'Rwanda', de: 'Ruanda', ru: 'Руанда', it: 'Ruanda' },
  BI: { ar: 'بوروندي', en: 'Burundi', de: 'Burundi', ru: 'Бурунди', it: 'Burundi' },
  CD: { ar: 'جمهورية الكونغو الديمقراطية', en: 'DR Congo', de: 'DR Kongo', ru: 'ДР Конго', it: 'RD del Congo' },
  CG: { ar: 'جمهورية الكونغو', en: 'Republic of the Congo', de: 'Republik Kongo', ru: 'Республика Конго', it: 'Repubblica del Congo' },
  CM: { ar: 'الكاميرون', en: 'Cameroon', de: 'Kamerun', ru: 'Камерун', it: 'Camerun' },
  AL: { ar: 'ألبانيا', en: 'Albania', de: 'Albanien', ru: 'Албания', it: 'Albania' },
  MK: { ar: 'مقدونيا الشمالية', en: 'North Macedonia', de: 'Nordmazedonien', ru: 'Северная Македония', it: 'Macedonia del Nord' },
  ME: { ar: 'الجبل الأسود', en: 'Montenegro', de: 'Montenegro', ru: 'Черногория', it: 'Montenegro' },
  BA: { ar: 'البوسنة والهرسك', en: 'Bosnia and Herzegovina', de: 'Bosnien und Herzegowina', ru: 'Босния и Герцеговина', it: 'Bosnia ed Erzegovina' },
  XK: { ar: 'كوسوفو', en: 'Kosovo', de: 'Kosovo', ru: 'Косово', it: 'Kosovo' },
  SI: { ar: 'سلوفينيا', en: 'Slovenia', de: 'Slowenien', ru: 'Словения', it: 'Slovenia' },
  SK: { ar: 'سلوفاكيا', en: 'Slovakia', de: 'Slowakei', ru: 'Словакия', it: 'Slovacchia' },
  MD: { ar: 'مولدوفا', en: 'Moldova', de: 'Moldau', ru: 'Молдова', it: 'Moldavia' },
  BY: { ar: 'بيلاروسيا', en: 'Belarus', de: 'Belarus', ru: 'Беларусь', it: 'Bielorussia' },
  LT: { ar: 'ليتوانيا', en: 'Lithuania', de: 'Litauen', ru: 'Литва', it: 'Lituania' },
  LV: { ar: 'لاتفيا', en: 'Latvia', de: 'Lettland', ru: 'Латвия', it: 'Lettonia' },
  EE: { ar: 'إستونيا', en: 'Estonia', de: 'Estland', ru: 'Эстония', it: 'Estonia' },
  MT: { ar: 'مالطا', en: 'Malta', de: 'Malta', ru: 'Мальта', it: 'Malta' },
  CY: { ar: 'قبرص', en: 'Cyprus', de: 'Zypern', ru: 'Кипр', it: 'Cipro' },
  LU: { ar: 'لوكسمبورغ', en: 'Luxembourg', de: 'Luxemburg', ru: 'Люксембург', it: 'Lussemburgo' },
  MC: { ar: 'موناكو', en: 'Monaco', de: 'Monaco', ru: 'Монако', it: 'Monaco' },
  AD: { ar: 'أندورا', en: 'Andorra', de: 'Andorra', ru: 'Андорра', it: 'Andorra' },
  LI: { ar: 'ليختنشتاين', en: 'Liechtenstein', de: 'Liechtenstein', ru: 'Лихтенштейн', it: 'Liechtenstein' },
  SM: { ar: 'سان مارينو', en: 'San Marino', de: 'San Marino', ru: 'Сан-Марино', it: 'San Marino' },
  VA: { ar: 'الفاتيكان', en: 'Vatican City', de: 'Vatikanstadt', ru: 'Ватикан', it: 'Città del Vaticano' },
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
    id: 'hebron',
    countryCode: 'PS',
    timezone: 'Asia/Hebron',
    latitude: 31.5247,
    longitude: 35.1105,
    image: commons('Hebron Cave of the Patriarchs.jpg'),
    credit: credit('Hebron Cave of the Patriarchs.jpg'),
    aliases: [
      'الخليل', 'hebron', 'حبرون', 'خليل الرحمن', 'الخليل الرحمن',
      'ibrahimi mosque', 'الحرم الإبراهيمي', 'cave of the patriarchs',
      'مغارة المكفيلة', 'المسجد الإبراهيمي',
    ],
    focus: '55% 50%',
    theme: 'nile',
    copy: {
      ar: {
        city: 'الخليل',
        landmark: 'الحرم الإبراهيمي',
        description:
          'الحرم الإبراهيمي في قلب الخليل، بناء هيرودي ضخم عمره ألفا سنة يضمّ مقامات إبراهيم وإسحاق ويعقوب وزوجاتهم، وصار جزء منه مسجداً بعد الفتح الإسلامي.',
      },
      en: {
        city: 'Hebron',
        landmark: 'Ibrahimi Mosque',
        description:
          'The Ibrahimi Mosque in the heart of Hebron: a massive Herodian building two thousand years old that holds the tombs of Abraham, Isaac and Jacob and their wives, part of it made a mosque after the Islamic conquest.',
      },
      de: {
        city: 'Hebron',
        landmark: 'Ibrahimi-Moschee',
        description:
          'Die Ibrahimi-Moschee im Herzen Hebrons: ein gewaltiger herodianischer Bau von vor zweitausend Jahren mit den Gräbern von Abraham, Isaak und Jakob und ihren Frauen; ein Teil wurde nach der islamischen Eroberung zur Moschee.',
      },
      ru: {
        city: 'Хеврон',
        landmark: 'Мечеть Ибрагими',
        description:
          'Мечеть Ибрагими в центре Хеврона: огромное иродианское сооружение двухтысячелетней давности с гробницами Ибрахима, Исхака и Якуба и их жён; часть его стала мечетью после исламского завоевания.',
      },
      it: {
        city: 'Hebron',
        landmark: 'Moschea Ibrahimi',
        description:
          'La moschea Ibrahimi nel cuore di Hebron: un imponente edificio erodiano di duemila anni fa che custodisce le tombe di Abramo, Isacco e Giacobbe e delle loro mogli; una parte divenne moschea dopo la conquista islamica.',
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
  {
    id: 'tirana',
    countryCode: 'AL',
    timezone: 'Europe/Tirane',
    latitude: 41.3274,
    longitude: 19.8187,
    image: commons('Xhamia e Et\'hem Beut 1.jpg'),
    credit: credit('Xhamia e Et\'hem Beut 1.jpg'),
    aliases: [
      'تيرانا', 'tirana', 'albania', 'ألبانيا', 'ethem bey', 'إثيم باي', 'et\'hem bey mosque',
      'مسجد إثيم باي',
    ],
    capital: true,
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'تيرانا',
        landmark: 'مسجد إثيم باي',
        description:
          'مسجد صغير في قلب ساحة سكاندربيغ، بدأ بناؤه في أواخر القرن الثامن عشر، وتغطي جدرانه وأروقته لوحات جدارية بأشجار وشلالات ومدن.',
      },
      en: {
        city: 'Tirana',
        landmark: 'Et’hem Bey Mosque',
        description:
          'A small mosque on Skanderbeg Square, begun in the late eighteenth century, its walls and portico painted with trees, waterfalls and city views.',
      },
      de: {
        city: 'Tirana',
        landmark: 'Et’hem-Bey-Moschee',
        description:
          'Eine kleine Moschee am Skanderbeg-Platz, Ende des 18. Jahrhunderts begonnen; Wände und Vorhalle sind mit Bäumen, Wasserfällen und Stadtansichten ausgemalt.',
      },
      ru: {
        city: 'Тирана',
        landmark: 'Мечеть Этема Бея',
        description:
          'Небольшая мечеть на площади Скандербега, заложенная в конце XVIII века; стены и портик расписаны деревьями, водопадами и видами города.',
      },
      it: {
        city: 'Tirana',
        landmark: 'Moschea di Et’hem Bey',
        description:
          'Una piccola moschea su piazza Skanderbeg, iniziata alla fine del Settecento, con pareti e portico dipinti di alberi, cascate e vedute della città.',
      },
    },
  },
  {
    id: 'skopje',
    countryCode: 'MK',
    timezone: 'Europe/Skopje',
    latitude: 42.0007,
    longitude: 21.4328,
    image: commons('Tower and West Wall of Skopje Fortress, North Macedonia, 2026.jpg'),
    credit: credit('Tower and West Wall of Skopje Fortress, North Macedonia, 2026.jpg'),
    aliases: [
      'سكوبيه', 'skopje', 'macedonia', 'مقدونيا', 'north macedonia', 'مقدونيا الشمالية',
      'kale', 'كالي', 'skopje fortress', 'قلعة سكوبيه',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'سكوبيه',
        landmark: 'قلعة كالي',
        description:
          'أسوار من العصور الوسطى تتوج تلة فوق نهر فاردار، بُنيت على أساسات بيزنطية وأعاد العثمانيون بناءها، ومنها يُرى وسط سكوبيه كله.',
      },
      en: {
        city: 'Skopje',
        landmark: 'Kale Fortress',
        description:
          'Medieval walls crowning the hill above the Vardar, raised on Byzantine foundations and rebuilt in Ottoman times; the whole centre of Skopje lies below.',
      },
      de: {
        city: 'Skopje',
        landmark: 'Festung Kale',
        description:
          'Mittelalterliche Mauern auf dem Hügel über dem Vardar, auf byzantinischen Fundamenten errichtet und in osmanischer Zeit erneuert; darunter liegt das ganze Zentrum von Skopje.',
      },
      ru: {
        city: 'Скопье',
        landmark: 'Крепость Кале',
        description:
          'Средневековые стены на холме над Вардаром, возведённые на византийском основании и перестроенные в османское время; внизу лежит весь центр Скопье.',
      },
      it: {
        city: 'Skopje',
        landmark: 'Fortezza Kale',
        description:
          'Mura medievali sulla collina sopra il Vardar, alzate su fondamenta bizantine e ricostruite in età ottomana; sotto si stende tutto il centro di Skopje.',
      },
    },
  },
  {
    id: 'sveti-stefan',
    countryCode: 'ME',
    timezone: 'Europe/Podgorica',
    latitude: 42.2569,
    longitude: 18.897,
    image: commons('Sveti Stefan (06).jpg'),
    credit: credit('Sveti Stefan (06).jpg'),
    aliases: [
      'سفيتي ستيفان', 'sveti stefan', 'montenegro', 'الجبل الأسود', 'podgorica', 'بودغوريتسا',
    ],
    copy: {
      ar: {
        city: 'سفيتي ستيفان',
        landmark: 'جزيرة سفيتي ستيفان',
        description:
          'جزيرة صغيرة صارت بلدة من الحجر على ساحل البحر الأدرياتيكي، تصلها بالبر رقبة رملية ضيقة، وكانت قرية صيادين ثم صارت منتجعاً.',
      },
      en: {
        city: 'Sveti Stefan',
        landmark: 'Sveti Stefan',
        description:
          'A tiny island turned stone town on the Adriatic coast, joined to the mainland by a narrow sandy isthmus; once a fishing village, now a resort.',
      },
      de: {
        city: 'Sveti Stefan',
        landmark: 'Sveti Stefan',
        description:
          'Eine winzige Insel, die zur steinernen Stadt wurde, durch einen schmalen Sanddamm mit dem Festland verbunden; einst Fischerdorf, heute ein Resort.',
      },
      ru: {
        city: 'Свети-Стефан',
        landmark: 'Свети-Стефан',
        description:
          'Крошечный остров, ставший каменным городком на Адриатике и соединённый с берегом узкой песчаной косой; когда-то рыбацкая деревня, теперь курорт.',
      },
      it: {
        city: 'Sveti Stefan',
        landmark: 'Sveti Stefan',
        description:
          'Una minuscola isola diventata città di pietra sull’Adriatico, unita alla terraferma da un sottile istmo sabbioso; un tempo villaggio di pescatori, oggi resort.',
      },
    },
  },
  {
    id: 'mostar',
    countryCode: 'BA',
    timezone: 'Europe/Sarajevo',
    latitude: 43.3363,
    longitude: 17.8148,
    image: commons('Mostar Stari Most BW 2024-10-01 13-00-05.jpg'),
    credit: credit('Mostar Stari Most BW 2024-10-01 13-00-05.jpg'),
    aliases: [
      'موستار', 'mostar', 'bosnia', 'البوسنة والهرسك', 'bosnia and herzegovina', 'stari most',
      'الجسر القديم', 'sarajevo', 'سراييفو',
    ],
    focus: '30% 35%',
    copy: {
      ar: {
        city: 'موستار',
        landmark: 'الجسر القديم (ستاري موست)',
        description:
          'جسر حجري بقوس واحد من القرن السادس عشر يعبر نهر نيريتفا في موستار، أعاده الحرفيون بالحجر نفسه بعد تدميره في التسعينيات.',
      },
      en: {
        city: 'Mostar',
        landmark: 'Stari Most (Old Bridge)',
        description:
          'A single-arch stone bridge of the sixteenth century across the Neretva in Mostar, rebuilt by craftsmen from the same stone after its destruction in the 1990s.',
      },
      de: {
        city: 'Mostar',
        landmark: 'Stari Most (Alte Brücke)',
        description:
          'Eine steinerne Bogenbrücke aus dem 16. Jahrhundert über die Neretva in Mostar, nach ihrer Zerstörung in den 1990er-Jahren von Handwerkern aus demselben Stein wieder errichtet.',
      },
      ru: {
        city: 'Мостар',
        landmark: 'Старый мост (Стари-Мост)',
        description:
          'Каменный однопролётный мост XVI века через Неретву в Мостаре, заново сложенный мастерами из того же камня после разрушения в 1990-х.',
      },
      it: {
        city: 'Mostar',
        landmark: 'Stari Most (Ponte Vecchio)',
        description:
          'Un ponte di pietra a un solo arco del Cinquecento sulla Neretva a Mostar, ricostruito dagli artigiani con la stessa pietra dopo la distruzione negli anni Novanta.',
      },
    },
  },
  {
    id: 'pristina',
    countryCode: 'XK',
    timezone: 'Europe/Belgrade',
    latitude: 42.6727,
    longitude: 21.1669,
    image: commons('Biblioteca Nacional, Pristina, Kosovo, 2014-04-16, DD 14.JPG'),
    credit: credit('Biblioteca Nacional, Pristina, Kosovo, 2014-04-16, DD 14.JPG'),
    aliases: [
      'بريشتينا', 'pristina', 'kosovo', 'كوسوفو', 'national library of kosovo',
      'المكتبة الوطنية في كوسوفو', 'biblioteka',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'بريشتينا',
        landmark: 'المكتبة الوطنية في كوسوفو',
        description:
          'مبنى أبيض تتشابك فيه مكعبات وقباب شبكية، صممه أندريا موتشاناكوفيتش عام ١٩٧٢، ويُعد أغرب مباني بريشتينا وأكثرها جدلاً.',
      },
      en: {
        city: 'Pristina',
        landmark: 'National Library of Kosovo',
        description:
          'A white building of interlocking cubes and lattice domes designed by Andrija Mutnjaković in 1972, the strangest and most argued-over building in Pristina.',
      },
      de: {
        city: 'Pristina',
        landmark: 'Nationalbibliothek des Kosovo',
        description:
          'Ein weißer Bau aus verschachtelten Würfeln und Gitterkuppeln von Andrija Mutnjaković (1972), das seltsamste und umstrittenste Gebäude Pristinas.',
      },
      ru: {
        city: 'Приштина',
        landmark: 'Национальная библиотека Косова',
        description:
          'Белое здание из сросшихся кубов и решётчатых куполов, спроектированное Андрией Мутняковичем в 1972 году, — самое странное и спорное в Приштине.',
      },
      it: {
        city: 'Pristina',
        landmark: 'Biblioteca nazionale del Kosovo',
        description:
          'Un edificio bianco di cubi incastrati e cupole a reticolo progettato da Andrija Mutnjaković nel 1972, il più strano e discusso di Pristina.',
      },
    },
  },
  {
    id: 'bled',
    countryCode: 'SI',
    timezone: 'Europe/Ljubljana',
    latitude: 46.3601,
    longitude: 14.0848,
    image: commons('Bled Island & Bled Castle (1).jpg'),
    credit: credit('Bled Island & Bled Castle (1).jpg'),
    aliases: [
      'بليد', 'bled', 'slovenia', 'سلوفينيا', 'lake bled', 'بحيرة بليد', 'bled island',
      'ljubljana', 'ليوبليانا',
    ],
    copy: {
      ar: {
        city: 'بليد',
        landmark: 'بحيرة بليد',
        description:
          'بحيرة جبلية صغيرة تطفو في وسطها جزيرة عليها كنيسة وبرج جرس، وفوق ضفتها الغربية قلعة بليد على جرف صخري.',
      },
      en: {
        city: 'Bled',
        landmark: 'Lake Bled',
        description:
          'A small alpine lake with a church and bell tower on an island in the middle, and Bled Castle on a cliff above the western shore.',
      },
      de: {
        city: 'Bled',
        landmark: 'Bleder See',
        description:
          'Ein kleiner Alpensee mit Kirche und Glockenturm auf einer Insel in der Mitte und der Burg Bled auf einer Felswand über dem Westufer.',
      },
      ru: {
        city: 'Блед',
        landmark: 'Бледское озеро',
        description:
          'Небольшое альпийское озеро с церковью и звонницей на островке посредине и замком Блед на скале над западным берегом.',
      },
      it: {
        city: 'Bled',
        landmark: 'Lago di Bled',
        description:
          'Un piccolo lago alpino con una chiesa e un campanile su un isolotto al centro e il castello di Bled su una rupe sopra la riva ovest.',
      },
    },
  },
  {
    id: 'bratislava',
    countryCode: 'SK',
    timezone: 'Europe/Bratislava',
    latitude: 48.1482,
    longitude: 17.1067,
    image: commons('Bratislava Castle with Danube.jpeg'),
    credit: credit('Bratislava Castle with Danube.jpeg'),
    aliases: [
      'براتيسلافا', 'bratislava', 'slovakia', 'سلوفاكيا', 'bratislava castle',
      'قلعة براتيسلافا',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'براتيسلافا',
        landmark: 'قلعة براتيسلافا',
        description:
          'قلعة بيضاء بأربعة أبراج في زواياها تجلس على تلة فوق الدانوب، وتُرى من معظم أنحاء المدينة القديمة.',
      },
      en: {
        city: 'Bratislava',
        landmark: 'Bratislava Castle',
        description:
          'A white castle with four corner towers on a hill above the Danube, visible from most of the old town.',
      },
      de: {
        city: 'Bratislava',
        landmark: 'Burg Bratislava',
        description:
          'Eine weiße Burg mit vier Ecktürmen auf einem Hügel über der Donau, von fast überall in der Altstadt zu sehen.',
      },
      ru: {
        city: 'Братислава',
        landmark: 'Братиславский град',
        description:
          'Белый замок с четырьмя угловыми башнями на холме над Дунаем, видный почти из любой точки старого города.',
      },
      it: {
        city: 'Bratislava',
        landmark: 'Castello di Bratislava',
        description:
          'Un castello bianco con quattro torri angolari su una collina sopra il Danubio, visibile da quasi tutta la città vecchia.',
      },
    },
  },
  {
    id: 'orhei',
    countryCode: 'MD',
    timezone: 'Europe/Chisinau',
    latitude: 47.383,
    longitude: 28.825,
    image: commons('Monasterio Orheiul Vechi, Orhei, Moldavia, 2023-11-02, DD 06.jpg'),
    credit: credit('Monasterio Orheiul Vechi, Orhei, Moldavia, 2023-11-02, DD 06.jpg'),
    aliases: [
      'أورهي', 'orhei', 'moldova', 'مولدوفا', 'orheiul vechi', 'أورهيول فيكي', 'chisinau',
      'كيشيناو', 'old orhei',
    ],
    focus: '70% 40%',
    copy: {
      ar: {
        city: 'أورهي',
        landmark: 'أورهيول فيكي',
        description:
          'دير محفور في جرف من الحجر الجيري فوق منعطف نهر راوت، على بعد نحو أربعين كيلومتراً من كيشيناو، نُحت في الصخر على مدى قرون.',
      },
      en: {
        city: 'Orhei',
        landmark: 'Orheiul Vechi',
        description:
          'A monastery cut into a limestone cliff above a bend of the Răut river, some 40 km from Chișinău, hollowed out over centuries.',
      },
      de: {
        city: 'Orhei',
        landmark: 'Orheiul Vechi',
        description:
          'Ein in eine Kalksteinwand über einer Flussschleife des Răut gehauenes Kloster, rund 40 km von Chișinău entfernt, über Jahrhunderte aus dem Fels geschlagen.',
      },
      ru: {
        city: 'Орхей',
        landmark: 'Старый Орхей',
        description:
          'Монастырь, вырубленный в известняковой скале над излучиной Реута, примерно в 40 км от Кишинёва; его выдалбливали в камне столетиями.',
      },
      it: {
        city: 'Orhei',
        landmark: 'Orheiul Vechi',
        description:
          'Un monastero scavato in una parete di calcare sopra un’ansa del Răut, a circa 40 km da Chișinău, intagliato nella roccia nei secoli.',
      },
    },
  },
  {
    id: 'mir',
    countryCode: 'BY',
    timezone: 'Europe/Minsk',
    latitude: 53.4517,
    longitude: 26.4709,
    image: commons('Mir Castle 2023-07-02 6022.jpg'),
    credit: credit('Mir Castle 2023-07-02 6022.jpg'),
    aliases: [
      'مير', 'mir', 'belarus', 'بيلاروسيا', 'mir castle', 'قلعة مير', 'minsk', 'مينسك',
    ],
    copy: {
      ar: {
        city: 'مير',
        landmark: 'قلعة مير',
        description:
          'قلعة من الطوب الأحمر ببرج مدخل وأسوار وأبراج زاوية، بُنيت في القرن السادس عشر في بلدة مير جنوب غرب مينسك.',
      },
      en: {
        city: 'Mir',
        landmark: 'Mir Castle',
        description:
          'A red-brick castle with a gate tower, walls and corner towers, built in the sixteenth century in the town of Mir south-west of Minsk.',
      },
      de: {
        city: 'Mir',
        landmark: 'Burg Mir',
        description:
          'Eine Burg aus rotem Backstein mit Torturm, Mauern und Ecktürmen, im 16. Jahrhundert im Ort Mir südwestlich von Minsk erbaut.',
      },
      ru: {
        city: 'Мир',
        landmark: 'Мирский замок',
        description:
          'Замок из красного кирпича с въездной башней, стенами и угловыми башнями, построенный в XVI веке в Мире юго-западнее Минска.',
      },
      it: {
        city: 'Mir',
        landmark: 'Castello di Mir',
        description:
          'Un castello in mattoni rossi con torre d’ingresso, mura e torri angolari, costruito nel Cinquecento a Mir, a sud-ovest di Minsk.',
      },
    },
  },
  {
    id: 'vilnius',
    countryCode: 'LT',
    timezone: 'Europe/Vilnius',
    latitude: 54.6892,
    longitude: 25.2798,
    image: commons('Gedimino pilis by Augustas Didzgalvis.jpg'),
    credit: credit('Gedimino pilis by Augustas Didzgalvis.jpg'),
    aliases: [
      'فيلنيوس', 'vilnius', 'lithuania', 'ليتوانيا', 'gediminas', 'غيديميناس',
      'gediminas tower', 'برج غيديميناس',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'فيلنيوس',
        landmark: 'برج غيديميناس',
        description:
          'برج مثمن من الطوب الأحمر على تلة في وسط فيلنيوس، وهو ما بقي من قلعة غيديميناس، ويطل على البلدة القديمة.',
      },
      en: {
        city: 'Vilnius',
        landmark: 'Gediminas’ Tower',
        description:
          'An octagonal red-brick tower on the hill in the middle of Vilnius, the last piece of Gediminas’ castle, looking down on the old town.',
      },
      de: {
        city: 'Vilnius',
        landmark: 'Gediminas-Turm',
        description:
          'Ein achteckiger Backsteinturm auf dem Hügel mitten in Vilnius, der letzte Rest der Burg Gediminas’, mit Blick auf die Altstadt.',
      },
      ru: {
        city: 'Вильнюс',
        landmark: 'Башня Гедимина',
        description:
          'Восьмигранная кирпичная башня на холме в центре Вильнюса — последняя часть замка Гедимина, с видом на старый город.',
      },
      it: {
        city: 'Vilnius',
        landmark: 'Torre di Gediminas',
        description:
          'Una torre ottagonale in mattoni rossi sulla collina al centro di Vilnius, ultimo resto del castello di Gediminas, affacciata sulla città vecchia.',
      },
    },
  },
  {
    id: 'riga',
    countryCode: 'LV',
    timezone: 'Europe/Riga',
    latitude: 56.9474,
    longitude: 24.1064,
    image: commons('House of Blackheads at Dusk 3, Riga, Latvia - Diliff.jpg'),
    credit: credit('House of Blackheads at Dusk 3, Riga, Latvia - Diliff.jpg'),
    aliases: [
      'ريغا', 'riga', 'latvia', 'لاتفيا', 'blackheads', 'الرؤوس السوداء',
      'house of the blackheads', 'بيت ذوي الرؤوس السوداء',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'ريغا',
        landmark: 'بيت ذوي الرؤوس السوداء',
        description:
          'بيت نقابة التجار في ريغا، بواجهة مزخرفة وأقواس ونوافذ مزدوجة، أعيد بناؤه بعد الحرب العالمية الثانية في ساحة دار البلدية.',
      },
      en: {
        city: 'Riga',
        landmark: 'House of the Blackheads',
        description:
          'The guild house of Riga’s Blackheads, with a carved façade, arcades and double windows, rebuilt after the Second World War on the Town Hall Square.',
      },
      de: {
        city: 'Riga',
        landmark: 'Schwarzhäupterhaus',
        description:
          'Das Gildehaus der Rigaer Schwarzhäupter mit verzierter Fassade, Arkaden und Doppelfenstern, nach dem Zweiten Weltkrieg am Rathausplatz wieder errichtet.',
      },
      ru: {
        city: 'Рига',
        landmark: 'Дом Черноголовых',
        description:
          'Дом гильдии рижских Черноголовых с резным фасадом, аркадами и сдвоенными окнами, воссозданный после Второй мировой войны на Ратушной площади.',
      },
      it: {
        city: 'Riga',
        landmark: 'Casa delle Teste Nere',
        description:
          'La casa della gilda delle Teste Nere di Riga, con facciata intagliata, arcate e finestre binate, ricostruita dopo la Seconda guerra mondiale sulla piazza del Municipio.',
      },
    },
  },
  {
    id: 'tallinn',
    countryCode: 'EE',
    timezone: 'Europe/Tallinn',
    latitude: 59.4374,
    longitude: 24.7453,
    image: commons('Raekoja plats Tallinn 2015.jpg'),
    credit: credit('Raekoja plats Tallinn 2015.jpg'),
    aliases: [
      'تالين', 'tallinn', 'estonia', 'إستونيا', 'town hall square', 'ساحة دار البلدية',
      'raekoja plats', 'town hall',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'تالين',
        landmark: 'ساحة دار البلدية',
        description:
          'ساحة حجرية في قلب تالين القديمة، تتوسطها دار بلدية من القرن الرابع عشر ببرجها المائل، وتحيط بها بيوت التجار.',
      },
      en: {
        city: 'Tallinn',
        landmark: 'Town Hall Square',
        description:
          'The stone square at the heart of Tallinn’s old town, with its fourteenth-century town hall and leaning tower, ringed by merchants’ houses.',
      },
      de: {
        city: 'Tallinn',
        landmark: 'Rathausplatz',
        description:
          'Der steinerne Platz im Herzen der Altstadt von Tallinn mit dem Rathaus aus dem 14. Jahrhundert und seinem schiefen Turm, umgeben von Kaufmannshäusern.',
      },
      ru: {
        city: 'Таллин',
        landmark: 'Ратушная площадь',
        description:
          'Каменная площадь в сердце старого Таллина с ратушей XIV века и её наклонной башней, в окружении купеческих домов.',
      },
      it: {
        city: 'Tallinn',
        landmark: 'Piazza del Municipio',
        description:
          'La piazza di pietra nel cuore della città vecchia di Tallinn, con il municipio trecentesco e la torre pendente, circondata da case di mercanti.',
      },
    },
  },
  {
    id: 'valletta',
    countryCode: 'MT',
    timezone: 'Europe/Malta',
    latitude: 35.8997,
    longitude: 14.5148,
    image: commons('Concatedral de San Juan, La Valeta, isla de Malta, Malta, 2021-08-25, DD 246-248 HDR.jpg'),
    credit: credit('Concatedral de San Juan, La Valeta, isla de Malta, Malta, 2021-08-25, DD 246-248 HDR.jpg'),
    aliases: [
      'فاليتا', 'valletta', 'malta', 'مالطا', 'st john\'s co-cathedral',
      'كاتدرائية القديس يوحنا', 'st john', 'co-cathedral',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'فاليتا',
        landmark: 'كاتدرائية القديس يوحنا',
        description:
          'كنيسة من القرن السادس عشر في فاليتا، واجهتها المتواضعة تخفي داخلاً باروكياً مذهّباً وأرضية من شواهد رخامية.',
      },
      en: {
        city: 'Valletta',
        landmark: 'St John’s Co-Cathedral',
        description:
          'A sixteenth-century church in Valletta whose plain façade hides a gilded Baroque interior and a floor of marble tombstones.',
      },
      de: {
        city: 'Valletta',
        landmark: 'St.-Johannes-Konkathedrale',
        description:
          'Eine Kirche des 16. Jahrhunderts in Valletta, deren schlichte Fassade einen vergoldeten Barockraum und einen Boden aus Marmorgrabplatten verbirgt.',
      },
      ru: {
        city: 'Валлетта',
        landmark: 'Собор Святого Иоанна',
        description:
          'Церковь XVI века в Валлетте: за скромным фасадом скрыт золочёный барочный интерьер и мраморный пол из надгробных плит.',
      },
      it: {
        city: 'La Valletta',
        landmark: 'Concattedrale di San Giovanni',
        description:
          'Una chiesa del Cinquecento a La Valletta: la facciata sobria nasconde un interno barocco dorato e un pavimento di lastre tombali in marmo.',
      },
    },
  },
  {
    id: 'paphos',
    countryCode: 'CY',
    timezone: 'Asia/Nicosia',
    latitude: 34.6641,
    longitude: 32.6272,
    image: commons('Petra tou romiou 5.jpg'),
    credit: credit('Petra tou romiou 5.jpg'),
    aliases: [
      'بافوس', 'paphos', 'cyprus', 'قبرص', 'aphrodite\'s rock', 'صخرة أفروديت',
      'petra tou romiou', 'nicosia', 'نيقوسيا',
    ],
    copy: {
      ar: {
        city: 'بافوس',
        landmark: 'صخرة أفروديت',
        description:
          'صخرة كبيرة في البحر على ساحل بافوس، تقول الأسطورة إن أفروديت وُلدت من الزبد عندها، وتُعرف محلياً بصخرة الرومي.',
      },
      en: {
        city: 'Paphos',
        landmark: 'Aphrodite’s Rock',
        description:
          'A sea stack off the Paphos coast where, legend says, Aphrodite rose from the foam; locally it is Petra tou Romiou, the rock of the Roman.',
      },
      de: {
        city: 'Paphos',
        landmark: 'Felsen der Aphrodite',
        description:
          'Ein Felsen im Meer vor der Küste von Paphos, an dem der Sage nach Aphrodite aus dem Schaum stieg; lokal Petra tou Romiou, der Felsen des Romanos.',
      },
      ru: {
        city: 'Пафос',
        landmark: 'Скала Афродиты',
        description:
          'Скала в море у берегов Пафоса, где, по легенде, из пены вышла Афродита; местное имя — Петра ту Ромиу.',
      },
      it: {
        city: 'Pafo',
        landmark: 'Roccia di Afrodite',
        description:
          'Uno scoglio in mare davanti alla costa di Pafo dove, secondo la leggenda, Afrodite nacque dalla schiuma; qui si chiama Petra tou Romiou.',
      },
    },
  },
  {
    id: 'luxembourg-city',
    countryCode: 'LU',
    timezone: 'Europe/Luxembourg',
    latitude: 49.6126,
    longitude: 6.1345,
    image: commons('Casemates du Bock Luxembourg - Lëtzebuerg 30.jpg'),
    credit: credit('Casemates du Bock Luxembourg - Lëtzebuerg 30.jpg'),
    aliases: [
      'لوكسمبورغ', 'luxembourg', 'luxembourg city', 'lëtzebuerg', 'bock casemates',
      'سراديب بوك', 'casemates',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'مدينة لوكسمبورغ',
        landmark: 'سراديب بوك',
        description:
          'شبكة من الأنفاق محفورة في صخرة بوك تحت المدينة، بدأت في القرن السابع عشر وتمتد كيلومترات في الصخر.',
      },
      en: {
        city: 'Luxembourg City',
        landmark: 'Bock Casemates',
        description:
          'A network of tunnels cut into the Bock rock beneath Luxembourg City, begun in the seventeenth century and running for kilometres through the stone.',
      },
      de: {
        city: 'Luxemburg',
        landmark: 'Kasematten vom Bock',
        description:
          'Ein Netz von Tunneln im Bockfelsen unter der Stadt Luxemburg, im 17. Jahrhundert begonnen und kilometerlang durch den Fels getrieben.',
      },
      ru: {
        city: 'Люксембург',
        landmark: 'Катакомбы Бок',
        description:
          'Сеть туннелей, вырубленных в скале Бок под городом Люксембург; начало ей положено в XVII веке, и она тянется на километры.',
      },
      it: {
        city: 'Lussemburgo',
        landmark: 'Casematte del Bock',
        description:
          'Una rete di gallerie scavate nella roccia del Bock sotto la città di Lussemburgo, iniziata nel Seicento e lunga chilometri.',
      },
    },
  },
  {
    id: 'monte-carlo',
    countryCode: 'MC',
    timezone: 'Europe/Monaco',
    latitude: 43.7396,
    longitude: 7.427,
    image: commons('Casino de Montecarlo, Mónaco, 2016-06-23, DD 05.jpg'),
    credit: credit('Casino de Montecarlo, Mónaco, 2016-06-23, DD 05.jpg'),
    aliases: [
      'مونتي كارلو', 'monte carlo', 'monaco', 'موناكو', 'casino', 'كازينو مونتي كارلو',
      'monte carlo casino', 'monaco-ville',
    ],
    copy: {
      ar: {
        city: 'مونتي كارلو',
        landmark: 'كازينو مونتي كارلو',
        description:
          'مبنى الكازينو ببرجيه وقبته، صممه شارل غارنييه عام ١٨٧٨، ويقف على حافة البحر في موناكو.',
      },
      en: {
        city: 'Monte Carlo',
        landmark: 'Monte Carlo Casino',
        description:
          'The casino of Monte Carlo with its twin towers and dome, designed by Charles Garnier in 1878 and standing at the edge of the sea in Monaco.',
      },
      de: {
        city: 'Monte Carlo',
        landmark: 'Casino von Monte Carlo',
        description:
          'Das Casino von Monte Carlo mit zwei Türmen und Kuppel, 1878 von Charles Garnier entworfen, am Meer in Monaco gelegen.',
      },
      ru: {
        city: 'Монте-Карло',
        landmark: 'Казино Монте-Карло',
        description:
          'Казино с двумя башнями и куполом, спроектированное Шарлем Гарнье в 1878 году, стоит у самого моря в Монако.',
      },
      it: {
        city: 'Monte Carlo',
        landmark: 'Casinò di Monte Carlo',
        description:
          'Il casinò di Monte Carlo con le due torri e la cupola, progettato da Charles Garnier nel 1878 e affacciato sul mare a Monaco.',
      },
    },
  },
  {
    id: 'andorra-la-vella',
    countryCode: 'AD',
    timezone: 'Europe/Andorra',
    latitude: 42.5078,
    longitude: 1.5211,
    image: commons('Casa de la Vall, Andorra la Vieja, Andorra, 2013-12-30, DD 01.JPG'),
    credit: credit('Casa de la Vall, Andorra la Vieja, Andorra, 2013-12-30, DD 01.JPG'),
    aliases: [
      'أندورا لا فيلا', 'andorra la vella', 'andorra', 'أندورا', 'casa de la vall',
      'دار الوادي',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'أندورا لا فيلا',
        landmark: 'دار الوادي',
        description:
          'بيت حجري من القرن السادس عشر في أندورا لا فيلا، كان مقر البرلمان الأندوري، ببرجه الحجري ونوافذه الصغيرة.',
      },
      en: {
        city: 'Andorra la Vella',
        landmark: 'Casa de la Vall',
        description:
          'A sixteenth-century stone house in Andorra la Vella that served as the country’s parliament, with its stone tower and small windows.',
      },
      de: {
        city: 'Andorra la Vella',
        landmark: 'Casa de la Vall',
        description:
          'Ein steinernes Haus aus dem 16. Jahrhundert in Andorra la Vella, einst Sitz des Parlaments, mit Steinturm und kleinen Fenstern.',
      },
      ru: {
        city: 'Андорра-ла-Велья',
        landmark: 'Каса-де-ла-Валь',
        description:
          'Каменный дом XVI века в Андорра-ла-Велье, где заседал парламент страны, с каменной башней и маленькими окнами.',
      },
      it: {
        city: 'Andorra la Vella',
        landmark: 'Casa de la Vall',
        description:
          'Una casa di pietra del Cinquecento ad Andorra la Vella, sede del parlamento del paese, con la torre in pietra e le finestre piccole.',
      },
    },
  },
  {
    id: 'vaduz',
    countryCode: 'LI',
    timezone: 'Europe/Vaduz',
    latitude: 47.1324,
    longitude: 9.5107,
    image: commons('Château de Vaduz - 2022.jpg'),
    credit: credit('Château de Vaduz - 2022.jpg'),
    aliases: [
      'فادوتس', 'vaduz', 'liechtenstein', 'ليختنشتاين', 'vaduz castle', 'قلعة فادوتس',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'فادوتس',
        landmark: 'قلعة فادوتس',
        description:
          'قلعة على مرتفع صخري فوق فادوتس، وهي مقر إقامة أمير ليختنشتاين، وتُرى من كل أنحاء العاصمة الصغيرة.',
      },
      en: {
        city: 'Vaduz',
        landmark: 'Vaduz Castle',
        description:
          'A castle on a rocky terrace above Vaduz, the residence of the Prince of Liechtenstein, visible from all over the small capital.',
      },
      de: {
        city: 'Vaduz',
        landmark: 'Schloss Vaduz',
        description:
          'Eine Burg auf einer Felsenterrasse über Vaduz, Residenz des Fürsten von Liechtenstein, von überall in der kleinen Hauptstadt zu sehen.',
      },
      ru: {
        city: 'Вадуц',
        landmark: 'Замок Вадуц',
        description:
          'Замок на скалистой террасе над Вадуцем, резиденция князя Лихтенштейна, виден из любой точки маленькой столицы.',
      },
      it: {
        city: 'Vaduz',
        landmark: 'Castello di Vaduz',
        description:
          'Un castello su una terrazza rocciosa sopra Vaduz, residenza del principe del Liechtenstein, visibile da tutta la piccola capitale.',
      },
    },
  },
  {
    id: 'san-marino',
    countryCode: 'SM',
    timezone: 'Europe/Rome',
    latitude: 43.9353,
    longitude: 12.4496,
    image: commons('Fortress of Guaita 2013-09-19.jpg'),
    credit: credit('Fortress of Guaita 2013-09-19.jpg'),
    aliases: [
      'سان مارينو', 'san marino', 'city of san marino', 'guaita', 'غوايتا', 'guaita tower',
      'برج غوايتا',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'مدينة سان مارينو',
        landmark: 'برج غوايتا',
        description:
          'أقدم أبراج سان مارينو الثلاثة، بُني في القرن الحادي عشر على حافة جبل تيتانو، وتنحدر المدينة خلفه.',
      },
      en: {
        city: 'City of San Marino',
        landmark: 'Guaita Tower',
        description:
          'The oldest of San Marino’s three towers, built in the eleventh century on the edge of Mount Titano, with the town falling away behind it.',
      },
      de: {
        city: 'San Marino',
        landmark: 'Guaita-Turm',
        description:
          'Der älteste der drei Türme von San Marino, im 11. Jahrhundert am Rand des Monte Titano errichtet, mit der Stadt im Rücken.',
      },
      ru: {
        city: 'Сан-Марино',
        landmark: 'Башня Гуаита',
        description:
          'Старейшая из трёх башен Сан-Марино, построенная в XI веке на краю Монте-Титано, за ней спускается город.',
      },
      it: {
        city: 'Città di San Marino',
        landmark: 'Torre Guaita',
        description:
          'La più antica delle tre torri di San Marino, costruita nell’XI secolo sul bordo del monte Titano, con la città che scende alle spalle.',
      },
    },
  },
  {
    id: 'vatican-city',
    countryCode: 'VA',
    timezone: 'Europe/Vatican',
    latitude: 41.9022,
    longitude: 12.4563,
    image: commons('Basilica di San Pietro in Vaticano September 2015-1a.jpg'),
    credit: credit('Basilica di San Pietro in Vaticano September 2015-1a.jpg'),
    aliases: [
      'الفاتيكان', 'vatican', 'vatican city', 'st peter\'s basilica', 'كاتدرائية القديس بطرس',
      'saint peter', 'st peter',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'الفاتيكان',
        landmark: 'كاتدرائية القديس بطرس',
        description:
          'كنيسة الفاتيكان الكبرى بقبتها التي صممها مايكل أنجلو وواجهتها ذات الأعمدة، تقف في نهاية ساحة القديس بطرس.',
      },
      en: {
        city: 'Vatican City',
        landmark: 'St. Peter’s Basilica',
        description:
          'The great basilica of the Vatican, its dome by Michelangelo and its colonnaded façade closing the end of Saint Peter’s Square.',
      },
      de: {
        city: 'Vatikanstadt',
        landmark: 'Petersdom',
        description:
          'Die große Basilika des Vatikans, deren Kuppel von Michelangelo stammt und deren Säulenfront den Petersplatz abschließt.',
      },
      ru: {
        city: 'Ватикан',
        landmark: 'Собор Святого Петра',
        description:
          'Главная базилика Ватикана: купол Микеланджело и колонный фасад, замыкающий площадь Святого Петра.',
      },
      it: {
        city: 'Città del Vaticano',
        landmark: 'Basilica di San Pietro',
        description:
          'La grande basilica del Vaticano, con la cupola di Michelangelo e la facciata a colonne che chiude piazza San Pietro.',
      },
    },
  },
  {
    id: 'lalibela',
    countryCode: 'ET',
    timezone: 'Africa/Addis_Ababa',
    latitude: 12.0316,
    longitude: 39.0412,
    image: commons('Bete Giyorgis 01.jpg'),
    credit: credit('Bete Giyorgis 01.jpg'),
    aliases: [
      'لاليبيلا', 'lalibela', 'ethiopia', 'إثيوبيا', 'rock-hewn churches',
      'الكنائس المنحوتة في الصخر', 'addis ababa', 'أديس أبابا',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'لاليبيلا',
        landmark: 'الكنائس المنحوتة في الصخر',
        description:
          'إحدى عشرة كنيسة نُحتت في الصخر ونزلت إلى عمق الأرض في القرن الثاني عشر، وما زالت تُستخدم للصلاة، وتُعد من عجائب العمارة الإثيوبية.',
      },
      en: {
        city: 'Lalibela',
        landmark: 'Rock-Hewn Churches',
        description:
          'Eleven churches cut down into the rock in the twelfth century and still in use for worship, the great feat of Ethiopian architecture.',
      },
      de: {
        city: 'Lalibela',
        landmark: 'Felsenkirchen',
        description:
          'Elf Kirchen, die im 12. Jahrhundert in den Fels hinabgehauen wurden und bis heute für Gottesdienste genutzt werden – die große Leistung der äthiopischen Baukunst.',
      },
      ru: {
        city: 'Лалибэла',
        landmark: 'Скальные церкви',
        description:
          'Одиннадцать церквей, вырубленных в скале в XII веке и до сих пор служащих для богослужений, — вершина эфиопского зодчества.',
      },
      it: {
        city: 'Lalibela',
        landmark: 'Chiese rupestri',
        description:
          'Undici chiese scavate nella roccia nel XII secolo e ancora usate per il culto: la grande prova dell’architettura etiope.',
      },
    },
  },
  {
    id: 'moshi',
    countryCode: 'TZ',
    timezone: 'Africa/Dar_es_Salaam',
    latitude: -3.35,
    longitude: 37.3333,
    image: commons('Mount Kilimanjaro,Moshi 1.jpg'),
    credit: credit('Mount Kilimanjaro,Moshi 1.jpg'),
    aliases: [
      'موشي', 'moshi', 'tanzania', 'تنزانيا', 'kilimanjaro', 'كليمنجارو', 'mount kilimanjaro',
      'جبل كليمنجارو', 'dodoma', 'دودوما',
    ],
    copy: {
      ar: {
        city: 'موشي',
        landmark: 'جبل كليمنجارو',
        description:
          'أعلى قمة في أفريقيا، بركان خامد بقمة مكسوة بالثلج يرتفع ٥٨٩٥ متراً فوق السهول القريبة من موشي.',
      },
      en: {
        city: 'Moshi',
        landmark: 'Mount Kilimanjaro',
        description:
          'Africa’s highest mountain, a dormant volcano with a snow-capped summit 5,895 metres above the plains near Moshi.',
      },
      de: {
        city: 'Moshi',
        landmark: 'Kilimandscharo',
        description:
          'Afrikas höchster Berg, ein ruhender Vulkan mit schneebedecktem Gipfel, 5.895 Meter über der Ebene bei Moshi.',
      },
      ru: {
        city: 'Моши',
        landmark: 'Килиманджаро',
        description:
          'Высочайшая гора Африки: спящий вулкан со снежной вершиной, 5 895 метров над равнинами близ Моши.',
      },
      it: {
        city: 'Moshi',
        landmark: 'Kilimangiaro',
        description:
          'La montagna più alta dell’Africa: un vulcano quiescente con la cima innevata, 5.895 metri sopra la pianura vicino a Moshi.',
      },
    },
  },
  {
    id: 'kampala',
    countryCode: 'UG',
    timezone: 'Africa/Kampala',
    latitude: 0.3163,
    longitude: 32.5822,
    image: commons('Gadafi Mosque ......(Old Kampala Muslim Center).jpg'),
    credit: credit('Gadafi Mosque ......(Old Kampala Muslim Center).jpg'),
    aliases: [
      'كمبالا', 'kampala', 'uganda', 'أوغندا', 'uganda national mosque',
      'المسجد الوطني الأوغندي', 'gaddafi mosque',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'كمبالا',
        landmark: 'المسجد الوطني الأوغندي',
        description:
          'مسجد على تلة في كمبالا بقبة ذهبية ومآذن شاهقة، بُني في السبعينيات ويتسع لآلاف المصلين، ومن سطحه تُرى المدينة كلها.',
      },
      en: {
        city: 'Kampala',
        landmark: 'Uganda National Mosque',
        description:
          'A mosque on a Kampala hill with a golden dome and tall minarets, built in the 1970s for thousands of worshippers; its roof opens the whole city to view.',
      },
      de: {
        city: 'Kampala',
        landmark: 'Nationalmoschee von Uganda',
        description:
          'Eine Moschee auf einem Hügel von Kampala mit goldener Kuppel und hohen Minaretten, in den 1970er-Jahren für Tausende Gläubige erbaut; vom Dach sieht man die ganze Stadt.',
      },
      ru: {
        city: 'Кампала',
        landmark: 'Национальная мечеть Уганды',
        description:
          'Мечеть на холме Кампалы с золотым куполом и высокими минаретами, построенная в 1970-х на тысячи молящихся; с её крыши виден весь город.',
      },
      it: {
        city: 'Kampala',
        landmark: 'Moschea nazionale dell’Uganda',
        description:
          'Una moschea su una collina di Kampala con cupola dorata e minareti alti, costruita negli anni Settanta per migliaia di fedeli; dal tetto si vede tutta la città.',
      },
    },
  },
  {
    id: 'accra',
    countryCode: 'GH',
    timezone: 'Africa/Accra',
    latitude: 5.556,
    longitude: -0.1969,
    image: commons('Black Star Gate located in Accra.jpg'),
    credit: credit('Black Star Gate located in Accra.jpg'),
    aliases: [
      'أكرا', 'accra', 'ghana', 'غانا', 'black star square', 'ساحة النجمة السوداء',
      'independence arch', 'قوس الاستقلال',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'أكرا',
        landmark: 'ساحة النجمة السوداء',
        description:
          'ساحة واسعة على ساحل أكرا فيها قوس الاستقلال ونصب الجندي المجهول، أُعدت لاستعراضات الاستقلال في الستينيات.',
      },
      en: {
        city: 'Accra',
        landmark: 'Black Star Square',
        description:
          'A vast square on the Accra shore with the Independence Arch and the Unknown Soldier monument, laid out for independence parades in the 1960s.',
      },
      de: {
        city: 'Accra',
        landmark: 'Black Star Square',
        description:
          'Ein weiter Platz an der Küste von Accra mit Unabhängigkeitsbogen und Denkmal des unbekannten Soldaten, in den 1960er-Jahren für die Unabhängigkeitsparaden angelegt.',
      },
      ru: {
        city: 'Аккра',
        landmark: 'Площадь Чёрной звезды',
        description:
          'Огромная площадь на берегу Аккры с аркой Независимости и памятником Неизвестному солдату, созданная для парадов независимости в 1960-х.',
      },
      it: {
        city: 'Accra',
        landmark: 'Black Star Square',
        description:
          'Una grande piazza sulla costa di Accra con l’Arco dell’Indipendenza e il monumento al Milite Ignoto, creata per le parate dell’indipendenza negli anni Sessanta.',
      },
    },
  },
  {
    id: 'yamoussoukro',
    countryCode: 'CI',
    timezone: 'Africa/Abidjan',
    latitude: 6.8015,
    longitude: -5.2862,
    image: commons('Basilique notre Dame de la Paix de Yamoussoukro 9.jpg'),
    credit: credit('Basilique notre Dame de la Paix de Yamoussoukro 9.jpg'),
    aliases: [
      'ياموسوكرو', 'yamoussoukro', 'ivory coast', 'ساحل العاج', 'côte d\'ivoire', 'basilica',
      'كاتدرائية سيدة السلام', 'basilica of our lady of peace',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'ياموسوكرو',
        landmark: 'كاتدرائية سيدة السلام',
        description:
          'أكبر كنيسة في العالم بمساحتها، بناها الرئيس هوفويت بوانيي في ياموسوكرو، وقبتها ترتفع ١٥٨ متراً فوق أعمدة رخامية.',
      },
      en: {
        city: 'Yamoussoukro',
        landmark: 'Basilica of Our Lady of Peace',
        description:
          'The largest church in the world by area, built by President Houphouët-Boigny at Yamoussoukro, its dome rising 158 metres above marble colonnades.',
      },
      de: {
        city: 'Yamoussoukro',
        landmark: 'Basilika Unserer Lieben Frau des Friedens',
        description:
          'Die flächengrößte Kirche der Welt, von Präsident Houphouët-Boigny in Yamoussoukro errichtet; ihre Kuppel steigt 158 Meter über Marmorkolonnaden.',
      },
      ru: {
        city: 'Ямусукро',
        landmark: 'Базилика Богоматери Мира',
        description:
          'Крупнейший по площади храм мира, построенный президентом Уфуэ-Буаньи в Ямусукро: купол поднимается на 158 метров над мраморными колоннадами.',
      },
      it: {
        city: 'Yamoussoukro',
        landmark: 'Basilica di Nostra Signora della Pace',
        description:
          'La chiesa più grande del mondo per superficie, voluta dal presidente Houphouët-Boigny a Yamoussoukro, con la cupola a 158 metri sopra colonnati di marmo.',
      },
    },
  },
  {
    id: 'dakar',
    countryCode: 'SN',
    timezone: 'Africa/Dakar',
    latitude: 14.7282,
    longitude: -17.4913,
    image: commons('African Renaissance Monument (5502494604).jpg'),
    credit: credit('African Renaissance Monument (5502494604).jpg'),
    aliases: [
      'داكار', 'dakar', 'senegal', 'السنغال', 'african renaissance monument',
      'نصب النهضة الأفريقية', 'renaissance monument',
    ],
    capital: true,
    focus: '50% 25%',
    copy: {
      ar: {
        city: 'داكار',
        landmark: 'نصب النهضة الأفريقية',
        description:
          'نصب من البرونز ارتفاعه ٤٩ متراً على تلة في داكار، يصوّر رجلاً يحمل طفلاً وامرأة تنظر إلى الأفق، وافتُتح عام ٢٠١٠.',
      },
      en: {
        city: 'Dakar',
        landmark: 'African Renaissance Monument',
        description:
          'A 49-metre bronze monument on a hill in Dakar showing a man carrying a child and a woman looking to the horizon, unveiled in 2010.',
      },
      de: {
        city: 'Dakar',
        landmark: 'Denkmal der Afrikanischen Renaissance',
        description:
          'Ein 49 Meter hohes Bronzedenkmal auf einem Hügel in Dakar: ein Mann mit Kind und eine Frau, die zum Horizont blickt; 2010 enthüllt.',
      },
      ru: {
        city: 'Дакар',
        landmark: 'Монумент африканского возрождения',
        description:
          '49-метровый бронзовый монумент на холме в Дакаре: мужчина с ребёнком и женщина, смотрящая к горизонту; открыт в 2010 году.',
      },
      it: {
        city: 'Dakar',
        landmark: 'Monumento della Rinascita Africana',
        description:
          'Un monumento in bronzo di 49 metri su una collina di Dakar: un uomo con un bambino e una donna che guarda l’orizzonte; inaugurato nel 2010.',
      },
    },
  },
  {
    id: 'al-khums',
    countryCode: 'LY',
    timezone: 'Africa/Tripoli',
    latitude: 32.648,
    longitude: 14.262,
    image: commons('Leptis Magna, Al-Khums, Libya 4.jpg'),
    credit: credit('Leptis Magna, Al-Khums, Libya 4.jpg'),
    aliases: [
      'الخمس', 'al khums', 'khums', 'libya', 'ليبيا', 'leptis magna', 'لبدة الكبرى', 'لبدة',
      'tripoli', 'طرابلس',
    ],
    copy: {
      ar: {
        city: 'الخمس',
        landmark: 'لبدة الكبرى',
        description:
          'مدينة رومانية على الساحل عند الخمس، فيها قوس سيبتيموس سيفيروس والمسرح والسوق، وهي من أكبر آثار الإمبراطورية الرومانية في أفريقيا.',
      },
      en: {
        city: 'Al Khums',
        landmark: 'Leptis Magna',
        description:
          'A Roman city on the coast at Al Khums with the arch of Septimius Severus, a theatre and a market, among the greatest Roman remains in Africa.',
      },
      de: {
        city: 'Al Khums',
        landmark: 'Leptis Magna',
        description:
          'Eine römische Stadt an der Küste bei Al Khums mit dem Bogen des Septimius Severus, Theater und Markt – unter den bedeutendsten Römerresten Afrikas.',
      },
      ru: {
        city: 'Аль-Хумс',
        landmark: 'Лептис-Магна',
        description:
          'Римский город на побережье у Аль-Хумса с аркой Септимия Севера, театром и рынком — одни из величайших римских руин Африки.',
      },
      it: {
        city: 'Al Khums',
        landmark: 'Leptis Magna',
        description:
          'Una città romana sulla costa presso Al Khums con l’arco di Settimio Severo, il teatro e il mercato: tra le maggiori rovine romane d’Africa.',
      },
    },
  },
  {
    id: 'luanda',
    countryCode: 'AO',
    timezone: 'Africa/Luanda',
    latitude: -8.8368,
    longitude: 13.2343,
    image: commons('Luanda-SMiguelFort1.jpg'),
    credit: credit('Luanda-SMiguelFort1.jpg'),
    aliases: [
      'لواندا', 'luanda', 'angola', 'أنغولا', 'fortaleza de sao miguel', 'قلعة ساو ميغيل',
      'sao miguel fortress',
    ],
    capital: true,
    focus: '50% 40%',
    copy: {
      ar: {
        city: 'لواندا',
        landmark: 'قلعة ساو ميغيل',
        description:
          'قلعة برتغالية من القرن السادس عشر على مرتفع يطل على خليج لواندا، كانت تحرس المدينة القديمة وتضم اليوم متحفاً عسكرياً.',
      },
      en: {
        city: 'Luanda',
        landmark: 'Fortaleza de São Miguel',
        description:
          'A sixteenth-century Portuguese fortress on the height above Luanda bay, guarding the old town and now housing a military museum.',
      },
      de: {
        city: 'Luanda',
        landmark: 'Fortaleza de São Miguel',
        description:
          'Eine portugiesische Festung aus dem 16. Jahrhundert auf der Anhöhe über der Bucht von Luanda, die die Altstadt bewachte und heute ein Militärmuseum birgt.',
      },
      ru: {
        city: 'Луанда',
        landmark: 'Крепость Сан-Мигел',
        description:
          'Португальская крепость XVI века на высоте над бухтой Луанды, охранявшая старый город; сегодня в ней военный музей.',
      },
      it: {
        city: 'Luanda',
        landmark: 'Fortezza di São Miguel',
        description:
          'Una fortezza portoghese del Cinquecento sull’altura sopra la baia di Luanda, a guardia della città vecchia; oggi ospita un museo militare.',
      },
    },
  },
  {
    id: 'livingstone',
    countryCode: 'ZM',
    timezone: 'Africa/Lusaka',
    latitude: -17.925,
    longitude: 25.855,
    image: commons('Cataratas Victoria, Zambia-Zimbabue, 2018-07-27, DD 05.jpg'),
    credit: credit('Cataratas Victoria, Zambia-Zimbabue, 2018-07-27, DD 05.jpg'),
    aliases: [
      'ليفينغستون', 'livingstone', 'zambia', 'زامبيا', 'victoria falls', 'شلالات فيكتوريا',
      'lusaka', 'لوساكا',
    ],
    copy: {
      ar: {
        city: 'ليفينغستون',
        landmark: 'شلالات فيكتوريا',
        description:
          'شلالات على نهر الزامبيزي يبلغ عرضها ١٧٠٨ أمتار، يتصاعد رذاذها مئات الأمتار وتُرى من ليفينغستون على الضفة الزامبية.',
      },
      en: {
        city: 'Livingstone',
        landmark: 'Victoria Falls',
        description:
          'A waterfall 1,708 metres wide on the Zambezi whose spray rises hundreds of metres, seen from Livingstone on the Zambian bank.',
      },
      de: {
        city: 'Livingstone',
        landmark: 'Victoriafälle',
        description:
          'Ein 1.708 Meter breiter Wasserfall des Sambesi, dessen Gischt hunderte Meter hoch steigt und von Livingstone am sambischen Ufer zu sehen ist.',
      },
      ru: {
        city: 'Ливингстон',
        landmark: 'Водопад Виктория',
        description:
          'Водопад шириной 1 708 метров на Замбези: его брызги поднимаются на сотни метров и видны из Ливингстона на замбийском берегу.',
      },
      it: {
        city: 'Livingstone',
        landmark: 'Cascate Vittoria',
        description:
          'Una cascata larga 1.708 metri sullo Zambesi, con gli spruzzi che salgono per centinaia di metri e si vedono da Livingstone, sulla riva zambiana.',
      },
    },
  },
  {
    id: 'masvingo',
    countryCode: 'ZW',
    timezone: 'Africa/Harare',
    latitude: -20.2731,
    longitude: 30.9344,
    image: commons('East Wall Great Enclosure (47614139601).jpg'),
    credit: credit('East Wall Great Enclosure (47614139601).jpg'),
    aliases: [
      'ماسفينغو', 'masvingo', 'zimbabwe', 'زيمبابوي', 'great zimbabwe', 'زيمبابوي الكبرى',
      'harare', 'هراري',
    ],
    copy: {
      ar: {
        city: 'ماسفينغو',
        landmark: 'زيمبابوي الكبرى',
        description:
          'أطلال مدينة حجرية بُنيت بلا ملاط بين القرنين الحادي عشر والخامس عشر، وأسوارها الحجرية الضخمة هي التي أعطت البلاد اسمها.',
      },
      en: {
        city: 'Masvingo',
        landmark: 'Great Zimbabwe',
        description:
          'The ruins of a dry-stone city built between the eleventh and fifteenth centuries, whose massive walls gave the country its name.',
      },
      de: {
        city: 'Masvingo',
        landmark: 'Groß-Simbabwe',
        description:
          'Die Ruinen einer Trockenmauerstadt aus dem 11. bis 15. Jahrhundert, deren gewaltige Mauern dem Land seinen Namen gaben.',
      },
      ru: {
        city: 'Масвинго',
        landmark: 'Большой Зимбабве',
        description:
          'Руины города сухой кладки XI–XV веков; его огромные стены дали стране имя.',
      },
      it: {
        city: 'Masvingo',
        landmark: 'Grande Zimbabwe',
        description:
          'Le rovine di una città in pietra a secco costruita tra l’XI e il XV secolo, le cui mura imponenti hanno dato il nome al paese.',
      },
    },
  },
  {
    id: 'gaborone',
    countryCode: 'BW',
    timezone: 'Africa/Gaborone',
    latitude: -24.6454,
    longitude: 25.9064,
    image: commons('Three Dikgosi monument in Gaborone.jpg'),
    credit: credit('Three Dikgosi monument in Gaborone.jpg'),
    aliases: [
      'غابورون', 'gaborone', 'botswana', 'بوتسوانا', 'three dikgosi', 'نصب الديكغوسي الثلاثة',
      'dikgosi',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'غابورون',
        landmark: 'نصب الديكغوسي الثلاثة',
        description:
          'نصب من البرونز لثلاثة من زعماء الباتسوانا في وسط غابورون، أُقيم عام ٢٠٠٥ تخليداً لدورهم في تشكيل الأمة.',
      },
      en: {
        city: 'Gaborone',
        landmark: 'Three Dikgosi Monument',
        description:
          'A bronze monument to three Batswana chiefs in central Gaborone, put up in 2005 to honour their part in shaping the nation.',
      },
      de: {
        city: 'Gaborone',
        landmark: 'Drei-Dikgosi-Denkmal',
        description:
          'Ein Bronzedenkmal für drei Häuptlinge der Batswana im Zentrum von Gaborone, 2005 zur Ehre ihres Anteils an der Nationsbildung errichtet.',
      },
      ru: {
        city: 'Габороне',
        landmark: 'Памятник трём дикгоси',
        description:
          'Бронзовый монумент трём вождям батсвана в центре Габороне, установленный в 2005 году в честь их роли в создании нации.',
      },
      it: {
        city: 'Gaborone',
        landmark: 'Monumento ai Tre Dikgosi',
        description:
          'Un monumento in bronzo a tre capi batswana nel centro di Gaborone, eretto nel 2005 per il loro ruolo nella nascita della nazione.',
      },
    },
  },
  {
    id: 'sesriem',
    countryCode: 'NA',
    timezone: 'Africa/Windhoek',
    latitude: -24.49,
    longitude: 15.8,
    image: commons('006 Dune 45 in Sossusvlei at sunrise Photo by Giles Laurent.jpg'),
    credit: credit('006 Dune 45 in Sossusvlei at sunrise Photo by Giles Laurent.jpg'),
    aliases: [
      'سيسريم', 'sesriem', 'namibia', 'ناميبيا', 'sossusvlei', 'سوسوسفلي', 'dune 45',
      'كثيب 45', 'windhoek', 'ويندهوك',
    ],
    copy: {
      ar: {
        city: 'سيسريم',
        landmark: 'كثبان سوسوسفلي',
        description:
          'كثبان رملية حمراء عالية تحيط ببحيرة طينية جافة في صحراء ناميب، وأشهرها كثيب ٤٥ الذي يتوهج عند الشروق.',
      },
      en: {
        city: 'Sesriem',
        landmark: 'Sossusvlei Dunes',
        description:
          'High red dunes around a dry clay pan in the Namib desert, the most famous being Dune 45, which glows at sunrise.',
      },
      de: {
        city: 'Sesriem',
        landmark: 'Dünen von Sossusvlei',
        description:
          'Hohe rote Dünen um eine trockene Tonpfanne in der Namib, die berühmteste ist die Düne 45, die bei Sonnenaufgang glüht.',
      },
      ru: {
        city: 'Сесрим',
        landmark: 'Дюны Сосусвлей',
        description:
          'Высокие красные дюны вокруг сухой глинистой впадины в Намибе; самая известная — дюна 45, светящаяся на рассвете.',
      },
      it: {
        city: 'Sesriem',
        landmark: 'Dune di Sossusvlei',
        description:
          'Dune rosse alte attorno a una piana di argilla asciutta nel Namib; la più famosa è la duna 45, che brilla all’alba.',
      },
    },
  },
  {
    id: 'mozambique-island',
    countryCode: 'MZ',
    timezone: 'Africa/Maputo',
    latitude: -15.0288,
    longitude: 40.7444,
    image: commons('São Sebastião Fortress - View.jpg'),
    credit: credit('São Sebastião Fortress - View.jpg'),
    aliases: [
      'جزيرة موزمبيق', 'mozambique island', 'ilha de moçambique', 'mozambique', 'موزمبيق',
      'fort sao sebastiao', 'حصن ساو سباستيان', 'maputo', 'مابوتو',
    ],
    copy: {
      ar: {
        city: 'جزيرة موزمبيق',
        landmark: 'حصن ساو سباستيان',
        description:
          'حصن برتغالي من القرن السادس عشر على طرف جزيرة موزمبيق، بأبراجه الحجرية وجدرانه المطلة على المحيط الهندي.',
      },
      en: {
        city: 'Mozambique Island',
        landmark: 'Fort São Sebastião',
        description:
          'A sixteenth-century Portuguese fort at the tip of Mozambique Island, with stone bastions and walls facing the Indian Ocean.',
      },
      de: {
        city: 'Mosambik-Insel',
        landmark: 'Forte São Sebastião',
        description:
          'Eine portugiesische Festung aus dem 16. Jahrhundert an der Spitze der Insel Mosambik, mit Steinbastionen und Mauern zum Indischen Ozean.',
      },
      ru: {
        city: 'Остров Мозамбик',
        landmark: 'Форт Сан-Себастьян',
        description:
          'Португальский форт XVI века на оконечности острова Мозамбик, с каменными бастионами и стенами, обращёнными к Индийскому океану.',
      },
      it: {
        city: 'Isola di Mozambico',
        landmark: 'Forte São Sebastião',
        description:
          'Un forte portoghese del Cinquecento all’estremità dell’isola di Mozambico, con bastioni in pietra e mura verso l’Oceano Indiano.',
      },
    },
  },
  {
    id: 'morondava',
    countryCode: 'MG',
    timezone: 'Indian/Antananarivo',
    latitude: -20.2887,
    longitude: 44.3178,
    image: commons('Avenue of the Baobabs at Sunset.jpg'),
    credit: credit('Avenue of the Baobabs at Sunset.jpg'),
    aliases: [
      'موروندافا', 'morondava', 'madagascar', 'مدغشقر', 'avenue of the baobabs',
      'جادة أشجار الباوباب', 'baobabs', 'antananarivo', 'أنتاناناريفو',
    ],
    copy: {
      ar: {
        city: 'موروندافا',
        landmark: 'جادة أشجار الباوباب',
        description:
          'صف من أشجار الباوباب الضخمة على طريق ترابي قرب موروندافا، جذوعها المنتفخة عمرها قرون.',
      },
      en: {
        city: 'Morondava',
        landmark: 'Avenue of the Baobabs',
        description:
          'A row of huge baobabs along a dirt road near Morondava, their swollen trunks centuries old.',
      },
      de: {
        city: 'Morondava',
        landmark: 'Baobaballee',
        description:
          'Eine Reihe riesiger Baobabs an einer Piste bei Morondava, deren geschwollene Stämme Jahrhunderte alt sind.',
      },
      ru: {
        city: 'Мурундава',
        landmark: 'Аллея баобабов',
        description:
          'Ряд огромных баобабов вдоль грунтовой дороги близ Мурундавы; их раздутые стволы стоят века.',
      },
      it: {
        city: 'Morondava',
        landmark: 'Viale dei baobab',
        description:
          'Una fila di baobab enormi lungo una pista sterrata vicino a Morondava, con tronchi rigonfi secolari.',
      },
    },
  },
  {
    id: 'le-morne',
    countryCode: 'MU',
    timezone: 'Indian/Mauritius',
    latitude: -20.4788,
    longitude: 57.3038,
    image: commons('Le Morne Peninsula in Mauritius (53697779236).jpg'),
    credit: credit('Le Morne Peninsula in Mauritius (53697779236).jpg'),
    aliases: [
      'لو مورن', 'le morne', 'mauritius', 'موريشيوس', 'le morne brabant', 'جبل لو مورن',
      'port louis', 'بورت لويس',
    ],
    copy: {
      ar: {
        city: 'لو مورن',
        landmark: 'جبل لو مورن برابان',
        description:
          'جبل صخري منفرد يرتفع من البحر في الطرف الجنوبي الغربي لموريشيوس، وكان ملاذاً للعبيد الهاربين، وهو اليوم موقع تراث عالمي.',
      },
      en: {
        city: 'Le Morne',
        landmark: 'Le Morne Brabant',
        description:
          'A lone rock mountain rising from the sea at the south-western tip of Mauritius, once a refuge for escaped slaves and now a World Heritage site.',
      },
      de: {
        city: 'Le Morne',
        landmark: 'Le Morne Brabant',
        description:
          'Ein einzelner Felsberg am Südwestzipfel von Mauritius, einst Zuflucht entlaufener Sklaven und heute Welterbe.',
      },
      ru: {
        city: 'Ле-Морн',
        landmark: 'Ле-Морн-Брабан',
        description:
          'Одинокая скала-гора на юго-западе Маврикия, когда-то убежище беглых рабов, а ныне объект Всемирного наследия.',
      },
      it: {
        city: 'Le Morne',
        landmark: 'Le Morne Brabant',
        description:
          'Una montagna isolata che sorge dal mare all’estremità sud-occidentale di Mauritius, un tempo rifugio di schiavi fuggiaschi e oggi patrimonio mondiale.',
      },
    },
  },
  {
    id: 'kigali',
    countryCode: 'RW',
    timezone: 'Africa/Kigali',
    latitude: -1.9311,
    longitude: 30.0606,
    image: commons('אתר ההנצחה לרצח העם ברואנדה בקיגאלי 05.jpg'),
    credit: credit('אתר ההנצחה לרצח העם ברואנדה בקיגאלי 05.jpg'),
    aliases: [
      'كيغالي', 'kigali', 'rwanda', 'رواندا', 'kigali genocide memorial',
      'نصب كيغالي التذكاري', 'genocide memorial',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'كيغالي',
        landmark: 'نصب كيغالي التذكاري للإبادة',
        description:
          'نصب تذكاري على تلة في كيغالي يضم مقابر جماعية وحدائق، ويكرّم ضحايا الإبادة الجماعية عام ١٩٩٤.',
      },
      en: {
        city: 'Kigali',
        landmark: 'Kigali Genocide Memorial',
        description:
          'A memorial on a hill in Kigali with mass graves and gardens, honouring the victims of the 1994 genocide.',
      },
      de: {
        city: 'Kigali',
        landmark: 'Gedenkstätte des Völkermords',
        description:
          'Eine Gedenkstätte auf einem Hügel in Kigali mit Massengräbern und Gärten zum Gedenken an die Opfer des Völkermords von 1994.',
      },
      ru: {
        city: 'Кигали',
        landmark: 'Мемориал геноцида',
        description:
          'Мемориал на холме в Кигали с братскими могилами и садами в память о жертвах геноцида 1994 года.',
      },
      it: {
        city: 'Kigali',
        landmark: 'Memoriale del genocidio',
        description:
          'Un memoriale su una collina di Kigali con fosse comuni e giardini, in memoria delle vittime del genocidio del 1994.',
      },
    },
  },
  {
    id: 'bujumbura',
    countryCode: 'BI',
    timezone: 'Africa/Bujumbura',
    latitude: -3.3819,
    longitude: 29.3614,
    image: commons('Cathédrale Regina Mundi de Bujumbura, 2024-3.jpg'),
    credit: credit('Cathédrale Regina Mundi de Bujumbura, 2024-3.jpg'),
    aliases: [
      'بوجومبورا', 'bujumbura', 'burundi', 'بوروندي', 'cathédrale regina mundi',
      'regina mundi', 'كاتدرائية ريجينا موندي', 'bujumbura cathedral', 'gitega', 'غيتيغا',
    ],
    copy: {
      ar: {
        city: 'بوجومبورا',
        landmark: 'كاتدرائية ريجينا موندي',
        description:
          'كاتدرائية من القرن العشرين في وسط بوجومبورا، ببرجها المربع العالي وواجهتها الفاتحة، وهي من أكبر كنائس البلاد.',
      },
      en: {
        city: 'Bujumbura',
        landmark: 'Cathédrale Regina Mundi',
        description:
          'A twentieth-century cathedral in central Bujumbura with a tall square tower and pale façade, among the largest churches in the country.',
      },
      de: {
        city: 'Bujumbura',
        landmark: 'Kathedrale Regina Mundi',
        description:
          'Eine Kathedrale des 20. Jahrhunderts im Zentrum von Bujumbura mit hohem quadratischem Turm und heller Fassade, eine der größten Kirchen des Landes.',
      },
      ru: {
        city: 'Бужумбура',
        landmark: 'Собор Регина Мунди',
        description:
          'Кафедральный собор XX века в центре Бужумбуры с высокой квадратной башней и светлым фасадом, одна из крупнейших церквей страны.',
      },
      it: {
        city: 'Bujumbura',
        landmark: 'Cattedrale Regina Mundi',
        description:
          'Una cattedrale del Novecento nel centro di Bujumbura, con alta torre quadrata e facciata chiara, tra le maggiori chiese del paese.',
      },
    },
  },
  {
    id: 'goma',
    countryCode: 'CD',
    timezone: 'Africa/Lubumbashi',
    latitude: -1.6741,
    longitude: 29.2284,
    image: commons('Mountain Gorilla (Humba family) – Virunga National Park (30).jpg'),
    credit: credit('Mountain Gorilla (Humba family) – Virunga National Park (30).jpg'),
    aliases: [
      'غوما', 'goma', 'dr congo', 'democratic republic of the congo', 'الكونغو الديمقراطية',
      'virunga', 'فيرونغا', 'virunga national park', 'حديقة فيرونغا', 'kinshasa', 'كينشاسا',
    ],
    copy: {
      ar: {
        city: 'غوما',
        landmark: 'حديقة فيرونغا الوطنية',
        description:
          'أقدم حديقة وطنية في أفريقيا، على الحدود مع أوغندا ورواندا، تعيش فيها غوريلات الجبال في غابات البراكين الخضراء.',
      },
      en: {
        city: 'Goma',
        landmark: 'Virunga National Park',
        description:
          'Africa’s oldest national park, on the borders with Uganda and Rwanda, where mountain gorillas live in the green forests of the volcanoes.',
      },
      de: {
        city: 'Goma',
        landmark: 'Virunga-Nationalpark',
        description:
          'Afrikas ältester Nationalpark an den Grenzen zu Uganda und Ruanda, in dessen grünen Vulkanwäldern Berggorillas leben.',
      },
      ru: {
        city: 'Гома',
        landmark: 'Национальный парк Вирунга',
        description:
          'Старейший национальный парк Африки на границах с Угандой и Руандой, где в зелёных лесах вулканов живут горные гориллы.',
      },
      it: {
        city: 'Goma',
        landmark: 'Parco nazionale del Virunga',
        description:
          'Il più antico parco nazionale d’Africa, ai confini con Uganda e Ruanda, dove i gorilla di montagna vivono nelle verdi foreste dei vulcani.',
      },
    },
  },
  {
    id: 'brazzaville',
    countryCode: 'CG',
    timezone: 'Africa/Brazzaville',
    latitude: -4.2661,
    longitude: 15.2832,
    image: commons('Brazzaville - Basilique Sainte-Anne-du-Congo.jpg'),
    credit: credit('Brazzaville - Basilique Sainte-Anne-du-Congo.jpg'),
    aliases: [
      'برازافيل', 'brazzaville', 'congo', 'republic of the congo', 'جمهورية الكونغو',
      'basilique sainte-anne', 'كاتدرائية القديسة آن',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'برازافيل',
        landmark: 'كاتدرائية القديسة آن',
        description:
          'كنيسة من القرن التاسع عشر في برازافيل، بُني هيكلها من الطوب الأحمر على شكل حزمة سعف نخيل، وسقفها من القرميد الأخضر.',
      },
      en: {
        city: 'Brazzaville',
        landmark: 'Basilique Sainte-Anne',
        description:
          'A nineteenth-century church in Brazzaville whose red-brick shell is shaped like a bundle of palm fronds, under a green-tiled roof.',
      },
      de: {
        city: 'Brazzaville',
        landmark: 'Basilika Sainte-Anne',
        description:
          'Eine Kirche des 19. Jahrhunderts in Brazzaville, deren roter Backsteinbau wie ein Bündel Palmwedel geformt ist, mit grünem Ziegeldach.',
      },
      ru: {
        city: 'Браззавиль',
        landmark: 'Базилика Святой Анны',
        description:
          'Церковь XIX века в Браззавиле: краснокирпичный корпус в форме пучка пальмовых листьев и зелёная черепичная крыша.',
      },
      it: {
        city: 'Brazzaville',
        landmark: 'Basilica di Sant’Anna',
        description:
          'Una chiesa ottocentesca a Brazzaville, con il guscio in mattoni rossi a forma di fascio di foglie di palma e il tetto in tegole verdi.',
      },
    },
  },
  {
    id: 'buea',
    countryCode: 'CM',
    timezone: 'Africa/Douala',
    latitude: 4.1534,
    longitude: 9.2423,
    image: commons('Mount Fako.jpg'),
    credit: credit('Mount Fako.jpg'),
    aliases: [
      'بويا', 'buea', 'cameroon', 'الكاميرون', 'mount cameroon', 'جبل الكاميرون', 'yaounde',
      'ياوندي',
    ],
    focus: '35% 50%',
    copy: {
      ar: {
        city: 'بويا',
        landmark: 'جبل الكاميرون',
        description:
          'بركان نشط يرتفع ٤٠٤٠ متراً فوق خليج بيافرا، وهو أعلى قمة في غرب أفريقيا، ويطل على بويا والسهول الساحلية.',
      },
      en: {
        city: 'Buea',
        landmark: 'Mount Cameroon',
        description:
          'An active volcano rising 4,040 metres above the Bight of Biafra, the highest peak in West Africa, looking over Buea and the coastal plain.',
      },
      de: {
        city: 'Buea',
        landmark: 'Kamerunberg',
        description:
          'Ein aktiver Vulkan, 4.040 Meter über der Bucht von Biafra, der höchste Gipfel Westafrikas, mit Blick über Buea und die Küstenebene.',
      },
      ru: {
        city: 'Буэа',
        landmark: 'Камерун',
        description:
          'Действующий вулкан высотой 4 040 метров над заливом Биафра, высшая точка Западной Африки, над Буэа и прибрежной равниной.',
      },
      it: {
        city: 'Buea',
        landmark: 'Monte Camerun',
        description:
          'Un vulcano attivo alto 4.040 metri sulla baia di Biafra, la vetta più alta dell’Africa occidentale, sopra Buea e la piana costiera.',
      },
    },
  },
  {
    id: 'libreville',
    countryCode: 'GA',
    timezone: 'Africa/Libreville',
    latitude: 0.3924,
    longitude: 9.4536,
    image: commons('Cathédrale Saint-Pierre de Libreville, Gabon - 2023.jpg'),
    credit: credit('Cathédrale Saint-Pierre de Libreville, Gabon - 2023.jpg'),
    aliases: [
      'ليبرفيل', 'libreville', 'gabon', 'الغابون', 'cathedrale saint-pierre',
      'cathédrale saint-pierre', 'كاتدرائية القديس بطرس', 'saint-pierre',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'ليبرفيل',
        landmark: 'كاتدرائية القديس بطرس',
        description:
          'كاتدرائية في قلب ليبرفيل ببرج مربع وواجهة فاتحة، بُنيت في مطلع القرن العشرين، وهي من معالم العاصمة الغابونية.',
      },
      en: {
        city: 'Libreville',
        landmark: 'Cathédrale Saint-Pierre',
        description:
          'A cathedral in the heart of Libreville with a square tower and pale façade, built in the early twentieth century and one of the landmarks of the Gabonese capital.',
      },
      de: {
        city: 'Libreville',
        landmark: 'Kathedrale Saint-Pierre',
        description:
          'Eine Kathedrale im Herzen von Libreville mit quadratischem Turm und heller Fassade, Anfang des 20. Jahrhunderts erbaut und eines der Wahrzeichen der Hauptstadt.',
      },
      ru: {
        city: 'Либревиль',
        landmark: 'Собор Святого Петра',
        description:
          'Собор в центре Либревиля с квадратной башней и светлым фасадом, построенный в начале XX века, — одна из примет габонской столицы.',
      },
      it: {
        city: 'Libreville',
        landmark: 'Cattedrale di San Pietro',
        description:
          'Una cattedrale nel cuore di Libreville con torre quadrata e facciata chiara, costruita all’inizio del Novecento e tra i simboli della capitale.',
      },
    },
  },
  {
    id: 'ndjamena',
    countryCode: 'TD',
    timezone: 'Africa/Ndjamena',
    latitude: 12.1067,
    longitude: 15.0444,
    image: commons('Grande mosquée de Gaoui.jpg'),
    credit: credit('Grande mosquée de Gaoui.jpg'),
    aliases: [
      'نجامينا', 'ndjamena', 'n\'djamena', 'chad', 'تشاد', 'grande mosquee de gaoui',
      'الجامع الكبير في غاوي', 'gaoui', 'غاوي',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'نجامينا',
        landmark: 'الجامع الكبير في غاوي',
        description:
          'مسجد من الطوب اللبن بمئذنة نحيلة وقبة بيضاء في قرية غاوي قرب نجامينا، بُني على الطراز الساحلي ويُعد من أجمل مساجد تشاد.',
      },
      en: {
        city: 'N’Djamena',
        landmark: 'Grande Mosquée de Gaoui',
        description:
          'A mud-brick mosque with a slender minaret and white dome in the village of Gaoui near N’Djamena, built in the Sahelian manner and among Chad’s finest.',
      },
      de: {
        city: 'N’Djamena',
        landmark: 'Große Moschee von Gaoui',
        description:
          'Eine Lehmmoschee mit schlankem Minarett und weißer Kuppel im Dorf Gaoui bei N’Djamena, im Sahelstil erbaut und eine der schönsten des Tschad.',
      },
      ru: {
        city: 'Нджамена',
        landmark: 'Большая мечеть Гауи',
        description:
          'Глинобитная мечеть со стройным минаретом и белым куполом в селении Гауи близ Нджамены, построенная в сахельском стиле.',
      },
      it: {
        city: 'N’Djamena',
        landmark: 'Grande Moschea di Gaoui',
        description:
          'Una moschea in terra cruda con minareto snello e cupola bianca nel villaggio di Gaoui, vicino a N’Djamena, in stile saheliano.',
      },
    },
  },
  {
    id: 'niamey',
    countryCode: 'NE',
    timezone: 'Africa/Niamey',
    latitude: 13.5052,
    longitude: 2.1099,
    image: commons('Niger, Niamey, Pont Kennedy (1).jpg'),
    credit: credit('Niger, Niamey, Pont Kennedy (1).jpg'),
    aliases: [
      'نيامي', 'niamey', 'niger', 'النيجر', 'pont kennedy', 'kennedy bridge', 'جسر كينيدي',
      'grand mosque of niamey', 'الجامع الكبير',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'نيامي',
        landmark: 'جسر كينيدي',
        description:
          'جسر يعبر نهر النيجر عند نيامي، افتُتح عام ١٩٧٠ وحمل اسم الرئيس الأمريكي، وهو أطول جسر في البلاد ويربط ضفتي العاصمة.',
      },
      en: {
        city: 'Niamey',
        landmark: 'Kennedy Bridge',
        description:
          'A bridge over the Niger at Niamey, opened in 1970 and named for the American president, the country’s longest and the link between the two banks of the capital.',
      },
      de: {
        city: 'Niamey',
        landmark: 'Kennedy-Brücke',
        description:
          'Eine Brücke über den Niger bei Niamey, 1970 eröffnet und nach dem amerikanischen Präsidenten benannt, die längste des Landes und die Verbindung beider Ufer der Hauptstadt.',
      },
      ru: {
        city: 'Ниамей',
        landmark: 'Мост Кеннеди',
        description:
          'Мост через Нигер у Ниамея, открытый в 1970 году и названный в честь американского президента; самый длинный в стране, он связывает два берега столицы.',
      },
      it: {
        city: 'Niamey',
        landmark: 'Ponte Kennedy',
        description:
          'Un ponte sul Niger a Niamey, aperto nel 1970 e intitolato al presidente americano: il più lungo del paese, collega le due rive della capitale.',
      },
    },
  },
  {
    id: 'djenne',
    countryCode: 'ML',
    timezone: 'Africa/Bamako',
    latitude: 13.9051,
    longitude: -4.5553,
    image: commons('The Great Clay Mosque in Djenne, Mali.jpg'),
    credit: credit('The Great Clay Mosque in Djenne, Mali.jpg'),
    aliases: [
      'جني', 'djenne', 'djenné', 'mali', 'مالي', 'great mosque of djenne',
      'الجامع الكبير في جني', 'bamako', 'باماكو',
    ],
    copy: {
      ar: {
        city: 'جني',
        landmark: 'الجامع الكبير في جني',
        description:
          'أكبر مبنى من الطين في العالم، تُعيد البلدة طلاءه كل عام في مهرجان، بجدرانه الشاهقة وأوتاده الخشبية البارزة.',
      },
      en: {
        city: 'Djenné',
        landmark: 'Great Mosque of Djenné',
        description:
          'The largest mud-brick building in the world, re-plastered by the whole town each year in a festival, with tall walls and projecting timber beams.',
      },
      de: {
        city: 'Djenné',
        landmark: 'Große Moschee von Djenné',
        description:
          'Das größte Lehmbauwerk der Welt, das die Stadt jedes Jahr in einem Fest neu verputzt, mit hohen Wänden und vorstehenden Holzbalken.',
      },
      ru: {
        city: 'Дженне',
        landmark: 'Большая мечеть',
        description:
          'Крупнейшая в мире постройка из глины: город каждый год заново обмазывает её в дни праздника; высокие стены и выступающие деревянные балки.',
      },
      it: {
        city: 'Djenné',
        landmark: 'Grande Moschea di Djenné',
        description:
          'Il più grande edificio in terra cruda del mondo, reintonacato ogni anno dalla città durante una festa, con mura alte e travi di legno sporgenti.',
      },
    },
  },
  {
    id: 'bobo-dioulasso',
    countryCode: 'BF',
    timezone: 'Africa/Ouagadougou',
    latitude: 11.177,
    longitude: -4.297,
    image: commons('Moschee von Bobo-Dioulasso.jpg'),
    credit: credit('Moschee von Bobo-Dioulasso.jpg'),
    aliases: [
      'بوبو ديولاسو', 'bobo-dioulasso', 'bobo dioulasso', 'burkina faso', 'بوركينا فاسو',
      'grand mosque of bobo-dioulasso', 'الجامع الكبير في بوبو ديولاسو', 'ouagadougou',
      'واغادوغو',
    ],
    copy: {
      ar: {
        city: 'بوبو ديولاسو',
        landmark: 'الجامع الكبير',
        description:
          'مسجد من الطين بأبراج ومآذن خشبية في بوبو ديولاسو، وهو من أقدم مساجد بوركينا فاسو وأجملها بأسلوب السودان الغربي.',
      },
      en: {
        city: 'Bobo-Dioulasso',
        landmark: 'Grand Mosque of Bobo-Dioulasso',
        description:
          'A mud-brick mosque with timber towers and minarets in Bobo-Dioulasso, among the oldest and finest in Burkina Faso, in the western Sudanese manner.',
      },
      de: {
        city: 'Bobo-Dioulasso',
        landmark: 'Große Moschee von Bobo-Dioulasso',
        description:
          'Eine Lehmmoschee mit Holztürmen und Minaretten in Bobo-Dioulasso, eine der ältesten und schönsten Burkina Fasos im westsudanesischen Stil.',
      },
      ru: {
        city: 'Бобо-Диуласо',
        landmark: 'Большая мечеть',
        description:
          'Глинобитная мечеть с деревянными башнями и минаретами в Бобо-Диуласо, одна из старейших и красивейших в Буркина-Фасо.',
      },
      it: {
        city: 'Bobo-Dioulasso',
        landmark: 'Grande Moschea di Bobo-Dioulasso',
        description:
          'Una moschea in terra cruda con torri e minareti di legno a Bobo-Dioulasso, tra le più antiche e belle del Burkina Faso.',
      },
    },
  },
  {
    id: 'freetown',
    countryCode: 'SL',
    timezone: 'Africa/Freetown',
    latitude: 8.4984,
    longitude: -13.2608,
    image: commons('Freetown-aerialview.jpg'),
    credit: credit('Freetown-aerialview.jpg'),
    aliases: [
      'فريتاون', 'freetown', 'sierra leone', 'سيراليون', 'freetown harbour', 'ميناء فريتاون',
      'harbour',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'فريتاون',
        landmark: 'ميناء فريتاون',
        description:
          'ميناء فريتاون على المحيط الأطلسي، حيث تتكئ المدينة على تلال خضراء وتنزل إلى خليج واسع فيه قوارب الصيد والعبّارات.',
      },
      en: {
        city: 'Freetown',
        landmark: 'Freetown Harbour',
        description:
          'The harbour of Freetown on the Atlantic, where the city leans against green hills and drops to a wide bay of fishing boats and ferries.',
      },
      de: {
        city: 'Freetown',
        landmark: 'Hafen von Freetown',
        description:
          'Der Hafen von Freetown am Atlantik: Die Stadt lehnt sich an grüne Hügel und fällt zu einer weiten Bucht mit Fischerbooten und Fähren ab.',
      },
      ru: {
        city: 'Фритаун',
        landmark: 'Порт Фритауна',
        description:
          'Порт Фритауна на Атлантике: город прижат к зелёным холмам и спускается к широкой бухте с рыбацкими лодками и паромами.',
      },
      it: {
        city: 'Freetown',
        landmark: 'Porto di Freetown',
        description:
          'Il porto di Freetown sull’Atlantico, dove la città si appoggia a colline verdi e scende a una baia ampia di barche e traghetti.',
      },
    },
  },
  {
    id: 'monrovia',
    countryCode: 'LR',
    timezone: 'Africa/Monrovia',
    latitude: 6.3005,
    longitude: -10.7969,
    image: commons('City Hall, Monrovia, Liberia.JPG'),
    credit: credit('City Hall, Monrovia, Liberia.JPG'),
    aliases: [
      'مونروفيا', 'monrovia', 'liberia', 'ليبيريا', 'monrovia city hall', 'دار بلدية مونروفيا',
      'city hall',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'مونروفيا',
        landmark: 'دار بلدية مونروفيا',
        description:
          'مبنى بلدية مونروفيا بواجهته المستقيمة وأعمدته، يقف في وسط العاصمة الليبيرية عند تقاطع طرق رئيسية.',
      },
      en: {
        city: 'Monrovia',
        landmark: 'Monrovia City Hall',
        description:
          'The city hall of Monrovia, with its straight front and columns, standing in the middle of the Liberian capital at a main crossroads.',
      },
      de: {
        city: 'Monrovia',
        landmark: 'Rathaus von Monrovia',
        description:
          'Das Rathaus von Monrovia mit gerader Front und Säulen, mitten in der liberianischen Hauptstadt an einer Hauptkreuzung.',
      },
      ru: {
        city: 'Монровия',
        landmark: 'Мэрия Монровии',
        description:
          'Здание мэрии Монровии с прямым фасадом и колоннами, в центре либерийской столицы на главном перекрёстке.',
      },
      it: {
        city: 'Monrovia',
        landmark: 'Municipio di Monrovia',
        description:
          'Il municipio di Monrovia, con fronte lineare e colonne, nel centro della capitale liberiana a un crocevia principale.',
      },
    },
  },
  {
    id: 'conakry',
    countryCode: 'GN',
    timezone: 'Africa/Conakry',
    latitude: 9.5353,
    longitude: -13.6841,
    image: commons('Grande Mosquée Fayçal de Conakry 1.jpg'),
    credit: credit('Grande Mosquée Fayçal de Conakry 1.jpg'),
    aliases: [
      'كوناكري', 'conakry', 'guinea', 'غينيا', 'grand mosque of conakry',
      'الجامع الكبير في كوناكري', 'faisal mosque', 'مسجد فيصل',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'كوناكري',
        landmark: 'الجامع الكبير في كوناكري',
        description:
          'مسجد كبير في كوناكري بقبة ومآذن بيضاء، بُني في الستينيات، ويُعد من أكبر مساجد غرب أفريقيا.',
      },
      en: {
        city: 'Conakry',
        landmark: 'Grand Mosque of Conakry',
        description:
          'A large mosque in Conakry with white dome and minarets, built in the 1960s and among the biggest in West Africa.',
      },
      de: {
        city: 'Conakry',
        landmark: 'Große Moschee von Conakry',
        description:
          'Eine große Moschee in Conakry mit weißer Kuppel und Minaretten, in den 1960er-Jahren erbaut und eine der größten Westafrikas.',
      },
      ru: {
        city: 'Конакри',
        landmark: 'Большая мечеть',
        description:
          'Большая мечеть в Конакри с белым куполом и минаретами, построенная в 1960-х, одна из крупнейших в Западной Африке.',
      },
      it: {
        city: 'Conakry',
        landmark: 'Grande Moschea di Conakry',
        description:
          'Una grande moschea a Conakry con cupola bianca e minareti, costruita negli anni Sessanta, tra le maggiori dell’Africa occidentale.',
      },
    },
  },
  {
    id: 'bissau',
    countryCode: 'GW',
    timezone: 'Africa/Bissau',
    latitude: 11.8636,
    longitude: -15.5977,
    image: commons('Catedral de Bissau (2).jpg'),
    credit: credit('Catedral de Bissau (2).jpg'),
    aliases: [
      'بيساو', 'bissau', 'guinea-bissau', 'غينيا بيساو', 'bissau cathedral', 'كاتدرائية بيساو',
      'cathedral',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'بيساو',
        landmark: 'كاتدرائية بيساو',
        description:
          'كاتدرائية في وسط بيساو ببرج جرس عالٍ ونوافذ مقوسة، بُنيت في العهد البرتغالي وتطل على الشوارع المحيطة.',
      },
      en: {
        city: 'Bissau',
        landmark: 'Bissau Cathedral',
        description:
          'A cathedral in central Bissau with a tall bell tower and arched windows, built in Portuguese times and facing the streets around it.',
      },
      de: {
        city: 'Bissau',
        landmark: 'Kathedrale von Bissau',
        description:
          'Eine Kathedrale im Zentrum von Bissau mit hohem Glockenturm und Bogenfenstern, in portugiesischer Zeit erbaut.',
      },
      ru: {
        city: 'Бисау',
        landmark: 'Собор Бисау',
        description:
          'Собор в центре Бисау с высокой колокольней и арочными окнами, построенный в португальские времена.',
      },
      it: {
        city: 'Bissau',
        landmark: 'Cattedrale di Bissau',
        description:
          'Una cattedrale nel centro di Bissau con alta torre campanaria e finestre ad arco, costruita in epoca portoghese.',
      },
    },
  },
  {
    id: 'banjul',
    countryCode: 'GM',
    timezone: 'Africa/Banjul',
    latitude: 13.4601,
    longitude: -16.5819,
    image: commons('Gambia, Banjul, Arch 22.jpg'),
    credit: credit('Gambia, Banjul, Arch 22.jpg'),
    aliases: [
      'بانجول', 'banjul', 'gambia', 'the gambia', 'غامبيا', 'arch 22', 'قوس 22',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'بانجول',
        landmark: 'قوس 22',
        description:
          'قوس ضخم عند مدخل بانجول ارتفاعه ٣٥ متراً، بُني عام ١٩٩٦ لإحياء ذكرى الانقلاب، ومن أعلاه تُرى المدينة ومصب النهر.',
      },
      en: {
        city: 'Banjul',
        landmark: 'Arch 22',
        description:
          'A 35-metre arch at the entrance to Banjul, raised in 1996 to mark the coup, with a view from the top over the city and the river mouth.',
      },
      de: {
        city: 'Banjul',
        landmark: 'Arch 22',
        description:
          'Ein 35 Meter hoher Bogen am Eingang von Banjul, 1996 zum Gedenken an den Putsch errichtet, mit Blick von oben über Stadt und Flussmündung.',
      },
      ru: {
        city: 'Банжул',
        landmark: 'Арка 22',
        description:
          '35-метровая арка на въезде в Банжул, поставленная в 1996 году в память о перевороте; сверху видны город и устье реки.',
      },
      it: {
        city: 'Banjul',
        landmark: 'Arch 22',
        description:
          'Un arco alto 35 metri all’ingresso di Banjul, eretto nel 1996 per ricordare il colpo di Stato, con vista dall’alto sulla città e sulla foce del fiume.',
      },
    },
  },
  {
    id: 'lome',
    countryCode: 'TG',
    timezone: 'Africa/Lome',
    latitude: 6.1298,
    longitude: 1.2161,
    image: commons('Monument de l\'indépendance du Togo à Lomé 12.jpg'),
    credit: credit('Monument de l\'indépendance du Togo à Lomé 12.jpg'),
    aliases: [
      'لومي', 'lome', 'lomé', 'togo', 'توغو', 'monument de l\'independance', 'نصب الاستقلال',
      'independence monument',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'لومي',
        landmark: 'نصب الاستقلال',
        description:
          'نصب في وسط لومي من ثلاث كتل حجرية تحيط بتمثال يقطع السلاسل، أُقيم في الستينيات تخليداً لاستقلال توغو عام ١٩٦٠.',
      },
      en: {
        city: 'Lomé',
        landmark: 'Monument de l’Indépendance',
        description:
          'A monument in central Lomé of three stone slabs around a figure breaking free of chains, raised in the 1960s to mark Togo’s independence in 1960.',
      },
      de: {
        city: 'Lomé',
        landmark: 'Unabhängigkeitsdenkmal',
        description:
          'Ein Denkmal im Zentrum von Lomé: drei Steinplatten um eine Figur, die Ketten sprengt, in den 1960er-Jahren zur Erinnerung an die Unabhängigkeit Togos 1960 errichtet.',
      },
      ru: {
        city: 'Ломе',
        landmark: 'Монумент независимости',
        description:
          'Монумент в центре Ломе: три каменные стелы вокруг фигуры, разрывающей цепи; установлен в 1960-х в честь независимости Того 1960 года.',
      },
      it: {
        city: 'Lomé',
        landmark: 'Monumento dell’Indipendenza',
        description:
          'Un monumento nel centro di Lomé: tre lastre di pietra attorno a una figura che spezza le catene, eretto negli anni Sessanta per l’indipendenza del Togo nel 1960.',
      },
    },
  },
  {
    id: 'abomey',
    countryCode: 'BJ',
    timezone: 'Africa/Porto-Novo',
    latitude: 7.1833,
    longitude: 1.9833,
    image: commons('Royal Palaces of Abomey-133471.jpg'),
    credit: credit('Royal Palaces of Abomey-133471.jpg'),
    aliases: [
      'أبومي', 'abomey', 'benin', 'بنين', 'royal palaces of abomey', 'القصور الملكية في أبومي',
      'porto-novo', 'بورتو نوفو',
    ],
    copy: {
      ar: {
        city: 'أبومي',
        landmark: 'القصور الملكية في أبومي',
        description:
          'مجموعة قصور من الطين كان يحكم منها ملوك داهومي، بجدران مزخرفة ورموز وأبواب خشبية، وهي اليوم موقع تراث عالمي.',
      },
      en: {
        city: 'Abomey',
        landmark: 'Royal Palaces of Abomey',
        description:
          'A group of earthen palaces from which the kings of Dahomey ruled, with decorated walls, symbols and carved doors, now a World Heritage site.',
      },
      de: {
        city: 'Abomey',
        landmark: 'Königspaläste von Abomey',
        description:
          'Eine Gruppe von Lehm-Palästen, von denen die Könige von Dahomey herrschten, mit verzierten Wänden, Symbolen und geschnitzten Türen, heute Welterbe.',
      },
      ru: {
        city: 'Абомей',
        landmark: 'Королевские дворцы Абомея',
        description:
          'Комплекс глинобитных дворцов, откуда правили цари Дагомеи; украшенные стены, символы и резные двери, ныне объект Всемирного наследия.',
      },
      it: {
        city: 'Abomey',
        landmark: 'Palazzi reali di Abomey',
        description:
          'Un gruppo di palazzi in terra cruda da cui governavano i re del Dahomey, con pareti decorate, simboli e porte intagliate, oggi patrimonio mondiale.',
      },
    },
  },
  {
    id: 'bangui',
    countryCode: 'CF',
    timezone: 'Africa/Bangui',
    latitude: 4.3667,
    longitude: 18.5833,
    image: commons('Bangui City Centre.jpg'),
    credit: credit('Bangui City Centre.jpg'),
    aliases: [
      'بانغي', 'bangui', 'central african republic', 'جمهورية أفريقيا الوسطى', 'oubangui',
      'أوبانغي', 'bangui city centre',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'بانغي',
        landmark: 'وسط مدينة بانغي',
        description:
          'قلب بانغي على ضفة نهر أوبانغي، حيث المباني الاستعمارية والأسواق والجسر الذي يعبر إلى الكونغو.',
      },
      en: {
        city: 'Bangui',
        landmark: 'Bangui City Centre',
        description:
          'The centre of Bangui on the Oubangui river, with colonial buildings, markets and the bridge that crosses to Congo.',
      },
      de: {
        city: 'Bangui',
        landmark: 'Zentrum von Bangui',
        description:
          'Das Zentrum von Bangui am Oubangui, mit Kolonialbauten, Märkten und der Brücke in den Kongo.',
      },
      ru: {
        city: 'Банги',
        landmark: 'Центр Банги',
        description:
          'Центр Банги на реке Убанги: колониальные здания, рынки и мост, ведущий в Конго.',
      },
      it: {
        city: 'Bangui',
        landmark: 'Centro di Bangui',
        description:
          'Il centro di Bangui sul fiume Oubangui, con edifici coloniali, mercati e il ponte che porta in Congo.',
      },
    },
  },
  {
    id: 'juba',
    countryCode: 'SS',
    timezone: 'Africa/Juba',
    latitude: 4.8517,
    longitude: 31.5825,
    image: commons('Juba Nile Bridge.jpg'),
    credit: credit('Juba Nile Bridge.jpg'),
    aliases: [
      'جوبا', 'juba', 'south sudan', 'جنوب السودان', 'juba bridge', 'جسر جوبا', 'nile bridge',
    ],
    capital: true,
    copy: {
      ar: {
        city: 'جوبا',
        landmark: 'جسر جوبا على النيل',
        description:
          'جسر يعبر النيل الأبيض عند جوبا، طوله نحو نصف كيلومتر، ويربط المدينة بالضفة الغربية.',
      },
      en: {
        city: 'Juba',
        landmark: 'Juba Nile Bridge',
        description:
          'A bridge over the White Nile at Juba, roughly half a kilometre long, linking the city to the western bank.',
      },
      de: {
        city: 'Juba',
        landmark: 'Nilstraßenbrücke bei Juba',
        description:
          'Eine Brücke über den Weißen Nil bei Juba, rund einen halben Kilometer lang, die die Stadt mit dem Westufer verbindet.',
      },
      ru: {
        city: 'Джуба',
        landmark: 'Мост через Белый Нил',
        description:
          'Мост через Белый Нил у Джубы длиной около полукилометра, соединяющий город с западным берегом.',
      },
      it: {
        city: 'Juba',
        landmark: 'Ponte sul Nilo Bianco',
        description:
          'Un ponte sul Nilo Bianco a Juba, lungo circa mezzo chilometro, che collega la città alla riva occidentale.',
      },
    },
  },
  {
    id: 'mogadishu',
    countryCode: 'SO',
    timezone: 'Africa/Mogadishu',
    latitude: 2.0361,
    longitude: 45.3314,
    image: commons('Isbahaysiga Mosque 01.jpg'),
    credit: credit('Isbahaysiga Mosque 01.jpg'),
    aliases: [
      'مقديشو', 'mogadishu', 'somalia', 'الصومال', 'isbahaysiga', 'جامع إسباهيسيغا',
      'arba\'a rukun', 'arba rukun mosque', 'مسجد الأربعة أركان',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'مقديشو',
        landmark: 'جامع إسباهيسيغا',
        description:
          'أكبر مسجد في الصومال، بُني عام ١٩٨٧ بقبة ومئذنة بيضاء، ويقف على طريق مكة في قلب مقديشو.',
      },
      en: {
        city: 'Mogadishu',
        landmark: 'Isbahaysiga Mosque',
        description:
          'Somalia’s largest mosque, built in 1987 with a white dome and minaret, standing on Makka al-Mukarama Road in the heart of Mogadishu.',
      },
      de: {
        city: 'Mogadischu',
        landmark: 'Isbahaysiga-Moschee',
        description:
          'Somalias größte Moschee, 1987 mit weißer Kuppel und Minarett erbaut, an der Makka-al-Mukarama-Straße im Herzen von Mogadischu.',
      },
      ru: {
        city: 'Могадишо',
        landmark: 'Мечеть Исбахайсига',
        description:
          'Крупнейшая мечеть Сомали, построенная в 1987 году с белым куполом и минаретом, на улице Мекки в центре Могадишо.',
      },
      it: {
        city: 'Mogadiscio',
        landmark: 'Moschea Isbahaysiga',
        description:
          'La più grande moschea della Somalia, costruita nel 1987 con cupola e minareto bianchi, sulla via della Mecca nel cuore di Mogadiscio.',
      },
    },
  },
  {
    id: 'tadjourah',
    countryCode: 'DJ',
    timezone: 'Africa/Djibouti',
    latitude: 11.7877,
    longitude: 42.8822,
    image: commons('Lake Assal 1-Djibouti.jpg'),
    credit: credit('Lake Assal 1-Djibouti.jpg'),
    aliases: [
      'تاجورة', 'tadjourah', 'tadjoura', 'جيبوتي', 'djibouti', 'lake assal', 'بحيرة عسل',
      'assal',
    ],
    focus: '60% 50%',
    copy: {
      ar: {
        city: 'تاجورة',
        landmark: 'بحيرة عسل',
        description:
          'بحيرة ملح على عمق ١٥٥ متراً تحت سطح البحر، وهي أخفض نقطة في أفريقيا، تحيط بها قشور الملح البيضاء وتحتضنها تلال بركانية سوداء غرب تاجورة.',
      },
      en: {
        city: 'Tadjourah',
        landmark: 'Lake Assal',
        description:
          'A salt lake 155 metres below sea level, the lowest point in Africa, rimmed with white salt crusts and held between black volcanic hills west of Tadjourah.',
      },
      de: {
        city: 'Tadjoura',
        landmark: 'Assalsee',
        description:
          'Ein Salzsee 155 Meter unter dem Meeresspiegel, der tiefste Punkt Afrikas, umgeben von weißen Salzkrusten und schwarzen Vulkanhügeln westlich von Tadjoura.',
      },
      ru: {
        city: 'Таджура',
        landmark: 'Озеро Ассаль',
        description:
          'Солёное озеро на 155 метров ниже уровня моря, самая низкая точка Африки: белые соляные корки и чёрные вулканические холмы к западу от Таджуры.',
      },
      it: {
        city: 'Tadjoura',
        landmark: 'Lago Assal',
        description:
          'Un lago salato 155 metri sotto il livello del mare, il punto più basso dell’Africa, cinto da croste di sale bianche e colline vulcaniche nere a ovest di Tadjoura.',
      },
    },
  },
  {
    id: 'asmara',
    countryCode: 'ER',
    timezone: 'Africa/Asmara',
    latitude: 15.3229,
    longitude: 38.9332,
    image: commons('Fiat Tagliero building in Asmara.jpg'),
    credit: credit('Fiat Tagliero building in Asmara.jpg'),
    aliases: [
      'أسمرة', 'asmara', 'asmera', 'eritrea', 'إريتريا', 'fiat tagliero', 'فيات تاغلييرو',
    ],
    capital: true,
    focus: '55% 50%',
    copy: {
      ar: {
        city: 'أسمرة',
        landmark: 'مبنى فيات تاغلييرو',
        description:
          'محطة وقود مستقبلية بُنيت عام ١٩٣٨، جناحاها الخرسانيان يمتدان ثمانية عشر متراً بلا دعامات ظاهرة، وهي من رموز وسط أسمرة الحداثي.',
      },
      en: {
        city: 'Asmara',
        landmark: 'Fiat Tagliero',
        description:
          'A 1938 Futurist petrol station whose two concrete wings cantilever eighteen metres with no visible support, one of the icons of Asmara’s modernist centre.',
      },
      de: {
        city: 'Asmara',
        landmark: 'Fiat-Tagliero-Bau',
        description:
          'Eine futuristische Tankstelle von 1938, deren zwei Betonflügel achtzehn Meter ohne sichtbare Stütze auskragen – eine Ikone der modernen Innenstadt von Asmara.',
      },
      ru: {
        city: 'Асмэра',
        landmark: 'ФИАТ Тальеро',
        description:
          'Футуристическая заправка 1938 года: два бетонных крыла выносятся на восемнадцать метров без видимых опор, одна из икон модернистского центра Асмэры.',
      },
      it: {
        city: 'Asmara',
        landmark: 'Fiat Tagliero',
        description:
          'Una stazione di servizio futurista del 1938, le cui due ali di cemento sporgono per diciotto metri senza appoggi visibili: un’icona del centro modernista di Asmara.',
      },
    },
  },
  {
    id: 'mangochi',
    countryCode: 'MW',
    timezone: 'Africa/Blantyre',
    latitude: -14.478,
    longitude: 35.2645,
    image: commons('Dugout on Lake Malawi (14874751077).jpg'),
    credit: credit('Dugout on Lake Malawi (14874751077).jpg'),
    aliases: [
      'مانغوتشي', 'mangochi', 'malawi', 'مالاوي', 'lake malawi', 'بحيرة مالاوي',
      'بحيرة النجوم', 'ليلونغوي', 'lilongwe',
    ],
    focus: '55% 50%',
    copy: {
      ar: {
        city: 'مانغوتشي',
        landmark: 'بحيرة مالاوي',
        description:
          'الشاطئ الجنوبي لبحيرة النجوم، حيث تنطلق القوارب الخشبية عند الغروب، وفي مياهها من أنواع الأسماك أكثر مما في أي بحيرة أخرى على الأرض.',
      },
      en: {
        city: 'Mangochi',
        landmark: 'Lake Malawi',
        description:
          'The southern shore of the “Lake of Stars”, where dugout canoes head out at dusk and the water holds more fish species than any other lake on Earth.',
      },
      de: {
        city: 'Mangochi',
        landmark: 'Malawisee',
        description:
          'Das Südufer des „Sees der Sterne“, wo bei Sonnenuntergang Einbäume hinausfahren und das Wasser mehr Fischarten beherbergt als jeder andere See der Erde.',
      },
      ru: {
        city: 'Мангочи',
        landmark: 'Озеро Малави',
        description:
          'Южный берег «Озера звёзд»: на закате выходят долблёные каноэ, а в воде больше видов рыбы, чем в любом другом озере Земли.',
      },
      it: {
        city: 'Mangochi',
        landmark: 'Lago Malawi',
        description:
          'La sponda sud del «Lago delle stelle», dove all’imbrunire partono le canoe scavate nel legno e l’acqua ospita più specie di pesci di qualsiasi altro lago del mondo.',
      },
    },
  },
  {
    id: 'mbabane',
    countryCode: 'SZ',
    timezone: 'Africa/Mbabane',
    latitude: -26.3054,
    longitude: 31.1367,
    image: commons('Granite monolith.jpg'),
    credit: credit('Granite monolith.jpg'),
    aliases: [
      'مبابان', 'mbabane', 'eswatini', 'swaziland', 'إسواتيني', 'سوازيلاند', 'sibebe',
      'sibebe rock', 'صخرة سيبيري',
    ],
    capital: true,
    focus: '62% 50%',
    copy: {
      ar: {
        city: 'مبابان',
        landmark: 'صخرة سيبيري',
        description:
          'قبة من الجرانيت العاري فوق مبابان، من أكبر كتل الجرانيت المكشوفة على الأرض، يصعد المتنزهون ظهرها الطويل الأملس.',
      },
      en: {
        city: 'Mbabane',
        landmark: 'Sibebe Rock',
        description:
          'A bare granite dome above Mbabane, one of the largest exposed granite masses on Earth, climbed by hikers along its long smooth back.',
      },
      de: {
        city: 'Mbabane',
        landmark: 'Sibebe-Felsen',
        description:
          'Eine nackte Granitkuppel über Mbabane, eine der größten freiliegenden Granitmassen der Erde, über deren langen Rücken Wanderer hinaufsteigen.',
      },
      ru: {
        city: 'Мбабане',
        landmark: 'Скала Сибэбе',
        description:
          'Голый гранитный купол над Мбабане, один из крупнейших открытых гранитных массивов Земли; по его длинной спине поднимаются туристы.',
      },
      it: {
        city: 'Mbabane',
        landmark: 'Roccia di Sibebe',
        description:
          'Una cupola di granito nudo sopra Mbabane, una delle più grandi masse granitiche affioranti della Terra, percorsa lungo il dorso da escursionisti.',
      },
    },
  },
  {
    id: 'semonkong',
    countryCode: 'LS',
    timezone: 'Africa/Maseru',
    latitude: -29.8333,
    longitude: 28.05,
    image: commons('Maletsunyanefalls.JPG'),
    credit: credit('Maletsunyanefalls.JPG'),
    aliases: [
      'سيمونكونغ', 'semonkong', 'lesotho', 'ليسوتو', 'maletsunyane', 'maletsunyane falls',
      'شلالات ماليتسواني', 'ماسيرو', 'maseru',
    ],
    copy: {
      ar: {
        city: 'سيمونكونغ',
        landmark: 'شلالات ماليتسواني',
        description:
          'شلال واحد يهبط ١٩٢ متراً على نهر ماليتسواني قرب سيمونكونغ، من أعلى الشلالات ذات المسقط الواحد في أفريقيا، وفيه أطول هبوط بالحبال تجارياً في العالم.',
      },
      en: {
        city: 'Semonkong',
        landmark: 'Maletsunyane Falls',
        description:
          'A single 192-metre drop on the Maletsunyane river beside Semonkong, one of the highest single falls in Africa, with the world’s highest commercial abseil.',
      },
      de: {
        city: 'Semonkong',
        landmark: 'Maletsunyane-Fälle',
        description:
          'Ein einzelner 192 Meter hoher Fall des Maletsunyane bei Semonkong, einer der höchsten einstufigen Wasserfälle Afrikas, mit dem höchsten kommerziellen Abseilplatz der Erde.',
      },
      ru: {
        city: 'Семонконг',
        landmark: 'Водопад Малетсуньяне',
        description:
          'Водопад высотой 192 метра одним потоком на реке Малетсуньяне близ Семонконга: один из самых высоких одноступенчатых водопадов Африки и самый высокий коммерческий спуск по верёвке в мире.',
      },
      it: {
        city: 'Semonkong',
        landmark: 'Cascate Maletsunyane',
        description:
          'Un salto unico di 192 metri sul fiume Maletsunyane presso Semonkong, una delle cascate a caduta singola più alte dell’Africa, con la più alta discesa in corda doppia commerciale del mondo.',
      },
    },
  },
  {
    id: 'moroni',
    countryCode: 'KM',
    timezone: 'Indian/Comoros',
    latitude: -11.7042,
    longitude: 43.2551,
    image: commons('Moroni Friday Mosque Comoros.jpg'),
    credit: credit('Moroni Friday Mosque Comoros.jpg'),
    aliases: [
      'موروني', 'moroni', 'comoros', 'جزر القمر', 'grande mosquee de moroni',
      'grand mosque of moroni', 'الجامع الكبير في موروني', 'moroni mosque',
    ],
    capital: true,
    focus: '62% 45%',
    copy: {
      ar: {
        city: 'موروني',
        landmark: 'الجامع الكبير في موروني',
        description:
          'الجامع الكبير في مدينة موروني القديمة، أبيض بقبة خضراء، ينتصب بين الميناء وأزقة المدينة الضيقة.',
      },
      en: {
        city: 'Moroni',
        landmark: 'Grande Mosquée de Moroni',
        description:
          'The great Friday mosque of Moroni’s old town, white with a green dome, standing between the harbour and the narrow lanes of the medina.',
      },
      de: {
        city: 'Moroni',
        landmark: 'Große Moschee von Moroni',
        description:
          'Die große Freitagsmoschee der Altstadt von Moroni, weiß mit grüner Kuppel, zwischen Hafen und den engen Gassen der Medina.',
      },
      ru: {
        city: 'Морони',
        landmark: 'Большая мечеть Морони',
        description:
          'Большая пятничная мечеть старого Морони — белая с зелёным куполом, между портом и узкими переулками медины.',
      },
      it: {
        city: 'Moroni',
        landmark: 'Grande Moschea di Moroni',
        description:
          'La grande moschea del venerdì della città vecchia di Moroni, bianca con cupola verde, tra il porto e i vicoli stretti della medina.',
      },
    },
  },
  {
    id: 'la_digue',
    countryCode: 'SC',
    timezone: 'Indian/Mahe',
    latitude: -4.3547,
    longitude: 55.8247,
    image: commons('Anse Source d\'Argent La Digue (4).jpg'),
    credit: credit('Anse Source d\'Argent La Digue (4).jpg'),
    aliases: [
      'لا ديغ', 'la digue', 'ladigue', 'seychelles', 'سيشل', 'anse source d\'argent',
      'anse source dargent', 'شاطئ أنس سورس دارجون', 'فيكتوريا', 'victoria',
    ],
    focus: '55% 50%',
    copy: {
      ar: {
        city: 'لا ديغ',
        landmark: 'شاطئ أنس سورس دارجون',
        description:
          'أشهر شواطئ لا ديغ: رمل فاتح ومياه فيروزية ضحلة وصخور جرانيتية منحوتة تتشبث بها أشجار النخيل.',
      },
      en: {
        city: 'La Digue',
        landmark: 'Anse Source d’Argent',
        description:
          'La Digue’s most photographed beach: pale sand, shallow turquoise water and weathered granite boulders hung with coconut palms.',
      },
      de: {
        city: 'La Digue',
        landmark: 'Anse Source d’Argent',
        description:
          'Der meistfotografierte Strand von La Digue: heller Sand, flaches türkisfarbenes Wasser und verwitterte Granitblöcke zwischen Kokospalmen.',
      },
      ru: {
        city: 'Ла-Диг',
        landmark: 'Пляж Анс-Сурс-д’Аржан',
        description:
          'Самый фотографируемый пляж Ла-Дига: светлый песок, мелкая бирюзовая вода и выветренные гранитные валуны среди кокосовых пальм.',
      },
      it: {
        city: 'La Digue',
        landmark: 'Anse Source d’Argent',
        description:
          'La spiaggia più fotografata di La Digue: sabbia chiara, acqua turchese bassa e massi di granito levigati tra le palme da cocco.',
      },
    },
  },
  {
    id: 'sao_tome',
    countryCode: 'ST',
    timezone: 'Africa/Sao_Tome',
    latitude: 0.3361,
    longitude: 6.7306,
    image: commons('Pico Cão Grande.jpg'),
    credit: credit('Pico Cão Grande.jpg'),
    aliases: [
      'ساو تومي', 'sao tome', 'são tomé', 'sao tome and principe', 'ساو تومي وبرينسيبي',
      'pico cao grande', 'قمة كاو غراندي',
    ],
    capital: true,
    focus: '55% 50%',
    copy: {
      ar: {
        city: 'ساو تومي',
        landmark: 'قمة كاو غراندي',
        description:
          'إبرة بركانية ترتفع ٦٦٣ متراً كبرج من غابة منتزه أوبو الوطني، وهي رمز جزيرة ساو تومي.',
      },
      en: {
        city: 'São Tomé',
        landmark: 'Pico Cão Grande',
        description:
          'A volcanic needle 663 metres high that rises like a tower out of the forest of Obô National Park, and the emblem of São Tomé.',
      },
      de: {
        city: 'São Tomé',
        landmark: 'Pico Cão Grande',
        description:
          'Eine 663 Meter hohe Vulkannadel, die wie ein Turm aus dem Wald des Obô-Nationalparks steigt und als Wahrzeichen São Tomés gilt.',
      },
      ru: {
        city: 'Сан-Томе',
        landmark: 'Пику-Кау-Гранди',
        description:
          'Вулканическая игла высотой 663 метра поднимается башней из леса национального парка Обон — символ Сан-Томе.',
      },
      it: {
        city: 'São Tomé',
        landmark: 'Pico Cão Grande',
        description:
          'Un ago vulcanico alto 663 metri che sorge come una torre dalla foresta del parco nazionale dell’Obô, emblema di São Tomé.',
      },
    },
  },
  {
    id: 'sao_filipe',
    countryCode: 'CV',
    timezone: 'Atlantic/Cape_Verde',
    latitude: 14.8961,
    longitude: -24.4956,
    image: commons('Cape Verde Pico do Fogo wide.jpg'),
    credit: credit('Cape Verde Pico do Fogo wide.jpg'),
    aliases: [
      'ساو فيليبي', 'sao filipe', 'são filipe', 'cape verde', 'cabo verde', 'الرأس الأخضر',
      'pico do fogo', 'بركان بيكو دو فوغو', 'برايا', 'praia',
    ],
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'ساو فيليبي',
        landmark: 'بركان بيكو دو فوغو',
        description:
          'بركان جزيرة فوغو النشط، ٢٨٢٩ متراً من الرماد الأسود فوق كالديرا لا يزال أهلها يزرعون ويصنعون النبيذ داخل الفوهة.',
      },
      en: {
        city: 'São Filipe',
        landmark: 'Pico do Fogo',
        description:
          'The active volcano of Fogo island, 2,829 metres of black ash above a caldera where people still farm and make wine inside the crater.',
      },
      de: {
        city: 'São Filipe',
        landmark: 'Pico do Fogo',
        description:
          'Der aktive Vulkan der Insel Fogo, 2.829 Meter schwarze Asche über einer Caldera, in der die Menschen noch Ackerbau treiben und Wein keltern.',
      },
      ru: {
        city: 'Сан-Филипе',
        landmark: 'Вулкан Пику-ду-Фогу',
        description:
          'Действующий вулкан острова Фогу: 2829 метров чёрного пепла над кальдерой, где до сих пор возделывают землю и делают вино.',
      },
      it: {
        city: 'São Filipe',
        landmark: 'Pico do Fogo',
        description:
          'Il vulcano attivo dell’isola di Fogo, 2.829 metri di cenere nera sopra una caldera dove si coltiva ancora la terra e si fa il vino.',
      },
    },
  },
  {
    id: 'malabo',
    countryCode: 'GQ',
    timezone: 'Africa/Malabo',
    latitude: 3.7523,
    longitude: 8.7742,
    image: commons('Kathedrale Santa Isabel.jpg'),
    credit: credit('Kathedrale Santa Isabel.jpg'),
    aliases: [
      'مالابو', 'malabo', 'equatorial guinea', 'غينيا الاستوائية', 'santa isabel',
      'كاتدرائية سانتا إيزابيل',
    ],
    capital: true,
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'مالابو',
        landmark: 'كاتدرائية سانتا إيزابيل',
        description:
          'كاتدرائية مالابو القوطية الجديدة، بناها الإسبان بين ١٨٩٧ و١٩١٦، وبرجاها التوأمان يعلوان نخيل ساحة الاستقلال.',
      },
      en: {
        city: 'Malabo',
        landmark: 'St. Elizabeth’s Cathedral',
        description:
          'Malabo’s neo-Gothic cathedral, built by the Spanish between 1897 and 1916, with twin spires above the palms of the Plaza de la Independencia.',
      },
      de: {
        city: 'Malabo',
        landmark: 'Kathedrale Santa Isabel',
        description:
          'Die neugotische Kathedrale von Malabo, zwischen 1897 und 1916 von den Spaniern erbaut, mit zwei Türmen über den Palmen der Plaza de la Independencia.',
      },
      ru: {
        city: 'Малабо',
        landmark: 'Собор Святой Изабеллы',
        description:
          'Неоготический собор Малабо, построенный испанцами в 1897–1916 годах: два шпиля над пальмами площади Независимости.',
      },
      it: {
        city: 'Malabo',
        landmark: 'Cattedrale di Santa Isabel',
        description:
          'La cattedrale neogotica di Malabo, costruita dagli spagnoli tra il 1897 e il 1916, con due guglie sopra le palme della Plaza de la Independencia.',
      },
    },
  },
  {
    id: 'ouadane',
    countryCode: 'MR',
    timezone: 'Africa/Nouakchott',
    latitude: 21.0944,
    longitude: -11.5436,
    image: commons('Richat Structure, Mauritania - 6 January 2023 (52616008386).jpg'),
    credit: credit('Richat Structure, Mauritania - 6 January 2023 (52616008386).jpg'),
    aliases: [
      'وادان', 'ouadane', 'mauritania', 'موريتانيا', 'richat', 'richat structure',
      'بنية ريشات', 'عين الصحراء', 'eye of the sahara', 'نواكشوط', 'nouakchott',
    ],
    copy: {
      ar: {
        city: 'وادان',
        landmark: 'بنية ريشات',
        description:
          'حلقة قطرها ٤٠ كيلومتراً في هضبة أدرار قرب وادان، قبة متآكلة يستدل بها رواد الفضاء، تُعرف بعين الصحراء.',
      },
      en: {
        city: 'Ouadane',
        landmark: 'Richat Structure',
        description:
          'A ring 40 kilometres across in the Adrar plateau near Ouadane, an eroded dome that astronauts use as a landmark and call the Eye of the Sahara.',
      },
      de: {
        city: 'Ouadane',
        landmark: 'Richat-Struktur',
        description:
          'Ein Ring von 40 Kilometern Durchmesser im Adrar-Plateau bei Ouadane, eine erodierte Kuppel, die Astronauten als Landmarke nutzen: das Auge der Sahara.',
      },
      ru: {
        city: 'Уадан',
        landmark: 'Структура Ришат',
        description:
          'Кольцо диаметром 40 километров на плато Адрар близ Уадана — размытый купол, по которому ориентируются космонавты, «Око Сахары».',
      },
      it: {
        city: 'Ouadane',
        landmark: 'Struttura di Richat',
        description:
          'Un anello di 40 chilometri sull’altopiano dell’Adrar presso Ouadane, una cupola erosa usata come riferimento dagli astronauti: l’Occhio del Sahara.',
      },
    },
  },
  {
    id: 'mazar_i_sharif',
    countryCode: 'AF',
    timezone: 'Asia/Kabul',
    latitude: 36.7089,
    longitude: 67.1108,
    image: commons('Blue Mosque Courtyard Dusk Wikimedia Commons.jpg'),
    credit: credit('Blue Mosque Courtyard Dusk Wikimedia Commons.jpg'),
    aliases: [
      'مزار شريف', 'mazar-i-sharif', 'mazar i sharif', 'afghanistan', 'أفغانستان',
      'blue mosque', 'المسجد الأزرق', 'shrine of ali', 'ضريح علي', 'كابل', 'kabul',
    ],
    focus: '55% 55%',
    copy: {
      ar: {
        city: 'مزار شريف',
        landmark: 'المسجد الأزرق',
        description:
          'ضريح حضرت علي في مزار شريف، جدرانه مكسوة بالخزف الأزرق، ويجتمع عنده الناس في النوروز، ولا تُطارد حمامه أبداً.',
      },
      en: {
        city: 'Mazar-i-Sharif',
        landmark: 'Blue Mosque',
        description:
          'The shrine of Hazrat Ali in Mazar-i-Sharif, its walls covered in blue tilework, where crowds gather for Nawruz and the doves are never chased away.',
      },
      de: {
        city: 'Masar-e Scharif',
        landmark: 'Blaue Moschee',
        description:
          'Der Schrein von Hazrat Ali in Masar-e Scharif, mit blauen Kacheln verkleidet, wo sich zu Nawruz die Menschen sammeln und die Tauben nie verjagt werden.',
      },
      ru: {
        city: 'Мазари-Шариф',
        landmark: 'Голубая мечеть',
        description:
          'Мавзолей Хазрата Али в Мазари-Шарифе: стены в синих изразцах, сюда собираются на Навруз, а голубей здесь никогда не прогоняют.',
      },
      it: {
        city: 'Mazar-i Sharif',
        landmark: 'Moschea Blu',
        description:
          'Il santuario di Hazrat Ali a Mazar-i Sharif, rivestito di piastrelle blu, dove la folla si raduna per il Nawruz e le colombe non vengono mai scacciate.',
      },
    },
  },
  {
    id: 'port_moresby',
    countryCode: 'PG',
    timezone: 'Pacific/Port_Moresby',
    latitude: -9.4438,
    longitude: 147.18,
    image: commons('Papua New Guinea 1991-039 Parliament House, Port Moresby (33351725760).jpg'),
    credit: credit('Papua New Guinea 1991-039 Parliament House, Port Moresby (33351725760).jpg'),
    aliases: [
      'بورت مورسبي', 'port moresby', 'papua new guinea', 'بابوا غينيا الجديدة',
      'parliament house', 'مبنى البرلمان الوطني',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'بورت مورسبي',
        landmark: 'مبنى البرلمان الوطني',
        description:
          'مبنى برلمان بابوا غينيا الجديدة، افتُتح عام ١٩٨٤، واجهته على شكل بيت الأرواح في منطقة سيبيك ومغطاة بفسيفساء الأنماط التقليدية.',
      },
      en: {
        city: 'Port Moresby',
        landmark: 'National Parliament House',
        description:
          'Papua New Guinea’s parliament, opened in 1984, its facade shaped as a Sepik spirit house and covered in a mosaic of traditional patterns.',
      },
      de: {
        city: 'Port Moresby',
        landmark: 'Nationalparlamentsgebäude',
        description:
          'Das Parlament Papua-Neuguineas, 1984 eröffnet: Die Fassade ist einem Geisterhaus der Sepik nachempfunden und mit einem Mosaik traditioneller Muster bedeckt.',
      },
      ru: {
        city: 'Порт-Морсби',
        landmark: 'Здание парламента',
        description:
          'Парламент Папуа — Новой Гвинеи, открытый в 1984 году: фасад в форме дома духов Сепика покрыт мозаикой традиционных узоров.',
      },
      it: {
        city: 'Port Moresby',
        landmark: 'Palazzo del Parlamento',
        description:
          'Il parlamento di Papua Nuova Guinea, inaugurato nel 1984: la facciata ha la forma di una casa degli spiriti del Sepik ed è coperta da un mosaico di motivi tradizionali.',
      },
    },
  },
  {
    id: 'nadi',
    countryCode: 'FJ',
    timezone: 'Pacific/Fiji',
    latitude: -17.8031,
    longitude: 177.417,
    image: commons('Sri Siva Subramaniya Temple 7, Nadi.jpg'),
    credit: credit('Sri Siva Subramaniya Temple 7, Nadi.jpg'),
    aliases: [
      'نادي', 'nadi', 'fiji', 'فيجي', 'sri siva subramaniya', 'معبد سري سيفا سوبرامانيا',
      'temple', 'سوفا', 'suva',
    ],
    focus: '45% 45%',
    copy: {
      ar: {
        city: 'نادي',
        landmark: 'معبد سري سيفا سوبرامانيا',
        description:
          'أكبر معبد هندوسي في جنوب المحيط الهادئ، في نادي، بوابته البرجية منحوتة وملونة على الطراز الدرافيدي على يد حرفيين من الهند.',
      },
      en: {
        city: 'Nadi',
        landmark: 'Sri Siva Subramaniya Temple',
        description:
          'The largest Hindu temple in the South Pacific, in Nadi, its gopuram carved and painted in the Dravidian manner by craftsmen from India.',
      },
      de: {
        city: 'Nadi',
        landmark: 'Sri-Siva-Subramaniya-Tempel',
        description:
          'Der größte Hindu-Tempel der Südsee in Nadi, dessen Gopuram von Handwerkern aus Indien im dravidischen Stil geschnitzt und bemalt wurde.',
      },
      ru: {
        city: 'Нади',
        landmark: 'Храм Шри Шивы Субрамании',
        description:
          'Крупнейший индуистский храм южной части Тихого океана в Нади: его гопурам вырезан и расписан в дравидийском стиле мастерами из Индии.',
      },
      it: {
        city: 'Nadi',
        landmark: 'Tempio Sri Siva Subramaniya',
        description:
          'Il più grande tempio indù del Pacifico meridionale, a Nadi, il cui gopuram è intagliato e dipinto in stile dravidico da artigiani indiani.',
      },
    },
  },
  {
    id: 'honiara',
    countryCode: 'SB',
    timezone: 'Pacific/Guadalcanal',
    latitude: -9.428,
    longitude: 159.95,
    image: commons('Bonegi Beach.jpg'),
    credit: credit('Bonegi Beach.jpg'),
    aliases: [
      'هونيارا', 'honiara', 'solomon islands', 'جزر سولومون', 'bonegi', 'bonegi beach',
      'شاطئ بونغي', 'حطام',
    ],
    capital: true,
    focus: '55% 60%',
    copy: {
      ar: {
        city: 'هونيارا',
        landmark: 'شاطئ بونغي',
        description:
          'سفينتا نقل يابانيتان غرقتا عام ١٩٤٢ في مياه ضحلة قبالة شاطئ بونغي، وصارتا موقع غوص بين شعاب مرجانية نبتت على الحطام.',
      },
      en: {
        city: 'Honiara',
        landmark: 'Bonegi Beach',
        description:
          'Two Japanese transports sunk in 1942 lie in shallow water just off Bonegi beach, now a snorkelling site with coral growing over the wrecks.',
      },
      de: {
        city: 'Honiara',
        landmark: 'Bonegi-Strand',
        description:
          'Zwei 1942 versenkte japanische Transporter liegen im Flachwasser vor dem Bonegi-Strand, heute ein Schnorchelplatz mit Korallen auf den Wracks.',
      },
      ru: {
        city: 'Хониара',
        landmark: 'Пляж Бонэги',
        description:
          'Два японских транспорта, потопленных в 1942 году, лежат на мелководье у пляжа Бонэги — теперь здесь ныряют с маской среди кораллов на обломках.',
      },
      it: {
        city: 'Honiara',
        landmark: 'Spiaggia di Bonegi',
        description:
          'Due trasporti giapponesi affondati nel 1942 giacciono in acque basse davanti alla spiaggia di Bonegi, oggi meta di snorkeling con coralli sui relitti.',
      },
    },
  },
  {
    id: 'tanna',
    countryCode: 'VU',
    timezone: 'Pacific/Efate',
    latitude: -19.55,
    longitude: 169.267,
    image: commons('Lava trails at Mount Yasur Volcano, Tanna, Vanuatu (49181693888).jpg'),
    credit: credit('Lava trails at Mount Yasur Volcano, Tanna, Vanuatu (49181693888).jpg'),
    aliases: [
      'تانا', 'tanna', 'tanna island', 'vanuatu', 'فانواتو', 'mount yasur', 'yasur',
      'بركان جبل ياسور', 'بورت فيلا', 'port vila',
    ],
    copy: {
      ar: {
        city: 'تانا',
        landmark: 'بركان جبل ياسور',
        description:
          'بركان بارتفاع ٣٦١ متراً في تانا لا يهدأ، يمكن الوصول إلى حافته سيراً، ويقذف حممه في أقواس بعد حلول الظلام.',
      },
      en: {
        city: 'Tanna',
        landmark: 'Mount Yasur',
        description:
          'A 361-metre volcano on Tanna in constant eruption, its crater rim reachable on foot and its lava thrown up in arcs after dark.',
      },
      de: {
        city: 'Tanna',
        landmark: 'Yasur',
        description:
          'Ein 361 Meter hoher Vulkan auf Tanna in ständigem Ausbruch, dessen Kraterrand zu Fuß erreichbar ist und der nach Einbruch der Dunkelheit Lava in Bögen schleudert.',
      },
      ru: {
        city: 'Танна',
        landmark: 'Вулкан Ясур',
        description:
          'Вулкан высотой 361 метр на Танне в постоянном извержении: к кромке кратера можно подняться пешком, а после темноты лава летит дугами.',
      },
      it: {
        city: 'Tanna',
        landmark: 'Monte Yasur',
        description:
          'Un vulcano di 361 metri a Tanna in eruzione continua, il cui bordo del cratere si raggiunge a piedi e che dopo il buio lancia la lava in archi.',
      },
    },
  },
  {
    id: 'lotofaga',
    countryCode: 'WS',
    timezone: 'Pacific/Apia',
    latitude: -14.0333,
    longitude: -171.567,
    image: commons('To Sua Ocean Trench - Lotofaga village - Samoa.jpg'),
    credit: credit('To Sua Ocean Trench - Lotofaga village - Samoa.jpg'),
    aliases: [
      'لوتوفاغا', 'lotofaga', 'samoa', 'ساموا', 'to sua', 'to sua ocean trench', 'حفرة تو سوا',
      'أبيا', 'apia',
    ],
    focus: '60% 50%',
    copy: {
      ar: {
        city: 'لوتوفاغا',
        landmark: 'حفرة تو سوا',
        description:
          'حفرة بحرية بعمق ثلاثين متراً في حقل حمم في لوتوفاغا، يُنزل إليها بسلم خشبي طويل، وماؤها أخضر صافٍ يتصل بالمحيط عبر كهف.',
      },
      en: {
        city: 'Lotofaga',
        landmark: 'To Sua Ocean Trench',
        description:
          'A thirty-metre-deep sea trench in a lava field at Lotofaga, reached by a long wooden ladder, its water clear green and linked to the ocean by a cave.',
      },
      de: {
        city: 'Lotofaga',
        landmark: 'To Sua Ocean Trench',
        description:
          'Ein dreißig Meter tiefer Meeresschacht in einem Lavafeld bei Lotofaga, über eine lange Holzleiter erreichbar, dessen grünes Wasser durch eine Höhle mit dem Ozean verbunden ist.',
      },
      ru: {
        city: 'Лотофага',
        landmark: 'Океанская воронка То-Суа',
        description:
          'Тридцатиметровая морская воронка в лавовом поле у Лотофаги: вниз ведёт длинная деревянная лестница, а зелёная вода соединена с океаном пещерой.',
      },
      it: {
        city: 'Lotofaga',
        landmark: 'To Sua Ocean Trench',
        description:
          'Una fossa marina profonda trenta metri in un campo di lava a Lotofaga, raggiunta con una lunga scala di legno, con acqua verde e limpida collegata all’oceano da una grotta.',
      },
    },
  },
  {
    id: 'nukualofa',
    countryCode: 'TO',
    timezone: 'Pacific/Tongatapu',
    latitude: -21.1394,
    longitude: -175.202,
    image: commons('Royal Palace, Nuku\'alofa, Nov 18.jpg'),
    credit: credit('Royal Palace, Nuku\'alofa, Nov 18.jpg'),
    aliases: [
      'نوكو ألوفا', 'nukualofa', 'nuku\'alofa', 'tonga', 'تونغا', 'royal palace',
      'القصر الملكي', 'palace',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'نوكو ألوفا',
        landmark: 'القصر الملكي',
        description:
          'قصر تونغا الملكي الخشبي في نوكو ألوفا، بُني عام ١٨٦٧، بسقف أحمر وشرفات بيضاء تطل على البحيرة.',
      },
      en: {
        city: 'Nukuʻalofa',
        landmark: 'Royal Palace',
        description:
          'The wooden palace of Tonga’s kings in Nukuʻalofa, built in 1867, with a red roof and white verandas facing the lagoon.',
      },
      de: {
        city: 'Nukuʻalofa',
        landmark: 'Königspalast',
        description:
          'Der hölzerne Palast der Könige von Tonga in Nukuʻalofa, 1867 erbaut, mit rotem Dach und weißen Veranden zur Lagune.',
      },
      ru: {
        city: 'Нукуалофа',
        landmark: 'Королевский дворец',
        description:
          'Деревянный дворец королей Тонги в Нукуалофе, построенный в 1867 году: красная крыша и белые веранды лицом к лагуне.',
      },
      it: {
        city: 'Nukuʻalofa',
        landmark: 'Palazzo Reale',
        description:
          'Il palazzo di legno dei re di Tonga a Nukuʻalofa, costruito nel 1867, con tetto rosso e verande bianche rivolte alla laguna.',
      },
    },
  },
  {
    id: 'tarawa',
    countryCode: 'KI',
    timezone: 'Pacific/Tarawa',
    latitude: 1.3295,
    longitude: 172.978,
    image: commons('Kiribatiparliament.jpg'),
    credit: credit('Kiribatiparliament.jpg'),
    aliases: [
      'تاراوا', 'tarawa', 'south tarawa', 'kiribati', 'كيريباتي', 'parliament of kiribati',
      'برلمان كيريباتي',
    ],
    capital: true,
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'تاراوا',
        landmark: 'برلمان كيريباتي',
        description:
          'برلمان كيريباتي في بيريكي، بُني على هيئة مانهاب، بيت الاجتماع الكبير في الجزر، بسقفه القشّي الشاهق.',
      },
      en: {
        city: 'Tarawa',
        landmark: 'Kiribati Parliament',
        description:
          'Kiribati’s parliament in Bairiki, built in the form of a maneaba, the great island meeting house, with a steep thatched roof.',
      },
      de: {
        city: 'Tarawa',
        landmark: 'Parlament von Kiribati',
        description:
          'Das Parlament von Kiribati in Bairiki, erbaut in der Form eines Maneaba, des großen Versammlungshauses der Inseln, mit steilem Reetdach.',
      },
      ru: {
        city: 'Тарава',
        landmark: 'Парламент Кирибати',
        description:
          'Парламент Кирибати в Баирики, построенный в форме манеабы — большого островного дома собраний, с крутой соломенной крышей.',
      },
      it: {
        city: 'Tarawa',
        landmark: 'Parlamento di Kiribati',
        description:
          'Il parlamento di Kiribati a Bairiki, costruito a forma di maneaba, la grande casa delle riunioni delle isole, con il tetto di paglia ripido.',
      },
    },
  },
  {
    id: 'funafuti',
    countryCode: 'TV',
    timezone: 'Pacific/Funafuti',
    latitude: -8.5243,
    longitude: 179.194,
    image: commons('Tuvalu - Funafuti - Beach.jpg'),
    credit: credit('Tuvalu - Funafuti - Beach.jpg'),
    aliases: [
      'فونافوتي', 'funafuti', 'tuvalu', 'توفالو', 'funafuti lagoon', 'بحيرة فونافوتي',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'فونافوتي',
        landmark: 'بحيرة فونافوتي',
        description:
          'البحيرة داخل جزيرة فونافوتي المرجانية، ممر عريض من مياه فاتحة بين الحيد المرجاني والقرى، تدخله القوارب وسفن الشحن.',
      },
      en: {
        city: 'Funafuti',
        landmark: 'Funafuti Lagoon',
        description:
          'The lagoon inside Funafuti atoll, a wide channel of pale water between the reef and the villages, where canoes and the odd cargo ship come in.',
      },
      de: {
        city: 'Funafuti',
        landmark: 'Lagune von Funafuti',
        description:
          'Die Lagune im Funafuti-Atoll, ein breiter, heller Wasserweg zwischen Riff und Dörfern, in den Kanoes und gelegentlich ein Frachtschiff einlaufen.',
      },
      ru: {
        city: 'Фунафути',
        landmark: 'Лагуна Фунафути',
        description:
          'Лагуна внутри атолла Фунафути — широкий светлый пролив между рифом и деревнями, куда заходят каноэ и редкие грузовые суда.',
      },
      it: {
        city: 'Funafuti',
        landmark: 'Laguna di Funafuti',
        description:
          'La laguna dentro l’atollo di Funafuti, un ampio canale d’acqua chiara tra la barriera e i villaggi, dove entrano canoe e qualche nave cargo.',
      },
    },
  },
  {
    id: 'buada',
    countryCode: 'NR',
    timezone: 'Pacific/Nauru',
    latitude: -0.5333,
    longitude: 166.917,
    image: commons('NauruBuada077.jpg'),
    credit: credit('NauruBuada077.jpg'),
    aliases: [
      'بوادا', 'buada', 'nauru', 'ناورو', 'buada lagoon', 'بحيرة بوادا', 'yaren', 'يارين',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'بوادا',
        landmark: 'بحيرة بوادا',
        description:
          'بحيرة مالحة في وسط ناورو، تحيط بها أشجار النخيل وحدائق الخضروات، وهي المسطح المائي الوحيد في الجزيرة.',
      },
      en: {
        city: 'Buada',
        landmark: 'Buada Lagoon',
        description:
          'A brackish lagoon in the middle of Nauru, ringed by coconut palms and vegetable plots, the only standing water on the island.',
      },
      de: {
        city: 'Buada',
        landmark: 'Buada-Lagune',
        description:
          'Eine Brackwasserlagune mitten auf Nauru, umringt von Kokospalmen und Gemüsebeeten, das einzige stehende Gewässer der Insel.',
      },
      ru: {
        city: 'Буада',
        landmark: 'Лагуна Буада',
        description:
          'Солоноватая лагуна в центре Науру, окружённая кокосовыми пальмами и огородами, единственный водоём острова.',
      },
      it: {
        city: 'Buada',
        landmark: 'Laguna di Buada',
        description:
          'Una laguna salmastra al centro di Nauru, circondata da palme da cocco e orti, l’unica acqua ferma dell’isola.',
      },
    },
  },
  {
    id: 'koror',
    countryCode: 'PW',
    timezone: 'Pacific/Palau',
    latitude: 7.3426,
    longitude: 134.479,
    image: commons('Rock-Islands-Palau-1-2016-sea-view-Luka-Peternel.jpg'),
    credit: credit('Rock-Islands-Palau-1-2016-sea-view-Luka-Peternel.jpg'),
    aliases: [
      'كورور', 'koror', 'palau', 'بالاو', 'rock islands', 'الجزر الصخرية', 'ngerulmud',
      'نغيرولمود',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'كورور',
        landmark: 'الجزر الصخرية',
        description:
          'الجزر الصخرية قبالة كورور: جزر جيرية على شكل فطر تكسوها الغابة، داخل بحيرة مياهها خضراء فاتحة.',
      },
      en: {
        city: 'Koror',
        landmark: 'Rock Islands',
        description:
          'The Rock Islands off Koror: mushroom-shaped limestone islets under forest, standing in a lagoon of pale green water.',
      },
      de: {
        city: 'Koror',
        landmark: 'Rock Islands',
        description:
          'Die Rock Islands vor Koror: pilzförmige Kalkinseln mit Wald, in einer Lagune aus hellgrünem Wasser.',
      },
      ru: {
        city: 'Корор',
        landmark: 'Скалистые острова',
        description:
          'Скалистые острова у Корор: грибовидные известняковые островки под лесом, в лагуне бледно-зелёной воды.',
      },
      it: {
        city: 'Koror',
        landmark: 'Rock Islands',
        description:
          'Le Rock Islands al largo di Koror: isolotti calcarei a forma di fungo ricoperti di foresta, in una laguna d’acqua verde chiaro.',
      },
    },
  },
  {
    id: 'majuro',
    countryCode: 'MH',
    timezone: 'Pacific/Majuro',
    latitude: 7.1164,
    longitude: 171.186,
    image: commons('Alele Museum Aussenansicht.JPG'),
    credit: credit('Alele Museum Aussenansicht.JPG'),
    aliases: [
      'ماجورو', 'majuro', 'marshall islands', 'جزر مارشال', 'alele', 'alele museum',
      'متحف أليلي',
    ],
    capital: true,
    focus: '55% 50%',
    copy: {
      ar: {
        city: 'ماجورو',
        landmark: 'متحف أليلي',
        description:
          'متحف أليلي والمكتبة العامة في ماجورو، المتحف الوطني الصغير للبلاد، وحافظ خرائط الملاحة المارشالية وصورها.',
      },
      en: {
        city: 'Majuro',
        landmark: 'Alele Museum',
        description:
          'The Alele Museum and Public Library in Majuro, the country’s small national museum, keeper of Marshallese navigation charts and photographs.',
      },
      de: {
        city: 'Majuro',
        landmark: 'Alele-Museum',
        description:
          'Das Alele Museum und die Bibliothek in Majuro, das kleine Nationalmuseum des Landes, Hüter der marshallischen Navigationskarten und Fotografien.',
      },
      ru: {
        city: 'Маджуро',
        landmark: 'Музей Алеле',
        description:
          'Музей Алеле и публичная библиотека в Маджуро — небольшой национальный музей страны, хранитель маршалльских навигационных карт и фотографий.',
      },
      it: {
        city: 'Majuro',
        landmark: 'Museo Alele',
        description:
          'L’Alele Museum e la biblioteca pubblica a Majuro, il piccolo museo nazionale del paese, custode delle carte nautiche e delle fotografie marshallesi.',
      },
    },
  },
  {
    id: 'pohnpei',
    countryCode: 'FM',
    timezone: 'Pacific/Pohnpei',
    latitude: 6.9167,
    longitude: 158.15,
    image: commons('Nan Madol, Pohnpei.jpg'),
    credit: credit('Nan Madol, Pohnpei.jpg'),
    aliases: [
      'بونبي', 'pohnpei', 'micronesia', 'ميكرونيزيا', 'nan madol', 'نان مادول', 'palikir',
      'باليكير',
    ],
    copy: {
      ar: {
        city: 'بونبي',
        landmark: 'نان مادول',
        description:
          'نان مادول قبالة بونبي: مدينة من أعمدة البازلت المكوّمة على جزر صغيرة وقنوات، بُنيت بين القرنين الثاني عشر والسابع عشر وغمرتها الأشجار.',
      },
      en: {
        city: 'Pohnpei',
        landmark: 'Nan Madol',
        description:
          'Nan Madol off Pohnpei: a city of basalt logs piled into islets and canals, built between the twelfth and seventeenth centuries and now overgrown.',
      },
      de: {
        city: 'Pohnpei',
        landmark: 'Nan Madol',
        description:
          'Nan Madol vor Pohnpei: eine Stadt aus Basaltstämmen, zu Inselchen und Kanälen aufgeschichtet, zwischen dem 12. und 17. Jahrhundert erbaut und heute überwachsen.',
      },
      ru: {
        city: 'Понпеи',
        landmark: 'Нан-Мадол',
        description:
          'Нан-Мадол у Понпеи: город из базальтовых брёвен, сложенных в островки и каналы, построенный между XII и XVII веками и заросший.',
      },
      it: {
        city: 'Pohnpei',
        landmark: 'Nan Madol',
        description:
          'Nan Madol al largo di Pohnpei: una città di tronchi di basalto ammassati in isolotti e canali, costruita tra il XII e il XVII secolo e oggi invasa dalla vegetazione.',
      },
    },
  },
  {
    id: 'santo_domingo',
    countryCode: 'DO',
    timezone: 'America/Santo_Domingo',
    latitude: 18.473,
    longitude: -69.884,
    image: commons('Calle las Damas, Santo Domingo, Zona Colonial.jpg'),
    credit: credit('Calle las Damas, Santo Domingo, Zona Colonial.jpg'),
    aliases: [
      'سانتو دومينغو', 'santo domingo', 'dominican republic', 'جمهورية الدومينيكان',
      'zona colonial', 'الحي الاستعماري', 'calle las damas',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'سانتو دومينغو',
        landmark: 'الحي الاستعماري',
        description:
          'شارع كايي لاس داماس في حي سانتو دومينغو الاستعماري، أقدم شوارع أول مدينة أوروبية في الأمريكتين، تصطف عليه البيوت الحجرية.',
      },
      en: {
        city: 'Santo Domingo',
        landmark: 'Zona Colonial',
        description:
          'Calle Las Damas in Santo Domingo’s colonial quarter, the oldest street of the first European city in the Americas, lined with stone houses.',
      },
      de: {
        city: 'Santo Domingo',
        landmark: 'Kolonialviertel',
        description:
          'Die Calle Las Damas im Kolonialviertel von Santo Domingo, die älteste Straße der ersten europäischen Stadt Amerikas, gesäumt von Steinhäusern.',
      },
      ru: {
        city: 'Санто-Доминго',
        landmark: 'Колониальный квартал',
        description:
          'Улица Калье-лас-Дамас в колониальном квартале Санто-Доминго — старейшая улица первого европейского города Америки, с каменными домами.',
      },
      it: {
        city: 'Santo Domingo',
        landmark: 'Zona Colonial',
        description:
          'Calle Las Damas nel quartiere coloniale di Santo Domingo, la via più antica della prima città europea delle Americhe, fiancheggiata da case di pietra.',
      },
    },
  },
  {
    id: 'ocho_rios',
    countryCode: 'JM',
    timezone: 'America/Jamaica',
    latitude: 18.4074,
    longitude: -77.1031,
    image: commons('Jamaica Ocho Rios Dunn\'s River Falls 1.jpg'),
    credit: credit('Jamaica Ocho Rios Dunn\'s River Falls 1.jpg'),
    aliases: [
      'أوتشو ريوس', 'ocho rios', 'jamaica', 'جامايكا', 'dunn\'s river falls', 'شلالات نهر دن',
      'كينغستون', 'kingston',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'أوتشو ريوس',
        landmark: 'شلالات نهر دن',
        description:
          'شلالات نهر دن قرب أوتشو ريوس: مدرجات من الحجر الجيري يهبط عليها النهر، يصعدها الزوار متشابكي الأيدي.',
      },
      en: {
        city: 'Ocho Rios',
        landmark: 'Dunn’s River Falls',
        description:
          'Dunn’s River Falls above Ocho Rios: a stair of limestone terraces the river drops over, climbed in a chain of hands by visitors.',
      },
      de: {
        city: 'Ocho Rios',
        landmark: 'Dunn’s River Falls',
        description:
          'Die Dunn’s River Falls bei Ocho Rios: Kalksteinterrassen, über die der Fluss fällt, die Besucher Hand in Hand hinaufsteigen.',
      },
      ru: {
        city: 'Очо-Риос',
        landmark: 'Водопад Даннс-Ривер',
        description:
          'Водопад Даннс-Ривер у Очо-Риос: известняковые террасы, по которым падает река; посетители поднимаются по ним цепочкой.',
      },
      it: {
        city: 'Ocho Rios',
        landmark: 'Dunn’s River Falls',
        description:
          'Le Dunn’s River Falls sopra Ocho Rios: terrazze calcaree su cui cade il fiume, che i visitatori salgono tenendosi per mano.',
      },
    },
  },
  {
    id: 'havana_capitolio',
    countryCode: 'CU',
    timezone: 'America/Havana',
    latitude: 23.136,
    longitude: -82.359,
    image: commons('National-Capitol-and-classic-cars-in-Havana-Cuba-225-031-061A.jpg'),
    credit: credit('National-Capitol-and-classic-cars-in-Havana-Cuba-225-031-061A.jpg'),
    aliases: [
      'هافانا', 'havana', 'habana', 'cuba', 'كوبا', 'el capitolio', 'الكابيتوليو', 'capitolio',
    ],
    capital: true,
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'هافانا',
        landmark: 'الكابيتوليو',
        description:
          'كابيتوليو هافانا، اكتمل عام ١٩٢٩ بقبة أعلى من قبة كابيتول واشنطن، وتقف أمامه السيارات الأمريكية المطلية في باسيو ديل برادو.',
      },
      en: {
        city: 'Havana',
        landmark: 'El Capitolio',
        description:
          'Havana’s Capitolio, finished in 1929 with a dome higher than the one in Washington, faced by painted American cars on the Paseo del Prado.',
      },
      de: {
        city: 'Havanna',
        landmark: 'El Capitolio',
        description:
          'Das Capitolio in Havanna, 1929 vollendet, mit einer Kuppel höher als die in Washington, davor bunte amerikanische Oldtimer auf dem Paseo del Prado.',
      },
      ru: {
        city: 'Гавана',
        landmark: 'Капитолий',
        description:
          'Капитолий Гаваны, достроенный в 1929 году: купол выше вашингтонского, перед ним — раскрашенные американские автомобили на Пасео-дель-Прадо.',
      },
      it: {
        city: 'L’Avana',
        landmark: 'El Capitolio',
        description:
          'Il Capitolio de L’Avana, terminato nel 1929 con una cupola più alta di quella di Washington, davanti alle auto americane dipinte sul Paseo del Prado.',
      },
    },
  },
  {
    id: 'nassau',
    countryCode: 'BS',
    timezone: 'America/Nassau',
    latitude: 25.074,
    longitude: -77.34,
    image: commons('Bahamas - Nassau, Queens Staircase - panoramio.jpg'),
    credit: credit('Bahamas - Nassau, Queens Staircase - panoramio.jpg'),
    aliases: [
      'ناساو', 'nassau', 'bahamas', 'الباهاما', 'queen\'s staircase', 'queens staircase',
      'سلّم الملكة', 'سلالم الملكة',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'ناساو',
        landmark: 'سلّم الملكة',
        description:
          'ست وستون درجة نُحتت في الحجر الجيري يدوياً في تسعينيات القرن الثامن عشر، ممر بارد من الصخر وأشجار التين يصعد من ناساو.',
      },
      en: {
        city: 'Nassau',
        landmark: 'Queen’s Staircase',
        description:
          'Sixty-six steps cut into the limestone by hand in the 1790s, a cool corridor of rock and fig trees that leads up out of Nassau.',
      },
      de: {
        city: 'Nassau',
        landmark: 'Queen’s Staircase',
        description:
          'Sechsundsechzig in den 1790er-Jahren von Hand in den Kalkstein gehauene Stufen, ein kühler Gang aus Fels und Feigenbäumen über Nassau.',
      },
      ru: {
        city: 'Нассау',
        landmark: 'Лестница королевы',
        description:
          'Шестьдесят шесть ступеней, вырубленных в известняке вручную в 1790-х: прохладный коридор из камня и фикусов над Нассау.',
      },
      it: {
        city: 'Nassau',
        landmark: 'Queen’s Staircase',
        description:
          'Sessantasei gradini scavati a mano nel calcare negli anni Novanta del Settecento, un corridoio fresco di roccia e fichi che sale da Nassau.',
      },
    },
  },
  {
    id: 'milot',
    countryCode: 'HT',
    timezone: 'America/Port-au-Prince',
    latitude: 19.6167,
    longitude: -72.2167,
    image: commons('Citadelle Laferrière Aerial View.jpg'),
    credit: credit('Citadelle Laferrière Aerial View.jpg'),
    aliases: [
      'ميلو', 'milot', 'haiti', 'هايتي', 'citadelle laferriere', 'citadelle', 'قلعة لافيريير',
      'بورت أو برانس', 'port-au-prince',
    ],
    copy: {
      ar: {
        city: 'ميلو',
        landmark: 'قلعة لافيريير',
        description:
          'قلعة لافيريير على جبلها فوق ميلو، أكبر حصن في الأمريكتين، بُني بعد ١٨٠٤ في وجه عودة الفرنسيين.',
      },
      en: {
        city: 'Milot',
        landmark: 'Citadelle Laferrière',
        description:
          'The Citadelle Laferrière on its mountain above Milot, the largest fortress in the Americas, built after 1804 against a French return.',
      },
      de: {
        city: 'Milot',
        landmark: 'Citadelle Laferrière',
        description:
          'Die Citadelle Laferrière auf ihrem Berg über Milot, die größte Festung Amerikas, nach 1804 gegen eine Rückkehr der Franzosen errichtet.',
      },
      ru: {
        city: 'Мило',
        landmark: 'Крепость Лаферьер',
        description:
          'Крепость Лаферьер на горе над Мило — крупнейшая крепость Америки, построенная после 1804 года на случай возвращения французов.',
      },
      it: {
        city: 'Milot',
        landmark: 'Citadelle Laferrière',
        description:
          'La Citadelle Laferrière sulla sua montagna sopra Milot, la più grande fortezza delle Americhe, costruita dopo il 1804 contro un ritorno dei francesi.',
      },
    },
  },
  {
    id: 'pigeon_point',
    countryCode: 'TT',
    timezone: 'America/Port_of_Spain',
    latitude: 11.15,
    longitude: -60.8333,
    image: commons('Pigeon Point beach.jpg'),
    credit: credit('Pigeon Point beach.jpg'),
    aliases: [
      'بيجن بوينت', 'pigeon point', 'trinidad and tobago', 'ترينيداد وتوباغو', 'tobago',
      'توباغو', 'بورت أوف سبين', 'port of spain',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'بيجن بوينت',
        landmark: 'شاطئ بيجن بوينت',
        description:
          'بيجن بوينت في توباغو: رصيف طويل مسقوف بالقش فوق مياه ضحلة، ورمال بيضاء وبحر أخضر فاتح من حيد بوكو.',
      },
      en: {
        city: 'Pigeon Point',
        landmark: 'Pigeon Point Beach',
        description:
          'Pigeon Point on Tobago: a long jetty of thatch over shallow water, white sand and the pale green sea of the Buccoo Reef.',
      },
      de: {
        city: 'Pigeon Point',
        landmark: 'Pigeon Point',
        description:
          'Pigeon Point auf Tobago: ein langer, mit Stroh gedeckter Steg über flachem Wasser, weißer Sand und das hellgrüne Meer des Buccoo-Riffs.',
      },
      ru: {
        city: 'Пиджен-Пойнт',
        landmark: 'Пляж Пиджен-Пойнт',
        description:
          'Пиджен-Пойнт на Тобаго: длинный причал под соломенной крышей над мелководьем, белый песок и бледно-зелёное море рифа Бакку.',
      },
      it: {
        city: 'Pigeon Point',
        landmark: 'Pigeon Point',
        description:
          'Pigeon Point a Tobago: un lungo pontile coperto di paglia su acque basse, sabbia bianca e il mare verde chiaro della barriera di Buccoo.',
      },
    },
  },
  {
    id: 'bridgetown',
    countryCode: 'BB',
    timezone: 'America/Barbados',
    latitude: 13.097,
    longitude: -59.613,
    image: commons('Barbados - Bridgetown Parliament - panoramio.jpg'),
    credit: credit('Barbados - Bridgetown Parliament - panoramio.jpg'),
    aliases: [
      'بريدجتاون', 'bridgetown', 'barbados', 'بربادوس', 'parliament buildings',
      'مباني البرلمان',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'بريدجتاون',
        landmark: 'مباني البرلمان',
        description:
          'مباني البرلمان القوطية الجديدة في بريدجتاون على شارع برود، وبرج ساعة يعلو الساحة العامة.',
      },
      en: {
        city: 'Bridgetown',
        landmark: 'Parliament Buildings',
        description:
          'The neo-Gothic Parliament Buildings of Barbados on Broad Street in Bridgetown, with a clock tower over the public square.',
      },
      de: {
        city: 'Bridgetown',
        landmark: 'Parlamentsgebäude',
        description:
          'Die neugotischen Parliament Buildings von Barbados in der Broad Street in Bridgetown, mit einem Uhrturm über dem öffentlichen Platz.',
      },
      ru: {
        city: 'Бриджтаун',
        landmark: 'Здания парламента',
        description:
          'Неоготические здания парламента Барбадоса на Брод-стрит в Бриджтауне с часовой башней над площадью.',
      },
      it: {
        city: 'Bridgetown',
        landmark: 'Edifici del Parlamento',
        description:
          'Gli edifici neogotici del Parlamento di Barbados su Broad Street a Bridgetown, con la torre dell’orologio sopra la piazza.',
      },
    },
  },
  {
    id: 'st_georges',
    countryCode: 'GD',
    timezone: 'America/Grenada',
    latitude: 12.056,
    longitude: -61.749,
    image: commons('Grand Anse Beach Grenada.jpg'),
    credit: credit('Grand Anse Beach Grenada.jpg'),
    aliases: [
      'سانت جورج', 'st george\'s', 'saint george\'s', 'grenada', 'غرينادا', 'grand anse',
      'خليج غراند آنس',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'سانت جورج',
        landmark: 'خليج غراند آنس',
        description:
          'خليج غراند آنس قرب سانت جورج: أميال من الرمال خلف حيد مرجاني، وهو الشاطئ الذي تعتبره غرينادا حديقتها الأمامية.',
      },
      en: {
        city: 'St. George’s',
        landmark: 'Grand Anse Beach',
        description:
          'Grand Anse Bay outside St. George’s: two miles of sand behind a reef, the beach Grenada treats as its front garden.',
      },
      de: {
        city: 'St. George’s',
        landmark: 'Grand Anse',
        description:
          'Die Grand Anse Bay vor St. George’s: Kilometer um Kilometer Sand hinter einem Riff, der Strand, den Grenada als Vorgarten betrachtet.',
      },
      ru: {
        city: 'Сент-Джорджес',
        landmark: 'Пляж Гранд-Анс',
        description:
          'Бухта Гранд-Анс у Сент-Джорджеса: километры песка за рифом — пляж, который Гренада считает своим парадным садом.',
      },
      it: {
        city: 'St. George’s',
        landmark: 'Grand Anse',
        description:
          'La baia di Grand Anse fuori St. George’s: chilometri di sabbia dietro una barriera, la spiaggia che Grenada considera il suo giardino.',
      },
    },
  },
  {
    id: 'soufriere',
    countryCode: 'LC',
    timezone: 'America/St_Lucia',
    latitude: 13.856,
    longitude: -61.058,
    image: commons('Soufriere town and the Pitons, Saint Lucia (wide view).jpg'),
    credit: credit('Soufriere town and the Pitons, Saint Lucia (wide view).jpg'),
    aliases: [
      'سوفريير', 'soufriere', 'soufrière', 'saint lucia', 'سانت لوسيا', 'the pitons', 'pitons',
      'البيتون', 'كاستريس', 'castries',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'سوفريير',
        landmark: 'قمتا البيتون',
        description:
          'البيتون فوق سوفريير: برجان بركانيان، غروس وبيتي، يصعدان من البحر مباشرة إلى ٧٧٠ و٧٤٣ متراً.',
      },
      en: {
        city: 'Soufrière',
        landmark: 'The Pitons',
        description:
          'The Pitons above Soufrière: two volcanic spires, Gros and Petit, rising straight out of the sea to 770 and 743 metres.',
      },
      de: {
        city: 'Soufrière',
        landmark: 'Die Pitons',
        description:
          'Die Pitons über Soufrière: zwei Vulkankegel, Gros und Petit, die 770 und 743 Meter hoch direkt aus dem Meer steigen.',
      },
      ru: {
        city: 'Суфриер',
        landmark: 'Питоны',
        description:
          'Питоны над Суфриером: два вулканических пика, Гро-Питон и Пти-Питон, поднимаются прямо из моря на 770 и 743 метра.',
      },
      it: {
        city: 'Soufrière',
        landmark: 'I Pitons',
        description:
          'I Pitons sopra Soufrière: due guglie vulcaniche, Gros e Petit, che salgono dritte dal mare fino a 770 e 743 metri.',
      },
    },
  },
  {
    id: 'laudat',
    countryCode: 'DM',
    timezone: 'America/Dominica',
    latitude: 15.3333,
    longitude: -61.3333,
    image: commons('Dominica Boiling Lake.jpg'),
    credit: credit('Dominica Boiling Lake.jpg'),
    aliases: [
      'لودا', 'laudat', 'dominica', 'دومينيكا', 'boiling lake', 'بحيرة الغليان', 'roseau',
      'روزو',
    ],
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'لودا',
        landmark: 'بحيرة الغليان',
        description:
          'بحيرة الغليان في مورن تروا بيتون: فوهة غازية مغمورة بالماء تتفقّع وتتصاعد منها الأبخرة في قاع فوهتها، ولا يُوصل إليها إلا سيراً.',
      },
      en: {
        city: 'Laudat',
        landmark: 'Boiling Lake',
        description:
          'Boiling Lake in the Morne Trois Pitons: a flooded fumarole that bubbles and steams at the bottom of its crater, reached only on foot.',
      },
      de: {
        city: 'Laudat',
        landmark: 'Boiling Lake',
        description:
          'Der Boiling Lake in den Morne Trois Pitons: eine überflutete Fumarole, die am Kraterboden brodelt und dampft und nur zu Fuß erreichbar ist.',
      },
      ru: {
        city: 'Лода',
        landmark: 'Кипящее озеро',
        description:
          'Кипящее озеро в массиве Морн-Труа-Питон: затопленная фумарола, бурлящая и дымящая на дне кратера, добраться можно только пешком.',
      },
      it: {
        city: 'Laudat',
        landmark: 'Boiling Lake',
        description:
          'Il Boiling Lake nelle Morne Trois Pitons: una fumarola allagata che ribolle e fuma sul fondo del cratere, raggiungibile solo a piedi.',
      },
    },
  },
  {
    id: 'english_harbour',
    countryCode: 'AG',
    timezone: 'America/Antigua',
    latitude: 17.0064,
    longitude: -61.7625,
    image: commons('Antigua English Harbour Nelson\'s Dockyard 2.jpg'),
    credit: credit('Antigua English Harbour Nelson\'s Dockyard 2.jpg'),
    aliases: [
      'إنجلش هاربر', 'english harbour', 'antigua', 'antigua and barbuda', 'أنتيغوا وبربودا',
      'nelson\'s dockyard', 'nelson dockyard', 'نيلسون دوكيارد', 'سانت جون', 'st john\'s',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'إنجلش هاربر',
        landmark: 'نيلسون دوكيارد',
        description:
          'الترسانة في إنجلش هاربر حيث كانت البحرية البريطانية تُصلح سفنها منذ ١٧٤٥، وهي اليوم مرسى تحيط به مخازن جورجية ونخيل.',
      },
      en: {
        city: 'English Harbour',
        landmark: 'Nelson’s Dockyard',
        description:
          'The dockyard at English Harbour where the British navy careened and refitted ships from 1745, now a marina ringed by Georgian storehouses and palms.',
      },
      de: {
        city: 'English Harbour',
        landmark: 'Nelson’s Dockyard',
        description:
          'Die Werft in English Harbour, wo die britische Marine ab 1745 Schiffe kielholte und ausrüstete, heute ein Yachthafen zwischen georgianischen Speichern und Palmen.',
      },
      ru: {
        city: 'Инглиш-Харбор',
        landmark: 'Верфь Нельсона',
        description:
          'Верфь в Инглиш-Харбор, где с 1745 года британский флот килевал и оснащал корабли; теперь это марина среди георгианских складов и пальм.',
      },
      it: {
        city: 'English Harbour',
        landmark: 'Nelson’s Dockyard',
        description:
          'Il cantiere di English Harbour dove la marina britannica carenava e armava le navi dal 1745, oggi un porto turistico tra magazzini georgiani e palme.',
      },
    },
  },
  {
    id: 'brimstone_hill',
    countryCode: 'KN',
    timezone: 'America/St_Kitts',
    latitude: 17.3469,
    longitude: -62.8372,
    image: commons('Saint Kitts - Brimstone Hill Fortress 02.JPG'),
    credit: credit('Saint Kitts - Brimstone Hill Fortress 02.JPG'),
    aliases: [
      'سانت كيتس', 'saint kitts', 'st kitts', 'saint kitts and nevis', 'سانت كيتس ونيفيس',
      'brimstone hill', 'حصن بريمستون هيل', 'باستير', 'basseterre',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'سانت كيتس',
        landmark: 'حصن بريمستون هيل',
        description:
          'حصن بدأ عام ١٦٩٠ على تل بركاني يطل على البحر، جدرانه من الحجر الداكن ومدافعه موجهة إلى الممر بين الجزر.',
      },
      en: {
        city: 'Saint Kitts',
        landmark: 'Brimstone Hill Fortress',
        description:
          'A fortress begun in 1690 on a volcanic hill above the sea, its walls of dark stone and cannon aimed at the channel between the islands.',
      },
      de: {
        city: 'St. Kitts',
        landmark: 'Brimstone-Hill-Festung',
        description:
          'Eine ab 1690 auf einem Vulkanhügel über dem Meer errichtete Festung, mit dunklen Steinmauern und Kanonen zum Kanal zwischen den Inseln.',
      },
      ru: {
        city: 'Сент-Китс',
        landmark: 'Крепость Бримстоун-Хилл',
        description:
          'Крепость, начатая в 1690 году на вулканическом холме над морем: тёмные стены и пушки, нацеленные на пролив между островами.',
      },
      it: {
        city: 'Saint Kitts',
        landmark: 'Fortezza di Brimstone Hill',
        description:
          'Una fortezza iniziata nel 1690 su una collina vulcanica sopra il mare, con mura di pietra scura e cannoni puntati sul canale tra le isole.',
      },
    },
  },
  {
    id: 'tobago_cays',
    countryCode: 'VC',
    timezone: 'America/St_Vincent',
    latitude: 12.6333,
    longitude: -61.35,
    image: commons('TobagoCaysAerial.jpg'),
    credit: credit('TobagoCaysAerial.jpg'),
    aliases: [
      'جزر توباغو كيز', 'tobago cays', 'saint vincent and the grenadines',
      'سانت فينسنت والغرينادين', 'grenadines', 'غرينادين', 'كينغستاون', 'kingstown',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'جزر توباغو كيز',
        landmark: 'جزر توباغو كيز',
        description:
          'خمس جزر صغيرة داخل حيد على شكل حدوة فرس في غرينادين، لا يُوصل إليها إلا بالقارب، ومياهها ضحلة حتى ترى السلاحف تسبح.',
      },
      en: {
        city: 'Tobago Cays',
        landmark: 'Tobago Cays',
        description:
          'Five small cays inside a horseshoe reef in the Grenadines, reached only by boat, with water shallow enough to see the turtles move.',
      },
      de: {
        city: 'Tobago Cays',
        landmark: 'Tobago Cays',
        description:
          'Fünf kleine Inselchen in einem hufeisenförmigen Riff der Grenadinen, nur per Boot erreichbar, mit Wasser so flach, dass man die Schildkröten schwimmen sieht.',
      },
      ru: {
        city: 'Тобаго-Киз',
        landmark: 'Острова Тобаго-Киз',
        description:
          'Пять малых островков внутри рифа-подковы на Гренадинах, добраться можно только на лодке; вода так мелка, что видно плывущих черепах.',
      },
      it: {
        city: 'Tobago Cays',
        landmark: 'Tobago Cays',
        description:
          'Cinque piccoli isolotti dentro una barriera a ferro di cavallo nelle Grenadine, raggiungibili solo in barca, con acqua così bassa da vedere le tartarughe nuotare.',
      },
    },
  },
  {
    id: 'belize_city',
    countryCode: 'BZ',
    timezone: 'America/Belize',
    latitude: 17.5046,
    longitude: -88.1962,
    image: commons('Belize Blue Hole (TMP) (16912331906).jpg'),
    credit: credit('Belize Blue Hole (TMP) (16912331906).jpg'),
    aliases: [
      'مدينة بليز', 'belize city', 'belize', 'بليز', 'great blue hole', 'الثقب الأزرق الكبير',
      'بلموبان', 'belmopan', 'lighthouse reef',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'مدينة بليز',
        landmark: 'الثقب الأزرق الكبير',
        description:
          'حفرة دائرية قطرها ٣٠٠ متر في حيد لايتهاوس، دائرتها الزرقاء العميقة محفورة في المياه الضحلة الفاتحة، اشتهرت بفضل جاك إيف كوستو.',
      },
      en: {
        city: 'Belize City',
        landmark: 'Great Blue Hole',
        description:
          'A round sinkhole 300 metres across in Lighthouse Reef, its deep blue circle cut into the pale shallows, made famous by Jacques Cousteau.',
      },
      de: {
        city: 'Belize City',
        landmark: 'Great Blue Hole',
        description:
          'Ein runder Einsturzdolomit von 300 Metern Durchmesser im Lighthouse Reef, dessen tiefblaue Kreis in die hellen Untiefen geschnitten ist, berühmt durch Jacques Cousteau.',
      },
      ru: {
        city: 'Белиз-Сити',
        landmark: 'Большая голубая дыра',
        description:
          'Круглая воронка диаметром 300 метров в рифе Лайтхаус: её тёмно-синий круг прорезан в бледной отмели, прославлен Жаком-Ивом Кусто.',
      },
      it: {
        city: 'Belize City',
        landmark: 'Great Blue Hole',
        description:
          'Una dolina circolare di 300 metri nel Lighthouse Reef, il cui cerchio blu profondo è inciso nelle secche chiare, resa celebre da Jacques Cousteau.',
      },
    },
  },
  {
    id: 'tikal',
    countryCode: 'GT',
    timezone: 'America/Guatemala',
    latitude: 16.9333,
    longitude: -89.8833,
    image: commons('Tikal Temple II.jpg'),
    credit: credit('Tikal Temple II.jpg'),
    aliases: [
      'فلوريس', 'flores', 'guatemala', 'غواتيمالا', 'tikal', 'تيكال', 'غواتيمالا سيتي',
      'guatemala city', 'peten',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'فلوريس',
        landmark: 'تيكال',
        description:
          'المعبد الثاني فوق الساحة الكبرى في تيكال، هرم مدرّج من الحجر الجيري ينهض من غابة بيتين شمال غواتيمالا.',
      },
      en: {
        city: 'Flores',
        landmark: 'Tikal',
        description:
          'Temple II above the Great Plaza of Tikal, a stepped pyramid of limestone that rises out of the Petén forest of northern Guatemala.',
      },
      de: {
        city: 'Flores',
        landmark: 'Tikal',
        description:
          'Der Tempel II über dem Großen Platz von Tikal, eine Stufenpyramide aus Kalkstein, die aus dem Petén-Wald Nordguatemalas steigt.',
      },
      ru: {
        city: 'Флорес',
        landmark: 'Тикаль',
        description:
          'Храм II над Великой площадью Тикаля: ступенчатая пирамида из известняка поднимается из лесов Петена на севере Гватемалы.',
      },
      it: {
        city: 'Flores',
        landmark: 'Tikal',
        description:
          'Il Tempio II sopra la Grande Piazza di Tikal, una piramide a gradoni di calcare che sorge dalla foresta del Petén nel nord del Guatemala.',
      },
    },
  },
  {
    id: 'copan',
    countryCode: 'HN',
    timezone: 'America/Tegucigalpa',
    latitude: 14.8386,
    longitude: -89.1572,
    image: commons('Copan Ruins - panoramio.jpg'),
    credit: credit('Copan Ruins - panoramio.jpg'),
    aliases: [
      'كوبان رويناس', 'copan ruinas', 'copan', 'honduras', 'هندوراس', 'copán', 'تيغوسيغالبا',
      'tegucigalpa',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'كوبان رويناس',
        landmark: 'آثار كوبان',
        description:
          'أكروبول كوبان في غرب هندوراس، سلالمه ومسلّاته منقوشة بوجوه المايا ورموزهم في القرن الثامن.',
      },
      en: {
        city: 'Copán Ruinas',
        landmark: 'Copán Ruins',
        description:
          'The acropolis of Copán in western Honduras, its stairways and stelae carved with the faces and glyphs of the Maya in the eighth century.',
      },
      de: {
        city: 'Copán Ruinas',
        landmark: 'Ruinen von Copán',
        description:
          'Die Akropolis von Copán im Westen Honduras’, deren Treppen und Stelen im 8. Jahrhundert mit Gesichtern und Glyphen der Maya gemeißelt wurden.',
      },
      ru: {
        city: 'Копан-Руинас',
        landmark: 'Руины Копана',
        description:
          'Акрополь Копана на западе Гондураса: его лестницы и стелы высечены лицами и глифами майя в VIII веке.',
      },
      it: {
        city: 'Copán Ruinas',
        landmark: 'Rovine di Copán',
        description:
          'L’acropoli di Copán nell’Honduras occidentale, con scale e stele incise con volti e glifi maya nell’VIII secolo.',
      },
    },
  },
  {
    id: 'santa_ana',
    countryCode: 'SV',
    timezone: 'America/El_Salvador',
    latitude: 13.9942,
    longitude: -89.5597,
    image: commons('Laguna cratérica del Volcán de Santa Ana - El Salvador.jpg'),
    credit: credit('Laguna cratérica del Volcán de Santa Ana - El Salvador.jpg'),
    aliases: [
      'سانتا آنا', 'santa ana', 'el salvador', 'السلفادور', 'santa ana volcano',
      'بركان سانتا آنا', 'سان سلفادور', 'san salvador',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'سانتا آنا',
        landmark: 'بركان سانتا آنا',
        description:
          'بحيرة الفوهة داخل بركان سانتا آنا، ماؤها أخضر فاتح على رماد رمادي، وهو أعلى براكين السلفادور عند ٢٣٨١ متراً.',
      },
      en: {
        city: 'Santa Ana',
        landmark: 'Santa Ana Volcano',
        description:
          'The crater lake inside Santa Ana volcano, its water pale green against grey ash, the highest of El Salvador’s volcanoes at 2,381 metres.',
      },
      de: {
        city: 'Santa Ana',
        landmark: 'Santa-Ana-Vulkan',
        description:
          'Der Kratersee im Santa-Ana-Vulkan, hellgrün gegen graue Asche, der höchste Vulkan El Salvadors mit 2.381 Metern.',
      },
      ru: {
        city: 'Санта-Ана',
        landmark: 'Вулкан Санта-Ана',
        description:
          'Кратерное озеро вулкана Санта-Ана: бледно-зелёная вода на сером пепле, высочайший вулкан Сальвадора — 2381 метр.',
      },
      it: {
        city: 'Santa Ana',
        landmark: 'Vulcano Santa Ana',
        description:
          'Il lago craterico del vulcano Santa Ana, acqua verde chiaro sulla cenere grigia, il più alto vulcano di El Salvador con 2.381 metri.',
      },
    },
  },
  {
    id: 'granada_ni',
    countryCode: 'NI',
    timezone: 'America/Managua',
    latitude: 11.93,
    longitude: -85.956,
    image: commons('Cathedral of Granada at sunset.jpg'),
    credit: credit('Cathedral of Granada at sunset.jpg'),
    aliases: [
      'غرناطة', 'granada', 'nicaragua', 'نيكاراغوا', 'granada cathedral', 'كاتدرائية غرناطة',
      'ماناغوا', 'managua',
    ],
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'غرناطة',
        landmark: 'كاتدرائية غرناطة',
        description:
          'كاتدرائية غرناطة الصفراء على ساحتها، أُعيد بناؤها في عشرينيات القرن العشرين على هيكل الكنيسة الاستعمارية، وبرج ساعتها يعلو المدينة المطلة على البحيرة.',
      },
      en: {
        city: 'Granada',
        landmark: 'Granada Cathedral',
        description:
          'The yellow cathedral of Granada on its plaza, rebuilt in the 1920s on the shell of the colonial church, with a clock tower over the lake-facing town.',
      },
      de: {
        city: 'Granada',
        landmark: 'Kathedrale von Granada',
        description:
          'Die gelbe Kathedrale von Granada an ihrem Platz, in den 1920er-Jahren auf den Mauern der Kolonialkirche neu errichtet, mit einem Uhrturm über der Stadt am See.',
      },
      ru: {
        city: 'Гранада',
        landmark: 'Собор Гранады',
        description:
          'Жёлтый собор Гранады на своей площади, отстроенный в 1920-х на стенах колониальной церкви, с часовой башней над городом у озера.',
      },
      it: {
        city: 'Granada',
        landmark: 'Cattedrale di Granada',
        description:
          'La cattedrale gialla di Granada sulla sua piazza, ricostruita negli anni Venti sulle mura della chiesa coloniale, con la torre dell’orologio sopra la città sul lago.',
      },
    },
  },
  {
    id: 'la_fortuna',
    countryCode: 'CR',
    timezone: 'America/Costa_Rica',
    latitude: 10.471,
    longitude: -84.644,
    image: commons('Arenal Volcano 01.jpg'),
    credit: credit('Arenal Volcano 01.jpg'),
    aliases: [
      'لا فورتونا', 'la fortuna', 'costa rica', 'كوستاريكا', 'arenal', 'arenal volcano',
      'بركان أرينال', 'سان خوسيه', 'san jose',
    ],
    focus: '28% 45%',
    copy: {
      ar: {
        city: 'لا فورتونا',
        landmark: 'بركان أرينال',
        description:
          'أرينال فوق لا فورتونا، مخروط بارتفاع ١٦٧٠ متراً قذف الحمم كل ليلة حتى ٢٠١٠، ولا يزال يضع قبعة من السحاب معظم الأصيل.',
      },
      en: {
        city: 'La Fortuna',
        landmark: 'Arenal Volcano',
        description:
          'Arenal above La Fortuna, a cone of 1,670 metres that poured lava nightly until 2010 and still carries a cap of cloud most afternoons.',
      },
      de: {
        city: 'La Fortuna',
        landmark: 'Arenal',
        description:
          'Der Arenal über La Fortuna, ein 1.670 Meter hoher Kegel, der bis 2010 Nacht für Nacht Lava spie und an den meisten Nachmittagen eine Wolkenkappe trägt.',
      },
      ru: {
        city: 'Ла-Фортуна',
        landmark: 'Вулкан Ареналь',
        description:
          'Ареналь над Ла-Фортуной — конус высотой 1670 метров, изливавший лаву каждую ночь до 2010 года и почти каждый вечер укрытый облаком.',
      },
      it: {
        city: 'La Fortuna',
        landmark: 'Vulcano Arenal',
        description:
          'L’Arenal sopra La Fortuna, un cono di 1.670 metri che fino al 2010 versava lava ogni notte e che quasi ogni pomeriggio porta un cappello di nuvole.',
      },
    },
  },
  {
    id: 'panama_city',
    countryCode: 'PA',
    timezone: 'America/Panama',
    latitude: 8.9833,
    longitude: -79.5167,
    image: commons('Miraflores Locks, Panama Canal..jpg'),
    credit: credit('Miraflores Locks, Panama Canal..jpg'),
    aliases: [
      'مدينة بنما', 'panama city', 'panama', 'بنما', 'panama canal', 'قناة بنما',
      'miraflores locks', 'هويس ميرافلوريس',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'مدينة بنما',
        landmark: 'هويس ميرافلوريس',
        description:
          'هويس ميرافلوريس في قناة بنما، حيث تُرفع السفن ١٦ متراً على درجتين بين المحيط الهادئ وبحيرة غاتون.',
      },
      en: {
        city: 'Panama City',
        landmark: 'Miraflores Locks',
        description:
          'The Miraflores locks of the Panama Canal, where ships are lifted 16 metres in two steps between the Pacific and Gatún Lake.',
      },
      de: {
        city: 'Panama-Stadt',
        landmark: 'Miraflores-Schleusen',
        description:
          'Die Miraflores-Schleusen des Panamakanals, in denen Schiffe in zwei Stufen 16 Meter zwischen Pazifik und Gatún-See gehoben werden.',
      },
      ru: {
        city: 'Панама',
        landmark: 'Шлюзы Мирафлорес',
        description:
          'Шлюзы Мирафлорес Панамского канала: суда поднимают на 16 метров в две ступени между Тихим океаном и озером Гатун.',
      },
      it: {
        city: 'Panama',
        landmark: 'Chiuse di Miraflores',
        description:
          'Le chiuse di Miraflores del canale di Panama, dove le navi salgono di 16 metri in due passi tra il Pacifico e il lago Gatún.',
      },
    },
  },
  {
    id: 'puerto_ayora',
    countryCode: 'EC',
    timezone: 'Pacific/Galapagos',
    latitude: -0.7426,
    longitude: -90.3136,
    image: commons('Bartolome Island, Galapagos (50122421803).jpg'),
    credit: credit('Bartolome Island, Galapagos (50122421803).jpg'),
    aliases: [
      'بويرتو أيورا', 'puerto ayora', 'ecuador', 'الإكوادور', 'galapagos', 'galápagos',
      'bartolome', 'بارتولومي', 'كيتو', 'quito',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'بويرتو أيورا',
        landmark: 'جزيرة بارتولومي',
        description:
          'بارتولومي في غالاباغوس، مخروط بركاني وشاطئ رفيع تحت صخر بيناكل، في مياه تتقاسمها أسود البحر مع البطاريق.',
      },
      en: {
        city: 'Puerto Ayora',
        landmark: 'Bartolomé Island',
        description:
          'Bartolomé in the Galápagos, a spatter cone and a thin beach under the older tuff of Pinnacle Rock, in water the sea lions share with penguins.',
      },
      de: {
        city: 'Puerto Ayora',
        landmark: 'Bartolomé',
        description:
          'Bartolomé auf den Galápagos: ein Schlackenkegel und ein schmaler Strand unter dem Tuff von Pinnacle Rock, im Wasser teilen sich Seelöwen und Pinguine.',
      },
      ru: {
        city: 'Пуэрто-Айора',
        landmark: 'Остров Бартоломе',
        description:
          'Бартоломе на Галапагосах: шлаковый конус и узкий пляж под туфом скалы Пиннакл, в воде морские львы делят место с пингвинами.',
      },
      it: {
        city: 'Puerto Ayora',
        landmark: 'Isola Bartolomé',
        description:
          'Bartolomé alle Galápagos: un cono di scorie e una spiaggia sottile sotto il tufo di Pinnacle Rock, in acqua condivisa da leoni marini e pinguini.',
      },
    },
  },
  {
    id: 'canaima',
    countryCode: 'VE',
    timezone: 'America/Caracas',
    latitude: 6.24,
    longitude: -62.87,
    image: commons('Salto del Angel-Canaima-Venezuela18.JPG'),
    credit: credit('Salto del Angel-Canaima-Venezuela18.JPG'),
    aliases: [
      'كانايما', 'canaima', 'venezuela', 'فنزويلا', 'angel falls', 'salto angel', 'شلال آنخل',
      'كاراكاس', 'caracas',
    ],
    copy: {
      ar: {
        city: 'كانايما',
        landmark: 'شلال آنخل',
        description:
          'شلال آنخل يهبط ٩٧٩ متراً من جبل أويان تيبوي المسطح، وهو أعلى شلال على الأرض، ويُوصل إليه بالقارب عبر نهري كاراو وتشورون.',
      },
      en: {
        city: 'Canaima',
        landmark: 'Angel Falls',
        description:
          'Salto Ángel dropping 979 metres off the table mountain Auyán-tepui, the highest waterfall on Earth, reached by boat up the Carrao and Churún rivers.',
      },
      de: {
        city: 'Canaima',
        landmark: 'Salto Ángel',
        description:
          'Der Salto Ángel stürzt 979 Meter vom Tafelberg Auyán-tepui, der höchste Wasserfall der Erde, erreichbar per Boot über Carrao und Churún.',
      },
      ru: {
        city: 'Канайма',
        landmark: 'Водопад Анхель',
        description:
          'Сальто-Анхель падает на 979 метров с плоскогорья Ауян-тепуи — самый высокий водопад Земли; добраться можно на лодке по рекам Каррао и Чурун.',
      },
      it: {
        city: 'Canaima',
        landmark: 'Salto Ángel',
        description:
          'Il Salto Ángel precipita per 979 metri dal tepui Auyán, la cascata più alta della Terra, raggiungibile in barca lungo i fiumi Carrao e Churún.',
      },
    },
  },
  {
    id: 'kaieteur',
    countryCode: 'GY',
    timezone: 'America/Guyana',
    latitude: 5.1745,
    longitude: -59.4784,
    image: commons('Kaieteur Falls, Guyana (23035888153).jpg'),
    credit: credit('Kaieteur Falls, Guyana (23035888153).jpg'),
    aliases: [
      'كايتور', 'kaieteur', 'guyana', 'غيانا', 'kaieteur falls', 'شلالات كايتور', 'جورج تاون',
      'georgetown',
    ],
    copy: {
      ar: {
        city: 'كايتور',
        landmark: 'شلالات كايتور',
        description:
          'كايتور على نهر بوتارو، هبوط واحد بطول ٢٢٦ متراً في وادٍ أخضر، أربعة أضعاف ارتفاع شلالات نياغارا، ويُوصل إليه بطائرة صغيرة.',
      },
      en: {
        city: 'Kaieteur',
        landmark: 'Kaieteur Falls',
        description:
          'Kaieteur on the Potaro river, a single drop of 226 metres into a gorge of green, four times the height of Niagara and reached by small plane.',
      },
      de: {
        city: 'Kaieteur',
        landmark: 'Kaieteur-Fälle',
        description:
          'Der Kaieteur am Potaro, ein einzelner Fall von 226 Metern in eine grüne Schlucht, viermal so hoch wie die Niagarafälle, erreichbar mit dem Kleinflugzeug.',
      },
      ru: {
        city: 'Кайетур',
        landmark: 'Водопад Кайетур',
        description:
          'Кайетур на реке Потаро — единый сброс в 226 метров в зелёное ущелье, вчетверо выше Ниагары; добраться можно малым самолётом.',
      },
      it: {
        city: 'Kaieteur',
        landmark: 'Cascate Kaieteur',
        description:
          'Il Kaieteur sul fiume Potaro, un salto unico di 226 metri in una gola verde, quattro volte Niagara, raggiungibile con un piccolo aereo.',
      },
    },
  },
  {
    id: 'paramaribo',
    countryCode: 'SR',
    timezone: 'America/Paramaribo',
    latitude: 5.852,
    longitude: -55.2038,
    image: commons('Kathedraal 1.jpg'),
    credit: credit('Kathedraal 1.jpg'),
    aliases: [
      'باراماريبو', 'paramaribo', 'suriname', 'سورينام', 'cathedral', 'الكاتدرائية',
      'saint peter and paul',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'باراماريبو',
        landmark: 'كاتدرائية بطرس وبولس',
        description:
          'كاتدرائية بطرس وبولس الخشبية في باراماريبو، بناء قوطي أصفر وأسود من ١٨٨٥، يُقال إنه أكبر مبنى خشبي في الأمريكتين.',
      },
      en: {
        city: 'Paramaribo',
        landmark: 'Sts. Peter and Paul Cathedral',
        description:
          'The wooden cathedral of Saints Peter and Paul in Paramaribo, a yellow and black Gothic confection of 1885, said to be the largest wooden building in the Americas.',
      },
      de: {
        city: 'Paramaribo',
        landmark: 'Kathedrale St. Peter und Paul',
        description:
          'Die hölzerne Kathedrale St. Peter und Paul in Paramaribo, eine gelb-schwarze neugotische Schöpfung von 1885, angeblich der größte Holzbau Amerikas.',
      },
      ru: {
        city: 'Парамарибо',
        landmark: 'Собор Петра и Павла',
        description:
          'Деревянный собор Петра и Павла в Парамарибо — жёлто-чёрная готическая постройка 1885 года, считающаяся крупнейшим деревянным зданием Америки.',
      },
      it: {
        city: 'Paramaribo',
        landmark: 'Cattedrale dei Santi Pietro e Paolo',
        description:
          'La cattedrale di legno dei Santi Pietro e Paolo a Paramaribo, una costruzione gotica gialla e nera del 1885, ritenuta il più grande edificio in legno delle Americhe.',
      },
    },
  },
  {
    id: 'uyuni',
    countryCode: 'BO',
    timezone: 'America/La_Paz',
    latitude: -20.4624,
    longitude: -66.825,
    image: commons('Isla del Pescado, Salar de Uyuni, Bolivia, 2016-02-04, DD 42.JPG'),
    credit: credit('Isla del Pescado, Salar de Uyuni, Bolivia, 2016-02-04, DD 42.JPG'),
    aliases: [
      'أويوني', 'uyuni', 'bolivia', 'بوليفيا', 'salar de uyuni', 'سالار دي أويوني', 'لا باز',
      'la paz', 'sucre', 'سوكري',
    ],
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'أويوني',
        landmark: 'سالار دي أويوني',
        description:
          'جزيرة السمكة في سالار دي أويوني، نتوء تغطيه الصبّار على مسطح ملحي مساحته ١٠٥٨٢ كيلومتراً مربعاً، وهو الأكبر على الأرض.',
      },
      en: {
        city: 'Uyuni',
        landmark: 'Salar de Uyuni',
        description:
          'Isla del Pescado in the Salar de Uyuni, a cactus-covered outcrop on a salt flat 10,582 square kilometres wide, the largest on Earth.',
      },
      de: {
        city: 'Uyuni',
        landmark: 'Salar de Uyuni',
        description:
          'Die Isla del Pescado im Salar de Uyuni, ein kaktusbewachsener Fels auf einer Salzfläche von 10.582 Quadratkilometern, der größten der Erde.',
      },
      ru: {
        city: 'Уюни',
        landmark: 'Салар-де-Уюни',
        description:
          'Остров Исла-дель-Пескадо в Салар-де-Уюни — поросший кактусами выход скал на солончаке площадью 10 582 км², крупнейшем на Земле.',
      },
      it: {
        city: 'Uyuni',
        landmark: 'Salar de Uyuni',
        description:
          'L’Isla del Pescado nel Salar de Uyuni, un affioramento coperto di cactus su una distesa di sale di 10.582 chilometri quadrati, la più grande della Terra.',
      },
    },
  },
  {
    id: 'asuncion',
    countryCode: 'PY',
    timezone: 'America/Asuncion',
    latitude: -25.2775,
    longitude: -57.635,
    image: commons('Palacio de los Lopez, Asunción PAR.jpg'),
    credit: credit('Palacio de los Lopez, Asunción PAR.jpg'),
    aliases: [
      'أسونسيون', 'asuncion', 'asunción', 'paraguay', 'باراغواي', 'palacio de lopez',
      'قصر لوبيز',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'أسونسيون',
        landmark: 'قصر لوبيز',
        description:
          'قصر لوبيز في أسونسيون، مقر حكومة باراغواي الأبيض منذ ١٨٩٢، وشرفاته تطل على خليج نهر باراغواي.',
      },
      en: {
        city: 'Asunción',
        landmark: 'Palacio de López',
        description:
          'The Palacio de López in Asunción, the white seat of Paraguay’s government since 1892, its verandas facing the bay of the Paraguay river.',
      },
      de: {
        city: 'Asunción',
        landmark: 'Palacio de López',
        description:
          'Der Palacio de López in Asunción, seit 1892 der weiße Sitz der Regierung Paraguays, dessen Veranden zur Bucht des Paraguay-Flusses zeigen.',
      },
      ru: {
        city: 'Асунсьон',
        landmark: 'Дворец Лопеса',
        description:
          'Дворец Лопеса в Асунсьоне — белая резиденция правительства Парагвая с 1892 года, его веранды обращены к заливу реки Парагвай.',
      },
      it: {
        city: 'Asunción',
        landmark: 'Palacio de López',
        description:
          'Il Palacio de López ad Asunción, sede bianca del governo del Paraguay dal 1892, con le verande rivolte alla baia del fiume Paraguay.',
      },
    },
  },
  {
    id: 'montevideo',
    countryCode: 'UY',
    timezone: 'America/Montevideo',
    latitude: -34.9011,
    longitude: -56.1645,
    image: commons('Plaza Independencia, Montevideo.jpg'),
    credit: credit('Plaza Independencia, Montevideo.jpg'),
    aliases: [
      'مونتيفيديو', 'montevideo', 'uruguay', 'أوروغواي', 'plaza independencia',
      'ساحة الاستقلال',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'مونتيفيديو',
        landmark: 'ساحة الاستقلال',
        description:
          'ساحة الاستقلال في وسط مونتيفيديو، يعلوها قصر سالفو ويقف عند طرفها باب المدينة القديم.',
      },
      en: {
        city: 'Montevideo',
        landmark: 'Plaza Independencia',
        description:
          'Plaza Independencia in the middle of Montevideo, with the Salvo Palace rising at its head and the old city gate at its foot.',
      },
      de: {
        city: 'Montevideo',
        landmark: 'Plaza Independencia',
        description:
          'Die Plaza Independencia im Zentrum von Montevideo, mit dem Salvo-Palast an ihrer Spitze und dem alten Stadttor an ihrem Fuß.',
      },
      ru: {
        city: 'Монтевидео',
        landmark: 'Площадь Независимости',
        description:
          'Площадь Независимости в центре Монтевидео: во главе её — дворец Сальво, у подножия — старые городские ворота.',
      },
      it: {
        city: 'Montevideo',
        landmark: 'Plaza Independencia',
        description:
          'Plaza Independencia nel centro di Montevideo, con il Palazzo Salvo in cima e l’antica porta della città ai suoi piedi.',
      },
    },
  },
  {
    id: 'dili',
    countryCode: 'TL',
    timezone: 'Asia/Dili',
    latitude: -8.5569,
    longitude: 125.56,
    image: commons('Cristo Rei Dili Timor Leste 2.jpg'),
    credit: credit('Cristo Rei Dili Timor Leste 2.jpg'),
    aliases: [
      'ديلي', 'dili', 'timor-leste', 'timor leste', 'تيمور الشرقية', 'cristo rei',
      'تمثال المسيح الملك',
    ],
    capital: true,
    focus: '55% 45%',
    copy: {
      ar: {
        city: 'ديلي',
        landmark: 'تمثال المسيح الملك',
        description:
          'تمثال المسيح الملك في ديلي، ارتفاعه ٢٧ متراً على رأس برّي شرق المدينة، يتلفّت إلى الخليج من تلّ من العشب الجاف.',
      },
      en: {
        city: 'Dili',
        landmark: 'Cristo Rei',
        description:
          'The Cristo Rei of Dili, a 27-metre statue on a headland east of the city, looking back over the bay from a hill of dry grass.',
      },
      de: {
        city: 'Dili',
        landmark: 'Cristo Rei',
        description:
          'Cristo Rei von Dili, eine 27 Meter hohe Statue auf einer Landzunge östlich der Stadt, die von einem Hügel aus trockenem Gras über die Bucht blickt.',
      },
      ru: {
        city: 'Дили',
        landmark: 'Кристу-Рей',
        description:
          'Кристу-Рей в Дили — статуя высотой 27 метров на мысу к востоку от города, смотрит на залив с холма сухой травы.',
      },
      it: {
        city: 'Dili',
        landmark: 'Cristo Rei',
        description:
          'Il Cristo Rei di Dili, una statua di 27 metri su un promontorio a est della città, che guarda la baia da una collina d’erba secca.',
      },
    },
  },
  {
    id: 'bandar_seri_begawan',
    countryCode: 'BN',
    timezone: 'Asia/Brunei',
    latitude: 4.8895,
    longitude: 114.942,
    image: commons('Sultan Omar Ali Saifuddin Mosque 02.jpg'),
    credit: credit('Sultan Omar Ali Saifuddin Mosque 02.jpg'),
    aliases: [
      'بندر سري بيغاوان', 'bandar seri begawan', 'brunei', 'بروناي',
      'sultan omar ali saifuddien mosque', 'مسجد السلطان عمر علي سيف الدين',
    ],
    capital: true,
    focus: '50% 50%',
    copy: {
      ar: {
        city: 'بندر سري بيغاوان',
        landmark: 'مسجد السلطان عمر علي سيف الدين',
        description:
          'مسجد السلطان عمر علي سيف الدين في بندر سري بيغاوان، بقبته الرخامية ومركبه على حافة البحيرة، يُضاء ذهبياً بعد الغروب.',
      },
      en: {
        city: 'Bandar Seri Begawan',
        landmark: 'Sultan Omar Ali Saifuddien Mosque',
        description:
          'The Sultan Omar Ali Saifuddien Mosque in Bandar Seri Begawan, its marble dome and lagoon-side barge lit gold after dark.',
      },
      de: {
        city: 'Bandar Seri Begawan',
        landmark: 'Sultan-Omar-Ali-Saifuddien-Moschee',
        description:
          'Die Sultan-Omar-Ali-Saifuddien-Moschee in Bandar Seri Begawan, deren Marmorkuppel und Lagunenboot nach Einbruch der Dunkelheit golden leuchten.',
      },
      ru: {
        city: 'Бандар-Сери-Бегаван',
        landmark: 'Мечеть Султана Омара Али Сайфуддина',
        description:
          'Мечеть Султана Омара Али Сайфуддина в Бандар-Сери-Бегаване: мраморный купол и лодка у лагуны золотятся после заката.',
      },
      it: {
        city: 'Bandar Seri Begawan',
        landmark: 'Moschea Sultan Omar Ali Saifuddien',
        description:
          'La moschea Sultan Omar Ali Saifuddien a Bandar Seri Begawan, con la cupola di marmo e la barca sulla laguna illuminate d’oro dopo il buio.',
      },
    },
  },
  {
    id: 'pyongyang',
    countryCode: 'KP',
    timezone: 'Asia/Pyongyang',
    latitude: 39.0195,
    longitude: 125.742,
    image: commons('Tower of the Juche Idea - panoramio.jpg'),
    credit: credit('Tower of the Juche Idea - panoramio.jpg'),
    aliases: [
      'بيونغ يانغ', 'pyongyang', 'north korea', 'كوريا الشمالية', 'juche tower',
      'برج فكرة جوتشي', 'tower of the juche idea',
    ],
    capital: true,
    focus: '50% 45%',
    copy: {
      ar: {
        city: 'بيونغ يانغ',
        landmark: 'برج فكرة جوتشي',
        description:
          'برج فكرة جوتشي في بيونغ يانغ، ١٧٠ متراً من الجرانيت ولهب أحمر فوق نهر تايدونغ، أُقيم عام ١٩٨٢ لعيد ميلاد كيم إيل سونغ السبعين.',
      },
      en: {
        city: 'Pyongyang',
        landmark: 'Juche Tower',
        description:
          'The Tower of the Juche Idea in Pyongyang, 170 metres of granite and a red flame above the Taedong river, raised in 1982 for Kim Il-sung’s seventieth birthday.',
      },
      de: {
        city: 'Pjöngjang',
        landmark: 'Turm der Juche-Idee',
        description:
          'Der Turm der Juche-Idee in Pjöngjang, 170 Meter Granit und eine rote Flamme über dem Taedong, 1982 zu Kim Il-sungs 70. Geburtstag errichtet.',
      },
      ru: {
        city: 'Пхеньян',
        landmark: 'Монумент идей чучхе',
        description:
          'Монумент идей чучхе в Пхеньяне: 170 метров гранита и красное пламя над рекой Тэдонган, возведён в 1982 году к 70-летию Ким Ир Сена.',
      },
      it: {
        city: 'Pyongyang',
        landmark: 'Torre Juche',
        description:
          'La Torre dell’idea Juche a Pyongyang, 170 metri di granito e una fiamma rossa sopra il Taedong, eretta nel 1982 per i settant’anni di Kim Il-sung.',
      },
    },
  },
];
