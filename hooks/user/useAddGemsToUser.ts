import { useState, useCallback } from 'react';
import { addGemsToUser } from '@/services/supabase/userService';

export function useAddGemsToUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addGems = useCallback(async (userId: string, gemsToAdd: number) => {
    setLoading(true);
    setError(null);

    try {
      await addGemsToUser(userId, gemsToAdd);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addGems, loading, error };
}
