// src\components\blog\ReferencesPanel.tsx

"use client";

import { useId, useState } from "react";
import s from "./references.module.css";

export type RefItem = {
  id?: string | number;
  title: string;
  source?: string;
  year?: string | number;
  url?: string;
  authors_text?: string;
};

export default function ReferencesPanel({ refs }: { refs: RefItem[] }) {
  const [open, setOpen] = useState(false);
  const dlgId = useId(); // پایدار و قطعی در رندر
  // رندر اولیه: دکمه + لیست خلاصه؛ مودال فقط با کلیک باز می‌شود

  if (!Array.isArray(refs) || refs.length === 0) return null;

  return (
    <section className={s.wrap} aria-label="مراجع">
      <header className={s.header}>
        <h3 className={s.title}>مراجع</h3>
        <button type="button" className="btn btn--outline" onClick={() => setOpen(true)}>
          مشاهدهٔ جزئیات
        </button>
      </header>

      {/* خلاصهٔ کوتاه پایین مقاله */}
      <ul className={s.listMini}>
        {refs.slice(0, 5).map((r, idx) => (
          <li key={r.id ?? idx} className={s.itemMini}>
            <span className={s.citeTitle}>{r.title}</span>
            {r.source && <span className={s.citeSource}> — {r.source}</span>}
            {r.year && <span className={s.citeYear}> ({r.year})</span>}
          </li>
        ))}
        {refs.length > 5 && <li className={s.more}>+ {refs.length - 5} مرجع دیگر…</li>}
      </ul>

      {/* مودال سبک (بدون SSR-branching) */}
      {open && (
        <>
          <div className="backdrop" data-backdrop onClick={() => setOpen(false)} />
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby={dlgId}>
            <div className="modal__panel">
              <header className={s.modalHead}>
                <h4 id={dlgId} className="t-strong">جزئیات مراجع</h4>
                <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>بستن</button>
              </header>

              <ol className={s.listFull}>
                {refs.map((r, idx) => (
                  <li key={r.id ?? idx} className={s.itemFull}>
                    <div className={s.fullTitle}>{r.title}</div>
                    <div className={s.fullMeta}>
                      {r.authors_text && <span>{r.authors_text}</span>}
                      {r.source && <span> • {r.source}</span>}
                      {r.year && <span> • {r.year}</span>}
                    </div>
                    {r.url && (
                      <a className="link" href={r.url} target="_blank" rel="noopener noreferrer">
                        رفتن به منبع
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
