import React from 'react';
import { View, Text } from 'react-native';
import { Gem } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

interface LearnHeaderProps {
  gems?: number;
}

export default function LearnHeader({ gems = 1240 }: LearnHeaderProps) {
  const { isDark } = useTheme();

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

  return (
    <SafeAreaView className="flex-row items-center justify-between p-4" edges={['top']}>
      <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
        Aprender
      </Text>

      <View
        className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{
          backgroundColor: isDark
            ? 'rgba(255,215,64,0.12)'
            : 'rgba(234,179,8,0.12)',
        }}
      >
        <Gem size={14} color={isDark ? Colors.gold[400] : Colors.light.gold} />
        <Text
          className="text-sm font-bold"
          style={{ color: isDark ? Colors.gold[400] : Colors.light.gold }}
        >
          {gems.toLocaleString()}
        </Text>
      </View>
    </SafeAreaView>
  );
}