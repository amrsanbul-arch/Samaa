import type { Landmark, Place } from './types';
import { normalizeArabic } from './arabic';
import type { Lang } from './i18n';
import { FALLBACK_I18N, LANDMARK_I18N, type LandmarkText } from './landmark-i18n';

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=78`;

// Special:FilePath resolves to the canonical thumbnail for any file name, so the
// stored paths cannot drift out of sync with Wikimedia's hash directories.
const commons = (path: string, width = 1600) => {
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
const credit = (file: string) => ({
  label: 'Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
});

/**
 * Curated cinematic backdrops for major Arab cities.
 * Every URL was checked to resolve to a real image.
 */
export const LANDMARKS: Landmark[] = [
  {
    id: 'cairo',
    city: 'القاهرة',
    cityEn: 'Cairo',
    country: 'مصر',
    countryCode: 'EG',
    landmark: 'أهرامات الجيزة',
    description:
      'آخر عجائب الدنيا السبع القديمة، تقف على هضبة الجيزة منذ أكثر من ٤٥٠٠ عام. عند الغروب يتحول لون الحجر إلى ذهبي دافئ يغمر الصحراء.',
    image: unsplash('1503177119275-0aa32b3a9368'),
    credit: UNSPLASH_CREDIT,
    latitude: 30.0444,
    longitude: 31.2357,
    aliases: ['القاهرة', 'القاهره', 'مصر', 'cairo', 'giza', 'الجيزة'],
  },
  {
    id: 'dubai',
    city: 'دبي',
    cityEn: 'Dubai',
    country: 'الإمارات',
    countryCode: 'AE',
    landmark: 'برج خليفة وأفق الخليج',
    description:
      'أفق دبي يعلوه برج خليفة، أطول بناء شيّده الإنسان بارتفاع ٨٢٨ متراً، وسط أضواء المدينة المنعكسة على مياه الخليج العربي.',
    image: unsplash('1512453979798-5ea266f8880c'),
    credit: UNSPLASH_CREDIT,
    latitude: 25.2048,
    longitude: 55.2708,
    aliases: ['دبي', 'دوبي', 'اماره دبي', 'dubai'],
  },
  {
    id: 'riyadh',
    city: 'الرياض',
    cityEn: 'Riyadh',
    country: 'السعودية',
    countryCode: 'SA',
    landmark: 'مركز المملكة',
    description:
      'قلب الجزيرة العربية النابض، حيث يقف مركز المملكة بجسرته الشهيرة فوق مدينة تتوسّع بلا توقف، وسماء تتوهج بلون العنبر قبل المغيب.',
    image: commons('Riyadh_Skyline.jpg'),
    credit: credit('Riyadh_Skyline.jpg'),
    latitude: 24.7136,
    longitude: 46.6753,
    aliases: ['الرياض', 'رياض', 'riyadh', 'الرياض السعودية'],
    focus: '80% 50%',
  },
  {
    id: 'alexandria',
    city: 'الإسكندرية',
    cityEn: 'Alexandria',
    country: 'مصر',
    countryCode: 'EG',
    landmark: 'قلعة قايتباي',
    description:
      'قلعة قايتباي تقف على موقع منارة الإسكندرية القديمة، إحدى عجائب الدنيا السبع، وتطلّ على بحر أبيض متوسط لا يهدأ.',
    image: commons('b/ba/The_Citadel_of_Qaitbay.jpg'),
    credit: credit('The_Citadel_of_Qaitbay.jpg'),
    latitude: 31.2001,
    longitude: 29.9187,
    aliases: ['الإسكندرية', 'الاسكندرية', 'اسكندرية', 'alexandria', 'اسكندريه'],
  },
  {
    id: 'makkah',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    country: 'السعودية',
    countryCode: 'SA',
    landmark: 'المسجد الحرام والكعبة',
    description:
      'الكعبة المشرفة في قلب المسجد الحرام، قبلة أكثر من مليار مسلم، تتوسطها أفواج الطائفين ليلاً ونهاراً منذ أربعة عشر قرناً.',
    image: unsplash('1564769625905-50e93615e769'),
    credit: UNSPLASH_CREDIT,
    latitude: 21.4225,
    longitude: 39.8262,
    aliases: ['مكة', 'مكه', 'مكة المكرمة', 'مكه المكرمه', 'makkah', 'mecca', 'المسجد الحرام'],
  },
  {
    id: 'madinah',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    country: 'السعودية',
    countryCode: 'SA',
    landmark: 'المسجد النبوي',
    description:
      'المسجد النبوي وقبّته الخضراء، ثاني أقدس موقع في الإسلام، يهبط الضوء الهادئ على ساحاته الواسعة عند الفجر والمغيب.',
    image: unsplash('1591604129939-f1efa4d9f7fa'),
    credit: UNSPLASH_CREDIT,
    latitude: 24.4672,
    longitude: 39.6111,
    aliases: ['المدينة', 'المدينه', 'المدينة المنورة', 'المدينه المنوره', 'madinah', 'medina'],
    focus: '70% 50%',
    zoom: 1.45,
  },
  {
    id: 'jeddah',
    city: 'جدة',
    cityEn: 'Jeddah',
    country: 'السعودية',
    countryCode: 'SA',
    landmark: 'مسجد الرحمة العائم',
    description:
      'مسجد الرحمة العائم على شاطئ جدة، يبدو كأنه يطفو فوق البحر الأحمر عند المد، وتحيط به زرقة الماء من كل جهة.',
    image: commons('b/be/Jeddah_-_87654.jpg'),
    credit: credit('Jeddah_-_87654.jpg'),
    latitude: 21.4858,
    longitude: 39.1925,
    aliases: ['جدة', 'جده', 'jeddah', 'jiddah'],
  },
  {
    id: 'abudhabi',
    city: 'أبوظبي',
    cityEn: 'Abu Dhabi',
    country: 'الإمارات',
    countryCode: 'AE',
    landmark: 'كورنيش أبوظبي',
    description:
      'أبراج أبوظبي على كورنيش الخليج، مدينة تحوّلت من قرية صيد صغيرة إلى عاصمة حديثة في نصف قرن فقط.',
    image: commons('Abu_dhabi_skylines_2014.jpg'),
    credit: credit('Abu_dhabi_skylines_2014.jpg'),
    latitude: 24.4539,
    longitude: 54.3773,
    aliases: ['أبوظبي', 'ابوظبي', 'ابو ظبي', 'abu dhabi', 'abudhabi'],
    zoom: 1.3,
  },
  {
    id: 'doha',
    city: 'الدوحة',
    cityEn: 'Doha',
    country: 'قطر',
    countryCode: 'QA',
    landmark: 'أبراج الخليج الغربي',
    description:
      'أبراج الخليج الغربي في الدوحة ترسم خطاً معمارياً جريئاً على ساحل الخليج العربي، وتضيء ككتلة ضوء واحدة بعد الغروب.',
    image: commons('1/1c/Doha_-_West_Bay_Skyline_04.jpg'),
    credit: credit('Doha_-_West_Bay_Skyline_04.jpg'),
    latitude: 25.2854,
    longitude: 51.531,
    aliases: ['الدوحة', 'الدوحه', 'دوحه', 'doha', 'قطر'],
    zoom: 1.35,
  },
  {
    id: 'kuwait',
    city: 'الكويت',
    cityEn: 'Kuwait City',
    country: 'الكويت',
    countryCode: 'KW',
    landmark: 'أبراج الكويت',
    description:
      'أبراج الكويت على ساحل الخليج، أيقونة معمارية بناها يورن أوتزون عام ١٩٧٩، وترتفع فوق الماء كثلاث مآذن مستقبلية.',
    image: commons('f/f1/Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg'),
    credit: credit('Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg'),
    latitude: 29.3759,
    longitude: 47.9774,
    aliases: ['الكويت', 'مدينة الكويت', 'kuwait', 'kuwait city'],
    zoom: 1.3,
  },
  {
    id: 'manama',
    city: 'المنامة',
    cityEn: 'Manama',
    country: 'البحرين',
    countryCode: 'BH',
    landmark: 'مركز البحرين التجاري العالمي',
    description:
      'مركز البحرين التجاري العالمي، أول ناطحة سحاب في العالم تدمج توربينات الرياح داخل هيكلها، يرتفع فوق مرفأ المنامة.',
    image: commons(
      '6/6d/Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_1.jpg'
    ),
    credit: credit('Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_1.jpg'),
    latitude: 26.2285,
    longitude: 50.586,
    aliases: ['المنامة', 'المنامه', 'manama', 'البحرين', 'bahrain'],
  },
  {
    id: 'muscat',
    city: 'مسقط',
    cityEn: 'Muscat',
    country: 'عُمان',
    countryCode: 'OM',
    landmark: 'جامع السلطان قابوس الأكبر',
    description:
      'جامع السلطان قابوس الأكبر، تحفة من الرخام والزخارف الإسلامية تحت سماء عُمان، ومآذنه ترسم ظلاً طويلاً على الرمل عند الغروب.',
    image: commons('4/48/Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg'),
    credit: credit('Sultan_Qaboos_Grand_Mosque_(19889998133).jpg'),
    latitude: 23.588,
    longitude: 58.3829,
    aliases: ['مسقط', 'muscat', 'سلطنة عمان'],
    zoom: 1.3,
  },
  {
    id: 'amman',
    city: 'عمّان',
    cityEn: 'Amman',
    country: 'الأردن',
    countryCode: 'JO',
    landmark: 'المدرج الروماني',
    description:
      'المدرج الروماني في قلب عمّان، محفور في الجبل منذ القرن الثاني الميلادي، يطلّ على بيوت المدينة البيضاء المتراكمة على التلال.',
    image: commons('0/03/Amman_-_Roman_Theatre_seen_from_the_Citadel.jpg'),
    credit: credit('Amman_-_Roman_Theatre_seen_from_the_Citadel.jpg'),
    latitude: 31.9539,
    longitude: 35.9106,
    aliases: ['عمان', 'عمّان', 'amman', 'الاردن'],
  },
  {
    id: 'petra',
    city: 'البتراء',
    cityEn: 'Petra',
    country: 'الأردن',
    countryCode: 'JO',
    landmark: 'الخزنة',
    description:
      'الخزنة في البتراء، مدينة الأنباط الوردية المنحوتة في الصخر، تُكشف فجأة عند نهاية ممر السيق في مشهد لا يشبه شيئاً آخر.',
    image: commons('3/30/Petra_%2C_Al-Khazneh_2.jpg'),
    credit: credit('Petra_,_Al-Khazneh_2.jpg'),
    latitude: 30.3285,
    longitude: 35.4444,
    aliases: ['البتراء', 'البترا', 'بتراء', 'petra', 'الخزنة'],
    focus: '70% 45%',
  },
  {
    id: 'beirut',
    city: 'بيروت',
    cityEn: 'Beirut',
    country: 'لبنان',
    countryCode: 'LB',
    landmark: 'صخرة الروشة',
    description:
      'صخرة الروشة في بيروت، قوس حجري واقف في البحر الأبيض المتوسط يلتقط آخر ضوء الشمس كل مساء.',
    image: commons('0/01/Pigeon_Rocks_at_sunset%2C_Beirut%2C_Lebanon.jpg'),
    credit: credit('Pigeon_Rocks_at_sunset,_Beirut,_Lebanon.jpg'),
    latitude: 33.8938,
    longitude: 35.5018,
    aliases: ['بيروت', 'beirut', 'لبنان'],
  },
  {
    id: 'damascus',
    city: 'دمشق',
    cityEn: 'Damascus',
    country: 'سوريا',
    countryCode: 'SY',
    landmark: 'الجامع الأموي',
    description:
      'الجامع الأموي الكبير في دمشق، من أقدم مساجد العالم وأكثرها هيبة، بصحنه الفسيح وأعمدته الرخامية ومآذنه التي تعانق السماء.',
    image: commons(
      '9/95/Damascus%2C_Syria%2C_The_Umayyad_Mosque%2C_The_Courtyard%2C_Islamic_Art.jpg'
    ),
    credit: credit('Damascus,_Syria,_The_Umayyad_Mosque,_The_Courtyard,_Islamic_Art.jpg'),
    latitude: 33.5138,
    longitude: 36.2765,
    aliases: ['دمشق', 'damascus', 'سوريا'],
  },
  {
    id: 'baghdad',
    city: 'بغداد',
    cityEn: 'Baghdad',
    country: 'العراق',
    countryCode: 'IQ',
    landmark: 'نصب الشهيد',
    description:
      'قبّتان فيروزيتان تنشقّان عن قلب واحد في نصب الشهيد، شُيّدتا تخليداً لأرواح العراقيين، وتقفان اليوم على ضفّة دجلة شاهداً على ذاكرة بغداد.',
    image: commons('العلم العراقي في قلب نصب الشهيد – بغداد، العراق.jpg'),
    credit: credit('العلم العراقي في قلب نصب الشهيد – بغداد، العراق.jpg'),
    latitude: 33.3152,
    longitude: 44.3661,
    aliases: ['بغداد', 'baghdad', 'العراق'],
    focus: '50% 45%',
  },
  {
    id: 'casablanca',
    city: 'الدار البيضاء',
    cityEn: 'Casablanca',
    country: 'المغرب',
    countryCode: 'MA',
    landmark: 'مسجد الحسن الثاني',
    description:
      'مسجد الحسن الثاني يقف على حافة المحيط الأطلسي، أطول مئذنة في العالم بارتفاع ٢١٠ أمتار، تضيء الشمس على رخامه كل مغيب.',
    image: commons(
      '8/8a/Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg'
    ),
    credit: credit(
      "Sunshine_on_mosque_Hassan_II_in_Casablanca,_Morocco_-_Flickr_-_Milamber's_portfolio.jpg"
    ),
    latitude: 33.5731,
    longitude: -7.5898,
    aliases: ['الدار البيضاء', 'الدار البيضه', 'كازابلانكا', 'casablanca', 'الدارالبيضاء'],
  },
  {
    id: 'marrakech',
    city: 'مراكش',
    cityEn: 'Marrakech',
    country: 'المغرب',
    countryCode: 'MA',
    landmark: 'المدينة الحمراء وجبال الأطلس',
    description:
      'مراكش الحمراء عند سفح جبال الأطلس، حيث يختلط لون المدينة الطيني بثلج القمم، ويصدح الأذان فوق ساحة جامع الفنا.',
    image: unsplash('1597212618440-806262de4f6b'),
    credit: UNSPLASH_CREDIT,
    latitude: 31.6295,
    longitude: -7.9811,
    aliases: ['مراكش', 'marrakech', 'marrakesh', 'المغرب'],
  },
  {
    id: 'tunis',
    city: 'تونس',
    cityEn: 'Tunis',
    country: 'تونس',
    countryCode: 'TN',
    landmark: 'سيدي بوسعيد',
    description:
      'سيدي بوسعيد فوق خليج تونس، بيوت بيضاء وأبواب زرقاء تطلّ على البحر المتوسط، وتلال تضيء بالأزرق عند العصر.',
    image: commons('3/30/Tunisia-3029B_%287846578812%29.jpg'),
    credit: credit('Tunisia-3029B_(7846578812).jpg'),
    latitude: 36.8065,
    longitude: 10.1815,
    aliases: ['تونس', 'tunis', 'سيدي بوسعيد'],
  },
  {
    id: 'sanaa',
    city: 'صنعاء',
    cityEn: "Sana'a",
    country: 'اليمن',
    countryCode: 'YE',
    landmark: 'المدينة القديمة',
    description:
      "صنعاء القديمة، بيوتها البرجية المزخرفة بالجبس الأبيض، عمرها أكثر من ألف عام وترتفع كغابة من الحجر في الهواء.",
    image: commons('e/e3/Tower-House_in_the_Old_City_of_Sana%27a_%282286782876%29.jpg'),
    credit: credit("Tower-House_in_the_Old_City_of_Sana'a_(2286782876).jpg"),
    latitude: 15.3694,
    longitude: 44.191,
    aliases: ['صنعاء', 'صنعا', 'sanaa', 'sana', 'اليمن'],
  },
  {
    id: 'alula',
    city: 'العلا',
    cityEn: 'AlUla',
    country: 'السعودية',
    countryCode: 'SA',
    landmark: 'قصر الفريد في الحِجر',
    description:
      'قصر الفريد في الحِجر بالعلا، مقبرة نبطية منحوتة في صخرة واحدة قبل ألفي عام، تقف وحدها في صحراء واسعة.',
    image: commons(
      '9/9d/Qasr_al-Farid%2C_a_1st-century_AD_Nabatean_unfinished_tomb_carved_into_a_giant_boulder_in_Hegra_%28Mada%27in_Salih%29%2C_the_kingdom%27s_second_Nabatean_capital_after_Petra%2C_Saudi_Arabia_-_53534952258.jpg'
    ),
    credit: credit(
      "Qasr_al-Farid,_a_1st-century_AD_Nabatean_unfinished_tomb_carved_into_a_giant_boulder_in_Hegra_(Mada'in_Salih),_the_kingdom's_second_Nabatean_capital_after_Petra,_Saudi_Arabia_-_53534952258.jpg"
    ),
    latitude: 26.6175,
    longitude: 37.9161,
    aliases: ['العلا', 'alula', 'al ula', 'الحجر', 'هجر'],
  },
];

/** Routes remote photos through the cached, allow-listed image proxy. */
export function sceneImageSrc(url: string): string {
  return `/api/scene?u=${encodeURIComponent(url)}`;
}

/** Used when a city has no curated landmark yet. */
export const FALLBACK_SCENE = {
  landmark: 'أفق عربي مفتوح',
  description:
    'مدينة عربية أخرى تحت سماء واحدة. لا توجد بعد صورة أرشيفية لهذه المدينة، لكن الطقس هنا حقيقي وحيّ الآن.',
  image: unsplash('1473580044384-7ba9967e16a0'),
  credit: UNSPLASH_CREDIT,
};

export const FEATURED_IDS = ['cairo', 'dubai', 'riyadh', 'makkah', 'alexandria', 'doha'];

/** City, country, landmark and description in the requested UI language. */
export function localizedText(item: Landmark, lang: Lang): LandmarkText {
  if (lang === 'ar') {
    return {
      city: item.city,
      country: item.country,
      landmark: item.landmark,
      description: item.description,
    };
  }
  return (
    LANDMARK_I18N[lang][item.id] ?? {
      city: item.cityEn,
      country: item.country,
      landmark: item.landmark,
      description: item.description,
    }
  );
}

export function fallbackSceneText(lang: Lang): LandmarkText {
  if (lang === 'ar') {
    return {
      city: '',
      country: '',
      landmark: FALLBACK_SCENE.landmark,
      description: FALLBACK_SCENE.description,
    };
  }
  return FALLBACK_I18N[lang];
}

const normalized = LANDMARKS.map((item) => ({
  item,
  keys: [
    item.city,
    item.cityEn,
    ...item.aliases,
    ...Object.values(LANDMARK_I18N).map((table) => table[item.id]?.city ?? ''),
  ]
    .filter(Boolean)
    .map(normalizeArabic),
}));

/** Finds the curated backdrop that best matches a searched city. */
export function findLandmark(query: string): Landmark | null {
  const q = normalizeArabic(query);
  if (!q) return null;

  let best: { item: Landmark; score: number } | null = null;

  for (const { item, keys } of normalized) {
    for (const key of keys) {
      let score = 0;
      if (key === q) score = 100;
      else if (q.length >= 3 && (key.startsWith(q) || q.startsWith(key))) score = 70;
      else if (q.length >= 4 && (key.includes(q) || q.includes(key))) score = 50;
      if (score && (!best || score > best.score)) best = { item, score };
    }
  }

  return best?.item ?? null;
}

export function landmarkById(id: string): Landmark | null {
  return LANDMARKS.find((item) => item.id === id) ?? null;
}

export const FEATURED_LANDMARKS = FEATURED_IDS.map((id) => landmarkById(id)!).filter(Boolean);

/** Lets the quick-pick chips skip the geocoding round trip. */
export function placeFromLandmark(item: Landmark, lang: Lang = 'ar'): Place {
  const text = localizedText(item, lang);
  return {
    id: -(LANDMARKS.indexOf(item) + 1),
    name: text.city || item.cityEn,
    country: text.country || item.country,
    countryCode: item.countryCode,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}
