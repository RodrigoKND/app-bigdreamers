import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Level } from '@/types';
import { getLevelConfig } from '@/constants/levels';

interface LevelBadgeProps {
  level: Level;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { fontSize: 10, paddingH: 8, paddingV: 3, borderRadius: 8 },
  md: { fontSize: 12, paddingH: 12, paddingV: 5, borderRadius: 10 },
  lg: { fontSize: 14, paddingH: 14, paddingV: 6, borderRadius: 12 },
};

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const config = getLevelConfig(level);
  const s = SIZES[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderRadius: s.borderRadius,
          borderColor: config.color,
        },
      ]}
    >
      <Text style={[styles.text, { color: config.color, fontSize: s.fontSize }]}>
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.8,
  },
});
