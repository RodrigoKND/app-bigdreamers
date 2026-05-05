import { useState, useCallback } from 'react';
import { Activity } from '@/types';
import { createActivity } from '@/services/supabase/communityService';

export function useCreateActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);

  const create = useCallback(async (params: {
    memberId: string;
    memberName: string;
    type: 'milestone' | 'level_up' | 'module_completed' | 'streak';
    description: string;
    gemsEarned: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createActivity(params);
      setActivity(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, activity, loading, error };
}
