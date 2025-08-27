import { cookies } from 'next/headers';
import { endpoints } from './api';

export async function getMe() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');

  const res = await fetch(endpoints.me, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}