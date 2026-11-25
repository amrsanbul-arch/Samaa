'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useLang } from './LangProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { translateAuthError, type SocialProvider } from '@/lib/auth-errors';

type Mode = 'login' | 'signup' | 'reset';
type Busy = null | 'email' | SocialProvider;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 6;

const INPUT =
  'h-11 w-full rounded-lg border border-[#333B3E] bg-[#191B1E] px-3 text-[16px] text-[#F0F0F0] outline-none transition-colors placeholder:text-[#878D8F] focus:border-[#A1A4A5] focus:ring-1 focus:ring-[#A1A4A5] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]';
const LABEL = 'mb-1.5 block text-[13px] text-[#A1A4A5]';
const LINK =
  'rounded-sm text-[#A1A4A5] transition-colors hover:text-[#F0F0F0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A1A4A5]';
const SOCIAL =
  'flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#333B3E] bg-[#191B1E] text-[14px] font-medium text-[#F0F0F0] transition-colors hover:border-[#3B4345] hover:bg-[#212629] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A1A4A5] disabled:cursor-not-allowed disabled:opacity-50';

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={`h-4 w-4 animate-spin rounded-full border-2 ${
        dark ? 'border-[#141517]/25 border-t-[#141517]' : 'border-[#F0F0F0]/25 border-t-[#F0F0F0]'
      }`}
    />
  );
}

function SamaaMark() {
  return (
    <span className="mx-auto grid h-10 w-10 place-items-center rounded-[10px] border border-white/10 text-[#F0F0F0]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
        <circle cx="9.5" cy="9" r="3.1" />
        <path d="M9.5 3.4v1.2M3.9 9h1.2M5.5 5l.9.9M13.5 5l-.9.9" />
        <path
          d="M8.4 19.4h8.1a2.9 2.9 0 0 0 .2-5.8 4.6 4.6 0 0 0-8.7 1.1 2.5 2.5 0 0 0 .4 4.7Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
      </svg>
    </span>
  );
}

// Official four-colour "G" mark. The only colour on the page, per the button's own
// brand guidance; everything else here stays monochrome.
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-[18px] w-[18px] shrink-0" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M16.37 1.43c0 1.14-.42 2.2-1.26 3.06-.9.95-1.94 1.5-3.06 1.4-.13-1.1.34-2.2 1.2-3.03.86-.85 2.06-1.4 3.12-1.43zM20.9 17.1c-.55 1.26-.82 1.82-1.53 2.93-.99 1.55-2.38 3.48-4.1 3.5-1.53.01-1.92-1-4-1-2.07 0-2.5.98-4.03 1-1.72.02-3.03-1.72-4.02-3.27-2.77-4.33-3.06-9.4-1.35-12.1 1.21-1.91 3.12-3.03 4.92-3.03 1.83 0 2.98 1.01 4.5 1.01 1.47 0 2.37-1.01 4.49-1.01 1.6 0 3.3.87 4.5 2.38-3.96 2.17-3.32 7.83.62 9.6z" />
    </svg>
  );
}

export default function LoginScreen() {
  const { t } = useLang();
  const router = useRouter();
  const { session, loading, configured, appleEnabled, signIn, signUp, signInWithProvider, resetPassword } =
    useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const disabled = !configured || busy !== null;

  useEffect(() => {
    if (!loading && session) router.replace('/');
  }, [loading, session, router]);

  // A failed OAuth round-trip comes back as `#error=…&error_description=…`, so the
  // provider is validated by Supabase, not here: surface it in the calm error box.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const query = window.location.search.replace(/^\?/, '');
    const params = new URLSearchParams(hash || query);
    const description = params.get('error_description');
    const code = params.get('error_code') ?? params.get('error');
    if (!description && !code) return;

    const text = description ? decodeURIComponent(description.replace(/\+/g, ' ')) : code ?? '';
    const provider: SocialProvider | undefined = /google/i.test(text)
      ? 'google'
      : /apple/i.test(text)
        ? 'apple'
        : undefined;

    setError(translateAuthError({ message: text }, t, provider));
    window.history.replaceState({}, '', window.location.pathname);
  }, [t]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setPassword('');
    setReveal(false);
  };

  const handleError = (caught: unknown, provider?: SocialProvider) => {
    setError(translateAuthError(caught, t, provider));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) return;

    setError(null);
    setNotice(null);

    const address = email.trim();
    if (!EMAIL_PATTERN.test(address)) {
      setError(t('authErrorInvalidEmail'));
      return;
    }
    if (mode !== 'reset' && password.length < MIN_PASSWORD) {
      setError(t('authErrorWeakPassword'));
      return;
    }

    setBusy('email');
    try {
      if (mode === 'reset') {
        const { error: resetError } = await resetPassword(address);
        if (resetError) handleError(resetError);
        else setNotice(t('authResetSent'));
        return;
      }

      if (mode === 'signup') {
        const { error: signUpError, needsConfirmation } = await signUp(address, password);
        if (signUpError) handleError(signUpError);
        else if (needsConfirmation) setNotice(t('authConfirmEmail'));
        else router.replace('/');
        return;
      }

      const { error: signInError } = await signIn(address, password);
      if (signInError) handleError(signInError);
      else router.replace('/');
    } catch (caught) {
      handleError(caught);
    } finally {
      setBusy(null);
    }
  };

  const social = async (provider: SocialProvider) => {
    if (disabled) return;
    setError(null);
    setNotice(null);
    setBusy(provider);
    try {
      const { error: oauthError } = await signInWithProvider(provider);
      if (oauthError) handleError(oauthError, provider);
    } catch (caught) {
      handleError(caught, provider);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-[100dvh] items-center justify-center bg-black">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#F0F0F0]/25 border-t-[#F0F0F0]" aria-label={t('authChecking')} />
      </div>
    );
  }

  const title = mode === 'signup' ? t('authSignupTitle') : mode === 'reset' ? t('authResetTitle') : t('authLoginTitle');
  const action =
    mode === 'signup' ? t('authSignupButton') : mode === 'reset' ? t('authResetButton') : t('authLoginButton');

  return (
    <div className="login-shell relative flex min-h-[100dvh] flex-col items-center justify-center bg-black px-6 py-14">
      {/* NASA ISS night shot of the Nile, public domain — see README for the source. */}
      <div className="login-bg pointer-events-none fixed inset-0 z-0" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/[0.76]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(125%_100%_at_50%_45%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.32)_55%,transparent_80%)]"
      />

      <div className="absolute left-6 top-6 z-20">
        <LanguageSwitcher variant="plain" />
      </div>

      <main className="relative z-10 w-full max-w-[380px]">
        <div className="mb-6 text-center">
          <SamaaMark />
          <h1 className="mt-6 text-[26px] font-semibold leading-[32px] tracking-[-0.02em] text-[#F0F0F0] sm:text-[28px] sm:leading-[34px]">
            {title}
          </h1>
        </div>

        {!configured && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-[#5C4A15] bg-[#2A2410] px-3 py-2.5 text-center text-[12px] leading-relaxed text-[#E8C766]"
          >
            {t('authNotConfigured')}
          </p>
        )}

        <form onSubmit={submit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="auth-email" className={LABEL}>
                {t('authEmail')}
              </label>
              <input
                id="auth-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                dir="ltr"
                required
                disabled={!configured}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('authEmailPlaceholder')}
                className={`${INPUT} text-start`}
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <label htmlFor="auth-password" className="text-[13px] text-[#A1A4A5]">
                    {t('authPassword')}
                  </label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => switchMode('reset')} className={`${LINK} text-[12px]`}>
                      {t('authForgot')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={reveal ? 'text' : 'password'}
                    name="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    disabled={!configured}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t('authPasswordPlaceholder')}
                    className={`${INPUT} pe-11 text-start`}
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((value) => !value)}
                    aria-label={reveal ? t('authHidePassword') : t('authShowPassword')}
                    aria-pressed={reveal}
                    disabled={!configured}
                    className="absolute inset-y-0 end-0 grid w-11 place-items-center text-[#878D8F] transition-colors hover:text-[#F0F0F0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A1A4A5] disabled:opacity-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                      <path d="M2.5 12S6 5.75 12 5.75 21.5 12 21.5 12 18 18.25 12 18.25 2.5 12 2.5 12Z" />
                      <circle cx="12" cy="12" r="3" />
                      {!reveal && <path d="m4 20 16-16" />}
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-[#4A2226] bg-[#241416] px-3 py-2.5 text-[12px] leading-relaxed text-[#F0B4B4]">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-4 rounded-lg border border-[#333B3E] bg-[#191B1E] px-3 py-2.5 text-[12px] leading-relaxed text-[#F0F0F0]">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F0F0F0] text-[14px] font-semibold text-[#141517] transition-colors hover:bg-[#A1A4A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A1A4A5] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === 'email' && <Spinner dark />}
            {action}
          </button>

          <p className="mt-3 text-center text-[12px] leading-relaxed text-[#A1A4A5]">{t('authTerms')}</p>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="my-6 flex items-center gap-3" role="separator">
              <span className="h-px flex-1 bg-[#333B3E]" />
              <span className="text-[12px] text-[#878D8F]">{t('authOr')}</span>
              <span className="h-px flex-1 bg-[#333B3E]" />
            </div>

            <div className="space-y-3">
              <button type="button" onClick={() => social('google')} disabled={disabled} className={SOCIAL}>
                {busy === 'google' ? <Spinner /> : <GoogleMark />}
                {t('authGoogle')}
              </button>
              {appleEnabled && (
                <button type="button" onClick={() => social('apple')} disabled={disabled} className={SOCIAL}>
                  {busy === 'apple' ? <Spinner /> : <AppleMark />}
                  {t('authApple')}
                </button>
              )}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-[13px] text-[#A1A4A5]">
          {mode === 'login' && (
            <>
              {t('authNoAccount')}{' '}
              <button type="button" onClick={() => switchMode('signup')} className={`${LINK} font-semibold text-[#F0F0F0]`}>
                {t('authSignUp')}
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              {t('authHaveAccount')}{' '}
              <button type="button" onClick={() => switchMode('login')} className={`${LINK} font-semibold text-[#F0F0F0]`}>
                {t('authSignIn')}
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button type="button" onClick={() => switchMode('login')} className={LINK}>
              {t('authBackToLogin')}
            </button>
          )}
        </p>
      </main>
    </div>
  );
}
