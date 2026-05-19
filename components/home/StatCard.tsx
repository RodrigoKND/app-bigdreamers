import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const StatCard = React.memo(function StatCard({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 items-center p-3 rounded-2xl shadow-sm mx-1" style={{ backgroundColor: isDark ? Colors.blue.card : Colors.light.card }}>
      {icon}
      <Text className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>{value}</Text>
      <View className="flex-row items-center mt-1">
        <Text className="text-[10px] uppercase tracking-tighter" style={{ color: isDark ? '#D1D5DB' : Colors.light.textMuted }}>{label}</Text>
      </View>
    </View>
  );
});

export default StatCard;