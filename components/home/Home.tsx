import React from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRecentActivities } from '@/hooks/community/useRecentActivities';
import Header from '@/components/home/Header';
import UserProfileCard from '@/components/home/UserProfileCard';
import StatCard from '@/components/home/StatCard';
import CourseCard from '@/components/home/CourseCard';
import ActivitySection from '@/components/home/ActivitySection';
import ActivityItem from '@/components/home/ActivityItem';
import { useLearningModules } from '@/hooks/learning/useLearningModules';

export default function HomeScreen() {
    const { user: authUser } = useAuth();
    const { user, loading: loadingUser } = useCurrentUser(authUser?.id ?? null);  
    const { activities, loading: loadingActivities } = useRecentActivities(4);

    const { modules, loading: loadingModules } = useLearningModules();
    const nextModule = modules.find(m => !m.completed) ?? modules[0];
  
  const loading = loadingUser || loadingActivities;

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Header points={user.gems} />
        <UserProfileCard user={user} />
        <View className="flex-row px-3 mt-4">
          <StatCard label="Gemas" value={user.gems.toLocaleString()} />
          <StatCard label="Módulos" value={String(user.completedModules)} />
          <StatCard label="Ranking" value={user.ranking != null ? `#${user.ranking}` : '—'} />
        </View>
        <View className="mt-8">
          <View className="flex-row justify-between px-4 mb-3">
            <Text className="text-lg font-bold dark:text-white text-black">Continuar aprendiendo</Text>
            <Text className="text-gray-500 dark:text-white text-sm">Ver todo →</Text>
          </View>
          {nextModule && (
            <CourseCard
                title={nextModule.title}
                lesson={nextModule.description}
                progress={nextModule.progress}
            />
            )}
            {!nextModule && !loadingModules && (
            <View className="mx-4 p-5 rounded-2xl items-center gap-2" 
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Próximamente cursos disponibles
                </Text>
            </View>
            )}
        </View>
        <ActivitySection isEmpty={activities.length === 0}>
        {activities.map((item) => (
            <ActivityItem key={item.id} activity={item} />
        ))}
        </ActivitySection>
      </ScrollView>
    </SafeAreaView>
  );
}