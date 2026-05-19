import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/images';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types';

const LEVEL_GEM_RANGES: Record<string, { min: number; max: number; label: string }> = {
  bronze: { min: 0,    max: 1000, label: 'Plata' },
  silver: { min: 1000, max: 5000, label: 'Oro' },
  gold:   { min: 5000, max: 5000, label: 'Oro' },
};

export default function UserProfileCard({ user }: { user: User }) {
  const { isDark } = useTheme();
  const range = LEVEL_GEM_RANGES[user.level];
  const progress = user.level === 'gold'
    ? 100
    : Math.min(100, Math.round(((user.gems - range.min) / (range.max - range.min)) * 100));

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

  return (
    <View className="mx-4 p-5 rounded-3xl relative overflow-hidden shadow-md" style={{ backgroundColor: isDark ? '#0D3A6B' : Colors.light.card }}>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="opacity-80" style={{ color: textPrimary }}>Buenos días,</Text>
          <Text className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>{user.name} 👋</Text>
          <View className="bg-gold-500 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-xs font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textOnGold }}>⭐ Nivel {user.level}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm font-medium" style={{ color: textPrimary }}>⚡ {user.streak} días de racha</Text>
          </View>
        </View>
        <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: isDark ? '#F4F7FA' : Colors.light.surface }}>
          <Image source={IMAGES.BUHO} className="w-20 h-20" resizeMode="contain" />
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-xs mb-1 text-levels-gold">
          Progreso al nivel {range.label}: {progress}%
        </Text>
        <View className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : Colors.light.border }}>
          <View style={{ width: `${progress}%` }} className="h-full bg-levels-gold" />
        </View>
      </View>
    </View>
  );
}