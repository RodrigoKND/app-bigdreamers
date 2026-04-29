import React from 'react';
import { View, Text } from 'react-native';
import { Medal, Star, Trophy, Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Diamante'];
const CURRENT_LEVEL_INDEX = 1;

type LevelIconProps = { size: number; color: string };

const LEVEL_ICONS: Record<number, React.FC<LevelIconProps>> = {
  0: Medal,
  1: Star,
  2: Trophy,
  3: Gem,
};

interface JourneyCardProps {
  isDark: boolean;
}

export function JourneyCard({ isDark }: JourneyCardProps) {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textSecond = isDark ? 'rgba(255,255,255,0.85)' : Colors.light.textSecond;

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

        {/* TU Journey label */}
        <View className="items-center mb-4">
          <Text
            className="text-xs font-bold tracking-widest mb-2"
            style={{ color: textMuted }}
          >
            TU JOURNEY
          </Text>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: Colors.gold[400] }}
          >
            <Text className="text-xs font-bold" style={{ color: '#000' }}>
              Tú
            </Text>
          </View>
        </View>

        {/* Level icons row */}
        <View className="flex-row items-center justify-between mb-5">
          {LEVELS.map((level, index) => {
            const isCompleted = index < CURRENT_LEVEL_INDEX;
            const isCurrent = index === CURRENT_LEVEL_INDEX;
            const isLocked = index > CURRENT_LEVEL_INDEX;
            const IconComponent = LEVEL_ICONS[index];

            return (
              <View key={level} className="items-center flex-1" style={{ position: 'relative' }}>
                {/* Connector */}
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
                      isCurrent
                        ? '#000'
                        : isCompleted
                        ? Colors.gold[400]
                        : isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted
                    }
                  />
                </View>

                <Text
                  className="text-xs font-semibold mt-2 text-center"
                  style={{
                    color: isCurrent
                      ? Colors.gold[400]
                      : isCompleted
                      ? textSecond
                      : textMuted,
                  }}
                >
                  {level}
                </Text>
              </View>
            );
          })}
        </View>

        {/* XP bar */}
        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold" style={{ color: textMuted }}>
              Plata → Oro
            </Text>
            <Text className="text-xs font-bold" style={{ color: textSecond }}>
              620 / 1,000 XP
            </Text>
          </View>
          <View
            className="w-full rounded-full overflow-hidden"
            style={{
              height: 8,
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border,
            }}
          >
            <View
              className="h-full rounded-full"
              style={{ width: '62%', backgroundColor: Colors.gold[400] }}
            />
          </View>
        </View>

      </View>
    </View>
  );
}