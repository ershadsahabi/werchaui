'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.id === item.id);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else items.push({ ...item, qty });
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      setQty: (id, qty) => {
        if (qty <= 0) return set({ items: get().items.filter((x) => x.id !== id) });
        set({ items: get().items.map((x) => (x.id === id ? { ...x, qty } : x)) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'wercha-cart', storage: createJSONStorage(() => localStorage) }
  )
);

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, it) => sum + it.qty, 0));

export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, it) => sum + it.price * it.qty, 0));