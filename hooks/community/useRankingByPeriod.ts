import { useState, useEffect, useCallback } from 'react';
import { CommunityMember } from '@/types';
import { getRankingByPeriod } from '@/services/supabase/communityService';

export function useRankingByPeriod(
  period: 'weekly' | 'monthly' | 'all' = 'all',
  limit = 10
) {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRankingByPeriod(period, limit);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [period, limit]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return { members, loading, error, refetch: fetchRanking };
}
