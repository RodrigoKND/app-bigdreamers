import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/types';
import { getActivityById } from '@/services/supabase/communityService';

export function useActivityById(activityId: string | null) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!activityId) {
      setActivity(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getActivityById(activityId);
      setActivity(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { activity, loading, error, refetch: fetchActivity };
}
