import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import ImagePickerField from '@/components/shared/ImagePickerField';

interface PaymentInstructionsProps {
  isDark: boolean;
  imageUri: string | null;
  onPickImage: () => void;
}

const PaymentInstructions = ({ isDark, imageUri, onPickImage }: PaymentInstructionsProps) => {
  const cardStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  };

  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

  return (
    <View style={{ marginBottom: 16, gap: 12 }}>
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Info size={16} color={Colors.gold[400]} />
          <Text style={{ fontWeight: '700', color: Colors.text.primary, marginLeft: 8 }}>¿Cómo pagar?</Text>
        </View>
        <Text style={{ color: textMuted, marginBottom: 10 }}>
          <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>1.</Text> Selecciona tu paquete de gemas
        </Text>
        <Text style={{ color: textMuted, marginBottom: 10 }}>
          <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>2.</Text> Realiza el pago al número de cuenta:{' '}
          <Text style={{ fontWeight: '800', color: textPrimary }}>1234-5678-9012</Text> (Banco Unión)
        </Text>
        <Text style={{ color: textMuted, marginBottom: 10 }}>
          <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>3.</Text> Toma una foto del comprobante
        </Text>
        <Text style={{ color: textMuted }}>
          <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>4.</Text> Envía tu solicitud — el admin la revisará en menos de 24h
        </Text>
      </View>

      <ImagePickerField
        isDark={isDark}
        imageUri={imageUri}
        onPick={onPickImage}
        variant="receipt"
      />
    </View>
  );
};

export default PaymentInstructions;