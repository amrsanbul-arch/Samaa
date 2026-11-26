export type Condition =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder';

export type Place = {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  cloudCover: number;
  isDay: boolean;
  code: number;
  condition: Condition;
};

export type DailyWeather = {
  date: string;
  code: number;
  condition: Condition;
  max: number;
  min: number;
  precipitationProbability: number;
  windMax: number;
};

export type WeatherBundle = {
  current: CurrentWeather;
  daily: DailyWeather[];
  timezone: string;
  utcOffsetSeconds: number;
  sunrise: string | null;
  sunset: string | null;
  fetchedAt: string;
  /** Which upstream produced the reading. */
  source?: string;
  /** True when the upstream failed and an older cached reading is being served. */
  stale?: boolean;
};

export type ThemeName = 'nile' | 'sea' | 'sunset';

/** Everything the credits view and the caption need to attribute a photo. */
export type PhotoCredit = {
  /** Photographer or creator exactly as the source file page records it. */
  photographer: string;
  /** Human-readable licence name. */
  license: string;
  /** Licence deed, when the licence has one. */
  licenseUrl?: string;
  /** Where the file lives. */
  source: string;
  /** Exact source file page, where the reuse terms were checked. */
  url: string;
  /** What this site changed about the original file. */
  changes: string;
  /** Short "photographer · licence" line shown next to the image. */
  label: string;
};

export type Landmark = {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  countryCode: string;
  landmark: string;
  description: string;
  image: string;
  credit: PhotoCredit;
  latitude: number;
  longitude: number;
  aliases: string[];
  /** IANA zone, needed for countries that span several zones. */
  timezone?: string;
  /** True when the city is a capital, so the card can say «Capital of …». */
  capital?: boolean;
  /** CSS object-position used to keep the subject in frame on tall screens. */
  focus?: string;
  /** Extra zoom on tall screens, anchored at the bottom so low subjects stay visible. */
  zoom?: number;
  /** Palette/font theme override; otherwise derived from the id in lib/theme.ts. */
  theme?: ThemeName;
};
