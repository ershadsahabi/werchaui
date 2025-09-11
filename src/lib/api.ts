// werchaui/src/lib/api.ts

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
  csrf:       `${API_BASE}/api/accounts/csrf/`,
  register:   `${API_BASE}/api/accounts/register/`,
  login:      `${API_BASE}/api/accounts/login/`,
  logout:     `${API_BASE}/api/accounts/logout/`,
  me:         `${API_BASE}/api/accounts/me/`,

  products:   `${API_BASE}/api/catalog/products/`,
  orderCreate:`${API_BASE}/api/orders/create/`,
  lastAddress:`${API_BASE}/api/orders/last-address/`,
};
