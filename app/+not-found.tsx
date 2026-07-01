import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function NotFoundScreen() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
        <Text className="text-xl font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>This screen doesn't exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text style={{ color: isDark ? Colors.blue.light : Colors.light.accent }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}