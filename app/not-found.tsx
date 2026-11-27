import Link from 'next/link';
import Starfield from '@/components/Starfield';

/**
 * Shown for any address the site does not know. Arabic first, like the brand,
 * with a plain way back to the city scenes.
 */
export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="theme-nile relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220]"
    >
      <Starfield dim daylight={false} />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-xl text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="9.5" cy="9" r="3.1" />
                <path d="M9.5 3.4v1.2M3.9 9h1.2M5.5 5l.9.9M13.5 5l-.9.9" />
                <path d="M8.4 19.4h8.1a2.9 2.9 0 0 0 .2-5.8 4.6 4.6 0 0 0-8.7 1.1 2.5 2.5 0 0 0 .4 4.7Z" fill="currentColor" fillOpacity="0.18" />
              </svg>
            </span>
            <p className="font-display text-lg font-extrabold leading-none text-white">سماء</p>
          </div>

          <p className="mt-10 font-display text-[5rem] font-extrabold leading-none text-brand/90">٤٠٤</p>

          <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
            لم نجد هذه الصفحة
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-cream/65">
            الرابط الذي طلبته غير موجود، أو أُزيل مشهده. ابحث عن مدينتك من الصفحة الرئيسية
            وسيُفتح مشهدها مع طقسها.
          </p>
          <p className="mt-2 text-[11px] tracking-wide text-cream/35">Page not found · 404</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-[#141517] transition hover:bg-brand/85 active:scale-[0.98]"
            >
              العودة إلى سماء
            </Link>
            <Link
              href="/credits"
              className="rounded-full border border-cream/25 px-6 py-2.5 text-sm font-semibold text-cream/80 transition hover:border-brand/60 hover:text-brand active:scale-[0.98]"
            >
              المصادر والحقوق
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
