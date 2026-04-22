import React from 'react';
import { View, Text } from 'react-native';
import { Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface GemBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 12, countClass: 'text-xs', labelClass: 'text-[10px]' },
  md: { icon: 16, countClass: 'text-sm', labelClass: 'text-xs' },
  lg: { icon: 20, countClass: 'text-lg', labelClass: 'text-base' },
};

export default function GemBadge({ count, size = 'md', showLabel = false, className = '' }: GemBadgeProps) {
  const s = SIZES[size];
  
  // parseFloat elimina los decimales en cero (ej. 1.0k -> 1k), pero mantiene el 1.5K
  const formatted = count >= 1000 
    ? `${parseFloat((count / 1000).toFixed(1))}k` 
    : count.toString();

  return (
    <View 
      className={`flex-row items-center gap-1 ${className}`.trim()}
      accessible={true}
      accessibilityLabel={`${count} gemas`} // ♿ Mejora de accesibilidad (VoiceOver/TalkBack)
    >
      <Gem size={s.icon} color={Colors.gold[500]} strokeWidth={2} />
      
      <Text className={`text-gold-500 font-bold ${s.countClass}`}>
        {formatted}
      </Text>
      
      {showLabel && (
        <Text className={`text-text-secondary font-sans ${s.labelClass}`}>
          gemas
        </Text>
      )}
    </View>
  );
}

//el tamaño es un poco mas pequeño para que este mas armonico con los cards  