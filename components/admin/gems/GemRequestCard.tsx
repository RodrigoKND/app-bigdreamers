import { View, Text, Pressable } from 'react-native';
import { Gem, Clock, CheckCircle, XCircle, Check, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemRequest } from '@/constants/mockGemRequests';

interface GemRequestCardProps {
  request: GemRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isDark: boolean;
}

const GemRequestCard = ({ request, onApprove, onReject, isDark }: GemRequestCardProps) => {
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return {
          bg: 'rgba(255,193,7,0.15)',
          color: '#FFC107',
          icon: Clock,
          text: 'PENDIENTE',
        };
      case 'approved':
        return {
          bg: 'rgba(74,222,128,0.15)',
          color: '#4ADE80',
          icon: CheckCircle,
          text: 'APROBADO',
        };
      case 'rejected':
        return {
          bg: 'rgba(255,107,107,0.15)',
          color: '#FF6B6B',
          icon: XCircle,
          text: 'RECHAZADO',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <View
      style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontWeight: '700', color: textPrimary }}>{request.userName}</Text>
        <Text style={{ color: textMuted, fontSize: 12 }}>{request.date}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Gem size={16} color={Colors.gold[400]} />
        <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: Colors.gold[400] }}>
          {request.gems} gemas
        </Text>
        <Text style={{ marginLeft: 8, color: textMuted }}>·</Text>
        <Text style={{ marginLeft: 8, color: textMuted }}>{request.bsPrice} Bs</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: statusBadge.bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <StatusIcon size={12} color={statusBadge.color} />
          <Text style={{ marginLeft: 4, fontSize: 10, fontWeight: '800', color: statusBadge.color }}>
            {statusBadge.text}
          </Text>
        </View>

        {request.status === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => onReject(request.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,107,107,0.15)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <X size={14} color="#FF6B6B" />
              <Text style={{ marginLeft: 6, color: '#FF6B6B', fontWeight: '700' }}>Rechazar</Text>
            </Pressable>
            <Pressable
              onPress={() => onApprove(request.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.gold[400],
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Check size={14} color="#000" />
              <Text style={{ marginLeft: 6, color: '#000', fontWeight: '700' }}>Aprobar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default GemRequestCard;