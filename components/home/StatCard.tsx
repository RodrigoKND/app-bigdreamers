import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const StatCard = React.memo(function StatCard({ label, value, icon }: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  const { isDark } = useTheme();

  // Dark surface instead of the heavy blue card
  const cardBg = isDark ? '#131F35' : Colors.light.card;

  return (
    <View
      className="flex-1 items-center py-4 px-2 rounded-2xl mx-1"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
      }}
    >
      {icon && <View className="mb-1.5">{icon}</View>}
      <Text
        className="text-xl font-extrabold"
        style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
      >
        {value}
      </Text>
      <Text
        className="text-[10px] font-semibold uppercase tracking-widest mt-1"
        style={{ color: isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted }}
      >
        {label}
      </Text>
    </View>
  );
});

export default StatCard;
