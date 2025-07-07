<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let currentStep = $state(1);
  let useShippingForBilling = $state(true);

  const checkout = $derived(data.checkout);
  const shippingMethods = $derived(data.shippingMethods || []);
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

  function goToStep(step: number) {
    currentStep = step;
  }
</script>

<svelte:head>
  <title>Checkout - Commercify</title>
</svelte:head>

<div class="checkout-container">
  <div class="checkout-header">
    <h1>Checkout</h1>
    <div class="progress-bar">
      <button
        class="step"
        class:active={currentStep >= 1}
        class:completed={hasCustomerDetails}
        onclick={() => goToStep(1)}
        disabled={!hasItems}
      >
        <span>1</span> Customer Details
      </button>
      <button
        class="step"
        class:active={currentStep >= 2}
        class:completed={hasShippingAddress}
        onclick={() => goToStep(2)}
        disabled={!hasCustomerDetails}
      >
        <span>2</span> Shipping
      </button>
      <button
        class="step"
        class:active={currentStep >= 3}
        class:completed={hasBillingAddress}
        onclick={() => goToStep(3)}
        disabled={!hasShippingAddress}
      >
        <span>3</span> Billing
      </button>
      <button
        class="step"
        class:active={currentStep >= 4}
        class:completed={hasShippingMethod}
        onclick={() => goToStep(4)}
        disabled={!hasBillingAddress}
      >
        <span>4</span> Shipping Method
      </button>
      <button
        class="step"
        class:active={currentStep >= 5}
        onclick={() => goToStep(5)}
        disabled={!hasShippingMethod}
      >
        <span>5</span> Payment
      </button>
    </div>
  </div>

  {#if !checkout || !checkout.items || checkout.items.length === 0}
    <div class="empty-cart">
      <h2>Your cart is empty</h2>
      <p>Add some items to your cart before proceeding to checkout.</p>
      <a href="/products" class="cta-button">Continue Shopping</a>
    </div>
  {:else}
    <div class="checkout-content">
      <div class="checkout-main">
        <!-- Step 1: Customer Details -->
        {#if currentStep === 1}
          <section class="checkout-section">
            <h2>Customer Details</h2>

            {#if form?.error}
              <div class="error-message">{form.error}</div>
            {/if}

            {#if form?.success}
              <div class="success-message">
                Customer details saved successfully!
              </div>
            {/if}

            <form method="POST" action="?/setCustomerDetails" use:enhance>
              <div class="form-group">
                <label for="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={checkout.customer_details?.full_name || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={checkout.customer_details?.email || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={checkout.customer_details?.phone || ""}
                  required
                />
              </div>

              <button type="submit" class="btn-primary"
                >Save and Continue</button
              >
            </form>
          </section>
        {/if}

        <!-- Step 2: Shipping Address -->
        {#if currentStep === 2}
          <section class="checkout-section">
            <h2>Shipping Address</h2>

            {#if form?.error}
              <div class="error-message">{form.error}</div>
            {/if}

            {#if form?.success}
              <div class="success-message">
                Shipping address saved successfully!
              </div>
            {/if}

            <form method="POST" action="?/setShippingAddress" use:enhance>
              <div class="form-group">
                <label for="address_line1">Address Line 1</label>
                <input
                  type="text"
                  id="address_line1"
                  name="address_line1"
                  value={checkout.shipping_address?.address_line1 || ""}
                  required
                />
              </div>

              <div class="form-group">
                <label for="address_line2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="address_line2"
                  name="address_line2"
                  value={checkout.shipping_address?.address_line2 || ""}
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={checkout.shipping_address?.city || ""}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={checkout.shipping_address?.state || ""}
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
                    value={checkout.shipping_address?.postal_code || ""}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="country">Country</label>
                  <select id="country" name="country" required>
                    <option value="">Select Country</option>
                    <option
                      value="US"
                      selected={checkout.shipping_address?.country === "US"}
                      >United States</option
                    >
                    <option
                      value="CA"
                      selected={checkout.shipping_address?.country === "CA"}
                      >Canada</option
                    >
                    <option
                      value="GB"
                      selected={checkout.shipping_address?.country === "GB"}
                      >United Kingdom</option
                    >
                    <option
                      value="AU"
                      selected={checkout.shipping_address?.country === "AU"}
                      >Australia</option
                    >
                    <option
                      value="DE"
                      selected={checkout.shipping_address?.country === "DE"}
                      >Germany</option
                    >
                    <option
                      value="FR"
                      selected={checkout.shipping_address?.country === "FR"}
                      >France</option
                    >
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-primary"
                >Save and Continue</button
              >
            </form>
          </section>
        {/if}

        <!-- Step 3: Billing Address -->
        {#if currentStep === 3}
          <section class="checkout-section">
            <h2>Billing Address</h2>

            {#if form?.error}
              <div class="error-message">{form.error}</div>
            {/if}

            {#if form?.success}
              <div class="success-message">
                Billing address saved successfully!
              </div>
            {/if}

            <form method="POST" action="?/setBillingAddress" use:enhance>
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="use_shipping_address"
                    bind:checked={useShippingForBilling}
                  />
                  Use shipping address for billing
                </label>
              </div>

              {#if !useShippingForBilling}
                <div class="form-group">
                  <label for="billing_address_line1">Address Line 1</label>
                  <input
                    type="text"
                    id="billing_address_line1"
                    name="billing_address_line1"
                    value={checkout.billing_address?.address_line1 || ""}
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
                    value={checkout.billing_address?.address_line2 || ""}
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="billing_city">City</label>
                    <input
                      type="text"
                      id="billing_city"
                      name="billing_city"
                      value={checkout.billing_address?.city || ""}
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="billing_state">State/Province</label>
                    <input
                      type="text"
                      id="billing_state"
                      name="billing_state"
                      value={checkout.billing_address?.state || ""}
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
                      value={checkout.billing_address?.postal_code || ""}
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="billing_country">Country</label>
                    <select
                      id="billing_country"
                      name="billing_country"
                      required
                    >
                      <option value="">Select Country</option>
                      <option
                        value="US"
                        selected={checkout.billing_address?.country === "US"}
                        >United States</option
                      >
                      <option
                        value="CA"
                        selected={checkout.billing_address?.country === "CA"}
                        >Canada</option
                      >
                      <option
                        value="GB"
                        selected={checkout.billing_address?.country === "GB"}
                        >United Kingdom</option
                      >
                      <option
                        value="AU"
                        selected={checkout.billing_address?.country === "AU"}
                        >Australia</option
                      >
                      <option
                        value="DE"
                        selected={checkout.billing_address?.country === "DE"}
                        >Germany</option
                      >
                      <option
                        value="FR"
                        selected={checkout.billing_address?.country === "FR"}
                        >France</option
                      >
                    </select>
                  </div>
                </div>
              {/if}

              <button type="submit" class="btn-primary"
                >Save and Continue</button
              >
            </form>
          </section>
        {/if}

        <!-- Step 4: Shipping Method -->
        {#if currentStep === 4}
          <section class="checkout-section">
            <h2>Shipping Method</h2>

            {#if form?.error}
              <div class="error-message">{form.error}</div>
            {/if}

            {#if form?.success}
              <div class="success-message">
                Shipping method selected successfully!
              </div>
            {/if}

            <form method="POST" action="?/setShippingMethod" use:enhance>
              <div class="shipping-methods">
                {#if shippingMethods.length > 0}
                  {#each shippingMethods as method}
                    <label class="shipping-method">
                      <input
                        type="radio"
                        name="shipping_method_id"
                        value={method.id}
                        checked={checkout.shipping_method_id === method.id}
                      />
                      <div class="method-info">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                        <span class="method-price"
                          >{formatCurrency(
                            method.price,
                            checkout.currency
                          )}</span
                        >
                        <span class="method-time"
                          >{method.estimated_delivery}</span
                        >
                      </div>
                    </label>
                  {/each}
                {:else}
                  <div class="no-shipping-methods">
                    <p>
                      No shipping methods available. Please check your shipping
                      address.
                    </p>
                  </div>
                {/if}
              </div>

              {#if shippingMethods.length > 0}
                <button type="submit" class="btn-primary"
                  >Save and Continue</button
                >
              {/if}
            </form>
          </section>
        {/if}

        <!-- Step 5: Payment -->
        {#if currentStep === 5}
          <section class="checkout-section">
            <h2>Payment Information</h2>

            {#if form?.error}
              <div class="error-message">{form.error}</div>
            {/if}

            <!-- Discount Code Section -->
            <div class="discount-section">
              <h3>Discount Code</h3>
              {#if checkout.discount_amount > 0}
                <div class="applied-discount">
                  <span
                    >Discount applied: -{formatCurrency(
                      checkout.discount_amount,
                      checkout.currency
                    )}</span
                  >
                  <form
                    method="POST"
                    action="?/removeDiscount"
                    use:enhance
                    style="display: inline;"
                  >
                    <button type="submit" class="btn-secondary small"
                      >Remove</button
                    >
                  </form>
                </div>
              {:else}
                <form
                  method="POST"
                  action="?/applyDiscount"
                  use:enhance
                  class="discount-form"
                >
                  <input
                    type="text"
                    name="discount_code"
                    placeholder="Enter discount code"
                    class="discount-input"
                  />
                  <button type="submit" class="btn-secondary">Apply</button>
                </form>
              {/if}
            </div>

            <form method="POST" action="?/completeCheckout" use:enhance>
              <div class="form-group">
                <label for="payment_provider">Payment Method</label>
                <select id="payment_provider" name="payment_provider" required>
                  <option value="">Select Payment Method</option>
                  <option value="stripe">Credit Card (Stripe)</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

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
                    <option value="">Month</option>
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
                    <option value="">Year</option>
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

              <button type="submit" class="btn-primary large">
                Complete Order - {formatCurrency(
                  checkout.final_amount,
                  checkout.currency
                )}
              </button>
            </form>
          </section>
        {/if}
      </div>

      <!-- Order Summary Sidebar -->
      <div class="order-summary">
        <h3>Order Summary</h3>

        <div class="summary-items">
          {#each checkout.items as item}
            <div class="summary-item">
              <div class="item-details">
                <span class="item-name">{item.product_name}</span>
                {#if item.variant_name}
                  <span class="item-variant">{item.variant_name}</span>
                {/if}
                <span class="item-quantity">Qty: {item.quantity}</span>
              </div>
              <span class="item-total"
                >{formatCurrency(item.subtotal, checkout.currency)}</span
              >
            </div>
          {/each}
        </div>

        <div class="summary-totals">
          <div class="summary-line">
            <span>Subtotal:</span>
            <span
              >{formatCurrency(checkout.total_amount, checkout.currency)}</span
            >
          </div>

          {#if checkout.shipping_cost > 0}
            <div class="summary-line">
              <span>Shipping:</span>
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
              <span>Discount:</span>
              <span
                >-{formatCurrency(
                  checkout.discount_amount,
                  checkout.currency
                )}</span
              >
            </div>
          {/if}

          <div class="summary-line total">
            <span>Total:</span>
            <span
              >{formatCurrency(checkout.final_amount, checkout.currency)}</span
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

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
    font-size: 2.5rem;
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
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .step:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .step span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e5e7eb;
    color: #6b7280;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .step.active {
    border-color: #3b82f6;
    background: #dbeafe;
    color: #1d4ed8;
  }

  .step.active span {
    background: #3b82f6;
    color: white;
  }

  .step.completed {
    border-color: #10b981;
    background: #d1fae5;
    color: #047857;
  }

  .step.completed span {
    background: #10b981;
    color: white;
  }

  .empty-cart {
    text-align: center;
    padding: 4rem 2rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .empty-cart h2 {
    color: #374151;
    margin-bottom: 1rem;
  }

  .empty-cart p {
    color: #6b7280;
    margin-bottom: 2rem;
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

  .checkout-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .checkout-section {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .checkout-section h2 {
    margin-bottom: 1.5rem;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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
    border-radius: 6px;
    font-size: 1rem;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: auto;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-primary.large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .btn-secondary.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .shipping-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .shipping-method {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition:
      border-color 0.2s,
      background-color 0.2s;
  }

  .shipping-method:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  .shipping-method input[type="radio"] {
    width: auto;
  }

  .method-info {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.5rem;
    align-items: center;
  }

  .method-info h4 {
    margin: 0;
    color: #374151;
    grid-column: 1 / -1;
  }

  .method-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
    grid-column: 1 / -1;
  }

  .method-price {
    font-weight: 600;
    color: #059669;
  }

  .method-time {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .discount-section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .discount-section h3 {
    margin: 0 0 1rem 0;
    color: #374151;
  }

  .discount-form {
    display: flex;
    gap: 0.5rem;
  }

  .discount-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }

  .applied-discount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: #d1fae5;
    border: 1px solid #10b981;
    border-radius: 6px;
    color: #047857;
  }

  .order-summary {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 2rem;
  }

  .order-summary h3 {
    margin: 0 0 1.5rem 0;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .summary-items {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .summary-item:last-child {
    border-bottom: none;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .item-name {
    font-weight: 500;
    color: #374151;
  }

  .item-variant {
    font-size: 0.9rem;
    color: #6b7280;
  }

  .item-quantity {
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .item-total {
    font-weight: 500;
    color: #374151;
  }

  .summary-totals {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-line.discount {
    color: #059669;
  }

  .summary-line.total {
    font-weight: 600;
    font-size: 1.1rem;
    padding-top: 0.75rem;
    border-top: 2px solid #374151;
    color: #374151;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .no-shipping-methods {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    .checkout-container {
      padding: 1rem;
    }

    .checkout-content {
      grid-template-columns: 1fr;
    }

    .progress-bar {
      flex-direction: column;
      gap: 0.5rem;
    }

    .step {
      font-size: 0.8rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .method-info {
      grid-template-columns: 1fr;
      gap: 0.25rem;
    }

    .discount-form {
      flex-direction: column;
    }

    .order-summary {
      position: static;
    }
  }
</style>
