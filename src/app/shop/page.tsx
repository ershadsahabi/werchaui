import styles from './Shop.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Filters from '@/components/shop/Filters';
import SortBar from '@/components/shop/SortBar';
import ProductCard from '@/components/ProductCard';
import { endpoints } from '@/lib/api';

const PAGE_SIZE = 12;

async function fetchProducts(params: Record<string, string>) {
  // فقط پارامترهای تعریف‌شده و غیرخالی به URL اضافه شوند
  const usp = new URLSearchParams({ page_size: String(PAGE_SIZE) });
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '' && v !== 'undefined' && v !== 'null') {
      usp.set(k, String(v));
    }
  });

  const url = `${endpoints.products}?${usp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch {}
    throw new Error(`Failed to load products: ${res.status} ${res.statusText}\nURL: ${url}\nBody: ${body}`);
  }
  return res.json();
}



export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const s = {
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    cat: typeof searchParams.cat === 'string' ? searchParams.cat : undefined,
    brand: typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
    min: typeof searchParams.min === 'string' ? searchParams.min : undefined,
    max: typeof searchParams.max === 'string' ? searchParams.max : undefined,
    sort: (['latest','price-asc','price-desc','rating'] as const).includes(searchParams.sort as any)
      ? (searchParams.sort as string)
      : 'latest',
    page: typeof searchParams.page === 'string' ? searchParams.page : '1',
  } as Record<string, string>;

  const { items, pages, page, total, facets } = await fetchProducts(s);

  return (
    <div className={styles.root} dir="rtl">
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.bc}>
            <Link href="/" className={styles.bcLink}>خانه</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcHere}>فروشگاه</span>
          </div>
          <h1 className={styles.title}>فروشگاه</h1>
          <p className={styles.subtitle}>{total} کالا؛ هرچی پتت لازم داره همین‌جاست ✨</p>
        </div>
      </section>

        <section className="container">
          <div className={styles.grid}>
            <aside className={styles.sidebar}>
              <Filters facets={facets} current={s as any} className={styles.filterCard} />
            </aside>

            <div className={styles.main}>
              <SortBar total={total} current={s as any} className={styles.sortbar} />

              {items.length === 0 ? (
                <div className={styles.empty}>
                  <Image src="/publicimages/p6.jpg" alt="" width={80} height={80} />
                  <p>نتیجه‌ای پیدا نشد. فیلترها را تغییر بده.</p>
                  <Link href="/shop" className="btn">پاک کردن فیلترها</Link>
                </div>
              ) : (
                <div className={styles.prodGrid}>
                  {items.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

              <div className={styles.pagination}>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
                  const params = new URLSearchParams(
                    Object.entries(s).reduce((acc, [k, v]) => { if (v) acc[k] = String(v); return acc; }, {} as Record<string, string>)
                  );
                  params.set('page', String(n));
                  const href = `/shop?${params.toString()}`;
                  const isCurrent = Number(page) === n;
                  return (
                    <Link
                      key={n}
                      href={href}
                      className={`${styles.pageBtn} ${isCurrent ? styles.pageCurrent : ''}`}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {n}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}