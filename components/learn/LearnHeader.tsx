import React from 'react';
import { Text, Pressable } from 'react-native';
import { Gem } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface LearnHeaderProps {
  gems?: number;
}

export default function LearnHeader({ gems = 1240 }: LearnHeaderProps) {
  const { isDark } = useTheme();
  const router = useRouter();

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const badgeTextColor = isDark ? Colors.gold[400] : Colors.light.gold;
  const badgeBackground = isDark ? 'rgba(255,215,64,0.12)' : 'rgba(234,179,8,0.12)';

  return (
    <SafeAreaView className="flex-row items-center justify-between p-4" edges={['top']}>
      <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
        Aprender
      </Text>

      <Pressable
        onPress={() => router.push('/gems')}
        className="flex-row items-center rounded-full px-3 py-1.5"
        style={{ backgroundColor: badgeBackground }}
      >
        <Gem size={14} color={badgeTextColor} />
        <Text className="text-sm font-bold" style={{ color: badgeTextColor, marginLeft: 6 }}>
          {gems.toLocaleString()}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
