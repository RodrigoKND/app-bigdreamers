import { useCallback } from 'react';
import { useCachedQuery } from '@/hooks/useCachedQuery';
import { GemRequest } from '@/constants/mockGemRequests';
import { getGemRequests } from '@/services/supabase/gemService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useGemRequests(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
}) {
  const cacheKey = filters?.status
    ? CacheKeys.gemRequests(filters.status)
    : CacheKeys.gemRequests();

  const fetchFn = useCallback(
    () => getGemRequests(filters),
    [filters?.status, filters?.userId],
  );

  const { data, loading, error, refetch } = useCachedQuery<GemRequest[]>(
    cacheKey,
    fetchFn,
  );

  return { requests: data || [], loading, error, refetch };
}
