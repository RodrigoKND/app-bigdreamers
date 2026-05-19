import { useState, useEffect, useCallback, useRef } from 'react';
import { getCachedData, setCachedData } from '@/services/cache/cacheService';

interface CachedQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCachedQuery<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  enabled: boolean = true,
): CachedQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchRef = useRef(0);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const fetch = useCallback(async () => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchId = ++fetchRef.current;
    setLoading(true);
    setError(null);

    try {
      const cached = await getCachedData<T>(cacheKey);

      if (cached && !cached.stale) {
        if (fetchRef.current === fetchId) {
          setData(cached.data);
          setLoading(false);
        }
        return;
      }

      if (cached && cached.stale && fetchRef.current === fetchId) {
        setData(cached.data);
        setLoading(false);
      }

      const fresh = await fetchFnRef.current();
      await setCachedData(cacheKey, fresh);

      if (fetchRef.current === fetchId) {
        setData(fresh);
        setLoading(false);
      }
    } catch (err) {
      const cached = await getCachedData<T>(cacheKey);
      if (cached && fetchRef.current === fetchId) {
        setData(cached.data);
        setLoading(false);
        return;
      }
      if (fetchRef.current === fetchId) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }
  }, [cacheKey, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
