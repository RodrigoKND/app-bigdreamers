import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gem, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemPackage } from '@/constants/gemPackages';

interface GemPackageCardProps {
  package: GemPackage;
  selected: boolean;
  onSelect: () => void;
  isDark: boolean;
}

function PopularGlow() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute', top: -1, left: -1, right: -1, bottom: -1,
          borderRadius: 20, borderWidth: 2, borderColor: Colors.gold[400],
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
}

const GemPackageCard = ({ package: gemPackage, selected, onSelect, isDark }: GemPackageCardProps) => {
  const gemsPerBs = (gemPackage.gems / gemPackage.bsPrice).toFixed(0);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.03 : 1, { damping: 12, stiffness: 150 });
  }, [selected]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bgColors: readonly [string, string] = isDark
    ? (selected ? ['#1E3A5F', '#0E2A50'] as const : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)'] as const)
    : (selected ? ['#048ABF', '#036A94'] as const : ['#F8FAFC', '#F1F5F9'] as const);
  const borderCol = selected ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.06)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted;

  return (
    <Animated.View style={[{ marginBottom: 12 }, animStyle]}>
      <Pressable onPress={onSelect} className="active:opacity-80">
        <LinearGradient
          colors={bgColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            borderWidth: selected ? 2 : 1,
            borderColor: borderCol,
          }}
        >
          {gemPackage.popular && <PopularGlow />}

          {gemPackage.popular && (
            <View className="absolute top-2 right-2 px-2.5 py-1 rounded-full z-10 bg-[#FFD740]">
              <Text className="text-[8px] font-black uppercase tracking-wider text-black">
                Best Seller
              </Text>
            </View>
          )}

          <View className="items-center pt-1">
            {/* Icon */}
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
              style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : 'rgba(255,255,255,0.5)' }}
            >
              <Gem size={26} color={selected ? '#FFFFFF' : Colors.gold[400]} />
            </View>

            {/* Gem count */}
            <Text className="text-[26px] font-black tracking-tight" style={{ color: selected ? '#FFFFFF' : textPrimary }}>
              {gemPackage.gems.toLocaleString()}
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.7)' : textMuted }}>
              Gemas
            </Text>

            {/* Price */}
            <Text className="text-xl font-black mt-2" style={{ color: selected ? '#FFD740' : Colors.gold[400] }}>
              Bs {gemPackage.bsPrice}
            </Text>
            <Text className="text-[9px] mt-1" style={{ color: textMuted }}>
              ~{gemsPerBs} gemas/bs
            </Text>
          </View>

          {/* Selected check */}
          {selected && (
            <View
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Text className="text-[10px] font-black" style={{ color: '#000' }}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default GemPackageCard;
