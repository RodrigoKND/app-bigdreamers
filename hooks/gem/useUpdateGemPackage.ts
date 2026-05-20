import { useState, useCallback } from 'react';
import { updateGemPackage } from '@/services/supabase/gemService';

export function useUpdateGemPackage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    id: string,
    updates: Partial<{ gems: number; bsPrice: number; label: string; popular: boolean }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateGemPackage(id, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
