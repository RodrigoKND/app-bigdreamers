import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Star, BookCheck, Flame } from 'lucide-react-native';
import { Activity } from '@/types';
import { Colors } from '@/constants/colors';
import Avatar from '@/components/shared/Avatar';
import GemBadge from '@/components/shared/GemBadge';

const ICONS = {
  level_up: <TrendingUp size={14} color={Colors.gold[500]} />,
  module_completed: <BookCheck size={14} color={Colors.blue.light} />,
  milestone: <Star size={14} color={Colors.success} />,
  streak: <Flame size={14} color={Colors.warning} />,
};

interface ActivityItemProps {
  activity: Activity;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace un momento';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <View style={styles.container}>
      <Avatar name={activity.memberName} size={36} />
      <View style={styles.content}>
        <Text style={styles.text} numberOfLines={2}>
          <Text style={styles.name}>{activity.memberName} </Text>
          <Text style={styles.desc}>{activity.description}</Text>
        </Text>
        <View style={styles.meta}>
          {ICONS[activity.type]}
          <Text style={styles.time}>{timeAgo(activity.timestamp)}</Text>
        </View>
      </View>
      <GemBadge count={activity.gemsEarned} size="sm" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  content: { flex: 1 },
  text: { marginBottom: 4 },
  name: { color: Colors.white, fontFamily: 'Inter-SemiBold', fontSize: 13 },
  desc: { color: Colors.text.secondary, fontFamily: 'Inter-Regular', fontSize: 13 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 11 },
});
