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

  const bg         = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg     = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted  = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const divider    = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;
  const iconBg     = isDark ? 'rgba(255,215,64,0.12)' : Colors.light.accentLight;
  const iconColor  = isDark ? Colors.gold[400] : Colors.light.accent;

  const levelConfig = user ? getLevelConfig(user.level) : null;

  const rows = user
    ? [
        { label: 'Nombre',             value: user.name,                        Icon: User     },
        { label: 'Email',              value: user.email,                       Icon: Mail     },
        { label: 'Nivel',              value: levelConfig?.label ?? user.level, Icon: Zap      },
        { label: 'Gemas',              value: user.gems.toLocaleString(),       Icon: Gem      },
        { label: 'Módulos completados', value: String(user.completedModules),   Icon: BookOpen },
        { label: 'Racha',              value: `${user.streak} días`,            Icon: Flame    },
      ]
    : [];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>

      {/* Header */}
      <View className="flex-row items-center px-4 pt-5 pb-3 gap-3">
        <Pressable
          onPress={() => router.back()}
          accessible
          accessibilityLabel="Volver"
          accessibilityRole="button"
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface }}
        >
          <ArrowLeft size={18} color={iconColor} />
        </Pressable>
        <Text className="text-[22px] font-bold" style={{ color: textPrimary }}>
          Información personal
        </Text>
      </View>

      {/* Loading */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View
            className="rounded-[20px] border overflow-hidden mt-2"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {rows.map(({ label, value, Icon }, index) => (
              <View key={label}>
                {index > 0 && (
                  <View className="h-px mx-4" style={{ backgroundColor: divider }} />
                )}
                <View className="flex-row items-center px-4 py-4 gap-3">
                  <View
                    className="w-9 h-9 rounded-[10px] items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    <Icon size={16} color={iconColor} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-[11px] font-semibold uppercase mb-0.5"
                      style={{ color: textMuted, letterSpacing: 0.5 }}
                    >
                      {label}
                    </Text>
                    <Text
                      className="text-[15px] font-medium"
                      style={{ color: textPrimary }}
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
