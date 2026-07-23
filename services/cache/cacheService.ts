import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@app_cache/';
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const STALE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}

export const CacheKeys = {
  companies: 'companies',
  company: (id: string) => `company_${id}`,
  learningModules: 'learning_modules',
  learningModule: (id: string) => `learning_module_${id}`,
  userModulesProgress: (userId: string) => `user_modules_progress_${userId}`,
  userModulesProgressDetailed: (userId: string) => `user_modules_progress_detailed_${userId}`,
  userCompletedModules: (userId: string) => `user_completed_modules_${userId}`,
  currentUser: (userId: string) => `current_user_${userId}`,
  userInvestments: (userId: string) => `user_investments_${userId}`,
  userMilestones: (userId: string) => `user_milestones_${userId}`,
  milestones: 'milestones',
  gemPackages: 'gem_packages',
  gemRequests: (status?: string) => status ? `gem_requests_${status}` : 'gem_requests',
  userGemHistory: (userId: string) => `user_gem_history_${userId}`,
  communityRanking: (limit: number) => `community_ranking_${limit}`,
  rankingByPeriod: (period: string, limit: number) => `ranking_${period}_${limit}`,
  recentActivities: (limit: number) => `recent_activities_${limit}`,
  courses: 'courses',
  course: (id: string) => `course_${id}`,
  allUsers: 'all_users',
  userReports: (userId: string) => `user_reports_${userId}`,
  allReports: 'all_reports',
  userNotifications: (userId: string) => `user_notifications_${userId}`,
};

export async function getCachedData<T>(key: string): Promise<{ data: T; stale: boolean } | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.cachedAt;

    if (age < entry.ttl) {
      return { data: entry.data, stale: false };
    }

    if (age < STALE_TTL_MS) {
      return { data: entry.data, stale: true };
    }

    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  } catch {
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL_MS): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now(), ttl };
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Silently fail - cache is optional
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch {
    // Silently fail
  }
}

export async function invalidateCachePattern(prefix: string): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(`${CACHE_PREFIX}${prefix}`));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {
    // Silently fail
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {
    // Silently fail
  }
}
