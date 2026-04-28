import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Gem, BookOpen, Flame, Trophy, Lightbulb, Star, Lock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { JourneyCard } from '@/components/progress/JourneyCard';
import ProgressHeader from '@/components/progress/ProgressHeader';

interface Badge {
  id: string;
  label: string;
  earned: boolean;
  color: string;
  bg: string;
  Icon: React.FC<{ size: number; color: string }>;
}

const BADGES: Badge[] = [
  {
    id: '1',
    label: 'Primer módulo',
    earned: true,
    color: '#FFD740',
    bg: 'rgba(255,215,64,0.15)',
    Icon: Trophy,
  },
  {
    id: '2',
    label: 'Racha 7 días',
    earned: true,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.15)',
    Icon: Flame,
  },
  {
    id: '3',
    label: 'Primer inversor',
    earned: true,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.15)',
    Icon: Lightbulb,
  },
  {
    id: '4',
    label: 'Nivel Oro',
    earned: false,
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.06)',
    Icon: Star,
  },
];

const STAT_ICONS = {
  GEMAS: Gem,
  MÓDULOS: BookOpen,
  RACHA: Flame,
};

export default function ProgressScreen() {
  const { isDark } = useTheme();

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const cardBg = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;

  const stats = [
    { value: '1,240', label: 'GEMAS', color: isDark ? Colors.gold[400] : Colors.light.accent, Icon: Gem },
    { value: '8', label: 'MÓDULOS', color: isDark ? '#4ADE80' : '#16A34A', Icon: BookOpen },
    { value: '12', label: 'RACHA', color: '#FF6B35', Icon: Flame },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ProgressHeader streakDays={12} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Journey card */}
        <JourneyCard isDark={isDark} />

        {/* Stats row */}
        <View className="flex-row px-5 gap-3 mb-5">
          {stats.map((stat) => (
            <View
              key={stat.label}
              accessible
              accessibilityLabel={`${stat.value} ${stat.label}`}
              className="flex-1 rounded-2xl items-center justify-center py-5 gap-1"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <stat.Icon size={22} color={stat.color} />
              <Text className="text-xl font-bold mt-1" style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text className="text-xs font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
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

          {/* Grid 2x2 en lugar de fila única — mejor uso del espacio */}
          <View className="flex-row flex-wrap gap-3">
            {BADGES.map((badge) => (
              <View
                key={badge.id}
                accessible
                accessibilityLabel={`Insignia ${badge.label}${badge.earned ? ', obtenida' : ', bloqueada'}`}
                style={{
                  width: '47%',
                  backgroundColor: badge.earned ? badge.bg : isDark ? 'rgba(255,255,255,0.04)' : Colors.light.card,
                  borderWidth: 1,
                  borderColor: badge.earned
                    ? `${badge.color}30`
                    : cardBorder,
                  opacity: badge.earned ? 1 : 0.5,
                  borderRadius: 16,
                  alignItems: 'center',
                  paddingVertical: 20,
                  paddingHorizontal: 12,
                  gap: 8,
                }}
              >
                {badge.earned ? (
                  <badge.Icon size={28} color={badge.color} />
                ) : (
                  <Lock size={24} color={textMuted} />
                )}
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