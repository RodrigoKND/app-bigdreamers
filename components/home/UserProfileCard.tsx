import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types';

const LEVEL_CONFIG: Record<string, { label: string; color: string; next: string; min: number; max: number }> = {
  bronze:  { min: 0,    max: 500,  label: 'Bronce',   color: Colors.levels.bronze,  next: 'Plata'    },
  silver:  { min: 500,  max: 2000, label: 'Plata',    color: Colors.levels.silver,  next: 'Oro'      },
  gold:    { min: 2000, max: 5000, label: 'Oro',      color: Colors.levels.gold,    next: 'Diamante' },
  diamond: { min: 5000, max: 5000, label: 'Diamante', color: Colors.levels.diamond, next: 'Máx'      },
};

function PulsingBorder() {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -2, left: -2, right: -2, bottom: -2,
          borderRadius: 18,
          borderWidth: 3,
          borderColor: Colors.gold[400],
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
}

export default function UserProfileCard({ user }: { user: User }) {
  const { isDark } = useTheme();
  const config = LEVEL_CONFIG[user.level] ?? LEVEL_CONFIG.bronze;
  const progress = user.level === 'diamond'
    ? 100
    : Math.min(100, Math.round(((user.gems - config.min) / (config.max - config.min)) * 100));

  const cardBg      = isDark ? Colors.blue.light : Colors.light.card;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textSecond;

  return (
    <View
      className="mx-4 rounded-2xl px-5 pt-5 pb-4 overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <PulsingBorder />
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[13px]" style={{ color: textMuted }}>
            Bienvenido de vuelta
          </Text>
          <Text className="text-[22px] font-bold mt-0.5" style={{ color: textPrimary }}>
            {user.name}
          </Text>

          <View className="flex-row items-center gap-2 mt-2">
            <View
              className="px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${config.color}22` }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
            <View
              className="px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: isDark ? 'rgba(249,115,22,0.12)' : '#FEF3C7' }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: '#F97316' }}>
                ⚡ {user.streak} días
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <View
            className="h-[5px] rounded-full overflow-hidden"
            style={{ width: 80, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border }}
          >
            <View
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: config.color }}
            />
          </View>
          <Text className="text-[11px] font-semibold mt-1" style={{ color: config.color }}>
            {progress}%
          </Text>
          <Text className="text-[9px]" style={{ color: textMuted }}>
            → {config.next}
          </Text>
        </View>
      </View>
    </View>
  );
}
