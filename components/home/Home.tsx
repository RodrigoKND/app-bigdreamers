import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRecentActivities } from '@/hooks/community/useRecentActivities';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import Header from '@/components/home/Header';
import UserProfileCard from '@/components/home/UserProfileCard';
import StatCard from '@/components/home/StatCard';
import CourseCard from '@/components/home/CourseCard';
import ActivitySection from '@/components/home/ActivitySection';
import ActivityItem from '@/components/home/ActivityItem';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import AppTutorial from '@/components/shared/AppTutorial';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();

  const { user: dbUser, loading: loadingUser, refetch: refetchUser       } = useCurrentUser(authUser?.id ?? null);
  const { activities, loading: loadingActivities, refetch: refetchActivities } = useRecentActivities(4);
  const { modules,    loading: loadingModules,    refetch: refetchModules    } = useLearningModules();

  const user = dbUser ?? authUser ?? null;
  const [refreshing, setRefreshing] = useState(false);

  const nextModule = modules.find(m => !m.completed) ?? modules[0];
  const loading    = loadingUser || loadingActivities;

  const bg          = isDark ? Colors.blue.primary        : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary        : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.55)'   : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400]           : Colors.light.accent;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (authUser?.id) {
        await invalidateCachePattern(CacheKeys.currentUser(authUser.id));
      }
      await Promise.all([refetchUser(), refetchActivities(), refetchModules()]);
    } finally {
      setRefreshing(false);
    }
  }, [authUser?.id, refetchUser, refetchActivities, refetchModules]);

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bg }}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>
      <AppTutorial />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={accentColor}
            colors={[accentColor]}
          />
        }
      >
        <Header points={user.gems} />

        {/* Profile hero */}
        <UserProfileCard user={user} />

        {/* Stats */}
        <View className="flex-row px-4 mt-4">
          <StatCard label="Gemas"    value={user.gems.toLocaleString()} />
          <StatCard label="Módulos"  value={String(user.completedModules)} />
          <StatCard label="Ranking"  value={user.ranking != null ? `#${user.ranking}` : '—'} />
        </View>

        {/* Continuar aprendiendo */}
        <View className="mt-7">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>
              Continuar aprendiendo
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/learn')} activeOpacity={0.7}>
              <Text className="text-sm font-semibold" style={{ color: accentColor }}>
                Ver todo →
              </Text>
            </TouchableOpacity>
          </View>

          {nextModule ? (
            <CourseCard
              title={nextModule.title}
              lesson={nextModule.description}
              progress={nextModule.progress}
            />
          ) : !loadingModules ? (
            <View
              className="mx-4 p-5 rounded-2xl items-center"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : Colors.light.surface,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <Text className="text-sm text-center" style={{ color: textMuted }}>
                Próximamente cursos disponibles
              </Text>
            </View>
          ) : null}
        </View>

        {/* Actividad */}
        <ActivitySection isEmpty={activities.length === 0}>
          {activities.map(item => (
            <ActivityItem key={item.id} activity={item} />
          ))}
        </ActivitySection>
      </ScrollView>
    </SafeAreaView>
  );
}
