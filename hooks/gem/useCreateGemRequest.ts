import { useState, useCallback } from 'react';
import { GemRequest } from '@/constants/mockGemRequests';
import { createGemRequest } from '@/services/supabase/gemService';

export function useCreateGemRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [request, setRequest] = useState<GemRequest | null>(null);

  const create = useCallback(async (params: {
    userId: string;
    packageId: string;
    gems: number;
    bsPrice: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createGemRequest(params);
      setRequest(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, request, loading, error };
}
