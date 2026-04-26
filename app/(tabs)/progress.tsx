import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { Color } from 'expo-router';
import { JourneyCard } from '@/components/progress/JourneyCard';

interface Badge {
  id: string;
  icon: string;
  label: string;
  earned: boolean;
  color: string;
  bg: string;
}

const BADGES: Badge[] = [
  { id: '1', icon: '🏆', label: 'Primer módulo', earned: true, color: '#FFD740', bg: 'rgba(255,215,64,0.12)' },
  { id: '2', icon: '🔥', label: 'Racha 7 días', earned: true, color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  { id: '3', icon: '💡', label: 'Primer inversor', earned: true, color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  { id: '4', icon: '⭐', label: 'Nivel Oro', earned: false, color: '#94A3B8', bg: 'rgba(148,163,184,0.08)' },
];

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Diamante'];
const LEVEL_EMOJIS = ['🥉', '⭐', '🥇', '💎'];
const CURRENT_LEVEL_INDEX = 1;

export default function ProgressScreen() {
  const { isDark } = useTheme();

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg = isDark ? 'rgba(255,255,255,0.10)' : Colors.light.card;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? Colors.text.muted : Colors.light.textMuted;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
        <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
          Mi Progreso
        </Text>
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            backgroundColor: isDark ? 'rgba(255,107,53,0.15)' : 'rgba(255,107,53,0.1)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,107,53,0.3)' : 'rgba(255,107,53,0.2)',
          }}
        >
          <Text>⚡</Text>
          <Text className="text-sm font-bold" style={{ color: '#FF6B35' }}>
            12 días
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Journey card */}
        <JourneyCard isDark={isDark} />

        {/* Stats row */}
        <View className="flex-row px-5 gap-3 mb-5">
          {[
            { value: '1,240', label: 'GEMAS', icon: '💎', color: isDark ? Colors.gold[400] : Colors.light.accent },
            { value: '8', label: 'MÓDULOS', icon: '📚', color: isDark ? '#4ADE80' : '#16A34A' },
            { value: '12', label: 'RACHA', icon: '🔥', color: '#FF6B35' },
          ].map((stat) => (
            <View
              key={stat.label}
              accessible={true}
              accessibilityLabel={`${stat.value} ${stat.label}`}
              className="flex-1 rounded-2xl items-center justify-center py-4"
              style={{ backgroundColor: cardBg }}
            >
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text className="text-xs font-semibold mt-0.5" style={{ color: textMuted }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold" style={{ color: textPrimary }}>
              Insignias
            </Text>
            <Text className="text-sm font-semibold" style={{ color: textMuted }}>
              3 / 8
            </Text>
          </View>

          <View className="flex-row gap-3">
            {BADGES.map((badge) => (
              <View
                key={badge.id}
                accessible={true}
                accessibilityLabel={`Insignia ${badge.label}${badge.earned ? ', obtenida' : ', bloqueada'}`}
                className="flex-1 rounded-2xl items-center justify-center py-4"
                style={{
                  backgroundColor: badge.earned
                    ? badge.bg
                    : isDark ? 'rgba(255,255,255,0.03)' : Colors.light.card,
                  opacity: badge.earned ? 1 : 0.45,
                }}
              >
                <Text style={{ fontSize: 26, marginBottom: 6 }}>
                  {badge.earned ? badge.icon : '💎'}
                </Text>
                <Text
                  className="text-xs font-bold text-center"
                  style={{ color: badge.earned ? badge.color : textMuted }}
                  numberOfLines={2}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}