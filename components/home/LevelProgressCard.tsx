import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { getLevelConfig, getLevelProgress, getGemsToNextLevel } from '@/constants/levels';
import ProgressBar from '@/components/shared/ProgressBar';
import GemBadge from '@/components/shared/GemBadge';

interface LevelProgressCardProps {
  user: User;
  className?: string;
}

export default function LevelProgressCard({ user, className = '' }: LevelProgressCardProps) {
  const { isDark } = useTheme();
  const config = getLevelConfig(user.level);
  const progress = getLevelProgress(user.gems, user.level);
  const remaining = getGemsToNextLevel(user.gems, user.level);
  const nextConfig = config.nextLevel ? getLevelConfig(config.nextLevel) : null;

  const textMuted = isDark ? Colors.text.muted : Colors.light.textMuted;
  const textSecond = isDark ? Colors.text.secondary : Colors.light.textSecond;

  return (
    <View 
      className={`rounded-2xl p-4 mx-4 mb-3 gap-3 border ${className}`.trim()}
      style={{ backgroundColor: isDark ? Colors.blue.card : Colors.light.card, borderColor: `${config.color}30` }}
      accessible={true}
      accessibilityLabel={`Progreso de nivel. Nivel actual: ${config.label}. Progreso: ${progress} por ciento. Faltan ${remaining} gemas para el nivel ${nextConfig?.label || 'maximo'}.`}
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="font-normal text-xs" style={{ color: textMuted }}>
            Tu Progreso de Nivel
          </Text>
          <Text 
            className="font-bold text-xl mt-0.5" 
            style={{ color: config.color }}
          >
            {config.label}
          </Text>
        </View>
        
        <GemBadge count={user.gems} size="md" showLabel />
      </View>

      <ProgressBar 
        progress={progress} 
        color={config.color} 
        height={10} 
      />

      <View className="flex-row justify-between items-center">
        <Text className="font-normal text-xs" style={{ color: textSecond }}>
          {progress}% completado
        </Text>
        
        {nextConfig && (
          <View className="flex-row items-center gap-0.5">
            <Text className="font-normal text-xs" style={{ color: textMuted }}>
              {remaining.toLocaleString()} para
            </Text>
            
            <ChevronRight size={14} color={textMuted} />
            
            <Text 
              className="font-semibold text-xs" 
              style={{ color: nextConfig.color }}
            >
              {nextConfig.label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}