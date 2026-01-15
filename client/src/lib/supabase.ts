import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('http') && supabaseAnonKey.length > 10;

if (!isConfigured) {
  console.warn('Supabase credentials not configured. Auth features will be disabled.');
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
