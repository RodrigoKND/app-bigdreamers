import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2, Circle, BookOpen, Users, Flame, TrendingUp } from 'lucide-react-native';
import { Milestone } from '@/types';
import { Colors } from '@/constants/colors';
import GemBadge from '@/components/shared/GemBadge';

const CATEGORY_ICONS = {
  learning: <BookOpen size={16} color={Colors.blue.light} />,
  community: <Users size={16} color={Colors.success} />,
  streak: <Flame size={16} color={Colors.warning} />,
  level: <TrendingUp size={16} color={Colors.gold[500]} />,
};

interface MilestoneCardProps {
  milestone: Milestone;
}

export default function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { completed } = milestone;

  return (
    <View style={[styles.container, completed ? styles.completed : styles.pending]}>
      <View style={styles.iconBox}>
        {completed ? (
          <CheckCircle2 size={22} color={Colors.success} />
        ) : (
          <Circle size={22} color={Colors.text.muted} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {CATEGORY_ICONS[milestone.category]}
          <Text style={[styles.title, !completed && styles.titlePending]}>
            {milestone.title}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{milestone.description}</Text>
        {milestone.completedAt && (
          <Text style={styles.date}>
            Completado el {new Date(milestone.completedAt).toLocaleDateString('es-ES')}
          </Text>
        )}
      </View>
      <GemBadge count={milestone.gemsReward} size="sm" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  completed: {
    backgroundColor: 'rgba(34,197,94,0.06)',
    borderColor: 'rgba(34,197,94,0.2)',
  },
  pending: {
    backgroundColor: Colors.blue.card,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  iconBox: { paddingTop: 2 },
  content: { flex: 1, gap: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: Colors.white, fontFamily: 'Inter-SemiBold', fontSize: 14, flex: 1 },
  titlePending: { color: Colors.text.secondary },
  description: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 12 },
  date: { color: Colors.success, fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
});
