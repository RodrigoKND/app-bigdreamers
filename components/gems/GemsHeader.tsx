import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  withDelay, withSpring,
  Easing, FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gem, Sparkles, Diamond } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

function GlowDot({ delay = 0 }: { delay: number }) {
  const opacity = useSharedValue(0.15);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 800 }),
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 800 }),
      ),
      -1, true,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 800 }),
      ),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[{ width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gold[400] }, style]}
    />
  );
}

interface GemsHeaderProps {
  currentGems: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GemsHeader = ({ currentGems }: GemsHeaderProps) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  return (
    <View style={{ paddingTop: insets.top + 4 }}>
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        <ButtonBackScreen className="px-2" />
        <Text className="text-[17px] font-bold tracking-tight" style={{ color: textPrimary }}>
          Tienda de Gemas
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Gem balance card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mx-5 mb-5">
        <LinearGradient
          colors={isDark ? ['#1E3A5F', '#0E2A50'] : ['#048ABF', '#036A94']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-6"
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <Gem size={30} color="#FFD740" />
              </View>
              <View>
                <Text className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Tu saldo
                </Text>
                <Text className="text-[32px] font-black leading-none mt-1" style={{ color: '#FFFFFF' }}>
                  {currentGems.toLocaleString()}
                </Text>
              </View>
            </View>
            <Diamond size={24} color="rgba(255,255,255,0.2)" />
          </View>

          {/* Dots decoration */}
          <View className="flex-row justify-end gap-1.5 mt-4">
            {[0, 1, 2].map((i) => <GlowDot key={i} delay={i * 200} />)}
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default GemsHeader;
