'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import styles from './ProductDetail.module.css';

type Thumb = { url: string; alt?: string };

export default function Gallery({
  main,
  images,
  title,
}: {
  main: string;
  images: Thumb[];
  title: string;
}) {
  const all = useMemo<Thumb[]>(
    () => [{ url: main, alt: title }, ...(images || [])],
    [main, images, title]
  );
  const [idx, setIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const target = wrapRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--zx', `${x}%`);
    target.style.setProperty('--zy', `${y}%`);
  };

  return (
    <div className={styles.gallery}>
      <div
        ref={wrapRef}
        className={styles.mainMedia}
        onMouseMove={onMove}
        tabIndex={0}
        aria-label="گالری محصول"
      >
        <Image
          src={all[idx]?.url || main}
          alt={all[idx]?.alt || title}
          width={1200}
          height={1200}
          className={styles.mainImg}
          priority
        />
        <span aria-hidden className={styles.zoomGlass} />
      </div>

      {all.length > 1 && (
        <div className={styles.thumbs} role="listbox" aria-label="تصاویر محصول">
          {all.map((im, i) => (
            <button
              key={`${im.url}-${i}`}
              type="button"
              className={`${styles.thumbBtn} ${i === idx ? styles.thumbActive : ''}`}
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              title={im.alt || title}
            >
              <Image src={im.url} alt="" width={120} height={120} className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
