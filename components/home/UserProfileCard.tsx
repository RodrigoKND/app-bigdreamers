import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/images';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types';

const LEVEL_CONFIG: Record<string, { label: string; color: string; next: string; min: number; max: number }> = {
  bronze:  { min: 0,    max: 500,  label: 'Bronce',   color: Colors.levels.bronze,  next: 'Plata'    },
  silver:  { min: 500,  max: 2000, label: 'Plata',    color: Colors.levels.silver,  next: 'Oro'      },
  gold:    { min: 2000, max: 5000, label: 'Oro',      color: Colors.levels.gold,    next: 'Diamante' },
  diamond: { min: 5000, max: 5000, label: 'Diamante', color: Colors.levels.diamond, next: 'Máx'      },
};

export default function UserProfileCard({ user }: { user: User }) {
  const { isDark } = useTheme();
  const config = LEVEL_CONFIG[user.level] ?? LEVEL_CONFIG.bronze;
  const progress = user.level === 'diamond'
    ? 100
    : Math.min(100, Math.round(((user.gems - config.min) / (config.max - config.min)) * 100));

  const cardBg      = isDark ? Colors.blue.light : Colors.light.card;
  const textPrimary = isDark ? Colors.text.primary  : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textSecond;

  return (
    <View
      className="mx-4 rounded-3xl p-5 overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm" style={{ color: textMuted }}>
            Bienvenido de vuelta
          </Text>
          <Text className="text-[24px] font-extrabold mt-0.5 leading-tight" style={{ color: textPrimary }}>
            {user.name}
          </Text>

          <View className="flex-row items-center gap-2 mt-3 flex-wrap">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${config.color}22` }}
            >
              <Text className="text-[11px] font-bold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: isDark ? 'rgba(249,115,22,0.15)' : '#FEF3C7' }}
            >
              <Text className="text-[11px] font-bold" style={{ color: '#F97316' }}>
                ⚡ {user.streak} días
              </Text>
            </View>
          </View>
        </View>

        <View
          className="w-[72px] h-[72px] rounded-2xl items-center justify-center"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.light.surface }}
        >
          <Image source={IMAGES.BUHO} style={{ width: 58, height: 58 }} resizeMode="contain" />
        </View>
      </View>

      {/* Progress bar */}
      <View className="mt-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs" style={{ color: textMuted }}>
            Progreso → {config.next}
          </Text>
          <Text className="text-xs font-extrabold" style={{ color: config.color }}>
            {progress}%
          </Text>
        </View>
        <View
          className="h-[5px] rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border }}
        >
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: config.color }}
          />
        </View>
      </View>
    </View>
  );
}
