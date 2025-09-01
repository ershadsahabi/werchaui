// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMe } from "@/lib/server-api";
import { Vazirmatn } from "next/font/google";
import SimpleHeader from "@/components/SimpleHeader"; // ← تغییر دادیم

export const metadata = {
  title: "Wircino",
  description: "Petshop",
};

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-vazirmatn",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();

  return (
    <html lang="fa" className={vazirmatn.variable}>
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header initialUser={me} />
        <main id="content" className="container" style={{ paddingTop: 24, flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
