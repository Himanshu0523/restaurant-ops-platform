"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/features/cart/store/cartStore";

const MOCK_MENU = [
  {
    category: "Starters",
    dishes: [
      { id: "d1", name: "Paneer Tikka Spice", price: 220, isVeg: true, allergens: ["Dairy"], avail: "IN_STOCK", image: "🧀" },
      { id: "d2", name: "Chicken Malai Seekh", price: 260, isVeg: false, allergens: ["Dairy", "Nuts"], avail: "ONLY_3_LEFT", image: "🍗" },
    ],
  },
  {
    category: "Main Course & Dum Biryani",
    dishes: [
      { id: "d3", name: "Hyderabadi Chicken Biryani", price: 320, isVeg: false, allergens: [], avail: "IN_STOCK", image: "🍲" },
      { id: "d4", name: "Dal Makhani Handi", price: 210, isVeg: true, allergens: ["Dairy"], avail: "IN_STOCK", image: "🥣" },
    ],
  },
];

export function ChannelMenuView({ handle = "demo-restaurant" }) {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const { addItem, items } = useCartStore();

  const totalCartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Menu Header */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 capitalize">{handle.replace("-", " ")} Menu</h1>
          <p className="text-xs text-neutral-500">Optimized live inventory & kitchen preparation timing</p>
        </div>
        <Link href={`/c/${handle}`} className="text-xs font-bold text-orange-600 hover:underline">
          ← Back to Channel
        </Link>
      </div>

      {/* Category Scroll-Spy bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-100 no-scrollbar">
        {MOCK_MENU.map((c) => (
          <button
            key={c.category}
            onClick={() => setSelectedCategory(c.category)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === c.category
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {c.category}
          </button>
        ))}
      </div>

      {/* Dishes List */}
      <div className="space-y-8">
        {MOCK_MENU.filter((c) => c.category === selectedCategory).map((cat) => (
          <div key={cat.category} className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">{cat.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.dishes.map((dish) => (
                <div key={dish.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex justify-between gap-4 shadow-sm">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={dish.isVeg ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {dish.isVeg ? "🟢" : "🔴"}
                      </span>
                      <h3 className="font-bold text-neutral-900 text-sm">{dish.name}</h3>
                    </div>

                    <p className="text-xs font-bold text-neutral-800">₹{dish.price}</p>

                    {dish.allergens.length > 0 && (
                      <div className="flex gap-1 text-[10px]">
                        <span className="text-neutral-400">Allergens:</span>
                        {dish.allergens.map((a) => (
                          <span key={a} className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {dish.avail === "ONLY_3_LEFT" && (
                      <Badge variant="warning" size="sm">
                        ⚡ Only 3 portions left
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{dish.image}</span>
                    <button
                      onClick={() => addItem(dish)}
                      className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-sm"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Mini Cart Bar if items added */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-xl p-4 rounded-2xl bg-neutral-900 text-white flex justify-between items-center shadow-2xl border border-neutral-700">
          <div>
            <p className="text-xs text-neutral-400 font-medium">{totalCartCount} Items selected</p>
            <p className="text-sm font-extrabold text-orange-400">Total: ₹{totalCartPrice}</p>
          </div>
          <Link
            href="/cart"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-md transition"
          >
            View Cart & Checkout →
          </Link>
        </div>
      )}
    </div>
  );
}
