<script lang="ts">
  import { enhance } from "$app/forms";

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Cache Test - Commercify</title>
</svelte:head>

<div class="container">
  <h1>Cache Test Page</h1>

  {#if form?.success}
    <div class="alert success">
      Action completed successfully! <a href="/api/cache-test"
        >Refresh to see changes</a
      >
    </div>
  {/if}

  <div class="test-section">
    <h2>Cached Data</h2>
    <div class="data-display">
      <pre>{JSON.stringify(data.cached, null, 2)}</pre>
    </div>
    <p class="note">
      This data is cached for 5 seconds. The timestamp will only change after
      the cache expires.
    </p>
  </div>

  <div class="test-section">
    <h2>Cache Statistics</h2>
    <div class="stats">
      <p><strong>Total Entries:</strong> {data.cacheStats.size}</p>
      <p><strong>Cache Keys:</strong></p>
      <ul class="key-list">
        {#each data.cacheStats.keys as key}
          <li><code>{key}</code></li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="test-section">
    <h2>Test Actions</h2>
    <div class="actions">
      <form method="POST" action="?/clearTest" use:enhance>
        <button type="submit" class="btn btn-warning">
          Clear Test Cache
        </button>
      </form>

      <form method="POST" action="?/addTest" use:enhance>
        <button type="submit" class="btn btn-secondary">
          Add Manual Cache Entry
        </button>
      </form>

      <a href="/api/cache-test" class="btn btn-primary"> Refresh Page </a>

      <a href="/admin/cache" class="btn btn-danger"> Cache Admin </a>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
  }

  .test-section {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .test-section h2 {
    margin-top: 0;
    color: #333;
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

  .data-display {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .data-display pre {
    margin: 0;
    font-family: "Monaco", "Consolas", monospace;
    font-size: 0.9rem;
  }

  .note {
    color: #666;
    font-style: italic;
    font-size: 0.9rem;
  }

  .stats {
    color: #333;
  }

  .key-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .key-list li {
    padding: 0.25rem 0;
  }

  .key-list code {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.85rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .btn-warning {
    background-color: #ffc107;
    color: #212529;
  }

  .btn-warning:hover {
    background-color: #e0a800;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }
</style>
