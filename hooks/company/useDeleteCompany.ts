import { useState, useCallback } from 'react';
import { deleteCompany } from '@/services/supabase/companyService';
import { invalidateCache, invalidateCachePattern } from '@/services/cache/cacheService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useDeleteCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteCompany(id);
      await invalidateCache(CacheKeys.companies);
      await invalidateCache(CacheKeys.company(id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
