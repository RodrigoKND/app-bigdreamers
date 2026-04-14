import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface GemBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZES = {
  sm: { icon: 12, font: 12 },
  md: { icon: 16, font: 14 },
  lg: { icon: 20, font: 18 },
};

export default function GemBadge({ count, size = 'md', showLabel = false }: GemBadgeProps) {
  const s = SIZES[size];
  const formatted = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();

  return (
    <View style={styles.container}>
      <Gem size={s.icon} color={Colors.gold[500]} strokeWidth={2} />
      <Text style={[styles.text, { fontSize: s.font }]}>{formatted}</Text>
      {showLabel && <Text style={[styles.label, { fontSize: s.font - 2 }]}>gemas</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    color: Colors.gold[500],
    fontFamily: 'Inter-Bold',
  },
  label: {
    color: Colors.text.secondary,
    fontFamily: 'Inter-Regular',
  },
});
