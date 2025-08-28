'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartUIState = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartUI = create<CartUIState>()(
  persist(
    (set, get) => ({
      open: false,
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      toggleCart: () => set({ open: !get().open }),
    }),
    { name: 'wercha-cart-ui' }
  )
);
