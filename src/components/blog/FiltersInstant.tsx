// src/components/blog/FiltersInstant.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { BlogCategory } from "@/types/blog";
import styles from "./filters.module.css";

export default function FiltersInstant({ categories }: { categories: BlogCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const urlQ = searchParams.get("q") || "";
  const [q, setQ] = useState(urlQ);
  const category = searchParams.get("category") || "";
  const ordering = searchParams.get("ordering") || "new";

  const didMountRef = useRef(false);

  // ⬅️ این ref موقعیت اسکرول را قبل از ناوبری ذخیره می‌کند
  const savedScrollRef = useRef<number | null>(null);

  // ⬅️ ناوبری با حفظ اسکرول (بدون بالا پریدن صفحه)
  const navigateWithScrollPreserved = (href: string) => {
    if (typeof window !== "undefined") {
      savedScrollRef.current = window.scrollY;
    }
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  // ⬅️ وقتی Transition تمام شد، اسکرول را برگردان
  useEffect(() => {
    if (!pending && savedScrollRef.current != null) {
      const y = savedScrollRef.current;
      savedScrollRef.current = null;
      // کمی تأخیر برای اطمینان از رندر نتایج
      requestAnimationFrame(() => window.scrollTo({ top: y }));
    }
  }, [pending]);

  const makeUrl = useMemo(() => {
    return (patch: Record<string, string | null>, resetPage: boolean) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (!v) sp.delete(k);
        else sp.set(k, v);
      });
      if (resetPage) sp.set("page", "1");
      const qs = sp.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    };
  }, [pathname, searchParams]);

  // --- تغییر مرتب‌سازی
  function onOrderingChange(next: string) {
    const href = makeUrl({ ordering: next || null }, true);
    navigateWithScrollPreserved(href);
  }

  // --- جستجو
  const commitSearch = (nextQ: string) => {
    const href = makeUrl({ q: nextQ || null }, true);
    navigateWithScrollPreserved(href);
  };

  // دیباونس پویا برای جستجو (80–140ms)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const nextQ = q.trim();
    const currQ = (searchParams.get("q") || "").trim();
    if (nextQ === currQ) return;

    const len = nextQ.length;
    const delay = len > 16 ? 80 : len > 8 ? 110 : 140;
    const h = setTimeout(() => commitSearch(nextQ), delay);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const topCats = categories.slice(0, 12);
  const hasFilter = Boolean(q.trim() || category || ordering !== "new");

  function onClearAll() {
    setQ("");
    const href = makeUrl({ q: null, category: null, ordering: "new" }, true);
    navigateWithScrollPreserved(href);
  }

  // --- ساخت لینک دسته با prefetch دستی + حفظ اسکرول
  const categoryHref = (slug: string) => makeUrl({ category: slug || null }, true);

  // برچسب مرتب‌سازی برای نمایش وضعیت
  const orderingLabel = (() => {
    switch (ordering) {
      case "old": return "قدیمی‌تر";
      case "title": return "عنوان (A→Z)";
      case "-title": return "عنوان (Z→A)";
      default: return "جدیدترین";
    }
  })();

  // نام دسته فعال
  const activeCatName = category ? (categories.find(c => c.slug === category)?.name || category) : "همه موضوعات";

  // خلاصه وضعیت (همیشه نمایش بده)
  const summary = [
    `دسته: ${activeCatName}`,
    `مرتب‌سازی: ${orderingLabel}`,
    q.trim() ? `جستجو: «${q.trim()}»` : null,
  ].filter(Boolean).join(" • ");

  return (
    <section
      className={`${styles.cardChrome} card`}
      role="search"
      dir="rtl"
      aria-label="فیلترهای بلاگ"
      aria-busy={pending || undefined}
    >
      {/* ردیف اول: جستجو + ترتیب نمایش */}
      <div className={styles.wrap}>
        {/* جستجو */}
        <div className={`${styles.field} ${styles.fieldGrow}`}>
          <label className={styles.label} htmlFor="q">جستجو در بلاگ</label>
          <div className="input-wrap">
            <span className={`${styles.inputIcon} input-icon`} aria-hidden>🔎</span>
            <input
              id="q"
              className={`${styles.control} ${styles.input} input input--with-icon`}
              name="q"
              placeholder="مثال: غذای سگ، تربیت توله‌سگ، واکسیناسیون گربه"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const nextQ = q.trim();
                  if ((searchParams.get("q") || "").trim() !== nextQ) commitSearch(nextQ);
                }
              }}
              aria-describedby="filters-status"
              enterKeyHint="search"
              autoComplete="off"
            />
          </div>
        </div>

        {/* ترتیب نمایش */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ord">ترتیب نمایش</label>
          <div className={`${styles.selectWrap} select-wrap`}>
            <select
              id="ord"
              className={`${styles.control} ${styles.select} select`}
              value={ordering}
              onChange={(e) => onOrderingChange(e.target.value)}
              aria-label="ترتیب نمایش"
            >
              <option value="new">جدیدترین</option>
              <option value="old">قدیمی‌تر</option>
              <option value="title">عنوان (A→Z)</option>
              <option value="-title">عنوان (Z→A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ردیف دوم: دسته‌ها (چیپ‌ها) — به‌جای <Link> از <a> با کنترل کامل ناوبری */}
      <div className={styles.chipsRow} role="group" aria-label="دسته‌ها">
        {/* همه موضوعات */}
        <a
          href={categoryHref("")}
          className={`${styles.chip} ${!category ? styles.chipActive : ""}`}
          aria-pressed={!category}
          onMouseEnter={(e) => router.prefetch((e.currentTarget as HTMLAnchorElement).href)}
          onFocus={(e) => router.prefetch((e.currentTarget as HTMLAnchorElement).href)}
          onClick={(e) => { e.preventDefault(); navigateWithScrollPreserved((e.currentTarget as HTMLAnchorElement).href); }}
        >
          همه موضوعات
        </a>

        {topCats.map((c) => {
          const active = category === c.slug;
          const href = categoryHref(c.slug);
          return (
            <a
              key={c.slug}
              href={href}
              className={`${styles.chip} ${active ? styles.chipActive : ""}`}
              aria-pressed={active}
              onMouseEnter={() => router.prefetch(href)}
              onFocus={() => router.prefetch(href)}
              onClick={(e) => { e.preventDefault(); navigateWithScrollPreserved(href); }}
            >
              {c.name}
            </a>
          );
        })}
      </div>

      {/* خط وضعیت: اسپینر کوچک + خلاصه فیلترها (بدون متن‌های قبلی) */}
      <div className={styles.footerRow}>
        <div id="filters-status" className={styles.status} aria-live="polite">
          {pending && <span className={styles.spinner} aria-hidden="true" />}
          <span className={styles.statusText}>نتایج بر اساس — {summary}</span>
        </div>

        <div className={styles.actions}>
          {hasFilter && (
            <button type="button" className={`btn btn--ghost ${styles.clearBtn}`} onClick={onClearAll}>
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
