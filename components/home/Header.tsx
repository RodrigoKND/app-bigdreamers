import React from 'react';
import { View, Text, Image, Pressable } from "react-native";
import { Gem, Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { IMAGES } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadNotificationCount } from "@/hooks/notification/useUnreadNotificationCount";

export default function Header({ points }: { points: number }) {
  const { isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { count: unreadCount } = useUnreadNotificationCount(user?.id);
  const dotColor = isDark ? Colors.gold[400] : Colors.light.accent;

  return (
    <View className="flex-row justify-between items-center px-5 py-4">
      <View className="flex-row items-center gap-2.5">
        <View
          className="w-8 h-8 rounded-xl items-center justify-center"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }}
        >
          <Image source={IMAGES.LOGO_BIGDREAMERS} style={{ width: 20, height: 20 }} resizeMode="contain" />
        </View>
        <Text
          className="text-[16px] font-bold tracking-tight"
          style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
        >
          BigDreamers
        </Text>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: dotColor }} />
      </View>

      <View className="flex-row items-center gap-2">
        <View
          className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight }}
        >
          <Gem size={13} color={isDark ? Colors.gold[400] : Colors.light.gold} />
          <Text
            className="font-bold text-sm"
            style={{ color: isDark ? Colors.gold[400] : Colors.light.goldDark }}
          >
            {points.toLocaleString()}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/notifications')}
          className="w-9 h-9 rounded-xl items-center justify-center active:opacity-70"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }}
        >
          <Bell size={16} color={isDark ? Colors.text.primary : Colors.light.textPrimary} />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute', top: 5, right: 5,
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: '#EF4444',
              }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
