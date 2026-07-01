import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/constants/mockCourses';
import { getCourses } from '@/services/supabase/courseService';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}
