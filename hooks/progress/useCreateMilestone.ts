import { useState, useCallback } from 'react';
import { Milestone } from '@/types';
import { createMilestone } from '@/services/supabase/progressService';

export function useCreateMilestone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  const create = useCallback(async (params: {
    title: string;
    description: string;
    gemsReward: number;
    category: 'learning' | 'community' | 'streak' | 'level';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createMilestone(params);
      setMilestone(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, milestone, loading, error };
}
