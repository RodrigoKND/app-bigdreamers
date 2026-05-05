import { useState, useCallback } from 'react';
import { approveGemRequest } from '@/services/supabase/gemService';

export function useApproveGemRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async (id: string, adminId: string) => {
    setLoading(true);
    setError(null);

    try {
      await approveGemRequest(id, adminId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}
