import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gem, BookOpen, Trophy } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}

function StatItem({ icon, value, label, accent }: StatItemProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
      {icon}
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface StatsRowProps {
  user: User;
}

export default function StatsRow({ user }: StatsRowProps) {
  return (
    <View style={styles.row}>
      <StatItem
        icon={<Gem size={20} color={Colors.gold[500]} />}
        value={user.gems.toLocaleString()}
        label="Gemas"
        accent={Colors.gold[500]}
      />
      <StatItem
        icon={<BookOpen size={20} color={Colors.blue.light} />}
        value={user.completedModules.toString()}
        label="Módulos"
        accent={Colors.blue.light}
      />
      <StatItem
        icon={<Trophy size={20} color={Colors.success} />}
        value={`#${user.communityRank}`}
        label="Ranking"
        accent={Colors.success}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.blue.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  statLabel: {
    color: Colors.text.muted,
    fontFamily: 'Inter-Regular',
    fontSize: 11,
  },
});
