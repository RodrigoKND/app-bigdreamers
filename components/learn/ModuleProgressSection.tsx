import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import ProgressBar from '@/components/shared/ProgressBar';

interface Props {
  completedLessons: number;
  totalLessons: number;
  progress: number;
  isDark: boolean;
}

export default function ModuleProgressSection({
  completedLessons,
  totalLessons,
  progress,
  isDark,
}: Props) {
  const textPrimary  = isDark ? Colors.text.primary    : Colors.light.textPrimary;
  const textMuted    = isDark ? 'rgba(255,255,255,0.6)' : Colors.light.textMuted;
  const cardBg       = isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card;
  const borderColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const progressBg   = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;

  return (
    <View
      className="rounded-2xl p-5"
      style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: textMuted }}
        >
          Tu Progreso
        </Text>
        <Text className="text-sm font-extrabold" style={{ color: Colors.gold[400] }}>
          {progress}%
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        color={Colors.gold[400]}
        bgColor={progressBg}
        height={8}
        className="mb-4"
      />

      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium" style={{ color: textMuted }}>
          {completedLessons} de {totalLessons} lecciones completadas
        </Text>
        {progress === 100 && (
          <Text className="text-xs font-bold" style={{ color: Colors.success }}>
            ✓ Completado
          </Text>
        )}
      </View>
    </View>
  );
}
