import { useState, useCallback } from 'react';
import { deleteObjective } from '@/services/supabase/courseService';

export function useDeleteObjective() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (objectiveId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteObjective(objectiveId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
