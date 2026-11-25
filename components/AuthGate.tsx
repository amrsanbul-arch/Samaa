'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useLang } from './LangProvider';

/** Keeps the globe and the city scenes behind a session. */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="grid min-h-[100svh] place-items-center bg-[#0B1220]">
        <span
          role="status"
          aria-label={t('authChecking')}
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#F7B733]/25 border-t-[#F7B733]"
        />
      </div>
    );
  }

  return <>{children}</>;
}
