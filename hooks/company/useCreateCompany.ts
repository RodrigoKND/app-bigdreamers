import { useState, useCallback } from 'react';
import { Company } from '@/constants/mockCompanies';
import { createCompany } from '@/services/supabase/companyService';

export function useCreateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  const create = useCallback(async (params: {
    name: string;
    description: string;
    gems: number;
    imageUrl: string;
    level: 'gold' | 'silver' | 'bronze';
    teamMembers: { name: string; role: string }[];
    published?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createCompany(params);
      setCompany(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, company, loading, error };
}
