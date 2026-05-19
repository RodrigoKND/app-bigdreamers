import { useState, useCallback } from 'react';
import { updateCompanyTeamMembers } from '@/services/supabase/companyService';

export function useUpdateCompanyTeamMembers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTeamMembers = useCallback(async (
    companyId: string,
    teamMembers: { name: string; role: string }[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateCompanyTeamMembers(companyId, teamMembers);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTeamMembers, loading, error };
}
