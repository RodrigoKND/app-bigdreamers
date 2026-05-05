import { useState, useEffect, useCallback } from 'react';
import { getUserModuleProgress } from '@/services/supabase/learningService';

export function useUserModuleProgress(userId: string | null, moduleId: string | null) {
  const [progress, setProgress] = useState<{
    progress: number;
    completed: boolean;
    completedAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId || !moduleId) {
      setProgress(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserModuleProgress(userId, moduleId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId, moduleId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
}
