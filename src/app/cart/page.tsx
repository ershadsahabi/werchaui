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
      <header className={styles.header}>
        <h1 className={styles.title}>سبد خرید</h1>
      </header>

      {items.length === 0 ? (
        <div className={styles.emptyWrap}>
          <p>سبد شما خالی است.</p>
          <Link href="/shop">برو به فروشگاه</Link>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* لیست آیتم‌ها */}
          <section className={styles.list} aria-label="آیتم‌های سبد">
            {items.map((it) => {
              const hasStock = typeof it.stock === 'number';
              const atMax = hasStock && it.qty >= (it.stock as number);
              const isZero = hasStock && (it.stock as number) === 0;

              return (
                <article key={it.id} className={styles.row}>
                  <Image
                    src={it.image || '/publicimages/p1.jpg'}
                    alt={it.title || 'محصول'}
                    width={80}
                    height={80}
                    className={styles.thumb}
                  />

                  <div className={styles.info}>
                    <div className={styles.name}>{it.title}</div>

                    <div className={styles.meta}>
                      <span className={styles.unitPrice}>
                        قیمت واحد: {it.price.toLocaleString('fa-IR')} تومان
                      </span>
                      <span className={styles.linePrice}>
                        جمع این آیتم: {(it.price * it.qty).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>

                    {hasStock && (
                      <div className={styles.stockNote} aria-live="polite">
                        {isZero
                          ? <span className={styles.out}>ناموجود — لطفاً حذف کنید</span>
                          : <>حداکثر موجودی: <b>{(it.stock as number).toLocaleString('fa-IR')}</b> عدد</>
                        }
                      </div>
                    )}
                  </div>

                  <div className={styles.controls}>
                    <div className={styles.qty} aria-label="تغییر تعداد">
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
                        inputMode="numeric"
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

                    <div className={styles.linePrice}>
                      {(it.price * it.qty).toLocaleString('fa-IR')} تومان
                    </div>
                  </div>

                  <button
                    className={styles.remove}
                    onClick={() => remove(it.id)}
                    aria-label="حذف"
                    title="حذف از سبد"
                  >
                    ✕
                  </button>
                </article>
              );
            })}
          </section>

          {/* خلاصه پرداخت */}
          <aside className={styles.summary} aria-label="خلاصه سبد">
            <div className={styles.total}>
              جمع کل: <strong>{total.toLocaleString('fa-IR')}</strong> تومان
            </div>
            <GuardedCheckoutLink className={styles.checkoutBtn}>
              ادامه ثبت سفارش
            </GuardedCheckoutLink>
          </aside>
        </div>
      )}
    </div>
  );
}
