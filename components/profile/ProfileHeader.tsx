import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';
import LevelBadge from '@/components/shared/LevelBadge';

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
      className={`items-center pt-6 pb-6 px-4 gap-2 ${className}`.trim()}
      style={{ backgroundColor: isDark ? Colors.navy[900] : Colors.light.bg }}
      accessible={true}
      accessibilityLabel={`Perfil de ${user.name}. Nivel ${config.label}.`}
    >
      {/* Avatar */}
      <View
        className="w-[90px] h-[90px] rounded-full border-[3px] items-center justify-center mb-1"
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
            className="font-bold text-[28px]"
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
        className="font-normal text-[13px]"
        style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
      >
        {user.email}
      </Text>

      {/* Badge nivel */}
      <View className="mt-1">
        <LevelBadge level={user.level} size="md" />
      </View>
    </View>
  );
}