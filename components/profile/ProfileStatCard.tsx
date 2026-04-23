import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
  icon?: string;
}

interface ProfileStatCardProps {
  stats: StatItem[];
  className?: string;
  isDark: boolean;
}

export default function ProfileStatCard({ stats, className = '', isDark }: ProfileStatCardProps) {
  const cardBg     = isDark ? Colors.blue.card : Colors.light.card;
  const borderColor= isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const divider    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  return (
    <View
      className={`mx-4 mb-3 rounded-2xl ${className}`.trim()}
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0 : 0.07,
        shadowRadius: 8,
        elevation: isDark ? 0 : 3,
      }}
    >
      <View className="flex-row">
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            className="flex-1 items-center py-4"
            style={index < stats.length - 1 ? {
              borderRightWidth: 1,
              borderRightColor: divider,
            } : undefined}
            accessible={true}
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Text
              className="font-bold text-[22px]"
              style={{ color: stat.accent ?? (isDark ? Colors.text.primary : Colors.light.textPrimary) }}
            >
              {stat.value}
            </Text>
            {stat.icon && (
              <Text style={{ fontSize: 12, marginTop: 2 }}>{stat.icon}</Text>
            )}
            <Text
              className="text-[10px] font-semibold tracking-widest mt-1"
              style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}