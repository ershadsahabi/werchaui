'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/shop/Shop.module.css';

type Search = {
  q?: string; cat?: string; brand?: string; min?: string; max?: string;
  sort?: 'latest'|'price-asc'|'price-desc'|'rating'; page?: string;
};

export default function SortBar({
  total,
  current,
  className,
}: {
  total: number;
  current: Search;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const setSort = (sort: NonNullable<Search['sort']>) => {
    const q = new URLSearchParams(sp.toString());
    q.set('sort', sort);
    q.delete('page'); // برگرد ابتدای لیست
    router.push(`${pathname}?${q.toString()}`, { scroll: false });
  };

  return (
    <div className={`${styles.sortbar} ${className || ''}`}>
      <div className={styles.count}><strong>{total}</strong> کالا</div>
      <div className={styles.sorts}>
        <label htmlFor="sort">مرتب‌سازی:</label>
        <select
          id="sort"
          className={styles.select}
          value={current.sort || 'latest'}
          onChange={(e)=> setSort(e.target.value as any)}
        >
          <option value="latest">جدیدترین</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="rating">محبوب‌ترین</option>
        </select>
      </div>
    </div>
  );
}
