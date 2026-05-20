import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlight';
  bgColor?: string;
}

const VARIANT_LIGHT: Record<string, { bg: string; border: string }> = {
  default:  { bg: '#F4F7FA', border: '#E2E8F0' },
  elevated: { bg: '#EEF3F8', border: '#E2E8F0' },
  highlight: { bg: '#DDEAF5', border: '#B3DDF0' },
};

const Card = React.memo(function Card({ children, className = '', variant = 'default', bgColor }: CardProps) {
  const { isDark } = useTheme();

  const darkVariants: Record<string, { bg: string; border: string }> = {
    default:  { bg: Colors.blue.card, border: 'rgba(255,255,255,0.06)' },
    elevated: { bg: Colors.blue.surface, border: 'rgba(255,255,255,0.06)' },
    highlight: { bg: Colors.navy[700], border: 'rgba(255,255,255,0.06)' },
  };

  const style = bgColor
    ? { backgroundColor: bgColor, borderColor: 'rgba(255,255,255,0.06)' }
    : isDark
    ? { backgroundColor: darkVariants[variant].bg, borderColor: darkVariants[variant].border }
    : { backgroundColor: VARIANT_LIGHT[variant].bg, borderColor: VARIANT_LIGHT[variant].border };

  return (
    <View
      className={`rounded-2xl p-4 border ${className}`.trim()}
      style={style}
    >
      {children}
    </View>
  );
});

export default Card;