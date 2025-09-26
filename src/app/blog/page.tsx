// src/app/blog/page.tsx

import Link from "next/link";
import { Suspense } from "react";
import { fetchBlogCategories } from "@/lib/server-blog";
import { BlogCategory } from "@/types/blog";
import FiltersInstant from "@/components/blog/FiltersInstant";
import RecentReadsRow from "@/components/blog/RecentReadsRow";
import s from "@/components/blog/blog.module.css";
import Results from "./_components/Results";
import type { Metadata } from "next";

export const revalidate = 600;

const SITE_URL = "https://wircino.ir";

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
  ordering?: "new" | "old" | "title" | "-title";
};

/* ------------------ generateMetadata (پویا و امن) ------------------ */
export async function generateMetadata(
  { searchParams }: { searchParams: SearchParams }
): Promise<Metadata> {
  const page = Number(searchParams.page || 1);
  const hasQuery = typeof searchParams.q === "string" && searchParams.q.trim().length > 0;
  const ordering = searchParams.ordering || "new"; // پیش‌فرض سیستم

  // Canonical: صفحه ۱ + اوردر پیش‌فرض → /blog
  // در غیر این صورت، فقط پارامترهای مهم را نگه می‌داریم (page, category)
  const url = new URL("/blog", SITE_URL);
  if (page > 1) url.searchParams.set("page", String(page));
  if (searchParams.category) url.searchParams.set("category", searchParams.category);
  // ordering فقط اگر غیر از پیش‌فرض باشد
  if (ordering && ordering !== "new") url.searchParams.set("ordering", ordering);
  // جستجو را در canonical نمی‌گذاریم (noindex می‌شود)
  const canonical = url.pathname + (url.search ? url.search : "");

  // robots: اگر جستجو داریم، noindex,follow
  const robots = hasQuery
    ? { index: false, follow: true }
    : { index: true, follow: true };

  const titleBase = "بلاگ";
  const pageSuffix = page > 1 ? ` – صفحه ${page}` : "";
  return {
    title: `${titleBase}${pageSuffix}`,
    description: "راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار در بلاگ ورچینو.",
    alternates: { canonical },
    robots,
    openGraph: {
      type: "website",
      url: SITE_URL + canonical,
      title: `${titleBase}${pageSuffix}`,
      description: "راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار",
      images: [
        { url: "/publicimages/brand/og-1200x630.jpg", width: 1200, height: 630, alt: "Wircino Blog" },
      ],
      locale: "fa_IR",
      siteName: "Wircino | ورچینو",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleBase}${pageSuffix}`,
      description: "راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار",
      images: ["/publicimages/brand/og-1200x630.jpg"],
    },
  };
}

/* ------------------ صفحهٔ بلاگ ------------------ */
export default async function BlogIndex({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page || 1);

  // 1) موازی‌سازی گرفتن دسته‌ها
  const categoriesPromise: Promise<BlogCategory[]> = fetchBlogCategories();

  // 2) منتظر دسته‌ها (cache دارد)
  const categories = await categoriesPromise;

  // JSON-LD: Breadcrumb + WebPage نوع Blog (سبک و بدون نیاز به دیتای مقاله)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "بلاگ", item: `${SITE_URL}/blog` },
    ],
  };

  const blogWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "بلاگ ورچینو",
    url: `${SITE_URL}/blog`,
    inLanguage: "fa-IR",
    description: "راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار در بلاگ ورچینو.",
    // اگر صفحه‌های مقاله را داشتیم می‌توانستیم ItemList از آخرین‌ها بدهیم
  };

  return (
    <section className="stack gap-4" dir="rtl">
      {/* هدر صفحه */}
      <section className={s.hero}>
        <div className="container">
          <nav className={s.bc} aria-label="breadcrumb">
            <Link href="/" className={s.bcLink}>خانه</Link>
            <span className={s.bcSep} aria-hidden="true">/</span>
            <span className={s.bcHere} aria-current="page">بلاگ</span>
          </nav>
          <h1 className="text-strong" style={{ fontSize: "1.6rem", fontWeight: 900 }}>
            بلاگ ورچینو
          </h1>
          <p className="t-weak">راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار</p>
        </div>
      </section>

      {/* ادامه مطالعه */}
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>ادامه مطالعه</h2>
      </div>
      <RecentReadsRow />

      {/* جداکننده */}
      <div className={s.divider} aria-hidden="true" />

      {/* فیلترها */}
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>مقالات</h2>
      </div>
      <FiltersInstant categories={categories} />

      {/* نتایج + صفحه‌بندی: استریم با Suspense */}
      <Suspense fallback={<LoadingGridFallback />}>
        <Results searchParams={searchParams} page={page} />
      </Suspense>

      {/* JSON-LD ها */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogWebPageJsonLd) }} />
    </section>
  );
}

function LoadingGridFallback() {
  return (
    <div className={`${s.cardsGrid} grid`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton" style={{ aspectRatio: "16/10", borderRadius: "var(--r-lg)" }} />
          <div className="skeleton" style={{ height: 16, marginTop: 12, width: "70%" }} />
          <div className="skeleton" style={{ height: 12, marginTop: 8, width: "90%" }} />
        </div>
      ))}
    </div>
  );
}
