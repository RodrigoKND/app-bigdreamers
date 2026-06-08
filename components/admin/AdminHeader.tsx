import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

const AdminHeader = () => {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary    : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted;
  const iconBg      = isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight;

  return (
    <SafeAreaView
      className="flex-row items-center px-4 pb-3 gap-3"
      edges={['top']}
    >
      <ButtonBackScreen redirectTo="/profile" />

      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Shield size={17} color={isDark ? Colors.gold[400] : Colors.light.goldDark} />
      </View>

      <View className="flex-1">
        <Text className="text-[18px] font-extrabold" style={{ color: textPrimary }}>
          Panel Admin
        </Text>
        <Text className="text-[11px]" style={{ color: textMuted }}>
          BigDreamers · Administración
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AdminHeader;
