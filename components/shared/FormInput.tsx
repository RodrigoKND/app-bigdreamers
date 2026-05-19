import React from 'react';
import { View, Text, TextInputProps } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import BaseInput from './BaseInput';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export default function FormInput({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: FormInputProps) {
  const { isDark } = useTheme();

  return (
    <View className={`w-full ${className}`.trim()}>
      {label && (
        <Text className="text-sm font-medium mb-1.5 ml-1" style={{ color: isDark ? Colors.text.secondary : Colors.light.textSecond }}>
          {label}
        </Text>
      )}
      <BaseInput
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        hasError={!!error}
        {...props}
      />
      {error && (
        <Text
          className="text-xs font-medium mt-1.5 ml-1"
          style={{ color: isDark ? Colors.error : Colors.light.error }}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}