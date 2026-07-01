import React from 'react';
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

const GemRequestCard = React.memo(({ request, onApprove, onReject, isDark }: GemRequestCardProps) => {
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return { bg: 'rgba(255,193,7,0.15)',  color: '#FFC107', icon: Clock,        text: 'PENDIENTE' };
      case 'approved':
        return { bg: 'rgba(74,222,128,0.15)', color: '#4ADE80', icon: CheckCircle,  text: 'APROBADO'  };
      case 'rejected':
        return { bg: 'rgba(255,107,107,0.15)',color: '#FF6B6B', icon: XCircle,      text: 'RECHAZADO' };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon  = statusBadge.icon;

  return (
    <View
      className="border rounded-2xl p-4 mb-3"
      style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
        borderColor:     isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
      }}
    >
      {/* Encabezado: nombre + fecha */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold" style={{ color: textPrimary }}>{request.userName}</Text>
        <Text className="text-xs"   style={{ color: textMuted }}>{request.date}</Text>
      </View>

      {/* Gemas + precio */}
      <View className="flex-row items-center mb-3">
        <Gem size={16} color={Colors.gold[400]} />
        <Text className="ml-2 text-base font-bold" style={{ color: Colors.gold[400] }}>
          {request.gems} gemas
        </Text>
        <Text className="ml-2" style={{ color: textMuted }}>·</Text>
        <Text className="ml-2" style={{ color: textMuted }}>{request.bsPrice} Bs</Text>
      </View>

      {/* Estado + botones */}
      <View className="gap-[10px]">
        <View className="flex-row items-center">
          <View
            className="flex-row items-center px-2 py-1 rounded-xl"
            style={{ backgroundColor: statusBadge.bg }}
          >
            <StatusIcon size={12} color={statusBadge.color} />
            <Text
              className="ml-1 text-[10px] font-extrabold"
              style={{ color: statusBadge.color }}
            >
              {statusBadge.text}
            </Text>
          </View>
        </View>

        {request.status === 'pending' && (
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => onReject(request.id)}
              className="flex-1 flex-row items-center justify-center px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,107,107,0.15)' }}
            >
              <X size={14} color="#FF6B6B" />
              <Text className="ml-1.5 font-bold" style={{ color: '#FF6B6B' }}>Rechazar</Text>
            </Pressable>
            <Pressable
              onPress={() => onApprove(request.id)}
              className="flex-1 flex-row items-center justify-center px-3 py-2 rounded-lg"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Check size={14} color="#000" />
              <Text className="ml-1.5 font-bold" style={{ color: '#000' }}>Aprobar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
});

export default GemRequestCard;
