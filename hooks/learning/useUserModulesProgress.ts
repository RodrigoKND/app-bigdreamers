import { useCachedQuery } from '@/hooks/useCachedQuery';
import { getUserModulesProgress } from '@/services/supabase/learningService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserModulesProgress(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<{
    moduleId: string;
    progress: number;
    completed: boolean;
    completedAt?: string;
  }[]>(
    userId ? CacheKeys.userModulesProgress(userId) : '',
    () => getUserModulesProgress(userId!),
    !!userId,
  );

  return { progress: data || [], loading, error, refetch };
}
