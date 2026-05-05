import { useState, useCallback } from 'react';
import { updateCourse } from '@/services/supabase/courseService';

export function useUpdateCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      category: 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
      totalLessons: number;
      published: boolean;
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateCourse(id, updates);
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
