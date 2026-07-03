import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { IMAGES } from '@/constants/images';

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

  return (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/learn')}
      activeOpacity={0.75}
      className="mx-4 rounded-2xl p-4"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
          <Image source={IMAGES.BUHO} className="w-10 h-10" resizeMode="contain" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-[15px]" style={{ color: textPrimary }} numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: textMuted }} numberOfLines={1}>
            {lesson}
          </Text>
        </View>
      </View>

      <View className="mt-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-[10px] font-medium" style={{ color: textMuted }}>
            Progreso
          </Text>
          <Text className="text-[10px] font-bold" style={{ color: progressFg }}>
            {progress}%
          </Text>
        </View>
        <View className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: progressBg }}>
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: progressFg }} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default CourseCard;
