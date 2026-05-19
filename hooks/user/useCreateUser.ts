import { useState, useCallback } from 'react';
import { User } from '@/types';
import { createUser } from '@/services/supabase/userService';

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const create = useCallback(async (params: {
    name: string;
    email: string;
    avatar?: string;
    role?: 'admin' | 'user';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createUser(params);
      setUser(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, user, loading, error };
}
