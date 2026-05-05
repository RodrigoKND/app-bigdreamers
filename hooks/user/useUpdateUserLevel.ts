import { useState, useCallback } from 'react';
import { updateUserLevel } from '@/services/supabase/userService';

export function useUpdateUserLevel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateLevel = useCallback(async (userId: string, level: string) => {
    setLoading(true);
    setError(null);

    try {
      await updateUserLevel(userId, level);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateLevel, loading, error };
}
