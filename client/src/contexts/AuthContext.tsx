import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getProfile, createProfile, type Profile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isPro: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    let userProfile = await getProfile(user.id);
    
    if (!userProfile) {
      userProfile = await createProfile(user.id);
    }
    
    setProfile(userProfile);
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user, refreshProfile]);

  const signIn = async () => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Auth not configured');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Sign in error:', error);
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
    setProfile(null);
  };

  const isPro = profile?.is_pro ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isPro,
        isLoading,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
