import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  // Hacemos onPress opcional
  onPress?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string; 
}

//  Añadimos el color exacto del spinner al diccionario
const VARIANT_CLASSES: Record<string, { container: string; text: string; spinner: string }> = {
  primary: { 
    container: 'bg-blue-primary active:bg-blue-bright border border-transparent', 
    text: 'text-white',
    spinner: Colors.white
  },
  secondary: { 
    container: 'bg-navy-700 active:bg-navy-600 border border-transparent', 
    text: 'text-white',
    spinner: Colors.white
  },
  outline: { 
    container: 'bg-transparent border border-blue-primary active:bg-blue-primary/10', 
    text: 'text-blue-primary',
    spinner: Colors.blue.primary
  },
  ghost: { 
    container: 'bg-transparent active:bg-white/5 border border-transparent', 
    text: 'text-text-secondary',
    spinner: Colors.text.secondary 
  },
};

const SIZE_CLASSES = {
  sm: { container: 'px-3 py-2 rounded-lg', text: 'text-sm' },
  md: { container: 'px-4 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-2xl', text: 'text-lg' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
}: ButtonProps) {
  const v = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const s = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${v.container} ${s.container} ${isDisabled ? 'opacity-50' : 'opacity-100'} ${className}`.trim()}
      
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
    >
      {isLoading && (
        <ActivityIndicator 
          // el color viene directo de la variante
          color={v.spinner} 
          className="mr-2" 
        />
      )}
      
      <Text className={`font-bold text-center ${v.text} ${s.text}`}>
        {title}
      </Text>
    </Pressable>
  );
}