import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Search, Gem, Crown } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import CommunityHeader from '@/components/community/CommunityHeader';

type Period = 'semanal' | 'mensual' | 'global';

interface RankUser {
  id: string;
  initials: string;
  name: string;
  subtitle: string;
  gems: number;
  rank: number;
  isYou?: boolean;
  levelColor: string;
  levelBg: string;
}

const MOCK_USERS: RankUser[] = [
  { id: '1', initials: 'MR', name: 'María R.', subtitle: 'Nivel Oro', gems: 1240, rank: 1, levelColor: '#FFD740', levelBg: '#3D2E00' },
  { id: '2', initials: 'CL', name: 'Carlos L.', subtitle: 'Nivel Plata', gems: 980, rank: 2, levelColor: '#B0C4DE', levelBg: '#1A2A3A' },
  { id: '3', initials: 'AG', name: 'Ana G.', subtitle: 'Nivel Bronce', gems: 860, rank: 3, levelColor: '#CD7F32', levelBg: '#2E1A00' },
  { id: '24', initials: 'DV', name: 'Diego Vargas', subtitle: 'Nivel Plata', gems: 1240, rank: 24, isYou: true, levelColor: '#B0C4DE', levelBg: '#1A2A3A' },
  { id: '25', initials: 'JP', name: 'Juan Pérez', subtitle: 'Nivel Plata', gems: 1190, rank: 25, levelColor: '#B0C4DE', levelBg: '#1A2A3A' },
  { id: '26', initials: 'LM', name: 'Laura Mora', subtitle: 'Nivel Bronce', gems: 1050, rank: 26, levelColor: '#CD7F32', levelBg: '#2E1A00' },
  { id: '27', initials: 'RM', name: 'Roberto M.', subtitle: 'Nivel Bronce', gems: 990, rank: 27, levelColor: '#CD7F32', levelBg: '#2E1A00' },
  { id: '28', initials: 'SP', name: 'Sofía P.', subtitle: 'Nivel Bronce', gems: 920, rank: 28, levelColor: '#CD7F32', levelBg: '#2E1A00' },
];

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<Period>('semanal');

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const top3 = MOCK_USERS.filter(u => u.rank <= 3);
  const rest = MOCK_USERS.filter(u => u.rank > 3);

  const first = top3.find(u => u.rank === 1)!;
  const second = top3.find(u => u.rank === 2)!;
  const third = top3.find(u => u.rank === 3)!;

  const podiumBg = (rank: number) => {
    if (rank === 1) return { bg: Colors.gold[400], text: '#000' };
    if (rank === 2) return { bg: isDark ? '#2A3A4A' : '#CBD5E1', text: isDark ? '#B0C4DE' : '#475569' };
    return { bg: '#7C4A1E', text: '#FFB347' };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <CommunityHeader />

      {/* Period pills */}
      <View className="flex-row px-5 gap-2 mb-5 justify-center">
        {(['semanal', 'mensual', 'global'] as Period[]).map((p) => {
          const active = period === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              accessible
              accessibilityLabel={`Ranking ${p}`}
              className="active:opacity-70 rounded-full"
              style={{
                paddingHorizontal: 20,
                paddingVertical: 9,
                backgroundColor: active
                  ? isDark ? Colors.gold[400] : Colors.light.accent
                  : isDark ? Colors.navy[700] : Colors.light.surface,
              }}
            >
              <Text
                className="text-xs font-bold"
                style={{
                  color: active
                    ? isDark ? '#000' : '#fff'
                    : textMuted,
                }}
              >
                {p.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Podio */}
        <View className="px-5 mb-6">
          <View className="flex-row items-end justify-center gap-4">

            {/* 2do */}
            <View className="items-center flex-1">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: second.levelBg }}
              >
                <Text className="text-base font-bold" style={{ color: second.levelColor }}>
                  {second.initials}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-center" style={{ color: textPrimary }} numberOfLines={1}>
                {second.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Text className="text-xs font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.accent }}>
                  {second.gems.toLocaleString()}
                </Text>
                <Gem size={11} color={isDark ? Colors.gold[400] : Colors.light.accent} />
              </View>
              <View
                className="w-full items-center justify-center rounded-lg mt-2 py-2.5"
                style={{ backgroundColor: podiumBg(2).bg }}
              >
                <Text className="text-base font-bold" style={{ color: podiumBg(2).text }}>2</Text>
              </View>
            </View>

            {/* 1ro */}
            <View className="items-center flex-1">
              <Crown size={20} color={Colors.gold[400]} style={{ marginBottom: 4 }} />
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-2 border-2"
                style={{ backgroundColor: first.levelBg, borderColor: Colors.gold[400] }}
              >
                <Text className="text-lg font-bold" style={{ color: first.levelColor }}>
                  {first.initials}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-center" style={{ color: textPrimary }} numberOfLines={1}>
                {first.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Text className="text-xs font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.accent }}>
                  {first.gems.toLocaleString()}
                </Text>
                <Gem size={11} color={isDark ? Colors.gold[400] : Colors.light.accent} />
              </View>
              <View
                className="w-full items-center justify-center rounded-lg mt-2 py-2.5"
                style={{ backgroundColor: podiumBg(1).bg }}
              >
                <Text className="text-base font-bold" style={{ color: podiumBg(1).text }}>1</Text>
              </View>
            </View>

            {/* 3ro */}
            <View className="items-center flex-1">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: third.levelBg }}
              >
                <Text className="text-base font-bold" style={{ color: third.levelColor }}>
                  {third.initials}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-center" style={{ color: textPrimary }} numberOfLines={1}>
                {third.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Text className="text-xs font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.accent }}>
                  {third.gems.toLocaleString()}
                </Text>
                <Gem size={11} color={isDark ? Colors.gold[400] : Colors.light.accent} />
              </View>
              <View
                className="w-full items-center justify-center rounded-lg mt-2 py-2.5"
                style={{ backgroundColor: podiumBg(3).bg }}
              >
                <Text className="text-base font-bold" style={{ color: podiumBg(3).text }}>3</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Lista */}
        <View className="px-5 gap-2">
          {rest.map((user) => (
            <Pressable
              key={user.id}
              accessible
              accessibilityLabel={`${user.name}, puesto ${user.rank}, ${user.gems} gemas`}
              className="active:opacity-70 flex-row items-center rounded-2xl px-4 py-3"
              style={{
                backgroundColor: user.isYou
                  ? isDark ? 'rgba(255,215,64,0.08)' : 'rgba(4,138,191,0.08)'
                  : cardBg,
                borderWidth: 1,
                borderColor: user.isYou
                  ? isDark ? 'rgba(255,215,64,0.3)' : Colors.light.accent
                  : cardBorder,
              }}
            >
              <Text className="text-xs font-bold w-8" style={{ color: textMuted }}>
                #{user.rank}
              </Text>

              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: user.levelBg }}
              >
                <Text className="text-xs font-bold" style={{ color: user.levelColor }}>
                  {user.initials}
                </Text>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-semibold" style={{ color: textPrimary }}>
                    {user.name}
                  </Text>
                  {user.isYou && (
                    <View
                      className="rounded px-1.5 py-0.5"
                      style={{ backgroundColor: isDark ? Colors.gold[400] : Colors.light.accent }}
                    >
                      <Text className="text-xs font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
                        Tú
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs mt-0.5" style={{ color: textMuted }}>
                  {user.subtitle}
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.accent }}>
                  {user.gems.toLocaleString()}
                </Text>
                <Gem size={13} color={isDark ? Colors.gold[400] : Colors.light.accent} />
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}