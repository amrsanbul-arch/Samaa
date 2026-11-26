'use client';

import { useMemo } from 'react';
import { useLang } from '@/components/LangProvider';
import { LANDMARKS, localizedText, sceneThumbSrc } from '@/lib/landmarks';

/**
 * Attribution for every landmark photo. Each row is generated from the same
 * `credit` object the scene shows, so the caption and this page cannot drift.
 */
export default function CreditsPage() {
  const { lang, t } = useLang();

  const entries = useMemo(
    () =>
      LANDMARKS.map((item) => ({ item, text: localizedText(item, lang) })).sort(
        (a, b) =>
          a.text.country.localeCompare(b.text.country, lang) ||
          a.text.city.localeCompare(b.text.city, lang)
      ),
    [lang]
  );

  return (
    <main className="theme-nile min-h-screen bg-[#0B1220] px-4 pb-16 pt-10 text-cream sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-3xl">
          <a
            href="/"
            className="text-[12px] text-cream/60 underline-offset-2 transition hover:text-cream hover:underline"
          >
            ← {t('backToWeather')}
          </a>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            {t('creditsTitle')}
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-cream/70">{t('creditsIntro')}</p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ item, text }) => (
            <li key={item.id} className="panel overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sceneThumbSrc(item.image)}
                alt={`${text.landmark}, ${text.city}`}
                loading="lazy"
                decoding="async"
                className="h-40 w-full object-cover"
              />
              <div className="p-3.5">
                <p className="text-sm font-semibold leading-snug text-white">{text.landmark}</p>
                <p className="mt-0.5 text-[11.5px] text-cream/60">
                  {text.city} · {text.country}
                </p>
                <dl className="mt-2.5 space-y-1 text-[11px] leading-relaxed text-cream/60">
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 text-cream/40">{t('photographerLabel')}:</dt>
                    <dd className="min-w-0 text-cream/80">{item.credit.photographer}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 text-cream/40">{t('licenseLabel')}:</dt>
                    <dd className="min-w-0">
                      {item.credit.licenseUrl ? (
                        <a
                          href={item.credit.licenseUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-brand underline-offset-2 hover:underline"
                        >
                          {item.credit.license}
                        </a>
                      ) : (
                        <span className="text-cream/80">{item.credit.license}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 text-cream/40">{t('sourceLabel')}:</dt>
                    <dd className="min-w-0">
                      <a
                        href={item.credit.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-brand underline-offset-2 hover:underline"
                      >
                        {item.credit.source}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 text-cream/40">{t('changesLabel')}:</dt>
                    <dd className="min-w-0">{item.credit.changes}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
