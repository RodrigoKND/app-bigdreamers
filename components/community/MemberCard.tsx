import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { CommunityMember } from '@/types';
import { Colors } from '@/constants/colors';
import Avatar from '@/components/shared/Avatar';
import LevelBadge from '@/components/shared/LevelBadge';
import GemBadge from '@/components/shared/GemBadge';

interface MemberCardProps {
  member: CommunityMember;
  isCurrentUser?: boolean;
}

const RANK_COLORS: Record<number, string> = {
  1: Colors.gold[500],
  2: Colors.levels.silver,
  3: Colors.levels.bronze,
};

export default function MemberCard({ member, isCurrentUser = false }: MemberCardProps) {
  const rankColor = RANK_COLORS[member.rank] ?? Colors.text.muted;

  // Lógica de clases condicionales para el usuario actual
  // Usamos valores arbitrarios de Tailwind para igualar tus rgba originales
  const containerClass = isCurrentUser
    ? 'border-[#F5C200]/40 bg-[#F5C200]/[0.06]' 
    : 'border-white/5 bg-blue-card';

  return (
    <View 
      className={`flex-row items-center gap-3 p-[14px] mb-2 rounded-[14px] border ${containerClass}`}
      accessible={true}
      accessibilityLabel={`Rango ${member.rank}, Miembro ${member.name}, Nivel ${member.level}`}
    >
      <Text 
        className="font-bold text-base w-7" 
        style={{ color: rankColor }}
      >
        #{member.rank}
      </Text>

      <Avatar 
        uri={member.avatar} 
        name={member.name} 
        size={44} 
      />

      <View className="flex-1 gap-[5px]">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-semibold text-sm">
            {member.name}
          </Text>
          
          {/* Mejora de compatibilidad iOS/Android: Badge en un View */}
          {isCurrentUser && (
            <View className="bg-blue-primary px-1.5 py-0.5 rounded-md">
              <Text className="text-white text-[10px] font-bold">
                Tú
              </Text>
            </View>
          )}
        </View>
        <LevelBadge level={member.level} size="sm" />
      </View>

      <View className="items-end gap-1.5">
        <GemBadge count={member.gems} size="sm" />
        <View className="flex-row items-center gap-[3px]">
          <Flame size={12} color={Colors.warning} />
          <Text className="text-warning font-normal text-[11px]">
            {member.streak}d
          </Text>
        </View>
      </View>
    </View>
  );
}

// no heredamos aveces los cards ya creados debido a cambios muy drastivos como el isCurrentUser, entonces usamos un <view>





