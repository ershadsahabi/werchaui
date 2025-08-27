/* صفحه شاپ WERCHA – موبایل‌فرست، فیلتر/مرتب‌سازی/صفحه‌بندی با URL query
   TODO: تابع getProducts را بعداً به API جنگو وصل کن. */

import styles from './Shop.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Filters from '@/components/shop/Filters';
import SortBar from '@/components/shop/SortBar';
import ProductCard from '@/components/ProductCard';

type Search = {
  q?: string;
  cat?: string;
  brand?: string;
  min?: string; // price min
  max?: string; // price max
  sort?: 'latest' | 'price-asc' | 'price-desc' | 'rating';
  page?: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
  badge?: 'حراج' | 'جدید';
  category: 'dog' | 'cat' | 'bird' | 'small';
  brand: string;
};

const PAGE_SIZE = 12;

// ---- Mock data برای نمایش اولیه (بعداً با fetch جایگزین کن)
const MOCK: Product[] = [
  { id: 1, title: 'کنسرو گربه سالمون', price: 185000, image: '/publicimages/p1.jpg', rating: 4.6, inStock: true, badge:'حراج', category:'cat', brand:'Whiskers' },
  { id: 2, title: 'غذای خشک سگ نژاد کوچک', price: 1150000, image: '/publicimages/p2.jpg', rating: 4.7, inStock: true, category:'dog', brand:'PawTaste' },
  { id: 3, title: 'اسباب‌بازی دندانی', price: 89000, image: '/publicimages/p3.jpg', rating: 4.2, inStock: true, category:'dog', brand:'ChewyFun' },
  { id: 4, title: 'شامپو ضدگره', price: 139000, image: '/publicimages/p4.jpg', rating: 4.1, inStock: true, category:'cat', brand:'PurrClean' },
  { id: 5, title: 'جای خواب ارتجاعی', price: 985000, image: '/publicimages/p5.jpg', rating: 4.8, inStock: true, badge:'جدید', category:'dog', brand:'Wercha' },
  { id: 6, title: 'تشویقی مرغ کم‌چرب', price: 125000, image: '/publicimages/p6.jpg', rating: 4.5, inStock: true, category:'dog', brand:'PawTaste' },
  { id: 7, title: 'شن بهداشتی گربه', price: 220000, image: '/publicimages/p1.jpg', rating: 4.0, inStock: true, category:'cat', brand:'CleanPaws' },
  { id: 8, title: 'میله نشیمن پرنده', price: 69000, image: '/publicimages/p3.jpg', rating: 4.3, inStock: true, category:'bird', brand:'TweetNest' },
  { id: 9, title: 'قفس پرنده متوسط', price: 2150000, image: '/publicimages/p5.jpg', rating: 4.4, inStock: true, category:'bird', brand:'FeatherHome' },
  { id: 10, title: 'غذای همستر', price: 98000, image: '/publicimages/p2.jpg', rating: 4.1, inStock: true, category:'small', brand:'TinyBite' },
  { id: 11, title: 'بشقا‌ب آب‌خوری استیل', price: 149000, image: '/publicimages/p4.jpg', rating: 4.6, inStock: true, category:'dog', brand:'Wercha' },
  { id: 12, title: 'باگ کات‌نپ ارگانیک', price: 165000, image: '/publicimages/p6.jpg', rating: 4.9, inStock: true, category:'cat', brand:'Whiskers' },
  { id: 13, title: 'شانه گره‌بازکن', price: 115000, image: '/publicimages/p3.jpg', rating: 4.2, inStock: true, category:'cat', brand:'PurrClean' },
  { id: 14, title: 'تشک خنک‌کننده', price: 345000, image: '/publicimages/p1.jpg', rating: 4.7, inStock: true, category:'dog', brand:'Wercha' },
  { id: 15, title: 'پد آموزش دستشویی', price: 195000, image: '/publicimages/p2.jpg', rating: 4.4, inStock: true, category:'dog', brand:'ChewyFun' },
  { id: 16, title: 'قلاده سبک', price: 175000, image: '/publicimages/p4.jpg', rating: 4.1, inStock: true, category:'dog', brand:'PawTaste' },
];

async function getProducts(params: Search) {
  // --- فیلتر محلی (بعداً به سرور منتقل کن)
  let list = [...MOCK];

  if (params.q) {
    const q = params.q.trim();
    list = list.filter(p =>
      p.title.includes(q) || p.brand.includes(q)
    );
  }
  if (params.cat) list = list.filter(p => p.category === params.cat);
  if (params.brand) list = list.filter(p => p.brand === params.brand);
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
  if (min != null) list = list.filter(p => p.price >= min);
  if (max != null) list = list.filter(p => p.price <= max);

  switch (params.sort) {
    case 'price-asc': list.sort((a,b)=> a.price - b.price); break;
    case 'price-desc': list.sort((a,b)=> b.price - a.price); break;
    case 'rating': list.sort((a,b)=> b.rating - a.rating); break;
    default: /* latest */ list.sort((a,b)=> b.id - a.id);
  }

  const page = Math.max(1, Number(params.page || 1));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = list.slice(start, start + PAGE_SIZE);

  const facets = {
    categories: [
      { key: 'dog', label: 'سگ' },
      { key: 'cat', label: 'گربه' },
      { key: 'bird', label: 'پرنده' },
      { key: 'small', label: 'حیوانات کوچک' },
    ],
    brands: Array.from(new Set(MOCK.map(m => m.brand))).sort(),
  };

  return { items, total, pages, page, facets };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const s: Search = {
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    cat: typeof searchParams.cat === 'string' ? searchParams.cat : undefined,
    brand: typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
    min: typeof searchParams.min === 'string' ? searchParams.min : undefined,
    max: typeof searchParams.max === 'string' ? searchParams.max : undefined,
    sort: (['latest','price-asc','price-desc','rating'] as const).includes(
      searchParams.sort as any
    ) ? (searchParams.sort as Search['sort']) : 'latest',
    page: typeof searchParams.page === 'string' ? searchParams.page : '1',
  };

  const { items, pages, page, total, facets } = await getProducts(s);

  return (
    <div className={styles.root} dir="rtl">
      {/* BreadCrumb / Hero Bar */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.bc}>
            <Link href="/" className={styles.bcLink}>خانه</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcHere}>فروشگاه</span>
          </div>
          <h1 className={styles.title}>فروشگاه</h1>
          <p className={styles.subtitle}>
            {total} کالا؛ هرچی پتت لازم داره همین‌جاست ✨
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="container">
        <div className={styles.grid}>
          {/* Sidebar Filters (collapsible در موبایل) */}
          <aside className={styles.sidebar}>
            <Filters
              facets={facets}
              current={s}
              className={styles.filterCard}
            />
          </aside>

          {/* Main */}
          <div className={styles.main}>
            <SortBar total={total} current={s} className={styles.sortbar} />

            {/* Products grid */}
            {items.length === 0 ? (
              <div className={styles.empty}>
                <Image src="/publicimages/p6.jpg" alt="" width={80} height={80} />
                <p>نتیجه‌ای پیدا نشد. فیلترها را تغییر بده.</p>
                <Link href="/shop" className="btn">پاک کردن فیلترها</Link>
              </div>
            ) : (
              <div className={styles.prodGrid}>
                {items.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className={styles.pagination}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => {
                const params = new URLSearchParams(
                  Object.entries(s).reduce((acc, [k,v])=>{
                    if (v) acc[k] = String(v);
                    return acc;
                  }, {} as Record<string,string>)
                );
                params.set('page', String(n));
                const href = `/shop?${params.toString()}`;
                return (
                  <Link
                    key={n}
                    href={href}
                    className={`${styles.pageBtn} ${n === page ? styles.pageCurrent : ''}`}
                    aria-current={n === page ? 'page' : undefined}
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
