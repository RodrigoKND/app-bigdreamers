import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { Gem } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface LearnHeaderProps {
  gems?: number;
}

export default function LearnHeader({ gems = 0 }: LearnHeaderProps) {
  const { isDark } = useTheme();
  const router = useRouter();

  const textPrimary     = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const badgeTextColor  = isDark ? Colors.gold[400]    : Colors.light.gold;
  const badgeBackground = isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight;

  return (
    <SafeAreaView
      className="flex-row items-center justify-between px-5 pb-3"
      edges={['top']}
    >
      <View>
        <Text className="text-[22px] font-extrabold" style={{ color: textPrimary }}>
          Aprender
        </Text>
        <Text className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : Colors.light.textMuted }}>
          Continúa tu progreso
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/gems')}
        className="flex-row items-center gap-1.5 rounded-xl px-3 py-2"
        style={{ backgroundColor: badgeBackground }}
      >
        <Gem size={14} color={badgeTextColor} />
        <Text className="text-sm font-bold" style={{ color: badgeTextColor }}>
          {gems.toLocaleString()}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
