# Commercify API Client

This package provides a convenient way to interact with the Commercify e-commerce backend API from your frontend application.

## Installation

```bash
npm install commercify-api-client
# or
yarn add commercify-api-client
```

This client uses `axios` as a peer dependency, so you will also need to install it in your project:

```bash
npm install axios
# or
yarn add axios
```

## Getting Started

First, create an instance of the API client, providing the base URL of your Commercify backend.

```typescript
import { CommercifyApiClient } from "commercify-api-client";

const apiClient = new CommercifyApiClient("https://api.your-store.com");
```

## Authentication

For endpoints that require authentication, you can set the JWT using the `setAuthToken` method. This is typically done after a user logs in.

```typescript
const jwt = "your-user-jwt-token";
apiClient.setAuthToken(jwt);
```

The client will then automatically include the `Authorization: Bearer <token>` header in all subsequent requests.

### Cookie Handling

The client is also configured to automatically handle cookies. By setting `withCredentials: true`, it will send and receive session cookies, such as the `checkout_session_id`, which is necessary for persisting a user's cart between requests.

---

## Usage in a SvelteKit 5 Application

SvelteKit's server-side capabilities allow you to use this API client securely without exposing your API URL or credentials to the browser.

### 1. Set Environment Variables

In your `.env` file, store your API URL. Prefixing it with `PRIVATE_` ensures it is only available on the server.

**/.env**

```env
PRIVATE_API_URL="https://api.your-store.com"
```

### 2. Create a Server-Side API Module

Create a reusable module to instantiate the client on the server.

**/src/lib/server/api.ts**

```typescript
import { CommercifyApiClient } from "commercify-api-client";
import { PRIVATE_API_URL } from "$env/static/private";

export const createApiClient = (authToken?: string | null) => {
  const client = new CommercifyApiClient(PRIVATE_API_URL);
  if (authToken) {
    client.setAuthToken(authToken);
  }
  return client;
};
```

### 3. Use Server Hooks

Use a server hook to create a client instance for every request and attach it to the `event.locals` object. This makes the client available to all your `load` functions and `actions`.

First, update your `app.d.ts` to type `locals`:

**/src/app.d.ts**

```typescript
declare global {
  namespace App {
    interface Locals {
      api: import("commercify-api-client").CommercifyApiClient;
    }
  }
}

export {};
```

Next, create the hook. This example reads an auth token from a secure, `httpOnly` cookie.

**/src/hooks.server.ts**

```typescript
import { createApiClient } from "$lib/server/api";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const authToken = event.cookies.get("auth_token");
  event.locals.api = createApiClient(authToken);
  return await resolve(event);
};
```

### 4. Fetch Data in a `load` Function

Now you can access the pre-configured client in any `+page.server.ts` or `+layout.server.ts` file.

**/src/routes/products/+page.server.ts**

```typescript
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // locals.api is the client instance from our hook
  const products = await locals.api.products.search({});

  return {
    products: products.items,
  };
};
```

---

## Usage in a React Application

In a client-side React app, you'll initialize the client and use it within your components.

### 1. Set Environment Variables

Store your public API URL in a `.env` file.

**/.env**

```env
REACT_APP_API_URL="https://api.your-store.com"
```

### 2. Create an API Client Instance

It's good practice to create a single, shared instance of the client.

**/src/apiClient.ts**

```typescript
import { CommercifyApiClient } from "commercify-api-client";

export const apiClient = new CommercifyApiClient(
  process.env.REACT_APP_API_URL!
);
```

### 3. Fetch Data in a Component

You can use the `useEffect` and `useState` hooks to fetch data when a component mounts.

**/src/components/ProductList.tsx**

```tsx
import React, { useState, useEffect } from "react";
import { apiClient } from "../apiClient";
import { ProductDTO } from "commercify-api-client";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.products.search({});
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
```

**Tip**: For larger applications, consider using React Context to provide the `apiClient` instance to your component tree, avoiding the need to import it in every file.

---

## Using Mappers

If you need to transform the API data transfer objects (DTOs) into a different shape for your application, you can pass an optional `mapper` function to any API method.

```typescript
// 1. Define your application-specific type
interface ApplicationProduct {
  id: number;
  productName: string;
}

// 2. Create a mapper function
const productMapper = (dto: ProductDTO): ApplicationProduct => {
  return {
    id: dto.id,
    productName: dto.name,
  };
};

// 3. Pass the mapper to the API call
const myProduct: ApplicationProduct = await apiClient.products.get(
  123,
  productMapper
);

console.log(myProduct.productName); // Already in your desired format!
```
