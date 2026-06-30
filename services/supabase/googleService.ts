import { getSupabaseClient } from '@/services/supabase/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { createUser, getUserById } from '@/services/supabase/userService';
import { User } from '@/types';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle(): Promise<User> {
  const supabase = await getSupabaseClient();

  const redirectUrl = Linking.createURL('auth/callback');
  console.log('🔗 Tu URL para Supabase y Google es:', redirectUrl);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type !== 'success' || !result.url) {
    throw new Error('Google authentication was cancelled');
  }

  const { queryParams } = Linking.parse(result.url);
  const errorCode = queryParams?.error_code ?? queryParams?.error;
  if (errorCode) {
    throw new Error(String(queryParams?.error_description ?? errorCode));
  }

  const code = queryParams?.code;
  if (!code || typeof code !== 'string') {
    throw new Error('No se recibió el código de autorización tras el login.');
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
  if (sessionError) throw sessionError;

  const { user } = sessionData;
  if (!user) throw new Error('No user found after setting session');
  if (!user.email) throw new Error('No email found for user');

  const existingUser = await getUserById(user.id);
  if (existingUser) return existingUser;

  return await createUser({
    id: user.id,
    name: user.user_metadata?.full_name || user.email.split('@')[0] || 'User',
    email: user.email,
    avatar: user.user_metadata?.avatar_url || undefined,
  });
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const supabase = await getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
