'use client';

import { useMemo, useState } from 'react';
import styles from './ProductDetail.module.css';
import { useCartStore } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';

type Props = {
  id: number;
  slug: string;
  title: string;
  brand?: string;
  price: number;
  stock: number;      // 0 → ناموجود
  image?: string;
};

export default function BuyBox({ id, slug, title, brand, price, stock, image }: Props) {
  const add = useCartStore((s) => s.add);
  const openCart = useCartUI((s) => s.openCart);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const inStock = stock > 0;
  const nf = useMemo(() => new Intl.NumberFormat('fa-IR'), []);
  const total = qty * price;

  const clampQty = (n: number) => {
    const max = inStock ? Math.max(1, stock) : 0;
    return Math.min(Math.max(1, n), Math.max(1, max));
  };

  const addToCart = () => {
    if (!inStock || adding) return;
    setAdding(true);
    add({ id, title, price, image, stock }, qty);
    openCart();
    setTimeout(() => setAdding(false), 450);
  };

  return (
    <div className={styles.buyBox} role="region" aria-label="خرید">
      <div className={styles.priceRow}>
        <div className={styles.priceBig}>
          {nf.format(price)} <span className={styles.tmn}>تومان</span>
        </div>
        {brand && <div className={styles.brandPill}>برند: {brand}</div>}
      </div>

      <div className={styles.stockRow}>
        {inStock ? (
          <span className={`${styles.stock} ${styles.stockOk}`}>موجود | {stock} عدد</span>
        ) : (
          <span className={`${styles.stock} ${styles.stockOut}`}>ناموجود</span>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button type="button" onClick={() => setQty((q) => clampQty(q - 1))} aria-label="کاهش تعداد" disabled={!inStock}>
            −
          </button>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={qty}
            onChange={(e) => {
              const v = parseInt(e.target.value.replace(/\D/g, '') || '1', 10);
              setQty(clampQty(v));
            }}
            aria-label="تعداد"
          />
          <button type="button" onClick={() => setQty((q) => clampQty(q + 1))} aria-label="افزایش تعداد" disabled={!inStock}>
            +
          </button>
        </div>

        <button
          type="button"
          className={`${styles.cta} ${adding ? styles.isLoading : ''}`}
          onClick={addToCart}
          disabled={!inStock || adding}
          aria-disabled={!inStock || adding}
        >
          {adding ? (
            <span className={styles.loader} aria-hidden />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 6h14l-1.2 7.2a2 2 0 0 1-2 1.8H9.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="19" r="1.6" fill="currentColor" />
                <circle cx="16" cy="19" r="1.6" fill="currentColor" />
                <path d="M6 6 5 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>افزودن به سبد</span>
            </>
          )}
        </button>
      </div>

      <div className={styles.totalRow} aria-live="polite">
        جمع کل: <strong>{nf.format(total)}</strong> <span className={styles.tmn}>تومان</span>
      </div>

      <ul className={styles.bullets}>
        <li>ارسال سریع به سراسر کشور</li>
        <li>7 روز ضمانت بازگشت</li>
        <li>پرداخت امن</li>
      </ul>
    </div>
  );
}
