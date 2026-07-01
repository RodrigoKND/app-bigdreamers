import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/constants/mockCourses';
import { getCourseById } from '@/services/supabase/courseService';

export function useCourseById(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
}
