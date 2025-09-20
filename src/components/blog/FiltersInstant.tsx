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

  function onCategoryChange(next: string) {
    startTransition(() => {
      router.replace(makeUrl({ category: next || null }, true), { scroll: false });
    });
  }
  function onOrderingChange(next: string) {
    startTransition(() => {
      router.replace(makeUrl({ ordering: next || null }, true), { scroll: false });
    });
  }

  const commitSearch = (nextQ: string) => {
    startTransition(() => {
      router.replace(makeUrl({ q: nextQ || null }, true), { scroll: false });
    });
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const nextQ = q.trim();
    const currQ = (searchParams.get("q") || "").trim();
    if (nextQ === currQ) return;
    const h = setTimeout(() => commitSearch(nextQ), 160);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const topCats = categories.slice(0, 12);
  const hasFilter = Boolean(q.trim() || category || ordering !== "new");

  function onClearAll() {
    setQ("");
    startTransition(() => {
      router.replace(makeUrl({ q: null, category: null, ordering: "new" }, true), { scroll: false });
    });
  }

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

      {/* ردیف دوم: دسته‌ها (چیپ‌ها) */}
      <div className={styles.chipsRow} role="group" aria-label="دسته‌ها">
        <button
          type="button"
          className={`${styles.chip} ${!category ? styles.chipActive : ""}`}
          onClick={() => onCategoryChange("")}
          aria-pressed={!category}
        >
          همه موضوعات
        </button>
        {topCats.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`${styles.chip} ${category === c.slug ? styles.chipActive : ""}`}
            onClick={() => onCategoryChange(c.slug)}
            aria-pressed={category === c.slug}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* خط وضعیت (جای قبلی) */}
      <div className={styles.footerRow}>
        <div id="filters-status" className="t-mute" aria-live="polite">
          {pending
            ? "در حال به‌روزرسانی…"
            : hasFilter
              ? "نتایج به‌روز شد."
              : "برای شروع، یک دسته را انتخاب کنید یا عبارت خود را وارد کنید."}
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
