import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getUnreadCount } from '@/services/supabase/notificationDbService';

export function useUnreadNotificationCount(userId: string | undefined) {
  const [count, setCount] = useState(0);

  const refetch = useCallback(async () => {
    if (!userId) {
      setCount(0);
      return;
    }
    try {
      const c = await getUnreadCount(userId);
      setCount(c);
    } catch {
      // silently ignore — el badge simplemente no se actualiza
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { count, refetch };
}
