import { endpoints } from './api';

export async function ensureCsrf() {
  await fetch(endpoints.csrf, { credentials: 'include' });
}

export function getCsrfFromCookie() {
  const m = document.cookie.split('; ').find((r) => r.startsWith('csrftoken='));
  return m?.split('=')[1];
}

export async function postWithCsrf(url: string, body: any) {
  await ensureCsrf();
  const csrftoken = getCsrfFromCookie();
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try { const data = await res.json(); msg = (data.detail || JSON.stringify(data)); } catch {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return {}; }
}