'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import s from './MobileBar.module.css';
import skin from './MobileBar.skin.module.css';
import pd from './ProductDetail.module.css'; // برای IntersectionObserver روی BuyBox

import { useCartStore } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';

type Props = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  image?: string;
  stock: number; // 0 → ناموجود
};

export default function MobileBar({ id, title, brand, price, image, stock }: Props) {
  const add = useCartStore((st) => st.add);
  const openCart = useCartUI((st) => st.openCart);

  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [ariaMsg, setAriaMsg] = useState('');

  const inStock = stock > 0;
  const nf = useMemo(() => new Intl.NumberFormat('fa-IR'), []);

  // فقط روی موبایل + وقتی BuyBox دیده نشه
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    let enabled = mq.matches;

    const attach = () => {
      if (!enabled) { setVisible(false); return () => {}; }
      const buyBox = document.querySelector<HTMLElement>(`.${pd.buyBox}`);
      if (!buyBox) { setVisible(false); return () => {}; }

      const io = new IntersectionObserver(
        (entries) => setVisible(!entries[0].isIntersecting),
        { rootMargin: '0px 0px -40% 0px', threshold: 0.01 }
      );
      io.observe(buyBox);
      return () => io.disconnect();
    };

    let detach = attach();
    const onChange = (e: MediaQueryListEvent) => {
      enabled = e.matches;
      setVisible(false);
      detach?.();
      detach = attach();
    };

    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      detach?.();
    };
  }, []);

  const addToCart = () => {
    if (!inStock || adding) return;
    setAdding(true);
    add({ id, title, price, image, stock }, 1);
    openCart();
    if ('vibrate' in navigator) (navigator as any).vibrate?.(25);
    setAriaMsg('به سبد اضافه شد');
    setTimeout(() => setAdding(false), 460);
  };

  return (
    <div
      className={`${s.bar} ${skin.barSkin} ${visible ? s.isVisible : ''}`}
      role="region"
      aria-label="نوار خرید سریع"
    >
      {/* پیام برای اسکرین‌ریدر */}
      <span aria-live="polite" className={s.visuallyHidden}>{ariaMsg}</span>

      {/* چپ: تصویر و اطلاعات */}
      <div className={s.left}>
        <div className={`${s.thumb} ${skin.thumbSkin}`}>
          <Image
            src={image || '/publicimages/hero22.png'}
            alt="" /* تزئینی */
            fill
            className={s.thumbImg}
            sizes="44px"
            priority
          />
        </div>

        <div className={s.info}>
          <div className={`${s.title} ${skin.title}`} title={title}>{title}</div>
          {brand && <div className={`${s.brand} ${skin.brand}`} title={brand}>برند: {brand}</div>}

          <div className={`${s.priceLine} ${skin.priceLine}`}>
            <strong>{nf.format(price)}</strong>
            <span className={`${s.tmn} ${skin.tmn}`}>تومان</span>
          </div>
        </div>
      </div>

      {/* راست: فقط دکمهٔ افزودن با آیکون ظریف */}
      <div className={s.actions}>
        <button
          type="button"
          className={`${s.cta} ${skin.ctaPrimarySkin} ${adding ? s.isLoading : ''}`}
          onClick={addToCart}
          disabled={!inStock || adding}
          aria-disabled={!inStock || adding}
          aria-label={inStock ? 'افزودن به سبد' : 'ناموجود'}
          title={inStock ? 'افزودن به سبد' : 'ناموجود'}
        >
          {adding ? (
            <span className={s.loader} aria-hidden />
          ) : (
            <>
              {/* آیکون کارت + پلاس (حرفه‌ای و کوچک 18px) */}
              <svg className={s.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6h13l-1.2 7.2a2 2 0 0 1-2 1.8H9.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="9.3" cy="19" r="1.6" fill="currentColor" />
                <circle cx="16.2" cy="19" r="1.6" fill="currentColor" />
                <path d="M4 4h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M12 8v4M10 10h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
