import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface Props {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gemsReward: number;
  isDark: boolean;
}

const DIFFICULTY_STYLES: Record<Props['difficulty'], { label: string; color: string }> = {
  beginner: { label: 'Principiante', color: '#22C55E' },
  intermediate: { label: 'Intermedio', color: '#F59E0B' },
  advanced: { label: 'Avanzado', color: '#EF4444' },
};

export default function ModuleDetailHeader({
  title,
  description,
  category,
  difficulty,
  gemsReward,
  isDark,
}: Props) {
  const difficultyStyle = DIFFICULTY_STYLES[difficulty];

  const gradientColors = isDark
    ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']
    : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)'];
  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const textDesc = isDark ? 'rgba(191, 219, 254, 0.7)' : Colors.light.textMuted;
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

  return (
    <LinearGradient
      colors={gradientColors}
      className="rounded-3xl overflow-hidden p-6"
      style={{ backgroundColor: isDark ? 'transparent' : Colors.light.card }}
    >
      <View className="flex-row flex-wrap gap-2 mb-4">
        <View className="rounded-full px-3 py-1 bg-amber-300/90">
          <Text className="text-[11px] font-bold uppercase tracking-[0.18rem] text-black">
            {category}
          </Text>
        </View>

        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: `${difficultyStyle.color}20` }}
        >
          <Text className="text-[11px] font-bold uppercase tracking-[0.18rem]" style={{ color: difficultyStyle.color }}>
            {difficultyStyle.label}
          </Text>
        </View>
      </View>

      <Text className="text-3xl font-black mb-3" style={{ color: textPrimary }}>{title}</Text>
      <Text className="text-base leading-6 mb-6" style={{ color: textDesc }}>{description}</Text>

      <View className="flex-row items-center gap-2 pt-3 border-t" style={{ borderColor }}>
        <Gem size={20} color={Colors.gold[400]} />
        <Text className="text-base font-bold" style={{ color: Colors.gold[400] }}>
          {gemsReward} gems
        </Text>
      </View>
    </LinearGradient>
  );
}
