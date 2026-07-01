import { useState, useCallback } from 'react';
import { resetStreak } from '@/services/supabase/userService';

export function useResetStreak() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await resetStreak(userId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reset, loading, error };
}
