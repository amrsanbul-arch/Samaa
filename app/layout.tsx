import type { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import { Cairo, Inter, Tajawal } from 'next/font/google';
import { LangProvider } from '@/components/LangProvider';
import { DEFAULT_LANG, dirOf, fromAcceptLanguage, isLang } from '@/lib/i18n';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
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
  themeColor: '#04060c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const stored = cookies().get('samaa:lang')?.value;
  const initialLang = isLang(stored)
    ? stored
    : fromAcceptLanguage(headers().get('accept-language')) ?? DEFAULT_LANG;

  return (
    <html
      lang={initialLang}
      dir={dirOf(initialLang)}
      className={`${cairo.variable} ${tajawal.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-night-950 font-sans text-white antialiased">
        <LangProvider initialLang={initialLang}>{children}</LangProvider>
      </body>
    </html>
  );
}
