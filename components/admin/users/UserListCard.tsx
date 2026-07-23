import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Gem, ShieldCheck, UserRound } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { User } from '@/types';

interface UserListCardProps {
  user: User;
  onAssignGems: (user: User) => void;
  isDark: boolean;
}

const UserListCard = React.memo(function UserListCard({ user, onAssignGems, isDark }: UserListCardProps) {
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <View
      className="border rounded-2xl p-4 mb-3"
      style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
        borderColor:     isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
      }}
    >
      <View className="flex-row items-center mb-3">
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        ) : (
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.card }}
          >
            <UserRound size={18} color={textMuted} />
          </View>
        )}

        <View className="flex-1 ml-3">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-bold" style={{ color: textPrimary }} numberOfLines={1}>
              {user.name}
            </Text>
            {user.role === 'admin' && <ShieldCheck size={14} color={Colors.gold[400]} />}
          </View>
          <Text className="text-xs" style={{ color: textMuted }} numberOfLines={1}>
            {user.email}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Gem size={14} color={Colors.gold[400]} />
          <Text className="ml-1 text-sm font-bold" style={{ color: Colors.gold[400] }}>
            {user.gems.toLocaleString()}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onAssignGems(user)}
        className="flex-row items-center justify-center px-3 py-2.5 rounded-lg"
        style={{ backgroundColor: Colors.gold[400] }}
      >
        <Gem size={14} color="#000" />
        <Text className="ml-1.5 font-bold" style={{ color: '#000' }}>Asignar gemas</Text>
      </Pressable>
    </View>
  );
});

export default UserListCard;
