import { useState, useEffect, useCallback } from 'react';
import { Milestone } from '@/types';
import { getMilestonesByCategory } from '@/services/supabase/progressService';

export function useMilestonesByCategory(category: 'learning' | 'community' | 'streak' | 'level' | null) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestones = useCallback(async () => {
    if (!category) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMilestonesByCategory(category);
      setMilestones(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return { milestones, loading, error, refetch: fetchMilestones };
}
