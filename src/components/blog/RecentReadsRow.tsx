"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import s from "./recent.module.css";

type Snapshot = {
  slug: string;
  title?: string;
  cover?: string | null;
  category_name?: string | null;
  reading_time_min?: number | null;
  ts?: number;
};

type Item = {
  slug: string;
  title: string;
  cover: string | null;
  category_name?: string | null;
  reading_time_min?: number | null;
};

function readRecent(): Item[] {
  // تلاش برای خواندن از کلید استاندارد جدید، در صورت نبود، قدیمی
  const KEYS = ["werch:blog:recent:v3", "recentReads"];
  for (const k of KEYS) {
    try {
      const raw = typeof window !== "undefined" ? (localStorage.getItem(k) ?? sessionStorage.getItem(k)) : null;
      if (!raw) continue;
      const arr = JSON.parse(raw) as Snapshot[];
      if (!Array.isArray(arr) || arr.length === 0) continue;

      // جدیدترین‌ها اول + سقف 10 مورد
      const ordered = [...arr]
        .sort((a, b) => (b.ts || 0) - (a.ts || 0))
        .slice(0, 10);

      return ordered.map((x) => ({
        slug: x.slug,
        title: x.title || x.slug,
        cover: (x.cover as any) ?? null,
        category_name: x.category_name ?? null,
        reading_time_min: x.reading_time_min ?? null,
      }));
    } catch {
      // ignore and try next key
    }
  }
  return [];
}

export default function RecentReadsRow() {
  const [items, setItems] = useState<Item[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = readRecent();
    setItems(data);
  }, []);

  if (!items.length) return null;

  const scrollByAmount = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amt = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir === "next" ? amt : -amt, behavior: "smooth" });
  };

  return (
    <section className={s.wrap} aria-label="ادامه مطالعه" dir="rtl">
      <button className={`${s.nav} ${s.navPrev}`} type="button" aria-label="قبلی" onClick={() => scrollByAmount("prev")}>‹</button>

      <div className={s.scrollerMask}>
        <div className={s.scroller} ref={scrollerRef}>
          {items.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={s.item} aria-label={p.title}>
              <div className={s.media}>
                {p.cover ? (
                  <Image src={p.cover} alt="" width={320} height={200} />
                ) : (
                  <div className="skeleton" style={{ width: "100%", height: "100%" }} />
                )}
              </div>
              <div className={s.meta}>
                <div className={s.titleSmall}>{p.title}</div>
                <div className={s.badges}>
                  {p.category_name && <span className="tag">{p.category_name}</span>}
                  {p.reading_time_min ? <span className="badge badge--info">{p.reading_time_min} دقیقه</span> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button className={`${s.nav} ${s.navNext}`} type="button" aria-label="بعدی" onClick={() => scrollByAmount("next")}>›</button>
    </section>
  );
}
