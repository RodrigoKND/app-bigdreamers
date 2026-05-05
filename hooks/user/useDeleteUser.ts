import { useState, useCallback } from 'react';
import { deleteUser } from '@/services/supabase/userService';

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteUser(userId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
