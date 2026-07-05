import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/services/supabase/supabase';

export interface LessonData {
  id: string;
  title: string;
  durationMinutes: number;
  content: string;
  createdAt: string;
}

export function useLessonsByModuleId(moduleId: string) {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('lessons')
          .select('id, title, duration_minutes, content, created_at')
          .eq('module_id', moduleId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!cancelled) {
          setLessons((data || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            durationMinutes: l.duration_minutes,
            content: l.content ?? '',
            createdAt: l.created_at,
          })));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [moduleId]);

  return { lessons, loading, error };
}
