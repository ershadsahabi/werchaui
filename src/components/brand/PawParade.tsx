"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import s from "./PawParade.module.css";

/**
 * نسخه‌ی حلقه‌ایِ پیوسته:
 * - حرکتِ یکنواخت، بدون هیچ مکث/پرش
 * - وقتی یک چرخه کامل می‌شود، به‌صورت ماژولار به ابتدای چرخه برمی‌گردد (بدون چشمک)
 * - به تعداد لازم کپی از گروه می‌سازد تا عرضِ نمایش را همیشه پر کند (بدون گپ)
 * - رعایت prefers-reduced-motion: در این حالت، محتوای ثابت و بدون حرکت
 */

const items = [
  { icon: "🎉", label: "۱۰٪ اولین خرید — کد: wircino" },
  { icon: "🚚", label: "ارسال سریع سنندج" },
  { icon: "📦", label: "ارسال سراسری ۲–۴ روز کاری" },
  { icon: "🛡️", label: "تضمین اصالت کالا" },
  { icon: "↩️", label: "مرجوعی تا ۷ روز" },
  { icon: "🎁", label: "پیشنهادهای ویژه راه‌اندازی" },
  { icon: "🍗", label: "غذاهای محبوب پت‌ها" },
  { icon: "🧴", label: "منتخب بهداشت و نظافت" },
  { icon: "🎾", label: "اکسسوری و اسباب‌بازی جدید" },
  { icon: "💬", label: "مشاوره سریع واتس‌اپ" },
];

export default function PawParade() {
  const wrapRef  = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rowRef   = useRef<HTMLDivElement | null>(null);
  const refGroup = useRef<HTMLUListElement | null>(null);

  // حالت‌ها/مقادیر متغیر
  const [copies, setCopies] = useState(2);   // همیشه حداقل 2 کپی برای حلقه‌ی بی‌نقص
  const posRef   = useRef(0);                // px، منفی یعنی حرکت به چپ
  const lastTRef = useRef(0);                // ms
  const loopWRef = useRef(0);                // عرض یک گروه مرجع
  const rafRef   = useRef<number | null>(null);

  // سرعت پایه (px/s) -> px/ms
  const baseSpeed = () =>
    window.matchMedia("(min-width: 1280px)").matches ? -120 :
    window.matchMedia("(min-width: 1024px)").matches ? -110 :
    window.matchMedia("(min-width: 768px)").matches  ? -95  : -82;

  const v = () => baseSpeed() / 1000;

  const stopRAF = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  // نرمال‌سازی: باقی‌مانده‌ی منفی را به بازه‌ی [0..w) ببریم
  const modPos = (x: number, w: number) => ((x % w) + w) % w;

  const applyTransform = () => {
    const row = rowRef.current;
    const w   = loopWRef.current;
    if (!row || w <= 0) return;

    // posRef منفی جلو می‌رود؛ شیفت قابل‌نمایش = مقدار مثبت در [0..w)
    const shift = modPos(-posRef.current, w); // [0..w)
    // رندر به چپ: از 0 تا w می‌رود و دوباره 0
    row.style.transform = `translate3d(${-shift}px, 0, 0)`;
  };

  const measure = () => {
    const track = trackRef.current;
    const g1    = refGroup.current;
    if (!track || !g1) return;

    const loopW  = Math.ceil(g1.scrollWidth);
    const trackW = Math.ceil(track.clientWidth);
    loopWRef.current = loopW;

    // باید به‌قدری کپی بسازیم که حداقل 2 چرخه کامل، عرضِ track را پوشش دهد
    // تا در تمام لحظات، پشتِ سرِ ترجمه، محتوای کافی داشته باشیم.
    // فرمول: حداقل N طوری که N*loopW >= trackW + loopW  => N >= trackW/loopW + 1
    // برای اطمینان یک کپی اضافه:
    const need = loopW > 0 ? Math.max(2, Math.ceil(trackW / loopW) + 2) : 2;
    setCopies(need);

    // ریست پایدار
    posRef.current = 0;
    applyTransform();
  };

  const step = (t: number) => {
    if (lastTRef.current === 0) lastTRef.current = t;
    const dt = t - lastTRef.current;
    lastTRef.current = t;

    const w = loopWRef.current;
    if (w <= 0) {
      rafRef.current = requestAnimationFrame(step);
      return;
    }

    // جلو بردن موقعیت
    posRef.current += v() * dt;

    // جلوگیری از رشد عددی
    if (Math.abs(posRef.current) > 1e7) {
      // pos را ماژول کنیم تا کوچک بماند
      posRef.current = -modPos(-posRef.current, w);
    }

    applyTransform();
    rafRef.current = requestAnimationFrame(step);
  };

  const start = () => {
    stopRAF();
    lastTRef.current = 0;
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const track = trackRef.current!;
    const row   = rowRef.current!;
    const g1    = refGroup.current!;
    if (!track || !row || !g1) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      measure();
      if (reduced) {
        stopRAF();
        row.style.transform = "translate3d(0,0,0)";
      } else if (rafRef.current == null) {
        start();
      }
    };

    const fontsReady = (document as any).fonts?.ready;
    if (fontsReady && typeof fontsReady.then === "function") {
      fontsReady.then(update);
    } else {
      update();
    }

    const ro = new ResizeObserver(() => requestAnimationFrame(update));
    ro.observe(track);
    ro.observe(row);
    ro.observe(g1);

    const onLoad = () => update();
    const onOC   = () => update();
    window.addEventListener("load", onLoad);
    window.addEventListener("orientationchange", onOC);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("orientationchange", onOC);
      stopRAF();
    };
  }, []);

  // گروه‌های تکراری
  const groups = useMemo(() => Array.from({ length: copies }), [copies]);

  return (
    <section
      className={`container ${s.wrap}`}
      aria-labelledby="parade-title"
      dir="rtl"
      ref={wrapRef}
    >
      <div className={s.bg} aria-hidden="true" />
      <header className={s.head}>
        <h2 id="parade-title" className={s.title}>پیشنهادهای ورچینو</h2>
        <p className={s.sub}>لانچ اولیه؛ مزایا و قیمت‌های جذاب ✨</p>
      </header>

      <div
        ref={trackRef}
        className={s.track}
        role="region"
        aria-label="بنرهای تبلیغاتی فروشگاه"
      >
        <div ref={rowRef} className={s.row}>
          {groups.map((_, idx) => (
            <ul
              key={idx}
              ref={idx === Math.floor(copies / 2) ? refGroup : undefined} /* گروه مرجع برای اندازه‌گیری */
              className={s.group}
              aria-hidden={idx === Math.floor(copies / 2) ? undefined : true}
            >
              {items.map((it, i) => (
                <li key={`${idx}-${i}`} className={s.sticker}>
                  <span className={s.emoji} aria-hidden>{it.icon}</span>
                  <span className={s.label}>{it.label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
