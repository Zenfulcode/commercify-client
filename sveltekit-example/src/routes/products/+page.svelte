<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }
</script>

<div class="container">
  <div class="header">
    <h1>Products</h1>
    <a href="/checkout" class="cart-link">View Cart</a>
  </div>

  {#if form?.success}
    <div class="success-message">
      ✅ {form.message}
    </div>
  {/if}

  {#if form?.error}
    <div class="error-message">
      ⚠️ {form.error}
    </div>
  {/if}

  {#if !data.success}
    <div class="error">
      <p>⚠️ {data.error}</p>
    </div>
  {:else if data.products.length === 0}
    <div class="empty">
      <p>No products available at the moment.</p>
      <p>Try adding some sample products to your cart:</p>

      <!-- Sample products for demonstration -->
      <div class="sample-products">
        <div class="product-card">
          <h3>Sample T-Shirt</h3>
          <p class="price">{formatCurrency(25.99)}</p>
          <p class="description">
            A comfortable cotton t-shirt perfect for everyday wear.
          </p>
          <form method="POST" action="?/addToCart" use:enhance>
            <input type="hidden" name="sku" value="sample-tshirt-001" />
            <div class="quantity-input">
              <label for="quantity-1">Quantity:</label>
              <input
                type="number"
                id="quantity-1"
                name="quantity"
                value="1"
                min="1"
                max="10"
              />
            </div>
            <button type="submit" class="add-to-cart">Add to Cart</button>
          </form>
        </div>

        <div class="product-card">
          <h3>Sample Jeans</h3>
          <p class="price">{formatCurrency(79.99)}</p>
          <p class="description">
            Classic blue jeans that never go out of style.
          </p>
          <form method="POST" action="?/addToCart" use:enhance>
            <input type="hidden" name="sku" value="sample-jeans-001" />
            <div class="quantity-input">
              <label for="quantity-2">Quantity:</label>
              <input
                type="number"
                id="quantity-2"
                name="quantity"
                value="1"
                min="1"
                max="10"
              />
            </div>
            <button type="submit" class="add-to-cart">Add to Cart</button>
          </form>
        </div>

        <div class="product-card">
          <h3>Sample Sneakers</h3>
          <p class="price">{formatCurrency(120.0)}</p>
          <p class="description">
            Comfortable running sneakers for your active lifestyle.
          </p>
          <form method="POST" action="?/addToCart" use:enhance>
            <input type="hidden" name="sku" value="sample-sneakers-001" />
            <div class="quantity-input">
              <label for="quantity-3">Quantity:</label>
              <input
                type="number"
                id="quantity-3"
                name="quantity"
                value="1"
                min="1"
                max="10"
              />
            </div>
            <button type="submit" class="add-to-cart">Add to Cart</button>
          </form>
        </div>
      </div>
    </div>
  {:else}
    <div class="products-grid">
      {#each data.products as product}
        <div class="product-card">
          {#if product.images && product.images.length > 0}
            <img
              src={product.images[0]}
              alt={product.name}
              class="product-image"
            />
          {/if}
          <h3>{product.name}</h3>
          <p class="price">{formatCurrency(product.price)}</p>
          <p class="description">{product.description}</p>

          <form method="POST" action="?/addToCart" use:enhance>
            <input type="hidden" name="sku" value={product.sku} />
            <div class="quantity-input">
              <label for="quantity-{product.id}">Quantity:</label>
              <input
                type="number"
                id="quantity-{product.id}"
                name="quantity"
                value="1"
                min="1"
                max="10"
              />
            </div>
            <button type="submit" class="add-to-cart">Add to Cart</button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    color: #333;
  }

  .cart-link {
    background: #3b82f6;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .cart-link:hover {
    background: #2563eb;
  }

  .success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .products-grid,
  .sample-products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .product-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .product-card h3 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #059669;
    margin: 0 0 1rem 0;
  }

  .description {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .quantity-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .quantity-input label {
    font-weight: 500;
    color: #374151;
  }

  .quantity-input input {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    text-align: center;
  }

  .add-to-cart {
    width: 100%;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-to-cart:hover {
    background: #2563eb;
  }

  .error {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 1rem;
    color: #dc2626;
    text-align: center;
  }

  .empty {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .empty p {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .products-grid,
    .sample-products {
      grid-template-columns: 1fr;
    }
  }
</style>
