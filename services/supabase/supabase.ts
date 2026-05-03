import { key, url } from '@/config/supabase';

export async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url!, key!);
}