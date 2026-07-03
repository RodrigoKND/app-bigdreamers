import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import { useUserCompletedModules } from '@/hooks/learning/useUserCompletedModules';
import Header from '@/components/home/Header';
import UserProfileCard from '@/components/home/UserProfileCard';
import StatCard from '@/components/home/StatCard';
import CourseCard from '@/components/home/CourseCard';
import CasinoCompanyCarousel from '@/components/home/CasinoCompanyCarousel';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import AppTutorial from '@/components/shared/AppTutorial';

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 100 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

function AnimatedCount({ value, textPrimary }: { value: number; textPrimary: string }) {
  const [text, setText] = useState('0');

  useEffect(() => {
    const duration = 700;
    const steps = 20;
    const stepMs = duration / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * value);
      setText(current.toLocaleString());
      if (step >= steps) {
        clearInterval(id);
        setText(value.toLocaleString());
      }
    }, stepMs);
    return () => clearInterval(id);
  }, [value]);

  return <Text className="text-lg font-bold" style={{ color: textPrimary }}>{text}</Text>;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();

  const { user: dbUser, loading: loadingUser, refetch: refetchUser } = useCurrentUser(authUser?.id ?? null);
  const { modules, loading: loadingModules, refetch: refetchModules } = useLearningModules();
  const { completedModuleIds } = useUserCompletedModules(authUser?.id ?? null);

  const user = dbUser ?? authUser ?? null;
  const [refreshing, setRefreshing] = useState(false);

  const modulesWithProgress = useMemo(() => modules.map(m => ({
    ...m,
    completed: completedModuleIds.includes(m.id) || m.completed,
    progress: completedModuleIds.includes(m.id) ? 100 : m.progress,
  })), [modules, completedModuleIds]);

  const nextModule = modulesWithProgress.find(m => !m.completed) ?? modulesWithProgress[0];

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;
  const divider = isDark ? 'rgba(255,255,255,0.06)' : Colors.light.border;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (authUser?.id) {
        await invalidateCachePattern(CacheKeys.currentUser(authUser.id));
        await invalidateCachePattern(CacheKeys.userCompletedModules(authUser.id));
      }
      await Promise.all([refetchUser(), refetchModules()]);
    } finally {
      setRefreshing(false);
    }
  }, [authUser?.id, refetchUser, refetchModules]);

  if (!user) {
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

        <AnimatedSection delay={100}>
          <UserProfileCard user={user} />
        </AnimatedSection>

        <AnimatedSection delay={250}>
          <View className="mx-4 mt-4 rounded-2xl" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
            <View className="flex-row">
              <StatCard
                label="Gemas"
                valueComponent={<AnimatedCount value={user.gems} textPrimary={textPrimary} accentColor={accentColor} />}
              />
              <View className="w-px self-stretch my-2" style={{ backgroundColor: divider }} />
              <StatCard
                label="Módulos"
                valueComponent={<AnimatedCount value={user.completedModules} textPrimary={textPrimary} accentColor={accentColor} />}
              />
              <View className="w-px self-stretch my-2" style={{ backgroundColor: divider }} />
              <StatCard
                label="Ranking"
                value={user.ranking != null ? `#${user.ranking}` : '—'}
              />
            </View>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <View className="mt-6">
            <View className="flex-row justify-between items-center px-5 mb-3">
              <Text className="text-[15px] font-bold" style={{ color: textPrimary }}>
                Continuar aprendiendo
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/learn')} activeOpacity={0.7}>
                <Text className="text-xs font-semibold" style={{ color: accentColor }}>
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
        </AnimatedSection>

        <AnimatedSection delay={550}>
          <CasinoCompanyCarousel />
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
}
