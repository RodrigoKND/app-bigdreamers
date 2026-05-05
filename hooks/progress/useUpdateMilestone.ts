import { useState, useCallback } from 'react';
import { updateMilestone } from '@/services/supabase/progressService';

export function useUpdateMilestone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    milestoneId: string,
    updates: Partial<{
      title: string;
      description: string;
      gemsReward: number;
      category: 'learning' | 'community' | 'streak' | 'level';
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateMilestone(milestoneId, updates);
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
