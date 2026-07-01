import { useState, useCallback } from 'react';
import { incrementStreak } from '@/services/supabase/userService';

export function useIncrementStreak() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const increment = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await incrementStreak(userId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { increment, loading, error };
}
