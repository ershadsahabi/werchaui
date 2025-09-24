// components/search/SearchBox.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { endpoints } from '@/lib/api';
import styles from './SearchBox.module.css';

type ProductHit = {
  id: number;
  title: string;
  image?: string | null;
  price: number;
  stock?: number;
};

type Props = {
  id?: string;
  placeholder?: string;
  className?: string;         // برای استفاده با استایل‌های موجود هدر
  inputClassName?: string;    // مثل styles.searchInput
  buttonClassName?: string;   // مثل styles.searchBtn
  onSubmitted?: () => void;   // در موبایل برای بستن دراور
};

const STORAGE_KEY = 'petshop-search-recent';
const DEBOUNCE_MS = 250;

export default function SearchBox({
  id = 'site-search',
  placeholder = 'جستجوی محصول، برند، دسته…',
  className,
  inputClassName,
  buttonClassName,
  onSubmitted,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [q, setQ] = useState<string>(sp.get('q') || '');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<ProductHit[]>([]);
  const [active, setActive] = useState<number>(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-listbox`;
  const inputId = `${id}-input`;

  // recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);
  const pushRecent = (term: string) => {
    try {
      const prev = recent.filter((r) => r !== term);
      const next = [term, ...prev].slice(0, 7);
      setRecent(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  // خارج کلیک → بستن
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // دی‌بونس فچ
  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      setOpen(recent.length > 0); // خالی: فقط «جستجوهای اخیر» را نشان بده
      return;
    }

    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;

    const t = setTimeout(async () => {
      try {
        const url = `${endpoints.products}?page_size=5&q=${encodeURIComponent(q.trim())}`;
        const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const list = Array.isArray(data?.items) ? data.items : [];
        setHits(
          list.map((p: any) => ({
            id: p.id,
            title: p.title,
            image: p.image || null,
            price: p.price,
            stock: typeof p.stock === 'number' ? p.stock : undefined,
          }))
        );
        setOpen(true);
        setActive(-1);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') {
          setHits([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;

    pushRecent(term);

    // اگر آیتمی فعال است و انتخاب‌پذیر، مستقیم به صفحه محصول برو
    if (active >= 0 && hits[active]) {
      const pid = hits[active].id;
      router.push(`/product/${pid}`);
    } else {
      // در غیر این صورت به صفحه لیست نتایج
      const params = new URLSearchParams(sp.toString());
      params.set('q', term);
      params.delete('page'); // از اول
      router.push(`/shop?${params.toString()}`);
    }

    setOpen(false);
    setActive(-1);
    onSubmitted?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  const showRecent = open && !q.trim() && recent.length > 0;
  const showHits = open && q.trim().length > 0 && hits.length > 0;

  const comboboxAria = {
    role: 'combobox',
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': open,
    'aria-owns': listId,
    'aria-controls': listId,
  };

  const activeDesc = active >= 0 ? `${id}-opt-${hits[active]?.id}` : undefined;

  return (
    <div ref={boxRef} className={`${styles.wrap} ${className || ''}`} dir="rtl">
      <form className={styles.form} onSubmit={onSubmit} {...comboboxAria}>
        <input
          id={inputId}
          className={`${styles.input} ${inputClassName || ''}`}
          name="q"
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={activeDesc}
          aria-label="جستجو"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
<button
  type="submit"
  className={`${styles.btn} ${buttonClassName || ''}`}
  aria-label="جستجو"
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 15l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</button>

      </form>

      {/* لیست پیشنهادها */}
      {(showHits || showRecent) && (
        <ul id={listId} role="listbox" className={styles.list} aria-label="پیشنهادهای جستجو">
          {showRecent && (
  <>
    <li className={styles.groupTitle} aria-hidden>جستجوهای اخیر</li>

    {recent.map((term, idx) => {
      const idAttr = `${id}-recent-${idx}`;
      return (
        <li
          key={idAttr}
          id={idAttr}
          role="option"
          aria-selected={false}
          className={`${styles.item} ${styles.recentRow}`}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* آیکن ساعت */}
          <span className={styles.recentIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>

          {/* متن ترم - کلیک روی متن = اجرا */}
          <button
            type="button"
            className={styles.recentTerm}
            title={term}
            onClick={() => { setQ(term); setTimeout(() => onSubmit(), 0); }}
          >
            {term}
          </button>

          {/* حذف تکی */}
          <button
            type="button"
            className={styles.recentRemove}
            aria-label={`حذف ${term} از جستجوهای اخیر`}
            title="حذف از تاریخچه"
            onClick={() => {
              const next = recent.filter((r) => r !== term);
              setRecent(next);
              try { localStorage.setItem('petshop-search-recent', JSON.stringify(next)); } catch {}
            }}
          >
            ×
          </button>
        </li>
      );
    })}

    {/* اکشن گروهی */}
    <li className={styles.recentActions}>
      <button
        type="button"
        className={styles.clearAllBtn}
        onClick={() => {
          setRecent([]);
          try { localStorage.removeItem('petshop-search-recent'); } catch {}
        }}
      >
        پاک کردن همه
      </button>
    </li>

    {q.trim().length > 0 && <li className={styles.separator} aria-hidden />}
  </>
)}


          {showHits && hits.map((h, i) => {
            const idAttr = `${id}-opt-${h.id}`;
            const selected = i === active;
            return (
              <li
                key={idAttr}
                id={idAttr}
                role="option"
                aria-selected={selected}
                className={`${styles.item} ${selected ? styles.itemActive : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { router.push(`/product/${h.id}`); setOpen(false); onSubmitted?.(); }}
              >
                <div className={styles.thumb}>
                  <Image
                    src={h.image || '/publicimages/hero22.png'}
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <div className={styles.meta}>
                  <div className={styles.title} title={h.title}>{h.title}</div>
                  <div className={styles.sub}>
                    {h.price.toLocaleString('fa-IR')} تومان
                    {typeof h.stock === 'number' && h.stock >= 0 && (
                      <span className={styles.stock}> • موجودی {h.stock}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}

          {q.trim() && (
            <li
              role="option"
              aria-selected={active === hits.length}
              className={`${styles.item} ${active === hits.length ? styles.itemActive : ''} ${styles.viewAll}`}
              onMouseEnter={() => setActive(hits.length)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSubmit()}
            >
              مشاهده همه نتایج برای «{q}»
            </li>
          )}
        </ul>
      )}

    </div>
  );
}
