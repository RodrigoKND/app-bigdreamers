import { useState, useEffect, useCallback } from 'react';
import { Milestone } from '@/types';
import { getMilestoneById } from '@/services/supabase/progressService';

export function useMilestoneById(milestoneId: string | null) {
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestone = useCallback(async () => {
    if (!milestoneId) {
      setMilestone(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMilestoneById(milestoneId);
      setMilestone(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [milestoneId]);

  useEffect(() => {
    fetchMilestone();
  }, [fetchMilestone]);

  return { milestone, loading, error, refetch: fetchMilestone };
}
