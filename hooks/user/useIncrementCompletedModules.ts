import { useState, useCallback } from 'react';
import { incrementCompletedModules } from '@/services/supabase/userService';

export function useIncrementCompletedModules() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const increment = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await incrementCompletedModules(userId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { increment, loading, error };
}
