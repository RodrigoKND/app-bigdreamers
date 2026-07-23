import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Linking, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Gem, FileText, CheckCheck } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useUserNotifications } from '@/hooks/notification/useUserNotifications';
import { AppNotification, markAllRead, markNotificationRead } from '@/services/supabase/notificationDbService';
import { invalidateCache, CacheKeys } from '@/services/cache/cacheService';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString('es-BO');
}

const NotificationsScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { notifications, loading, refetch } = useUserNotifications(user?.id);
  const [refreshing, setRefreshing] = React.useState(false);

  const bg          = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const textPrimary = isDark ? Colors.text.primary      : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)'  : Colors.light.textMuted;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const handlePress = async (n: AppNotification) => {
    if (!n.read) {
      try {
        await markNotificationRead(n.id);
        if (user?.id) await invalidateCache(CacheKeys.userNotifications(user.id));
        refetch();
      } catch { /* no bloquea la navegación */ }
    }
    if (n.data?.pdfUrl) {
      Linking.openURL(n.data.pdfUrl);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllRead(user.id);
      await invalidateCache(CacheKeys.userNotifications(user.id));
      refetch();
    } catch { /* silencioso */ }
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <View className="flex-row items-center justify-between px-2 pb-2">
        <ButtonBackScreen />
        <Text className="text-[17px] font-bold tracking-tight" style={{ color: textPrimary }}>
          Notificaciones
        </Text>
        <Pressable onPress={handleMarkAllRead} hitSlop={10} className="px-3 py-2" disabled={!hasUnread}>
          <CheckCheck size={20} color={hasUnread ? (isDark ? Colors.gold[400] : Colors.light.accent) : textMuted} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? Colors.gold[400] : Colors.light.accent}
            colors={[isDark ? Colors.gold[400] : Colors.light.accent]}
          />
        }
      >
        {loading ? (
          <View className="items-center justify-center py-16">
            <Text style={{ color: textMuted }}>Cargando notificaciones...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View className="items-center justify-center py-16 rounded-2xl" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
            <Bell size={40} color={textMuted} />
            <Text className="text-[15px] font-semibold text-center mt-3" style={{ color: textMuted }}>
              No tienes notificaciones todavía
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {notifications.map((n) => {
              const Icon = n.type === 'gems_assigned' ? Gem : n.type === 'report_generated' ? FileText : Bell;
              return (
                <Pressable
                  key={n.id}
                  onPress={() => handlePress(n)}
                  className="flex-row rounded-2xl p-4"
                  style={{
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: n.read ? borderColor : Colors.gold[400],
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight }}
                  >
                    <Icon size={18} color={Colors.gold[500]} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-bold flex-1 mr-2" style={{ color: textPrimary }} numberOfLines={1}>
                        {n.title}
                      </Text>
                      {!n.read && (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold[400] }} />
                      )}
                    </View>
                    <Text className="text-[13px] mt-1" style={{ color: textMuted }}>
                      {n.body}
                    </Text>
                    <Text className="text-[11px] mt-1.5" style={{ color: textMuted }}>
                      {relativeTime(n.createdAt)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
