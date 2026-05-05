import { useState, useCallback } from 'react';
import { updateObjective } from '@/services/supabase/courseService';

export function useUpdateObjective() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    objectiveId: string,
    updates: Partial<{
      description: string;
      triggerType: 'module' | 'gems';
      triggerValue: string;
      badgeId: string;
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateObjective(objectiveId, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
