import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Gem, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface Props {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gemsReward: number;
  isDark: boolean;
  thumbnail?: string;
}

function isValidUrl(url?: string): url is string {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'));
}

const DIFFICULTY_STYLES: Record<Props['difficulty'], { label: string; color: string }> = {
  beginner:     { label: 'Principiante', color: '#22C55E' },
  intermediate: { label: 'Intermedio',   color: '#F59E0B' },
  advanced:     { label: 'Avanzado',     color: '#EF4444' },
};

export default function ModuleDetailHeader({
  title,
  description,
  category,
  difficulty,
  gemsReward,
  isDark,
  thumbnail,
}: Props) {
  const diffStyle = DIFFICULTY_STYLES[difficulty];
  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const textDesc    = isDark ? 'rgba(191,219,254,0.75)' : Colors.light.textSecond;
  const cardBg      = isDark ? 'rgba(255,255,255,0.06)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  const [imgFailed, setImgFailed] = useState(false);
  const showThumb = isValidUrl(thumbnail) && !imgFailed;

  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
    >
      {/* Miniatura */}
      {showThumb && (
        <Image
          source={{ uri: thumbnail }}
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
      )}

      <View className="p-6">
      {/* Badges */}
      <View className="flex-row flex-wrap gap-2 mb-5">
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.18)' : Colors.light.goldLight }}
        >
          <Text
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: isDark ? Colors.gold[400] : Colors.light.goldDark }}
          >
            {category}
          </Text>
        </View>

        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: `${diffStyle.color}1A` }}
        >
          <Text
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: diffStyle.color }}
          >
            {diffStyle.label}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text className="text-[28px] font-black leading-tight mb-3" style={{ color: textPrimary }}>
        {title}
      </Text>

      {/* Description */}
      <Text className="text-[14px] leading-6 mb-6" style={{ color: textDesc }}>
        {description}
      </Text>

      {/* Footer */}
      <View
        className="flex-row items-center gap-2 pt-4"
        style={{ borderTopWidth: 1, borderColor }}
      >
        <Gem size={18} color={Colors.gold[400]} />
        <Text className="text-[15px] font-bold" style={{ color: Colors.gold[400] }}>
          {gemsReward} gemas de recompensa
        </Text>
      </View>
      </View>
    </View>
  );
}
