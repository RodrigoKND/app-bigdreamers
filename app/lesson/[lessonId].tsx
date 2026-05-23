import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { getSupabaseClient } from '@/services/supabase/supabase';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isDark } = useTheme();
  const [lesson, setLesson] = useState<{ title: string; content: string; durationMinutes: number } | null>(null);
  const [loading, setLoading] = useState(true);

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
          .select('id, title, content, duration_minutes')
          .eq('id', lessonId)
          .single();

        if (error) throw error;
        if (!cancelled && data) {
          setLesson({
            title: data.title,
            content: data.content ?? '',
            durationMinutes: data.duration_minutes,
          });
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
      </ScrollView>
    </SafeAreaView>
  );
}
