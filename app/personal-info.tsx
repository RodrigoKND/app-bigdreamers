import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Mail,
  Zap,
  Gem,
  BookOpen,
  Flame,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();
  const { user, loading } = useCurrentUser(authUser?.id ?? null);

  const bg          = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder  = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const divider     = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;
  const iconBg      = isDark ? 'rgba(255,215,64,0.12)' : Colors.light.accentLight;
  const iconColor   = isDark ? Colors.gold[400] : Colors.light.accent;

  const levelConfig = user ? getLevelConfig(user.level) : null;

  const rows = user
    ? [
        { label: 'Nombre',               value: user.name,                          Icon: User     },
        { label: 'Email',                 value: user.email,                         Icon: Mail     },
        { label: 'Nivel',                 value: levelConfig?.label ?? user.level,   Icon: Zap      },
        { label: 'Gemas',                 value: user.gems.toLocaleString(),         Icon: Gem      },
        { label: 'Módulos completados',   value: String(user.completedModules),      Icon: BookOpen },
        { label: 'Racha',                 value: `${user.streak} días`,              Icon: Flame    },
      ]
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessible
          accessibilityLabel="Volver"
          accessibilityRole="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={18} color={iconColor} />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: '700', color: textPrimary }}>
          Información personal
        </Text>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cardBorder,
              overflow: 'hidden',
              marginTop: 8,
            }}
          >
            {rows.map(({ label, value, Icon }, index) => (
              <View key={label}>
                {index > 0 && (
                  <View
                    style={{ height: 1, backgroundColor: divider, marginHorizontal: 16 }}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: iconBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} color={iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: textMuted,
                        letterSpacing: 0.5,
                        marginBottom: 2,
                      }}
                    >
                      {label.toUpperCase()}
                    </Text>
                    <Text
                      style={{ fontSize: 15, fontWeight: '500', color: textPrimary }}
                      numberOfLines={1}
                    >
                      {value}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
