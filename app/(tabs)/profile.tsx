import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView,
  Pressable, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Shield, Edit2, Sun, Moon, ChevronRight, User } from 'lucide-react-native';
import { User as UserType } from '@/types';
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
  showChevron?: boolean;
}

function MenuItem({ icon, label, onPress, danger, isDark, showChevron = true }: MenuItemProps) {
  const textColor = danger
    ? '#FF6B6B'
    : isDark ? '#FFFFFF' : Colors.light.textPrimary;

  const iconBg = danger
    ? 'rgba(255,107,107,0.15)'
    : isDark ? 'rgba(249, 244, 102, 0.17)' : Colors.light.accentLight;

  const iconAccent = danger
    ? '#FF6B6B'
    : isDark ? '#FFFFFF' : Colors.light.accent;

  return (
    <Pressable
      className="flex-row items-center gap-3 px-4 py-[14px] active:opacity-70"
      onPress={onPress}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        {/* Clonar el ícono con el color correcto */}
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, { color: iconAccent })
          : icon}
      </View>
      <Text
        className="font-sans text-[15px] flex-1"
        style={{ color: textColor }}
      >
        {label}
      </Text>
      {showChevron && !danger && (
        <ChevronRight
          size={16}
          color={isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted}
        />
      )}
    </Pressable>
  );
}

function SectionLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <Text
      className="font-semibold text-xs px-4 pt-5 pb-2 tracking-widest"
      style={{ color: isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted }}
    >
      {label}
    </Text>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserType | null>(null);
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
        style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      >
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  // Dark: fondo azul #1565C0, cards azul oscuro navy
  const screenBg = isDark ? Colors.blue.primary : Colors.light.bg;  
  const cardBg     = isDark ? 'rgba(255,255,255,0.07)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,215,64,0.15)'  : 'rgba(0,0,0,0.06)';
  const divider    = isDark ? 'rgba(0,0,0,0.10)'        : 'rgba(0,0,0,0.05)';
  const iconColor  = isDark ? Colors.gold[400]          : Colors.light.accent;
  const iconBgDark = 'rgba(240, 193, 23, 0.12)'; // destello amarillo suave


  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: screenBg }} edges={['top']}>

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pt-2 pb-1"
        style={{ backgroundColor: screenBg }}
      >
        <Text
          className="font-bold text-[24px]"
          style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
        >
          Perfil
        </Text>

        <Pressable
          className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : Colors.light.surface }}
          accessible={true}
          accessibilityLabel="Editar perfil"
          accessibilityRole="button"
        >
          <Edit2 size={17} color={iconColor} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        {/* Separador */}
        <View
          style={{
            height: 1,
            marginTop: 15,
            backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)',
          }}
        />

        {/* Avatar + nombre + badge */}
        <ProfileHeader user={user} isDark={isDark} />

        {/* Stats */}
        <ProfileStatCard
          isDark={isDark}
          className="mt-2"
          onRechargeGems={() => console.log('Recargar gemas')}
          stats={[
            { label: 'GEMAS',   value: user.gems.toLocaleString(), accent: Colors.gold[500], icon: '💎' },
            { label: 'MÓDULOS', value: user.completedModules,      accent: isDark ? '#FFFFFF' : Colors.light.textPrimary, icon: '📚' },
            { label: 'RACHA',   value: user.streak,                accent: Colors.warning,   icon: '🔥' },
          ]}
        />

        {/* MI CUENTA */}
        <SectionLabel label="MI CUENTA" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          <MenuItem
            isDark={isDark}
            icon={<User size={16} color={iconColor} />}
            label="Información personal"
          />
          <View style={{ height: 1, backgroundColor: divider, marginHorizontal: 16 }} />
          <MenuItem
            isDark={isDark}
            icon={<Shield size={16} color={iconColor} />}
            label="Seguridad"
          />
        </View>

        {/* PREFERENCIAS */}
        <SectionLabel label="PREFERENCIAS" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          <Pressable
            className="flex-row items-center gap-3 px-4 py-[14px] active:opacity-70"
            onPress={toggleTheme}
            accessible={true}
            accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            accessibilityRole="button"
          >
            <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.accentLight }}
              >
                {isDark
                  ? <Sun size={16} color={Colors.gold[400]} />
                  : <Moon size={16} color={Colors.light.accent} />
                }
            </View>
            <Text
              className="font-sans text-[15px] flex-1"
              style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
            >
              Tema
            </Text>
            <Text
              className="text-[13px]"
              style={{ color: isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted }}
            >
              {isDark ? 'Oscuro' : 'Claro'}
            </Text>
          </Pressable>
        </View>

        {/* CERRAR SESIÓN */}
        <View className="mx-4 mt-3 mb-2">
          <Pressable
            className="flex-row items-center gap-3 px-4 py-[15px] rounded-2xl active:opacity-70"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.errorBg,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,107,107,0.20)' : 'rgba(220,38,38,0.12)',
            }}
            accessible={true}
            accessibilityLabel="Cerrar sesión"
            accessibilityRole="button"
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: isDark ? 'rgba(255,107,107,0.12)' : 'rgba(220,38,38,0.1)' }}
            >
              <LogOut size={16} color='#FF6B6B' />
            </View>
            <Text
              className="font-semibold text-[15px] flex-1"
              style={{ color: '#FF6B6B' }}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}