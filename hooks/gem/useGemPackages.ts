import { useState, useEffect, useCallback } from 'react';
import { GemPackage, GEM_PACKAGES } from '@/constants/gemPackages';
import { getGemPackages } from '@/services/supabase/gemService';

export function useGemPackages() {
  const [packages, setPackages] = useState<GemPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGemPackages();
      if (data.length > 0) {
        setPackages(data);
      } else {
        setPackages(GEM_PACKAGES);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setPackages(GEM_PACKAGES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return { packages, loading, error, refetch: fetchPackages };
}
