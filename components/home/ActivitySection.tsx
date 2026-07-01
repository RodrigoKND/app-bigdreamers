import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function ActivitySection({ children, isEmpty }: {
  children: React.ReactNode;
  isEmpty?: boolean;
}) {
  const router = useRouter();
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <View className="mx-4 mt-7 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>
          Actividad reciente
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/community')} activeOpacity={0.7}>
          <Text
            className="text-sm font-semibold"
            style={{ color: isDark ? '#93C5FD' : Colors.light.accent }}
          >
            Comunidad →
          </Text>
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View
          className="items-center py-10 rounded-2xl"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : Colors.light.surface,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
        >
          <Activity size={32} color={isDark ? 'rgba(255,255,255,0.25)' : Colors.light.textMuted} />
          <Text className="text-sm font-medium text-center mt-3" style={{ color: textMuted }}>
            Aún no hay actividad reciente
          </Text>
          <Text className="text-xs text-center mt-1" style={{ color: textMuted }}>
            Completa módulos para aparecer aquí
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {children}
        </View>
      )}
    </View>
  );
}
