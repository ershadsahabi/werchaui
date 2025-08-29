export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000').replace(/\/$/, '');
export const endpoints = {
  csrf: `${API_BASE}/api/accounts/csrf/`,
  register: `${API_BASE}/api/accounts/register/`,
  login: `${API_BASE}/api/accounts/login/`,
  logout: `${API_BASE}/api/accounts/logout/`,
  me: `${API_BASE}/api/accounts/me/`,

  products: `${API_BASE}/api/catalog/products/`,
  orderCreate: `${API_BASE}/api/orders/create/`,
  lastAddress: `${API_BASE}/api/orders/last-address/`,   

};