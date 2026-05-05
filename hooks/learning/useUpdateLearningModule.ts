import { useState, useCallback } from 'react';
import { updateModule } from '@/services/supabase/learningService';

export function useUpdateLearningModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    moduleId: string,
    updates: Partial<{
      title: string;
      description: string;
      category: string;
      duration: string;
      gemsReward: number;
      thumbnail: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      orderIndex: number;
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateModule(moduleId, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
