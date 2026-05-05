import { useState, useCallback } from 'react';
import { updateUserModuleProgress } from '@/services/supabase/learningService';

export function useUpdateUserModuleProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProgress = useCallback(async (
    userId: string,
    moduleId: string,
    progress: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateUserModuleProgress(userId, moduleId, progress);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProgress, loading, error };
}
