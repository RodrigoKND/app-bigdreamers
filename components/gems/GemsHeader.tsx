import { View, Text, Platform } from 'react-native';
import { Gem } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

interface GemsHeaderProps {
  currentGems: number;
}

const GemsHeader = ({ currentGems }: GemsHeaderProps) => {
  const { isDark } = useTheme();
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  return (
    <View
      style={{
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: textPrimary,
        }}
      >
        Recargar Gemas
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Gem size={14} color={Colors.gold[400]} />
        <Text
          style={{
            marginLeft: 8,
            color: textMuted,
            fontSize: 14,
          }}
        >
          Saldo actual: {currentGems} gemas
        </Text>
      </View>
    </View>
  );
};

export default GemsHeader;
