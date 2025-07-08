# Product Mappers and Application Types

This directory contains the extended SvelteKit example that demonstrates the use of mappers to transform API DTOs into application-specific domain types.

## Overview

The example has been extended to include:

1. **Application Types** (`src/lib/types/product.ts`) - Clean, domain-focused interfaces
2. **Mappers** (`src/lib/mappers/product.ts`) - Functions to transform API DTOs to application types
3. **Enhanced API Client** - Uses mappers to return application types instead of raw DTOs
4. **Updated UI Components** - Leverages the new type structure for better UX

## Key Features

### 🎯 Application Types

The application uses clean, camelCase domain types instead of the snake_case API DTOs:

```typescript
// Application types (clean, domain-focused)
interface Product {
  id: number;
  name: string;
  price: Price; // Rich Price object
  hasVariants: boolean; // camelCase
  isActive: boolean; // camelCase
  categoryId: string | null;
  // ... more fields
}

interface Price {
  amount: number;
  currency: string;
  formatted: string; // "$29.99"
}
```

### 🔄 Automatic Mapping

The API client automatically maps DTOs to application types:

```typescript
// Before (raw DTO)
const product = await api.products.get(123);
console.log(product.has_variants, product.price); // snake_case, raw number

// After (mapped application type)
const product = await api.products.get(123);
console.log(product.hasVariants, product.price.formatted); // camelCase, rich objects
```

### 💰 Rich Price Objects

Prices are automatically formatted for display:

```typescript
// API returns: { price: 29.99, currency: "USD" }
// Mapper creates: {
//   amount: 29.99,
//   currency: "USD",
//   formatted: "$29.99"
// }
```

### 🎨 Enhanced Product Details

The new product detail page (`/products/[id]`) showcases:

- **Variant Selection** - Interactive variant switching
- **Rich Product Information** - Stock levels, weights, attributes
- **Price Formatting** - Automatic currency formatting
- **Image Galleries** - Support for multiple product/variant images
- **Responsive Design** - Mobile-friendly layout

## File Structure

```
src/lib/
├── types/
│   └── product.ts          # Application domain types
├── mappers/
│   └── product.ts          # DTO → Application type mappers
└── server/
    └── api.ts             # Enhanced API client with mappers

src/routes/
├── products/
│   ├── +page.svelte       # Product listing (updated)
│   ├── +page.server.ts    # Uses mapped types
│   └── [id]/
│       ├── +page.svelte   # Detailed product view
│       └── +page.server.ts # Single product loading

demo/
└── product-mapping.ts     # Mapping demonstration
```

## Usage Examples

### Basic Product Listing

```typescript
// Server-side (automatically mapped)
export const load = async ({ locals }) => {
  const productsResponse = await locals.api.products.search({});
  return {
    products: productsResponse.data, // Already mapped to Product[]
  };
};
```

```svelte
<!-- Client-side (clean application types) -->
{#each data.products as product}
  <div class="product">
    <h3>{product.name}</h3>
    <p>{product.price.formatted}</p>
    <p>{product.hasVariants ? 'Multiple options' : 'Single option'}</p>
  </div>
{/each}
```

### Variant Management

```svelte
<script lang="ts">
  let selectedVariant: ProductVariant | null = $state(null);

  function selectVariant(variant: ProductVariant) {
    selectedVariant = variant;
  }

  function getCurrentPrice() {
    return selectedVariant ? selectedVariant.price : product.price;
  }
</script>

<div class="price">{getCurrentPrice().formatted}</div>
```

## Key Benefits

1. **Type Safety** - Strong typing throughout the application
2. **Consistency** - Uniform camelCase naming conventions
3. **Rich Objects** - Price formatting, computed properties
4. **Maintainability** - Clear separation between API and domain concerns
5. **Developer Experience** - Better autocomplete and error detection

## Testing the Implementation

1. Start the development server:

   ```bash
   cd sveltekit-example
   pnpm dev
   ```

2. Visit the products page: `http://localhost:5173/products`

3. Click on individual products to see the detailed view with variant support

4. Check the browser console to see the mapped data structures

## Demo Script

Run the mapping demonstration:

```bash
cd sveltekit-example
npx tsx demo/product-mapping.ts
```

This will show the before/after transformation of API DTOs to application types.

## Extending the Mappers

To add mapping for other entities (orders, checkout, etc.), follow the same pattern:

1. Create application types in `src/lib/types/`
2. Create mappers in `src/lib/mappers/`
3. Update the API client to use the mappers
4. Update UI components to use the new types

The mapper infrastructure is fully functional and ready for extension across the entire API surface.
