import Image from 'next/image';
import styles from '@/app/shop/Shop.module.css';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
  badge?: 'حراج' | 'جدید';
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className={`${styles.card} card`}>
      <div className={styles.cardMedia}>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <Image src={product.image} alt={product.title} fill className={styles.cardImg} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle} title={product.title}>{product.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating} aria-label={`امتیاز ${product.rating}`}>
            ★ {product.rating.toFixed(1)}
          </span>
          <span className={`${styles.stock} ${product.inStock ? styles.in : styles.out}`}>
            {product.inStock ? 'موجود' : 'ناموجود'}
          </span>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{product.price.toLocaleString('fa-IR')} تومان</span>
          <button className="btn btnPrimary">افزودن به سبد</button>
        </div>
      </div>
    </article>
  );
}
