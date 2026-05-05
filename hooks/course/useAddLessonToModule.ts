import { useState, useCallback } from 'react';
import { Lesson } from '@/constants/mockCourses';
import { addLessonToModule } from '@/services/supabase/courseService';

export function useAddLessonToModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const addLesson = useCallback(async (
    moduleId: string,
    lesson: { title: string; durationMinutes: number }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await addLessonToModule(moduleId, lesson);
      setLesson(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addLesson, lesson, loading, error };
}
