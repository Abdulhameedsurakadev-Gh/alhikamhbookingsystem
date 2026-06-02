import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number; 
  weight: number; 
  coverImage: string | null;
  stock: number; 
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { totalAmount: number; totalWeight: number; totalItems: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === book.id);

        if (existingItem) {
          if (existingItem.quantity >= book.stock) return;
          set({
            items: currentItems.map((item) =>
              item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          if (book.stock < 1) return;
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }
      },

      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item.id !== bookId) });
      },

      updateQuantity: (bookId, quantity) => {
        const item = get().items.find((i) => i.id === bookId);
        if (!item) return;

        const validQuantity = Math.max(1, Math.min(quantity, item.stock));
        set({
          items: get().items.map((item) =>
            item.id === bookId ? { ...item, quantity: validQuantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const items = get().items;
        return items.reduce(
          (acc, item) => {
            acc.totalAmount += item.price * item.quantity;
            acc.totalWeight += item.weight * item.quantity;
            acc.totalItems += item.quantity;
            return acc;
          },
          { totalAmount: 0, totalWeight: 0, totalItems: 0 }
        );
      },
    }),
    {
      name: 'alhikmah-cart-storage',
    }
  )
);
