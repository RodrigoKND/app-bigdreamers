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
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const cardBg = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;

  return (
    <View className="rounded-2xl p-5" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
      <Text className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: textMuted }}>
        Tu progreso
      </Text>

      <ProgressBar progress={progress} color={Colors.gold[400]} bgColor="rgba(255,255,255,0.1)" className="mb-4" />

      <Text className="text-sm font-medium" style={{ color: textMuted }}>
        {completedLessons} de {totalLessons} lecciones completadas
      </Text>
    </View>
  );
}
