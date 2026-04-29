import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

interface ProgressHeaderProps {
  streakDays?: number;
}

export default function ProgressHeader({ streakDays = 12 }: ProgressHeaderProps) {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

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
        Mi Progreso
      </Text>

      <View
        className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{
          backgroundColor: isDark ? 'rgba(255,107,53,0.15)' : 'rgba(255,107,53,0.1)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,107,53,0.3)' : 'rgba(255,107,53,0.2)',
        }}
      >
        <Zap size={14} color="#FF6B35" />
        <Text className="text-sm font-bold" style={{ color: '#FF6B35' }}>
          {streakDays} días
        </Text>
      </View>
    </View>
  );
}