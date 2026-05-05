import { useState, useCallback } from 'react';
import { deleteCourse } from '@/services/supabase/courseService';

export function useDeleteCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteCourse(id);
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
