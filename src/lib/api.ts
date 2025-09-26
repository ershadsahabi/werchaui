// Detect server vs client
const isServer = typeof window === 'undefined';

// Priority for SSR (Node): INTERNAL first, then NEXT_PUBLIC
// Priority for CSR (Browser): NEXT_PUBLIC only
const rawBase = isServer
  ? (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');

// Normalize (remove trailing slash)
export const API_BASE = rawBase.replace(/\/$/, '');

export const endpoints = {
  // Accounts
  csrf:       `${API_BASE}/api/accounts/csrf/`,
  register:   `${API_BASE}/api/accounts/register/`,
  login:      `${API_BASE}/api/accounts/login/`,
  logout:     `${API_BASE}/api/accounts/logout/`,
  me:         `${API_BASE}/api/accounts/me/`,

  // Shop
  products:       `${API_BASE}/api/catalog/products/`,
  productDetail:  (slug: string) => `${API_BASE}/api/catalog/products/${encodeURIComponent(slug)}/`,
  categories:     `${API_BASE}/api/catalog/categories/`, 
  orderCreate:    `${API_BASE}/api/orders/create/`,
  lastAddress:    `${API_BASE}/api/orders/last-address/`,

  // Blog
  blogIndex:      `${API_BASE}/api/blog/posts/`,
  blogPosts:      `${API_BASE}/api/blog/posts/`,
  blogCategories: `${API_BASE}/api/blog/categories/`,
  blogRefs:       `${API_BASE}/api/blog/references/`,

  // Helpers
  blogPost: (slug: string) => `${API_BASE}/api/blog/posts/${encodeURIComponent(slug)}/`,
};
