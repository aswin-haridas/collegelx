// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export default function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          error: null,
        });
      }
    );

    // Check initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error,
        });
      }
    };

    getInitialSession();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return authState;
}
