import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/types';
import { getUserActivities } from '@/services/supabase/communityService';

export function useUserActivities(userId: string | null, limit = 20) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!userId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserActivities(userId, limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}
