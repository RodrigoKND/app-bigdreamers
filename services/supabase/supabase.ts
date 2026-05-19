import { key, url } from '@/config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

let client: any = null;

export async function getSupabaseClient() {
  if (client) return client;
  const { createClient } = await import('@supabase/supabase-js');
  client = createClient(url!, key!, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}