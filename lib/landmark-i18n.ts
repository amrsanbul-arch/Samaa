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
      landmark: 'Cairo Tower',
      description:
        'A 187-metre concrete tower on Gezira Island in the middle of the Nile, designed by Naoum Shebib and completed in 1961 as a pharaonic lotus flower. From its revolving deck you see the river and Qasr El Nil Bridge.',
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
    hurghada: {
      city: 'Hurghada',
      country: 'Egypt',
      landmark: 'Red Sea reefs',
      description:
        'Shallow turquoise water, wooden jetties over the reef and dive boats heading for the islands. Hurghada is Egypt’s first diving town, and the sun rarely leaves.',
    },
    luxor: {
      city: 'Luxor',
      country: 'Egypt',
      landmark: 'Karnak Temple',
      description:
        'The avenue of ram-headed sphinxes leading to the pylon of Karnak, begun almost four thousand years ago and built for centuries after. Luxor is the world’s largest open-air museum.',
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
    london: {
      city: 'London',
      country: 'United Kingdom',
      landmark: 'Tower Bridge and Big Ben',
      description:
        'Tower Bridge has been opening its arms over the Thames since 1894, with Big Ben keeping watch over the Houses of Parliament just upstream. At dusk the river becomes a mirror for the city’s lights.',
    },
    paris: {
      city: 'Paris',
      country: 'France',
      landmark: 'The Eiffel Tower',
      description:
        'The Eiffel Tower lifts 330 metres of iron above the Champ de Mars; Parisians first rejected it, then made it their symbol. At sunset the tower burns gold above the grey rooftops.',
    },
    rome: {
      city: 'Rome',
      country: 'Italy',
      landmark: 'The Colosseum',
      description:
        'The Colosseum, the largest amphitheatre of the Roman Empire, held fifty thousand spectators two thousand years ago. At sunset its stone turns amber, with the Arch of Constantine behind it.',
    },
    istanbul: {
      city: 'Istanbul',
      country: 'Türkiye',
      landmark: 'Hagia Sophia and the Bosphorus',
      description:
        'Hagia Sophia stands on the European shore of the Bosphorus, its great dome above a skyline of minarets at sunset. Ferries cross between two continents under one sky.',
    },
    berlin: {
      city: 'Berlin',
      country: 'Germany',
      landmark: 'The Brandenburg Gate',
      description:
        'The Brandenburg Gate, witness to two centuries of European history, closes the axis of Unter den Linden. At night its columns are lit and the square becomes the city’s meeting point.',
    },
    madrid: {
      city: 'Madrid',
      country: 'Spain',
      landmark: 'Plaza Mayor and the Royal Palace',
      description:
        'Plaza Mayor, laid out in the seventeenth century, is ringed by three storeys of arcades and wooden balconies. In the evening lanterns light the stone and the square stays loud until midnight.',
    },
    moscow: {
      city: 'Moscow',
      country: 'Russia',
      landmark: 'Saint Basil’s Cathedral',
      description:
        'Saint Basil’s Cathedral and its nine painted domes close the Red Square, built on Ivan the Terrible’s orders in the sixteenth century. In winter snow settles on the domes and the red brick glows beneath.',
    },
    amsterdam: {
      city: 'Amsterdam',
      country: 'Netherlands',
      landmark: 'Amsterdam’s canals',
      description:
        'Amsterdam’s canals were dug in the seventeenth century, lined with narrow merchant houses under gabled roofs. At dusk the brick facades drop into the water and the city falls quiet except for bicycles.',
    },
    athens: {
      city: 'Athens',
      country: 'Greece',
      landmark: 'The Acropolis',
      description:
        'The Acropolis stands on a rock 156 metres above Athens, the Parthenon crowning it for 2,400 years. At sunset the marble turns honey-coloured and the city runs all the way to the sea.',
    },
    'new-york': {
      city: 'New York',
      country: 'United States',
      landmark: 'The Manhattan skyline',
      description:
        'The Manhattan skyline rises from the water like a wall of light, from the Empire State Building to One World Trade. At dusk the river turns silver and the windows switch on one by one.',
    },
    'los-angeles': {
      city: 'Los Angeles',
      country: 'United States',
      landmark: 'Downtown Los Angeles',
      description:
        'Downtown Los Angeles lifts its glass towers out of the plain, with the Hollywood hills and their white letters behind. At sunset the skyline turns pink above the freeways.',
    },
    toronto: {
      city: 'Toronto',
      country: 'Canada',
      landmark: 'The CN Tower',
      description:
        'The CN Tower climbs 553 metres above Lake Ontario, the tallest free-standing structure in the world when it opened in 1976. At sunset it stands black against a red sky, mirrored in the lake.',
    },
    'mexico-city': {
      city: 'Mexico City',
      country: 'Mexico',
      landmark: 'Palacio de Bellas Artes',
      description:
        'The Palacio de Bellas Artes, with its orange dome and marble halls, was built over the ruins of the Aztec city at 2,240 metres. In the evening the facade is lit and the volcanoes show on the far horizon.',
    },
    rio: {
      city: 'Rio de Janeiro',
      country: 'Brazil',
      landmark: 'Christ the Redeemer',
      description:
        'Christ the Redeemer stands 38 metres tall on Corcovado, looking down on Guanabara Bay and Sugarloaf Mountain. At sunset mist fills the bay while the statue stays lit above the clouds.',
    },
    'buenos-aires': {
      city: 'Buenos Aires',
      country: 'Argentina',
      landmark: 'The Obelisco',
      description:
        'The Obelisco rises 67 metres in the middle of Avenida 9 de Julio, the widest avenue in the world, since 1936. At night the theatre lights pass beneath it and it stays standing as the city’s marker.',
    },
    tokyo: {
      city: 'Tokyo',
      country: 'Japan',
      landmark: 'Tokyo Tower and Shibuya',
      description:
        'Tokyo is a city of layers: the glass towers of Shinjuku, the red lattice of Tokyo Tower, and the streets of Shibuya that never sleep. At dusk the neon comes on and the skyline becomes a sea of light.',
    },
    beijing: {
      city: 'Beijing',
      country: 'China',
      landmark: 'The Forbidden City',
      description:
        'The Forbidden City, home to emperors for five centuries, holds 980 buildings under golden tiled roofs. From Jingshan Hill the sea of roofs runs all the way to the horizon.',
    },
    shanghai: {
      city: 'Shanghai',
      country: 'China',
      landmark: 'The Pudong skyline',
      description:
        'The Pudong skyline holds the Shanghai Tower, the Oriental Pearl and the Jin Mao — three generations of towers on one riverbank. At night they pour their lights into the Huangpu and the waterfront becomes a screen.',
    },
    seoul: {
      city: 'Seoul',
      country: 'South Korea',
      landmark: 'N Seoul Tower',
      description:
        'N Seoul Tower stands on Namsan in the middle of the capital, and below it the Han River crosses the city under dozens of lit bridges. At night the skyline fills with blue and red light out to the mountains.',
    },
    singapore: {
      city: 'Singapore',
      country: 'Singapore',
      landmark: 'Marina Bay Sands',
      description:
        'Marina Bay Sands raises three towers and a ship-like roof deck out of the water in the heart of the city. At night the gardens and the white lotus pavilion light up and drop into the bay.',
    },
    bangkok: {
      city: 'Bangkok',
      country: 'Thailand',
      landmark: 'Wat Arun',
      description:
        'Wat Arun, the Temple of Dawn, stands on the Chao Phraya with its central prang covered in coloured porcelain. At sunset the boats cross in front of it and the river turns copper.',
    },
    mumbai: {
      city: 'Mumbai',
      country: 'India',
      landmark: 'The Gateway of India',
      description:
        'The Gateway of India, the basalt arch raised in 1924 on the waterfront, closes the end of Colaba. In the evening the stone turns deep orange under the harbour lights.',
    },
    delhi: {
      city: 'New Delhi',
      country: 'India',
      landmark: 'India Gate',
      description:
        'India Gate, the 42-metre stone arch, closes the Kartavya Path axis at the heart of the capital. At sunset the sandstone glows and the lawns fill with people.',
    },
    'kuala-lumpur': {
      city: 'Kuala Lumpur',
      country: 'Malaysia',
      landmark: 'The Petronas Towers',
      description:
        'The Petronas Towers rise 452 metres and are joined by a double skybridge on the forty-first floor. At night their steel skins shine above the KLCC park.',
    },
    jakarta: {
      city: 'Jakarta',
      country: 'Indonesia',
      landmark: 'The National Monument',
      description:
        'The National Monument rises 137 metres in the heart of Jakarta, a gold-covered flame at its tip. At sunset the city becomes a sea of lights under a fast-moving tropical sky.',
    },
    sydney: {
      city: 'Sydney',
      country: 'Australia',
      landmark: 'The Opera House',
      description:
        'The Sydney Opera House sits on the water with its white shells, and the Harbour Bridge arcs behind it. At sunset the shells turn pink and are lit from within.',
    },
    'cape-town': {
      city: 'Cape Town',
      country: 'South Africa',
      landmark: 'Table Mountain',
      description:
        'Table Mountain, its flat summit 1,085 metres high, rises behind the city like a giant table. At dawn its famous tablecloth cloud pours over the edge and pink light falls on the streets.',
    },
    lagos: {
      city: 'Lagos',
      country: 'Nigeria',
      landmark: 'Third Mainland Bridge',
      description:
        'Third Mainland Bridge, the longest in Africa at 11.8 kilometres, crosses Lagos Lagoon and links the island to the mainland. At night it becomes a line of light over black water.',
    },
    nairobi: {
      city: 'Nairobi',
      country: 'Kenya',
      landmark: 'The Nairobi skyline',
      description:
        'Nairobi is the only capital that borders a full national park, and its skyline rises directly behind the savannah. At sunset gold light falls on the grass and the city looks as distant as a mirage.',
    },
    karachi: {
      city: 'Karachi',
      country: 'Pakistan',
      landmark: 'Mazar-e-Quaid',
      description:
        'Mazar-e-Quaid, its white marble dome, has stood on a hill above Karachi since 1971. At sunset the marble shines and the mausoleum seems to float above the city.',
    },
  },
  de: {
    cairo: {
      city: 'Kairo',
      country: 'Ägypten',
      landmark: 'Kairo Tower',
      description:
        'Ein 187 Meter hoher Betonturm auf der Gezira-Insel mitten im Nil, entworfen von Naoum Shebib und 1961 fertiggestellt – in Form einer pharaonischen Lotusblume. Von der drehbaren Plattform blickt man über den Fluss und die Qasr-el-Nil-Brücke.',
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
    hurghada: {
      city: 'Hurghada',
      country: 'Ägypten',
      landmark: 'Riffe des Roten Meeres',
      description:
        'Flaches türkisfarbenes Wasser, Holzstege über dem Riff und Tauchboote auf dem Weg zu den Inseln. Hurghada ist Ägyptens erste Tauchstadt – und die Sonne bleibt selten aus.',
    },
    luxor: {
      city: 'Luxor',
      country: 'Ägypten',
      landmark: 'Karnak-Tempel',
      description:
        'Die Allee der widderköpfigen Sphinxe führt zum Pylon von Karnak – begonnen vor fast viertausend Jahren und über Jahrhunderte weitergebaut. Luxor ist das größte Freilichtmuseum der Welt.',
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
    london: {
      city: 'London',
      country: 'Vereinigtes Königreich',
      landmark: 'Tower Bridge und Big Ben',
      description:
        'Die Tower Bridge öffnet seit 1894 ihre Flügel über der Themse, während Big Ben flussaufwärts über das Parlament wacht. In der Dämmerung wird der Fluss zum Spiegel der Stadtlichter.',
    },
    paris: {
      city: 'Paris',
      country: 'Frankreich',
      landmark: 'Der Eiffelturm',
      description:
        'Der Eiffelturm hebt 330 Meter Eisen über das Champ de Mars; die Pariser lehnten ihn zuerst ab und machten ihn dann zu ihrem Wahrzeichen. Bei Sonnenuntergang glüht er golden über den grauen Dächern.',
    },
    rome: {
      city: 'Rom',
      country: 'Italien',
      landmark: 'Das Kolosseum',
      description:
        'Das Kolosseum, das größte Amphitheater des Römischen Reiches, fasste vor zweitausend Jahren fünfzigtausend Zuschauer. Bei Sonnenuntergang färbt sich sein Stein bernsteinfarben, dahinter der Konstantinsbogen.',
    },
    istanbul: {
      city: 'Istanbul',
      country: 'Türkei',
      landmark: 'Hagia Sophia und der Bosporus',
      description:
        'Die Hagia Sophia steht am europäischen Ufer des Bosporus, ihre große Kuppel über einer Silhouette aus Minaretten im Abendlicht. Fähren pendeln zwischen zwei Kontinenten unter einem Himmel.',
    },
    berlin: {
      city: 'Berlin',
      country: 'Deutschland',
      landmark: 'Das Brandenburger Tor',
      description:
        'Das Brandenburger Tor, Zeuge zweier Jahrhunderte europäischer Geschichte, schließt die Achse des Boulevards Unter den Linden. Nachts strahlen seine Säulen im Licht und der Platz wird zum Treffpunkt der Stadt.',
    },
    madrid: {
      city: 'Madrid',
      country: 'Spanien',
      landmark: 'Plaza Mayor und der Königspalast',
      description:
        'Die Plaza Mayor aus dem 17. Jahrhundert wird von drei Stockwerken Arkaden und Holzbalkonen umschlossen. Abends erleuchten Laternen den Stein, und der Platz bleibt bis Mitternacht laut.',
    },
    moscow: {
      city: 'Moskau',
      country: 'Russland',
      landmark: 'Die Basilius-Kathedrale',
      description:
        'Die Basilius-Kathedrale mit ihren neun bemalten Kuppeln schließt den Roten Platz; Iwan der Schreckliche ließ sie im 16. Jahrhundert errichten. Im Winter liegt Schnee auf den Kuppeln und der rote Backstein leuchtet.',
    },
    amsterdam: {
      city: 'Amsterdam',
      country: 'Niederlande',
      landmark: 'Amsterdams Grachten',
      description:
        'Amsterdams Grachten wurden im 17. Jahrhundert gegraben, gesäumt von schmalen Kaufmannshäusern mit Giebeldächern. In der Dämmerung spiegeln sich die Backsteinfassaden im Wasser, und nur die Fahrräder sind zu hören.',
    },
    athens: {
      city: 'Athen',
      country: 'Griechenland',
      landmark: 'Die Akropolis',
      description:
        'Die Akropolis erhebt sich auf einem Felsen 156 Meter über Athen, gekrönt vom Parthenon seit 2.400 Jahren. Bei Sonnenuntergang wird der Marmor honigfarben, und die Stadt reicht bis zum Meer.',
    },
    'new-york': {
      city: 'New York',
      country: 'Vereinigte Staaten',
      landmark: 'Die Skyline von Manhattan',
      description:
        'Die Skyline von Manhattan steigt wie eine Wand aus Licht aus dem Wasser, vom Empire State Building bis zum One World Trade Center. In der Dämmerung wird der Fluss silbern, und Fenster für Fenster geht das Licht an.',
    },
    'los-angeles': {
      city: 'Los Angeles',
      country: 'Vereinigte Staaten',
      landmark: 'Downtown Los Angeles',
      description:
        'Downtown Los Angeles hebt seine Glastürme aus der Ebene, dahinter die Hügel von Hollywood mit ihren weißen Buchstaben. Bei Sonnenuntergang färbt sich die Skyline rosa über den Highways.',
    },
    toronto: {
      city: 'Toronto',
      country: 'Kanada',
      landmark: 'Der CN Tower',
      description:
        'Der CN Tower ragt 553 Meter über den Ontariosee; bei seiner Eröffnung 1976 war er das höchste freistehende Bauwerk der Welt. Bei Sonnenuntergang steht er schwarz vor rotem Himmel und spiegelt sich im See.',
    },
    'mexico-city': {
      city: 'Mexiko-Stadt',
      country: 'Mexiko',
      landmark: 'Palacio de Bellas Artes',
      description:
        'Der Palacio de Bellas Artes mit seiner orangen Kuppel und den Marmorsälen wurde über den Ruinen der Aztekenstadt errichtet, auf 2.240 Metern Höhe. Abends wird die Fassade angestrahlt, und am fernen Horizont zeigen sich die Vulkane.',
    },
    rio: {
      city: 'Rio de Janeiro',
      country: 'Brasilien',
      landmark: 'Christus der Erlöser',
      description:
        'Christus der Erlöser steht 38 Meter hoch auf dem Corcovado und blickt über die Guanabara-Bucht und den Zuckerhut. Bei Sonnenuntergang füllt Nebel die Bucht, während die Statue über den Wolken leuchtet.',
    },
    'buenos-aires': {
      city: 'Buenos Aires',
      country: 'Argentinien',
      landmark: 'Der Obelisk',
      description:
        'Der Obelisk steht seit 1936 mitten auf der Avenida 9 de Julio, der breitesten Straße der Welt, 67 Meter hoch. Nachts ziehen die Lichter der Theater an ihm vorbei, und er bleibt das Wahrzeichen der Stadt.',
    },
    tokyo: {
      city: 'Tokio',
      country: 'Japan',
      landmark: 'Tokyo Tower und Shibuya',
      description:
        'Tokio ist eine Stadt aus Schichten: die Glastürme von Shinjuku, das rote Gitter des Tokyo Tower und die Straßen von Shibuya, die nie schlafen. In der Dämmerung springt das Neon an, und der Horizont wird zu einem Meer aus Licht.',
    },
    beijing: {
      city: 'Peking',
      country: 'China',
      landmark: 'Die Verbotene Stadt',
      description:
        'Die Verbotene Stadt, fünf Jahrhunderte lang Kaisersitz, umfasst 980 Gebäude unter goldenen Ziegeldächern. Vom Jingshan-Hügel reicht das Meer der Dächer bis zum Horizont.',
    },
    shanghai: {
      city: 'Shanghai',
      country: 'China',
      landmark: 'Die Skyline von Pudong',
      description:
        'Die Skyline von Pudong vereint den Shanghai Tower, die Oriental Pearl und den Jin Mao — drei Turm-Generationen an einem Ufer. Nachts fließen ihre Lichter in den Huangpu, und die Uferpromenade wird zur Leinwand.',
    },
    seoul: {
      city: 'Seoul',
      country: 'Südkorea',
      landmark: 'Der N Seoul Tower',
      description:
        'Der N Seoul Tower steht auf dem Namsan mitten in der Hauptstadt; darunter durchquert der Han-Fluss die Stadt unter Dutzenden beleuchteten Brücken. Nachts füllt sich der Horizont mit blauem und rotem Licht bis zu den Bergen.',
    },
    singapore: {
      city: 'Singapur',
      country: 'Singapur',
      landmark: 'Marina Bay Sands',
      description:
        'Marina Bay Sands hebt drei Türme und ein schiffsartiges Dach aus dem Wasser im Herzen der Stadt. Nachts leuchten die Gärten und der weiße Lotus-Pavillon und spiegeln sich in der Bucht.',
    },
    bangkok: {
      city: 'Bangkok',
      country: 'Thailand',
      landmark: 'Wat Arun',
      description:
        'Wat Arun, der Tempel der Morgenröte, steht am Chao Phraya, sein zentraler Prang mit farbigem Porzellan besetzt. Bei Sonnenuntergang ziehen Boote vorbei und der Fluss wird kupfern.',
    },
    mumbai: {
      city: 'Mumbai',
      country: 'Indien',
      landmark: 'Das Gateway of India',
      description:
        'Das Gateway of India, der 1924 am Wasser errichtete Basaltbogen, schließt das Ende von Colaba. Abends wird der Stein unter den Hafenlichtern tief orange.',
    },
    delhi: {
      city: 'Neu-Delhi',
      country: 'Indien',
      landmark: 'Das India Gate',
      description:
        'Das India Gate, der 42 Meter hohe Steinbogen, schließt die Achse des Kartavya Path im Herzen der Hauptstadt. Bei Sonnenuntergang glüht der Sandstein und die Rasenflächen füllen sich.',
    },
    'kuala-lumpur': {
      city: 'Kuala Lumpur',
      country: 'Malaysia',
      landmark: 'Die Petronas Towers',
      description:
        'Die Petronas Towers ragen 452 Meter hoch und sind durch eine doppelte Himmelsbrücke im 41. Stock verbunden. Nachts glänzen ihre Stahlfassaden über dem KLCC-Park.',
    },
    jakarta: {
      city: 'Jakarta',
      country: 'Indonesien',
      landmark: 'Das Nationaldenkmal',
      description:
        'Das Nationaldenkmal ragt 137 Meter in das Herz von Jakarta, eine vergoldete Flamme an der Spitze. Bei Sonnenuntergang wird die Stadt zu einem Meer aus Lichtern unter einem schnellen Tropenhimmel.',
    },
    sydney: {
      city: 'Sydney',
      country: 'Australien',
      landmark: 'Das Opernhaus',
      description:
        'Das Opernhaus von Sydney liegt mit seinen weißen Schalen am Wasser, dahinter spannt sich die Harbour Bridge. Bei Sonnenuntergang werden die Schalen rosa und leuchten von innen.',
    },
    'cape-town': {
      city: 'Kapstadt',
      country: 'Südafrika',
      landmark: 'Der Tafelberg',
      description:
        'Der Tafelberg mit seinem 1.085 Meter hohen Plateau steht hinter der Stadt wie ein riesiger Tisch. Im Morgengrauen wälzt sich die berühmte Wolkendecke über die Kante und rosa Licht fällt auf die Straßen.',
    },
    lagos: {
      city: 'Lagos',
      country: 'Nigeria',
      landmark: 'Die Third Mainland Bridge',
      description:
        'Die Third Mainland Bridge, mit 11,8 Kilometern die längste Brücke Afrikas, überquert die Lagune von Lagos und verbindet die Insel mit dem Festland. Nachts wird sie zu einer Linie aus Licht über schwarzem Wasser.',
    },
    nairobi: {
      city: 'Nairobi',
      country: 'Kenia',
      landmark: 'Die Skyline von Nairobi',
      description:
        'Nairobi ist die einzige Hauptstadt, die an einen vollständigen Nationalpark grenzt, und ihre Skyline steigt direkt hinter der Savanne auf. Bei Sonnenuntergang fällt goldenes Licht auf das Gras, und die Stadt wirkt fern wie eine Fata Morgana.',
    },
    karachi: {
      city: 'Karatschi',
      country: 'Pakistan',
      landmark: 'Das Mazar-e-Quaid',
      description:
        'Das Mazar-e-Quaid mit seiner weißen Marmorkuppel steht seit 1971 auf einem Hügel über Karatschi. Bei Sonnenuntergang glänzt der Marmor, und das Mausoleum scheint über der Stadt zu schweben.',
    },
  },
  ru: {
    cairo: {
      city: 'Каир',
      country: 'Египет',
      landmark: 'Каирская башня',
      description:
        'Бетонная башня высотой 187 метров на острове Гезира посреди Нила. Проект Наума Шебиба, завершена в 1961 году в форме фараоновского лотоса. С вращающейся площадки видны река и мост Каср-эль-Нил.',
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
    hurghada: {
      city: 'Хургада',
      country: 'Египет',
      landmark: 'Рифы Красного моря',
      description:
        'Бирюзовая мелкая вода, деревянные пирсы над рифом и дайв-боты, уходящие к островам. Хургада — первый дайв-город Египта, и солнце здесь почти не уходит.',
    },
    luxor: {
      city: 'Луксор',
      country: 'Египет',
      landmark: 'Карнакский храм',
      description:
        'Аллея сфинксов с бараньими головами ведёт к пилону Карнака: строительство началось почти четыре тысячи лет назад и шло веками. Луксор — крупнейший музей под открытым небом.',
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
    london: {
      city: 'Лондон',
      country: 'Великобритания',
      landmark: 'Тауэрский мост и Биг-Бен',
      description:
        'Тауэрский мост разводит свои крылья над Темзой с 1894 года, а Биг-Бен выше по течению охраняет здание парламента. В сумерках река становится зеркалом городских огней.',
    },
    paris: {
      city: 'Париж',
      country: 'Франция',
      landmark: 'Эйфелева башня',
      description:
        'Эйфелева башня поднимает 330 метров железа над Марсовым полем; парижане сначала отвергли её, а потом сделали своим символом. На закате башня горит золотом над серыми крышами.',
    },
    rome: {
      city: 'Рим',
      country: 'Италия',
      landmark: 'Колизей',
      description:
        'Колизей, крупнейший амфитеатр Римской империи, две тысячи лет назад вмещал пятьдесят тысяч зрителей. На закате его камень становится янтарным, а позади видна арка Константина.',
    },
    istanbul: {
      city: 'Стамбул',
      country: 'Турция',
      landmark: 'Святая София и Босфор',
      description:
        'Святая София стоит на европейском берегу Босфора, её огромный купол поднимается над силуэтом минаретов на закате. Паромы снуют между двумя континентами под одним небом.',
    },
    berlin: {
      city: 'Берлин',
      country: 'Германия',
      landmark: 'Бранденбургские ворота',
      description:
        'Бранденбургские ворота, свидетели двух веков европейской истории, замыкают ось Унтер-ден-Линден. Ночью их колонны заливает свет, и площадь становится местом встречи города.',
    },
    madrid: {
      city: 'Мадрид',
      country: 'Испания',
      landmark: 'Пласа-Майор и Королевский дворец',
      description:
        'Пласа-Майор, заложенная в XVII веке, окружена тремя ярусами аркад и деревянными балконами. Вечером фонари освещают камень, и площадь не затихает до полуночи.',
    },
    moscow: {
      city: 'Москва',
      country: 'Россия',
      landmark: 'Собор Василия Блаженного',
      description:
        'Собор Василия Блаженного с девятью расписными куполами замыкает Красную площадь; его построили при Иване Грозном в XVI веке. Зимой снег ложится на купола, а красный кирпич светится.',
    },
    amsterdam: {
      city: 'Амстердам',
      country: 'Нидерланды',
      landmark: 'Каналы Амстердама',
      description:
        'Каналы Амстердама прорыли в XVII веке; вдоль них стоят узкие купеческие дома с островерхими крышами. В сумерках кирпичные фасады опускаются в воду, и город затихает, кроме велосипедов.',
    },
    athens: {
      city: 'Афины',
      country: 'Греция',
      landmark: 'Акрополь',
      description:
        'Акрополь стоит на скале в 156 метрах над Афинами, а Парфенон венчает его уже 2400 лет. На закате мрамор становится медовым, и город тянется до самого моря.',
    },
    'new-york': {
      city: 'Нью-Йорк',
      country: 'США',
      landmark: 'Скайлайн Манхэттена',
      description:
        'Скайлайн Манхэттена поднимается из воды как стена света — от Эмпайр-стейт-билдинг до One World Trade. В сумерках река становится серебряной, и окна загораются одно за другим.',
    },
    'los-angeles': {
      city: 'Лос-Анджелес',
      country: 'США',
      landmark: 'Даунтаун Лос-Анджелеса',
      description:
        'Даунтаун Лос-Анджелеса поднимает стеклянные башни над равниной, а позади — холмы Голливуда с белыми буквами. На закате скайлайн становится розовым над автострадами.',
    },
    toronto: {
      city: 'Торонто',
      country: 'Канада',
      landmark: 'Башня CN',
      description:
        'Башня CN поднимается на 553 метра над озером Онтарио; при открытии в 1976 году она была самым высоким отдельно стоящим сооружением мира. На закате она чернеет на красном небе и отражается в воде.',
    },
    'mexico-city': {
      city: 'Мехико',
      country: 'Мексика',
      landmark: 'Дворец изящных искусств',
      description:
        'Дворец изящных искусств с оранжевым куполом и мраморными залами построен на руинах города ацтеков на высоте 2240 метров. Вечером фасад подсвечивают, а на дальнем горизонте видны вулканы.',
    },
    rio: {
      city: 'Рио-де-Жанейро',
      country: 'Бразилия',
      landmark: 'Статуя Христа-Искупителя',
      description:
        'Статуя Христа-Искупителя высотой 38 метров стоит на Корковаду над бухтой Гуанабара и горой Сахарная голова. На закате туман заливает бухту, а статуя продолжает светиться над облаками.',
    },
    'buenos-aires': {
      city: 'Буэнос-Айрес',
      country: 'Аргентина',
      landmark: 'Обелиск',
      description:
        'Обелиск высотой 67 метров стоит с 1936 года посреди Авениды 9 Июля, самой широкой улицы мира. Ночью под ним течёт свет театров, а он остаётся знаком города.',
    },
    tokyo: {
      city: 'Токио',
      country: 'Япония',
      landmark: 'Токийская башня и Сибуя',
      description:
        'Токио — город слоёв: стеклянные башни Синдзюку, красная решётка Токийской башни и улицы Сибуи, которые не спят. В сумерках загорается неон, и горизонт становится морем света.',
    },
    beijing: {
      city: 'Пекин',
      country: 'Китай',
      landmark: 'Запретный город',
      description:
        'Запретный город, пять веков служивший дворцом императоров, вмещает 980 построек под золотыми черепичными крышами. С холма Цзиншань море крыш уходит до горизонта.',
    },
    shanghai: {
      city: 'Шанхай',
      country: 'Китай',
      landmark: 'Скайлайн Пудуна',
      description:
        'В скайлайне Пудуна — Шанхайская башня, «Восточная жемчужина» и Цзинь Мао: три поколения башен на одном берегу. Ночью их свет стекает в Хуанпу, и набережная становится экраном.',
    },
    seoul: {
      city: 'Сеул',
      country: 'Южная Корея',
      landmark: 'Башня N Seoul',
      description:
        'Башня N Seoul стоит на горе Намсан в центре столицы, а под ней река Хан пересекает город под десятками освещённых мостов. Ночью горизонт наполняется синим и красным светом до самых гор.',
    },
    singapore: {
      city: 'Сингапур',
      country: 'Сингапур',
      landmark: 'Marina Bay Sands',
      description:
        'Marina Bay Sands поднимает три башни и крышу-корабль прямо из воды в центре города. Ночью загораются сады и белый павильон-лотос, отражаясь в заливе.',
    },
    bangkok: {
      city: 'Бангкок',
      country: 'Таиланд',
      landmark: 'Ват Арун',
      description:
        'Ват Арун, Храм Зари, стоит на Чао Прайе, его центральный пранг облицован цветным фарфором. На закате мимо проплывают лодки, а река становится медной.',
    },
    mumbai: {
      city: 'Мумбаи',
      country: 'Индия',
      landmark: 'Ворота Индии',
      description:
        'Ворота Индии — базальтовая арка 1924 года на набережной — замыкают Коллабу. Вечером камень становится глубоко-оранжевым в свете порта.',
    },
    delhi: {
      city: 'Нью-Дели',
      country: 'Индия',
      landmark: 'Монумент India Gate',
      description:
        'Монумент India Gate — 42-метровая каменная арка — замыкает ось Картавья-Патх в центре столицы. На закате песчаник светится, а газоны заполняются людьми.',
    },
    'kuala-lumpur': {
      city: 'Куала-Лумпур',
      country: 'Малайзия',
      landmark: 'Башни Петронас',
      description:
        'Башни Петронас поднимаются на 452 метра, их соединяет двойной мост на 41-м этаже. Ночью стальные фасады сияют над парком KLCC.',
    },
    jakarta: {
      city: 'Джакарта',
      country: 'Индонезия',
      landmark: 'Национальный монумент',
      description:
        'Национальный монумент поднимается на 137 метров в центре Джакарты, его вершину венчает позолоченное пламя. На закате город становится морем огней под быстрым тропическим небом.',
    },
    sydney: {
      city: 'Сидней',
      country: 'Австралия',
      landmark: 'Сиднейский оперный театр',
      description:
        'Сиднейский оперный театр с белыми «парусами» стоит у самой воды, а позади изгибается мост Харбор-Бридж. На закате паруса розовеют и светятся изнутри.',
    },
    'cape-town': {
      city: 'Кейптаун',
      country: 'ЮАР',
      landmark: 'Столовая гора',
      description:
        'Столовая гора с плоской вершиной высотой 1085 метров поднимается за городом, как гигантский стол. На рассвете её знаменитая облачная «скатерть» переливается через край, и на улицы падает розовый свет.',
    },
    lagos: {
      city: 'Лагос',
      country: 'Нигерия',
      landmark: 'Третий мост через лагуну',
      description:
        'Третий мост через лагуну — самый длинный в Африке, 11,8 километра — соединяет остров с материком. Ночью он превращается в линию света над чёрной водой.',
    },
    nairobi: {
      city: 'Найроби',
      country: 'Кения',
      landmark: 'Скайлайн Найроби',
      description:
        'Найроби — единственная столица, граничащая с целым национальным парком, и её скайлайн поднимается прямо за саванной. На закате золотой свет ложится на траву, и город кажется далёким миражом.',
    },
    karachi: {
      city: 'Карачи',
      country: 'Пакистан',
      landmark: 'Мавзолей Мазар-э-Кайд',
      description:
        'Мавзолей Мазар-э-Кайд с белым мраморным куполом стоит на холме над Карачи с 1971 года. На закате мрамор сияет, и мавзолей словно парит над городом.',
    },
  },
  it: {
    cairo: {
      city: 'Il Cairo',
      country: 'Egitto',
      landmark: 'Torre del Cairo',
      description:
        'Una torre di cemento alta 187 metri sull’isola di Gezira, in mezzo al Nilo: disegnata da Naoum Shebib e completata nel 1961 a forma di fiore di loto faraonico. Dalla terrazza girevole si guardano il fiume e il ponte Qasr El Nil.',
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
    hurghada: {
      city: 'Hurghada',
      country: 'Egitto',
      landmark: 'Le barriere del Mar Rosso',
      description:
        'Acqua turchese e bassa, pontili di legno sopra la barriera e barche dei subacquei dirette alle isole. Hurghada è la prima città subacquea d’Egitto, e il sole quasi non se ne va.',
    },
    luxor: {
      city: 'Luxor',
      country: 'Egitto',
      landmark: 'Tempio di Karnak',
      description:
        'Il viale delle sfingi a testa di ariete che porta al pilone di Karnak, iniziato quasi quattromila anni fa e costruito per secoli. Luxor è il più grande museo all’aperto del mondo.',
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
    london: {
      city: 'Londra',
      country: 'Regno Unito',
      landmark: 'Tower Bridge e Big Ben',
      description:
        'Il Tower Bridge apre le sue braccia sul Tamigi dal 1894, mentre Big Ben veglia sul Parlamento poco più a monte. Al crepuscolo il fiume diventa lo specchio delle luci della città.',
    },
    paris: {
      city: 'Parigi',
      country: 'Francia',
      landmark: 'La Torre Eiffel',
      description:
        'La Torre Eiffel solleva 330 metri di ferro sopra il Campo di Marte; i parigini la rifiutarono, poi ne fecero il loro simbolo. Al tramonto brucia d’oro sopra i tetti grigi.',
    },
    rome: {
      city: 'Roma',
      country: 'Italia',
      landmark: 'Il Colosseo',
      description:
        'Il Colosseo, il più grande anfiteatro dell’Impero romano, duemila anni fa accoglieva cinquantamila spettatori. Al tramonto la sua pietra diventa ambrata, con l’Arco di Costantino sullo sfondo.',
    },
    istanbul: {
      city: 'Istanbul',
      country: 'Turchia',
      landmark: 'Santa Sofia e il Bosforo',
      description:
        'Santa Sofia si affaccia sulla riva europea del Bosforo, la grande cupola sopra una skyline di minareti al tramonto. I traghetti attraversano tra due continenti sotto lo stesso cielo.',
    },
    berlin: {
      city: 'Berlino',
      country: 'Germania',
      landmark: 'La Porta di Brandeburgo',
      description:
        'La Porta di Brandeburgo, testimone di due secoli di storia europea, chiude l’asse di Unter den Linden. Di notte le sue colonne si illuminano e la piazza diventa il punto d’incontro della città.',
    },
    madrid: {
      city: 'Madrid',
      country: 'Spagna',
      landmark: 'Plaza Mayor e il Palazzo Reale',
      description:
        'Plaza Mayor, nata nel Seicento, è circondata da tre ordini di arcate e balconi in legno. La sera i lampioni illuminano la pietra e la piazza resta viva fino a mezzanotte.',
    },
    moscow: {
      city: 'Mosca',
      country: 'Russia',
      landmark: 'La Cattedrale di San Basilio',
      description:
        'La Cattedrale di San Basilio con le sue nove cupole dipinte chiude la Piazza Rossa, voluta da Ivan il Terribile nel Cinquecento. D’inverno la neve copre le cupole e il mattone rosso brilla.',
    },
    amsterdam: {
      city: 'Amsterdam',
      country: 'Paesi Bassi',
      landmark: 'I canali di Amsterdam',
      description:
        'I canali di Amsterdam furono scavati nel Seicento, fiancheggiati da strette case mercantili con tetti a frontone. Al crepuscolo le facciate di mattoni scendono nell’acqua e la città tace, salvo le biciclette.',
    },
    athens: {
      city: 'Atene',
      country: 'Grecia',
      landmark: 'L’Acropoli',
      description:
        'L’Acropoli si erge su una rocca 156 metri sopra Atene, con il Partenone in cima da 2.400 anni. Al tramonto il marmo diventa color miele e la città corre fino al mare.',
    },
    'new-york': {
      city: 'New York',
      country: 'Stati Uniti',
      landmark: 'La skyline di Manhattan',
      description:
        'La skyline di Manhattan sale dall’acqua come un muro di luce, dall’Empire State Building a One World Trade. Al crepuscolo il fiume diventa argento e le finestre si accendono una a una.',
    },
    'los-angeles': {
      city: 'Los Angeles',
      country: 'Stati Uniti',
      landmark: 'Il centro di Los Angeles',
      description:
        'Il centro di Los Angeles solleva le sue torri di vetro dalla pianura, con le colline di Hollywood e le loro lettere bianche dietro. Al tramonto la skyline diventa rosa sopra le autostrade.',
    },
    toronto: {
      city: 'Toronto',
      country: 'Canada',
      landmark: 'La CN Tower',
      description:
        'La CN Tower sale 553 metri sopra il lago Ontario; all’inaugurazione nel 1976 era la struttura più alta del mondo. Al tramonto si staglia nera su un cielo rosso e si specchia nel lago.',
    },
    'mexico-city': {
      city: 'Città del Messico',
      country: 'Messico',
      landmark: 'Il Palacio de Bellas Artes',
      description:
        'Il Palacio de Bellas Artes, con la cupola arancione e le sale di marmo, fu costruito sulle rovine della città azteca a 2.240 metri. La sera la facciata si illumina e all’orizzonte appaiono i vulcani.',
    },
    rio: {
      city: 'Rio de Janeiro',
      country: 'Brasile',
      landmark: 'Il Cristo Redentore',
      description:
        'Il Cristo Redentore, alto 38 metri, veglia sul Corcovado sopra la baia di Guanabara e il Pan di Zucchero. Al tramonto la foschia riempie la baia mentre la statua resta illuminata sopra le nuvole.',
    },
    'buenos-aires': {
      city: 'Buenos Aires',
      country: 'Argentina',
      landmark: 'L’Obelisco',
      description:
        'L’Obelisco, alto 67 metri, sta dal 1936 in mezzo all’Avenida 9 de Julio, il viale più largo del mondo. Di notte le luci dei teatri scorrono ai suoi piedi e lui resta il segno della città.',
    },
    tokyo: {
      city: 'Tokyo',
      country: 'Giappone',
      landmark: 'La Tokyo Tower e Shibuya',
      description:
        'Tokyo è una città a strati: le torri di vetro di Shinjuku, il reticolo rosso della Tokyo Tower e le strade di Shibuya che non dormono mai. Al crepuscolo si accende il neon e la skyline diventa un mare di luce.',
    },
    beijing: {
      city: 'Pechino',
      country: 'Cina',
      landmark: 'La Città Proibita',
      description:
        'La Città Proibita, dimora degli imperatori per cinque secoli, conta 980 edifici sotto tetti di tegole dorate. Dalla collina di Jingshan il mare di tetti corre fino all’orizzonte.',
    },
    shanghai: {
      city: 'Shanghai',
      country: 'Cina',
      landmark: 'La skyline di Pudong',
      description:
        'La skyline di Pudong riunisce la Shanghai Tower, la Oriental Pearl e la Jin Mao: tre generazioni di torri su una sola riva. Di notte le loro luci si riversano nello Huangpu e il lungofiume diventa uno schermo.',
    },
    seoul: {
      city: 'Seul',
      country: 'Corea del Sud',
      landmark: 'La N Seoul Tower',
      description:
        'La N Seoul Tower sorge sul Namsan nel cuore della capitale, e sotto di essa il fiume Han attraversa la città fra decine di ponti illuminati. Di notte la skyline si riempie di luce blu e rossa fino alle montagne.',
    },
    singapore: {
      city: 'Singapore',
      country: 'Singapore',
      landmark: 'Marina Bay Sands',
      description:
        'Marina Bay Sands solleva tre torri e una terrazza a forma di nave dall’acqua nel cuore della città. Di notte i giardini e il padiglione bianco a loto si illuminano e si riflettono nella baia.',
    },
    bangkok: {
      city: 'Bangkok',
      country: 'Thailandia',
      landmark: 'Wat Arun',
      description:
        'Wat Arun, il Tempio dell’Alba, si affaccia sul Chao Phraya con il prang centrale rivestito di porcellana colorata. Al tramonto le barche passano davanti e il fiume diventa color rame.',
    },
    mumbai: {
      city: 'Mumbai',
      country: 'India',
      landmark: 'Il Gateway of India',
      description:
        'Il Gateway of India, l’arco di basalto eretto nel 1924 sul lungomare, chiude Colaba. La sera la pietra diventa arancio intenso sotto le luci del porto.',
    },
    delhi: {
      city: 'Nuova Delhi',
      country: 'India',
      landmark: 'India Gate',
      description:
        'India Gate, l’arco di pietra alto 42 metri, chiude l’asse di Kartavya Path nel cuore della capitale. Al tramonto l’arenaria brilla e i prati si riempiono di gente.',
    },
    'kuala-lumpur': {
      city: 'Kuala Lumpur',
      country: 'Malesia',
      landmark: 'Le Petronas Towers',
      description:
        'Le Petronas Towers salgono per 452 metri e sono unite da un doppio ponte al quarantunesimo piano. Di notte le facciate d’acciaio brillano sopra il parco KLCC.',
    },
    jakarta: {
      city: 'Giacarta',
      country: 'Indonesia',
      landmark: 'Il Monumento Nazionale',
      description:
        'Il Monumento Nazionale sale 137 metri nel cuore di Giacarta, con una fiamma dorata in cima. Al tramonto la città diventa un mare di luci sotto un cielo tropicale in movimento.',
    },
    sydney: {
      city: 'Sydney',
      country: 'Australia',
      landmark: 'La Sydney Opera House',
      description:
        'La Sydney Opera House con le sue conchiglie bianche siede sull’acqua, e dietro si incurva l’Harbour Bridge. Al tramonto le conchiglie diventano rosa e si illuminano dall’interno.',
    },
    'cape-town': {
      city: 'Città del Capo',
      country: 'Sudafrica',
      landmark: 'La Table Mountain',
      description:
        'La Table Mountain, con la sua cima piatta a 1.085 metri, si alza dietro la città come un tavolo gigante. All’alba la sua celebre tovaglia di nuvole si riversa oltre il bordo e una luce rosa cade sulle strade.',
    },
    lagos: {
      city: 'Lagos',
      country: 'Nigeria',
      landmark: 'Il Third Mainland Bridge',
      description:
        'Il Third Mainland Bridge, il più lungo d’Africa con 11,8 chilometri, attraversa la laguna di Lagos e collega l’isola alla terraferma. Di notte diventa una linea di luce sull’acqua nera.',
    },
    nairobi: {
      city: 'Nairobi',
      country: 'Kenya',
      landmark: 'La skyline di Nairobi',
      description:
        'Nairobi è l’unica capitale che confina con un parco nazionale intero, e la sua skyline sale subito dietro la savana. Al tramonto la luce dorata cade sull’erba e la città sembra lontana come un miraggio.',
    },
    karachi: {
      city: 'Karachi',
      country: 'Pakistan',
      landmark: 'Il Mazar-e-Quaid',
      description:
        'Il Mazar-e-Quaid, con la cupola di marmo bianco, sta su una collina sopra Karachi dal 1971. Al tramonto il marmo brilla e il mausoleo sembra galleggiare sopra la città.',
    },
  },
};

/** Editorial copy for the generic backdrop used when a city has no curated scene. */
export const FALLBACK_I18N: Record<TranslatedLang, LandmarkText> = {
  en: {
    city: '',
    country: '',
    landmark: 'An open horizon',
    description:
      'Another city under the same sky. There is no archive photo for this place yet, but the weather here is live and real.',
  },
  de: {
    city: '',
    country: '',
    landmark: 'Ein offener Horizont',
    description:
      'Eine weitere Stadt unter demselben Himmel. Für diesen Ort gibt es noch kein Archivfoto, aber das Wetter hier ist live und echt.',
  },
  ru: {
    city: '',
    country: '',
    landmark: 'Открытый горизонт',
    description:
      'Ещё один город под одним небом. Для этого места пока нет архивного фото, но погода здесь настоящая и в реальном времени.',
  },
  it: {
    city: '',
    country: '',
    landmark: 'Un orizzonte aperto',
    description:
      'Un’altra città sotto lo stesso cielo. Non c’è ancora una foto d’archivio per questo posto, ma il meteo qui è reale e in tempo reale.',
  },
};
