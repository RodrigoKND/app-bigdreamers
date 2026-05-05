import { useState, useEffect, useCallback } from 'react';
import { LearningModule } from '@/types';
import { getLearningModuleById } from '@/services/supabase/learningService';

export function useLearningModuleById(moduleId: string | null) {
  const [module, setModule] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModule = useCallback(async () => {
    if (!moduleId) {
      setModule(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getLearningModuleById(moduleId);
      setModule(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  return { module, loading, error, refetch: fetchModule };
}
