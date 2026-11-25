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
 * Curated cinematic backdrops for major cities around the world.
 * Every URL was checked to resolve to a real image.
 */
export const LANDMARKS: Landmark[] = [
  {
    id: 'cairo',
    city: 'القاهرة',
    cityEn: 'Cairo',
    country: 'مصر',
    countryCode: 'EG',
    landmark: 'برج القاهرة',
    description:
      'برج خرساني بارتفاع ١٨٧ متراً على جزيرة الزمالك وسط النيل، صمّمه نعوم شبيب واكتمل عام ١٩٦١ على هيئة زهرة لوتس فرعونية. من سطحه الدوار يظهر النيل وكوبري قصر النيل.',
    image: commons('Cairo Tower and Qasr El Nil Bridge.jpg'),
    credit: credit('Cairo Tower and Qasr El Nil Bridge.jpg'),
    latitude: 30.0444,
    longitude: 31.2357,
    aliases: ['القاهرة', 'القاهره', 'مصر', 'cairo', 'giza', 'الجيزة', 'برج القاهرة', 'cairo tower'],
    focus: '55% 42%',
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
    id: 'hurghada',
    city: 'الغردقة',
    cityEn: 'Hurghada',
    country: 'مصر',
    countryCode: 'EG',
    landmark: 'شعاب البحر الأحمر',
    description:
      'مياه فيروزية ضحلة وأرصفة خشبية تمتد فوق الشعاب المرجانية، ومراكب حية تغادر نحو الجزر. الغردقة أول مدينة غوص على البحر الأحمر، وشمسها لا تغيب كثيراً.',
    image: commons('Red sea4 - panoramio.jpg'),
    credit: credit('Red sea4 - panoramio.jpg'),
    latitude: 27.2579,
    longitude: 33.8116,
    aliases: ['الغردقة', 'الغردقه', 'hurghada', 'الغردقه البحر الاحمر'],
    focus: '50% 62%',
    zoom: 1.45,
  },
  {
    id: 'luxor',
    city: 'الأقصر',
    cityEn: 'Luxor',
    country: 'مصر',
    countryCode: 'EG',
    landmark: 'معبد الكرنك',
    description:
      'طريق الكباش المؤدي إلى صرح معبد الكرنك، حيث بدأ البناء قبل نحو أربعة آلاف عام ولم يتوقف قروناً. الأقصر أكبر متحف مفتوح في العالم.',
    image: commons('Templo de Karnak, Luxor, Egipto, 2022-04-03, DD 139.jpg'),
    credit: credit('Templo de Karnak, Luxor, Egipto, 2022-04-03, DD 139.jpg'),
    latitude: 25.6872,
    longitude: 32.6396,
    aliases: ['الأقصر', 'الاقصر', 'اقصر', 'luxor', 'الاقصر مصر'],
    focus: '50% 50%',
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
  {
    id: 'london',
    city: 'لندن',
    cityEn: 'London',
    country: 'المملكة المتحدة',
    countryCode: 'GB',
    landmark: 'برج لندن وبيغ بن',
    description:
      'جسر برج لندن يفتح ذراعيه فوق نهر التايمز منذ 1894، وعلى مرمى النظر يقف بيغ بن حارساً على مقاعد البرلمان. في الغسق يتحول النهر إلى مرآة تنعكس عليها أضواء المدينة.',
    image: commons('Tower Bridge from the Shard London Bridge. Evening 2019-09-22.jpg'),
    credit: credit('Tower Bridge from the Shard London Bridge. Evening 2019-09-22.jpg'),
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    aliases: ['لندن', 'لندن الكبرى', 'london'],
  },
  {
    id: 'paris',
    city: 'باريس',
    cityEn: 'Paris',
    country: 'فرنسا',
    countryCode: 'FR',
    landmark: 'برج إيفل',
    description:
      'برج إيفل يرفع 330 متراً من الحديد فوق حدائق شامب دي مارس، وقد رفضه أهل باريس أول الأمر ثم صار رمزها. عند الغروب يشتعل البرج بالذهب فوق أسطح المدينة الرمادية.',
    image: commons('Eiffel Tower sunset skyline (Unsplash).jpg'),
    credit: credit('Eiffel Tower sunset skyline (Unsplash).jpg'),
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    aliases: ['باريس', 'paris'],
  },
  {
    id: 'rome',
    city: 'روما',
    cityEn: 'Rome',
    country: 'إيطاليا',
    countryCode: 'IT',
    landmark: 'الكولوسيوم',
    description:
      'الكولوسيوم، أكبر مدرّج في الإمبراطورية الرومانية، كان يتسع لخمسين ألف متفرج قبل ألفي عام. مع غروب الشمس تتحول حجارته إلى لون العنبر ويظهر قوس قسطنطين في الخلف.',
    image: commons('Colosseum Rome at evening.JPG'),
    credit: credit('Colosseum Rome at evening.JPG'),
    latitude: 41.9028,
    longitude: 12.4964,
    timezone: 'Europe/Rome',
    aliases: ['روما', 'rome', 'roma'],
  },
  {
    id: 'istanbul',
    city: 'إسطنبول',
    cityEn: 'Istanbul',
    country: 'تركيا',
    countryCode: 'TR',
    landmark: 'آيا صوفيا ومضيق البوسفور',
    description:
      'آيا صوفيا بقبتها العظيمة تقف على الضفة الأوروبية للبوسفور، ومآذن المدينة ترسم خط الأفق عند الغروب. العبارات تعبر بين قارتين تحت سماء واحدة.',
    image: commons('Sultan Ahmed Mosque and Hagia Sophia by sun down.JPG'),
    credit: credit('Sultan Ahmed Mosque and Hagia Sophia by sun down.JPG'),
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: 'Europe/Istanbul',
    aliases: ['إسطنبول', 'اسطنبول', 'استانبول', 'istanbul'],
  },
  {
    id: 'berlin',
    city: 'برلين',
    cityEn: 'Berlin',
    country: 'ألمانيا',
    countryCode: 'DE',
    landmark: 'بوابة براندنبورغ',
    description:
      'بوابة براندنبورغ، شاهدة على قرنين من تاريخ أوروبا، تغلق محور شارع أونتر دن ليندن. ليلاً تُضاء أعمدتها وتصبح الساحة نقطة التقاء المدينة.',
    image: commons('Brandenburg gate Berlin at night 2022-12-09 01.jpg'),
    credit: credit('Brandenburg gate Berlin at night 2022-12-09 01.jpg'),
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
    aliases: ['برلين', 'berlin'],
  },
  {
    id: 'madrid',
    city: 'مدريد',
    cityEn: 'Madrid',
    country: 'إسبانيا',
    countryCode: 'ES',
    landmark: 'ساحة مايور والقصر الملكي',
    description:
      'ساحة مايور، التي بُنيت في القرن السابع عشر، تحيط بها أروقة من ثلاث طبقات ونوافذ خشبية. مساءً تضيء الفوانيس الحجر وتصدح أصوات الناس حتى منتصف الليل.',
    image: commons('Plaza Mayor - Madrid - Enero 2026 01.jpg'),
    credit: credit('Plaza Mayor - Madrid - Enero 2026 01.jpg'),
    latitude: 40.4168,
    longitude: -3.7038,
    timezone: 'Europe/Madrid',
    aliases: ['مدريد', 'madrid'],
  },
  {
    id: 'moscow',
    city: 'موسكو',
    cityEn: 'Moscow',
    country: 'روسيا',
    countryCode: 'RU',
    landmark: 'كاتدرائية القديس باسيل',
    description:
      'كاتدرائية القديس باسيل بقبابها التسع الملوّنة تغلق الساحة الحمراء، وقد بُنيت بأمر إيفان الرهيب في القرن السادس عشر. في الشتاء يستقر الثلج على القباب ويلمع الطوب الأحمر تحتها.',
    image: commons('Saint Basil\'s Cathedral, Red Square, 2009-06-19-3.jpg'),
    credit: credit('Saint Basil\'s Cathedral, Red Square, 2009-06-19-3.jpg'),
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
    aliases: ['موسكو', 'moscow', 'moskva'],
  },
  {
    id: 'amsterdam',
    city: 'أمستردام',
    cityEn: 'Amsterdam',
    country: 'هولندا',
    countryCode: 'NL',
    landmark: 'قنوات أمستردام',
    description:
      'قنوات أمستردام، التي حُفرت في القرن السابع عشر، تصطف على جانبيها بيوت تجارية ضيقة بأسقف جملونية. عند الغروب تنعكس الواجهات الطوبية في الماء وتصمت المدينة إلا من صوت الدراجات.',
    image: commons('Amsterdam Evening - Flickr - radkuch.13.jpg'),
    credit: credit('Amsterdam Evening - Flickr - radkuch.13.jpg'),
    latitude: 52.3676,
    longitude: 4.9041,
    timezone: 'Europe/Amsterdam',
    aliases: ['أمستردام', 'امستردام', 'amsterdam'],
  },
  {
    id: 'athens',
    city: 'أثينا',
    cityEn: 'Athens',
    country: 'اليونان',
    countryCode: 'GR',
    landmark: 'الأكروبوليس',
    description:
      'الأكروبوليس يقف على صخرة ترتفع 156 متراً فوق أثينا، والبارثينون في قمته منذ 2400 عام. عند الغروب يتحول الرخام إلى لون العسل وتمتد المدينة حتى البحر.',
    image: commons('Attica 06-13 Athens 50 View from Philopappos - Acropolis Hill.jpg'),
    credit: credit('Attica 06-13 Athens 50 View from Philopappos - Acropolis Hill.jpg'),
    latitude: 37.9838,
    longitude: 23.7275,
    timezone: 'Europe/Athens',
    aliases: ['أثينا', 'اثينا', 'athens', 'athina'],
  },
  {
    id: 'new-york',
    city: 'نيويورك',
    cityEn: 'New York',
    country: 'الولايات المتحدة',
    countryCode: 'US',
    landmark: 'أفق مانهاتن',
    description:
      'أفق مانهاتن يرتفع من الماء كأنه جدار من الضوء، من إمباير ستيت إلى مركز التجارة العالمي. عند الغسق يتحول النهر إلى شريط فضي وتشتعل النوافذ واحدة بعد الأخرى.',
    image: commons('New York City Skyline from Brooklyn.jpg'),
    credit: credit('New York City Skyline from Brooklyn.jpg'),
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    aliases: ['نيويورك', 'نيو يورك', 'نيويورك سيتي', 'new york', 'new york city', 'manhattan'],
  },
  {
    id: 'los-angeles',
    city: 'لوس أنجلوس',
    cityEn: 'Los Angeles',
    country: 'الولايات المتحدة',
    countryCode: 'US',
    landmark: 'أفق وسط المدينة',
    description:
      'وسط لوس أنجلوس يرفع أبراجه الزجاجية من السهل، وخلفه تلال هوليوود بحروفها البيضاء. عند الغروب يتحول الأفق إلى وردي فوق الطرق السريعة.',
    image: commons('Skyline of Los Angeles, Downtown Los Angeles, California 13.jpg'),
    credit: credit('Skyline of Los Angeles, Downtown Los Angeles, California 13.jpg'),
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
    aliases: ['لوس أنجلوس', 'لوس انجلوس', 'los angeles'],
  },
  {
    id: 'toronto',
    city: 'تورونتو',
    cityEn: 'Toronto',
    country: 'كندا',
    countryCode: 'CA',
    landmark: 'برج CN',
    description:
      'برج CN يرتفع 553 متراً فوق بحيرة أونتاريو، وكان أطول بناء قائم في العالم عند افتتاحه عام 1976. عند الغروب يقف البرج أسود أمام سماء حمراء وينعكس في الماء.',
    image: commons('Toronto Downtown West, August 20, 2009.JPG'),
    credit: credit('Toronto Downtown West, August 20, 2009.JPG'),
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    focus: 'center 60%', 
    aliases: ['تورونتو', 'toronto'],
  },
  {
    id: 'mexico-city',
    city: 'مكسيكو سيتي',
    cityEn: 'Mexico City',
    country: 'المكسيك',
    countryCode: 'MX',
    landmark: 'قصر الفنون الجميلة',
    description:
      'قصر الفنون الجميلة بقبته البرتقالية وقاعاته الرخامية بُني على أنقاض مدينة الأزتك على ارتفاع 2240 متراً. مساءً تُضاء الواجهة ويظهر البركانان في الأفق البعيد.',
    image: commons('Palacio de Bellas Artes, Ciudad de México, México, 2015-07-18, DD 10.JPG'),
    credit: credit('Palacio de Bellas Artes, Ciudad de México, México, 2015-07-18, DD 10.JPG'),
    latitude: 19.4326,
    longitude: -99.1332,
    timezone: 'America/Mexico_City',
    aliases: ['مكسيكو سيتي', 'مكسيكو', 'مكسيكو سيتى', 'mexico city', 'ciudad de mexico'],
  },
  {
    id: 'rio',
    city: 'ريو دي جانيرو',
    cityEn: 'Rio de Janeiro',
    country: 'البرازيل',
    countryCode: 'BR',
    landmark: 'تمثال المسيح الفادي',
    description:
      'تمثال المسيح الفادي يقف بـ38 متراً على قمة كوركوفادو، ويطل على خليج غوانابارا وجبل السكر. عند الغروب يغطي الضباب الخليج ويبقى التمثال مضاءً فوق السحاب.',
    image: commons('Rio de Janeiro skyline and Sugarloaf Mountain at sunset, Brazil 4.jpg'),
    credit: credit('Rio de Janeiro skyline and Sugarloaf Mountain at sunset, Brazil 4.jpg'),
    latitude: -22.9068,
    longitude: -43.1729,
    timezone: 'America/Sao_Paulo',
    aliases: ['ريو دي جانيرو', 'ريو', 'rio de janeiro', 'rio'],
  },
  {
    id: 'buenos-aires',
    city: 'بوينس آيرس',
    cityEn: 'Buenos Aires',
    country: 'الأرجنتين',
    countryCode: 'AR',
    landmark: 'المسلة',
    description:
      'المسلة ترتفع 67 متراً في وسط شارع 9 دي خوليو، أوسع شارع في العالم، منذ 1936. ليلاً يمر تحتها ضوء المسارح وتظل واقفة كعلامة على المدينة.',
    image: commons('Obelisco de Buenos Aires (2), AA 2014.jpg'),
    credit: credit('Obelisco de Buenos Aires (2), AA 2014.jpg'),
    latitude: -34.6037,
    longitude: -58.3816,
    timezone: 'America/Argentina/Buenos_Aires',
    aliases: ['بوينس آيرس', 'بوينوس ايرس', 'buenos aires'],
  },
  {
    id: 'tokyo',
    city: 'طوكيو',
    cityEn: 'Tokyo',
    country: 'اليابان',
    countryCode: 'JP',
    landmark: 'برج طوكيو وشيبويا',
    description:
      'طوكيو مدينة من طبقات: أبراج شينجوكو الزجاجية، وبرج طوكيو الأحمر، وشوارع شيبويا التي لا تنام. عند الغروب تشتعل اللافتات النيونية ويصبح الأفق بحراً من الضوء.',
    image: commons('Shinjuku nights - Flickr - Franck Michel.jpg'),
    credit: credit('Shinjuku nights - Flickr - Franck Michel.jpg'),
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    aliases: ['طوكيو', 'tokyo'],
  },
  {
    id: 'beijing',
    city: 'بكين',
    cityEn: 'Beijing',
    country: 'الصين',
    countryCode: 'CN',
    landmark: 'المدينة المحرمة',
    description:
      'المدينة المحرمة، مقر الأباطرة على مدى خمسة قرون، تضم 980 مبنى تحت أسقف من القرميد الذهبي. من تلة جينغشان يمتد بحر الأسقف حتى الأفق.',
    image: commons('Forbidden City Panorama 2.jpg'),
    credit: credit('Forbidden City Panorama 2.jpg'),
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: 'Asia/Shanghai',
    aliases: ['بكين', 'بيجينغ', 'beijing', 'peking'],
  },
  {
    id: 'shanghai',
    city: 'شنغهاي',
    cityEn: 'Shanghai',
    country: 'الصين',
    countryCode: 'CN',
    landmark: 'أفق بودونغ',
    description:
      'أفق بودونغ يجمع برج شنغهاي وبرج اللؤلؤة الشرقية وبرج جينماو، ثلاثة أجيال من الأبراج على ضفة واحدة. ليلاً تنعكس الأضواء في نهر هوانغبو وتتحول الواجهة إلى شاشة.',
    image: commons('Lujiazui skyline by night from Bund, fully illuminated.jpg'),
    credit: credit('Lujiazui skyline by night from Bund, fully illuminated.jpg'),
    latitude: 31.2304,
    longitude: 121.4737,
    timezone: 'Asia/Shanghai',
    aliases: ['شنغهاي', 'شانغهاي', 'shanghai'],
  },
  {
    id: 'seoul',
    city: 'سيول',
    cityEn: 'Seoul',
    country: 'كوريا الجنوبية',
    countryCode: 'KR',
    landmark: 'برج سيول N',
    description:
      'برج سيول N يقف على جبل نامسان في قلب العاصمة، وتحته يعبر نهر هان المدينة بين عشرات الجسور المضاءة. ليلاً يمتلئ الأفق بالضوء الأزرق والأحمر حتى الجبال.',
    image: commons('Seoul night skyline 2018.jpg'),
    credit: credit('Seoul night skyline 2018.jpg'),
    latitude: 37.5665,
    longitude: 126.978,
    timezone: 'Asia/Seoul',
    aliases: ['سيول', 'سول', 'seoul'],
  },
  {
    id: 'singapore',
    city: 'سنغافورة',
    cityEn: 'Singapore',
    country: 'سنغافورة',
    countryCode: 'SG',
    landmark: 'مارينا باي ساندز',
    description:
      'مارينا باي ساندز يرفع ثلاثة أبراج وسطحاً يشبه سفينة من قلب الماء في وسط المدينة. ليلاً تُضاء الحدائق والزهرة البيضاء وتنعكس في الخليج.',
    image: commons('Singapore (SG), ArtScience Museum and Marina Bay Sands Hotel -- 2019 -- 4679.jpg'),
    credit: credit('Singapore (SG), ArtScience Museum and Marina Bay Sands Hotel -- 2019 -- 4679.jpg'),
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    aliases: ['سنغافورة', 'سنغفورة', 'singapore'],
  },
  {
    id: 'bangkok',
    city: 'بانكوك',
    cityEn: 'Bangkok',
    country: 'تايلاند',
    countryCode: 'TH',
    landmark: 'معبد وات أرون',
    description:
      'وات أرون، معبد الفجر، يقف على ضفة نهر تشاو فرايا وبرجه المركزي مغطى بقطع الخزف الملوّن. عند الغروب تعبر القوارب أمامه ويتحول النهر إلى لون النحاس.',
    image: commons('Wat Arun Ratchawararam and the Royal Barge Procession.jpg'),
    credit: credit('Wat Arun Ratchawararam and the Royal Barge Procession.jpg'),
    latitude: 13.7563,
    longitude: 100.5018,
    timezone: 'Asia/Bangkok',
    aliases: ['بانكوك', 'بانكوك تايلاند', 'bangkok'],
  },
  {
    id: 'mumbai',
    city: 'مومباي',
    cityEn: 'Mumbai',
    country: 'الهند',
    countryCode: 'IN',
    landmark: 'بوابة الهند',
    description:
      'بوابة الهند، القوس البازلتي الذي بُني عام 1924 على واجهة البحر، تقف عند نهاية شارع كولابا. مساءً يتحول الحجر إلى برتقالي عميق تحت أضواء الميناء.',
    image: commons('Gateway of India in the evening, Mumbai, India.jpg'),
    credit: credit('Gateway of India in the evening, Mumbai, India.jpg'),
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    aliases: ['مومباي', 'بومباي', 'mumbai', 'bombay'],
  },
  {
    id: 'delhi',
    city: 'نيودلهي',
    cityEn: 'New Delhi',
    country: 'الهند',
    countryCode: 'IN',
    landmark: 'بوابة الهند التذكارية',
    description:
      'بوابة الهند التذكارية، القوس الحجري الذي يبلغ 42 متراً، تغلق محور شارع كارتافيا في قلب العاصمة. عند الغروب يتوهج الحجر الرملي وتمتلئ المروج بالناس.',
    image: commons('India Gate on an evening.jpg'),
    credit: credit('India Gate on an evening.jpg'),
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    aliases: ['نيودلهي', 'نيو دلهي', 'دلهي', 'new delhi', 'delhi'],
  },
  {
    id: 'kuala-lumpur',
    city: 'كوالالمبور',
    cityEn: 'Kuala Lumpur',
    country: 'ماليزيا',
    countryCode: 'MY',
    landmark: 'أبراج بتروناس',
    description:
      'أبراج بتروناس التوأم ترتفع 452 متراً، ويصل بينهما جسر مزدوج في الطابق الحادي والأربعين. ليلاً تلمع واجهاتها الفولاذية فوق حدائق KLCC.',
    image: commons('Kuala Lumpur, Malaysia, Petronas Towers at night, glitter.jpg'),
    credit: credit('Kuala Lumpur, Malaysia, Petronas Towers at night, glitter.jpg'),
    latitude: 3.139,
    longitude: 101.6869,
    timezone: 'Asia/Kuala_Lumpur',
    aliases: ['كوالالمبور', 'كوالا لمبور', 'kuala lumpur'],
  },
  {
    id: 'jakarta',
    city: 'جاكرتا',
    cityEn: 'Jakarta',
    country: 'إندونيسيا',
    countryCode: 'ID',
    landmark: 'نصب موناس الوطني',
    description:
      'نصب موناس الوطني يرتفع 137 متراً في قلب جاكرتا، وفي قمته شعلة مطلية بالذهب. عند الغروب تتحول المدينة إلى بحر من الأضواء تحت سماء استوائية سريعة المطر.',
    image: commons('Jakarta Panorama.jpg'),
    credit: credit('Jakarta Panorama.jpg'),
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    aliases: ['جاكرتا', 'jakarta'],
  },
  {
    id: 'sydney',
    city: 'سيدني',
    cityEn: 'Sydney',
    country: 'أستراليا',
    countryCode: 'AU',
    landmark: 'دار الأوبرا',
    description:
      'دار أوبرا سيدني بأصدافها البيضاء تجلس على الماء في الخليج، وخلفها يقوس جسر الميناء. عند الغروب تتحول الأصداف إلى وردي وتضاء من الداخل.',
    image: commons('Sydney Opera House and Harbour Bridge Dusk (2) 2019-06-21.jpg'),
    credit: credit('Sydney Opera House and Harbour Bridge Dusk (2) 2019-06-21.jpg'),
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    aliases: ['سيدني', 'sydney'],
  },
  {
    id: 'cape-town',
    city: 'كيب تاون',
    cityEn: 'Cape Town',
    country: 'جنوب أفريقيا',
    countryCode: 'ZA',
    landmark: 'جبل الطاولة',
    description:
      'جبل الطاولة، بقمته المسطحة على ارتفاع 1085 متراً، يقف خلف المدينة كأنه مائدة عملاقة. عند الفجر تتدفق سحابة الطاولة الشهيرة على الحافة ويسقط ضوء وردي على الشوارع.',
    image: commons('Cape Town dawn cityscape with Table Mountain.jpg'),
    credit: credit('Cape Town dawn cityscape with Table Mountain.jpg'),
    latitude: -33.9249,
    longitude: 18.4241,
    timezone: 'Africa/Johannesburg',
    aliases: ['كيب تاون', 'كيب تاون جنوب أفريقيا', 'cape town'],
  },
  {
    id: 'lagos',
    city: 'لاغوس',
    cityEn: 'Lagos',
    country: 'نيجيريا',
    countryCode: 'NG',
    landmark: 'جسر ثيرد مينلاند',
    description:
      'جسر ثيرد مينلاند، أطول جسر في أفريقيا بطول 11.8 كيلومتر، يعبر بحيرة لاغوس ويربط الجزيرة بالبر الرئيسي. ليلاً يتحول إلى خط من الضوء فوق ماء أسود.',
    image: commons('A long Exposure of the Third Mainland bridge in front of University of lagos.jpg'),
    credit: credit('A long Exposure of the Third Mainland bridge in front of University of lagos.jpg'),
    latitude: 6.5244,
    longitude: 3.3792,
    timezone: 'Africa/Lagos',
    aliases: ['لاغوس', 'لاجوس', 'lagos'],
  },
  {
    id: 'nairobi',
    city: 'نيروبي',
    cityEn: 'Nairobi',
    country: 'كينيا',
    countryCode: 'KE',
    landmark: 'أفق نيروبي',
    description:
      'نيروبي هي العاصمة الوحيدة التي تجاور محمية طبيعية كاملة، وأفقها يرتفع خلف سهول السافانا مباشرة. عند الغروب يهبط الضوء الذهبي على العشب وتبدو المدينة بعيدة كسراب.',
    image: commons('Buffalo Nairobi Skyline Savannah Kenya May19 R1600769.jpg'),
    credit: credit('Buffalo Nairobi Skyline Savannah Kenya May19 R1600769.jpg'),
    latitude: -1.2921,
    longitude: 36.8219,
    timezone: 'Africa/Nairobi',
    aliases: ['نيروبي', 'nairobi'],
  },
  {
    id: 'karachi',
    city: 'كراتشي',
    cityEn: 'Karachi',
    country: 'باكستان',
    countryCode: 'PK',
    landmark: 'ضريح قائد أعظم',
    description:
      'ضريح قائد أعظم بقبته البيضاء من الرخام يقف على تل فوق كراتشي منذ 1971. عند الغروب يلمع الرخام الأبيض ويبدو الضريح كأنه يطفو فوق المدينة.',
    image: commons('Mazar-e-Quaid Karachi.jpg'),
    credit: credit('Mazar-e-Quaid Karachi.jpg'),
    latitude: 24.8607,
    longitude: 67.0011,
    timezone: 'Asia/Karachi',
    aliases: ['كراتشي', 'karachi'],
  },
];

/** Routes remote photos through the cached, allow-listed image proxy. */
export function sceneImageSrc(url: string): string {
  return `/api/scene?u=${encodeURIComponent(url)}`;
}

/** Used when a city has no curated landmark yet. */
export const FALLBACK_SCENE = {
  landmark: 'أفق مفتوح',
  description:
    'مدينة أخرى تحت سماء واحدة. لا توجد بعد صورة أرشيفية لهذه المدينة، لكن الطقس هنا حقيقي وحيّ الآن.',
  image: commons('Sunset Beacons at the Edge of Conwy Bay, North Wales.jpg'),
  credit: credit('Sunset Beacons at the Edge of Conwy Bay, North Wales.jpg'),
};

const FALLBACK_TROPICAL = {
  image: commons('Palm (194041349).jpeg'),
  credit: credit('Palm (194041349).jpeg'),
};

const FALLBACK_NORDIC = {
  image: commons('Snow covers Hyatt Lake (54338859210).jpg'),
  credit: credit('Snow covers Hyatt Lake (54338859210).jpg'),
};

/** Neutral backdrop chosen by latitude band so the scene matches the climate. */
export function fallbackSceneImage(latitude?: number) {
  if (typeof latitude !== 'number') return FALLBACK_SCENE;
  const abs = Math.abs(latitude);
  if (abs < 23.5) return FALLBACK_TROPICAL;
  if (abs > 55) return FALLBACK_NORDIC;
  return FALLBACK_SCENE;
}

export const FEATURED_IDS = [
  'cairo',
  'dubai',
  'london',
  'paris',
  'new-york',
  'tokyo',
  'istanbul',
  'sydney',
];

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
    timezone: item.timezone,
  };
}
