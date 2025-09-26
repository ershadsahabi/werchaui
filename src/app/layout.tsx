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
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://wircino.ir"),
  title: {
    default: "Wircino | ورچینو",
    template: "%s | Wircino",
  },
  description:
    "ورچینو: فروشگاه تخصصی پت‌شاپ؛ از غذای خشک و تر تا بهداشت و سرگرمی. ارسال سریع سنندج و سراسر ایران.",
  alternates: { canonical: "/" },
  keywords: [
    "پت شاپ",
    "خرید غذای سگ",
    "خرید غذای گربه",
    "خاک گربه",
    "تشویقی حیوانات",
    "بهداشت حیوانات",
    "ورچینو",
  ],
  openGraph: {
    type: "website",
    url: "https://wircino.ir/",
    siteName: "Wircino | ورچینو",
    title: "Wircino | ورچینو",
    description: "پت‌شاپ آنلاین با تمرکز روی کیفیت و ارسال سریع",
    images: [
      {
        url: "/publicimages/brand/og-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Wircino Petshop",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wircino | ورچینو",
    description: "پت‌شاپ آنلاین با تمرکز روی کیفیت و ارسال سریع",
    images: ["/publicimages/brand/og-1200x630.jpg"],
  },
  robots: { index: true, follow: true },

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" }, // fallback
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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

  // تم از کوکی (light | dark)
  const cookieTheme = cookies().get("theme")?.value as "light" | "dark" | undefined;
  const initialTheme = cookieTheme ?? "dark";

  // مسیر لوگو را در سرور تعیین کن تا SSR/Client یکسان باشند
  const logoSrc = "/publicimages/logo41.png";
  // اگر نسخهٔ متفاوت برای تم‌ها داری:
  // const logoSrc = initialTheme === "light" ? "/publicimages/logo41.png" : "/publicimages/logo41.png";

  // JSON-LD‌ها
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wircino | ورچینو",
    url: "https://wircino.ir",
    logo: "/publicimages/icon.png",
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+98-918-655-9894",
        contactType: "customer support",
        areaServed: "IR",
        availableLanguage: ["fa"],
      },
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://wircino.ir",
    name: "Wircino | ورچینو",
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://wircino.ir/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="fa"
      className={`${plexArabic.variable} ${inter.variable} ${initialTheme === "light" ? "light" : ""}`}
      data-paw="on"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header initialUser={me} initialTheme={initialTheme} logoSrc={logoSrc} />
        <main id="content" className="container" style={{ paddingTop: 24, flex: 1 }}>
          {children}
        </main>
        <Footer />

        {/* JSON-LD: Organization + WebSite */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      </body>
    </html>
  );
}
