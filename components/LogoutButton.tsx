'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useLang } from './LangProvider';

export default function LogoutButton() {
  const { session, signOut } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!session) return null;

  const leave = async () => {
    setBusy(true);
    await signOut();
    router.replace('/login');
  };

  return (
    <button
      type="button"
      onClick={leave}
      disabled={busy}
      aria-label={t('authLogout')}
      className="panel-solid focus-ring flex items-center gap-1.5 rounded-[14px] px-2.5 py-2 text-[11px] text-cream/80 transition hover:text-white active:scale-[0.98] disabled:opacity-60 sm:px-3"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
        <path d="M16 8l4 4-4 4M20 12H9" />
      </svg>
      <span className="hidden sm:inline">{t('authLogout')}</span>
    </button>
  );
}
