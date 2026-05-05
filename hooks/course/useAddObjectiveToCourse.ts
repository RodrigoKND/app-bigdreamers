import { useState, useCallback } from 'react';
import { CourseObjective } from '@/constants/mockCourses';
import { addObjectiveToCourse } from '@/services/supabase/courseService';

export function useAddObjectiveToCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [objective, setObjective] = useState<CourseObjective | null>(null);

  const addObjective = useCallback(async (
    courseId: string,
    objective: {
      description: string;
      triggerType: 'module' | 'gems';
      triggerValue: string;
      badgeId: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await addObjectiveToCourse(courseId, objective);
      setObjective(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addObjective, objective, loading, error };
}
