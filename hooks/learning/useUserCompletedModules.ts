import { useCachedQuery } from '@/hooks/useCachedQuery';
import { getUserCompletedModules } from '@/services/supabase/learningService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserCompletedModules(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<string[]>(
    userId ? CacheKeys.userCompletedModules(userId) : '',
    () => getUserCompletedModules(userId!),
    !!userId,
  );

  return { completedModuleIds: data || [], loading, error, refetch };
}
