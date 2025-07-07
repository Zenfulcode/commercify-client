# SvelteKit 5 + Commercify API Client Example

This is a SvelteKit 5 application that demonstrates integration with the `commercify-api-client` package for e-commerce functionality.

## Features

- 🏪 **Product Catalog**: Browse and search products using server-side API integration
- 🛒 **Shopping Cart**: Session-based checkout management with cookie handling
- 🔒 **Secure Integration**: API credentials and session management handled server-side
- ⚡ **Type Safety**: Full TypeScript support with auto-generated types from the API
- � **Performance Cache**: Smart caching system reduces API calls and improves response times
- 🛠️ **Cache Administration**: Built-in tools for cache management and monitoring
- �📱 **Responsive Design**: Mobile-friendly interface

## Architecture

This application follows SvelteKit best practices for API integration:

- **Server-Side Only**: The `commercify-api-client` is only used on the server side to keep API credentials secure
- **Load Functions**: Data is fetched in `+page.server.ts` files using the API client
- **Server Hooks**: API client instance is created per request and attached to `event.locals`
- **Session Management**: Checkout sessions are maintained via cookies automatically
- **Smart Caching**: Intelligent caching layer with TTL, session isolation, and automatic invalidation

## Caching System

The application includes a comprehensive caching system that:

- **Reduces API Calls**: Frequently accessed data is cached in memory
- **Improves Performance**: Faster page loads through intelligent caching
- **Session Isolation**: Each user's checkout data is cached separately
- **Smart Invalidation**: Cache is automatically cleared when data changes
- **Administrative Tools**: Built-in cache management interface

### Cache Features

- **TTL Management**: Different data types have different cache durations
- **Pattern-based Clearing**: Clear multiple cache entries using regex patterns
- **Memory Monitoring**: Track cache size and prevent memory leaks
- **Development-friendly**: Easy debugging and cache inspection

See [CACHING.md](./CACHING.md) for detailed caching documentation.

## Project Structure

```
src/
├── hooks.server.ts           # Server hooks for API client setup
├── app.d.ts                  # TypeScript definitions including API client types
├── lib/
│   ├── cache.ts              # Client-side cache utilities
│   └── server/
│       ├── api.ts            # Cached API client wrapper
│       └── cache.ts          # Server-side cache implementation
└── routes/
    ├── +page.svelte          # Landing page with demo overview
    ├── products/
    │   ├── +page.server.ts   # Product data loading (cached)
    │   └── +page.svelte      # Product listing UI
    ├── checkout/
    │   ├── +page.server.ts   # Checkout data loading (cached)
    │   └── +page.svelte      # Shopping cart UI
    ├── admin/
    │   └── cache/
    │       ├── +page.server.ts # Cache administration logic
    │       └── +page.svelte    # Cache management interface
    └── api/
        └── cache-test/
            ├── +page.server.ts # Cache testing endpoints
            └── +page.svelte    # Cache testing interface
```

## Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_API_URL="https://api.commercify.com"
```

The `PRIVATE_` prefix ensures this variable is only available on the server side.

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start development server**:

   ```bash
   pnpm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

## API Integration Example

### Server-Side Data Loading

```typescript
// src/routes/products/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const productsResponse = await locals.api.products.search({});
    return {
      products: Array.isArray(productsResponse) ? productsResponse : [],
      success: true,
    };
  } catch (error) {
    return {
      products: [],
      success: false,
      error: "Failed to load products",
    };
  }
};
```

### Component Usage

```svelte
<!-- src/routes/products/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#if data.success}
	{#each data.products as product}
		<div class="product-card">
			<h3>{product.name}</h3>
			<p>${product.price}</p>
		</div>
	{/each}
{/if}
```

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run check` - Run type checking

## Learn More

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Commercify API Client README](../README.md)
- [SvelteKit Best Practices](https://svelte.dev/docs/kit/best-practices)
