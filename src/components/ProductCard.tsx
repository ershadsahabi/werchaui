'use client';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useCartStore } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';

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

  // 👇 اگر stock داریم، مرجع تصمیم فقط stock>0 است (Fail-safe)
  const inStock =
    stockVal !== undefined
      ? stockVal > 0
      : (product.inStock ?? product.in_stock ?? true);

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
      <a href={`/product/${product.id}`} className={styles.thumb}>
        <Image
          src={product.image || '/publicimages/hero22.png'}
          alt=""
          width={300}
          height={300}
        />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        {!inStock && (
          <span className={styles.badge} style={{ background: 'var(--danger)' }}>
            ناموجود
          </span>
        )}
      </a>

      <div className={styles.body}>
        <div className={styles.title} title={product.title}>
          {product.title}
        </div>

        <div className={styles.meta}>
          <div className={styles.price}>
            {product.price.toLocaleString('fa-IR')} تومان
          </div>
          {typeof product.rating === 'number' && (
            <div className={styles.rating} aria-label={`امتیاز ${product.rating}`}>
              ★ {product.rating}
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
          {typeof stockVal === 'number' && stockVal > 0 ? ` (موجودی ${stockVal})` : ''}
        </button>
      </div>
    </div>
  );
}