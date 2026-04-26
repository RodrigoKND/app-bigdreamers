import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';

interface ProfileHeaderProps {
  user: any;
  isDark: boolean;
  className?: string;
}

export default function ProfileHeader({ user, isDark, className = '' }: ProfileHeaderProps) {
  const config = getLevelConfig(user.level);

  const userInitials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      className={`items-center pt-10 pb-4 px-4 gap-2 ${className}`.trim()}
      style={{ backgroundColor: isDark ? '#035380' : Colors.light.bg }}
      accessible={true}
      accessibilityLabel={`Perfil de ${user.name}. Nivel ${config.label}.`}
    >
      {/* Avatar */}
      <View
        className="w-[96px] h-[96px] rounded-full border-[3px] items-center justify-center mb-1"
        style={{
          borderColor: config.color,
          backgroundColor: isDark ? Colors.navy[600] : Colors.light.surface,
        }}
      >
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            className="w-full h-full rounded-full"
          />
        ) : (
          <Text
            className="font-bold text-[30px]"
            style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
          >
            {userInitials}
          </Text>
        )}
      </View>

      {/* Nombre */}
      <Text
        className="font-bold text-[22px]"
        style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
      >
        {user.name}
      </Text>

      {/* Email */}
      <Text
        className="font-normal text-[13px] -mt-1"
        style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
      >
        {user.email}
      </Text>

      {/* Badge nivel — fondo oscuro, texto claro */}
      <View
        className="flex-row items-center gap-1.5 px-4 py-1.5 rounded-full mt-1"
        style={{ backgroundColor: config.bgColor ?? Colors.navy[700] }}
      >
        <Text style={{ fontSize: 12 }}>⚡</Text>
        <Text
          className="font-bold text-xs tracking-wide"
          style={{ color: config.color }}
        >
          {config.label.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}