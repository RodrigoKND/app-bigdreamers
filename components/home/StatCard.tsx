import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const StatCard = React.memo(function StatCard({ label, value, valueComponent, icon }: {
  label: string;
  value?: string;
  valueComponent?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 items-center py-3 px-1">
      {icon && <View className="mb-1">{icon}</View>}
      {valueComponent ? valueComponent : (
        <Text
          className="text-lg font-bold"
          style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
        >
          {value}
        </Text>
      )}
      <Text
        className="text-[9px] font-semibold uppercase tracking-widest mt-0.5"
        style={{ color: isDark ? 'rgba(255,255,255,0.35)' : Colors.light.textMuted }}
      >
        {label}
      </Text>
    </View>
  );
});

export default StatCard;
