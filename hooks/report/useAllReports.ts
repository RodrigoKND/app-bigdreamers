import { useCachedQuery } from '@/hooks/useCachedQuery';
import { InvestmentReport, getAllReports } from '@/services/supabase/reportService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useAllReports() {
  const { data, loading, error, refetch } = useCachedQuery<InvestmentReport[]>(
    CacheKeys.allReports,
    getAllReports,
  );

  return { reports: data || [], loading, error, refetch };
}
