import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

export default function CommunityHeader() {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textSecondary = isDark ? Colors.text.secondary : Colors.light.textSecond;
  const cardBg = isDark ? 'rgba(255,255,255,0.10)' : Colors.light.card;

  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 12,
        paddingHorizontal: 20,
      }}
      className="flex-row items-center justify-between"
    >
      <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
        Comunidad
      </Text>
      <Pressable
        accessible
        accessibilityLabel="Buscar en comunidad"
        className="active:opacity-70 w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: cardBg }}
      >
        <Search size={18} color={textSecondary} />
      </Pressable>
    </View>
  );
}