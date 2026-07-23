import { useCachedQuery } from '@/hooks/useCachedQuery';
import { AppNotification, getUserNotifications } from '@/services/supabase/notificationDbService';
import { CacheKeys } from '@/services/cache/cacheService';
import { useCallback } from 'react';

export function useUserNotifications(userId: string | undefined) {
  const fetchFn = useCallback(() => {
    if (!userId) return Promise.resolve([]);
    return getUserNotifications(userId);
  }, [userId]);

  const { data, loading, error, refetch } = useCachedQuery<AppNotification[]>(
    userId ? CacheKeys.userNotifications(userId) : 'user_notifications_none',
    fetchFn,
    !!userId,
  );

  return { notifications: data || [], loading, error, refetch };
}
