import { useState, useCallback } from 'react';
import { approveGemRequest } from '@/services/supabase/gemService';
import { invalidateCachePattern } from '@/services/cache/cacheService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useApproveGemRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async (id: string, adminId: string) => {
    setLoading(true);
    setError(null);

    try {
      await approveGemRequest(id, adminId);
      await invalidateCachePattern(CacheKeys.gemRequests().slice(0, -1));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}
