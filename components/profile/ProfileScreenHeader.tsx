import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Edit2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

interface ProfileScreenHeaderProps {
  onEdit?: () => void;
}

export default function ProfileScreenHeader({ onEdit }: ProfileScreenHeaderProps) {
  const { isDark } = useTheme();
  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const iconColor = isDark ? Colors.gold[400] : Colors.light.accent;

  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 12,
        paddingHorizontal: 16,
      }}
      className="flex-row items-center justify-between"
    >
      <Text className="font-bold text-[24px]" style={{ color: textPrimary }}>
        Perfil
      </Text>
      <Pressable
        className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : Colors.light.surface }}
        accessible
        accessibilityLabel="Editar perfil"
        accessibilityRole="button"
        onPress={onEdit}
      >
        <Edit2 size={17} color={iconColor} />
      </Pressable>
    </View>
  );
}