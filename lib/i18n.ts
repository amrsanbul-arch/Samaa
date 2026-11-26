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
  'creditsTitle',
  'creditsIntro',
  'creditsLink',
  'photographerLabel',
  'licenseLabel',
  'sourceLabel',
  'changesLabel',
  'backToWeather',
  'dragHint',
  'soundOn',
  'soundOff',
  'language',
  'live',
  'windUnit',
  'authLoginTitle',
  'authSignupTitle',
  'authResetTitle',
  'authEmail',
  'authPassword',
  'authEmailPlaceholder',
  'authPasswordPlaceholder',
  'authForgot',
  'authLoginButton',
  'authSignupButton',
  'authResetButton',
  'authTerms',
  'authOr',
  'authGoogle',
  'authApple',
  'authNoAccount',
  'authSignUp',
  'authHaveAccount',
  'authSignIn',
  'authBackToLogin',
  'authNotConfigured',
  'authConfirmEmail',
  'authResetSent',
  'authShowPassword',
  'authHidePassword',
  'authLogout',
  'authProviderGoogle',
  'authProviderApple',
  'authErrorInvalidEmail',
  'authErrorWeakPassword',
  'authErrorInvalidCredentials',
  'authErrorEmailNotConfirmed',
  'authErrorUserExists',
  'authErrorRateLimit',
  'authErrorNetwork',
  'authErrorProviderDisabled',
  'authErrorUnknown',
  'authChecking',
] as const;

export type UiKey = (typeof UI_KEYS)[number];
type Dict = Record<UiKey, string>;

const ar: Dict = {
  brand: 'سماء',
  tagline: 'الطقس .. بكل .. وضوح',
  heroTitle: 'إلى أين نسافر اليوم؟',
  heroSubtitle: 'اكتب اسم مدينة، وستحلّق الكرة الأرضية إلى مشهدها.',
  searchPlaceholder: 'ابحث عن مدينة… القاهرة، لندن، طوكيو',
  searchButton: 'استكشف',
  searchAria: 'ابحث عن مدينة',
  popular: 'الأكثر بحثاً',
  footerNote: 'اسحب الكرة لتدويرها · البيانات من Open-Meteo · الصور من ويكيميديا كومنز',
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
  forecastTitle: 'توقعات ٧ أيام',
  forecastHint: 'العظمى والصغرى',
  today: 'اليوم',
  dataLabel: 'البيانات',
  imageLabel: 'الصورة',
  creditsTitle: 'حقوق الصور',
  creditsIntro: 'كل صورة معلم هنا من ويكيميديا كومنز. يذكر كل سطر المصوّر والرخصة ورابط صفحة الملف الأصلي، وما غيّرناه في الصورة.',
  creditsLink: 'كل المصادر والحقوق',
  photographerLabel: 'المصوّر',
  licenseLabel: 'الرخصة',
  sourceLabel: 'المصدر',
  changesLabel: 'التغييرات',
  backToWeather: 'العودة إلى الطقس',
  dragHint: 'اسحب للأعلى للتفاصيل',
  soundOn: 'إيقاف الصوت',
  soundOff: 'تشغيل الصوت',
  language: 'اللغة',
  live: 'مباشر',
  windUnit: 'كم/س',
  authLoginTitle: 'تسجيل الدخول إلى سماء',
  authSignupTitle: 'إنشاء حساب في سماء',
  authResetTitle: 'إعادة تعيين كلمة المرور',
  authEmail: 'البريد الإلكتروني',
  authPassword: 'كلمة المرور',
  authEmailPlaceholder: 'name@example.com',
  authPasswordPlaceholder: '••••••••',
  authForgot: 'نسيت كلمة المرور؟',
  authLoginButton: 'دخول',
  authSignupButton: 'إنشاء حساب',
  authResetButton: 'إرسال رابط إعادة التعيين',
  authTerms: 'بتسجيل الدخول، أنت توافق على الشروط وسياسة الخصوصية.',
  authOr: 'أو',
  authGoogle: 'تسجيل الدخول بجوجل',
  authApple: 'تسجيل الدخول بأبل',
  authNoAccount: 'ليس لديك حساب؟',
  authSignUp: 'إنشاء حساب',
  authHaveAccount: 'لديك حساب؟',
  authSignIn: 'تسجيل الدخول',
  authBackToLogin: 'رجوع إلى تسجيل الدخول',
  authNotConfigured: 'خدمة تسجيل الدخول لم يتم إعدادها بعد.',
  authConfirmEmail: 'تم إنشاء حسابك! افتح بريدك الإلكتروني واضغط على رابط التأكيد عشان تقدر تسجّل دخولك.',
  authResetSent: 'بعتنا لك رابط إعادة تعيين كلمة المرور على بريدك.',
  authShowPassword: 'إظهار كلمة المرور',
  authHidePassword: 'إخفاء كلمة المرور',
  authLogout: 'تسجيل الخروج',
  authProviderGoogle: 'جوجل',
  authProviderApple: 'أبل',
  authErrorInvalidEmail: 'اكتب بريداً إلكترونياً صحيحاً.',
  authErrorWeakPassword: 'كلمة المرور لازم تكون 6 أحرف على الأقل.',
  authErrorInvalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  authErrorEmailNotConfirmed: 'لازم تأكد بريدك الإلكتروني الأول. راجع صندوق الوارد.',
  authErrorUserExists: 'البريد ده مسجّل قبل كده. جرّب تسجّل الدخول.',
  authErrorRateLimit: 'محاولات كتير. استنى شوية وجرّب تاني.',
  authErrorNetwork: 'مشكلة في الاتصال. تأكد من الإنترنت وحاول تاني.',
  authErrorProviderDisabled: '«{provider}» مش متاح دلوقتي لأنه لسه ما اتفعّلش. جرّب البريد وكلمة المرور.',
  authErrorUnknown: 'حصل خطأ غير متوقع. حاول مرة تانية.',
  authChecking: 'بنراجع جلستك…',
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
  footerNote: 'Drag the globe to spin it · Data by Open-Meteo · Photos from Wikimedia Commons',
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
  creditsTitle: 'Photo credits',
  creditsIntro: 'Every landmark photo here comes from Wikimedia Commons. Each entry names the photographer, the licence and the exact file page, and says what this site changed.',
  creditsLink: 'All credits',
  photographerLabel: 'Photographer',
  licenseLabel: 'Licence',
  sourceLabel: 'Source',
  changesLabel: 'Changes',
  backToWeather: 'Back to the weather',
  dragHint: 'Swipe up for details',
  soundOn: 'Mute sound',
  soundOff: 'Play sound',
  language: 'Language',
  live: 'Live',
  windUnit: 'km/h',
  authLoginTitle: 'Log in to Samaa',
  authSignupTitle: 'Create your Samaa account',
  authResetTitle: 'Reset your password',
  authEmail: 'Email',
  authPassword: 'Password',
  authEmailPlaceholder: 'name@example.com',
  authPasswordPlaceholder: '••••••••',
  authForgot: 'Forgot your password?',
  authLoginButton: 'Log In',
  authSignupButton: 'Sign up',
  authResetButton: 'Send reset link',
  authTerms: 'By signing in, you agree to our Terms and Privacy Policy.',
  authOr: 'or',
  authGoogle: 'Log in with Google',
  authApple: 'Log in with Apple',
  authNoAccount: 'Don’t have an account?',
  authSignUp: 'Sign up',
  authHaveAccount: 'Already have an account?',
  authSignIn: 'Log in',
  authBackToLogin: 'Back to log in',
  authNotConfigured: 'Sign-in is not configured yet.',
  authConfirmEmail: 'Your account is created. Open your inbox and click the confirmation link to sign in.',
  authResetSent: 'We sent a password reset link to your email.',
  authShowPassword: 'Show password',
  authHidePassword: 'Hide password',
  authLogout: 'Log out',
  authProviderGoogle: 'Google',
  authProviderApple: 'Apple',
  authErrorInvalidEmail: 'Enter a valid email address.',
  authErrorWeakPassword: 'Password must be at least 6 characters.',
  authErrorInvalidCredentials: 'The email or password is incorrect.',
  authErrorEmailNotConfirmed: 'Confirm your email first. Check your inbox.',
  authErrorUserExists: 'That email is already registered. Try logging in.',
  authErrorRateLimit: 'Too many attempts. Wait a moment and try again.',
  authErrorNetwork: 'Connection problem. Check your internet and try again.',
  authErrorProviderDisabled: '“{provider}” sign-in is not available yet because the provider is not enabled. Use email and password.',
  authErrorUnknown: 'Something unexpected happened. Please try again.',
  authChecking: 'Checking your session…',
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
  footerNote: 'Globus zum Drehen ziehen · Daten von Open-Meteo · Fotos von Wikimedia Commons',
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
  creditsTitle: 'Bildnachweise',
  creditsIntro: 'Alle Bilder stammen von Wikimedia Commons. Jeder Eintrag nennt Fotograf, Lizenz und die genaue Dateiseite sowie die Änderungen dieser Seite.',
  creditsLink: 'Alle Nachweise',
  photographerLabel: 'Fotograf',
  licenseLabel: 'Lizenz',
  sourceLabel: 'Quelle',
  changesLabel: 'Änderungen',
  backToWeather: 'Zurück zum Wetter',
  dragHint: 'Nach oben wischen für Details',
  soundOn: 'Ton aus',
  soundOff: 'Ton an',
  language: 'Sprache',
  live: 'Live',
  windUnit: 'km/h',
  authLoginTitle: 'Bei Samaa anmelden',
  authSignupTitle: 'Samaa-Konto erstellen',
  authResetTitle: 'Passwort zurücksetzen',
  authEmail: 'E-Mail',
  authPassword: 'Passwort',
  authEmailPlaceholder: 'name@beispiel.de',
  authPasswordPlaceholder: '••••••••',
  authForgot: 'Passwort vergessen?',
  authLoginButton: 'Anmelden',
  authSignupButton: 'Konto erstellen',
  authResetButton: 'Link zum Zurücksetzen senden',
  authTerms: 'Mit der Anmeldung stimmst du unseren Bedingungen und der Datenschutzerklärung zu.',
  authOr: 'oder',
  authGoogle: 'Mit Google anmelden',
  authApple: 'Mit Apple anmelden',
  authNoAccount: 'Noch kein Konto?',
  authSignUp: 'Registrieren',
  authHaveAccount: 'Schon ein Konto?',
  authSignIn: 'Anmelden',
  authBackToLogin: 'Zurück zur Anmeldung',
  authNotConfigured: 'Die Anmeldung ist noch nicht eingerichtet.',
  authConfirmEmail: 'Dein Konto ist erstellt. Öffne dein Postfach und klicke auf den Bestätigungslink, um dich anzumelden.',
  authResetSent: 'Wir haben dir einen Link zum Zurücksetzen des Passworts geschickt.',
  authShowPassword: 'Passwort anzeigen',
  authHidePassword: 'Passwort verbergen',
  authLogout: 'Abmelden',
  authProviderGoogle: 'Google',
  authProviderApple: 'Apple',
  authErrorInvalidEmail: 'Gib eine gültige E-Mail-Adresse ein.',
  authErrorWeakPassword: 'Das Passwort muss mindestens 6 Zeichen haben.',
  authErrorInvalidCredentials: 'E-Mail oder Passwort ist falsch.',
  authErrorEmailNotConfirmed: 'Bestätige zuerst deine E-Mail. Prüfe dein Postfach.',
  authErrorUserExists: 'Diese E-Mail ist bereits registriert. Melde dich an.',
  authErrorRateLimit: 'Zu viele Versuche. Warte kurz und versuche es erneut.',
  authErrorNetwork: 'Verbindungsproblem. Prüfe dein Internet und versuche es erneut.',
  authErrorProviderDisabled: '„{provider}“-Anmeldung ist noch nicht verfügbar, der Anbieter ist nicht aktiviert. Nutze E-Mail und Passwort.',
  authErrorUnknown: 'Etwas ist schiefgelaufen. Versuche es erneut.',
  authChecking: 'Sitzung wird geprüft…',
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
  footerNote: 'Потяните глобус, чтобы вращать · Данные Open-Meteo · Фото с Wikimedia Commons',
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
  creditsTitle: 'Права на фотографии',
  creditsIntro: 'Все фотографии взяты с Wikimedia Commons. Для каждой указаны автор, лицензия и точная страница файла, а также изменения, внесённые сайтом.',
  creditsLink: 'Все авторы',
  photographerLabel: 'Автор',
  licenseLabel: 'Лицензия',
  sourceLabel: 'Источник',
  changesLabel: 'Изменения',
  backToWeather: 'Назад к погоде',
  dragHint: 'Смахните вверх для деталей',
  soundOn: 'Выключить звук',
  soundOff: 'Включить звук',
  language: 'Язык',
  live: 'Онлайн',
  windUnit: 'км/ч',
  authLoginTitle: 'Вход в Samaa',
  authSignupTitle: 'Создать аккаунт Samaa',
  authResetTitle: 'Сброс пароля',
  authEmail: 'Эл. почта',
  authPassword: 'Пароль',
  authEmailPlaceholder: 'name@example.com',
  authPasswordPlaceholder: '••••••••',
  authForgot: 'Забыли пароль?',
  authLoginButton: 'Войти',
  authSignupButton: 'Создать аккаунт',
  authResetButton: 'Отправить ссылку',
  authTerms: 'Входя в аккаунт, вы соглашаетесь с условиями и политикой конфиденциальности.',
  authOr: 'или',
  authGoogle: 'Войти через Google',
  authApple: 'Войти через Apple',
  authNoAccount: 'Нет аккаунта?',
  authSignUp: 'Зарегистрироваться',
  authHaveAccount: 'Уже есть аккаунт?',
  authSignIn: 'Войти',
  authBackToLogin: 'Вернуться ко входу',
  authNotConfigured: 'Вход пока не настроен.',
  authConfirmEmail: 'Аккаунт создан. Откройте почту и нажмите ссылку подтверждения, чтобы войти.',
  authResetSent: 'Мы отправили ссылку для сброса пароля на вашу почту.',
  authShowPassword: 'Показать пароль',
  authHidePassword: 'Скрыть пароль',
  authLogout: 'Выйти',
  authProviderGoogle: 'Google',
  authProviderApple: 'Apple',
  authErrorInvalidEmail: 'Введите корректный адрес почты.',
  authErrorWeakPassword: 'Пароль должен быть не короче 6 символов.',
  authErrorInvalidCredentials: 'Неверная почта или пароль.',
  authErrorEmailNotConfirmed: 'Сначала подтвердите почту. Проверьте входящие.',
  authErrorUserExists: 'Эта почта уже зарегистрирована. Попробуйте войти.',
  authErrorRateLimit: 'Слишком много попыток. Подождите и попробуйте снова.',
  authErrorNetwork: 'Проблема с подключением. Проверьте интернет и повторите.',
  authErrorProviderDisabled: 'Вход через «{provider}» пока недоступен: провайдер не включён. Используйте почту и пароль.',
  authErrorUnknown: 'Что-то пошло не так. Попробуйте ещё раз.',
  authChecking: 'Проверяем сеанс…',
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
  footerNote: 'Trascina il globo per ruotarlo · Dati di Open-Meteo · Foto da Wikimedia Commons',
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
  creditsTitle: 'Crediti fotografici',
  creditsIntro: 'Tutte le foto provengono da Wikimedia Commons. Ogni voce indica fotografo, licenza e la pagina esatta del file, oltre alle modifiche apportate dal sito.',
  creditsLink: 'Tutti i crediti',
  photographerLabel: 'Fotografo',
  licenseLabel: 'Licenza',
  sourceLabel: 'Fonte',
  changesLabel: 'Modifiche',
  backToWeather: 'Torna al meteo',
  dragHint: 'Scorri verso l’alto per i dettagli',
  soundOn: 'Disattiva audio',
  soundOff: 'Attiva audio',
  language: 'Lingua',
  live: 'Live',
  windUnit: 'km/h',
  authLoginTitle: 'Accedi a Samaa',
  authSignupTitle: 'Crea il tuo account Samaa',
  authResetTitle: 'Reimposta la password',
  authEmail: 'Email',
  authPassword: 'Password',
  authEmailPlaceholder: 'nome@esempio.it',
  authPasswordPlaceholder: '••••••••',
  authForgot: 'Password dimenticata?',
  authLoginButton: 'Accedi',
  authSignupButton: 'Crea account',
  authResetButton: 'Invia link di reset',
  authTerms: 'Accedendo accetti i nostri Termini e la Privacy Policy.',
  authOr: 'oppure',
  authGoogle: 'Accedi con Google',
  authApple: 'Accedi con Apple',
  authNoAccount: 'Non hai un account?',
  authSignUp: 'Registrati',
  authHaveAccount: 'Hai già un account?',
  authSignIn: 'Accedi',
  authBackToLogin: 'Torna al login',
  authNotConfigured: 'L’accesso non è ancora configurato.',
  authConfirmEmail: 'Account creato. Apri la posta e clicca il link di conferma per accedere.',
  authResetSent: 'Ti abbiamo inviato un link per reimpostare la password.',
  authShowPassword: 'Mostra password',
  authHidePassword: 'Nascondi password',
  authLogout: 'Esci',
  authProviderGoogle: 'Google',
  authProviderApple: 'Apple',
  authErrorInvalidEmail: 'Inserisci un indirizzo email valido.',
  authErrorWeakPassword: 'La password deve avere almeno 6 caratteri.',
  authErrorInvalidCredentials: 'Email o password non corretti.',
  authErrorEmailNotConfirmed: 'Conferma prima la tua email. Controlla la posta.',
  authErrorUserExists: 'Questa email è già registrata. Prova ad accedere.',
  authErrorRateLimit: 'Troppi tentativi. Attendi e riprova.',
  authErrorNetwork: 'Problema di connessione. Controlla internet e riprova.',
  authErrorProviderDisabled: 'L’accesso con «{provider}» non è ancora disponibile: il provider non è attivo. Usa email e password.',
  authErrorUnknown: 'Qualcosa è andato storto. Riprova.',
  authChecking: 'Verifica della sessione…',
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

/**
 * ISO region of the browser's language (e.g. "ar-EG" → "EG"), used as a soft
 * hint so a city search prefers the visitor's own country on a name tie.
 */
export function localeRegion(): string {
  if (typeof navigator === 'undefined') return '';
  const tags = [...(navigator.languages ?? []), navigator.language ?? ''];
  for (const tag of tags) {
    if (!tag) continue;
    try {
      const region = new Intl.Locale(tag).region;
      if (region) return region.toUpperCase();
    } catch {
      const match = tag.split('-').find((part) => /^[A-Za-z]{2}$/.test(part) && part !== tag);
      if (match) return match.toUpperCase();
    }
  }
  return '';
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
