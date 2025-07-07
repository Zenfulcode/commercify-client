# Caching Implementation

This SvelteKit application implements a comprehensive caching system to improve performance and reduce API calls to the Commercify backend.

## Overview

The caching system consists of three main components:

1. **Server-side Cache** (`/src/lib/server/cache.ts`) - In-memory cache with TTL
2. **Client-side Cache** (`/src/lib/cache.ts`) - Browser-based caching utilities
3. **Cached API Client** (`/src/lib/server/api.ts`) - Wrapper around the commercify-api-client

## Server-side Caching

### Features

- **TTL (Time To Live)**: Each cache entry has an expiration time
- **Automatic Cleanup**: Expired entries are cleaned up periodically in production
- **Pattern-based Invalidation**: Clear multiple cache entries using regex patterns
- **Session-based Caching**: Special handling for checkout sessions
- **Memory Management**: Built-in size limits and monitoring

### Cache Keys

The system uses structured cache keys for organization:

- `products:search:{query_hash}` - Product search results
- `product:{id}` - Individual product data
- `checkout:{session_id}` - Checkout session data
- `order:{id}` - Order details
- `shipping-methods:{session_id}` - Available shipping methods

### TTL Configuration

Different data types have different cache durations:

```typescript
export const CACHE_TTL = {
  PRODUCTS: 10 * 60 * 1000, // 10 minutes
  PRODUCT: 5 * 60 * 1000, // 5 minutes
  CHECKOUT: 30 * 1000, // 30 seconds
  SHIPPING_METHODS: 5 * 60 * 1000, // 5 minutes
  ORDER: 60 * 60 * 1000, // 1 hour
  USER_SESSION: 30 * 60 * 1000, // 30 minutes
};
```

## Cached API Client

The `CachedCommercifyApiClient` wraps the original API client and adds caching logic:

### Read Operations (Cached)

- `products.search()` - Product searches cached by query
- `checkout.get()` - Checkout data cached by session
- `orders.get()` - Order details cached by ID

### Write Operations (Cache Invalidation)

All mutation operations automatically invalidate relevant cache entries:

- `checkout.addItem()` - Invalidates checkout cache
- `checkout.updateItem()` - Invalidates checkout cache
- `checkout.removeItem()` - Invalidates checkout cache
- `checkout.setCustomerDetails()` - Invalidates checkout cache
- `checkout.setShippingAddress()` - Invalidates checkout cache
- `checkout.setBillingAddress()` - Invalidates checkout cache
- `checkout.setShippingMethod()` - Invalidates checkout cache
- `checkout.applyDiscount()` - Invalidates checkout cache
- `checkout.removeDiscount()` - Invalidates checkout cache
- `checkout.complete()` - Invalidates checkout cache

## Cache Administration

Visit `/admin/cache` to:

- View cache statistics and current entries
- Clear all cache data
- Clear cache by pattern (regex)
- Clear specific cache keys
- Clear all checkout sessions

### Available Actions

1. **Clear All Cache** - Removes all cached data (use with caution)
2. **Clear Checkout Sessions** - Removes all checkout-related cache
3. **Clear by Pattern** - Use regex to target specific cache keys
4. **Clear Specific Key** - Remove individual cache entries

### Common Patterns

- `^products:` - Clear all product-related cache
- `checkout:.+` - Clear all checkout sessions
- `order:.+` - Clear all order cache

## Benefits

1. **Improved Performance**: Frequently accessed data is served from memory
2. **Reduced API Load**: Fewer calls to the backend API
3. **Better User Experience**: Faster page loads and interactions
4. **Smart Invalidation**: Cache is cleared when data changes
5. **Session Isolation**: Each user's checkout data is cached separately

## Best Practices

1. **Short TTL for Dynamic Data**: Checkout data has a short 30-second TTL
2. **Longer TTL for Static Data**: Product catalog cached for 10 minutes
3. **Immediate Invalidation**: Write operations clear relevant cache immediately
4. **Memory Monitoring**: Regular cleanup prevents memory leaks
5. **Development vs Production**: Cleanup only runs in production

## Monitoring

The cache system provides statistics and monitoring:

- Total number of cache entries
- List of all cache keys organized by type
- Memory usage tracking
- Cache hit/miss patterns (via logs)

## Future Enhancements

Potential improvements to consider:

1. **Redis Integration**: For distributed caching across multiple servers
2. **Cache Warming**: Pre-populate cache with frequently accessed data
3. **Analytics**: Track cache hit rates and performance metrics
4. **Smart Prefetching**: Anticipate user needs and cache data proactively
5. **Compression**: Compress cached data to reduce memory usage
