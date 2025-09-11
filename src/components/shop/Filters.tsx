'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/shop/Shop.module.css';

type Search = {
  q?: string; cat?: string; brand?: string; min?: string; max?: string;
  sort?: 'latest'|'price-asc'|'price-desc'|'rating'; page?: string;
};

export default function Filters({
  facets,
  current,
  className,
}: {
  facets: { categories: { key: string; label: string }[]; brands: string[] };
  current: Search;
  className?: string;
}) {
  const [open, setOpen] = useState(false); // برای موبایل
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(current.q || '');
  const [min, setMin] = useState(current.min || '');
  const [max, setMax] = useState(current.max || '');
  const cat = current.cat || '';
  const brand = current.brand || '';

  const setParam = (patch: Partial<Search>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') next.delete(k);
      else next.set(k, String(v));
    });
    next.delete('page'); // هر تغییر فیلتر، بره صفحه 1
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(`${pathname}`, { scroll: false });
  };

  const selected = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (cat) chips.push({ key: 'cat', label: facets.categories.find(c=>c.key===cat)?.label || '' });
    if (brand) chips.push({ key: 'brand', label: brand });
    if (min) chips.push({ key: 'min', label: `از ${Number(min).toLocaleString('fa-IR')}` });
    if (max) chips.push({ key: 'max', label: `تا ${Number(max).toLocaleString('fa-IR')}` });
    if (q) chips.push({ key: 'q', label: `جستجو: ${q}` });
    return chips;
  }, [cat, brand, min, max, q, facets.categories]);

  return (
    <div className={className}>
      {/* Mobile toggle */}
      <button
        type="button"
        className={styles.filterToggle}
        onClick={()=>setOpen(o=>!o)}
        aria-expanded={open}
        aria-controls="filters-panel"
        title={open ? 'بستن فیلترها' : 'باز کردن فیلترها'}
      >
        {open ? 'بستن فیلترها ▲' : 'باز کردن فیلترها ▼'}
      </button>

      <div id="filters-panel" className={`${styles.filterPanel} ${open ? styles.open : ''}`}>
        {/* جستجو */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle} htmlFor="q-input">جستجو</label>
          <div className={styles.row}>
            {/* از styles.select برای رنگ/کنتراست ورودی‌ها استفاده می‌کنیم */}
            <input
              id="q-input"
              className={styles.select}
              placeholder="نام/برند"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
            />
            <button
              type="button"
              onClick={()=>setParam({ q })}
              title="اجرای جستجو"
              /* تضمین کنتراست با توکن‌ها */
              style={{
                background: 'var(--btn-bg)',
                color: 'var(--on-primary)',
                border: '1px solid var(--btn-bg-press)',
                borderRadius: '10px',
                padding: '10px 12px',
                fontWeight: 800,
                boxShadow: '0 10px 18px color-mix(in oklab, var(--btn-bg) 20%, transparent)',
                transition: 'filter .2s ease',
              }}
              onMouseOver={(e)=>((e.currentTarget.style.filter='brightness(1.05)'))}
              onMouseOut={(e)=>((e.currentTarget.style.filter=''))}
            >
              جستجو
            </button>
          </div>
        </div>

        {/* دسته‌بندی */}
        <div className={styles.filterBlock}>
          <span className={styles.blockTitle}>دسته‌بندی</span>
          <div className={styles.chips} role="group" aria-label="فیلتر بر اساس دسته‌بندی">
            {facets.categories.map(c => {
              const on = current.cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                  onClick={()=> setParam({ cat: on ? '' : c.key })}
                  aria-pressed={on}
                  title={on ? `حذف فیلتر ${c.label}` : `اعمال فیلتر ${c.label}`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* برند */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle} htmlFor="brand-select">برند</label>
          <select
            id="brand-select"
            className={styles.select}
            value={brand}
            onChange={(e)=> setParam({ brand: e.target.value })}
            title="انتخاب برند"
          >
            <option value="">همه برندها</option>
            {facets.brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* قیمت */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle} htmlFor="min-input">قیمت (تومان)</label>
          <div className={styles.row}>
            <input
              id="min-input"
              className={styles.select}
              inputMode="numeric"
              placeholder="حداقل"
              value={min}
              onChange={e=>setMin(e.target.value)}
            />
            <input
              id="max-input"
              className={styles.select}
              inputMode="numeric"
              placeholder="حداکثر"
              value={max}
              onChange={e=>setMax(e.target.value)}
            />
            <button
              type="button"
              onClick={()=> setParam({ min, max })}
              title="اعمال بازهٔ قیمت"
              style={{
                background: 'var(--btn-bg)',
                color: 'var(--on-primary)',
                border: '1px solid var(--btn-bg-press)',
                borderRadius: '10px',
                padding: '10px 12px',
                fontWeight: 800,
                boxShadow: '0 10px 18px color-mix(in oklab, var(--btn-bg) 20%, transparent)',
                transition: 'filter .2s ease',
              }}
              onMouseOver={(e)=>((e.currentTarget.style.filter='brightness(1.05)'))}
              onMouseOut={(e)=>((e.currentTarget.style.filter=''))}
            >
              اعمال
            </button>
          </div>
        </div>

        {/* انتخاب‌ها */}
        {selected.length > 0 && (
          <div className={styles.selected}>
            <div className={styles.selTitle}>فیلترهای فعال</div>
            <div className={styles.selChips}>
              {selected.map(ch => (
                <span key={ch.key} className={styles.selChip}>
                  {ch.label}
                  <button
                    type="button"
                    onClick={()=> setParam({ [ch.key]: '' } as any)}
                    aria-label={`حذف فیلتر ${ch.label}`}
                    title={`حذف فیلتر ${ch.label}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <button
                type="button"
                className={styles.clearAll}
                onClick={clearAll}
                title="پاک کردن همه فیلترها"
              >
                پاک کردن همه
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
