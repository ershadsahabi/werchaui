import { getMe } from '@/lib/server-api';
import Link from 'next/link';

export const metadata = { title: 'Dashboard' };

export default async function Page(){
  const me = await getMe();
  if(!me){
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Not signed in</h2>
        <p>از Login در هدر استفاده کنید و سپس برگردید.</p>
        <Link className="link" href="/">Go Home</Link>
      </div>
    );
  }
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <p>سلام {me.email}</p>
    </div>
  );
}