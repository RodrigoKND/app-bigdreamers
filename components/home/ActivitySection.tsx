import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function ActivitySection({ children, isEmpty }: { 
  children: React.ReactNode 
  isEmpty?: boolean;
  }) {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <View className="mx-4 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold" style={{ color: textPrimary }}>Actividad reciente</Text>
        <Text className="text-sm font-medium" style={{ color: isDark ? '#93C5FD' : Colors.light.accent }}>Comunidad →</Text>
      </View>
            <View className="p-2 rounded-2xl gap-4">
        {isEmpty ? (
          <View className="items-center py-8 gap-2">
            <Activity size={32} color={isDark ? 'rgba(255,255,255,0.3)' : Colors.light.textMuted} />
            <Text className="text-sm text-center" style={{ color: textMuted }}>
              Aún no hay actividad reciente
            </Text>
            <Text className="text-xs text-center" style={{ color: textMuted }}>
              Completa módulos para aparecer aquí
            </Text>
          </View>
        ) : children}
      </View>
    </View>
  );
};