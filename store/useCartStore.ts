import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  weight: number;
  coverImage: string | null;
  quantity: number;
  available: boolean;
}

interface CartState {
  items: CartItem[];

  addItem: (book: Omit<CartItem, "quantity">) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;

  getTotals: () => {
    totalAmount: number;
    totalWeight: number;
    totalItems: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add a book to the local cart.
       *
       * If the book already exists, increase its quantity.
       */
      addItem: (book) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.id === book.id
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === book.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item
            ),
          });

          return;
        }

        set({
          items: [
            ...currentItems,
            {
              ...book,
              quantity: 1,
            },
          ],
        });
      },

      /**
       * Remove a book completely from the local cart.
       *
       * Database synchronization is handled by CartClient
       * before this local mutation is performed.
       */
      removeItem: (bookId) => {
        set({
          items: get().items.filter(
            (item) => item.id !== bookId
          ),
        });
      },

      /**
       * Update the quantity of a cart item.
       *
       * Quantity can never fall below 1.
       */
      updateQuantity: (bookId, quantity) => {
        const item = get().items.find(
          (currentItem) => currentItem.id === bookId
        );

        if (!item) {
          return;
        }

        const validQuantity = Math.max(
          1,
          Math.floor(quantity)
        );

        set({
          items: get().items.map((currentItem) =>
            currentItem.id === bookId
              ? {
                  ...currentItem,
                  quantity: validQuantity,
                }
              : currentItem
          ),
        });
      },

      /**
       * Empty the local Zustand cart.
       *
       * Database clearing is handled by CartClient first.
       */
      clearCart: () => {
        set({
          items: [],
        });
      },

      /**
       * Calculate the current local cart totals.
       */
      getTotals: () => {
        const items = get().items;

        return items.reduce(
          (accumulator, item) => {
            accumulator.totalAmount +=
              item.price * item.quantity;

            accumulator.totalWeight +=
              item.weight * item.quantity;

            accumulator.totalItems +=
              item.quantity;

            return accumulator;
          },
          {
            totalAmount: 0,
            totalWeight: 0,
            totalItems: 0,
          }
        );
      },
    }),
    {
      name: "alhikmah-cart-storage",
    }
  )
);