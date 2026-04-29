import Login from '@/components/login/Login';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '@/services/supabase/userService';

export default function LoginScreen() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/onboarding');
    }
  }, [isLoggedIn]);

  return <Login />
}
