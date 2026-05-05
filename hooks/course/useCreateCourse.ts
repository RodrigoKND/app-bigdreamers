import { useState, useCallback } from 'react';
import { Course } from '@/constants/mockCourses';
import { createCourse } from '@/services/supabase/courseService';

export function useCreateCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const create = useCallback(async (params: {
    title: string;
    description: string;
    category: 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
    totalLessons: number;
    published?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createCourse(params);
      setCourse(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, course, loading, error };
}
