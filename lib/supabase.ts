import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type AuthConfig = {
  url: string;
  anonKey: string;
  /** False when the environment is missing the URL or the anon key. */
  configured: boolean;
  appleEnabled: boolean;
};

function firstDefined(...values: (string | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return '';
}

/**
 * Read on the server only: Next inlines `NEXT_PUBLIC_*` into the browser bundle and
 * nothing else, so the values are resolved here and handed to the client provider.
 * The `VITE_*` names stay supported because the deployment docs use them.
 */
export function readAuthConfig(): AuthConfig {
  const url = firstDefined(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.VITE_SUPABASE_URL);
  const anonKey = firstDefined(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.VITE_SUPABASE_ANON_KEY
  );
  const appleFlag = firstDefined(
    process.env.NEXT_PUBLIC_ENABLE_APPLE_LOGIN,
    process.env.VITE_ENABLE_APPLE_LOGIN,
    'true'
  );

  return {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
    appleEnabled: appleFlag.toLowerCase() !== 'false',
  };
}

/** Returns null instead of throwing when the environment is incomplete. */
export function createSupabaseClient(config: AuthConfig): SupabaseClient | null {
  if (!config.configured) return null;

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
