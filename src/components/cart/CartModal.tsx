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
              {items.map((it) => {
                const hasStock = typeof it.stock === 'number';
                const atMax = hasStock && it.qty >= (it.stock as number);
                const isZero = hasStock && (it.stock as number) === 0;

                return (
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
                      {hasStock && (
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {isZero
                            ? <span style={{ color: 'var(--danger)' }}>ناموجود — لطفاً حذف کنید</span>
                            : <>حداکثر موجودی: <b>{(it.stock as number).toLocaleString('fa-IR')}</b> عدد</>
                          }
                        </div>
                      )}
                    </div>

                    <div className={styles.qty}>
                      <button
                        onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                        aria-label="کم کردن"
                        disabled={it.qty <= 1}
                        title={it.qty <= 1 ? 'حداقل ۱ عدد' : undefined}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={hasStock ? (it.stock as number) : undefined}
                        value={it.qty}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const v = Number.isFinite(raw) ? Math.max(1, raw) : 1;
                          const capped = hasStock ? Math.min(v, it.stock as number) : v;
                          setQty(it.id, capped);
                        }}
                        onBlur={(e) => {
                          // اطمینان از clamp بعد از خروج از فوکوس
                          const raw = Number(e.currentTarget.value);
                          const v = Number.isFinite(raw) ? Math.max(1, raw) : 1;
                          const capped = hasStock ? Math.min(v, it.stock as number) : v;
                          if (capped !== it.qty) setQty(it.id, capped);
                        }}
                        aria-label="تعداد"
                      />

                      <button
                        onClick={() => {
                          const next = it.qty + 1;
                          const capped = hasStock ? Math.min(next, it.stock as number) : next;
                          setQty(it.id, capped);
                        }}
                        aria-label="زیاد کردن"
                        disabled={!!atMax}
                        title={atMax ? 'به حداکثر موجودی رسیدید' : undefined}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={styles.remove}
                      onClick={() => remove(it.id)}
                      aria-label="حذف"
                      title="حذف از سبد"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                جمع کل: <strong>{total.toLocaleString('fa-IR')}</strong> تومان
              </div>
              <div className={styles.actions}>
                <Link href="/cart" className={styles.ghostBtn} onClick={closeCart}>مشاهده سبد</Link>
                <GuardedCheckoutLink className={`${styles.checkoutBtn} btn`} onClick={closeCart}>
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
