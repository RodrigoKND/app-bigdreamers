import { View, Text, Pressable } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface RequestSentBannerProps {
  gems: number;
  isDark: boolean;
  onBack: () => void;
}

const RequestSentBanner = ({ gems, isDark, onBack }: RequestSentBannerProps) => {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Clock size={56} color={Colors.gold[400]} />
      <Text style={{ fontSize: 24, fontWeight: '800', color: isDark ? Colors.text.primary : Colors.light.textPrimary, marginTop: 20, textAlign: 'center' }}>
        Solicitud enviada
      </Text>
      <Text style={{ color: textMuted, textAlign: 'center', marginTop: 12, lineHeight: 20 }}>
        Tu solicitud de {gems} gemas está en revisión. El administrador la aprobará en menos de 24h.
      </Text>
      <Pressable
        onPress={onBack}
        style={{ marginTop: 24, backgroundColor: Colors.gold[400], borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 }}
      >
        <Text style={{ color: '#000', fontWeight: '800' }}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
};

export default RequestSentBanner;
