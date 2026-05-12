import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Gem, BookOpen, Flame, Trophy, Lightbulb,
  Star, Lock, Medal, Award,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { JourneyCard } from '@/components/progress/JourneyCard';
import ProgressHeader from '@/components/progress/ProgressHeader';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useUserCompletedModules } from '@/hooks/learning/useUserCompletedModules';
import { useUserMilestones } from '@/hooks/progress/useUserMilestones';
import { useUserGemHistory } from '@/hooks/gem/useUserGemHistory';
import { useAuth } from '@/contexts/AuthContext';
import GemHistoryCard from '@/components/progress/GemHistoryCard';

// Mapa de categoría → ícono y color para las insignias
const MILESTONE_STYLE: Record<string, { color: string; bg: string; Icon: React.FC<{ size: number; color: string }> }> = {
  learning:  { color: '#FFD740', bg: 'rgba(255,215,64,0.15)',  Icon: Trophy    },
  streak:    { color: '#FF6B35', bg: 'rgba(255,107,53,0.15)',  Icon: Flame     },
  community: { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  Icon: Lightbulb },
  level:     { color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', Icon: Star      },
  default:   { color: '#94A3B8', bg: 'rgba(148,163,184,0.06)', Icon: Award     },
};

export default function ProgressScreen() {
  const { isDark } = useTheme();

const { user: authUser } = useAuth();
const { user, loading: loadingUser }                   = useCurrentUser(authUser?.id ?? null);
const { completedModuleIds, loading: loadingModules }  = useUserCompletedModules(user?.id ?? null);
const { milestones, loading: loadingMilestones }       = useUserMilestones(user?.id ?? null);
const { history, loading: loadingHistory }             = useUserGemHistory(user?.id ?? null);

  const isLoading = loadingUser || loadingModules || loadingMilestones || loadingHistory;

  const totalEarned = useMemo(
    () => history.filter((r) => r.status === 'approved').reduce((sum, r) => sum + r.gems, 0),
    [history]
  );

  const weeklyGrowth = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return history
      .filter((r) => r.status === 'approved' && new Date(r.date) >= cutoff)
      .reduce((sum, r) => sum + r.gems, 0);
  }, [history]);

  // Cuántas insignias están completadas
  const earnedCount = useMemo(
    () => milestones.filter((m) => m.completed).length,
    [milestones]
  );

  const bg         = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const cardBg      = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder  = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;

  const stats = [
    {
      value: user?.gems?.toLocaleString() ?? '—',
      label: 'GEMAS',
      color: isDark ? Colors.gold[400] : Colors.light.accent,
      Icon: Gem,
    },
    {
      value: String(completedModuleIds.length),
      label: 'MÓDULOS',
      color: isDark ? '#4ADE80' : '#16A34A',
      Icon: BookOpen,
    },
    {
      value: String(user?.streak ?? 0),
      label: 'RACHA',
      color: '#FF6B35',
      Icon: Flame,
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <ProgressHeader streakDays={0} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['bottom']}>
      <ProgressHeader streakDays={user?.streak ?? 0} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Journey card con nivel y gemas reales */}
        <JourneyCard
          isDark={isDark}
          level={user?.level ?? 'bronze'}
          gems={user?.gems ?? 0}
        />

        {/* Historial de gemas */}
        <GemHistoryCard
          currentGems={user?.gems ?? 0}
          totalEarned={totalEarned}
          weeklyGrowth={weeklyGrowth}
        />

        {/* Stats row */}
        <View className="flex-row px-5 gap-3 mb-5">
          {stats.map((stat) => (
            <View
              key={stat.label}
              accessible
              accessibilityLabel={`${stat.value} ${stat.label}`}
              className="flex-1 rounded-2xl items-center justify-center py-5 gap-1"
              style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
            >
              <stat.Icon size={22} color={stat.color} />
              <Text className="text-xl font-bold mt-1" style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text className="text-xs font-semibold tracking-wider" style={{ color: textMuted }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Insignias */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold" style={{ color: textPrimary }}>
              Insignias
            </Text>
            <Text className="text-sm font-semibold" style={{ color: textMuted }}>
              {earnedCount} / {milestones.length}
            </Text>
          </View>

          {milestones.length === 0 ? (
            <View
              className="rounded-2xl items-center py-10"
              style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
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
                return (
                  <View
                    key={milestone.id}
                    accessible
                    accessibilityLabel={`Insignia ${milestone.title}${milestone.completed ? ', obtenida' : ', bloqueada'}`}
                    style={{
                      width: '47%',
                      backgroundColor: milestone.completed
                        ? style.bg
                        : isDark ? 'rgba(255,255,255,0.04)' : Colors.light.card,
                      borderWidth: 1,
                      borderColor: milestone.completed ? `${style.color}30` : cardBorder,
                      opacity: milestone.completed ? 1 : 0.5,
                      borderRadius: 16,
                      alignItems: 'center',
                      paddingVertical: 20,
                      paddingHorizontal: 12,
                      gap: 8,
                    }}
                  >
                    {milestone.completed
                      ? <Icon size={28} color={style.color} />
                      : <Lock size={24} color={textMuted} />
                    }
                    <Text
                      className="text-xs font-bold text-center"
                      style={{ color: milestone.completed ? style.color : textMuted }}
                      numberOfLines={2}
                    >
                      {milestone.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}