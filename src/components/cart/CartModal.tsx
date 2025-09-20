'use client';
import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartModal.module.css';
import { useCartStore, useCartTotal } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';
import GuardedCheckoutLink from '@/components/GuardedCheckoutLink';

function formatIRR(n: number) {
  try { return n.toLocaleString('fa-IR'); } catch { return String(n); }
}

export default function CartModal() {
  const open = useCartUI((s) => s.open);
  const closeCart = useCartUI((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const total = useCartTotal();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const count = useMemo(() => items.reduce((n, it) => n + (Number(it.qty) || 0), 0), [items]);

  // ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeCart]);

  // قفل اسکرول + فوکوس + تِرپ فوکِس
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 0);

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = panelRef.current; if (!root) return;
      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => (el.offsetParent !== null) || root.contains(el));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) { last.focus(); e.preventDefault(); }
      } else {
        if (active === last || !root.contains(active)) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', trap);

    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener('keydown', trap);
      lastActiveRef.current?.focus?.();
    };
  }, [open]);

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeCart();
  };

  const EmptyState = () => (
    <div className={styles.empty} role="status" aria-live="polite">
      <Image src="/publicimages/hero28.png" alt="" width={120} height={120} className={styles.emptyImg} priority />
      <h4 className={styles.emptyTitle}>سبد خرید خالی است</h4>
      <Link href="/shop" className={styles.primaryBtn} onClick={closeCart}>شروع خرید</Link>
    </div>
  );

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ''}`}
      onMouseDown={onBackdrop}
      aria-hidden={!open}
      dir="rtl"
    >
      <aside
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.slideIn : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartTitle"
      >
        <header className={styles.header}>
          <h3 id="cartTitle" className={styles.title}>
            سبد خرید <span className={styles.brand}>WERCINO</span>
          </h3>
          <div className={styles.headerRight}>
            <span className={styles.count}>{count} قلم</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.iconBtn}
              onClick={closeCart}
              aria-label="بستن"
              title="بستن"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </header>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className={styles.list} role="list">
              {items.map((it) => {
                const hasStock = typeof it.stock === 'number';
                const maxStock = hasStock ? (it.stock as number) : undefined;
                const atMax = hasStock && it.qty >= (it.stock as number);
                const isZero = hasStock && (it.stock as number) === 0;
                const subtotal = (it.price || 0) * (it.qty || 0);

                return (
                  <article key={it.id} className={styles.row} role="listitem" aria-label={it.title}>
                    <div className={styles.thumbWrap}>
                      <Image
                        src={it.image || '/publicimages/p1.jpg'}
                        alt={it.title || 'محصول'}
                        width={72}
                        height={72}
                        className={styles.thumb}
                      />
                      <button
                        type="button"
                        className={`${styles.removeFab}`}
                        onClick={() => remove(it.id)}
                        aria-label="حذف از سبد"
                        title="حذف"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                      </button>
                    </div>

                    <div className={styles.body}>
                      <div className={styles.name} title={it.title}>{it.title}</div>

                      <div className={styles.meta}>
                        <div className={styles.prices}>
                          <span className={styles.sub}>{formatIRR(subtotal)} تومان</span>
                          <span className={styles.unitHint}>هر واحد: {formatIRR(it.price)} تومان</span>
                        </div>
                        {hasStock && (
                          <div className={styles.stockLine}>
                            {isZero ? (
                              <span className={styles.out}>ناموجود</span>
                            ) : (
                              <>موجودی: <b>{formatIRR(maxStock!)}</b></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.controls}>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                          aria-label="کم کردن"
                          disabled={it.qty <= 1}
                          className={styles.iconBtn}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                        </button>

                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={maxStock}
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
                          className={styles.qtyInput}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const next = it.qty + 1;
                            const capped = hasStock ? Math.min(next, it.stock as number) : next;
                            setQty(it.id, capped);
                          }}
                          aria-label="افزایش"
                          disabled={!!atMax}
                          className={styles.iconBtn}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>

                      {/* مخفی شد؛ حالا موبایل هم از removeFab استفاده می‌کند */}
                      <button
                        type="button"
                        className={styles.removeInline}
                        onClick={() => remove(it.id)}
                        aria-label="حذف از سبد"
                      >
                        حذف
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className={styles.footer}>
              <div className={styles.total}>
                <span>جمع کل:</span>
                <strong>{formatIRR(total)}</strong>
                <span className={styles.unitSuffix}>تومان</span>
              </div>
              <div className={styles.actions}>
                <Link href="/cart" className={styles.ghostBtn} onClick={closeCart}>مشاهده سبد</Link>
                <GuardedCheckoutLink className={styles.checkoutBtn} onClick={closeCart}>
                  ادامه ثبت سفارش
                </GuardedCheckoutLink>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
