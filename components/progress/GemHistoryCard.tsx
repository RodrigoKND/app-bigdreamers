import React from 'react';
import { View, Text } from 'react-native';
import { Gem, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
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
  return (
    // Usamos el Card maestro pasándole flex-row para que distribuya los elementos en línea
    <Card className={`flex-row p-4 mx-4 mb-3 ${className}`.trim()}>
      
      {/* Bloque 1: Gemas actuales */}
      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Gemas actuales: ${currentGems}`}
      >
        <Gem size={18} color={Colors.gold[500]} />
        <Text className="text-gold-500 font-bold text-lg">
          {currentGems.toLocaleString()}
        </Text>
        <Text className="text-text-muted font-normal text-[11px] text-center">
          Gemas actuales
        </Text>
      </View>

      {/* Divisor Vertical */}
      <View className="w-[1px] bg-white/10 mx-2" />

      {/* Bloque 2: Total ganadas */}
      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Total de gemas ganadas históricamente: ${totalEarned}`}
      >
        <Gem size={18} color={Colors.text.secondary} />
        <Text className="text-text-secondary font-bold text-lg">
          {totalEarned.toLocaleString()}
        </Text>
        <Text className="text-text-muted font-normal text-[11px] text-center">
          Total ganadas
        </Text>
      </View>

      {/* Divisor Vertical */}
      <View className="w-[1px] bg-white/10 mx-2" />

      {/* Bloque 3: Crecimiento semanal */}
      <View 
        className="flex-1 items-center gap-1.5"
        accessible={true}
        accessibilityLabel={`Crecimiento esta semana: ${weeklyGrowth} gemas`}
      >
        <TrendingUp size={18} color={Colors.success} />
        <Text className="text-success font-bold text-lg">
          +{weeklyGrowth}
        </Text>
        <Text className="text-text-muted font-normal text-[11px] text-center">
          Esta semana
        </Text>
      </View>

    </Card>
  );
}