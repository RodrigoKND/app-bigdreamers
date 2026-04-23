import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import Card from '@/components/shared/Card';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
}

interface ProfileStatCardProps {
  title: string;
  stats: StatItem[];
  className?: string;
  isDark: boolean;
}

export default function ProfileStatCard({ title, stats, className = '', isDark }: ProfileStatCardProps) {
  return (
    <Card className={`mx-4 mb-3 p-4 ${className}`.trim()}>
      <Text
        className="font-semibold text-[13px] mb-3.5"
        style={{ color: isDark ? Colors.text.secondary : Colors.light.textSecond }}
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-4">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="min-w-[40%] flex-col gap-1"
            accessible={true}
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Text
              className="font-bold text-xl"
              style={{ color: stat.accent ?? (isDark ? Colors.text.primary : Colors.light.textPrimary) }}
            >
              {stat.value}
            </Text>
            <Text
              className="text-xs font-normal"
              style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}