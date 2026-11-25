import type { Lang } from './i18n';

export type LandmarkText = {
  city: string;
  country: string;
  landmark: string;
  description: string;
};

type TranslatedLang = Exclude<Lang, 'ar'>;

/** Editorial copy for every curated city in the four non-Arabic UI languages. */
export const LANDMARK_I18N: Record<TranslatedLang, Record<string, LandmarkText>> = {
  en: {
    cairo: {
      city: 'Cairo',
      country: 'Egypt',
      landmark: 'The Pyramids of Giza',
      description:
        'The last surviving wonder of the ancient world, standing on the Giza plateau for more than 4,500 years. At sunset the stone turns a warm gold that floods the desert.',
    },
    dubai: {
      city: 'Dubai',
      country: 'United Arab Emirates',
      landmark: 'Burj Khalifa and the Gulf skyline',
      description:
        'Dubai’s skyline crowned by Burj Khalifa, the tallest structure ever built at 828 metres, above lights mirrored in the Arabian Gulf.',
    },
    riyadh: {
      city: 'Riyadh',
      country: 'Saudi Arabia',
      landmark: 'Kingdom Centre',
      description:
        'The beating heart of Arabia, where the Kingdom Centre and its famous sky bridge rise above a city that never stops growing.',
    },
    alexandria: {
      city: 'Alexandria',
      country: 'Egypt',
      landmark: 'Qaitbay Citadel',
      description:
        'Qaitbay Citadel stands on the site of the ancient Lighthouse of Alexandria, one of the seven wonders, facing a restless Mediterranean.',
    },
    makkah: {
      city: 'Makkah',
      country: 'Saudi Arabia',
      landmark: 'The Grand Mosque and the Kaaba',
      description:
        'The Kaaba at the heart of the Grand Mosque, the qibla of more than a billion Muslims, encircled by pilgrims day and night for fourteen centuries.',
    },
    madinah: {
      city: 'Madinah',
      country: 'Saudi Arabia',
      landmark: "The Prophet's Mosque",
      description:
        "The Prophet's Mosque and its green dome, the second holiest site in Islam, where soft light falls across wide courtyards at dawn and dusk.",
    },
    jeddah: {
      city: 'Jeddah',
      country: 'Saudi Arabia',
      landmark: 'Al-Rahma Floating Mosque',
      description:
        'The floating mosque on the Jeddah shore seems to drift on the Red Sea at high tide, blue water on every side.',
    },
    abudhabi: {
      city: 'Abu Dhabi',
      country: 'United Arab Emirates',
      landmark: 'The Abu Dhabi Corniche',
      description:
        'The towers of Abu Dhabi along the Gulf corniche — a fishing village turned modern capital in only fifty years.',
    },
    doha: {
      city: 'Doha',
      country: 'Qatar',
      landmark: 'West Bay towers',
      description:
        'Doha’s West Bay towers draw a bold architectural line along the Gulf coast and glow as a single block of light after sunset.',
    },
    kuwait: {
      city: 'Kuwait City',
      country: 'Kuwait',
      landmark: 'The Kuwait Towers',
      description:
        'The Kuwait Towers on the Gulf shore, an architectural icon by Jørn Utzon built in 1979, rising from the water like three futuristic minarets.',
    },
    manama: {
      city: 'Manama',
      country: 'Bahrain',
      landmark: 'Bahrain World Trade Center',
      description:
        'The Bahrain World Trade Center, the first skyscraper to weave wind turbines into its structure, rising above Manama harbour.',
    },
    muscat: {
      city: 'Muscat',
      country: 'Oman',
      landmark: 'Sultan Qaboos Grand Mosque',
      description:
        'The Sultan Qaboos Grand Mosque, a masterpiece of marble and Islamic ornament under Omani skies, its minarets drawing long shadows on the sand at sunset.',
    },
    amman: {
      city: 'Amman',
      country: 'Jordan',
      landmark: 'The Roman Theatre',
      description:
        'The Roman Theatre in the heart of Amman, carved into the hill in the 2nd century AD, overlooking white houses stacked across the hills.',
    },
    petra: {
      city: 'Petra',
      country: 'Jordan',
      landmark: 'Al-Khazneh, the Treasury',
      description:
        'Al-Khazneh in Petra, the rose-red Nabataean city carved into rock, revealed all at once at the end of the Siq.',
    },
    beirut: {
      city: 'Beirut',
      country: 'Lebanon',
      landmark: 'Pigeon Rocks',
      description:
        'The Pigeon Rocks of Beirut, a stone arch standing in the Mediterranean that catches the last light every evening.',
    },
    damascus: {
      city: 'Damascus',
      country: 'Syria',
      landmark: 'The Umayyad Mosque',
      description:
        'The Great Umayyad Mosque of Damascus, one of the oldest and most majestic mosques in the world, with its vast courtyard, marble columns and soaring minarets.',
    },
    baghdad: {
      city: 'Baghdad',
      country: 'Iraq',
      landmark: 'Al-Shaheed Monument',
      description:
        'Two turquoise domes split open around a single heart: the Martyrs’ Monument on the Tigris, a witness to Baghdad’s memory.',
    },
    casablanca: {
      city: 'Casablanca',
      country: 'Morocco',
      landmark: 'Hassan II Mosque',
      description:
        'The Hassan II Mosque on the edge of the Atlantic, its 210-metre minaret the tallest in the world, catching the sun on marble at every sunset.',
    },
    marrakech: {
      city: 'Marrakech',
      country: 'Morocco',
      landmark: 'The red city and the Atlas',
      description:
        'Marrakech at the foot of the Atlas, where the ochre of the medina meets snow on the peaks and the call to prayer rises over Jemaa el-Fna.',
    },
    tunis: {
      city: 'Tunis',
      country: 'Tunisia',
      landmark: 'Sidi Bou Said',
      description:
        'Sidi Bou Said above the Gulf of Tunis: white houses and blue doors over the Mediterranean, hills turning blue in the afternoon.',
    },
    sanaa: {
      city: 'Sanaa',
      country: 'Yemen',
      landmark: 'The Old City',
      description:
        'Old Sanaa, its tower houses trimmed with white gypsum, more than a thousand years old and rising like a forest of stone.',
    },
    alula: {
      city: 'AlUla',
      country: 'Saudi Arabia',
      landmark: 'Qasr al-Farid, Hegra',
      description:
        'Qasr al-Farid in Hegra, a Nabataean tomb carved from a single rock two thousand years ago, standing alone in the open desert.',
    },
  },
  de: {
    cairo: {
      city: 'Kairo',
      country: 'Ägypten',
      landmark: 'Die Pyramiden von Gizeh',
      description:
        'Das letzte erhaltene Weltwunder der Antike, seit über 4.500 Jahren auf dem Plateau von Gizeh. Bei Sonnenuntergang färbt sich der Stein in warmes Gold.',
    },
    dubai: {
      city: 'Dubai',
      country: 'Vereinigte Arabische Emirate',
      landmark: 'Burj Khalifa und die Skyline des Golfs',
      description:
        'Dubais Skyline mit dem Burj Khalifa, mit 828 Metern das höchste Bauwerk der Welt, über Lichtern, die sich im Golf spiegeln.',
    },
    riyadh: {
      city: 'Riad',
      country: 'Saudi-Arabien',
      landmark: 'Kingdom Centre',
      description:
        'Das Herz Arabiens, wo das Kingdom Centre mit seiner berühmten Himmelsbrücke über einer ständig wachsenden Stadt steht.',
    },
    alexandria: {
      city: 'Alexandria',
      country: 'Ägypten',
      landmark: 'Zitadelle von Qaitbay',
      description:
        'Die Zitadelle von Qaitbay steht auf dem Grund des antiken Leuchtturms von Alexandria und blickt auf ein ruheloses Mittelmeer.',
    },
    makkah: {
      city: 'Mekka',
      country: 'Saudi-Arabien',
      landmark: 'Die Große Moschee und die Kaaba',
      description:
        'Die Kaaba im Herzen der Großen Moschee, Qibla für über eine Milliarde Muslime, seit vierzehn Jahrhunderten Tag und Nacht umrundet.',
    },
    madinah: {
      city: 'Medina',
      country: 'Saudi-Arabien',
      landmark: 'Die Prophetenmoschee',
      description:
        'Die Prophetenmoschee mit ihrer grünen Kuppel, der zweitheiligste Ort des Islam, in dem Morgen- und Abendlicht über die weiten Höfe fällt.',
    },
    jeddah: {
      city: 'Dschidda',
      country: 'Saudi-Arabien',
      landmark: 'Die schwimmende Moschee',
      description:
        'Die Al-Rahma-Moschee scheint bei Flut auf dem Roten Meer zu treiben, ringsum nur blaues Wasser.',
    },
    abudhabi: {
      city: 'Abu Dhabi',
      country: 'Vereinigte Arabische Emirate',
      landmark: 'Die Corniche von Abu Dhabi',
      description:
        'Die Türme Abu Dhabis an der Corniche — aus einem Fischerdorf wurde in nur fünfzig Jahren eine moderne Hauptstadt.',
    },
    doha: {
      city: 'Doha',
      country: 'Katar',
      landmark: 'Die Türme der West Bay',
      description:
        'Die Türme der West Bay ziehen eine kühne Linie an der Golfküste und leuchten nach Sonnenuntergang wie ein einziger Lichtblock.',
    },
    kuwait: {
      city: 'Kuwait-Stadt',
      country: 'Kuwait',
      landmark: 'Die Kuwait Towers',
      description:
        'Die Kuwait Towers an der Golfküste, ein Wahrzeichen von Jørn Utzon (1979), ragen wie drei futuristische Minarette aus dem Wasser.',
    },
    manama: {
      city: 'Manama',
      country: 'Bahrain',
      landmark: 'Bahrain World Trade Center',
      description:
        'Das Bahrain World Trade Center, der erste Wolkenkratzer mit integrierten Windturbinen, erhebt sich über dem Hafen von Manama.',
    },
    muscat: {
      city: 'Maskat',
      country: 'Oman',
      landmark: 'Große Sultan-Qabus-Moschee',
      description:
        'Die Große Sultan-Qabus-Moschee, ein Meisterwerk aus Marmor und islamischer Ornamentik, deren Minarette bei Sonnenuntergang lange Schatten werfen.',
    },
    amman: {
      city: 'Amman',
      country: 'Jordanien',
      landmark: 'Das römische Theater',
      description:
        'Das römische Theater im Herzen Ammans, im 2. Jahrhundert n. Chr. in den Hang gehauen, blickt auf weiße Häuser, die sich über die Hügel stapeln.',
    },
    petra: {
      city: 'Petra',
      country: 'Jordanien',
      landmark: 'Al-Khazneh (Das Schatzhaus)',
      description:
        'Al-Khazneh in Petra, die rosarote Nabatäerstadt aus dem Fels, erscheint am Ende des Siq ganz plötzlich.',
    },
    beirut: {
      city: 'Beirut',
      country: 'Libanon',
      landmark: 'Die Taubenfelsen',
      description:
        'Die Taubenfelsen von Beirut, ein Steinbogen im Mittelmeer, der jeden Abend das letzte Licht einfängt.',
    },
    damascus: {
      city: 'Damaskus',
      country: 'Syrien',
      landmark: 'Die Umayyaden-Moschee',
      description:
        'Die große Umayyaden-Moschee von Damaskus, eine der ältesten und ehrwürdigsten Moscheen der Welt, mit weitem Hof, Marmorsäulen und hohen Minaretten.',
    },
    baghdad: {
      city: 'Bagdad',
      country: 'Irak',
      landmark: 'Al-Shaheed-Denkmal',
      description:
        'Zwei türkisfarbene Kuppeln, die sich um ein einziges Herz öffnen: das Märtyrerdenkmal am Tigris, Zeuge der Erinnerung Bagdads.',
    },
    casablanca: {
      city: 'Casablanca',
      country: 'Marokko',
      landmark: 'Hassan-II.-Moschee',
      description:
        'Die Hassan-II.-Moschee am Atlantik, deren 210 Meter hohes Minarett das höchste der Welt ist und bei jedem Sonnenuntergang auf Marmor glänzt.',
    },
    marrakech: {
      city: 'Marrakesch',
      country: 'Marokko',
      landmark: 'Die rote Stadt und der Atlas',
      description:
        'Marrakesch am Fuße des Atlas, wo das Ocker der Medina auf Schnee auf den Gipfeln trifft und der Gebetsruf über den Jemaa el-Fna steigt.',
    },
    tunis: {
      city: 'Tunis',
      country: 'Tunesien',
      landmark: 'Sidi Bou Said',
      description:
        'Sidi Bou Said über dem Golf von Tunis: weiße Häuser und blaue Türen über dem Mittelmeer, Hügel, die am Nachmittag blau leuchten.',
    },
    sanaa: {
      city: 'Sanaa',
      country: 'Jemen',
      landmark: 'Die Altstadt',
      description:
        'Die Altstadt von Sanaa, ihre Turmhäuser mit weißem Gips verziert, über tausend Jahre alt und wie ein Wald aus Stein.',
    },
    alula: {
      city: 'AlUla',
      country: 'Saudi-Arabien',
      landmark: 'Qasr al-Farid, Hegra',
      description:
        'Qasr al-Farid in Hegra, ein nabatäisches Grab, vor zweitausend Jahren aus einem einzigen Fels gehauen, steht allein in der Wüste.',
    },
  },
  ru: {
    cairo: {
      city: 'Каир',
      country: 'Египет',
      landmark: 'Пирамиды Гизы',
      description:
        'Последнее сохранившееся чудо древнего мира, стоящее на плато Гиза более 4500 лет. На закате камень становится тёпло-золотым.',
    },
    dubai: {
      city: 'Дубай',
      country: 'ОАЭ',
      landmark: 'Бурдж-Халифа и панорама залива',
      description:
        'Скайлайн Дубая во главе с Бурдж-Халифой — самым высоким зданием мира высотой 828 метров — над огнями, отражёнными в заливе.',
    },
    riyadh: {
      city: 'Эр-Рияд',
      country: 'Саудовская Аравия',
      landmark: 'Kingdom Centre',
      description:
        'Сердце Аравии: башня Kingdom Centre со знаменитым небесным мостом над городом, который непрерывно растёт.',
    },
    alexandria: {
      city: 'Александрия',
      country: 'Египет',
      landmark: 'Цитадель Кайт-Бей',
      description:
        'Цитадель Кайт-Бей стоит на месте древнего Александрийского маяка и смотрит на неспокойное Средиземное море.',
    },
    makkah: {
      city: 'Мекка',
      country: 'Саудовская Аравия',
      landmark: 'Заповедная мечеть и Кааба',
      description:
        'Кааба в сердце Заповедной мечети — кибла более миллиарда мусульман, вокруг которой днём и ночью идут паломники уже четырнадцать веков.',
    },
    madinah: {
      city: 'Медина',
      country: 'Саудовская Аравия',
      landmark: 'Мечеть Пророка',
      description:
        'Мечеть Пророка с зелёным куполом — вторая святыня ислама, где на рассвете и в сумерках мягкий свет ложится на широкие дворы.',
    },
    jeddah: {
      city: 'Джидда',
      country: 'Саудовская Аравия',
      landmark: 'Плавучая мечеть',
      description:
        'Мечеть Ар-Рахма у берега Джидды кажется плывущей по Красному морю в прилив, вода окружает её со всех сторон.',
    },
    abudhabi: {
      city: 'Абу-Даби',
      country: 'ОАЭ',
      landmark: 'Корниш Абу-Даби',
      description:
        'Башни Абу-Даби на набережной Корниш: рыбацкая деревня превратилась в современную столицу всего за пятьдесят лет.',
    },
    doha: {
      city: 'Доха',
      country: 'Катар',
      landmark: 'Башни Вест-Бэй',
      description:
        'Башни Вест-Бэй в Дохе прочерчивают смелую линию вдоль берега залива и после заката светятся единым блоком света.',
    },
    kuwait: {
      city: 'Эль-Кувейт',
      country: 'Кувейт',
      landmark: 'Кувейтские башни',
      description:
        'Кувейтские башни на берегу залива — символ Йорна Утзона 1979 года, поднимающийся из воды как три футуристических минарета.',
    },
    manama: {
      city: 'Манама',
      country: 'Бахрейн',
      landmark: 'Всемирный торговый центр Бахрейна',
      description:
        'Всемирный торговый центр Бахрейна — первый небоскрёб с ветряными турбинами в конструкции — поднимается над гаванью Манамы.',
    },
    muscat: {
      city: 'Маскат',
      country: 'Оман',
      landmark: 'Большая мечеть султана Кабуса',
      description:
        'Большая мечеть султана Кабуса — шедевр мрамора и исламского орнамента под небом Омана; на закате её минареты бросают длинные тени.',
    },
    amman: {
      city: 'Амман',
      country: 'Иордания',
      landmark: 'Римский театр',
      description:
        'Римский театр в центре Аммана, вырубленный в склоне во II веке, смотрит на белые дома, каскадом спускающиеся по холмам.',
    },
    petra: {
      city: 'Петра',
      country: 'Иордания',
      landmark: 'Аль-Хазне (Сокровищница)',
      description:
        'Аль-Хазне в Петре — розово-красный набатейский город, вырубленный в скале, — открывается внезапно в конце ущелья Сик.',
    },
    beirut: {
      city: 'Бейрут',
      country: 'Ливан',
      landmark: 'Скалы Рауше',
      description:
        'Скалы Рауше в Бейруте — каменная арка в Средиземном море, ловящая последний свет каждый вечер.',
    },
    damascus: {
      city: 'Дамаск',
      country: 'Сирия',
      landmark: 'Омейядская мечеть',
      description:
        'Большая Омейядская мечеть Дамаска — одна из древнейших и величественных мечетей мира с огромным двором, мраморными колоннами и высокими минаретами.',
    },
    baghdad: {
      city: 'Багдад',
      country: 'Ирак',
      landmark: 'Монумент шахидов',
      description:
        'Два бирюзовых купола, раскрывающихся вокруг одного сердца: монумент шахидов на Тигре, свидетель памяти Багдада.',
    },
    casablanca: {
      city: 'Касабланка',
      country: 'Марокко',
      landmark: 'Мечеть Хасана II',
      description:
        'Мечеть Хасана II на краю Атлантики: её минарет высотой 210 метров — самый высокий в мире, и каждый закат играет на мраморе.',
    },
    marrakech: {
      city: 'Марракеш',
      country: 'Марокко',
      landmark: 'Красный город и Атлас',
      description:
        'Марракеш у подножия Атласа, где охра медины встречается со снегом на вершинах, а азан поднимается над площадью Джемаа эль-Фна.',
    },
    tunis: {
      city: 'Тунис',
      country: 'Тунис',
      landmark: 'Сиди-Бу-Саид',
      description:
        'Сиди-Бу-Саид над Тунисским заливом: белые дома и синие двери над Средиземным морем, холмы, синеющие к вечеру.',
    },
    sanaa: {
      city: 'Сана',
      country: 'Йемен',
      landmark: 'Старый город',
      description:
        'Старая Сана с башенными домами в белом гипсе — ей больше тысячи лет, и она поднимается как каменный лес.',
    },
    alula: {
      city: 'Аль-Ула',
      country: 'Саудовская Аравия',
      landmark: 'Каср аль-Фарид, Хегра',
      description:
        'Каср аль-Фарид в Хегре — набатейская гробница, высеченная из цельной скалы две тысячи лет назад, стоит одна в пустыне.',
    },
  },
  it: {
    cairo: {
      city: 'Il Cairo',
      country: 'Egitto',
      landmark: 'Le Piramidi di Giza',
      description:
        'L’ultima meraviglia del mondo antico ancora in piedi, sul plateau di Giza da oltre 4.500 anni. Al tramonto la pietra diventa oro caldo.',
    },
    dubai: {
      city: 'Dubai',
      country: 'Emirati Arabi Uniti',
      landmark: 'Burj Khalifa e lo skyline del Golfo',
      description:
        'Lo skyline di Dubai dominato dal Burj Khalifa, la struttura più alta mai costruita con 828 metri, sopra luci riflesse nel Golfo.',
    },
    riyadh: {
      city: 'Riad',
      country: 'Arabia Saudita',
      landmark: 'Kingdom Centre',
      description:
        'Il cuore pulsante dell’Arabia, dove il Kingdom Centre e il suo celebre ponte sospeso dominano una città in continua crescita.',
    },
    alexandria: {
      city: 'Alessandria',
      country: 'Egitto',
      landmark: 'Cittadella di Qaitbay',
      description:
        'La cittadella di Qaitbay sorge sul sito dell’antico Faro di Alessandria e guarda un Mediterraneo inquieto.',
    },
    makkah: {
      city: 'La Mecca',
      country: 'Arabia Saudita',
      landmark: 'La Grande Moschea e la Kaaba',
      description:
        'La Kaaba nel cuore della Grande Moschea, qibla di oltre un miliardo di musulmani, circondata dai pellegrini da quattordici secoli.',
    },
    madinah: {
      city: 'Medina',
      country: 'Arabia Saudita',
      landmark: 'La Moschea del Profeta',
      description:
        'La Moschea del Profeta con la sua cupola verde, il secondo luogo più sacro dell’Islam, dove all’alba e al tramonto una luce morbida invade i cortili.',
    },
    jeddah: {
      city: 'Gedda',
      country: 'Arabia Saudita',
      landmark: 'La moschea galleggiante',
      description:
        'La moschea Al-Rahma sulla costa di Gedda sembra galleggiare sul Mar Rosso con l’alta marea, circondata d’acqua.',
    },
    abudhabi: {
      city: 'Abu Dhabi',
      country: 'Emirati Arabi Uniti',
      landmark: 'La Corniche di Abu Dhabi',
      description:
        'Le torri di Abu Dhabi lungo la Corniche: da villaggio di pescatori a capitale moderna in soli cinquant’anni.',
    },
    doha: {
      city: 'Doha',
      country: 'Qatar',
      landmark: 'Le torri di West Bay',
      description:
        'Le torri di West Bay disegnano una linea audace sulla costa del Golfo e dopo il tramonto brillano come un unico blocco di luce.',
    },
    kuwait: {
      city: 'Kuwait City',
      country: 'Kuwait',
      landmark: 'Le Torri del Kuwait',
      description:
        'Le Torri del Kuwait sulla costa del Golfo, icona di Jørn Utzon del 1979, emergono dall’acqua come tre minareti futuristici.',
    },
    manama: {
      city: 'Manama',
      country: 'Bahrein',
      landmark: 'Bahrain World Trade Center',
      description:
        'Il Bahrain World Trade Center, il primo grattacielo con turbine eoliche integrate nella struttura, svetta sul porto di Manama.',
    },
    muscat: {
      city: 'Mascate',
      country: 'Oman',
      landmark: 'La Grande Moschea del Sultano Qaboos',
      description:
        'La Grande Moschea del Sultano Qaboos, capolavoro di marmo e ornamenti islamici, i cui minareti al tramonto disegnano lunghe ombre sulla sabbia.',
    },
    amman: {
      city: 'Amman',
      country: 'Giordania',
      landmark: 'Il Teatro Romano',
      description:
        'Il Teatro Romano nel cuore di Amman, scavato nella collina nel II secolo d.C., domina le case bianche ammassate sui pendii.',
    },
    petra: {
      city: 'Petra',
      country: 'Giordania',
      landmark: 'Al-Khazneh (Il Tesoro)',
      description:
        'Al-Khazneh a Petra, la città nabatea rosa scolpita nella roccia, appare all’improvviso alla fine del Siq.',
    },
    beirut: {
      city: 'Beirut',
      country: 'Libano',
      landmark: 'Le Rocce dei Piccioni',
      description:
        'Le Rocce dei Piccioni a Beirut, un arco di pietra nel Mediterraneo che ogni sera cattura l’ultima luce.',
    },
    damascus: {
      city: 'Damasco',
      country: 'Siria',
      landmark: 'La Moschea degli Omayyadi',
      description:
        'La Grande Moschea degli Omayyadi di Damasco, tra le più antiche e maestose del mondo, con il vasto cortile, le colonne di marmo e i minareti slanciati.',
    },
    baghdad: {
      city: 'Baghdad',
      country: 'Iraq',
      landmark: 'Il Monumento ai Martiri',
      description:
        'Due cupole turchesi aperte attorno a un solo cuore: il Monumento ai Martiri sul Tigri, testimone della memoria di Baghdad.',
    },
    casablanca: {
      city: 'Casablanca',
      country: 'Marocco',
      landmark: 'La Moschea di Hassan II',
      description:
        'La Moschea di Hassan II sull’Atlantico, con il minareto di 210 metri più alto del mondo, illuminata dal sole sul marmo a ogni tramonto.',
    },
    marrakech: {
      city: 'Marrakech',
      country: 'Marocco',
      landmark: 'La città rossa e l’Atlante',
      description:
        'Marrakech ai piedi dell’Atlante, dove l’ocra della medina incontra la neve delle vette e il richiamo alla preghiera sale su Jemaa el-Fna.',
    },
    tunis: {
      city: 'Tunisi',
      country: 'Tunisia',
      landmark: 'Sidi Bou Said',
      description:
        'Sidi Bou Said sopra il golfo di Tunisi: case bianche e porte blu sul Mediterraneo, colline che si tingono di blu nel pomeriggio.',
    },
    sanaa: {
      city: 'Sana’a',
      country: 'Yemen',
      landmark: 'La città vecchia',
      description:
        'La vecchia Sana’a, le sue case-torre rifinite con gesso bianco, più che millenaria, si innalza come una foresta di pietra.',
    },
    alula: {
      city: 'AlUla',
      country: 'Arabia Saudita',
      landmark: 'Qasr al-Farid, Hegra',
      description:
        'Qasr al-Farid a Hegra, tomba nabatea scolpita duemila anni fa in un unico masso, sola nel deserto aperto.',
    },
  },
};

/** Editorial copy for the generic backdrop used when a city has no curated scene. */
export const FALLBACK_I18N: Record<TranslatedLang, LandmarkText> = {
  en: {
    city: '',
    country: '',
    landmark: 'An open Arab horizon',
    description:
      'Another Arab city under the same sky. There is no archive photo for this place yet, but the weather here is live and real.',
  },
  de: {
    city: '',
    country: '',
    landmark: 'Ein offener arabischer Horizont',
    description:
      'Eine weitere arabische Stadt unter demselben Himmel. Für diesen Ort gibt es noch kein Archivfoto, doch das Wetter ist live und echt.',
  },
  ru: {
    city: '',
    country: '',
    landmark: 'Открытый арабский горизонт',
    description:
      'Ещё один арабский город под тем же небом. Архивного снимка для этого места пока нет, но погода здесь настоящая и живая.',
  },
  it: {
    city: '',
    country: '',
    landmark: 'Un orizzonte arabo aperto',
    description:
      'Un’altra città araba sotto lo stesso cielo. Non c’è ancora una foto d’archivio per questo luogo, ma il meteo qui è reale e in diretta.',
  },
};
