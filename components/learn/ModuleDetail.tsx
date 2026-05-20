import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLearningModuleById } from '@/hooks/learning/useLearningModuleById';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import ModuleDetailHeader from '@/components/learn/ModuleDetailHeader';
import ModuleProgressSection from '@/components/learn/ModuleProgressSection';
import ModuleLessonList from '@/components/learn/ModuleLessonList';

interface Props {
  moduleId: string;
}

export default function ModuleDetail({ moduleId }: Props) {
  const { module, loading, error } = useLearningModuleById(moduleId);
  const { isDark } = useTheme();
  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  if (loading) {
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

  const totalLessons = parseInt(module.duration, 10) || 5;
  const completedLessons = module.completed
    ? totalLessons
    : Math.floor((module.progress / 100) * totalLessons);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <View className="px-4 pt-4">
        <ButtonBackScreen redirectTo="/learn" />
      </View>

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
          progress={module.progress}
          isDark={isDark}
        />

        <ModuleLessonList
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          isDark={isDark}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
