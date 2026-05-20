import React from 'react';
import { View, Text } from 'react-native';
import { Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface GemBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 12, labelClass: 'text-[10px]' },
  md: { icon: 16, labelClass: 'text-xs' },
  lg: { icon: 20, labelClass: 'text-base' },
};

const GemBadge = React.memo(function GemBadge({ count, size = 'md', showLabel = false, className = '' }: GemBadgeProps) {
  const { isDark } = useTheme();
  const s = SIZES[size];
  
  const formatted = count >= 1000 
    ? `${parseFloat((count / 1000).toFixed(1))}k` 
    : count.toString();

  return (
    <View 
      className={`flex-row items-center gap-1 ${className}`.trim()}
      accessible={true}
      accessibilityLabel={`${count} gemas`}
    >
      <Gem size={s.icon} color={Colors.gold[500]} strokeWidth={2} />
      
      <Text className="text-gold-500 font-bold" style={{ fontSize: s.icon * 0.875 }}>
        {formatted}
      </Text>
      
      {showLabel && (
        <Text className="font-sans" style={{ color: isDark ? Colors.text.secondary : Colors.light.textSecond, fontSize: s.icon * 0.75 }}>
          gemas
        </Text>
      )}
    </View>
  );
});

export default GemBadge;