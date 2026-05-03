import { Modal, View, Text, Pressable } from 'react-native';
import { Gem } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemPackage } from '@/constants/gemPackages';

interface ConfirmRequestModalProps {
  visible: boolean;
  selectedPackage: GemPackage | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

const ConfirmRequestModal = ({
  visible,
  selectedPackage,
  onConfirm,
  onCancel,
  isDark,
}: ConfirmRequestModalProps) => {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View
          style={{
            backgroundColor: isDark ? Colors.navy?.[700] ?? '#1E3A5F' : '#fff',
            borderRadius: 24,
            padding: 28,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Gem size={40} color={Colors.gold[400]} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>
            ¿Confirmar solicitud?
          </Text>
          <Text style={{ marginTop: 14, fontSize: 16, fontWeight: '700', color: Colors.gold[400], textAlign: 'center' }}>
            {selectedPackage ? `${selectedPackage.gems} gemas por ${selectedPackage.bsPrice} Bs` : 'Paquete no seleccionado'}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 13, color: textMuted, textAlign: 'center' }}>
            Tu solicitud quedará pendiente hasta que el administrador verifique tu pago.
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, alignItems: 'center', marginRight: 8 }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.65)' }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={{ flex: 1, borderRadius: 16, backgroundColor: Colors.gold[400], paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#000', fontWeight: '800' }}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmRequestModal;
