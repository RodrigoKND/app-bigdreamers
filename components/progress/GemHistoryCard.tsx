import React from 'react';
import { View, Text } from 'react-native';
import { Gem, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/shared/Card';

interface GemHistoryCardProps {
  totalEarned: number;
  currentGems: number;
  weeklyGrowth: number;
  className?: string; 
}

export default function GemHistoryCard({
  totalEarned,
  currentGems,
  weeklyGrowth,
  className = '',
}: GemHistoryCardProps) {
  const { isDark } = useTheme();
  const textMuted = isDark ? Colors.text.muted : Colors.light.textMuted;
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;

  return (
    <Card className={`flex-row p-4 mx-4 mb-3 ${className}`.trim()}>
      
      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Gemas actuales: ${currentGems}`}
      >
        <Gem size={18} color={Colors.gold[500]} />
        <Text className="text-gold-500 font-bold text-lg">
          {currentGems.toLocaleString()}
        </Text>
        <Text className="font-normal text-[11px] text-center" style={{ color: textMuted }}>
          Gemas actuales
        </Text>
      </View>

      <View className="w-[1px] mx-2" style={{ backgroundColor: dividerColor }} />

      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Total de gemas ganadas históricamente: ${totalEarned}`}
      >
        <Gem size={18} color={isDark ? Colors.text.secondary : Colors.light.textSecond} />
        <Text className="font-bold text-lg" style={{ color: isDark ? Colors.text.secondary : Colors.light.textSecond }}>
          {totalEarned.toLocaleString()}
        </Text>
        <Text className="font-normal text-[11px] text-center" style={{ color: textMuted }}>
          Total ganadas
        </Text>
      </View>

      <View className="w-[1px] mx-2" style={{ backgroundColor: dividerColor }} />

      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Crecimiento esta semana: ${weeklyGrowth} gemas`}
      >
        <TrendingUp size={18} color={isDark ? Colors.success : Colors.light.success} />
        <Text className="font-bold text-lg" style={{ color: isDark ? Colors.success : Colors.light.success }}>
          +{weeklyGrowth}
        </Text>
        <Text className="font-normal text-[11px] text-center" style={{ color: textMuted }}>
          Esta semana
        </Text>
      </View>

    </Card>
  );
}