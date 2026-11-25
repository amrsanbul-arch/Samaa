/** Country → IANA zone, used when the client cannot supply one (fallback providers only). */
const COUNTRY_TZ: Record<string, string> = {
  SA: 'Asia/Riyadh',
  AE: 'Asia/Dubai',
  EG: 'Africa/Cairo',
  DZ: 'Africa/Algiers',
  MA: 'Africa/Casablanca',
  TN: 'Africa/Tunis',
  LY: 'Africa/Tripoli',
  SD: 'Africa/Khartoum',
  JO: 'Asia/Amman',
  LB: 'Asia/Beirut',
  SY: 'Asia/Damascus',
  IQ: 'Asia/Baghdad',
  KW: 'Asia/Kuwait',
  QA: 'Asia/Qatar',
  BH: 'Asia/Bahrain',
  OM: 'Asia/Muscat',
  YE: 'Asia/Aden',
  PS: 'Asia/Gaza',
  MR: 'Africa/Nouakchott',
  SO: 'Africa/Mogadishu',
  DJ: 'Africa/Djibouti',
  KM: 'Indian/Comoro',
  TR: 'Europe/Istanbul',
  IR: 'Asia/Tehran',
  GB: 'Europe/London',
  IE: 'Europe/Dublin',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  IT: 'Europe/Rome',
  ES: 'Europe/Madrid',
  NL: 'Europe/Amsterdam',
  RU: 'Europe/Moscow',
  US: 'America/New_York',
  CA: 'America/Toronto',
  BR: 'America/Sao_Paulo',
  IN: 'Asia/Kolkata',
  PK: 'Asia/Karachi',
  CN: 'Asia/Shanghai',
  JP: 'Asia/Tokyo',
  KR: 'Asia/Seoul',
  AU: 'Australia/Sydney',
  ID: 'Asia/Jakarta',
  MY: 'Asia/Kuala_Lumpur',
  SG: 'Asia/Singapore',
  TH: 'Asia/Bangkok',
  ZA: 'Africa/Johannesburg',
  NG: 'Africa/Lagos',
  KE: 'Africa/Nairobi',
  ET: 'Africa/Addis_Ababa',
  GR: 'Europe/Athens',
  PT: 'Europe/Lisbon',
  SE: 'Europe/Stockholm',
  NO: 'Europe/Oslo',
  PL: 'Europe/Warsaw',
  UA: 'Europe/Kyiv',
};

export function tzForCountry(countryCode?: string | null): string | null {
  if (!countryCode) return null;
  return COUNTRY_TZ[countryCode.toUpperCase()] ?? null;
}

/** Last resort: a fixed offset zone derived from longitude. */
export function tzForLongitude(longitude: number): string {
  const hours = Math.max(-12, Math.min(14, Math.round(longitude / 15)));
  if (hours === 0) return 'Etc/GMT';
  return `Etc/GMT${hours > 0 ? '-' : '+'}${Math.abs(hours)}`;
}

export function isIanaZone(value?: string | null): value is string {
  if (!value || !value.includes('/')) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
