import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { useLearningModuleById } from '@/hooks/learning/useLearningModuleById';
import { useLessonsByModuleId } from '@/hooks/learning/useLessonsByModuleId';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserModuleProgress } from '@/hooks/learning/useUserModuleProgress';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import ModuleDetailHeader from '@/components/learn/ModuleDetailHeader';
import ModuleProgressSection from '@/components/learn/ModuleProgressSection';
import ModuleLessonList from '@/components/learn/ModuleLessonList';

interface Props {
  moduleId: string;
}

export default function ModuleDetail({ moduleId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { module, loading, error } = useLearningModuleById(moduleId);
  const { lessons, loading: loadingLessons } = useLessonsByModuleId(moduleId);
  const { user } = useAuth();
  const { progress: userProgress, loading: progressLoading, refetch: refetchProgress } = useUserModuleProgress(user?.id ?? null, moduleId);
  const { isDark } = useTheme();

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (userProgress !== undefined && initialLoad) setInitialLoad(false);
  }, [userProgress]);

  useFocusEffect(
    useCallback(() => {
      refetchProgress();
    }, [moduleId])
  );
  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  if (loading || loadingLessons || initialLoad)  {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={Colors.gold[400]} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold text-center" style={{ color: textMuted }}>
            Ocurrió un error al cargar el módulo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!module) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold text-center" style={{ color: textMuted }}>
            Módulo no encontrado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompletelyCompleted = module.completed || userProgress?.completed;
  const totalLessons = lessons.length;
  const progress = userProgress?.progress ?? 0;
  const completedLessons = isCompletelyCompleted
    ? totalLessons
    : Math.floor((progress / 100) * totalLessons);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>
      <View style={{ paddingTop: Math.max(8, insets.top > 0 ? 0 : 12), paddingHorizontal: 16, paddingBottom: 4 }}>
        <ButtonBackScreen redirectTo="/learn" />
      </View>

      {isCompletelyCompleted ? (
        <ScrollView
          className="px-4"
          contentContainerStyle={{ paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center py-16 px-6">
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: isDark ? 'rgba(22,163,74,0.15)' : '#DCFCE7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <CheckCircle size={52} color={isDark ? '#4ADE80' : '#16A34A'} />
            </View>
            <Text
              className="text-2xl font-black text-center"
              style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
            >
              ¡Módulo completado!
            </Text>
            <Text
              className="text-base text-center mt-3 leading-6"
              style={{ color: textMuted }}
            >
              Ya completaste todas las lecciones de este módulo. Sigue avanzando con los siguientes módulos.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="px-4"
          contentContainerStyle={{ paddingBottom: 36, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <ModuleDetailHeader
            title={module.title}
            description={module.description}
            category={module.category}
            difficulty={module.difficulty}
            gemsReward={module.gemsReward}
            isDark={isDark}
          />

          <ModuleProgressSection
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            progress={progress}
            isDark={isDark}
          />

          <ModuleLessonList
            lessons={lessons}
            completedLessons={completedLessons}
            isDark={isDark}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
