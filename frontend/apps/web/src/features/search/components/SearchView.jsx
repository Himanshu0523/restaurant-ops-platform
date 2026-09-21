"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

const RECENT_SEARCHES = ["samosa hot now", "vegan momos", "biryani under 300", "chai point"];
const POPULAR_CUISINES = ["North Indian", "South Indian", "Chinese", "Italian", "Burgers", "Desserts"];

export function SearchView() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Search Input Bar */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-neutral-900">Search Kitchens & Dishes</h1>
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by dish name, handle, ingredient, or 'samosa hot now'..."
            className="h-14 pl-12 pr-4 rounded-2xl text-base shadow-sm border-neutral-300 focus:border-orange-500"
          />
          <span className="absolute left-4 top-4 text-xl text-neutral-400">🔍</span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recent Searches */}
      {!query && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Recent Searches</h2>
          <div className="flex flex-wrap gap-2">
            {RECENT_SEARCHES.map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 transition"
              >
                🕒 {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cuisines */}
      {!query && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Popular Cuisines</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setQuery(cuisine)}
                className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-orange-400 font-bold text-sm text-neutral-800 text-left transition shadow-sm"
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Mock */}
      {query && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-500">Results for &quot;{query}&quot;</h2>
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Royal Spice Bistro</h3>
                <p className="text-xs text-neutral-500">@royal-spice • North Indian</p>
              </div>
              <Link
                href="/c/royal-spice"
                className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition"
              >
                View Channel
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Special Hyderabadi Dum Biryani</h3>
                <p className="text-xs text-orange-600 font-semibold">Fresh batch ready 5m ago • ₹280</p>
              </div>
              <Link
                href="/c/royal-spice/menu"
                className="px-4 py-1.5 rounded-xl bg-orange-100 text-orange-700 font-bold text-xs hover:bg-orange-200 transition"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
