import React from 'react';
import { View, Text } from 'react-native';
import { CircleCheck as CheckCircle2, Circle, BookOpen, Users, Flame, TrendingUp } from 'lucide-react-native';
import { Milestone } from '@/types';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import GemBadge from '@/components/shared/GemBadge';

type MilestoneCategory = 'learning' | 'community' | 'streak' | 'level';

const CATEGORY_ICONS: Record<MilestoneCategory, React.ReactNode> = {
  learning: <BookOpen size={16} color={Colors.blue.light} />,
  community: <Users size={16} color={Colors.success} />,
  streak: <Flame size={16} color={Colors.warning} />,
  level: <TrendingUp size={16} color={Colors.gold[500]} />,
};

interface MilestoneCardProps {
  milestone: Milestone;
  className?: string;
}

export default function MilestoneCard({ milestone, className = '' }: MilestoneCardProps) {
  const { isDark } = useTheme();
  const { completed } = milestone;

  const containerStyle = completed
    ? { backgroundColor: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)' }
    : { backgroundColor: isDark ? Colors.blue.card : Colors.light.card, borderColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.border };

  return (
    <View 
      className={`flex-row items-start gap-3 p-[14px] rounded-[14px] border mb-2.5 ${className}`.trim()}
      style={containerStyle}
      accessible={true}
      accessibilityLabel={`Logro: ${milestone.title}. Estado: ${completed ? 'Completado' : 'Pendiente'}. Recompensa: ${milestone.gemsReward} gemas.`}
    >
      <View className="pt-[2px]">
        {completed ? (
          <CheckCircle2 size={22} color={Colors.success} />
        ) : (
          <Circle size={22} color={isDark ? Colors.text.muted : Colors.light.textMuted} />
        )}
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1.5">
          {CATEGORY_ICONS[milestone.category as MilestoneCategory] || <BookOpen size={16} color={isDark ? Colors.text.muted : Colors.light.textMuted} />}
          <Text 
            className="font-medium text-sm flex-1"
            style={{ color: completed ? (isDark ? '#FFFFFF' : Colors.light.textPrimary) : (isDark ? Colors.text.secondary : Colors.light.textSecond) }}
          >
            {milestone.title}
          </Text>
        </View>

        <Text 
          className="font-normal text-xs" 
          style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
          numberOfLines={2}
        >
          {milestone.description}
        </Text>

        {completed && milestone.completedAt && (
          <Text className="font-normal text-[11px] mt-0.5" style={{ color: isDark ? Colors.success : Colors.light.success }}>
            Completado el {new Date(milestone.completedAt).toLocaleDateString('es-ES')}
          </Text>
        )}
      </View>

      <GemBadge count={milestone.gemsReward} size="sm" />
    </View>
  );
}