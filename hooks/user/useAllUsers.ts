import { useCachedQuery } from '@/hooks/useCachedQuery';
import { User } from '@/types';
import { getAllUsers } from '@/services/supabase/userService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useAllUsers() {
  const { data, loading, error, refetch } = useCachedQuery<User[]>(
    CacheKeys.allUsers,
    getAllUsers,
  );

  return { users: data || [], loading, error, refetch };
}
