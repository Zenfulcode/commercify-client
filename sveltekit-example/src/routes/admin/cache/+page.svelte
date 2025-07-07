<script lang="ts">
  import { enhance } from "$app/forms";

  interface CacheStats {
    size: number;
    keys: string[];
  }

  interface PageData {
    cacheStats: CacheStats;
    totalEntries: number;
    keys: string[];
  }

  interface ActionData {
    success?: boolean;
    message?: string;
    error?: string;
  }

  let { data, form }: { data: PageData; form: ActionData | null } = $props();

  let selectedKey = $state("");
  let patternInput = $state("");

  // Group cache keys by type for better organization
  let cacheKeysByType = $derived.by(() => {
    const grouped: Record<string, string[]> = {
      products: [],
      checkout: [],
      order: [],
      "shipping-methods": [],
      other: [],
    };

    data.keys.forEach((key: string) => {
      if (key.startsWith("products:")) {
        grouped.products.push(key);
      } else if (key.startsWith("checkout:")) {
        grouped.checkout.push(key);
      } else if (key.startsWith("order:")) {
        grouped.order.push(key);
      } else if (key.includes("shipping-methods")) {
        grouped["shipping-methods"].push(key);
      } else {
        grouped.other.push(key);
      }
    });

    return grouped;
  });
</script>

<svelte:head>
  <title>Cache Administration - Commercify</title>
</svelte:head>

<div class="container">
  <h1>Cache Administration</h1>

  {#if form?.success}
    <div class="alert success">
      {form.message}
    </div>
  {/if}

  {#if form?.error}
    <div class="alert error">
      {form.error}
    </div>
  {/if}

  <div class="stats-card">
    <h2>Cache Statistics</h2>
    <div class="stats-grid">
      <div class="stat">
        <span class="stat-label">Total Entries:</span>
        <span class="stat-value">{data.totalEntries}</span>
      </div>
    </div>
  </div>

  <div class="actions-card">
    <h2>Cache Actions</h2>

    <div class="action-group">
      <h3>Clear All Cache</h3>
      <p>This will clear all cached data. Use with caution.</p>
      <form method="POST" action="?/clearAll" use:enhance>
        <button type="submit" class="btn btn-danger"> Clear All Cache </button>
      </form>
    </div>

    <div class="action-group">
      <h3>Clear Checkout Sessions</h3>
      <p>Clear all checkout session cache entries.</p>
      <form method="POST" action="?/clearCheckoutSessions" use:enhance>
        <button type="submit" class="btn btn-warning">
          Clear Checkout Sessions
        </button>
      </form>
    </div>

    <div class="action-group">
      <h3>Clear by Pattern</h3>
      <p>Clear cache entries matching a regex pattern.</p>
      <form method="POST" action="?/clearPattern" use:enhance>
        <div class="form-group">
          <label for="pattern">Pattern (regex):</label>
          <input
            type="text"
            id="pattern"
            name="pattern"
            bind:value={patternInput}
            placeholder="e.g., ^products:|checkout:.+"
          />
          <small
            >Common patterns: ^products: (all products), checkout:.+ (all
            checkout sessions)</small
          >
        </div>
        <button type="submit" class="btn btn-secondary"> Clear Pattern </button>
      </form>
    </div>

    <div class="action-group">
      <h3>Clear Specific Key</h3>
      <p>Clear a specific cache entry by key.</p>
      <form method="POST" action="?/clearSpecific" use:enhance>
        <div class="form-group">
          <label for="key">Cache Key:</label>
          <select id="key" name="key" bind:value={selectedKey}>
            <option value="">Select a cache key...</option>
            {#each data.keys as key}
              <option value={key}>{key}</option>
            {/each}
          </select>
        </div>
        <button type="submit" class="btn btn-secondary" disabled={!selectedKey}>
          Clear Key
        </button>
      </form>
    </div>
  </div>

  <div class="keys-card">
    <h2>Cache Keys</h2>

    {#if data.totalEntries === 0}
      <p class="empty-state">No cache entries found.</p>
    {:else}
      {#each Object.entries(cacheKeysByType) as [type, keys]}
        {#if keys.length > 0}
          <div class="key-group">
            <h3 class="key-group-title">{type} ({keys.length})</h3>
            <ul class="key-list">
              {#each keys as key}
                <li class="key-item">
                  <code>{key}</code>
                  <button
                    class="btn-clear"
                    onclick={() => (selectedKey = key)}
                    title="Select for clearing"
                  >
                    Select
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
  }

  .alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .alert.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .stats-card,
  .actions-card,
  .keys-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .stat-label {
    font-weight: 600;
    color: #666;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #007bff;
  }

  .action-group {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .action-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .action-group h3 {
    margin: 0 0 0.5rem 0;
    color: #555;
  }

  .action-group p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .form-group small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.8rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: background-color 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background-color: #c82333;
  }

  .btn-warning {
    background-color: #ffc107;
    color: #212529;
  }

  .btn-warning:hover:not(:disabled) {
    background-color: #e0a800;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #5a6268;
  }

  .empty-state {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
  }

  .key-group {
    margin-bottom: 2rem;
  }

  .key-group-title {
    margin: 0 0 1rem 0;
    color: #555;
    text-transform: capitalize;
    border-bottom: 2px solid #007bff;
    padding-bottom: 0.5rem;
  }

  .key-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .key-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .key-item:last-child {
    border-bottom: none;
  }

  .key-item code {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.85rem;
    flex: 1;
    margin-right: 1rem;
  }

  .btn-clear {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .btn-clear:hover {
    background: #0056b3;
  }
</style>
