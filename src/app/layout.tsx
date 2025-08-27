import './globals.css';
import Header from '@/components/Header';
import { getMe } from '@/lib/server-api';
import { Vazirmatn } from 'next/font/google';

export const metadata = { title: 'Auth App', description: 'Next.js SSR + client auth' };


const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300','400','500','700','900'],
  variable: '--font-vazirmatn',
});


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  return (
    <html lang="fa" className={vazirmatn.variable}>
      <body>
        <Header initialUser={me} />
        <main className="container" style={{ paddingTop: 24 }}>{children}</main>
      </body>
    </html>
  );
}