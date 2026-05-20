import React from 'react';
import { Pressable, Text } from "react-native";
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/services/supabase/googleService";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign'

export default function ButtonLoginGoogle() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      login(user);
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <Pressable
      className="rounded-full px-8 py-2 mt-4 flex flex-row items-center gap-2 border"
      style={{ backgroundColor: isDark ? '#FFFFFF' : Colors.light.surface, borderColor: isDark ? '#D1D5DB' : Colors.light.border }}
      onPress={handleLogin}
    >
      <AntDesign name="google" size={30} color={isDark ? '#1E88E5' : Colors.light.accent} />
      <Text className="font-semibold text-[16px]" style={{ color: isDark ? '#000000' : Colors.light.textPrimary }}>
        Login with Google
      </Text>
    </Pressable>
  );
}