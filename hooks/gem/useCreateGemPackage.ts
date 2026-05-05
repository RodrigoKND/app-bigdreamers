import { useState, useCallback } from 'react';
import { GemPackage } from '@/constants/gemPackages';
import { createGemPackage } from '@/services/supabase/gemService';

export function useCreateGemPackage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pkg, setPkg] = useState<GemPackage | null>(null);

  const create = useCallback(async (params: {
    gems: number;
    bsPrice: number;
    label: string;
    popular?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createGemPackage(params);
      setPkg(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, package: pkg, loading, error };
}
