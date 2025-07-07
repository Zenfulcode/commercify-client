<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let currentStep = $state(1);
  let useShippingForBilling = $state(true);

  const checkout = $derived(data.checkout);
  const hasItems = $derived(checkout?.items && checkout.items.length > 0);
  const hasCustomerDetails = $derived(checkout?.customer_details?.email);
  const hasShippingAddress = $derived(
    checkout?.shipping_address?.address_line1
  );
  const hasBillingAddress = $derived(checkout?.billing_address?.address_line1);
  const hasShippingMethod = $derived(checkout?.shipping_method_id);

  // Auto-advance steps based on completion
  $effect(() => {
    if (
      hasItems &&
      hasCustomerDetails &&
      hasShippingAddress &&
      hasBillingAddress &&
      hasShippingMethod
    ) {
      currentStep = Math.max(currentStep, 5); // Payment step
    } else if (
      hasItems &&
      hasCustomerDetails &&
      hasShippingAddress &&
      hasBillingAddress
    ) {
      currentStep = Math.max(currentStep, 4); // Shipping method step
    } else if (hasItems && hasCustomerDetails && hasShippingAddress) {
      currentStep = Math.max(currentStep, 3); // Billing address step
    } else if (hasItems && hasCustomerDetails) {
      currentStep = Math.max(currentStep, 2); // Shipping address step
    } else if (hasItems) {
      currentStep = Math.max(currentStep, 1); // Customer details step
    }
  });

  function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }
</script>

<svelte:head>
  <title>Checkout - Commercify</title>
</svelte:head>

<div class="checkout-container">
  <div class="checkout-header">
    <h1>Checkout</h1>
    <div class="progress-bar">
      <div
        class="step"
        class:active={currentStep >= 1}
        class:completed={hasItems}
      >
        <span>1</span> Items
      </div>
      <div
        class="step"
        class:active={currentStep >= 2}
        class:completed={hasCustomerDetails}
      >
        <span>2</span> Details
      </div>
      <div
        class="step"
        class:active={currentStep >= 3}
        class:completed={hasShippingAddress}
      >
        <span>3</span> Shipping
      </div>
      <div
        class="step"
        class:active={currentStep >= 4}
        class:completed={hasBillingAddress}
      >
        <span>4</span> Billing
      </div>
      <div
        class="step"
        class:active={currentStep >= 5}
        class:completed={hasShippingMethod}
      >
        <span>5</span> Payment
      </div>
    </div>
  </div>

  <div class="checkout-content">
    <div class="checkout-main">
      <!-- Step 1: Items -->
      {#if currentStep === 1 || !hasItems}
        <section class="checkout-section">
          <h2>1. Your Items</h2>

          {#if checkout?.items && checkout.items.length > 0}
            <div class="cart-items">
              {#each checkout.items as item}
                <div class="cart-item">
                  <div class="item-info">
                    {#if item.image_url}
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        class="item-image"
                      />
                    {/if}
                    <div class="item-details">
                      <h4>{item.product_name}</h4>
                      {#if item.variant_name}
                        <p class="variant">{item.variant_name}</p>
                      {/if}
                      <p class="sku">SKU: {item.sku}</p>
                      <p class="price">
                        {formatCurrency(item.price, checkout.currency)}
                      </p>
                    </div>
                  </div>
                  <div class="item-actions">
                    <form method="POST" action="?/updateItem" use:enhance>
                      <input type="hidden" name="sku" value={item.sku} />
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        min="0"
                        class="quantity-input"
                        onchange={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (target?.form) {
                            target.form.requestSubmit();
                          }
                        }}
                      />
                    </form>
                    <p class="subtotal">
                      {formatCurrency(item.subtotal, checkout.currency)}
                    </p>
                  </div>
                </div>
              {/each}
            </div>

            <div class="add-item-form">
              <h3>Add Item</h3>
              <form method="POST" action="?/addItem" use:enhance>
                <div class="form-row">
                  <input
                    type="text"
                    name="sku"
                    placeholder="Product SKU"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value="1"
                    min="1"
                    required
                  />
                  <button type="submit">Add to Cart</button>
                </div>
              </form>
            </div>
          {:else}
            <div class="empty-cart">
              <p>Your cart is empty. Add some items to get started!</p>
              <form method="POST" action="?/addItem" use:enhance>
                <div class="form-row">
                  <input
                    type="text"
                    name="sku"
                    placeholder="Enter product SKU"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value="1"
                    min="1"
                    required
                  />
                  <button type="submit">Add Item</button>
                </div>
              </form>
            </div>
          {/if}

          {#if hasItems}
            <button class="next-button" onclick={() => (currentStep = 2)}>
              Continue to Customer Details
            </button>
          {/if}
        </section>
      {/if}

      <!-- Step 2: Customer Details -->
      {#if currentStep === 2 && hasItems}
        <section class="checkout-section">
          <h2>2. Customer Details</h2>

          <form method="POST" action="?/setCustomerDetails" use:enhance>
            <div class="form-group">
              <label for="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={checkout?.customer_details?.full_name || ""}
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={checkout?.customer_details?.email || ""}
                required
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={checkout?.customer_details?.phone || ""}
                required
              />
            </div>

            <button type="submit">Save Customer Details</button>
          </form>

          {#if hasCustomerDetails}
            <button class="next-button" onclick={() => (currentStep = 3)}>
              Continue to Shipping Address
            </button>
          {/if}
        </section>
      {/if}

      <!-- Step 3: Shipping Address -->
      {#if currentStep === 3 && hasCustomerDetails}
        <section class="checkout-section">
          <h2>3. Shipping Address</h2>

          <form method="POST" action="?/setShippingAddress" use:enhance>
            <div class="form-group">
              <label for="address_line1">Address Line 1</label>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                value={checkout?.shipping_address?.address_line1 || ""}
                required
              />
            </div>

            <div class="form-group">
              <label for="address_line2">Address Line 2 (Optional)</label>
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                value={checkout?.shipping_address?.address_line2 || ""}
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={checkout?.shipping_address?.city || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={checkout?.shipping_address?.state || ""}
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="postal_code">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={checkout?.shipping_address?.postal_code || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="country">Country</label>
                <select id="country" name="country" required>
                  <option
                    value="US"
                    selected={checkout?.shipping_address?.country === "US"}
                    >United States</option
                  >
                  <option
                    value="CA"
                    selected={checkout?.shipping_address?.country === "CA"}
                    >Canada</option
                  >
                  <option
                    value="GB"
                    selected={checkout?.shipping_address?.country === "GB"}
                    >United Kingdom</option
                  >
                  <option
                    value="DE"
                    selected={checkout?.shipping_address?.country === "DE"}
                    >Germany</option
                  >
                  <option
                    value="FR"
                    selected={checkout?.shipping_address?.country === "FR"}
                    >France</option
                  >
                </select>
              </div>
            </div>

            <button type="submit">Save Shipping Address</button>
          </form>

          {#if hasShippingAddress}
            <button class="next-button" onclick={() => (currentStep = 4)}>
              Continue to Billing Address
            </button>
          {/if}
        </section>
      {/if}

      <!-- Step 4: Billing Address -->
      {#if currentStep === 4 && hasShippingAddress}
        <section class="checkout-section">
          <h2>4. Billing Address</h2>

          <form method="POST" action="?/setBillingAddress" use:enhance>
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  name="use_shipping_address"
                  bind:checked={useShippingForBilling}
                />
                Use shipping address as billing address
              </label>
            </div>

            {#if !useShippingForBilling}
              <div class="form-group">
                <label for="billing_address_line1">Address Line 1</label>
                <input
                  type="text"
                  id="billing_address_line1"
                  name="billing_address_line1"
                  value={checkout?.billing_address?.address_line1 || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="billing_address_line2"
                  >Address Line 2 (Optional)</label
                >
                <input
                  type="text"
                  id="billing_address_line2"
                  name="billing_address_line2"
                  value={checkout?.billing_address?.address_line2 || ""}
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="billing_city">City</label>
                  <input
                    type="text"
                    id="billing_city"
                    name="billing_city"
                    value={checkout?.billing_address?.city || ""}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="billing_state">State</label>
                  <input
                    type="text"
                    id="billing_state"
                    name="billing_state"
                    value={checkout?.billing_address?.state || ""}
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="billing_postal_code">Postal Code</label>
                  <input
                    type="text"
                    id="billing_postal_code"
                    name="billing_postal_code"
                    value={checkout?.billing_address?.postal_code || ""}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="billing_country">Country</label>
                  <select id="billing_country" name="billing_country" required>
                    <option
                      value="US"
                      selected={checkout?.billing_address?.country === "US"}
                      >United States</option
                    >
                    <option
                      value="CA"
                      selected={checkout?.billing_address?.country === "CA"}
                      >Canada</option
                    >
                    <option
                      value="GB"
                      selected={checkout?.billing_address?.country === "GB"}
                      >United Kingdom</option
                    >
                    <option
                      value="DE"
                      selected={checkout?.billing_address?.country === "DE"}
                      >Germany</option
                    >
                    <option
                      value="FR"
                      selected={checkout?.billing_address?.country === "FR"}
                      >France</option
                    >
                  </select>
                </div>
              </div>
            {/if}

            <button type="submit">Save Billing Address</button>
          </form>

          {#if hasBillingAddress}
            <button class="next-button" onclick={() => (currentStep = 5)}>
              Continue to Payment
            </button>
          {/if}
        </section>
      {/if}

      <!-- Step 5: Payment -->
      {#if currentStep === 5 && hasBillingAddress}
        <section class="checkout-section">
          <h2>5. Payment</h2>

          <!-- Discount Code Section -->
          <div class="discount-section">
            <h3>Discount Code</h3>
            {#if checkout?.applied_discount}
              <div class="applied-discount">
                <span
                  >Applied: {checkout.applied_discount.code} (-{formatCurrency(
                    checkout.applied_discount.amount,
                    checkout.currency
                  )})</span
                >
                <form
                  method="POST"
                  action="?/removeDiscount"
                  use:enhance
                  style="display: inline;"
                >
                  <button type="submit" class="remove-discount">Remove</button>
                </form>
              </div>
            {:else}
              <form method="POST" action="?/applyDiscount" use:enhance>
                <div class="form-row">
                  <input
                    type="text"
                    name="discount_code"
                    placeholder="Enter discount code"
                  />
                  <button type="submit">Apply</button>
                </div>
              </form>
            {/if}
          </div>

          <!-- Payment Form -->
          <form method="POST" action="?/completeCheckout" use:enhance>
            <div class="form-group">
              <label for="payment_provider">Payment Method</label>
              <select id="payment_provider" name="payment_provider" required>
                <option value="">Select payment method</option>
                <option value="stripe">Credit Card (Stripe)</option>
                <option value="mobilepay">MobilePay</option>
              </select>
            </div>

            <div class="payment-details">
              <h3>Card Details</h3>

              <div class="form-group">
                <label for="cardholder_name">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholder_name"
                  name="cardholder_name"
                  required
                />
              </div>

              <div class="form-group">
                <label for="card_number">Card Number</label>
                <input
                  type="text"
                  id="card_number"
                  name="card_number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expiry_month">Expiry Month</label>
                  <select id="expiry_month" name="expiry_month" required>
                    {#each Array(12) as _, i}
                      <option value={i + 1}
                        >{String(i + 1).padStart(2, "0")}</option
                      >
                    {/each}
                  </select>
                </div>

                <div class="form-group">
                  <label for="expiry_year">Expiry Year</label>
                  <select id="expiry_year" name="expiry_year" required>
                    {#each Array(10) as _, i}
                      <option value={new Date().getFullYear() + i}
                        >{new Date().getFullYear() + i}</option
                      >
                    {/each}
                  </select>
                </div>

                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxlength="4"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" class="complete-order-button">
              Complete Order
            </button>
          </form>
        </section>
      {/if}
    </div>

    <!-- Order Summary -->
    <div class="checkout-sidebar">
      <div class="order-summary">
        <h3>Order Summary</h3>

        {#if checkout}
          <div class="summary-line">
            <span>Subtotal ({checkout.items?.length || 0} items)</span>
            <span
              >{formatCurrency(checkout.total_amount, checkout.currency)}</span
            >
          </div>

          {#if checkout.shipping_cost > 0}
            <div class="summary-line">
              <span>Shipping</span>
              <span
                >{formatCurrency(
                  checkout.shipping_cost,
                  checkout.currency
                )}</span
              >
            </div>
          {/if}

          {#if checkout.discount_amount > 0}
            <div class="summary-line discount">
              <span>Discount</span>
              <span
                >-{formatCurrency(
                  checkout.discount_amount,
                  checkout.currency
                )}</span
              >
            </div>
          {/if}

          <div class="summary-line total">
            <span>Total</span>
            <span
              >{formatCurrency(checkout.final_amount, checkout.currency)}</span
            >
          </div>
        {:else}
          <p>No checkout session found</p>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if form?.error}
  <div class="error-message">
    {form.error}
  </div>
{/if}

{#if form?.success && form?.message}
  <div class="success-message">
    {form.message}
  </div>
{/if}

<style>
  .checkout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .checkout-header {
    margin-bottom: 2rem;
  }

  .checkout-header h1 {
    margin-bottom: 1rem;
    color: #333;
  }

  .progress-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: #f5f5f5;
    color: #666;
    font-size: 0.875rem;
  }

  .step.active {
    background: #3b82f6;
    color: white;
  }

  .step.completed {
    background: #10b981;
    color: white;
  }

  .step span {
    background: currentColor;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .step.active span,
  .step.completed span {
    background: rgba(255, 255, 255, 0.3);
    color: currentColor;
  }

  .checkout-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  .checkout-section {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .checkout-section h2 {
    margin-bottom: 1.5rem;
    color: #333;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .cart-items {
    margin-bottom: 2rem;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .item-info {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.375rem;
  }

  .item-details h4 {
    margin: 0 0 0.25rem 0;
    color: #111827;
  }

  .item-details .variant {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }

  .item-details .sku {
    color: #9ca3af;
    font-size: 0.75rem;
    margin: 0;
  }

  .item-details .price {
    font-weight: 600;
    color: #059669;
    margin: 0.25rem 0 0 0;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .quantity-input {
    width: 80px;
    padding: 0.5rem;
    text-align: center;
  }

  .subtotal {
    font-weight: 600;
    color: #111827;
    margin: 0;
    min-width: 80px;
    text-align: right;
  }

  .add-item-form,
  .empty-cart {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px dashed #d1d5db;
  }

  .add-item-form h3 {
    margin-bottom: 1rem;
    color: #374151;
  }

  .add-item-form .form-row {
    grid-template-columns: 2fr 100px auto;
    align-items: end;
  }

  .discount-section {
    background: #f0f9ff;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .discount-section h3 {
    margin-bottom: 1rem;
    color: #0369a1;
  }

  .applied-discount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #dcfce7;
    padding: 0.75rem;
    border-radius: 0.375rem;
    color: #166534;
  }

  .remove-discount {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .payment-details {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .payment-details h3 {
    margin-bottom: 1rem;
    color: #374151;
  }

  .next-button,
  .complete-order-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
  }

  .next-button:hover,
  .complete-order-button:hover {
    background: #2563eb;
  }

  .complete-order-button {
    background: #059669;
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  .complete-order-button:hover {
    background: #047857;
  }

  .order-summary {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 2rem;
  }

  .order-summary h3 {
    margin-bottom: 1rem;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    color: #374151;
  }

  .summary-line.discount {
    color: #059669;
  }

  .summary-line.total {
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
    margin-top: 1rem;
    font-weight: 600;
    color: #111827;
    font-size: 1.125rem;
  }

  .error-message {
    background: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    border: 1px solid #fecaca;
  }

  .success-message {
    background: #f0fdf4;
    color: #166534;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    border: 1px solid #bbf7d0;
  }

  @media (max-width: 768px) {
    .checkout-content {
      grid-template-columns: 1fr;
    }

    .progress-bar {
      flex-wrap: wrap;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .add-item-form .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
