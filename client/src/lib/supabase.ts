import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('http') && supabaseAnonKey.length > 10;

console.log('[Supabase] Environment check:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  isConfigured,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
});

if (!isConfigured) {
  console.error('[Supabase] Missing environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
}

let supabaseInstance: SupabaseClient | null = null;

if (isConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = isConfigured;

export interface Profile {
  id: string;
  is_pro: boolean;
  subscription_type?: 'monthly' | 'lifetime' | null;
  created_at?: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  
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
  if (!supabase) return null;
  
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
