import { useState, useCallback } from 'react';
import { updateCompany } from '@/services/supabase/companyService';

export function useUpdateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (
    id: string,
    updates: Partial<{
      name: string;
      description: string;
      gems: number;
      imageUrl: string;
      level: 'gold' | 'silver' | 'bronze';
      published: boolean;
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateCompany(id, updates);
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
