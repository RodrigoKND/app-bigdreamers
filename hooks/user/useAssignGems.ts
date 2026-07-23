import { useState, useCallback } from 'react';
import { assignGemsToUser } from '@/services/supabase/userService';
import { invalidateCache, CacheKeys } from '@/services/cache/cacheService';

export function useAssignGems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assign = useCallback(async (params: {
    userId: string;
    gems: number;
    companyId?: string;
    companyName?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await assignGemsToUser(params);
      await invalidateCache(CacheKeys.allUsers);
      await invalidateCache(CacheKeys.currentUser(params.userId));
      await invalidateCache(CacheKeys.userInvestments(params.userId));
      await invalidateCache(CacheKeys.userNotifications(params.userId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assign, loading, error };
}
