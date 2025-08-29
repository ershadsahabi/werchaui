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
  inStock?: boolean;  
  badge?: string | null;
  category?: string;
  brand?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const openCart = useCartUI((s) => s.openCart);

  const handleAdd = () => {
    add({ id: product.id, title: product.title, price: product.price, image: product.image || undefined }, 1);
    openCart(); // بلافاصله مودال سبد را باز کن
  };

  return (
    <div className={styles.card}>
      <a href={`/product/${product.id}`} className={styles.thumb}>
        <Image src={product.image || '/publicimages/hero22.png'} alt="" width={300} height={300} />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
      </a>
      <div className={styles.body}>
        <div className={styles.title} title={product.title}>{product.title}</div>
        <div className={styles.meta}>
          <div className={styles.price}>{product.price.toLocaleString('fa-IR')} تومان</div>
          {typeof product.rating === 'number' && (
            <div className={styles.rating} aria-label={`امتیاز ${product.rating}`}>★ {product.rating}</div>
          )}
        </div>
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={product.inStock === false}
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}
