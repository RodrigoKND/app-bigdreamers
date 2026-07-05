import { useCachedQuery } from '@/hooks/useCachedQuery';
import { getUserInvestments, Investment } from '@/services/supabase/investmentService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserInvestments(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<Investment[]>(
    userId ? CacheKeys.userInvestments(userId) : '',
    () => getUserInvestments(userId!),
    !!userId,
  );

  return { investments: data || [], loading, error, refetch };
}
