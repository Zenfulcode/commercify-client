import type { Actions } from "@sveltejs/kit";
import { serverCache, CACHE_TTL, getCachedOrFetch } from "$lib/server/cache.js";

export const load = async () => {
  // Test cache functionality
  const testKey = "test:demo";
  const testData = { message: "Hello from cache!", timestamp: Date.now() };

  // Try to get from cache, or set if not exists
  const cachedData = await getCachedOrFetch(
    testKey,
    async () => {
      console.log("Cache miss - generating new data");
      return testData;
    },
    5000 // 5 second TTL for demo
  );

  return {
    cached: cachedData,
    cacheStats: {
      size: serverCache.size(),
      keys: serverCache.getStats().keys,
    },
  };
};

export const actions: Actions = {
  clearTest: async () => {
    serverCache.invalidate("test:demo");
    return { success: true };
  },

  addTest: async () => {
    serverCache.set(
      "test:manual",
      { manual: true, time: Date.now() },
      CACHE_TTL.PRODUCTS
    );
    return { success: true };
  },
};
