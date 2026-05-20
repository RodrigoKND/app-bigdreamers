import { useCachedQuery } from '@/hooks/useCachedQuery';
import { User } from '@/types';
import { getCurrentUser } from '@/services/supabase/userService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useCurrentUser(userId: string | null) {
  const { data, loading, error, refetch } = useCachedQuery<User | null>(
    userId ? CacheKeys.currentUser(userId) : '',
    () => getCurrentUser(userId!),
    !!userId,
  );

  return { user: data, loading, error, refetch };
}
