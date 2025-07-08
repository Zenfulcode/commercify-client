<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Product, ProductVariant } from "$lib/types/product.js";

  let { data } = $props();
  let selectedVariant: ProductVariant | null = $state(null);
  let selectedQuantity = $state(1);

  // Set default selected variant
  $effect(() => {
    if (data.product.hasVariants && data.product.variants.length > 0) {
      selectedVariant =
        data.product.variants.find((v: ProductVariant) => v.isDefault) ||
        data.product.variants[0];
    }
  });

  function selectVariant(variant: ProductVariant) {
    selectedVariant = variant;
    selectedQuantity = 1; // Reset quantity when changing variants
  }

  function getCurrentPrice() {
    return selectedVariant ? selectedVariant.price : data.product.price;
  }

  function getCurrentStock() {
    return selectedVariant ? selectedVariant.stock : data.product.stock;
  }

  function getCurrentSku() {
    return selectedVariant ? selectedVariant.sku : data.product.sku;
  }

  function getCurrentWeight() {
    return selectedVariant?.weight || data.product.weight;
  }
</script>

<div class="product-detail">
  <div class="breadcrumb">
    <a href="/products">← Back to Products</a>
  </div>

  <div class="product-layout">
    <div class="product-images">
      {#if data.product.images && data.product.images.length > 0}
        <div class="main-image">
          <img
            src={selectedVariant?.images?.[0] || data.product.images[0]}
            alt={data.product.name}
          />
        </div>
        <div class="image-thumbnails">
          {#each selectedVariant?.images || data.product.images as image, index}
            <img
              src={image}
              alt="{data.product.name} - Image {index + 1}"
              class="thumbnail"
            />
          {/each}
        </div>
      {:else}
        <div class="no-image">
          <p>No image available</p>
        </div>
      {/if}
    </div>

    <div class="product-info">
      <h1>{data.product.name}</h1>
      <p class="price">{getCurrentPrice().formatted}</p>
      <p class="description">{data.product.description}</p>

      <div class="product-meta">
        <div class="meta-item">
          <span class="label">SKU:</span>
          <span class="value">{getCurrentSku()}</span>
        </div>
        <div class="meta-item">
          <span class="label">Stock:</span>
          <span
            class="value stock-{getCurrentStock() > 0 ? 'available' : 'out'}"
          >
            {getCurrentStock() > 0
              ? `${getCurrentStock()} available`
              : "Out of stock"}
          </span>
        </div>
        {#if getCurrentWeight()}
          <div class="meta-item">
            <span class="label">Weight:</span>
            <span class="value">{getCurrentWeight()}g</span>
          </div>
        {/if}
        <div class="meta-item">
          <span class="label">Status:</span>
          <span
            class="value status-{data.product.isActive ? 'active' : 'inactive'}"
          >
            {data.product.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {#if data.product.categoryId}
          <div class="meta-item">
            <span class="label">Category ID:</span>
            <span class="value">{data.product.categoryId}</span>
          </div>
        {/if}
      </div>

      {#if data.product.hasVariants && data.product.variants.length > 0}
        <div class="variants-section">
          <h3>Available Variants</h3>
          <div class="variants-grid">
            {#each data.product.variants as variant}
              <button
                class="variant-card {selectedVariant?.id === variant.id
                  ? 'selected'
                  : ''}"
                onclick={() => selectVariant(variant)}
                disabled={variant.stock === 0}
              >
                <div class="variant-sku">{variant.sku}</div>
                <div class="variant-price">{variant.price.formatted}</div>
                <div class="variant-stock">
                  {variant.stock > 0
                    ? `${variant.stock} in stock`
                    : "Out of stock"}
                </div>
                {#if Object.keys(variant.attributes).length > 0}
                  <div class="variant-attributes">
                    {#each Object.entries(variant.attributes) as [key, value]}
                      <span class="attribute">{key}: {value}</span>
                    {/each}
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <form
        method="POST"
        action="/products?/addToCart"
        use:enhance
        class="add-to-cart-form"
      >
        <input type="hidden" name="sku" value={getCurrentSku()} />

        <div class="quantity-section">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            bind:value={selectedQuantity}
            min="1"
            max={Math.min(10, getCurrentStock())}
            disabled={getCurrentStock() === 0}
          />
        </div>

        <button
          type="submit"
          class="add-to-cart-btn"
          disabled={getCurrentStock() === 0 || !data.product.isActive}
        >
          {getCurrentStock() === 0
            ? "Out of Stock"
            : !data.product.isActive
              ? "Product Unavailable"
              : "Add to Cart"}
        </button>
      </form>

      {#if data.product.createdAt || data.product.updatedAt}
        <div class="timestamps">
          {#if data.product.createdAt}
            <p class="timestamp">
              Created: {new Date(data.product.createdAt).toLocaleDateString()}
            </p>
          {/if}
          {#if data.product.updatedAt}
            <p class="timestamp">
              Updated: {new Date(data.product.updatedAt).toLocaleDateString()}
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .product-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .breadcrumb {
    margin-bottom: 2rem;
  }

  .breadcrumb a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .product-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .product-images {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .image-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
  }

  .thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .thumbnail:hover {
    border-color: #3b82f6;
  }

  .no-image {
    width: 100%;
    height: 400px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  }

  .product-info h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #111827;
  }

  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #059669;
    margin-bottom: 1rem;
  }

  .description {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .product-meta {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .meta-item:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: #374151;
  }

  .value {
    color: #6b7280;
  }

  .stock-available {
    color: #059669;
    font-weight: 500;
  }

  .stock-out {
    color: #dc2626;
    font-weight: 500;
  }

  .status-active {
    color: #059669;
    font-weight: 500;
  }

  .status-inactive {
    color: #dc2626;
    font-weight: 500;
  }

  .variants-section {
    margin-bottom: 2rem;
  }

  .variants-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #111827;
  }

  .variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .variant-card {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .variant-card:hover:not(:disabled) {
    border-color: #3b82f6;
    transform: translateY(-1px);
  }

  .variant-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .variant-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .variant-sku {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .variant-price {
    color: #059669;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .variant-stock {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .variant-attributes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .attribute {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .add-to-cart-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .quantity-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .quantity-section label {
    font-weight: 500;
    color: #374151;
  }

  .quantity-section input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    text-align: center;
  }

  .add-to-cart-btn {
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-to-cart-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .add-to-cart-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .timestamps {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .timestamp {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.25rem 0;
  }

  @media (max-width: 768px) {
    .product-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .product-detail {
      padding: 1rem;
    }
  }
</style>
