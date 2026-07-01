import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Activity } from '@/types';
import { Trophy, TrendingUp, BookOpen, Flame } from 'lucide-react-native';

const ACTIVITY_CONFIG: Record<string, { icon: React.FC<any>; color: string }> = {
  milestone:        { icon: Trophy,     color: Colors.gold[400] },
  level_up:         { icon: TrendingUp, color: '#22C55E'        },
  module_completed: { icon: BookOpen,   color: '#60A5FA'        },
  streak:           { icon: Flame,      color: '#F97316'        },
};

const ACTIVITY_LABELS: Record<string, string> = {
  milestone:        'Logro desbloqueado',
  level_up:         'Subida de nivel',
  module_completed: 'Módulo completado',
  streak:           'Racha',
};

const ActivityItem = React.memo(function ActivityItem({ activity }: { activity: Activity }) {
  const { isDark } = useTheme();
  const cfg  = ACTIVITY_CONFIG[activity.type] ?? ACTIVITY_CONFIG.milestone;
  const Icon = cfg.icon;

  const timeAgo = React.useMemo(() => {
    const diff  = Date.now() - new Date(activity.timestamp).getTime();
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(hours / 24);
    if (days  > 0) return `hace ${days}d`;
    if (hours > 0) return `hace ${hours}h`;
    return 'ahora';
  }, [activity.timestamp]);

  // Dark surface
  const cardBg = isDark ? '#131F35' : Colors.light.card;

  return (
    <View
      className="flex-row items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${cfg.color}1A` }}
      >
        <Icon size={18} color={cfg.color} />
      </View>

      <View className="flex-1">
        <Text
          className="text-[13px] font-bold"
          style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
        >
          {ACTIVITY_LABELS[activity.type] ?? activity.type}
        </Text>
        <Text
          className="text-xs mt-0.5"
          style={{ color: isDark ? 'rgba(255,255,255,0.45)' : Colors.light.textSecond }}
          numberOfLines={1}
        >
          {activity.description}
        </Text>
      </View>

      <View className="items-end gap-1">
        {activity.gemsEarned > 0 && (
          <Text className="text-xs font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.gold }}>
            +{activity.gemsEarned}
          </Text>
        )}
        <Text className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : Colors.light.textMuted }}>
          {timeAgo}
        </Text>
      </View>
    </View>
  );
});

export default ActivityItem;
