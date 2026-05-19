import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface BaseInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasError?: boolean;
  className?: string;
}

export default function BaseInput({
  leftIcon,
  rightIcon,
  hasError = false,
  className = '',
  ...props
}: BaseInputProps) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = hasError
    ? Colors.error
    : isFocused
    ? Colors.blue.primary
    : isDark ? '#0A1E3D' : Colors.light.border;

  return (
    <View
      className={`flex-row items-center rounded-xl px-4 h-14 border ${className}`.trim()}
      style={{ backgroundColor: isDark ? '#0A1E3D' : Colors.light.surface, borderColor }}
    >
      {leftIcon && <View className="mr-3">{leftIcon}</View>}
      <TextInput
        className="flex-1 font-sans text-base h-full"
        style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
        placeholderTextColor={isDark ? Colors.text.muted : Colors.light.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {rightIcon && <View className="ml-3">{rightIcon}</View>}
    </View>
  );
}