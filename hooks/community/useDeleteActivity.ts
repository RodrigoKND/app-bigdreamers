import { useState, useCallback } from 'react';
import { deleteActivity } from '@/services/supabase/communityService';

export function useDeleteActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (activityId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteActivity(activityId);
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
