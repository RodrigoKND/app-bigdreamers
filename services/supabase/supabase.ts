import { key, url } from '@/config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url!, key!, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}