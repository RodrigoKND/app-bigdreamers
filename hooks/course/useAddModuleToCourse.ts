import { useState, useCallback } from 'react';
import { CourseModule } from '@/constants/mockCourses';
import { addModuleToCourse } from '@/services/supabase/courseService';

export function useAddModuleToCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [module, setModule] = useState<CourseModule | null>(null);

  const addModule = useCallback(async (
    courseId: string,
    module: { title: string; description: string; badgeId?: string | null }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await addModuleToCourse(courseId, module);
      setModule(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addModule, module, loading, error };
}
