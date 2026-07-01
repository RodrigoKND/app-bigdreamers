import { useState, useCallback } from 'react';
import { LearningModule } from '@/types';
import { createModule } from '@/services/supabase/learningService';

export function useCreateLearningModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [module, setModule] = useState<LearningModule | null>(null);

  const create = useCallback(async (params: {
    title: string;
    description: string;
    category: string;
    duration: string;
    gemsReward: number;
    thumbnail: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    orderIndex?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createModule(params);
      setModule(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, module, loading, error };
}
