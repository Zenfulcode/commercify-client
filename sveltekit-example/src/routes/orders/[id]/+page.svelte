<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<svelte:head>
  <title>Order Confirmation - Commercify</title>
</svelte:head>

<div class="container">
  {#if !data.success || !data.order}
    <div class="error-page">
      <h1>Order Not Found</h1>
      <p>{data.error}</p>
      <a href="/products" class="cta-button">Continue Shopping</a>
    </div>
  {:else}
    <div class="success-page">
      <div class="success-header">
        <div class="checkmark">✓</div>
        <h1>Order Confirmed!</h1>
        <p>
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <div class="order-details">
        <div class="order-info">
          <h2>Order Details</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Order ID:</span>
              <span class="value">#{data.order.id}</span>
            </div>
            <div class="info-item">
              <span class="label">Order Date:</span>
              <span class="value">{formatDate(data.order.created_at)}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value status-{data.order.status}"
                >{data.order.status}</span
              >
            </div>
            <div class="info-item">
              <span class="label">Total:</span>
              <span class="value total"
                >{formatCurrency(
                  data.order.final_amount,
                  data.order.currency
                )}</span
              >
            </div>
          </div>
        </div>

        <div class="customer-info">
          <h3>Customer Information</h3>
          <div class="customer-details">
            <p>
              <strong>Name:</strong>
              {data.order.customer.full_name}
            </p>
            <p><strong>Email:</strong> {data.order.customer.email}</p>
            <p><strong>Phone:</strong> {data.order.customer.phone}</p>
          </div>
        </div>

        <div class="shipping-info">
          <h3>Shipping Address</h3>
          <div class="address">
            <p>{data.order.shipping_address.address_line1}</p>
            {#if data.order.shipping_address.address_line2}
              <p>{data.order.shipping_address.address_line2}</p>
            {/if}
            <p>
              {data.order.shipping_address.city}, {data.order.shipping_address
                .state}
              {data.order.shipping_address.postal_code}
            </p>
            <p>{data.order.shipping_address.country}</p>
          </div>
        </div>

        <div class="billing-info">
          <h3>Billing Address</h3>
          <div class="address">
            <p>{data.order.billing_address.address_line1}</p>
            {#if data.order.billing_address.address_line2}
              <p>{data.order.billing_address.address_line2}</p>
            {/if}
            <p>
              {data.order.billing_address.city}, {data.order.billing_address
                .state}
              {data.order.billing_address.postal_code}
            </p>
            <p>{data.order.billing_address.country}</p>
          </div>
        </div>
      </div>

      <div class="order-items">
        <h2>Order Items</h2>
        <div class="items-list">
          {#each data.order.items as item}
            <div class="order-item">
              <div class="item-info">
                <h4>{item.product_name}</h4>
                {#if item.variant_name}
                  <p class="variant">{item.variant_name}</p>
                {/if}
                <p class="sku">SKU: {item.sku}</p>
              </div>
              <div class="item-quantity">
                <span>Qty: {item.quantity}</span>
              </div>
              <div class="item-price">
                <span class="price"
                  >{formatCurrency(item.unit_price, data.order.currency)}</span
                >
                <span class="subtotal"
                  >{formatCurrency(item.total_price, data.order.currency)}</span
                >
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-lines">
          <div class="summary-line">
            <span>Subtotal:</span>
            <span
              >{formatCurrency(
                data.order.total_amount,
                data.order.currency
              )}</span
            >
          </div>
          {#if data.order.shipping_cost > 0}
            <div class="summary-line">
              <span>Shipping:</span>
              <span
                >{formatCurrency(
                  data.order.shipping_cost,
                  data.order.currency
                )}</span
              >
            </div>
          {/if}
          {#if data.order.discount_amount > 0}
            <div class="summary-line discount">
              <span>Discount:</span>
              <span
                >-{formatCurrency(
                  data.order.discount_amount,
                  data.order.currency
                )}</span
              >
            </div>
          {/if}
          <div class="summary-line total">
            <span>Total:</span>
            <span
              >{formatCurrency(
                data.order.final_amount,
                data.order.currency
              )}</span
            >
          </div>
        </div>
      </div>

      <div class="actions">
        <a href="/products" class="cta-button">Continue Shopping</a>
        <button onclick={() => window.print()} class="print-button"
          >Print Order</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .error-page {
    text-align: center;
    padding: 4rem 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
  }

  .error-page h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .error-page p {
    margin-bottom: 2rem;
  }

  .success-page {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .success-header {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    text-align: center;
    padding: 3rem 2rem;
  }

  .checkmark {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 1rem;
  }

  .success-header h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
  }

  .success-header p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }

  .order-details {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .order-info {
    margin-bottom: 2rem;
  }

  .order-info h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 6px;
  }

  .label {
    font-weight: 500;
    color: #6b7280;
  }

  .value {
    font-weight: 600;
    color: #374151;
  }

  .value.total {
    color: #059669;
    font-size: 1.1rem;
  }

  .status-pending {
    color: #d97706;
  }

  .status-confirmed {
    color: #059669;
  }

  .status-shipped {
    color: #2563eb;
  }

  .status-delivered {
    color: #10b981;
  }

  .customer-info,
  .shipping-info,
  .billing-info {
    margin-bottom: 2rem;
  }

  .customer-info h3,
  .shipping-info h3,
  .billing-info h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: #374151;
  }

  .customer-details p,
  .address p {
    margin: 0.25rem 0;
    color: #6b7280;
  }

  .order-items {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .order-items h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
  }

  .order-item {
    display: grid;
    grid-template-columns: 2fr auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .order-item:last-child {
    border-bottom: none;
  }

  .item-info h4 {
    margin: 0 0 0.25rem 0;
    color: #374151;
  }

  .variant {
    margin: 0 0 0.25rem 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .sku {
    margin: 0;
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .item-quantity {
    text-align: center;
    color: #6b7280;
  }

  .item-price {
    text-align: right;
  }

  .price {
    display: block;
    font-size: 0.9rem;
    color: #6b7280;
  }

  .subtotal {
    display: block;
    font-weight: 600;
    color: #374151;
  }

  .order-summary {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .order-summary h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
  }

  .summary-lines {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .summary-line:not(.total) {
    border-bottom: 1px solid #f3f4f6;
  }

  .summary-line.discount {
    color: #059669;
  }

  .summary-line.total {
    font-weight: 600;
    font-size: 1.1rem;
    border-top: 2px solid #374151;
    padding-top: 1rem;
    margin-top: 0.5rem;
    color: #374151;
  }

  .actions {
    padding: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cta-button {
    display: inline-block;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .cta-button:hover {
    background: #2563eb;
  }

  .print-button {
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .print-button:hover {
    background: #4b5563;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .success-header {
      padding: 2rem 1rem;
    }

    .success-header h1 {
      font-size: 2rem;
    }

    .order-details,
    .order-items,
    .order-summary,
    .actions {
      padding: 1.5rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .order-item {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .item-quantity,
    .item-price {
      text-align: left;
    }

    .actions {
      flex-direction: column;
    }
  }

  @media print {
    .actions {
      display: none;
    }

    .success-page {
      box-shadow: none;
    }

    .success-header {
      background: #374151 !important;
      color: white !important;
    }
  }
</style>
