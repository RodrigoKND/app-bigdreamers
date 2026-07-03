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
  const textPrimary = isDark ? Colors.text.primary    : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)' : Colors.light.textMuted;

  const lessonItems: LessonItem[] = lessons.map((l, i) => ({
    ...l,
    status: i < completedLessons ? 'completed' : i === completedLessons ? 'active' : 'locked',
  }));

  if (lessons.length === 0) {
    return (
      <View>
        <Text className="text-[15px] font-bold mb-3" style={{ color: textPrimary }}>
          Lecciones
        </Text>
        <View
          className="items-center py-8 rounded-2xl"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : Colors.light.surface,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
        >
          <Text className="text-sm" style={{ color: textMuted }}>
            No hay lecciones disponibles
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-[15px] font-bold mb-3" style={{ color: textPrimary }}>
        Lecciones
      </Text>

      <View className="gap-2">
        {lessonItems.map((lesson, index) => {
          const isCompleted = lesson.status === 'completed';
          const isActive    = lesson.status === 'active';
          const isLocked    = lesson.status === 'locked';

          const iconColor = isCompleted ? Colors.success
                          : isActive    ? Colors.gold[400]
                          : textMuted;

          const borderColor = isActive
            ? Colors.gold[400]
            : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

          const cardBg = isActive
            ? isDark ? 'rgba(255,215,64,0.07)' : '#FFFBEB'
            : isDark ? 'rgba(255,255,255,0.04)' : Colors.light.card;

          return (
            <TouchableOpacity
              key={lesson.id}
              onPress={isLocked || isCompleted ? undefined : () => router.push(`/lesson/${lesson.id}`)}
              activeOpacity={isLocked || isCompleted ? 1 : 0.72}
              className="rounded-2xl p-4 flex-row items-center"
              style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
            >
              {/* Index circle */}
              <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                style={{
                  backgroundColor: isCompleted
                    ? `${Colors.success}18`
                    : isActive
                    ? 'rgba(255,215,64,0.15)'
                    : isDark ? 'rgba(255,255,255,0.07)' : Colors.light.surface,
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                {isCompleted && <CheckCircle size={20} color={iconColor} />}
                {isActive    && <Play        size={20} color={iconColor} fill={iconColor} />}
                {isLocked    && <Lock        size={20} color={iconColor} />}
              </View>

              <View className="flex-1">
                <Text
                  className="text-[14px] font-semibold"
                  style={{ color: isLocked ? textMuted : textPrimary, opacity: isLocked ? 0.6 : 1 }}
                >
                  {index + 1}. {lesson.title}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Clock size={12} color={textMuted} />
                  <Text className="text-xs" style={{ color: textMuted }}>
                    {lesson.durationMinutes} min
                  </Text>
                </View>
              </View>

              {isCompleted && (
                <View
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${Colors.success}18` }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: Colors.success }}>
                    HECHO
                  </Text>
                </View>
              )}
              {isActive && (
                <View
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,215,64,0.18)' }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: Colors.gold[400] }}>
                    SIGUIENTE
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
