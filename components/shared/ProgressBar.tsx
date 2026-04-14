import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  bgColor?: string;
  height?: number;
  borderRadius?: number;
}

export default function ProgressBar({
  progress,
  color = Colors.gold[500],
  bgColor = 'rgba(255,255,255,0.1)',
  height = 8,
  borderRadius = 4,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.track, { backgroundColor: bgColor, height, borderRadius }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${clampedProgress}%`,
            height,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
