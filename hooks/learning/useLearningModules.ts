import { useState, useEffect, useCallback } from 'react';
import { LearningModule } from '@/types';
import { getLearningModules } from '@/services/supabase/learningService';

export function useLearningModules(filters?: {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}) {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getLearningModules(filters);
      setModules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.difficulty]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}
