import { useState, useCallback } from 'react';
import { deleteModule } from '@/services/supabase/learningService';

export function useDeleteLearningModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (moduleId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteModule(moduleId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
