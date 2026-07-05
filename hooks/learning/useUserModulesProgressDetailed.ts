import { useCachedQuery } from '@/hooks/useCachedQuery';
import { getUserModulesProgressDetailed } from '@/services/supabase/learningService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserModulesProgressDetailed(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<
    { moduleId: string; progress: number; completed: boolean; completedLessons: number; totalLessons: number }[]
  >(
    userId ? CacheKeys.userModulesProgressDetailed(userId) : '',
    () => getUserModulesProgressDetailed(userId!),
    !!userId,
  );

  return { progress: data || [], loading, error, refetch };
}
