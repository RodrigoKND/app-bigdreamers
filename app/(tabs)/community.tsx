import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Gem, Crown } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import CommunityHeader from '@/components/community/CommunityHeader';
import { useRankingByPeriod } from '@/hooks/community/useRankingByPeriod';
import { useAuth } from '@/contexts/AuthContext';
import type { Level, CommunityMember } from '@/types';

type Period = 'semanal' | 'mensual' | 'global';

const PERIOD_MAP: Record<Period, 'weekly' | 'monthly' | 'all'> = {
  semanal: 'weekly',
  mensual: 'monthly',
  global: 'all',
};

function getLevelColors(level: Level, isDark: boolean) {
  switch (level) {
    case 'gold':
      return { color: '#FFD740', bg: '#3D2E00', label: 'Nivel Oro' };
    case 'silver':
      return { color: '#B0C4DE', bg: '#1A2A3A', label: 'Nivel Plata' };
    case 'bronze':
      return { color: '#CD7F32', bg: '#2E1A00', label: 'Nivel Bronce' };
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('semanal');

  const { members, loading, error, refetch } = useRankingByPeriod(
    PERIOD_MAP[period],
    50
  );

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const rankedMembers = members.map((m, index) => ({ ...m, rank: index + 1 }));  //cambie dos lineas de aqui porque no generaba el ranking, porque como ambos usuarios eran nivel 0 no sabia la app como hacer el ranking, pero ahora si estan empatados lo hace por orden en que llegaron al nivel 0, entonces el que llego primero al nivel 0 va a ser el numero 1 del ranking, y asi sucesivamente, entonces ahora si se genera el ranking aunque haya muchos usuarios en nivel 0
  const top3 = rankedMembers.filter((u) => u.rank <= 3);
  const rest = rankedMembers.filter((u) => u.rank > 3);

  const first = top3.find((u) => u.rank === 1);
  const second = top3.find((u) => u.rank === 2);
  const third = top3.find((u) => u.rank === 3);

  const podiumBg = (rank: number) => {
    if (rank === 1) return { bg: Colors.gold[400], text: '#000' };
    if (rank === 2) return { bg: isDark ? '#2A3A4A' : '#CBD5E1', text: isDark ? '#B0C4DE' : '#475569' };
    return { bg: '#7C4A1E', text: '#FFB347' };
  };

  const renderPodiumUser = (member: CommunityMember, rank: number) => {
    const { color, bg: levelBg, label } = getLevelColors(member.level, isDark);
    const initials = getInitials(member.name);
    const isFirst = rank === 1;

    return (
      <View className="items-center flex-1">
        {isFirst && <Crown size={20} color={Colors.gold[400]} style={{ marginBottom: 4 }} />}
        <View
          className={`${isFirst ? 'w-16 h-16' : 'w-14 h-14'} rounded-full items-center justify-center mb-2${isFirst ? ' border-2' : ''}`}
          style={{
            backgroundColor: levelBg,
            ...(isFirst && { borderColor: Colors.gold[400] }),
          }}
        >
          <Text
            className={`${isFirst ? 'text-lg' : 'text-base'} font-bold`}
            style={{ color }}
          >
            {initials}
          </Text>
        </View>
        <Text className="text-xs font-semibold text-center" style={{ color: textPrimary }} numberOfLines={1}>
          {member.name}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Text className="text-xs font-bold" style={{ color: accentColor }}>
            {member.gems.toLocaleString()}
          </Text>
          <Gem size={11} color={accentColor} />
        </View>
        <View
          className="w-full items-center justify-center rounded-lg mt-2 py-2.5"
          style={{ backgroundColor: podiumBg(rank).bg }}
        >
          <Text className="text-base font-bold" style={{ color: podiumBg(rank).text }}>
            {rank}
          </Text>
        </View>
      </View>
    );
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

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={accentColor} />
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <Text className="text-sm text-center" style={{ color: textMuted }}>
            No se pudo cargar el ranking.
          </Text>
          <Pressable
            onPress={refetch}
            className="active:opacity-70 rounded-full px-5 py-2"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-xs font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      )}

      {/* Content */}
      {!loading && !error && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          
          {/* Empty state */}
          {members.length === 0 && (
            <View className="items-center px-8 gap-3" style={{ marginTop: 120 }}>
              <Crown size={48} color={textMuted} />
              <Text className="text-base font-bold text-center" style={{ color: textPrimary }}>
                Aún no hay miembros en el ranking
              </Text>
              <Text className="text-sm text-center" style={{ color: textMuted }}>
                Completa módulos y gana gemas para aparecer aquí
              </Text>
            </View>
          )}


          {members.length > 0 && (
            <>
              {/* Podio */}
              {top3.length > 0 && (
                <View className="px-5 mb-6">
                  <View className="flex-row items-end justify-center gap-4">
                    {second && renderPodiumUser(second, 2)}
                    {first && renderPodiumUser(first, 1)}
                    {third && renderPodiumUser(third, 3)}
                  </View>
                </View>
              )}

              
              {/* Lista */}
              <View className="px-5 gap-2">
                {rest.map((member) => {
                  const { color, bg: levelBg, label } = getLevelColors(member.level, isDark);
                  const initials = getInitials(member.name);
                  const isYou = member.id === user?.id;

                  return (
                    <Pressable
                      key={member.id}
                      accessible
                      accessibilityLabel={`${member.name}, puesto ${member.rank}, ${member.gems} gemas`}
                      className="active:opacity-70 flex-row items-center rounded-2xl px-4 py-3"
                      style={{
                        backgroundColor: isYou
                          ? isDark ? 'rgba(255,215,64,0.08)' : 'rgba(4,138,191,0.08)'
                          : cardBg,
                        borderWidth: 1,
                        borderColor: isYou
                          ? isDark ? 'rgba(255,215,64,0.3)' : Colors.light.accent
                          : cardBorder,
                      }}
                    >
                      <Text className="text-xs font-bold w-8" style={{ color: textMuted }}>
                        #{member.rank}
                      </Text>

                      <View
                        className="w-9 h-9 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: levelBg }}
                      >
                        <Text className="text-xs font-bold" style={{ color }}>
                          {initials}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-sm font-semibold" style={{ color: textPrimary }}>
                            {member.name}
                          </Text>
                          {isYou && (
                            <View
                              className="rounded px-1.5 py-0.5"
                              style={{ backgroundColor: accentColor }}
                            >
                              <Text className="text-xs font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
                                Tú
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-xs mt-0.5" style={{ color: textMuted }}>
                          {label}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1">
                        <Text className="text-sm font-bold" style={{ color: accentColor }}>
                          {member.gems.toLocaleString()}
                        </Text>
                        <Gem size={13} color={accentColor} />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}