import { useState, useCallback } from 'react';
import { deleteLesson } from '@/services/supabase/courseService';

export function useDeleteLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteLesson(lessonId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
