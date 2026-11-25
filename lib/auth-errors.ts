import type { UiKey } from './i18n';

export type AuthErrorTranslator = (key: UiKey, vars?: Record<string, string | number>) => string;

export type SocialProvider = 'google' | 'apple';

type ErrorShape = { message?: unknown; error_description?: unknown; status?: unknown; code?: unknown };

function messageOf(error: unknown): string {
  if (typeof error === 'string') return error.toLowerCase();
  if (!error || typeof error !== 'object') return '';
  const shape = error as ErrorShape;
  const raw = shape.message ?? shape.error_description;
  return typeof raw === 'string' ? raw.toLowerCase() : '';
}

function statusOf(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as ErrorShape).status;
  return typeof status === 'number' ? status : null;
}

/**
 * Supabase messages are English and change over time, so the match is loose and
 * every branch falls back to a generic line rather than leaking English to the UI.
 */
export function translateAuthError(
  error: unknown,
  t: AuthErrorTranslator,
  provider?: SocialProvider
): string {
  const message = messageOf(error);
  const status = statusOf(error);

  if (!message && status === null) return t('authErrorUnknown');

  const providerLabel = provider
    ? t(provider === 'google' ? 'authProviderGoogle' : 'authProviderApple')
    : '';

  if (
    /provider is not enabled|unsupported provider|provider .*not enabled|validation_failed/.test(
      message
    )
  ) {
    return provider ? t('authErrorProviderDisabled', { provider: providerLabel }) : t('authErrorUnknown');
  }

  if (/invalid login credentials|invalid_credentials|invalid grant/.test(message)) {
    return t('authErrorInvalidCredentials');
  }
  if (/email not confirmed|email_not_confirmed/.test(message)) {
    return t('authErrorEmailNotConfirmed');
  }
  if (/user already registered|already registered|user_already_exists/.test(message)) {
    return t('authErrorUserExists');
  }
  if (/password should be at least|password_too_short|weak.?password/.test(message)) {
    return t('authErrorWeakPassword');
  }
  if (/rate limit|too many requests|over_.*rate_limit|for security purposes/.test(message) || status === 429) {
    return t('authErrorRateLimit');
  }
  if (/failed to fetch|networkerror|network request failed|load failed/.test(message)) {
    return t('authErrorNetwork');
  }
  if (/invalid email|email address .*invalid|unable to validate email/.test(message)) {
    return t('authErrorInvalidEmail');
  }

  return t('authErrorUnknown');
}
