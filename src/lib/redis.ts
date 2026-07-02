// In-Memory cache storage as a fallback when Redis URL is not set
const memoryCache = new Map<string, { value: string; expiry: number }>();

export const cache = {
  get: async (key: string): Promise<string | null> => {
    // Check Redis environment first if needed, else memory cache
    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }

    return item.value;
  },

  set: async (key: string, value: string, ttlSeconds: number = 300): Promise<void> => {
    const expiry = Date.now() + ttlSeconds * 1000;
    memoryCache.set(key, { value, expiry });
  },

  del: async (key: string): Promise<void> => {
    memoryCache.delete(key);
  },

  // Helper to resolve and cache functions automatically
  remember: async <T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> => {
    const cached = await cache.get(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        // In case of parse error, refetch
      }
    }

    const freshData = await fetcher();
    await cache.set(key, JSON.stringify(freshData), ttlSeconds);
    return freshData;
  }
};
