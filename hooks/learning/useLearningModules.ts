import { useCallback } from 'react';
import { useCachedQuery } from '@/hooks/useCachedQuery';
import { LearningModule } from '@/types';
import { getLearningModules } from '@/services/supabase/learningService';
import { CacheKeys } from '@/services/cache/cacheService';

export function useLearningModules(filters?: {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}) {
  const cacheKey = filters?.category
    ? `${CacheKeys.learningModules}_${filters.category}${filters?.difficulty ? `_${filters.difficulty}` : ''}`
    : CacheKeys.learningModules;

  const fetchFn = useCallback(
    () => getLearningModules(filters),
    [filters?.category, filters?.difficulty],
  );

  const { data, loading, error, refetch } = useCachedQuery<LearningModule[]>(
    cacheKey,
    fetchFn,
  );

  return { modules: data || [], loading, error, refetch };
}
