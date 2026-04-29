import React from 'react';
import { View, Text, Image } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';

interface ProfileHeaderProps {
  user: any;
  isDark: boolean;
  className?: string;
}

export default function ProfileHeader({ user, isDark, className = '' }: ProfileHeaderProps) {
  const config = getLevelConfig(user.level);
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const userInitials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      className={`items-center pt-6 pb-4 px-4 gap-2 ${className}`.trim()}
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      accessible
      accessibilityLabel={`Perfil de ${user.name}. Nivel ${config.label}.`}
    >
      <View
        className="w-[96px] h-[96px] rounded-full border-[3px] items-center justify-center mb-1"
        style={{
          borderColor: config.color,
          backgroundColor: isDark ? Colors.navy[600] : Colors.light.surface,
        }}
      >
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} className="w-full h-full rounded-full" />
        ) : (
          <Text
            className="font-bold text-[30px]"
            style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
          >
            {userInitials}
          </Text>
        )}
      </View>

      <Text
        className="font-bold text-[22px]"
        style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
      >
        {user.name}
      </Text>

      <Text
        className="font-normal text-[13px] -mt-1"
        style={{ color: textMuted }}
      >
        {user.email}
      </Text>

      <View
        className="flex-row items-center gap-1.5 px-4 py-1.5 rounded-full mt-1"
        style={{ backgroundColor: config.bgColor ?? Colors.navy[700] }}
      >
        <Zap size={12} color={config.color} />
        <Text className="font-bold text-xs tracking-wide" style={{ color: config.color }}>
          {config.label.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}