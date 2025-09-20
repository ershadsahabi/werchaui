// app/layout.tsx
import "./globals.css";
import "./blog/prose.css";
import "./variables.css";
import "./tokens.css";
import "./utilities.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getMe } from "@/lib/server-api";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { cookies } from "next/headers";

export const metadata = {
  title: "Wircino",
  description: "Petshop",
};

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  // تم را در سرور از کوکی بخوان (light | dark)
  const cookieTheme = cookies().get("theme")?.value as "light" | "dark" | undefined;
  const initialTheme = cookieTheme ?? "dark"; // پیش‌فرض شما: شب

  return (
    <html
      lang="fa"
      className={`${plexArabic.variable} ${inter.variable} ${
        initialTheme === "light" ? "light" : ""
      }`}
      data-paw="on"
      suppressHydrationWarning
    >
      <head>
        {/* به مرورگر اعلام می‌کند هر دو اسکیم را پشتیبانی می‌کنیم */}
        <meta name="color-scheme" content="dark light" />
      </head>
      <body style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* initialTheme را به Header پاس بده */}
        <Header initialUser={me} initialTheme={initialTheme} />
        <main id="content" className="container" style={{ paddingTop: 24, flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
