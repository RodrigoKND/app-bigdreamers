import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  Easing,
} from 'react-native-reanimated';
import { Gem, Crown, Medal, Search, Star, Shield, Swords } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useRankingByPeriod } from '@/hooks/community/useRankingByPeriod';
import { useAuth } from '@/contexts/AuthContext';
import { invalidateCache, CacheKeys } from '@/services/cache/cacheService';
import type { Level, CommunityMember } from '@/types';

type Period = 'semanal' | 'mensual' | 'global';

const PERIOD_MAP: Record<Period, 'weekly' | 'monthly' | 'all'> = {
  semanal: 'weekly',
  mensual: 'monthly',
  global: 'all',
};

const TIER_CONFIG: Record<Level, { label: string; color: string; glow: string; icon: React.FC<any> }> = {
  diamond: { label: 'Diamante', color: '#B9F2FF', glow: 'rgba(185,242,255,0.3)', icon: Star },
  gold:    { label: 'Oro',      color: '#FFD740', glow: 'rgba(255,215,64,0.3)',  icon: Crown },
  silver:  { label: 'Plata',    color: '#B0C4DE', glow: 'rgba(176,196,222,0.3)', icon: Shield },
  bronze:  { label: 'Bronce',   color: '#CD7F32', glow: 'rgba(205,127,50,0.3)',  icon: Swords },
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function GlowBorder({ color }: { color: string }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', top: -2, left: -2, right: -2, bottom: -2, borderRadius: 999, borderWidth: 2.5, borderColor: color },
        style,
      ]}
    />
  );
}

function PulsingTrophy() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Crown size={22} color={Colors.gold[400]} fill={Colors.gold[400]} />
    </Animated.View>
  );
}

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('semanal');
  const handlePeriodChange = useCallback((p: Period) => setPeriod(p), []);

  const { members, loading, error, refetch } = useRankingByPeriod(PERIOD_MAP[period], 50);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Al volver a la pestaña, refrescamos para tomar cambios recientes (ej: avatar
  // actualizado). useCachedQuery usa caché si sigue fresco, así que es barato.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Invalidamos el caché del período actual para forzar datos frescos del
      // servidor (el gesto manual debe traer contenido nuevo, no el caché).
      await invalidateCache(CacheKeys.rankingByPeriod(PERIOD_MAP[period], 50));
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch, period]);

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const rankedMembers = useMemo(() => members.map((m, index) => ({ ...m, rank: index + 1 })), [members]);
  const filteredMembers = useMemo(() => rankedMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase())), [rankedMembers, search]);
  const top3 = useMemo(() => filteredMembers.filter((u) => u.rank <= 3), [filteredMembers]);
  const rest = useMemo(() => filteredMembers.filter((u) => u.rank > 3), [filteredMembers]);

  const first = top3.find((u) => u.rank === 1);
  const second = top3.find((u) => u.rank === 2);
  const third = top3.find((u) => u.rank === 3);

  const renderPodiumUser = (member: CommunityMember, rank: number) => {
    const tier = TIER_CONFIG[member.level] ?? TIER_CONFIG.bronze;
    const initials = getInitials(member.name);
    const isFirst = rank === 1;
    const podiumColors = ['#FFD740', '#A8A9AD', '#CD7F32'];

    return (
      <View className={`items-center ${isFirst ? 'flex-[1.4]' : 'flex-1'}`}>
        {isFirst && <PulsingTrophy />}
        <View
          className={`${isFirst ? 'w-20 h-20 -mt-1' : 'w-16 h-16'} rounded-full items-center justify-center mb-2 overflow-hidden`}
          style={{ backgroundColor: `${tier.color}20`, borderWidth: 2.5, borderColor: tier.color }}
        >
          <GlowBorder color={tier.color} />
          {member.avatar ? (
            <Image source={{ uri: member.avatar }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className={`${isFirst ? 'text-xl' : 'text-base'} font-black`} style={{ color: tier.color }}>
              {initials}
            </Text>
          )}
        </View>
        <Text className="text-xs font-bold text-center" style={{ color: textPrimary }} numberOfLines={1}>
          {member.name}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Text className="text-xs font-black" style={{ color: tier.color }}>
            {member.gems.toLocaleString()}
          </Text>
          <Gem size={10} color={tier.color} />
        </View>
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mt-2"
          style={{ backgroundColor: podiumColors[rank - 1] }}
        >
          <Text className="text-lg font-black" style={{ color: rank === 1 ? '#000' : rank === 2 ? (isDark ? '#fff' : '#000') : '#000' }}>
            {rank}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>
      <View className="px-5 pt-2 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[22px] font-black tracking-tight" style={{ color: textPrimary }}>
              Clasificación
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: textMuted }}>
              Los mejores inversores de la semana
            </Text>
          </View>
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            className="w-10 h-10 rounded-xl items-center justify-center active:opacity-60"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.light.surface }}
          >
            <Search size={18} color={textMuted} />
          </Pressable>
        </View>

        {showSearch && (
          <View className="mt-3">
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar miembro..."
              autoFocus
              className="px-4 py-2.5 rounded-xl text-sm"
              style={{ backgroundColor: cardBg, color: textPrimary, borderWidth: 1, borderColor: cardBorder }}
              placeholderTextColor={textMuted}
            />
          </View>
        )}

        <View className="flex-row gap-2 mt-4 justify-center">
          {(['semanal', 'mensual', 'global'] as Period[]).map((p) => {
            const active = period === p;
            return (
              <Pressable
                key={p}
                onPress={() => handlePeriodChange(p)}
                className="active:opacity-70 rounded-full px-5 py-[9px]"
                style={{
                  backgroundColor: active ? (isDark ? Colors.gold[400] : Colors.light.accent) : (isDark ? Colors.navy[700] : Colors.light.surface),
                }}
              >
                <Text
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: active ? (isDark ? '#000' : '#fff') : textMuted }}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={accentColor} />
        </View>
      )}

      {!loading && error && (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <Text className="text-sm text-center" style={{ color: textMuted }}>
            No se pudo cargar el ranking.
          </Text>
          <Pressable onPress={refetch} className="active:opacity-70 rounded-full px-5 py-2" style={{ backgroundColor: accentColor }}>
            <Text className="text-xs font-bold" style={{ color: isDark ? '#000' : '#fff' }}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <View className="items-center px-8 gap-3 mt-[120px]">
              <Swords size={48} color={textMuted} />
              <Text className="text-base font-bold text-center" style={{ color: textPrimary }}>
                Aún no hay miembros en el ranking
              </Text>
              <Text className="text-sm text-center" style={{ color: textMuted }}>
                Completa módulos y gana gemas para aparecer aquí
              </Text>
            </View>
          ) : (
            <FlatList
              data={rest}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={accentColor}
                  colors={[accentColor]}
                />
              }
              ListHeaderComponent={
                top3.length > 0 ? (
                  <View className="mb-6 pt-4 pb-2 px-2">
                    <View className="flex-row items-end justify-center gap-4">
                      {second && renderPodiumUser(second, 2)}
                      {first && renderPodiumUser(first, 1)}
                      {third && renderPodiumUser(third, 3)}
                    </View>
                  </View>
                ) : null
              }
              renderItem={({ item: member }) => {
                const tier = TIER_CONFIG[member.level] ?? TIER_CONFIG.bronze;
                const initials = getInitials(member.name);
                const isYou = member.id === user?.id;
                const TierIcon = tier.icon;

                return (
                  <Pressable
                    key={member.id}
                    className="active:opacity-70 flex-row items-center rounded-2xl px-4 py-3.5 mb-2 overflow-hidden"
                    style={{
                      backgroundColor: isYou ? (isDark ? 'rgba(255,215,64,0.08)' : 'rgba(4,138,191,0.08)') : cardBg,
                      borderWidth: 1,
                      borderColor: isYou ? (isDark ? 'rgba(255,215,64,0.3)' : Colors.light.accent) : cardBorder,
                    }}
                  >
                    <View className="w-8 items-center">
                      {member.rank <= 3 ? (
                        <Medal size={16} color={tier.color} />
                      ) : (
                        <Text className="text-[11px] font-bold" style={{ color: textMuted }}>#{member.rank}</Text>
                      )}
                    </View>

                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mx-3 overflow-hidden"
                      style={{ backgroundColor: `${tier.color}18`, borderWidth: 1.5, borderColor: tier.color }}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} className="w-full h-full" resizeMode="cover" />
                      ) : (
                        <Text className="text-[11px] font-black" style={{ color: tier.color }}>{initials}</Text>
                      )}
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-sm font-bold" style={{ color: textPrimary }}>{member.name}</Text>
                        {isYou && (
                          <View className="rounded px-1.5 py-0.5" style={{ backgroundColor: accentColor }}>
                            <Text className="text-[9px] font-black" style={{ color: isDark ? '#000' : '#fff' }}>TÚ</Text>
                          </View>
                        )}
                      </View>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <TierIcon size={10} color={tier.color} />
                        <Text className="text-[10px] font-semibold" style={{ color: tier.color }}>{tier.label}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm font-black" style={{ color: tier.color }}>
                        {member.gems.toLocaleString()}
                      </Text>
                      <Gem size={12} color={tier.color} />
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
