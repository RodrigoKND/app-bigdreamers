import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

const AdminHeader = () => {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <SafeAreaView edges={['top']}>
      <View className="flex-row items-center justify-between p-4">
        <ButtonBackScreen redirectTo='/profile' className='px-2'/>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
            Panel Admin
          </Text>
          <Text className="text-sm" style={{ color: textMuted, marginTop: 2 }}>
            Administración de BigDreamers
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
};

export default AdminHeader;