import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { key, url } from '@/config/supabase';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

let client: SupabaseClient | null = null;

const secureStorage = {
  getItem: async (name: string) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return await AsyncStorage.getItem(name);
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      await AsyncStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      await AsyncStorage.removeItem(name);
    }
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
