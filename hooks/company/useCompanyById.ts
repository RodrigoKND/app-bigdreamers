import { useCachedQuery } from '@/hooks/useCachedQuery';
import { Company } from '@/constants/mockCompanies';
import { getCompanyById } from '@/services/supabase/companyService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useCompanyById(companyId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<Company | null>(
    companyId ? CacheKeys.company(companyId) : '',
    () => getCompanyById(companyId!),
    !!companyId,
  );

  return { company: data, loading, error, refetch };
}
