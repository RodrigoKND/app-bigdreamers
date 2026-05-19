import { useCachedQuery } from '@/hooks/useCachedQuery';
import { GemRequest } from '@/constants/mockGemRequests';
import { getUserGemHistory } from '@/services/supabase/gemService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserGemHistory(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<GemRequest[]>(
    userId ? CacheKeys.userGemHistory(userId) : '',
    () => getUserGemHistory(userId!),
    !!userId,
  );

  return { history: data || [], loading, error, refetch };
}
