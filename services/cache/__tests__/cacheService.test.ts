import { getCachedData, setCachedData, invalidateCache, CacheKeys } from '../cacheService';

const TEST_KEY = 'test_key';
const TEST_DATA = { hello: 'world', number: 42 };

describe('CacheService', () => {
  beforeEach(async () => {
    await invalidateCache(TEST_KEY);
  });

  it('returns null for uncached keys', async () => {
    const result = await getCachedData(TEST_KEY);
    expect(result).toBeNull();
  });

  it('stores and retrieves data', async () => {
    await setCachedData(TEST_KEY, TEST_DATA);
    const result = await getCachedData<typeof TEST_DATA>(TEST_KEY);

    expect(result).not.toBeNull();
    expect(result!.data).toEqual(TEST_DATA);
    expect(result!.stale).toBe(false);
  });

  it('returns stale data after TTL expires', async () => {
    await setCachedData(TEST_KEY, TEST_DATA, -1);
    const result = await getCachedData<typeof TEST_DATA>(TEST_KEY);

    expect(result).not.toBeNull();
    expect(result!.data).toEqual(TEST_DATA);
    expect(result!.stale).toBe(true);
  });

  it('returns null after stale TTL expires', async () => {
    // Manually write an entry with a cachedAt far in the past
    const pastEntry = JSON.stringify({
      data: TEST_DATA,
      cachedAt: Date.now() - 31 * 60 * 1000,
      ttl: -100000,
    });
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem('@app_cache/' + TEST_KEY, pastEntry);

    const result = await getCachedData<typeof TEST_DATA>(TEST_KEY);
    expect(result).toBeNull();
  });

  it('removes cached data on invalidation', async () => {
    await setCachedData(TEST_KEY, TEST_DATA);
    await invalidateCache(TEST_KEY);

    const result = await getCachedData(TEST_KEY);
    expect(result).toBeNull();
  });

  it('generates correct cache keys', () => {
    expect(CacheKeys.companies).toBe('companies');
    expect(CacheKeys.company('abc')).toBe('company_abc');
    expect(CacheKeys.learningModules).toBe('learning_modules');
    expect(CacheKeys.currentUser('uid')).toBe('current_user_uid');
    expect(CacheKeys.rankingByPeriod('weekly', 10)).toBe('ranking_weekly_10');
    expect(CacheKeys.gemRequests()).toBe('gem_requests');
    expect(CacheKeys.gemRequests('pending')).toBe('gem_requests_pending');
  });

  it('handles JSON-serializable data', async () => {
    const complexData = {
      items: [1, 2, 3],
      nested: { a: { b: 'deep' } },
      date: '2024-01-01',
    };

    await setCachedData(TEST_KEY, complexData);
    const result = await getCachedData<typeof complexData>(TEST_KEY);

    expect(result!.data).toEqual(complexData);
  });

  it('can store and retrieve empty arrays', async () => {
    await setCachedData(TEST_KEY, []);
    const result = await getCachedData<unknown[]>(TEST_KEY);
    expect(result).not.toBeNull();
    expect(result!.data).toEqual([]);
  });

  it('can store and retrieve null', async () => {
    await setCachedData(TEST_KEY, null);
    const result = await getCachedData<null>(TEST_KEY);
    expect(result).not.toBeNull();
    expect(result!.data).toBeNull();
  });
});
