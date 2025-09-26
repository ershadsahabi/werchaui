// src\components\blog\ShareBar.tsx
"use client";

import { useEffect, useState } from "react";
import s from "./sharebar.module.css";

type Props = {
  title: string;
};

export default function ShareBar({ title }: Props) {
  // هیچ شاخه‌ای در SSR نداشته باشیم؛ رندر اولیه ثابت بماند
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [href, setHref] = useState<string>("");

  useEffect(() => {
    try {
      setHref(window.location.href);
      setCanNativeShare(typeof navigator !== "undefined" && !!(navigator as any).share);
    } catch {
      // ignore
    }
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(href || window.location.href);
      // می‌تونی اینجا یک toast خودت نشان بدهی
    } catch {}
  };

  const onWebShare = async () => {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, url: href || window.location.href });
      } else {
        await onCopy();
      }
    } catch {}
  };

  // لینک‌های شبکه‌های اجتماعی از href استفاده می‌کنند؛ اگر هنوز set نشده، به صورت disabled رندر می‌شوند
  const tg = href ? `https://t.me/share/url?url=${encodeURIComponent(href)}&text=${encodeURIComponent(title)}` : "#";
  const wa = href ? `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + href)}` : "#";

  return (
    <div className={s.wrap} aria-label="اشتراک‌گذاری">
      <button className="btn btn--secondary" type="button" onClick={onWebShare} disabled={!canNativeShare && !href}>
        اشتراک‌گذاری
      </button>
      <button className="btn btn--outline" type="button" onClick={onCopy} disabled={!href}>
        کپی لینک
      </button>
      <a className="btn btn--ghost" href={tg} target="_blank" rel="noopener noreferrer" aria-disabled={!href}>
        تلگرام
      </a>
      <a className="btn btn--ghost" href={wa} target="_blank" rel="noopener noreferrer" aria-disabled={!href}>
        واتس‌اپ
      </a>
    </div>
  );
}
