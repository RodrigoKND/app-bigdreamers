import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Star, BookCheck, Flame } from 'lucide-react-native';
import { Activity } from '@/types';
import { Colors } from '@/constants/colors';
import Avatar from '@/components/shared/Avatar';
import GemBadge from '@/components/shared/GemBadge';

type ActivityType = 'level_up' | 'module_completed' | 'milestone' | 'streak';

const ICONS: Record<ActivityType, React.ReactNode> = {
  level_up: <TrendingUp size={14} color={Colors.gold[500]} />,
  module_completed: <BookCheck size={14} color={Colors.blue.light} />,
  milestone: <Star size={14} color={Colors.success} />,
  streak: <Flame size={14} color={Colors.warning} />,
};

interface ActivityItemProps {
  activity: Activity;
  className?: string; // Permitimos inyectar clases desde la lista padre
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace un momento';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

export default function ActivityItem({ activity, className = '' }: ActivityItemProps) {
  // Lógica de seguridad
  const icon = ICONS[activity.type as ActivityType] || <Star size={14} color={Colors.text.muted} />;

  return (
    <View 
      className={`flex-row items-center gap-3 py-2.5 border-b border-white/5 ${className}`.trim()}
      
      // Accesibilidad
      accessible={true}
      accessibilityLabel={`${activity.memberName} ${activity.description}, ${timeAgo(activity.timestamp)}`}
    >
      <Avatar name={activity.memberName} size={36} />
      
      <View className="flex-1">
        {/* Textos anidados para flujo inline */}
        <Text className="mb-1" numberOfLines={2}>
          <Text className="text-white font-semibold text-[13px]">
            {activity.memberName}{' '}
          </Text>
          <Text className="text-text-secondary font-normal text-[13px]">
            {activity.description}
          </Text>
        </Text>
        
        <View className="flex-row items-center gap-1.5">
          {icon}
          <Text className="text-text-muted font-normal text-[11px]">
            {timeAgo(activity.timestamp)}
          </Text>
        </View>
      </View>
      
      <GemBadge count={activity.gemsEarned} size="sm" />
    </View>
  );
}