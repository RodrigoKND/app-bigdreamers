import { useState, useCallback } from 'react';
import { completeMilestone } from '@/services/supabase/progressService';

export function useCompleteMilestone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const complete = useCallback(async (userId: string, milestoneId: string) => {
    setLoading(true);
    setError(null);

    try {
      await completeMilestone(userId, milestoneId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { complete, loading, error };
}
