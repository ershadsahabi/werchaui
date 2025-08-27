'use client';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const r = useRouter();
  async function onClick(){
    try { await postWithCsrf(endpoints.logout, {}); r.refresh(); } catch {}
  }
  return <button className="btn" onClick={onClick}>Logout</button>;
}