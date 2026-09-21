"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const INITIAL_DISHES = [
  { id: "1", name: "Paneer Tikka Spice", category: "Starters", price: 220, cost: 85, margin: "61%", avail: "IN_STOCK" },
  { id: "2", name: "Hyderabadi Dum Biryani", category: "Main Course", price: 320, cost: 110, margin: "65%", avail: "IN_STOCK" },
  { id: "3", name: "Chicken Malai Seekh", category: "Starters", price: 260, cost: 95, margin: "63%", avail: "SOLD_OUT" },
];

export default function ManagerMenuPage() {
  const [dishes, setDishes] = useState(INITIAL_DISHES);

  const toggleAvailability = (id) => {
    setDishes(
      dishes.map((d) =>
        d.id === id ? { ...d, avail: d.avail === "IN_STOCK" ? "SOLD_OUT" : "IN_STOCK" } : d
      )
    );
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Menu & Inventory Availability</h1>
          <p className="text-xs text-neutral-500">Instant 80ms availability toggle with live customer sync</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/manager/menu/categories"
            className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs"
          >
            Categories
          </Link>
          <Link
            href="/manager/menu/dishes/new"
            className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-700 transition"
          >
            + Add Dish
          </Link>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
              <th className="pb-3">Dish Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Recipe Cost</th>
              <th className="pb-3">Margin</th>
              <th className="pb-3 text-right">Availability Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {dishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-neutral-50 transition">
                <td className="py-4 font-bold text-neutral-900">
                  <Link href={`/manager/menu/dishes/${dish.id}`} className="hover:text-orange-600">
                    {dish.name}
                  </Link>
                </td>
                <td className="py-4 text-neutral-600">{dish.category}</td>
                <td className="py-4 font-bold text-neutral-900">₹{dish.price}</td>
                <td className="py-4 text-neutral-500">₹{dish.cost}</td>
                <td className="py-4 font-bold text-emerald-600">{dish.margin}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => toggleAvailability(dish.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      dish.avail === "IN_STOCK"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {dish.avail === "IN_STOCK" ? "In Stock ✓" : "Sold Out ✕"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
