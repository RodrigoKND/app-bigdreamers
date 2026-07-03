import React from 'react';
import { TextInput, View, Pressable } from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function SearchBar({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  const { isDark } = useTheme();

  const bgColor       = isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF';
  const borderColor   = isDark ? 'rgba(255,255,255,0.12)' : Colors.light.border;
  const textColor     = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const placeholderColor = isDark ? 'rgba(255,255,255,0.35)' : Colors.light.textMuted;
  const iconColor     = isDark ? 'rgba(255,255,255,0.3)' : Colors.light.textMuted;

  return (
    <View
      className="flex-row items-center mb-6"
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
      }}
    >
      <Search size={18} color={iconColor} style={{ marginRight: 10 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar empresas..."
        placeholderTextColor={placeholderColor}
        className="flex-1 text-base"
        style={{ color: textColor, fontFamily: 'Inter-Regular' }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} className="ml-2 active:opacity-60">
          <XCircle size={18} color={iconColor} />
        </Pressable>
      )}
    </View>
  );
}
