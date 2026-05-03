import { Modal, View, Text, Pressable } from 'react-native';
import { CheckCircle, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemRequest } from '@/constants/mockGemRequests';

interface ConfirmApproveModalProps {
  visible: boolean;
  request: GemRequest | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

const ConfirmApproveModal = ({ visible, request, onConfirm, onCancel, isDark }: ConfirmApproveModalProps) => {
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
            <CheckCircle size={44} color="#4ADE80" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>
            ¿Aprobar solicitud?
          </Text>
          <Text style={{ marginTop: 14, fontSize: 16, fontWeight: '700', color: Colors.gold[400], textAlign: 'center' }}>
            {request ? `${request.gems} gemas para ${request.userName}` : 'Solicitud no encontrada'}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 13, color: textMuted, textAlign: 'center' }}>
            Estás a punto de aprobar {request?.gems} gemas para {request?.userName}. Esta acción no se puede deshacer.
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: textMuted }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={{ flex: 1, borderRadius: 16, backgroundColor: '#4ADE80', paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
            >
              <Check size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', marginLeft: 6 }}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmApproveModal;