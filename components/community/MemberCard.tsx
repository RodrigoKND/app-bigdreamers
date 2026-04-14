import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { CommunityMember } from '@/types';
import { Colors } from '@/constants/colors';
import Avatar from '@/components/shared/Avatar';
import LevelBadge from '@/components/shared/LevelBadge';
import GemBadge from '@/components/shared/GemBadge';

interface MemberCardProps {
  member: CommunityMember;
  isCurrentUser?: boolean;
}

const RANK_COLORS: Record<number, string> = {
  1: Colors.gold[500],
  2: Colors.levels.silver,
  3: Colors.levels.bronze,
};

export default function MemberCard({ member, isCurrentUser = false }: MemberCardProps) {
  const rankColor = RANK_COLORS[member.rank] ?? Colors.text.muted;

  return (
    <View style={[styles.container, isCurrentUser && styles.highlighted]}>
      <Text style={[styles.rank, { color: rankColor }]}>#{member.rank}</Text>
      <Avatar uri={member.avatar} name={member.name} size={44} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{member.name}</Text>
          {isCurrentUser && <Text style={styles.youBadge}>Tú</Text>}
        </View>
        <LevelBadge level={member.level} size="sm" />
      </View>
      <View style={styles.right}>
        <GemBadge count={member.gems} size="sm" />
        <View style={styles.streak}>
          <Flame size={12} color={Colors.warning} />
          <Text style={styles.streakText}>{member.streak}d</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.blue.card,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  highlighted: {
    borderColor: `${Colors.gold[500]}40`,
    backgroundColor: 'rgba(245,194,0,0.06)',
  },
  rank: { fontFamily: 'Inter-Bold', fontSize: 16, width: 28 },
  info: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: Colors.white, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  youBadge: {
    backgroundColor: Colors.blue.primary,
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  right: { alignItems: 'flex-end', gap: 6 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  streakText: { color: Colors.warning, fontFamily: 'Inter-Regular', fontSize: 11 },
});
