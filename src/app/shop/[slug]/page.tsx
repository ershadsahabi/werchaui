// src/app/shop/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import styles from './ProductDetail.module.css';
import { endpoints } from '@/lib/api';
import { serverFetch } from '@/lib/server-fetch';
import ProductCard from '@/components/ProductCard';
import Gallery from './Gallery';
import BuyBox from './BuyBox';
import MobileBar from './MobileBar';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// سازگار با endpoints فعلی/قدیمی
const productDetailUrl = (slug: string) =>
  (endpoints as any).productDetail
    ? (endpoints as any).productDetail(slug)
    : `${endpoints.products}${encodeURIComponent(slug)}/`;

async function fetchProduct(slug: string) {
  const res = await serverFetch(productDetailUrl(slug), { method: 'GET', revalidate: 60 });
  if (!res.ok) throw new Error('NOT_FOUND');
  return res.json();
}

async function fetchRelated(catKey: string, excludeId: number) {
  const url = `${endpoints.products}?cat=${encodeURIComponent(catKey)}&page_size=8&sort=rating`;
  const res = await serverFetch(url, { method: 'GET', revalidate: 300 });
  if (!res.ok) return { items: [] as any[] };
  const data = await res.json();
  return { items: (data.items || []).filter((p: any) => p?.id !== excludeId) };
}

// متادیتای دسته از فست‌ها (facets)
async function fetchCatMeta(catKey: string) {
  if (!catKey) return null;
  const res = await serverFetch(`${endpoints.products}?page_size=1`, { method: 'GET', revalidate: 600 });
  if (!res.ok) return null;
  const data = await res.json();
  const cats = (data?.facets?.categories ?? []) as Array<{ key: string; label: string; image?: string; description?: string }>;
  return cats.find(c => c.key === catKey) || null;
}

// SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const p = await fetchProduct(params.slug);
    const title = `${p.title} | Wircino`;
    const desc = (p.description || `خرید ${p.title} با بهترین قیمت`).slice(0, 160);
    const ogImages = p.images?.length ? p.images.map((im: any) => im.url) : (p.image ? [p.image] : []);
    return {
      title,
      description: desc,
      alternates: { canonical: `/shop/${p.slug}` },
      openGraph: { title, description: desc, images: ogImages },
    };
  } catch {
    return { title: 'محصول | Wircino', description: 'جزئیات محصول' };
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const p = await fetchProduct(params.slug);
  const [catMeta, related] = await Promise.all([
    fetchCatMeta(p.category),
    fetchRelated(p.category, p.id),
  ]);

  const inStock = (typeof p.stock === 'number' ? p.stock > 0 : !!p.in_stock);

  const productLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: (p.images?.length ? p.images.map((im: any) => im.url) : [p.image]).filter(Boolean),
    description: p.description || '',
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    sku: String(p.id),
    category: catMeta?.label || p.category || undefined,
    aggregateRating: typeof p.rating === 'number' && p.rating > 0
      ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: Math.max(1, Math.round(p.rating * 3)) }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${p.slug}`,
      priceCurrency: 'IRR',
      price: p.price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  // Breadcrumb با مرحلهٔ دسته (اگر داریم)
  const breadcrumbList = [
    { '@type': 'ListItem', position: 1, name: 'خانه', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'فروشگاه', item: `${SITE_URL}/shop` },
  ] as any[];

  if (p.category) {
    breadcrumbList.push({
      '@type': 'ListItem',
      position: 3,
      name: catMeta?.label || p.category,
      item: `${SITE_URL}/shop?cat=${encodeURIComponent(p.category)}`,
    });
    breadcrumbList.push({
      '@type': 'ListItem',
      position: 4,
      name: p.title,
      item: `${SITE_URL}/shop/${p.slug}`,
    });
  } else {
    breadcrumbList.push({
      '@type': 'ListItem',
      position: 3,
      name: p.title,
      item: `${SITE_URL}/shop/${p.slug}`,
    });
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbList,
  };

  return (
    <div className={styles.root} dir="rtl">
      <Script id="ld-product" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <Script id="ld-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* نان‌برگ */}
      <nav className={styles.bc} aria-label="breadcrumb">
        <Link href="/" className="link link--subtle">خانه</Link>
        <span className={styles.sep}>/</span>
        <Link href="/shop" className="link link--subtle">فروشگاه</Link>
        {p.category && (
          <>
            <span className={styles.sep}>/</span>
            <Link href={`/shop?cat=${encodeURIComponent(p.category)}`} className="link link--subtle">
              {catMeta?.label || p.category}
            </Link>
          </>
        )}
        <span className={styles.sep}>/</span>
        <span aria-current="page" className={styles.here}>{p.title}</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{p.title}</h1>
        <div className={styles.pills}>
          {p.category && (
            <Link href={`/shop?cat=${encodeURIComponent(p.category)}`} className="tag" title="مشاهده این دسته">
              دسته: {catMeta?.label || p.category}
            </Link>
          )}
          {p.brand && (
            <Link href={`/shop?brand=${encodeURIComponent(p.brand)}`} className="tag" title="محصولات این برند">
              برند: {p.brand}
            </Link>
          )}
          {p.badge && <span className="badge badge--tip">{p.badge}</span>}
          {typeof p.rating === 'number' && p.rating > 0 && (
            <span className="badge badge--info" title="امتیاز کاربران">⭐ {p.rating.toFixed(1)}</span>
          )}
        </div>
      </header>

      {/* کارت دسته (اختیاری) */}
      {catMeta && (
        <section className={styles.catCard} aria-label="دسته‌بندی محصول">
          <div className={styles.catThumb}>
            <Image
              src={catMeta.image || '/publicimages/hero22.png'}
              alt={catMeta.label}
              fill
              className={styles.catThumbImg} // 1×1 بدون برش
              sizes="120px"
              priority
            />
          </div>
          <div className={styles.catBody}>
            <h3 className={styles.catTitle}>{catMeta.label}</h3>
            {!!catMeta.description && (
              <p className={styles.catDesc}>{catMeta.description}</p>
            )}
          </div>
          <div className={styles.catActions}>
            <Link href={`/shop?cat=${encodeURIComponent(p.category)}`} className="btn btn--ghost">
              مشاهده محصولات این دسته
            </Link>
          </div>
        </section>
      )}

      <section className={styles.main}>
        <div className={styles.galleryCol}>
          <Gallery
            main={p.image || '/publicimages/hero22.png'}
            images={(p.images || []).map((im: any) => ({ url: im.url, alt: im.alt || '' }))}
            title={p.title}
          />
        </div>

        <aside className={styles.infoCol}>
          <BuyBox
            id={p.id}
            slug={p.slug}
            title={p.title}
            brand={p.brand}
            price={p.price}
            stock={typeof p.stock === 'number' ? p.stock : (p.in_stock ? 99 : 0)}
            image={p.image || undefined}
          />

          <section className={styles.desc}>
            <h2 className={styles.h2}>توضیحات محصول</h2>
            <p className={styles.descText}>{p.description || '—'}</p>
          </section>
        </aside>
      </section>

      {Array.isArray(related.items) && related.items.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.h2}>محصولات مشابه</h2>
          <div className={styles.relatedGrid}>
            {related.items.filter(Boolean).map((rp: any) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}

      {/* نوار خرید موبایل (وقتی BuyBox از دید خارج شد) */}
      <MobileBar
        id={p.id}
        title={p.title}
        price={p.price}
        image={p.image || undefined}
        stock={typeof p.stock === 'number' ? p.stock : (p.in_stock ? 99 : 0)}
      />
    </div>
  );
}
