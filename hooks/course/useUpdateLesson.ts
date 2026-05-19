import { useState, useCallback } from 'react';
import { updateLesson } from '@/services/supabase/courseService';

export function useUpdateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    lessonId: string,
    updates: Partial<{ title: string; durationMinutes: number }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateLesson(lessonId, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
