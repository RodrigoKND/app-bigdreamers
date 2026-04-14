import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
}

interface ProfileStatCardProps {
  title: string;
  stats: StatItem[];
}

export default function ProfileStatCard({ title, stats }: ProfileStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.item}>
            <Text style={[styles.value, stat.accent ? { color: stat.accent } : {}]}>
              {stat.value}
            </Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.blue.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    color: Colors.text.secondary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  item: { minWidth: '40%', gap: 3 },
  value: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  label: {
    color: Colors.text.muted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});
