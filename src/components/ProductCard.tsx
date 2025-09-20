'use client';

// ساختار اصلی حفظ شده (anchor + Image با width/height و onLoadingComplete)
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useCartStore } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';
import { useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  rating?: number;
  inStock?: boolean;    // کلاینتی
  in_stock?: boolean;   // از API
  stock?: number;       // از API
  badge?: string | null;
  category?: string;
  brand?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const openCart = useCartUI((s) => s.openCart);

  const stockVal = typeof product.stock === 'number' ? product.stock : undefined;

  // اگر stock داریم، مرجع تصمیم فقط stock>0 است
  const inStock =
    stockVal !== undefined
      ? stockVal > 0
      : (product.inStock ?? product.in_stock ?? true);

  const [shape, setShape] = useState<'portrait' | 'landscape' | 'square' | ''>('');

  const handleAdd = () => {
    add(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || undefined,
        stock: stockVal, // برای clamp تعداد در استور
      },
      1
    );
    openCart();
  };

  return (
    <div className={styles.card}>
      <a
        href={`/product/${product.id}`}
        className={`${styles.thumb} ${shape ? styles[shape] : ''}`}
        aria-label={product.title}
      >
        <Image
          src={product.image || '/publicimages/hero22.png'}
          alt={product.title || ''}
          width={800}
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
          priority={false}
          loading="lazy"
          decoding="async"
          onLoadingComplete={(img) => {
            const w = img.naturalWidth || 1;
            const h = img.naturalHeight || 1;
            if (Math.abs(w - h) / Math.max(w, h) < 0.04) {
              setShape('square');
            } else if (h > w) {
              setShape('portrait');
            } else {
              setShape('landscape');
            }
          }}
          className={styles.img}
        />

        {/* نشان سفارشی محصول */}
        {product.badge && <span className={styles.badge}>{product.badge}</span>}

        {/* وضعیت موجودی */}
        {!inStock ? (
          <span className={styles.badgeOut} aria-live="polite">
            ناموجود
          </span>
        ) : typeof stockVal === 'number' && stockVal > 0 ? (
          <span className={styles.stockBadge} aria-live="polite">
            موجودی {stockVal}
          </span>
        ) : null}

        {/* جلوه نور ملایم */}
        <span aria-hidden className={styles.shine} />
      </a>

      <div className={styles.body}>
        {/* ردیف مشترک: عنوان در راست، برند در چپ */}
        <div className={styles.head}>
          <div id={`p-title-${product.id}`} className={styles.title} title={product.title}>
            {product.title}
          </div>
          {product.brand && (
            <div className={styles.brand} title={`برند ${product.brand}`} aria-label={`برند ${product.brand}`}>
              {product.brand}
            </div>
          )}
        </div>

        <div className={styles.meta}>
          <div className={styles.price}>
            {product.price.toLocaleString('fa-IR')} <span className={styles.tmn}>تومان</span>
          </div>

          {typeof product.rating === 'number' && (
            <div className={styles.rating} aria-label={`امتیاز ${product.rating}`} style={{ ['--rating' as any]: product.rating }}>
              <span className={styles.stars} aria-hidden />
              <span className={styles.ratingNum}>{product.rating}</span>
            </div>
          )}
        </div>

        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={!inStock}
          aria-disabled={!inStock}
          aria-label={inStock ? 'افزودن به سبد' : 'ناموجود'}
          title={!inStock ? 'این محصول موجود نیست' : undefined}
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}
