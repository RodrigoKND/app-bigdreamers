import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';
import { Gem, Diamond, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useCompanies } from '@/hooks/company/useCompanies';
import type { Company, CompanyLevel } from '@/constants/mockCompanies';

const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2611/2611152.png';

function validImageUrl(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return FALLBACK_IMAGE;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.62;
const VISIBLE_COUNT = 3;
const SPACING = 4;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

const LEVEL_STYLES: Record<CompanyLevel, { label: string; color: string; border: string; chip: string }> = {
  gold:    { label: 'Oro',   color: '#FFD740', border: '#FFD740', chip: '#F9A825' },
  silver:  { label: 'Plata', color: '#E2E8F0', border: '#94A3B8', chip: '#64748B' },
  bronze:  { label: 'Bronce', color: '#D4A574', border: '#CD7F32', chip: '#A0522D' },
  diamond: { label: 'Diamante', color: '#81E6FF', border: '#81E6FF', chip: '#00B4D8' },
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function interleaveCompanies(companies: Company[]): Company[] {
  const gold = shuffleArray(companies.filter(c => c.level === 'gold'));
  const silver = shuffleArray(companies.filter(c => c.level === 'silver'));
  const bronze = shuffleArray(companies.filter(c => c.level === 'bronze'));
  const diamond = shuffleArray(companies.filter(c => c.level === 'diamond'));

  const result: Company[] = [];
  const maxLen = Math.max(gold.length, silver.length, bronze.length, diamond.length);
  const levels = ['gold', 'silver', 'bronze', 'diamond'] as CompanyLevel[];
  const pools = { gold, silver, bronze, diamond };

  for (let i = 0; i < maxLen; i++) {
    for (const level of levels) {
      if (pools[level][i]) result.push(pools[level][i]);
    }
  }

  return result.length >= VISIBLE_COUNT ? result : shuffleArray(companies);
}

/* ─── Animated 3D card ─── */
function AnimatedCard({ company, index, scrollOffset, isDark }: {
  company: Company;
  index: number;
  scrollOffset: Animated.SharedValue<number>;
  isDark: boolean;
}) {
  const router = useRouter();
  const levelStyle = LEVEL_STYLES[company.level] ?? LEVEL_STYLES.bronze;

  // En oscuro usamos los azules de la paleta (no slate/negro) para que las
  // tarjetas armonicen con el fondo azul de la página en vez de romperlo.
  const cardBodyBg = isDark ? Colors.blue.card : '#FFFFFF';
  const infoGradColors: readonly [string, string] = isDark
    ? [Colors.blue.card, Colors.blue.surface] as const
    : ['#F8FAFC', '#F1F5F9'] as const;
  const textColor = isDark ? Colors.text.primary : Colors.light.textPrimary;

  const cardStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];
    const scale = interpolate(scrollOffset.value, inputRange, [0.78, 1, 0.78], 'clamp');
    const opacity = interpolate(scrollOffset.value, inputRange, [0.5, 1, 0.5], 'clamp');

    return {
      zIndex: Math.round(interpolate(scrollOffset.value, inputRange, [1, 3, 1], 'clamp')),
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[{ width: CARD_WIDTH, marginHorizontal: SPACING / 2 }, cardStyle]}>
      <Pressable
        onPress={() => router.push(`/company/${company.id}`)}
        className="active:opacity-80"
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        {/* Card outer border glow */}
        <View
          style={{
            borderRadius: 16,
            padding: 2,
            backgroundColor: levelStyle.border,
            shadowColor: levelStyle.border,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {/* Card body */}
          <View style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: cardBodyBg }}>
            {/* Image */}
            <View style={{ height: 110, position: 'relative' }}>
              <Image
                source={{ uri: validImageUrl(company.imageUrl) }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* Shine overlay */}
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'transparent', 'rgba(0,0,0,0.2)']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              {/* Level chip badge */}
              <View
                style={{
                  position: 'absolute', top: 6, right: 6,
                  backgroundColor: levelStyle.chip,
                  borderRadius: 20,
                  width: 28, height: 28,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: levelStyle.color,
                  shadowColor: levelStyle.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Diamond size={13} color="#fff" />
              </View>
            </View>

            {/* Info section */}
            <LinearGradient
              colors={infoGradColors}
              style={{ padding: 10, gap: 6 }}
            >
              <Text
                className="text-[13px] font-bold leading-tight"
                numberOfLines={1}
                style={{ color: textColor }}
              >
                {company.name}
              </Text>

              <View className="flex-row items-center justify-between">
                <View
                  className="rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: `${levelStyle.color}22` }}
                >
                  <Text className="text-[9px] font-black tracking-wider" style={{ color: levelStyle.color }}>
                    {levelStyle.label}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Gem size={10} color={levelStyle.color} />
                  <Text className="text-[11px] font-bold" style={{ color: levelStyle.color }}>
                    {company.gems.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main component ─── */
const COPIES = 40;

export default function CasinoCompanyCarousel() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { companies, loading } = useCompanies();
  const [items, setItems] = useState<Company[]>([]);
  const scrollOffset = useSharedValue(0);

  const published = useMemo(() => companies.filter(c => c.published !== false), [companies]);

  const initialItems = useMemo(() => {
    if (published.length < VISIBLE_COUNT) return [];
    const shuffled = interleaveCompanies(published);
    return Array.from({ length: COPIES }, () => [...shuffled]).flat();
  }, [published]);

  useEffect(() => {
    if (initialItems.length > 0 && items.length === 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  if (loading || published.length < VISIBLE_COUNT) return null;

  return (
    <View className="mt-7 mb-4">
      {/* Title row */}
      <View className="flex-row items-center justify-between mx-4 mb-3">
        <Text
          className="text-[15px] font-bold"
          style={{ color: textPrimary }}
        >
          Rueda de inversiones
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/invest')}
          className="flex-row items-center gap-1 active:opacity-60"
        >
          <Text className="text-[12px] font-semibold" style={{ color: accentColor }}>
            Ver todo
          </Text>
          <ArrowRight size={13} color={accentColor} />
        </Pressable>
      </View>

      {/* 3D Carousel */}
      <Animated.FlatList
        data={items}
        keyExtractor={(_, idx) => `c-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
          paddingVertical: 8,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <AnimatedCard
            company={item}
            index={index}
            scrollOffset={scrollOffset}
            isDark={isDark}
          />
        )}
      />
    </View>
  );
}
