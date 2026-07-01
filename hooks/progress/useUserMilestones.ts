import { useCachedQuery } from '@/hooks/useCachedQuery';
import { Milestone } from '@/types';
import { getUserMilestones } from '@/services/supabase/progressService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserMilestones(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<Milestone[]>(
    userId ? CacheKeys.userMilestones(userId) : '',
    () => getUserMilestones(userId!),
    !!userId,
  );

  return { milestones: data || [], loading, error, refetch };
}
