import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getSupabaseClient } from '@/services/supabase/supabase';
import { createUser, getUserById } from '@/services/supabase/userService';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export default function AuthCallback() {
  const router = useRouter();
  const { session } = useLocalSearchParams<{ session: string }>();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = await getSupabaseClient();

        if (session) {
          const { access_token, refresh_token } = JSON.parse(session);
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
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
  }, [session]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
