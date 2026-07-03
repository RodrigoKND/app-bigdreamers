import { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput } from 'react-native';
import { XCircle, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemRequest } from '@/constants/mockGemRequests';

interface ConfirmRejectModalProps {
  visible: boolean;
  request: GemRequest | null;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isDark: boolean;
}

const ConfirmRejectModal = ({ visible, request, onConfirm, onCancel, isDark }: ConfirmRejectModalProps) => {
  const [reason, setReason] = useState('');
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    color: textPrimary,
  };

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
            <XCircle size={44} color="#FF6B6B" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>
            ¿Rechazar solicitud?
          </Text>
          <Text style={{ marginTop: 14, fontSize: 16, fontWeight: '700', color: Colors.gold[400], textAlign: 'center' }}>
            {request ? `${request.gems} gemas de ${request.userName}` : 'Solicitud no encontrada'}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 13, color: textMuted, textAlign: 'center' }}>
            Esta acción no se puede deshacer. Puedes agregar un motivo opcional.
          </Text>

          <TextInput
            placeholder="Motivo del rechazo (opcional)"
            placeholderTextColor={textMuted}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            className="rounded-xl border px-4 py-3.5 text-[14px] mt-4"
            style={[inputStyle, { textAlignVertical: 'top', minHeight: 80 }]}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
            <Pressable
              onPress={() => { setReason(''); onCancel(); }}
              style={{ flex: 1, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: textMuted }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => { onConfirm(reason.trim() || undefined); setReason(''); }}
              style={{ flex: 1, borderRadius: 16, backgroundColor: '#FF6B6B', paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
            >
              <X size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', marginLeft: 6 }}>Rechazar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmRejectModal;
