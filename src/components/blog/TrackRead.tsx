// src\components\blog\TrackRead.tsx
"use client";

import { useEffect } from "react";

const KEY = "werch:blog:recent:v3";

export type ReadMeta = {
  slug: string;
  title?: string;
  cover?: string | null;
  category_name?: string | null;
  reading_time_min?: number | null;
};

type Entry = ReadMeta & { ts: number };

function readAll(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data as Entry[];
  } catch {
    return [];
  }
}

function writeAll(entries: Entry[]) {
  const trimmed = entries.slice(0, 50);
  const json = JSON.stringify(trimmed);
  localStorage.setItem(KEY, json);
  try { sessionStorage.setItem(KEY, json); } catch {}
}

export default function TrackRead({
  slug,
  meta,
}: {
  slug: string;
  meta?: ReadMeta;
}) {
  useEffect(() => {
    if (!slug) return;
    try {
      const now = Date.now();
      const prev = readAll();

      // حذف تکراری
      const filtered = prev.filter((e) => e.slug !== slug);

      const base: Entry = {
        slug,
        ts: now,
        title: meta?.title,
        cover: meta?.cover ?? null,
        category_name: meta?.category_name ?? null,
        reading_time_min: meta?.reading_time_min ?? null,
      };

      // پاکسازی قدیمی‌ها (۹۰ روز)
      const NINETY_D = 90 * 24 * 60 * 60 * 1000;
      const cleaned = filtered.filter((e) => now - e.ts <= NINETY_D);

      writeAll([base, ...cleaned]);
    } catch {}
  }, [slug, meta]);

  return null;
}
