import { View, Text, Platform } from 'react-native';
import { Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface AdminHeaderProps {
  isDark: boolean;
}

const AdminHeader = ({ isDark }: AdminHeaderProps) => {
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Shield size={22} color={Colors.gold[400]} />
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: textPrimary,
            marginLeft: 8,
          }}
        >
          Panel Admin
        </Text>
      </View>
      <Text
        style={{
          color: textMuted,
          fontSize: 13,
          marginTop: 4,
        }}
      >
        Administración de BigDreamers
      </Text>
    </View>
  );
};

export default AdminHeader;