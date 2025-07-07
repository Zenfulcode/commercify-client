<script>
  // Welcome page for the Commercify API Client demo
</script>

<div class="container">
  <header>
    <h1>🛒 Commercify SvelteKit Demo</h1>
    <p>
      A demonstration of the commercify-api-client integration with SvelteKit 5
    </p>
  </header>

  <nav>
    <a href="/products" class="nav-button">Browse Products</a>
    <a href="/checkout" class="nav-button">View Cart</a>
    <a href="/admin/cache" class="nav-button admin">Cache Admin</a>
  </nav>

  <main>
    <section class="feature-grid">
      <div class="feature-card">
        <h3>🏪 Product Catalog</h3>
        <p>Browse and search products using the server-side API integration</p>
        <a href="/products">View Products →</a>
      </div>

      <div class="feature-card">
        <h3>🛒 Shopping Cart</h3>
        <p>Manage your cart with session-based checkout functionality</p>
        <a href="/checkout">View Cart →</a>
      </div>

      <div class="feature-card">
        <h3>🔒 Secure Integration</h3>
        <p>
          API credentials and session management handled server-side for
          security
        </p>
      </div>

      <div class="feature-card">
        <h3>⚡ Type Safety</h3>
        <p>Full TypeScript support with auto-generated types from the API</p>
      </div>

      <div class="feature-card">
        <h3>🚀 Performance Cache</h3>
        <p>
          Smart caching system reduces API calls and improves response times
        </p>
        <a href="/admin/cache">Manage Cache →</a>
      </div>
    </section>

    <section class="info">
      <h2>About this Demo</h2>
      <p>
        This SvelteKit 5 application demonstrates how to integrate the
        <code>commercify-api-client</code> package securely using server-side
        rendering and load functions. The API client is configured in the server
        hooks and made available to all routes via the <code>locals</code> object.
      </p>

      <div class="tech-stack">
        <h3>Technologies Used:</h3>
        <ul>
          <li>SvelteKit 5 with TypeScript</li>
          <li>commercify-api-client (fetch-based)</li>
          <li>Server-side API integration</li>
          <li>Session-based authentication</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </section>
  </main>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 3rem;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  header p {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
  }

  nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .nav-button {
    display: inline-block;
    background: #2563eb;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  }

  .nav-button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
  }

  .nav-button.admin {
    background: #dc2626;
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  }

  .nav-button.admin:hover {
    background: #b91c1c;
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .feature-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #2563eb;
  }

  .feature-card h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.25rem;
  }

  .feature-card p {
    color: #6b7280;
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  .feature-card a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .feature-card a:hover {
    color: #1d4ed8;
  }

  .info {
    background: #f8fafc;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #e2e8f0;
  }

  .info h2 {
    margin: 0 0 1rem 0;
    color: #1f2937;
  }

  .info p {
    color: #4b5563;
    line-height: 1.7;
    margin: 0 0 1.5rem 0;
  }

  code {
    background: #e2e8f0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.9em;
    color: #1f2937;
  }

  .tech-stack h3 {
    margin: 0 0 0.75rem 0;
    color: #1f2937;
  }

  .tech-stack ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #4b5563;
  }

  .tech-stack li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    nav {
      flex-direction: column;
      align-items: center;
    }

    .nav-button {
      width: 200px;
      text-align: center;
    }
  }
</style>
