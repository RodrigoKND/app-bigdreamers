import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withRepeat, withSequence,
  Easing, FadeInDown,
} from 'react-native-reanimated';
import {
  Gem, BookOpen, Flame, Trophy, Lightbulb,
  Star, Lock, Medal, Award, Sparkles, Zap,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useUserCompletedModules } from '@/hooks/learning/useUserCompletedModules';
import { useUserMilestones } from '@/hooks/progress/useUserMilestones';
import { useUserGemHistory } from '@/hooks/gem/useUserGemHistory';
import { useAuth } from '@/contexts/AuthContext';
import type { Level } from '@/types';

const MILESTONE_STYLE: Record<string, { color: string; bg: string; Icon: React.FC<{ size: number; color: string }> }> = {
  learning:  { color: '#FFD740', bg: 'rgba(255,215,64,0.15)',  Icon: Trophy    },
  streak:    { color: '#FF6B35', bg: 'rgba(255,107,53,0.15)',  Icon: Flame     },
  community: { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  Icon: Lightbulb },
  level:     { color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', Icon: Star      },
  default:   { color: '#94A3B8', bg: 'rgba(148,163,184,0.06)', Icon: Award     },
};

const LEVEL_LABELS: Record<Level, string> = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  diamond: 'Diamante',
};

const LEVEL_COLORS: Record<Level, string> = {
  bronze: '#CD7F32',
  silver: '#B0C4DE',
  gold: '#FFD740',
  diamond: '#B9F2FF',
};

function PulsingStat({ value, label, color, icon: Icon, delay }: { value: string; label: string; color: string; icon: React.FC<{ size: number; color: string }>; delay: number }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify().damping(18)}
      className="flex-1 rounded-2xl items-center justify-center py-5 gap-1.5 border"
      style={{ backgroundColor: `${color}12`, borderColor: `${color}30` }}
    >
      <Icon size={22} color={color} />
      <Animated.View style={style}>
        <Text className="text-xl font-black mt-0.5" style={{ color }}>{value}</Text>
      </Animated.View>
      <Text className="text-[10px] font-bold tracking-widest" style={{ color: `${color}CC` }}>{label}</Text>
    </Animated.View>
  );
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify().damping(20)}
    >
      {children}
    </Animated.View>
  );
}

export default function ProgressScreen() {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();
  const { user, loading: loadingUser } = useCurrentUser(authUser?.id ?? null);
  const { completedModuleIds, loading: loadingModules } = useUserCompletedModules(user?.id ?? null);
  const { milestones, loading: loadingMilestones } = useUserMilestones(user?.id ?? null);
  const { history, loading: loadingHistory } = useUserGemHistory(user?.id ?? null);

  const isLoading = loadingUser || loadingModules || loadingMilestones || loadingHistory;

  const totalEarned = useMemo(
    () => history.filter((r) => r.status === 'approved').reduce((sum, r) => sum + r.gems, 0),
    [history],
  );

  const weeklyGrowth = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return history
      .filter((r) => r.status === 'approved' && new Date(r.date) >= cutoff)
      .reduce((sum, r) => sum + r.gems, 0);
  }, [history]);

  const earnedCount = useMemo(() => milestones.filter((m) => m.completed).length, [milestones]);

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const levelColor = LEVEL_COLORS[user?.level ?? 'bronze'];

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <AnimatedSection delay={50}>
          <View className="px-5 pt-2 pb-4">
            <Text className="text-[26px] font-black tracking-tight" style={{ color: textPrimary }}>
              Mi Progreso
            </Text>
            <Text className="text-xs mt-1" style={{ color: textMuted }}>
              Estadísticas de tu viaje financiero
            </Text>
          </View>
        </AnimatedSection>

        {/* Level banner */}
        <AnimatedSection delay={150}>
          <View
            className="mx-5 mb-5 rounded-2xl p-5 border overflow-hidden"
            style={{
              backgroundColor: `${levelColor}10`,
              borderColor: `${levelColor}30`,
            }}
          >
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: `${levelColor}20` }}>
                <Medal size={28} color={levelColor} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-bold tracking-widest" style={{ color: `${levelColor}BB` }}>
                  NIVEL
                </Text>
                <Text className="text-[22px] font-black" style={{ color: levelColor }}>
                  {LEVEL_LABELS[user?.level ?? 'bronze']}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[11px] font-semibold" style={{ color: textMuted }}>Gemas</Text>
                <Text className="text-xl font-black" style={{ color: levelColor }}>{user?.gems?.toLocaleString() ?? '—'}</Text>
              </View>
            </View>
            {/* Streak inline */}
            <View className="flex-row items-center gap-2">
              <Flame size={16} color="#FF6B35" fill="#FF6B35" />
              <Text className="text-sm font-bold" style={{ color: '#FF6B35' }}>
                Rachas: {user?.streak ?? 0} días consecutivos
              </Text>
            </View>
          </View>
        </AnimatedSection>

        {/* Stats row */}
        <AnimatedSection delay={250}>
          <View className="flex-row px-5 gap-3 mb-5">
            <PulsingStat
              value={user?.gems?.toLocaleString() ?? '—'}
              label="GEMAS"
              color={Colors.gold[400]}
              icon={Gem}
              delay={0}
            />
            <PulsingStat
              value={String(completedModuleIds.length)}
              label="MÓDULOS"
              color="#4ADE80"
              icon={BookOpen}
              delay={100}
            />
            <PulsingStat
              value={String(user?.streak ?? 0)}
              label="RACHA"
              color="#FF6B35"
              icon={Flame}
              delay={200}
            />
          </View>
        </AnimatedSection>

        {/* Gem history summary */}
        <AnimatedSection delay={350}>
          <View
            className="mx-5 mb-6 flex-row rounded-2xl p-4 border"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border,
            }}
          >
            <View className="flex-1 items-center gap-1">
              <Gem size={16} color={Colors.gold[500]} />
              <Text className="text-base font-black" style={{ color: Colors.gold[500] }}>{totalEarned.toLocaleString()}</Text>
              <Text className="text-[10px] font-semibold" style={{ color: textMuted }}>Ganadas</Text>
            </View>
            <View className="w-px self-stretch mx-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border }} />
            <View className="flex-1 items-center gap-1">
              <Zap size={16} color={Colors.success} />
              <Text className="text-base font-black" style={{ color: Colors.success }}>+{weeklyGrowth}</Text>
              <Text className="text-[10px] font-semibold" style={{ color: textMuted }}>Semana</Text>
            </View>
          </View>
        </AnimatedSection>

        {/* Milestones */}
        <AnimatedSection delay={450}>
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold" style={{ color: textPrimary }}>
                Insignias
              </Text>
              <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${Colors.gold[400]}20` }}>
                <Text className="text-xs font-black" style={{ color: Colors.gold[400] }}>
                  {earnedCount} / {milestones.length}
                </Text>
              </View>
            </View>

            {milestones.length === 0 ? (
              <View
                className="rounded-2xl items-center py-10 border"
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card,
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border,
                }}
              >
                <Medal size={32} color={textMuted} />
                <Text className="text-sm mt-3 text-center" style={{ color: textMuted }}>
                  Aún no tienes insignias.{'\n'}¡Completa módulos para ganar la primera!
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {milestones.map((milestone) => {
                  const style = MILESTONE_STYLE[milestone.category] ?? MILESTONE_STYLE.default;
                  const { Icon } = style;
                  const completed = milestone.completed;

                  return (
                    <Animated.View
                      key={milestone.id}
                      entering={FadeInDown.delay(500 + milestones.indexOf(milestone) * 80).duration(400).springify().damping(20)}
                      style={{ width: '47%' }}
                    >
                      <View
                        className="rounded-2xl items-center py-5 px-3 gap-2 border"
                        style={{
                          backgroundColor: completed ? style.bg : (isDark ? 'rgba(255,255,255,0.04)' : Colors.light.card),
                          borderColor: completed ? `${style.color}40` : (isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border),
                          opacity: completed ? 1 : 0.5,
                        }}
                      >
                        {completed ? <Icon size={28} color={style.color} /> : <Lock size={22} color={textMuted} />}
                        <Text
                          className="text-xs font-bold text-center"
                          style={{ color: completed ? style.color : textMuted }}
                          numberOfLines={2}
                        >
                          {milestone.title}
                        </Text>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </View>
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
}
