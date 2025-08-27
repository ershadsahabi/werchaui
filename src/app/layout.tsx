import './globals.css';
import Header from '@/components/Header';
import { getMe } from '@/lib/server-api';

export const metadata = { title: 'Auth App', description: 'Next.js SSR + client auth' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  return (
    <html lang="fa">
      <body>
        <Header initialUser={me} />
        <main className="container" style={{ paddingTop: 24 }}>{children}</main>
      </body>
    </html>
  );
}