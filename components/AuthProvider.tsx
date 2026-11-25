'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createSupabaseClient, type AuthConfig } from '@/lib/supabase';
import type { SocialProvider } from '@/lib/auth-errors';

type AuthResult = { error: unknown | null };

type SignUpResult = AuthResult & { needsConfirmation: boolean };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been resolved. */
  loading: boolean;
  configured: boolean;
  appleEnabled: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signInWithProvider: (provider: SocialProvider) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  config,
  children,
}: {
  config: AuthConfig;
  children: React.ReactNode;
}) {
  const client = useMemo(() => createSupabaseClient(config), [config.url, config.anonKey, config.configured]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(client));

  useEffect(() => {
    if (!client) {
      setSession(null);
      setLoading(false);
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!client) return { error: new Error('auth-not-configured') };
      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error };
    },
    [client]
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<SignUpResult> => {
      if (!client) return { error: new Error('auth-not-configured'), needsConfirmation: false };
      const { data, error } = await client.auth.signUp({ email, password });
      return { error, needsConfirmation: Boolean(data.user && !data.session) };
    },
    [client]
  );

  const signInWithProvider = useCallback(
    async (provider: SocialProvider): Promise<AuthResult> => {
      if (!client) return { error: new Error('auth-not-configured') };
      try {
        const { error } = await client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin },
        });
        return { error };
      } catch (error) {
        return { error };
      }
    },
    [client]
  );

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (!client) return { error: new Error('auth-not-configured') };
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { error };
    },
    [client]
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    setSession(null);
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configured: config.configured,
      appleEnabled: config.appleEnabled,
      signIn,
      signUp,
      signInWithProvider,
      resetPassword,
      signOut,
    }),
    [session, loading, config.configured, config.appleEnabled, signIn, signUp, signInWithProvider, resetPassword, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
