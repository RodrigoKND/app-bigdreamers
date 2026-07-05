import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  Easing, FadeInDown,
} from 'react-native-reanimated';
import {
  Lock,
  Play,
  Check,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Building2,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import LearnHeader from '@/components/learn/LearnHeader';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import { useUserModulesProgressDetailed } from '@/hooks/learning/useUserModulesProgressDetailed';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useAuth } from '@/contexts/AuthContext';


type ModuleStatus = 'completed' | 'active' | 'locked';
type Category = 'Finanzas' | 'Inversión' | 'Ahorro' | 'Empresa';

const CATEGORY_MAP: Record<Category, string> = {
  'Finanzas':  'finanzas',
  'Inversión': 'inversion',
  'Ahorro':    'ahorro',
  'Empresa':   'empresa',
};

const CATEGORIES: Category[] = ['Finanzas', 'Inversión', 'Ahorro', 'Empresa'];

function PulsingNode({ isActive, isCompleted, nodeSize, children }: { isActive: boolean; isCompleted: boolean; nodeSize: number; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, true,
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, true,
      );
    } else if (isCompleted) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, true,
      );
    }
  }, [isActive, isCompleted]);

  const nodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: -6, left: -6, right: -6, bottom: -6,
            borderRadius: (nodeSize + 12) / 2,
            backgroundColor: isActive ? Colors.gold[400] : Colors.success,
          },
          glowStyle,
        ]}
      />
      <Animated.View style={isActive ? nodeStyle : undefined}>
        {children}
      </Animated.View>
    </View>
  );
}

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 120).duration(500).springify().damping(18)}
    >
      {children}
    </Animated.View>
  );
}

function PulsingCtaButton({ children, style }: { children: React.ReactNode; style?: any }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[style, animStyle]}>
      {children}
    </Animated.View>
  );
}

export default function LearnScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>('Finanzas');
  const [refreshKey,     setRefreshKey]     = useState(0);
  const [refreshing,     setRefreshing]     = useState(false);

  const { modules, loading: modulesLoading, error: modulesError, refetch } = useLearningModules({
    category: CATEGORY_MAP[activeCategory],
  });

  const { progress, loading: progressLoading, refetch: refetchProgress } = useUserModulesProgressDetailed(user?.id ?? null);

  // Gemas desde la BD (fresco) igual que Home/Perfil, para que no quede desfasado
  // con el authUser (que solo se actualiza al login).
  const { user: dbUser, refetch: refetchUser } = useCurrentUser(user?.id ?? null);
  const gems = dbUser?.gems ?? user?.gems ?? 0;

  useFocusEffect(
    useCallback(() => {
      invalidateCachePattern(CacheKeys.learningModules);
      if (user?.id) {
        invalidateCachePattern(CacheKeys.userModulesProgressDetailed(user.id));
        invalidateCachePattern(CacheKeys.currentUser(user.id));
      }
      refetch();
      refetchProgress();
      refetchUser();
      setRefreshKey(k => k + 1);
    }, [user?.id])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      invalidateCachePattern(CacheKeys.learningModules);
      if (user?.id) {
        invalidateCachePattern(CacheKeys.userModulesProgressDetailed(user.id));
        invalidateCachePattern(CacheKeys.currentUser(user.id));
      }
      await Promise.all([refetch(), refetchProgress(), refetchUser()]);
      setRefreshKey(k => k + 1);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  const bg        = isDark ? Colors.blue.primary : Colors.light.bg;
  const textMuted = isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const loading = modulesLoading || progressLoading;

  const enrichedModules = useMemo(() => {
    const progressMap = new Map(progress.map((p) => [p.moduleId, p]));
    let foundActive = false;

    return modules.map((mod) => {
      const userProgress  = progressMap.get(mod.id);
      const totalLessons  = mod.totalLessons ?? 0;

      // `completed` ya considera si se agregaron lecciones nuevas tras completar:
      // en ese caso viene false y el módulo se reactiva en la lección faltante.
      if (userProgress?.completed) {
        return { ...mod, status: 'completed' as const, completedLessons: totalLessons, totalLessons };
      }

      if (!foundActive) {
        foundActive = true;
        const completedLessons = userProgress?.completedLessons ?? 0;
        return { ...mod, status: 'active' as const, completedLessons, totalLessons };
      }

      return { ...mod, status: 'locked' as const, completedLessons: 0, totalLessons };
    });
  }, [modules, progress, refreshKey]);

  const activeModule = enrichedModules.find((m) => m.status === 'active');

  const handleModulePress = (moduleId: string, status: ModuleStatus) => {
    if (status === 'locked' || status === 'completed') return;
    router.push(`/module/${moduleId}` as any);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <View className="flex-1">
        <LearnHeader gems={gems} />

        {/* Category tabs */}
        <View className="h-11 mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
            style={{ flex: 1 }}
          >
            {CATEGORIES.map((label) => {
              const active = activeCategory === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setActiveCategory(label)}
                  accessible
                  accessibilityLabel={`Categoría ${label}`}
                  className="active:opacity-70 rounded-xl px-4 py-2"
                  style={{
                    backgroundColor: active
                      ? isDark ? Colors.gold[400] : Colors.light.accent
                      : isDark ? Colors.navy[700] : Colors.light.surface,
                  }}
                >
                  <Text
                    className="text-[13px] font-semibold"
                    style={{ color: active ? (isDark ? '#000' : '#fff') : textMuted }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Route label */}
        <Text
          className="text-[10px] font-bold text-center mb-2 tracking-[0.2rem]"
          style={{ color: textMuted }}
        >
          RUTA · {activeCategory.toUpperCase()}
        </Text>

        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={accentColor} />
          </View>
        )}

        {!loading && modulesError && (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-sm text-center" style={{ color: textMuted }}>
              No se pudieron cargar los módulos.
            </Text>
          </View>
        )}

        {!loading && !modulesError && modules.length === 0 && (
          <View className="flex-1 items-center justify-center px-8 gap-3">
            <Text className="text-[15px] font-bold text-center" style={{ color: textMuted }}>
              No hay módulos en esta categoría aún
            </Text>
          </View>
        )}

        {!loading && !modulesError && modules.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 140,
              paddingHorizontal: 16,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} colors={[accentColor]} />
            }
          >
            {/* ── Zigzag Path ── */}
            <View style={{ paddingVertical: 16 }}>
              {enrichedModules.map((module, index) => {
                const isCompleted = module.status === 'completed';
                const isActive    = module.status === 'active';
                const isLocked    = module.status === 'locked';
                const isRight     = index % 2 === 0;
                const isLast      = index === enrichedModules.length - 1;

                const nodeSize = isActive ? 72 : 60;
                const nodeBg = isLocked
                  ? (isDark ? Colors.navy[700] : '#CBD5E1')
                  : isCompleted
                  ? Colors.gold[500]
                  : Colors.gold[400];

                const pathColor = isLocked
                  ? (isDark ? 'rgba(255,255,255,0.08)' : '#CBD5E1')
                  : isCompleted
                  ? Colors.success
                  : (isDark ? Colors.gold[400] : Colors.light.accent);

                const cardBg    = isDark ? 'rgba(255,255,255,0.06)' : Colors.light.card;
                const cardBd    = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;
                const textPri   = isDark ? '#FFFFFF' : Colors.light.textPrimary;
                const textMtd   = isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted;

                const statusLabel = isCompleted ? 'Completado'
                  : isActive ? `Lección ${module.completedLessons + 1}/${module.totalLessons}`
                  : `${module.totalLessons} lecciones`;

                const displayStatus = isCompleted ? 'COMPLETADO'
                  : isActive ? 'EN CURSO'
                  : 'BLOQUEADO';

                const statusBg = isCompleted
                  ? (isDark ? 'rgba(22,163,74,0.16)' : '#DCFCE7')
                  : isActive
                  ? (isDark ? 'rgba(59,130,246,0.16)' : '#DBEAFE')
                  : (isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9');

                const statusColor = isCompleted
                  ? (isDark ? '#4ADE80' : '#16A34A')
                  : isActive
                  ? (isDark ? '#60A5FA' : Colors.light.accent)
                  : textMtd;

                const MODULE_ICONS: Record<number, React.FC<{ size: number; color: string }>> = {
                  0: DollarSign, 1: PiggyBank, 2: TrendingUp, 3: TrendingUp, 4: Building2,
                };
                const IconComponent = MODULE_ICONS[index % 5] ?? DollarSign;

                const nodeContent = (
                  <View
                    style={{
                      width: nodeSize,
                      height: nodeSize,
                      borderRadius: nodeSize / 2,
                      backgroundColor: nodeBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: isActive ? 3 : 0,
                      borderColor: isDark ? '#1E3A5F' : '#BFDBFE',
                      zIndex: 2,
                    }}
                  >
                    {isLocked ? (
                      <Lock size={20} color={isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8'} />
                    ) : (
                      <IconComponent size={isActive ? 28 : 24} color={isDark ? '#000' : '#1e3a5f'} />
                    )}
                    {isCompleted && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: '#16A34A',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={10} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                );

                const cardContent = (
                  <View
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBd,
                      borderRadius: 20,
                      padding: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: textPri,
                        marginBottom: 4,
                      }}
                      numberOfLines={2}
                    >
                      {module.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: textMtd, marginBottom: 8 }}>
                      {statusLabel}
                    </Text>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        backgroundColor: statusBg,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: '800',
                          letterSpacing: 0.5,
                          color: statusColor,
                        }}
                      >
                        {displayStatus}
                      </Text>
                    </View>
                  </View>
                );

                const branchLine = (
                  <View
                    style={{
                      width: 16,
                      height: 2.5,
                      borderRadius: 1.25,
                      backgroundColor: pathColor,
                    }}
                  />
                );

                return (
                  <AnimatedCard key={module.id} index={index}>
                    <View style={{ marginBottom: isLast ? 0 : 0 }}>
                      <TouchableOpacity
                        onPress={isLocked || isCompleted ? undefined : () => handleModulePress(module.id, module.status)}
                        activeOpacity={isLocked || isCompleted ? 1 : 0.7}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          opacity: isLocked ? 0.4 : 1,
                        }}
                      >
                        {isRight ? (
                          <>
                            <View style={{ flex: 1, paddingRight: 20 }}>
                              {cardContent}
                            </View>
                            {branchLine}
                            <PulsingNode isActive={isActive} isCompleted={isCompleted} nodeSize={nodeSize}>
                              {nodeContent}
                            </PulsingNode>
                          </>
                        ) : (
                          <>
                            <PulsingNode isActive={isActive} isCompleted={isCompleted} nodeSize={nodeSize}>
                              {nodeContent}
                            </PulsingNode>
                            {branchLine}
                            <View style={{ flex: 1, paddingLeft: 20 }}>
                              {cardContent}
                            </View>
                          </>
                        )}
                      </TouchableOpacity>
                      {!isLast && <View style={{ height: 36 }} />}
                    </View>
                  </AnimatedCard>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* CTA bottom */}
        {!loading && activeModule && (
          <View
            className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3"
            style={{ backgroundColor: bg }}
          >
            <PulsingCtaButton>
              <Pressable
                accessible
                accessibilityLabel={`Continuar lección ${activeModule.completedLessons + 1}`}
                onPress={() => router.push(`/module/${activeModule.id}` as any)}
                className="active:opacity-80 flex-row items-center justify-center rounded-2xl py-4 gap-2.5"
                style={{ backgroundColor: accentColor }}
              >
                <Play size={16} color={isDark ? '#000' : '#fff'} fill={isDark ? '#000' : '#fff'} />
                <Text className="text-[15px] font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
                  Continuar lección {activeModule.completedLessons + 1}
                </Text>
              </Pressable>
            </PulsingCtaButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
