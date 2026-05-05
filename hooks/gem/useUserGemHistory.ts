import { useState, useEffect, useCallback } from 'react';
import { GemRequest } from '@/constants/mockGemRequests';
import { getUserGemHistory } from '@/services/supabase/gemService';

export function useUserGemHistory(userId: string | null) {
  const [history, setHistory] = useState<GemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserGemHistory(userId);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}
