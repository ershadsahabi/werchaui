'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartModal.module.css';
import { useCartStore, useCartTotal } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';
import GuardedCheckoutLink from '@/components/GuardedCheckoutLink';

export default function CartModal() {
  const open = useCartUI((s) => s.open);
  const closeCart = useCartUI((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const total = useCartTotal();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeCart]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeCart();
  };

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ''}`}
      onMouseDown={onBackdrop}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.slideIn : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        dir="rtl"
      >
        <div className={styles.header}>
          <div className={styles.title}>سبد خرید</div>
          <button className={styles.close} onClick={closeCart} aria-label="بستن">✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Image src="/publicimages/hero28.png" alt="" width={80} height={80} />
            <p>سبد شما خالی است.</p>
            <Link href="/shop" className="btn" onClick={closeCart}>رفتن به فروشگاه</Link>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {items.map((it) => (
                <div key={it.id} className={styles.row}>
                  <Image
                    src={it.image || '/publicimages/p1.jpg'}
                    alt=""
                    width={56}
                    height={56}
                    className={styles.thumb}
                  />
                  <div className={styles.info}>
                    <div className={styles.name} title={it.title}>{it.title}</div>
                    <div className={styles.line}>
                      <div className={styles.unit}>{it.price.toLocaleString('fa-IR')} تومان</div>
                      <div className={styles.sub}>{(it.price * it.qty).toLocaleString('fa-IR')} تومان</div>
                    </div>
                  </div>
                  <div className={styles.qty}>
                    <button onClick={() => setQty(it.id, Math.max(1, it.qty - 1))} aria-label="کم کردن">−</button>
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => setQty(it.id, Math.max(1, Number(e.target.value) || 1))}
                      aria-label="تعداد"
                    />
                    <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="زیاد کردن">+</button>
                  </div>
                  <button className={styles.remove} onClick={() => remove(it.id)} aria-label="حذف">✕</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                جمع کل: <strong>{total.toLocaleString('fa-IR')}</strong> تومان
              </div>
              <div className={styles.actions}>
                <Link href="/cart" className={styles.ghostBtn} onClick={closeCart}>مشاهده سبد</Link>
                <GuardedCheckoutLink className={`${styles.checkoutBtn} btn`}>
                ادامه ثبت سفارش
                </GuardedCheckoutLink>              
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
