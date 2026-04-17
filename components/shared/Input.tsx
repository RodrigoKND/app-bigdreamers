import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
// Mantenemos Colors para el placeholderTextColor, ya que RN no lee bien el placeholder desde Tailwind
import { Colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string; // Para inyectar márgenes
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  // Estado para saber si el usuario está escribiendo dentro del campo
  const [isFocused, setIsFocused] = useState(false);

  // Lógica de bordes derivada del estado (más eficiente que usar una función en el render)
  const borderColorClass = error
    ? 'border-error'
    : isFocused
    ? 'border-blue-primary'
    : 'border-navy-600'; // Borde sutil por defecto

  return (
    <View className={`w-full ${className}`.trim()}>
      {/* Etiqueta superior (opcional) */}
      {label && (
        <Text className="text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label}
        </Text>
      )}

      {/* Contenedor principal del Input */}
      <View
        className={`flex-row items-center bg-navy-800 rounded-xl px-4 h-14 border ${borderColorClass}`}
      >
        {/* Ícono Izquierdo  si es que hay */}
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        {/* Campo de texto nativo */}
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

        {/* Ícono  si es que hay */}
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>

      {/* Mensaje de Error (opcional) */}
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