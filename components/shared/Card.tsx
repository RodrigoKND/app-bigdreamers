import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlight';
  bgColor?: string;
}

export default function Card({ children, className = '', variant = 'default', bgColor }: CardProps) {
  const variantClasses: Record<string, string> = {
    default:  'bg-blue-card',
    elevated: 'bg-blue-surface',
    highlight: 'bg-navy-700',
  };

  return (
    <View
      className={`rounded-2xl p-4 border border-white/[0.06] ${bgColor ? '' : variantClasses[variant]} ${className}`.trim()}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      {children}
    </View>
  );
}