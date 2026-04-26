import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Diamante'];
const LEVEL_EMOJIS = ['🥉', '⭐', '🥇', '💎'];
const CURRENT_LEVEL_INDEX = 1;

interface JourneyCardProps {
  isDark: boolean;
}

export function JourneyCard({ isDark }: JourneyCardProps) {
  return (
    <View
      className="mx-5 mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgba(4, 56, 115, 0.85)' : Colors.light.card,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border,
      }}
    >
      <View className="px-4 pt-4 pb-5">

        {/* TU Journey label */}
        <View className="items-center mb-4">
          <Text
            className="text-xs font-bold tracking-widest mb-2"
            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted }}
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
                  <Text style={{ fontSize: isCurrent ? 22 : 18 }}>
                    {isCurrent ? '⭐' : LEVEL_EMOJIS[index]}
                  </Text>
                </View>

                <Text
                  className="text-xs font-semibold mt-2 text-center"
                  style={{
                    color: isCurrent
                      ? Colors.gold[400]
                      : isCompleted
                      ? isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecond
                      : isDark ? 'rgba(255,255,255,0.3)' : Colors.light.textMuted,
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
            <Text
              className="text-xs font-semibold"
              style={{ color: isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted }}
            >
              Plata → Oro
            </Text>
            <Text
              className="text-xs font-bold"
              style={{ color: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecond }}
            >
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