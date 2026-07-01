import { useState, useEffect, useCallback } from 'react';
import { Milestone } from '@/types';
import { getMilestones } from '@/services/supabase/progressService';

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMilestones();
      setMilestones(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return { milestones, loading, error, refetch: fetchMilestones };
}
