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

  if (result.type === 'success' && result.url) {
    // En Android, a veces los params vienen con '?' en lugar de '#'
    const urlObj = new URL(result.url.replace('#', '?'));
    const accessToken = urlObj.searchParams.get('access_token');
    const refreshToken = urlObj.searchParams.get('refresh_token');

    if (!accessToken) throw new Error('No access token in redirect URL');

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });

    if (sessionError) throw sessionError;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) throw new Error('No user found after setting session');
    if (!user.email) throw new Error('No email found for user');

    const existingUser = await getUserById(user.id);

    if (existingUser) return existingUser;

    const newUser = await createUser({
      id: user.id,
      name: user.user_metadata?.full_name || user.email.split('@')[0] || 'User',
      email: user.email,
      avatar: user.user_metadata?.avatar_url || undefined,
    });

    return newUser;
  }

  throw new Error('Google authentication was cancelled');
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
