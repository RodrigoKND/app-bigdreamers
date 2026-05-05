import { useState, useEffect, useCallback } from 'react';
import { getUserModulesProgress } from '@/services/supabase/learningService';

export function useUserModulesProgress(userId: string | null) {
  const [progress, setProgress] = useState<{
    moduleId: string;
    progress: number;
    completed: boolean;
    completedAt?: string;
  }[]>([]);
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
      const data = await getUserModulesProgress(userId);
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
