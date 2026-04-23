import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Shield, Edit2, Sun, Moon } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getCurrentUser } from '@/services/userService';
import { useTheme } from '@/context/ThemeContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStatCard from '@/components/profile/ProfileStatCard';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  isDark: boolean;
}

function MenuItem({ icon, label, onPress, danger, isDark }: MenuItemProps) {
  return (
    <Pressable
      className="flex-row items-center gap-[14px] px-4 py-[14px] active:opacity-70"
      style={{ borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {icon}
      <Text
        className="font-sans text-[15px] flex-1"
        style={{ color: danger ? Colors.light.error : isDark ? Colors.text.secondary : Colors.light.textSecond }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading || !user) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? Colors.navy[900] : Colors.light.bg }}
      >
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  const cardBg    = isDark ? Colors.blue.card    : Colors.light.card;
  const cardBorder= isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const labelColor= isDark ? Colors.text.muted   : Colors.light.textMuted;
  const iconColor = isDark ? Colors.text.secondary : Colors.light.textSecond;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Colors.navy[900] : Colors.light.bg }}
      edges={['top']}
    >
      {/* Header con título, toggle tema y editar */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ backgroundColor: isDark ? Colors.navy[900] : Colors.light.bg }}
      >
        <Text
          className="font-bold text-[22px]"
          style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
        >
          Perfil
        </Text>

        <View className="flex-row items-center gap-2">
          {/* Toggle Sol / Luna */}
          <Pressable
            onPress={toggleTheme}
            className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
            style={{ backgroundColor: isDark ? Colors.navy[700] : Colors.light.surface }}
            accessible={true}
            accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            accessibilityRole="button"
          >
            {isDark
              ? <Sun size={18} color={Colors.gold[400]} />
              : <Moon size={18} color={Colors.light.accent} />
            }
          </Pressable>

          {/* Editar perfil */}
          <Pressable
            className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
            style={{ backgroundColor: isDark ? Colors.navy[700] : Colors.light.surface }}
            accessible={true}
            accessibilityLabel="Editar perfil"
            accessibilityRole="button"
          >
            <Edit2 size={18} color={isDark ? Colors.text.secondary : Colors.light.accent} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <ProfileHeader user={user} isDark={isDark} />

        <ProfileStatCard
          title="Estadísticas"
          className="mt-4"
          isDark={isDark}
          stats={[
            { label: 'Racha actual',       value: `${user.streak} días`,              accent: Colors.warning },
            { label: 'Ranking comunidad',  value: `#${user.communityRank}`,           accent: Colors.gold[500] },
            { label: 'Módulos completados',value: user.completedModules,              accent: Colors.success },
            { label: 'Total gemas',        value: user.totalGemsEarned.toLocaleString(), accent: Colors.gold[400] },
          ]}
        />

        {/* MI CUENTA */}
        <Text
          className="font-semibold text-xs px-4 pt-4 pb-2 tracking-widest"
          style={{ color: labelColor }}
        >
          MI CUENTA
        </Text>
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          <MenuItem
            isDark={isDark}
            icon={<Shield size={18} color={iconColor} />}
            label="Seguridad"
          />
          <MenuItem
            isDark={isDark}
            icon={<Edit2 size={18} color={iconColor} />}
            label="Información personal"
          />
        </View>

        {/* CERRAR SESIÓN */}
        <View
          className="mx-4 mt-3 rounded-2xl overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.08)' : Colors.light.errorBg, borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(220,38,38,0.15)' }}
        >
          <MenuItem
            isDark={isDark}
            icon={<LogOut size={18} color={Colors.light.error} />}
            label="Cerrar sesión"
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}