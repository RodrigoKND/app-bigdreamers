import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, Bell, Shield } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getCurrentUser } from '@/services/userService';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStatCard from '@/components/profile/ProfileStatCard';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, danger }: MenuItemProps) {
  return (
    <Pressable
      className="flex-row items-center gap-[14px] px-4 py-[14px] border-t border-white/[0.04] active:opacity-70"
      onPress={onPress}
    >
      {icon}
      <Text
        className="font-sans text-[15px] flex-1 text-text-secondary"
        style={danger ? { color: Colors.error } : undefined}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-navy-900" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <ProfileHeader user={user} />
        <ProfileStatCard
          title="Estadísticas de partición"
          className="mt-4"
          stats={[
            { label: 'Racha actual', value: `${user.streak} días`, accent: Colors.warning },
            { label: 'Ranking comunidad', value: `#${user.communityRank}`, accent: Colors.gold[500] },
            { label: 'Módulos completados', value: user.completedModules, accent: Colors.success },
            { label: 'Total gemas', value: user.totalGemsEarned.toLocaleString(), accent: Colors.gold[400] },
          ]}
        />

        <View className="mx-4 bg-blue-card rounded-2xl overflow-hidden border border-white/[0.06]">
          <Text className="text-text-muted font-semibold text-xs px-4 pt-4 pb-2">
            Configuración
          </Text>

          <MenuItem icon={<Bell size={18} color={Colors.text.secondary} />} label="Notificaciones" />
          <MenuItem icon={<Shield size={18} color={Colors.text.secondary} />} label="Privacidad y seguridad" />
          <MenuItem icon={<Settings size={18} color={Colors.text.secondary} />} label="Ajustes de cuenta" />

          <View className="h-px bg-white/[0.08] mx-4 my-1" />

          <MenuItem
            icon={<LogOut size={18} color={Colors.error} />}
            label="Cerrar sesión"
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}