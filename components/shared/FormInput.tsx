import React from 'react';
import { View, Text, TextInputProps } from 'react-native';
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
  return (
    <View className={`w-full ${className}`.trim()}>
      {label && (
        <Text className="text-sm font-medium text-text-secondary mb-1.5 ml-1">
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
          className="text-xs font-medium text-error mt-1.5 ml-1"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}