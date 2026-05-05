import { useState, useEffect, useCallback } from 'react';
import { CommunityMember } from '@/types';
import { getCommunityRanking } from '@/services/supabase/communityService';

export function useCommunityRanking(limit = 50) {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCommunityRanking(limit);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return { members, loading, error, refetch: fetchRanking };
}
