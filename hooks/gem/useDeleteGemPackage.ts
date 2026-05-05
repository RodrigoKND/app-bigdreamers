import { useState, useCallback } from 'react';
import { deleteGemPackage } from '@/services/supabase/gemService';

export function useDeleteGemPackage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteGemPackage(id);
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
