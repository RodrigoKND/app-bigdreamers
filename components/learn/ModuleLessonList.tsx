import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Play, Lock, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { LessonData } from '@/hooks/learning/useLessonsByModuleId';

interface LessonItem extends LessonData {
  status: 'completed' | 'active' | 'locked';
}

interface Props {
  lessons: LessonData[];
  completedLessons: number;
  isDark: boolean;
}

export default function ModuleLessonList({ lessons, completedLessons, isDark }: Props) {
  const router = useRouter();
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const lessonItems: LessonItem[] = lessons.map((l, i) => ({
    ...l,
    status: i < completedLessons ? 'completed' : i === completedLessons ? 'active' : 'locked',
  }));

  if (lessons.length === 0) {
    return (
      <View className="space-y-4">
        <Text className="text-base font-bold" style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}>Lecciones</Text>
        <Text style={{ color: textMuted }}>No hay lecciones disponibles</Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      <Text className="text-base font-bold" style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}>Lecciones</Text>

      {lessonItems.map((lesson) => {
        const active = lesson.status === 'active';
        const locked = lesson.status === 'locked';
        const iconColor = lesson.status === 'completed'
          ? Colors.success
          : lesson.status === 'active'
          ? Colors.gold[400]
          : textMuted;

        return (
          <TouchableOpacity
            key={lesson.id}
            onPress={locked ? undefined : () => router.push(`/lesson/${lesson.id}`)}
            activeOpacity={locked ? 1 : 0.7}
            className="rounded-xl p-4 flex-row items-center justify-between"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card,
              borderWidth: 1,
              borderColor: active ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-10 h-10 rounded-2xl items-center justify-center"
                style={{ opacity: locked ? 0.5 : 1 }}
              >
                {lesson.status === 'completed' && <CheckCircle size={22} color={iconColor} />}
                {lesson.status === 'active' && <Play size={22} color={iconColor} fill={iconColor} />}
                {lesson.status === 'locked' && <Lock size={22} color={iconColor} />}
              </View>

              <View className="flex-1">
                <Text className="text-sm font-bold" style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}>
                  {lesson.title}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Clock size={14} color={textMuted} />
                  <Text className="text-xs" style={{ color: textMuted }}>
                    {lesson.durationMinutes} min
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
