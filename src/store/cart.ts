'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  qty: number;
  stock?: number;            // 👈 جدید: سقف
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
};

function clampQty(qty: number, stock?: number) {
  if (typeof stock === 'number' && stock >= 1) return Math.min(qty, stock);
  return qty;
}

function broadcastCartChanged() {
  try { window.dispatchEvent(new CustomEvent('cart:changed')); } catch {}
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.id === item.id);
        if (i >= 0) {
          const s = items[i].stock;
          items[i] = { ...items[i], qty: clampQty(items[i].qty + qty, s) };
        } else {
          items.push({ ...item, qty: clampQty(qty, item.stock) });
        }
        set({ items });
        broadcastCartChanged();
      },
      remove: (id) => {
        set({ items: get().items.filter((x) => x.id !== id) });
        broadcastCartChanged();
      },
      setQty: (id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((x) => x.id !== id) });
          broadcastCartChanged();
          return;
        }
        set({
          items: get().items.map((x) =>
            x.id === id ? { ...x, qty: clampQty(qty, x.stock) } : x
          ),
        });
        broadcastCartChanged();
      },
      clear: () => {
        set({ items: [] });
        broadcastCartChanged();
      },
    }),
    { name: 'wercha-cart', storage: createJSONStorage(() => localStorage) }
  )
);

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, it) => sum + it.qty, 0));

export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, it) => sum + it.price * it.qty, 0));
