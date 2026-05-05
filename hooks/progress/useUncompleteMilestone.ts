import { useState, useCallback } from 'react';
import { uncompleteMilestone } from '@/services/supabase/progressService';

export function useUncompleteMilestone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uncomplete = useCallback(async (userId: string, milestoneId: string) => {
    setLoading(true);
    setError(null);

    try {
      await uncompleteMilestone(userId, milestoneId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uncomplete, loading, error };
}
