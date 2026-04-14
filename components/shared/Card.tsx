import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'highlight';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  const bgColors: Record<string, string> = {
    default: Colors.blue.card,
    elevated: Colors.blue.surface,
    highlight: Colors.navy[700],
  };

  return (
    <View
      style={[
        {
          backgroundColor: bgColors[variant],
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
