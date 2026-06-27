import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique string like product_id + variant
  productId: string;
  name: string;
  variantLabel: string;
  price: number;
  qty: number;
  image?: string;
  storeId: string;
  maxStock?: number | null; // Optional stock limit
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: (storeId?: string) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            let newQty = existing.qty + item.qty;
            if (existing.maxStock !== null && existing.maxStock !== undefined && newQty > existing.maxStock) {
              newQty = existing.maxStock;
            }
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: newQty } : i
              ),
            };
          }
          let newQty = item.qty;
          if (item.maxStock !== null && item.maxStock !== undefined && newQty > item.maxStock) {
            newQty = item.maxStock;
          }
          return { items: [...state.items, { ...item, qty: newQty }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id) {
              let newQty = qty;
              if (i.maxStock !== null && i.maxStock !== undefined && newQty > i.maxStock) {
                newQty = i.maxStock;
              }
              return { ...i, qty: newQty };
            }
            return i;
          }),
        })),
      clearCart: (storeId) =>
        set((state) => ({
          items: storeId ? state.items.filter(i => i.storeId !== storeId) : [],
        })),
    }),
    {
      name: 'kozura-cart',
    }
  )
);
