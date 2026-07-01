import { useState, useEffect, useCallback } from 'react';
import { GemRequest } from '@/constants/mockGemRequests';
import { getGemRequestById } from '@/services/supabase/gemService';

export function useGemRequestById(requestId: string | null) {
  const [request, setRequest] = useState<GemRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!requestId) {
      setRequest(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getGemRequestById(requestId);
      setRequest(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return { request, loading, error, refetch: fetchRequest };
}
