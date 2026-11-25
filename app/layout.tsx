import type { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import { Amiri, Cairo, Montserrat, Playfair_Display, Poppins, Tajawal } from 'next/font/google';
import { LangProvider } from '@/components/LangProvider';
import { DEFAULT_LANG, dirOf, fromAcceptLanguage, isLang } from '@/lib/i18n';
import './globals.css';

// Six families: each city theme pairs one Arabic face with one Latin/Cyrillic face.
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سماء · طقس مدن العالم',
  description:
    'تجربة سينمائية للطقس في مدن العالم: كرة أرضية ثلاثية الأبعاد، طقس مباشر، وتوقعات سبعة أيام.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1220',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const stored = cookies().get('samaa:lang')?.value;
  const initialLang = isLang(stored)
    ? stored
    : fromAcceptLanguage(headers().get('accept-language')) ?? DEFAULT_LANG;

  const fonts = [
    cairo.variable,
    tajawal.variable,
    amiri.variable,
    montserrat.variable,
    poppins.variable,
    playfair.variable,
  ].join(' ');

  return (
    <html lang={initialLang} dir={dirOf(initialLang)} className={fonts} suppressHydrationWarning>
      <body className="min-h-screen font-sans text-white antialiased">
        <LangProvider initialLang={initialLang}>{children}</LangProvider>
      </body>
    </html>
  );
}
