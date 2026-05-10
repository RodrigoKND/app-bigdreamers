import React from 'react';
import { View, Text } from 'react-native';
import { Medal, Star, Trophy, Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Level } from '@/types';

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Diamante'] as const;

const LEVEL_INDEX: Record<Level, number> = {
  bronze: 0,
  silver: 1,
  gold:   2,
};

// Diamante no está en Level todavía, pero lo reservamos en el mapa visual
const LEVEL_XP: Record<number, { label: string; max: number }> = {
  0: { label: 'Bronce → Plata', max: 500  },
  1: { label: 'Plata → Oro',   max: 1000 },
  2: { label: 'Oro → Diamante',max: 2000 },
};

type LevelIconProps = { size: number; color: string };

const LEVEL_ICONS: Record<number, React.FC<LevelIconProps>> = {
  0: Medal,
  1: Star,
  2: Trophy,
  3: Gem,
};

interface JourneyCardProps {
  isDark:   boolean;
  level:    Level;
  gems:     number;
}

export function JourneyCard({ isDark, level, gems }: JourneyCardProps) {
  const textMuted  = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textSecond = isDark ? 'rgba(255,255,255,0.85)' : Colors.light.textSecond;

  const currentIndex = LEVEL_INDEX[level] ?? 1;
  const xpConfig     = LEVEL_XP[currentIndex] ?? LEVEL_XP[1];
  const xpProgress   = Math.min(gems, xpConfig.max);
  const xpPercent    = Math.round((xpProgress / xpConfig.max) * 100);

  return (
    <View
      className="mx-5 mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border,
      }}
    >
      <View className="px-4 pt-4 pb-5">

        <View className="items-center mb-4">
          <Text className="text-xs font-bold tracking-widest mb-2" style={{ color: textMuted }}>
            TU JOURNEY
          </Text>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: Colors.gold[400] }}>
            <Text className="text-xs font-bold" style={{ color: '#000' }}>Tú</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-5">
          {LEVELS.map((levelLabel, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent   = index === currentIndex;
            const isLocked    = index > currentIndex;
            const IconComponent = LEVEL_ICONS[index];

            return (
              <View key={levelLabel} className="items-center flex-1" style={{ position: 'relative' }}>
                {index > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      left: '-50%',
                      top: 22,
                      width: '100%',
                      height: 3,
                      backgroundColor: isCompleted || isCurrent
                        ? Colors.gold[400]
                        : isDark ? 'rgba(255,255,255,0.12)' : Colors.light.border,
                      zIndex: 0,
                    }}
                  />
                )}
                <View
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isCurrent
                      ? Colors.gold[400]
                      : isCompleted
                      ? 'rgba(255,215,64,0.2)'
                      : isDark ? 'rgba(255,255,255,0.07)' : Colors.light.surface,
                    borderWidth: isCompleted ? 2 : 0,
                    borderColor: Colors.gold[400],
                    opacity: isLocked ? 0.4 : 1,
                    zIndex: 1,
                  }}
                >
                  <IconComponent
                    size={isCurrent ? 22 : 18}
                    color={
                      isCurrent   ? '#000'
                      : isCompleted ? Colors.gold[400]
                      : isDark    ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted
                    }
                  />
                </View>
                <Text
                  className="text-xs font-semibold mt-2 text-center"
                  style={{
                    color: isCurrent ? Colors.gold[400] : isCompleted ? textSecond : textMuted,
                  }}
                >
                  {levelLabel}
                </Text>
              </View>
            );
          })}
        </View>

        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold" style={{ color: textMuted }}>
              {xpConfig.label}
            </Text>
            <Text className="text-xs font-bold" style={{ color: textSecond }}>
              {xpProgress.toLocaleString()} / {xpConfig.max.toLocaleString()} XP
            </Text>
          </View>
          <View
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border }}
          >
            <View
              className="h-full rounded-full"
              style={{ width: `${xpPercent}%`, backgroundColor: Colors.gold[400] }}
            />
          </View>
        </View>

      </View>
    </View>
  );
}