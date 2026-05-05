import { useState, useCallback } from 'react';
import { updateUser } from '@/services/supabase/userService';

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    userId: string,
    updates: Partial<{
      name: string;
      email: string;
      avatar: string;
      role: 'admin' | 'user';
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateUser(userId, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
