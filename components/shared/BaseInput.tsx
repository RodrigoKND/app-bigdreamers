import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Colors } from '@/constants/colors';

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
  const [isFocused, setIsFocused] = useState(false);

  const borderColorClass = hasError
    ? 'border-error'
    : isFocused
    ? 'border-blue-primary'
    : 'border-navy-600';

  return (
    <View
      className={`flex-row items-center bg-navy-800 rounded-xl px-4 h-14 border ${borderColorClass} ${className}`.trim()}
    >
      {leftIcon && <View className="mr-3">{leftIcon}</View>}
      <TextInput
        className="flex-1 text-white font-sans text-base h-full"
        placeholderTextColor={Colors.text.muted}
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