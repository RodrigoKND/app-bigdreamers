import React from 'react';
import { Text, View } from 'react-native';
import { CheckCircle, Play, Lock, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface LessonItem {
  id: string;
  title: string;
  durationMinutes: number;
  status: 'completed' | 'active' | 'locked';
}

interface Props {
  totalLessons: number;
  completedLessons: number;
  isDark: boolean;
}

export default function ModuleLessonList({ totalLessons, completedLessons, isDark }: Props) {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const lessons: LessonItem[] = Array.from({ length: totalLessons }, (_, i) => ({
    id: `lesson-${i + 1}`,
    title: `Lección ${i + 1}`,
    durationMinutes: 5,
    status: i < completedLessons ? 'completed' : i === completedLessons ? 'active' : 'locked',
  }));

  return (
    <View className="space-y-4">
      <Text className="text-base font-bold text-white">Lecciones</Text>

      {lessons.map((lesson) => {
        const active = lesson.status === 'active';
        const locked = lesson.status === 'locked';
        const iconColor = lesson.status === 'completed'
          ? Colors.success
          : lesson.status === 'active'
          ? Colors.gold[400]
          : textMuted;

        return (
          <View
            key={lesson.id}
            className="rounded-xl p-4 flex-row items-center justify-between"
            style={{
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderWidth: 1,
              borderColor: active ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
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
          </View>
        );
      })}
    </View>
  );
}
