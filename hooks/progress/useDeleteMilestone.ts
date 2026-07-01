import { useState, useCallback } from 'react';
import { deleteMilestone } from '@/services/supabase/progressService';

export function useDeleteMilestone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (milestoneId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteMilestone(milestoneId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
