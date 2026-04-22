import React from 'react';
import { View, Text } from 'react-native';
import { Level } from '@/types';
import { getLevelConfig } from '@/constants/levels';

interface LevelBadgeProps {
  level: Level;
  size?: 'sm' | 'md' | 'lg';
  className?: string; 
}

const SIZE_CLASSES = {
  sm: { container: 'px-2 py-[3px] rounded-lg', text: 'text-[10px]' },
  md: { container: 'px-3 py-[5px] rounded-[10px]', text: 'text-xs' },
  lg: { container: 'px-[14px] py-[6px] rounded-xl', text: 'text-sm' },
};

const COLOR_CLASSES: Record<string, { container: string, text: string }> = {
  bronze: { container: 'bg-levels-bronzeBg border-levels-bronze', text: 'text-levels-bronze' },
  silver: { container: 'bg-levels-silverBg border-levels-silver', text: 'text-levels-silver' },
  gold: { container: 'bg-levels-goldBg border-levels-gold', text: 'text-levels-gold' },
  diamond: { container: 'bg-levels-diamondBg border-levels-diamond', text: 'text-levels-diamond' },
};

export default function LevelBadge({ level, size = 'md', className = '' }: LevelBadgeProps) {
  const config = getLevelConfig(level);
  const s = SIZE_CLASSES[size];
  const colors = COLOR_CLASSES[level as string] || COLOR_CLASSES.bronze;

  return (
    <View
      className={`border self-start flex-row items-center justify-center ${colors.container} ${s.container} ${className}`.trim()}
      accessible={true}
      accessibilityLabel={`Nivel ${config?.label || 'desconocido'}`} //  Blindaje A11y, me lo recomendo claude, 
    >
      <Text 
        className={`font-bold tracking-[0.8px] uppercase ${colors.text} ${s.text}`}
      >
        {/* Blindaje anti-crashes: Si config no existe, no falla solo  */}
        {config?.label || ''}
      </Text>
    </View>
  );
}
//reduci un poco el tamaño, refactorizado a puro mainwind