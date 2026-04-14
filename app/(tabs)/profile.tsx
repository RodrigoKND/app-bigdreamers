import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
    </TouchableOpacity>
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProfileHeader user={user} />
        <ProfileStatCard
          title="Estadísticas de participación"
          stats={[
            { label: 'Racha actual', value: `${user.streak} días`, accent: Colors.warning },
            { label: 'Ranking comunidad', value: `#${user.communityRank}`, accent: Colors.gold[500] },
            { label: 'Módulos completados', value: user.completedModules, accent: Colors.success },
            { label: 'Total gemas', value: user.totalGemsEarned.toLocaleString(), accent: Colors.gold[400] },
          ]}
        />
        <View style={styles.menu}>
          <Text style={styles.menuSection}>Configuración</Text>
          <MenuItem icon={<Bell size={18} color={Colors.text.secondary} />} label="Notificaciones" />
          <MenuItem icon={<Shield size={18} color={Colors.text.secondary} />} label="Privacidad y seguridad" />
          <MenuItem icon={<Settings size={18} color={Colors.text.secondary} />} label="Ajustes de cuenta" />
          <View style={styles.separator} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy[900] },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.navy[900] },
  content: { paddingBottom: 40 },
  menu: { marginHorizontal: 16, backgroundColor: Colors.blue.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  menuSection: { color: Colors.text.muted, fontFamily: 'Inter-SemiBold', fontSize: 12, padding: 16, paddingBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  menuLabel: { color: Colors.text.secondary, fontFamily: 'Inter-Regular', fontSize: 15, flex: 1 },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16, marginVertical: 4 },
});
