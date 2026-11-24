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
  credit: { label: string; url: string };
  latitude: number;
  longitude: number;
  aliases: string[];
};
