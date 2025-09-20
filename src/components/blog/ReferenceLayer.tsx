"use client";
import { useEffect, useMemo, useState } from "react";
import type { BlogReference } from "@/types/blog";
import s from "./reference.module.css";

/**
 * دو لایه:
 * 1) Tooltip داخل متن: روی عناصر [data-ref-id] یک data-tooltip با خلاصه مرجع می‌گذاریم.
 * 2) سکشن مراجع در انتهای مقاله + مدال نمایش جزئیات و دکمهٔ رفتن به سایت اصلی.
 */
export default function ReferenceLayer({
  references,
  articleSelector = "#article-body",
}: {
  references: BlogReference[];
  articleSelector?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<BlogReference | null>(null);

  // دسترسی سریع بر اساس id
  const map = useMemo(() => {
    const m = new Map<string | number, BlogReference>();
    references.forEach(r => m.set(r.id, r));
    return m;
  }, [references]);

  // لایه 1: Tooltip روی ارجاعات داخل متن
  useEffect(() => {
    const root = document.querySelector(articleSelector);
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-ref-id]");
    nodes.forEach(el => {
      const rid = el.getAttribute("data-ref-id")!;
      const ref = map.get(isNaN(Number(rid)) ? rid : Number(rid));
      if (!ref) return;
      // متن کوتاه برای Tooltip
      const short =
        ref.abstract?.trim()?.slice(0, 140) ||
        ref.title?.slice(0, 140) ||
        ref.source ||
        "مرجع";
      el.setAttribute("data-tooltip", short + (short.length >= 140 ? "…" : ""));
      el.classList.add(s.inlineRef);
      // کلیک → باز شدن مدال
      el.style.cursor = "pointer";
      el.addEventListener("click", () => { setActive(ref); setOpen(true); }, { once:false });
    });
    return () => {
      nodes.forEach(el => {
        el.removeAttribute("data-tooltip");
        el.classList.remove(s.inlineRef);
      });
    };
  }, [articleSelector, map]);

  // لایه 2: لیست مراجع پایین مقاله
  return (
    <>
      {references.length > 0 && (
        <section className="stack gap-2" style={{marginTop: 20}}>
          <h3 style={{fontWeight:900}}>مراجع</h3>
          <ol className={s.refList}>
            {references.map((r, i) => (
              <li key={String(r.id)} className={s.refItem}>
                <button className="link" onClick={() => { setActive(r); setOpen(true); }}>
                  <strong>{r.title}</strong>
                </button>
                <span className="t-mute"> — {r.source || ""} {r.year ? `• ${r.year}` : ""}</span>
                {r.authors_text && <div className="t-weak" style={{fontSize:".85rem"}}>{r.authors_text}</div>}
                {r.abstract && <div className="t-weak clamp-2">{r.abstract}</div>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* مدال مرجع */}
      {open && active && (
        <>
          <div className="backdrop" onClick={() => setOpen(false)} data-backdrop />
          <div className="modal" role="dialog" aria-modal="true" aria-label="مرجع">
            <div className="modal__panel stack gap-3">
              <header className="stack gap-1">
                <h4 style={{fontWeight:900}}>{active.title}</h4>
                <div className="t-mute" style={{fontSize:".9rem"}}>
                  {active.authors_text ? `${active.authors_text} • ` : ""}
                  {active.source || ""}{active.year ? ` • ${active.year}` : ""}
                </div>
              </header>
              {active.abstract && <p className="t-weak" style={{whiteSpace:"pre-wrap"}}>{active.abstract}</p>}
              {active.notes && <div className="alert alert--info"><div /> <div>{active.notes}</div></div>}
              <footer className="cluster" style={{justifyContent:"space-between"}}>
                <button className="btn btn--ghost" onClick={() => setOpen(false)}>بستن</button>
                <a className="btn" href={active.url} target="_blank" rel="noopener noreferrer nofollow">
                  مشاهده در سایت اصلی
                </a>
              </footer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
