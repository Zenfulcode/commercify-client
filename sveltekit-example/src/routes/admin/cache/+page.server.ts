import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import {
  serverCache,
  getCacheStats,
  CheckoutSessionCache,
} from "$lib/server/cache.js";

export const load = async () => {
  const stats = getCacheStats();

  return {
    cacheStats: stats,
    totalEntries: stats.size,
    keys: stats.keys.sort(),
  };
};

export const actions: Actions = {
  clearAll: async () => {
    try {
      serverCache.clear();
      return { success: true, message: "All cache cleared successfully" };
    } catch (error) {
      console.error("Failed to clear cache:", error);
      return fail(500, { error: "Failed to clear cache" });
    }
  },

  clearPattern: async ({ request }) => {
    const data = await request.formData();
    const pattern = data.get("pattern") as string;

    if (!pattern) {
      return fail(400, { error: "Pattern is required" });
    }

    try {
      serverCache.invalidatePattern(pattern);
      return {
        success: true,
        message: `Cleared cache entries matching pattern: ${pattern}`,
      };
    } catch (error) {
      console.error("Failed to clear cache pattern:", error);
      return fail(500, { error: "Failed to clear cache pattern" });
    }
  },

  clearSpecific: async ({ request }) => {
    const data = await request.formData();
    const key = data.get("key") as string;

    if (!key) {
      return fail(400, { error: "Key is required" });
    }

    try {
      serverCache.invalidate(key);
      return { success: true, message: `Cleared cache entry: ${key}` };
    } catch (error) {
      console.error("Failed to clear cache key:", error);
      return fail(500, { error: "Failed to clear cache key" });
    }
  },

  clearCheckoutSessions: async () => {
    try {
      CheckoutSessionCache.invalidateAll();
      return { success: true, message: "All checkout session cache cleared" };
    } catch (error) {
      console.error("Failed to clear checkout sessions:", error);
      return fail(500, { error: "Failed to clear checkout sessions" });
    }
  },
};
