'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from '@/app/shop/Shop.module.css';

type Search = {
  q?: string; cat?: string; brand?: string; min?: string; max?: string;
  sort?: 'latest'|'price-asc'|'price-desc'|'rating'; page?: string;
};

type CategoryFacet = {
  key: string;
  label: string;
  image?: string | null;
  description?: string | null;
};

export default function Filters({
  facets,
  current,
  className,
}: {
  facets: { categories: CategoryFacet[]; brands: string[] };
  current: Search;
  className?: string;
}) {
  const [open, setOpen] = useState(false); // برای موبایل
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // فقط برای ورودی‌ها state محلی داریم
  const [q, setQ]     = useState(current.q   || '');
  const [min, setMin] = useState(current.min || '');
  const [max, setMax] = useState(current.max || '');
  const cat   = current.cat   || '';
  const brand = current.brand || '';

  // همگام‌سازی state ورودی‌ها وقتی URL/props عوض می‌شود
  useEffect(()=>{ setQ(current.q || '');   }, [current.q]);
  useEffect(()=>{ setMin(current.min || ''); }, [current.min]);
  useEffect(()=>{ setMax(current.max || ''); }, [current.max]);

  const setParam = (patch: Partial<Search>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') next.delete(k);
      else next.set(k, String(v));
    });
    next.delete('page'); // هر تغییر فیلتر، بره صفحه 1
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const removeFilter = (key: keyof Search) => {
    // علاوه بر حذف از URL، state محلی مرتبط را هم خالی کن
    if (key === 'q')  setQ('');
    if (key === 'min') setMin('');
    if (key === 'max') setMax('');
    setParam({ [key]: '' } as Partial<Search>);
  };

  const clearAll = () => {
    // URL تمیز + ورودی‌ها ریست
    setQ(''); setMin(''); setMax('');
    router.push(`${pathname}`, { scroll: false });
  };

  // چیپ‌ها را از current (و نه state محلی) می‌سازیم تا با URL هم‌نظر باشد
  const selected = useMemo(() => {
    const chips: { key: keyof Search; label: string }[] = [];
    if (current.cat)  chips.push({ key: 'cat',  label: facets.categories.find(c=>c.key===current.cat)?.label || '' });
    if (current.brand)chips.push({ key: 'brand',label: current.brand });
    if (current.min)  chips.push({ key: 'min',  label: `از ${Number(current.min).toLocaleString('fa-IR')}` });
    if (current.max)  chips.push({ key: 'max',  label: `تا ${Number(current.max).toLocaleString('fa-IR')}` });
    if (current.q)    chips.push({ key: 'q',    label: `جستجو: ${current.q}` });
    return chips;
  }, [current, facets.categories]);

  const selectedCat = useMemo(
    () => (cat ? facets.categories.find(c => c.key === cat) || null : null),
    [cat, facets.categories]
  );

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
            <input
              id="q-input"
              className={styles.select}
              placeholder="نام/برند"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
            />
            <button
              type="button"
              onClick={()=>setParam({ q })}  /* q خالی ⇒ حذف پارامتر */
              title="اجرای جستجو"
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

        {/* دسته‌بندی (Dropdown) */}
        <div className={styles.filterBlock}>
          <label className={styles.blockTitle} htmlFor="cat-select">دسته‌بندی</label>
          <select
            id="cat-select"
            className={styles.select}
            value={cat}
            onChange={(e)=> setParam({ cat: e.target.value })}
            title="انتخاب دسته‌بندی"
          >
            <option value="">همه دسته‌ها</option>
            {facets.categories.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          {/* پیش‌نمایش 1×1 کامل (object-fit: contain) */}
          {selectedCat && (
            <div className={styles.catPreviewCard} aria-label={`پیش‌نمایش ${selectedCat.label}`}>
              <div className={styles.catPrevMedia} /* مربع */>
                <Image
                  src={selectedCat.image || '/publicimages/hero22.png'}
                  alt={selectedCat.label}
                  fill
                  className={styles.catPrevImg}   /* object-fit: contain */
                  sizes="(min-width:768px) 280px, 100vw"
                />
              </div>
              <div className={styles.catPrevBody}>
                <div className={styles.catPrevTitle}>{selectedCat.label}</div>
                {selectedCat.description ? (
                  <div className={styles.catPrevDesc}>{selectedCat.description}</div>
                ) : null}
              </div>
 
            </div>
          )}
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
                <span key={ch.key as string} className={styles.selChip}>
                  {ch.label}
                  <button
                    type="button"
                    onClick={()=> removeFilter(ch.key)}
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
