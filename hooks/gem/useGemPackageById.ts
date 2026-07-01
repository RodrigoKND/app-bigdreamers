import { useState, useEffect, useCallback } from 'react';
import { GemPackage } from '@/constants/gemPackages';
import { getGemPackageById } from '@/services/supabase/gemService';

export function useGemPackageById(packageId: string | null) {
  const [pkg, setPkg] = useState<GemPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackage = useCallback(async () => {
    if (!packageId) {
      setPkg(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getGemPackageById(packageId);
      setPkg(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchPackage();
  }, [fetchPackage]);

  return { package: pkg, loading, error, refetch: fetchPackage };
}
