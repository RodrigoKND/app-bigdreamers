import { useState, useEffect, useCallback } from 'react';
import { GemRequest } from '@/constants/mockGemRequests';
import { getGemRequests } from '@/services/supabase/gemService';

export function useGemRequests(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
}) {
  const [requests, setRequests] = useState<GemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGemRequests(filters);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.userId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
}
