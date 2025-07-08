import { PRIVATE_API_URL } from "$env/static/private";
import type { RequestEvent } from "@sveltejs/kit";
import { CommercifyApiClient } from "commercify-api-client";
import {
  serverCache,
  CACHE_TTL,
  getCachedOrFetch,
  getSessionCacheKey,
  CheckoutSessionCache,
} from "./cache.js";
import type {
  AddToCheckoutRequest,
  SetCustomerDetailsRequest,
  SetShippingAddressRequest,
  SetBillingAddressRequest,
  SetShippingMethodRequest,
} from "commercify-api-client";
import {
  mapProductDTOToProduct,
  mapProductListResponse,
} from "../mappers/product.js";
import type { Product } from "../types/product.js";

/**
 * Cached API client wrapper that adds caching to API operations
 */
export class CachedCommercifyApiClient {
  private client: CommercifyApiClient;
  private sessionId: string | null = null;

  constructor(client: CommercifyApiClient) {
    this.client = client;
    // Extract session ID from cookies for cache keying
    const cookieHeader = client["cookieHeader"];
    if (cookieHeader) {
      const match = cookieHeader.match(/checkout_session_id=([^;]+)/);
      this.sessionId = match ? match[1] : null;
    }
  }

  // Products endpoint with caching and mapping to application types
  get products() {
    return {
      search: async (request: any) => {
        const cacheKey = `products:search:${JSON.stringify(request)}`;

        return getCachedOrFetch(
          cacheKey,
          () => this.client.products.search(request, mapProductListResponse),
          CACHE_TTL.PRODUCTS
        );
      },

      get: async (productId: number): Promise<Product> => {
        const cacheKey = `product:${productId}`;

        return getCachedOrFetch(
          cacheKey,
          () => this.client.products.get(productId, mapProductDTOToProduct),
          CACHE_TTL.PRODUCTS
        );
      },
    };
  }

  // Checkout endpoint with session-based caching and cache invalidation on mutations
  get checkout() {
    return {
      get: async () => {
        if (!this.sessionId) {
          return this.client.checkout.get();
        }

        // Try session cache first
        const cached = CheckoutSessionCache.get(this.sessionId);
        if (cached) {
          return cached;
        }

        // Fetch and cache
        const checkout = await this.client.checkout.get();
        CheckoutSessionCache.set(this.sessionId, checkout);
        return checkout;
      },

      addItem: async (request: AddToCheckoutRequest) => {
        const result = await this.client.checkout.addItem(request);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      updateItem: async (sku: string, updateRequest: { quantity: number }) => {
        const result = await this.client.checkout.updateItem(
          sku,
          updateRequest
        );

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      removeItem: async (sku: string) => {
        const result = await this.client.checkout.removeItem(sku);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      setCustomerDetails: async (request: SetCustomerDetailsRequest) => {
        const result = await this.client.checkout.setCustomerDetails(request);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      setShippingAddress: async (request: SetShippingAddressRequest) => {
        const result = await this.client.checkout.setShippingAddress(request);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      setBillingAddress: async (request: SetBillingAddressRequest) => {
        const result = await this.client.checkout.setBillingAddress(request);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      setShippingMethod: async (request: SetShippingMethodRequest) => {
        const result = await this.client.checkout.setShippingMethod(request);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      applyDiscount: async (discountCode: string) => {
        const result = await this.client.checkout.applyDiscount(discountCode);

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      removeDiscount: async () => {
        const result = await this.client.checkout.removeDiscount();

        // Invalidate checkout cache after mutation
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },

      complete: async (paymentProvider: string, paymentData: any) => {
        const result = await this.client.checkout.complete(
          paymentProvider,
          paymentData
        );

        // Invalidate checkout cache after completion
        if (this.sessionId) {
          CheckoutSessionCache.invalidate(this.sessionId);
        }

        return result;
      },
    };
  }

  // Orders endpoint with caching
  get orders() {
    return {
      get: async (id: string) => {
        const cacheKey = `order:${id}`;

        return getCachedOrFetch(
          cacheKey,
          () => this.client.orders.get(id),
          CACHE_TTL.ORDER
        );
      },
    };
  }

  // Proxy other methods that don't need caching
  setAuthToken(token: string) {
    return this.client.setAuthToken(token);
  }

  setCookieHeader(cookieHeader: string) {
    return this.client.setCookieHeader(cookieHeader);
  }

  setCookieStore(cookieStore: any) {
    return this.client.setCookieStore(cookieStore);
  }
}

/**
 * Creates a new API client instance with proper bidirectional cookie forwarding and caching.
 * This ensures the checkout_session_id cookie is passed through to the backend
 * and any cookies set by the backend are forwarded back to the browser.
 * @param event The SvelteKit request event containing cookies
 * @param authToken Optional JWT to authenticate requests
 * @returns A configured and cached CommercifyApiClient instance
 */
export const createApiClient = (
  event: RequestEvent,
  authToken?: string | null
) => {
  const client = new CommercifyApiClient(PRIVATE_API_URL);

  if (authToken) {
    client.setAuthToken(authToken);
  }

  // Forward all cookies from the browser to the API
  // This is crucial for checkout session persistence
  const cookieHeader = event.request.headers.get("cookie");
  if (cookieHeader) {
    client.setCookieHeader(cookieHeader);
  }

  // Pass the SvelteKit cookies object so the client can set cookies
  // when the API sends Set-Cookie headers
  client.setCookieStore(event.cookies);

  // Wrap with caching functionality
  return new CachedCommercifyApiClient(client);
};
