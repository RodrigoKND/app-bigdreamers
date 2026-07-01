import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { BookOpen, ChevronRight } from 'lucide-react-native';

const CourseCard = React.memo(function CourseCard({ title, lesson, progress = 0 }: {
  title: string;
  lesson: string;
  progress: number;
}) {
  const router = useRouter();
  const { isDark } = useTheme();

  const cardBg      = isDark ? Colors.blue.light         : Colors.light.card;
  const textPrimary = isDark ? Colors.text.primary      : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.5)'  : Colors.light.textSecond;
  const progressBg  = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;
  const progressFg  = isDark ? Colors.gold[400]         : Colors.light.accent;
  const iconBg      = isDark ? 'rgba(255,215,64,0.12)'  : Colors.light.accentLight;
  const iconColor   = isDark ? Colors.gold[400]         : Colors.light.accent;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/learn')}
      activeOpacity={0.75}
      className="mx-4 rounded-2xl p-4"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
          <BookOpen size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-[15px] leading-5" style={{ color: textPrimary }} numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: textMuted }} numberOfLines={1}>
            {lesson}
          </Text>
        </View>
        <ChevronRight size={16} color={isDark ? 'rgba(255,255,255,0.3)' : Colors.light.textMuted} />
      </View>

      <View className="mt-3.5">
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-[11px] font-medium" style={{ color: textMuted }}>
            Progreso del módulo
          </Text>
          <Text className="text-[11px] font-bold" style={{ color: progressFg }}>
            {progress}%
          </Text>
        </View>
        <View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: progressBg }}>
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: progressFg }} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default CourseCard;
