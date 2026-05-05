import { useState, useEffect, useCallback } from 'react';
import { getUserCompletedModules } from '@/services/supabase/learningService';

export function useUserCompletedModules(userId: string | null) {
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompletedModules = useCallback(async () => {
    if (!userId) {
      setCompletedModuleIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserCompletedModules(userId);
      setCompletedModuleIds(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCompletedModules();
  }, [fetchCompletedModules]);

  return { completedModuleIds, loading, error, refetch: fetchCompletedModules };
}
