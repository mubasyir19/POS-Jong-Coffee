import { OrderItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrderState = {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  clearOrder: () => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  updateNote: (productId: string, note: string) => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.productVariantId === item.productVariantId,
          );
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.productVariantId === item.productVariantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          console.log("ini state item yang ditambahkan = ", item);
          return {
            items: [
              ...state.items,
              { ...item, quantity: 1, price: item.price },
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.productVariantId !== id),
        })),
      clearOrder: () => set({ items: [] }),
      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productVariantId === id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                  price: (i.price * (i.quantity + 1)) / i.quantity,
                }
              : i,
          ),
        })),
      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productVariantId === id
                ? {
                    ...i,
                    quantity: i.quantity - 1,
                    price: (i.price * (i.quantity - 1)) / i.quantity,
                  }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      updateNote: (productId, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productVariantId === productId ? { ...i, note } : i,
          ),
        })),
    }),
    { name: "order-storage" },
  ),
);
