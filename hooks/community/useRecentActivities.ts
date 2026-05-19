import { useCallback } from 'react';
import { useCachedQuery } from '@/hooks/useCachedQuery';
import { Activity } from '@/types';
import { getRecentActivities } from '@/services/supabase/communityService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useRecentActivities(limit = 10) {
  const fetchFn = useCallback(
    () => getRecentActivities(limit),
    [limit],
  );

  const { data, loading, error, refetch } = useCachedQuery<Activity[]>(
    CacheKeys.recentActivities(limit),
    fetchFn,
  );

  return { activities: data || [], loading, error, refetch };
}
