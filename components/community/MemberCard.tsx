import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { CommunityMember } from '@/types';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
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

const MemberCard = React.memo(function MemberCard({ member, isCurrentUser = false }: MemberCardProps) {
  const { isDark } = useTheme();
  const rankColor = RANK_COLORS[member.rank] ?? (isDark ? Colors.text.muted : Colors.light.textMuted);

  const containerStyle = isCurrentUser
    ? { borderColor: 'rgba(245,194,0,0.4)', backgroundColor: 'rgba(245,194,0,0.06)' }
    : { borderColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.border, backgroundColor: isDark ? Colors.blue.card : Colors.light.card };

  return (
    <View 
      className="flex-row items-center gap-3 p-[14px] mb-2 rounded-[14px] border"
      style={containerStyle}
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
          <Text className="font-semibold text-sm" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
            {member.name}
          </Text>
          
          {isCurrentUser && (
            <View className="px-1.5 py-0.5 rounded-md" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.accent }}>
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
          <Flame size={12} color={isDark ? Colors.warning : Colors.light.warning} />
          <Text className="font-normal text-[11px]" style={{ color: isDark ? Colors.warning : Colors.light.warning }}>
            {member.streak}d
          </Text>
        </View>
      </View>
    </View>
  );
});

export default MemberCard;
