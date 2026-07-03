import { useState, useCallback } from 'react';
import { completeModule } from '@/services/supabase/learningService';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';

export function useCompleteModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const complete = useCallback(async (userId: string, moduleId: string, gemsReward?: number) => {
    setLoading(true);
    setError(null);

    try {
      await completeModule(userId, moduleId, gemsReward);
      await invalidateCachePattern(CacheKeys.currentUser(userId));
      await invalidateCachePattern(CacheKeys.userCompletedModules(userId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { complete, loading, error };
}
