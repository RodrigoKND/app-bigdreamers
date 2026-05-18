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
}: Props) {
  const difficultyStyle = DIFFICULTY_STYLES[difficulty];

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
      className="rounded-3xl overflow-hidden p-6"
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

      <Text className="text-3xl font-black text-white mb-3">{title}</Text>
      <Text className="text-base text-blue-100/70 leading-6 mb-6">{description}</Text>

      <View className="flex-row items-center gap-2 pt-3 border-t border-white/10">
        <Gem size={20} color={Colors.gold[400]} />
        <Text className="text-base font-bold" style={{ color: Colors.gold[400] }}>
          {gemsReward} gems
        </Text>
      </View>
    </LinearGradient>
  );
}
