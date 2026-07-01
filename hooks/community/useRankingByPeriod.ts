import { useCallback } from 'react';
import { useCachedQuery } from '@/hooks/useCachedQuery';
import { CommunityMember } from '@/types';
import { getRankingByPeriod } from '@/services/supabase/communityService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useRankingByPeriod(
  period: 'weekly' | 'monthly' | 'all' = 'all',
  limit = 10
) {
  const fetchFn = useCallback(
    () => getRankingByPeriod(period, limit),
    [period, limit],
  );

  const { data, loading, error, refetch } = useCachedQuery<CommunityMember[]>(
    CacheKeys.rankingByPeriod(period, limit),
    fetchFn,
  );

  return { members: data || [], loading, error, refetch };
}
