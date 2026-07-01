import React from 'react';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { getSupabaseClient } from '@/services/supabase/supabase';
import { createUser, getUserById } from '@/services/supabase/userService';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export default function AuthCallback() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = await getSupabaseClient();

        // Si signInWithGoogle ya intercambió el código, ya hay sesión:
        // no volvemos a intercambiar (el code es de un solo uso).
        const { data: { session: existing } } = await supabase.auth.getSession();
        if (!existing && code) {
          const { error } = await supabase.auth.exchangeCodeForSession(String(code));
          if (error) throw error;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) throw new Error('No user found');
        if (!user.email) throw new Error('No email found');

        let existingUser = await getUserById(user.id);

        if (!existingUser) {
          existingUser = await createUser({
            id : user.id,
            name: user.user_metadata?.full_name || user.email.split('@')[0] || 'User',
            email: user.email,
            avatar: user.user_metadata?.avatar_url || undefined,
          });
        }

        login(existingUser);
        router.replace('/onboarding');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/login');
      }
    };

    handleCallback();
  }, [code]);

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
      <ActivityIndicator size="large" color={isDark ? Colors.gold[400] : Colors.light.accent} />
    </View>
  );
}
