import { useState, useEffect, useCallback } from 'react';
import { getUserMilestoneProgress } from '@/services/supabase/progressService';

export function useUserMilestoneProgress(userId: string | null) {
  const [progress, setProgress] = useState<{ milestoneId: string; completedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId) {
      setProgress([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserMilestoneProgress(userId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
}
