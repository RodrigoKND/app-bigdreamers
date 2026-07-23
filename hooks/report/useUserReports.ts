import { useCallback } from 'react';
import { useCachedQuery } from '@/hooks/useCachedQuery';
import { InvestmentReport, getReportsByUser } from '@/services/supabase/reportService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useUserReports(userId: string | undefined) {
  const fetchFn = useCallback(() => {
    if (!userId) return Promise.resolve([]);
    return getReportsByUser(userId);
  }, [userId]);

  const { data, loading, error, refetch } = useCachedQuery<InvestmentReport[]>(
    userId ? CacheKeys.userReports(userId) : 'user_reports_none',
    fetchFn,
    !!userId,
  );

  return { reports: data || [], loading, error, refetch };
}
