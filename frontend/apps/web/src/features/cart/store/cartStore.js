import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [
    { id: "d3", name: "Hyderabadi Chicken Biryani", price: 320, quantity: 1 },
    { id: "d4", name: "Dal Makhani Handi", price: 210, quantity: 1 },
  ],
  addItem: (dish) => {
    const existing = get().items.find((i) => i.id === dish.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...dish, quantity: 1 }] });
    }
  },
  removeItem: (dishId) => {
    set({ items: get().items.filter((i) => i.id !== dishId) });
  },
  clearCart: () => set({ items: [] }),
}));
