import { useCachedQuery } from '@/hooks/useCachedQuery';
import { Company } from '@/constants/mockCompanies';
import { getCompanies } from '@/services/supabase/companyService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useCompanies() {
  const { data, loading, error, refetch } = useCachedQuery<Company[]>(
    CacheKeys.companies,
    getCompanies,
  );

  return { companies: data || [], loading, error, refetch };
}
