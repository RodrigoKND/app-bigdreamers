import React from 'react';
import { Text, Pressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

export default function CommunityHeader() {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textSecondary = isDark ? Colors.text.secondary : Colors.light.textSecond;
  const cardBg = isDark ? 'rgba(255,255,255,0.10)' : Colors.light.card;

  return (
    <SafeAreaView className="flex-row items-center justify-between p-4" edges={['top']}>
      <ButtonBackScreen redirectTo='/profile' className='px-2'/>
      <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
        Comunidad
      </Text>
      <Pressable
        accessible
        accessibilityLabel="Buscar en comunidad"
        className="active:opacity-70 w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: cardBg }}
      >
        <Search size={18} color={textSecondary} />
      </Pressable>
    </SafeAreaView>
  );
}