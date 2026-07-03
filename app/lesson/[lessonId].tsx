import React, { useState, useEffect } from 'react';
import {
  View, Text, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/services/supabase/supabase';
import { useUpdateUserModuleProgress } from '@/hooks/learning/useUpdateUserModuleProgress';
import { useCompleteModule } from '@/hooks/learning/useCompleteModule';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import { Clock } from 'lucide-react-native';
import QuizGame, { parseQuizContent } from '@/components/lesson/QuizGame';
import ReadingLesson from '@/components/lesson/ReadingLesson';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isDark } = useTheme();
  const { user, refreshUser } = useAuth();
  const { updateProgress } = useUpdateUserModuleProgress();
  const { complete }       = useCompleteModule();
  const router = useRouter();

  const [lesson,       setLesson]       = useState<{ title: string; content: string; durationMinutes: number } | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [moduleId,     setModuleId]     = useState<string | null>(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [lessonIndex,  setLessonIndex]  = useState(0);
  const [gemsReward,   setGemsReward]   = useState(0);
  const [completing,   setCompleting]   = useState(false);

  const insets      = useSafeAreaInsets();
  const bg          = isDark ? Colors.blue.primary       : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary       : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)'   : Colors.light.textMuted;

  useEffect(() => {
    if (!lessonId) return;
    let cancelled = false;

    async function fetchLesson() {
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
            title:           data.title,
            content:         data.content ?? '',
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

          // Fetch gems reward from the module
          const { data: moduleData } = await supabase
            .from('learning_modules')
            .select('gems_reward')
            .eq('id', data.module_id)
            .single();
          setGemsReward(moduleData?.gems_reward ?? 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLesson();
    return () => { cancelled = true; };
  }, [lessonId]);

  const handleComplete = async () => {
    if (!user?.id || !moduleId) return;
    setCompleting(true);
    try {
      const newProgress = Math.round(((lessonIndex + 1) / totalLessons) * 100);
      const isLast      = lessonIndex + 1 === totalLessons;
      if (isLast) {
        await complete(user.id, moduleId, gemsReward);
        await refreshUser();
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

  const quizData = parseQuizContent(lesson.content);
  const isLast   = lessonIndex + 1 === totalLessons;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: Math.max(8, insets.top > 0 ? 0 : 12), paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <ButtonBackScreen />
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-[15px] font-bold" style={{ color: textPrimary }} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View
            className="px-2.5 py-1 rounded-full ml-2"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : Colors.light.surface }}
          >
            <Text className="text-[10px] font-semibold" style={{ color: textMuted }}>
              {lessonIndex + 1}/{totalLessons}
            </Text>
          </View>
        </View>
      </View>

      {/* Mode badge */}
      <View className="px-5 pb-3">
        <View className="flex-row items-center gap-2">
          <View
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: quizData
                ? isDark ? 'rgba(96,165,250,0.15)' : '#DBEAFE'
                : isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight,
            }}
          >
            <Text
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: quizData ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? Colors.gold[400] : Colors.light.goldDark) }}
            >
              {quizData ? '🎮 Quiz interactivo' : '📖 Lectura'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={12} color={textMuted} />
            <Text className="text-[11px]" style={{ color: textMuted }}>
              {lesson.durationMinutes} min
            </Text>
          </View>
        </View>
      </View>

      {/* Content: quiz or text */}
      {quizData ? (
        <QuizGame
          questions={quizData.questions}
          isDark={isDark}
          lessonTitle={lesson.title}
          gemsReward={gemsReward}
          onComplete={handleComplete}
        />
      ) : (
        <ReadingLesson
          content={lesson.content}
          isDark={isDark}
          gemsReward={gemsReward}
          isLast={isLast}
          completing={completing}
          onComplete={handleComplete}
        />
      )}
    </SafeAreaView>
  );
}
