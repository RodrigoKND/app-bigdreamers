import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/services/supabase/supabase';
import { useUpdateUserModuleProgress } from '@/hooks/learning/useUpdateUserModuleProgress';
import { useCompleteModule } from '@/hooks/learning/useCompleteModule';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { updateProgress } = useUpdateUserModuleProgress();
  const { complete } = useCompleteModule();
  const router = useRouter();
  const [lesson, setLesson] = useState<{ title: string; content: string; durationMinutes: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completing, setCompleting] = useState(false);

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  useEffect(() => {
    if (!lessonId) return;
    let cancelled = false;

    async function fetch() {
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('lessons')
          .select('id, title, content, duration_minutes, module_id')
          .eq('id', lessonId)
          .single();

        if (error) throw error;
        if (!cancelled && data) {
          setLesson({
            title: data.title,
            content: data.content ?? '',
            durationMinutes: data.duration_minutes,
          });
          setModuleId(data.module_id);

          const { count } = await supabase
            .from('lessons')
            .select('id', { count: 'exact' })
            .eq('module_id', data.module_id);
          setTotalLessons(count ?? 1);

          const { data: allLessons } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', data.module_id)
            .order('created_at', { ascending: true });
          setLessonIndex(allLessons?.findIndex(l => l.id === lessonId) ?? 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [lessonId]);

  const handleComplete = async () => {
    if (!user?.id || !moduleId) return;
    setCompleting(true);
    try {
      const newProgress = Math.round(((lessonIndex + 1) / totalLessons) * 100);
      const isLast = lessonIndex + 1 === totalLessons;
      if (isLast) {
        await complete(user.id, moduleId);
      } else {
        await updateProgress(user.id, moduleId, newProgress);
      }
      await invalidateCachePattern(CacheKeys.learningModules);
      await invalidateCachePattern(CacheKeys.userModulesProgress(user.id));
      router.replace(`/module/${moduleId}`);
    } catch (err) {
      console.error('Error completing lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold text-center" style={{ color: textMuted }}>
            Lección no encontrada.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <View className="px-4 pt-4">
        <ButtonBackScreen />
      </View>

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 36, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-2xl font-bold mt-4"
          style={{ color: textPrimary }}
        >
          {lesson.title}
        </Text>

        <Text
          className="text-xs font-medium"
          style={{ color: textMuted }}
        >
          {lesson.durationMinutes} min
        </Text>

        <View
          className="w-8 h-[3px] rounded-sm mt-2"
          style={{ backgroundColor: Colors.gold[400] }}
        />

        <Text
          className="text-base leading-6 mt-2"
          style={{ color: textPrimary }}
        >
          {lesson.content}
        </Text>

        <Pressable
          onPress={handleComplete}
          disabled={completing}
          className="mx-4 mb-6 rounded-2xl py-4 items-center"
          style={{ backgroundColor: completing ? 'rgba(255,255,255,0.1)' : Colors.gold[400] }}
        >
          <Text className="font-extrabold text-base" style={{ color: completing ? 'rgba(255,255,255,0.4)' : '#000' }}>
            {completing ? 'Guardando...' : lessonIndex + 1 === totalLessons ? 'Completar módulo' : 'Completar lección'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
