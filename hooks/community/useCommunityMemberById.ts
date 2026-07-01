import { useState, useEffect, useCallback } from 'react';
import { CommunityMember } from '@/types';
import { getCommunityMemberById } from '@/services/supabase/communityService';

export function useCommunityMemberById(userId: string | null) {
  const [member, setMember] = useState<CommunityMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMember = useCallback(async () => {
    if (!userId) {
      setMember(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCommunityMemberById(userId);
      setMember(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  return { member, loading, error, refetch: fetchMember };
}
