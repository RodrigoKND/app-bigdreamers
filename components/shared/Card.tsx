import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlight';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-card',
    elevated: 'bg-blue-surface', // agregar 'surface' a tu tailwind.config.js
    highlight: 'bg-navy-700',
  };

  return (
    <View
      className={`rounded-2xl p-4 border border-white/[0.06] ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </View>
  );
}