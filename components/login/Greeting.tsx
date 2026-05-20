import React from 'react';
import { View, Text } from "react-native";
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function Greeting() {
  const { isDark } = useTheme();

  return (
    <View className="mt-6 mb-4 items-center gap-1">
        <Text className="text-[16px]" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
            Bienvenido a BigDreamers
        </Text>
        <Text className="italic text-[16px]" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
            “Sueña alto, aprende jugando”
        </Text>
    </View>
  );
}