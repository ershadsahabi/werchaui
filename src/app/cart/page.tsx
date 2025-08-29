'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cart.module.css';
import { useCartStore, useCartTotal } from '@/store/cart';
import GuardedCheckoutLink from '@/components/GuardedCheckoutLink';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const total = useCartTotal();

  return (
    <div className={`container ${styles.root}`} dir="rtl">
      <h1 className={styles.title}>سبد خرید</h1>

      {items.length === 0 ? (
        <p className={styles.empty}>سبد شما خالی است. <Link href="/shop" className="btn">برو به فروشگاه</Link></p>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((it) => (
              <div key={it.id} className={styles.row}>
                <Image src={it.image || '/publicimages/p1.jpg'} alt="" width={64} height={64} className={styles.thumb} />
                <div className={styles.info}>
                  <div className={styles.name}>{it.title}</div>
                  <div className={styles.price}>{(it.price * it.qty).toLocaleString('fa-IR')} تومان</div>
                </div>
                <div className={styles.qty}>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => setQty(it.id, Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
                <button className={styles.remove} onClick={() => remove(it.id)} aria-label="حذف">✕</button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.total}>جمع کل: <strong>{total.toLocaleString('fa-IR')}</strong> تومان</div>
              <GuardedCheckoutLink className={`${styles.checkoutBtn} btn`}>
                    ادامه ثبت سفارش
              </GuardedCheckoutLink>
            </div>
        </>
      )}
    </div>
  );
}
