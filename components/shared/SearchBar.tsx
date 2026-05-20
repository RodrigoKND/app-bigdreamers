import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function SearchBar() {
  const { isDark } = useTheme();

  return (
    <View className="flex-row rounded-md px-4 py-2 items-center mb-6" style={{ backgroundColor: isDark ? '#F3F4F6' : Colors.light.surface }}>
      <TextInput
        placeholder="Buscar empresas..."
        className="flex-1" style={{ color: isDark ? '#4B5563' : Colors.light.textPrimary }}
      />
      <Text className="ml-2" style={{ color: isDark ? '#9CA3AF' : Colors.light.textMuted }}>| ⌥</Text>
    </View>
  );
}
