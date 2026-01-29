import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing env vars:', { 
    hasUrl: !!supabaseUrl, 
    hasAnonKey: !!supabaseAnonKey 
  });
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export interface Profile {
  id: string;
  is_pro: boolean;
  subscription_type?: 'monthly' | 'lifetime' | null;
  created_at?: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

export async function createProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, is_pro: false })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  
  return data;
}
