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
    if (min) chips.push({ key: 'min', label: `از ${min}` });
    if (max) chips.push({ key: 'max', label: `تا ${max}` });
    if (q) chips.push({ key: 'q', label: `جستجو: ${q}` });
    return chips;
  }, [cat, brand, min, max, q, facets.categories]);

  return (
    <div className={className}>
      {/* Mobile toggle */}
      <button className={styles.filterToggle} onClick={()=>setOpen(o=>!o)}>
        فیلترها {open ? '▲' : '▼'}
      </button>

      <div className={`${styles.filterPanel} ${open ? styles.open : ''}`}>
        {/* جستجو */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle}>جستجو</label>
          <div className={styles.row}>
            <input className="input" placeholder="نام/برند" value={q} onChange={(e)=>setQ(e.target.value)} />
            <button className="btn" onClick={()=>setParam({ q })}>جستجو</button>
          </div>
        </div>

        {/* دسته */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle}>دسته‌بندی</label>
          <div className={styles.chips}>
            {facets.categories.map(c => (
              <button
                key={c.key}
                className={`${styles.chip} ${current.cat === c.key ? styles.chipOn : ''}`}
                onClick={()=> setParam({ cat: current.cat === c.key ? '' : c.key })}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* برند */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle}>برند</label>
          <select
            className={styles.select}
            value={brand}
            onChange={(e)=> setParam({ brand: e.target.value })}
          >
            <option value="">همه برندها</option>
            {facets.brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* قیمت */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle}>قیمت (تومان)</label>
          <div className={styles.row}>
            <input className="input" inputMode="numeric" placeholder="حداقل" value={min} onChange={e=>setMin(e.target.value)} />
            <input className="input" inputMode="numeric" placeholder="حداکثر" value={max} onChange={e=>setMax(e.target.value)} />
            <button className="btn" onClick={()=> setParam({ min, max })}>اعمال</button>
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
                  <button onClick={()=> setParam({ [ch.key]: '' } as any)} aria-label="حذف فیلتر">✕</button>
                </span>
              ))}
              <button className={styles.clearAll} onClick={clearAll}>پاک کردن همه</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
