import { useState, useCallback } from 'react';
import { rejectGemRequest } from '@/services/supabase/gemService';
import { invalidateCachePattern } from '@/services/cache/cacheService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useRejectGemRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reject = useCallback(async (id: string, reason?: string) => {
    setLoading(true);
    setError(null);

    try {
      await rejectGemRequest(id, reason);
      await invalidateCachePattern(CacheKeys.gemRequests().slice(0, -1));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}
