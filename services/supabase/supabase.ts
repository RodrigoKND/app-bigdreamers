import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { key, url } from '@/config/supabase';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

let client: SupabaseClient | null = null;

// SecureStore can hang indefinitely on Android (device keystore not ready).
// Wrap every call with a 3-second timeout so we always fall back to AsyncStorage.
function withSecureStoreTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), 3000)),
  ]);
}

const secureStorage = {
  getItem: async (name: string) => {
    try {
      const value = await withSecureStoreTimeout(SecureStore.getItemAsync(name), null);
      if (value !== null) return value;
      return await AsyncStorage.getItem(name);
    } catch {
      return await AsyncStorage.getItem(name);
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await withSecureStoreTimeout(SecureStore.setItemAsync(name, value), undefined as void);
    } catch { /* ignore */ }
    try { await AsyncStorage.setItem(name, value); } catch { /* ignore */ }
  },
  removeItem: async (name: string) => {
    try {
      await withSecureStoreTimeout(SecureStore.deleteItemAsync(name), undefined as void);
    } catch { /* ignore */ }
    try { await AsyncStorage.removeItem(name); } catch { /* ignore */ }
  },
};

export async function getSupabaseClient() {
  if (client) return client;
  client = createClient(url!, key!, {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // PKCE: el retorno trae ?code= (302 limpio que el Custom Tab intercepta),
      // en vez del flujo implícito con #access_token que rompe en Chrome
      // (ERR_UNKNOWN_URL_SCHEME).
      flowType: 'pkce',
    },
  });
  return client;
}
