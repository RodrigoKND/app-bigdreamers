import { useState, useCallback } from 'react';
import { updateUserGems } from '@/services/supabase/userService';

export function useUpdateUserGems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateGems = useCallback(async (userId: string, gems: number) => {
    setLoading(true);
    setError(null);

    try {
      await updateUserGems(userId, gems);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateGems, loading, error };
}
