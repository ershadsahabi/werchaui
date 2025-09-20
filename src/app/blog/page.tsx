// src/app/blog/page.tsx

import Link from "next/link";
import { fetchBlogIndex, fetchBlogCategories } from "@/lib/server-blog";
import { BlogPostList, BlogCategory } from "@/types/blog";
import FiltersInstant from "@/components/blog/FiltersInstant";
import FeaturedHero from "@/components/blog/FeaturedHero";
import BlogCard from "@/components/blog/BlogCard";
import RecentReadsRow from "@/components/blog/RecentReadsRow";
import s from "@/components/blog/blog.module.css";

export const revalidate = 600;

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
  ordering?: "new" | "old" | "title" | "-title";
};

export default async function BlogIndex({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page || 1);
  const { results, count } = await fetchBlogIndex({
    q: searchParams.q,
    category: searchParams.category,
    page,
    ordering: searchParams.ordering || "new",
  });
  const categories: BlogCategory[] = await fetchBlogCategories();

  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // اگر صفحه ۱ است، اولی را برای هیرو نگه می‌داریم؛ اما هیرو را پایین نشان می‌دهیم
  const [featured, ...rest] = page === 1 ? (results || []) : [null, ...(results || [])];
  const list = page === 1 ? rest : results;

  return (
    <section className="stack gap-4" dir="rtl">
      {/* هِدِر صفحه */}
      <section className={s.hero}>
        <div className="container">
          <div className={s.bc}>
            <Link href="/" className={s.bcLink}>خانه</Link>
            <span className={s.bcSep}>/</span>
            <span className={s.bcHere}>بلاگ</span>
          </div>
        <h1 className="text-strong" style={{ fontSize: "1.6rem", fontWeight: 900 }}>بلاگ ورچینو</h1>
        <p className="t-weak">راهنماها، زندگی با پت‌ها، و مقالات مرجع‌دار</p>
        </div>
      </section>

      {/* سکشن: ادامه مطالعه (سشن) */}
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>ادامه مطالعه</h2>
      </div>
      <RecentReadsRow />

      {/* جداکننده بصری */}
      <div className={s.divider} aria-hidden="true" />

      {/* سکشن: فیلتر و نتایج */}
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>مقالات</h2>
      </div>
      <FiltersInstant categories={categories} />

      <div className={`${s.cardsGrid} grid`}>
        {list?.map((p: BlogPostList) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      {/* جداکننده بصری */}
      {featured ? <div className={s.divider} aria-hidden="true" /> : null}

      <Pagination current={page} total={totalPages} searchParams={searchParams} />
    </section>
  );
}

function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number;
  total: number;
  searchParams: Record<string, any>;
}) {
  if (total <= 1) return null;
  const base = "/blog";
  const sanitize = (obj: Record<string, any>) => {
    const allowed = ["q", "category", "ordering"];
    const out: Record<string, string> = {};
    for (const k of allowed) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim() !== "") out[k] = v;
    }
    return out;
  };
  const mkLink = (p: number) => {
    const cleaned = sanitize(searchParams);
    cleaned.page = String(p);
    const qp = new URLSearchParams(cleaned);
    return `${base}?${qp.toString()}`;
  };
  const pages = [current - 1, current, current + 1].filter((p) => p >= 1 && p <= total);

  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      {current > 1 && (
        <Link className="page" href={mkLink(current - 1)} scroll={false}>
          ‹
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          className="page"
          href={mkLink(p)}
          aria-current={p === current ? "page" : undefined}
          scroll={false}
        >
          {p}
        </Link>
      ))}
      {current < total && (
        <Link className="page" href={mkLink(current + 1)} scroll={false}>
          ›
        </Link>
      )}
    </nav>
  );
}
