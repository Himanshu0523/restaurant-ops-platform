"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RestaurantCard } from "@/components/ui/RestaurantCard";
import { Badge } from "@/components/ui/Badge";

const QUICK_CHIPS = [
  { id: "open_now", label: "Open now", icon: "🟢" },
  { id: "fresh_now", label: "Fresh batch now", icon: "🔥" },
  { id: "veg", label: "Veg", icon: "🥬" },
  { id: "under_15", label: "Under 15 min", icon: "⚡" },
];

const MOCK_LIVE_NEAR = [
  { id: "c1", name: "Royal Spice Bistro", handle: "royal-spice", rating: 4.8, distance: "0.6 km", waitTime: "12 min", liveStatus: "OPEN", freshBatch: "Fresh Biryani 5m ago", crowd: "Brisk", verified: true },
  { id: "c2", name: "Urban Street Tacos", handle: "urban-tacos", rating: 4.6, distance: "1.1 km", waitTime: "8 min", liveStatus: "BUSY", freshBatch: "Churros hot now", crowd: "High", verified: true },
  { id: "c3", name: "Noodle House", handle: "noodle-house", rating: 4.7, distance: "1.8 km", waitTime: "15 min", liveStatus: "OPEN", freshBatch: null, crowd: "Normal", verified: false },
];

const MOCK_FRESH_BATCHES = [
  { id: "fb1", dish: "Hyderabadi Dum Biryani", restaurant: "Royal Spice Bistro", handle: "royal-spice", readyAt: "2 mins ago", qtyLeft: 14, image: "🍲", price: "₹280" },
  { id: "fb2", dish: "Hot Cinnamon Churros", restaurant: "Urban Street Tacos", handle: "urban-tacos", readyAt: "Just now", qtyLeft: 8, image: "🥖", price: "₹150" },
  { id: "fb3", dish: "Fresh Sourdough Pizza", restaurant: "Pizza Artisan", handle: "pizza-artisan", readyAt: "5 mins ago", qtyLeft: 5, image: "🍕", price: "₹390" },
];

const MOCK_TRENDING_DISHES = [
  { id: "td1", name: "Paneer Butter Masala", price: "₹240", rating: 4.9, ordersCount: "340+ today", image: "🥘" },
  { id: "td2", name: "Truffle Ramen", price: "₹420", rating: 4.8, ordersCount: "190+ today", image: "🍜" },
  { id: "td3", name: "Classic Cheeseburger", price: "₹210", rating: 4.7, ordersCount: "280+ today", image: "🍔" },
];

export function HomeView() {
  const [activeChip, setActiveChip] = useState("open_now");

  return (
    <div className="space-y-10 pb-12">
      {/* 3D / 2D Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span>✨ Live Restaurant Operations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            What are you craving right now?
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Real-time kitchen queues, fresh batch alerts, and instant table & pickup orders near you.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/search"
              className="flex items-center gap-3 h-13 px-6 rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-100 transition shadow-lg text-sm sm:text-base"
            >
              <span>🔍</span>
              <span>Search dishes, kitchens, or handles...</span>
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center h-13 px-6 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/40 transition text-sm font-medium"
            >
              📍 Nearby Map
            </Link>
          </div>

          {/* Quick Filter Chips */}
          <div className="pt-3 flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveChip(chip.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeChip === chip.id
                    ? "bg-white text-neutral-900 font-bold shadow-sm"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Hero Dish with 2D Fallback */}
        <div className="absolute right-4 bottom-4 hidden lg:flex items-center justify-center w-72 h-72 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="text-center space-y-2 animate-bounce">
            <span className="text-8xl select-none">🍱</span>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-200">
              3D Interactive View
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Batch Now Rail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Fresh Batch Now</h2>
            <Badge variant="danger" size="sm">LIVE</Badge>
          </div>
          <Link href="/discover?filter=fresh" className="text-sm font-semibold text-orange-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_FRESH_BATCHES.map((batch) => (
            <div
              key={batch.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 hover:shadow-md transition space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-4xl">{batch.image}</span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                  Only {batch.qtyLeft} left
                </span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">{batch.dish}</h3>
                <p className="text-xs text-neutral-600">by {batch.restaurant}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/60 text-xs">
                <span className="font-semibold text-neutral-700">Ready {batch.readyAt}</span>
                <Link
                  href={`/c/${batch.handle}/menu`}
                  className="font-bold text-orange-700 hover:underline"
                >
                  Order {batch.price} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Near You Rail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Live Near You</h2>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-orange-600 hover:underline">
            Explore Map
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_LIVE_NEAR.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.handle}`}
              className="group p-5 rounded-2xl bg-white border border-neutral-200 hover:border-orange-400 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  {c.liveStatus} • {c.waitTime} wait
                </span>
                <span className="text-xs text-neutral-500">{c.distance}</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-neutral-900 group-hover:text-orange-600 transition">
                    {c.name}
                  </h3>
                  {c.verified && <span className="text-blue-500 text-xs">✓</span>}
                </div>
                <p className="text-xs text-neutral-500">Crowd level: {c.crowd}</p>
              </div>
              {c.freshBatch && (
                <div className="text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200/50">
                  ⚡ {c.freshBatch}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Dishes Rail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Trending Dishes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_TRENDING_DISHES.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-white border border-neutral-200 flex gap-4 items-center">
              <span className="text-5xl">{d.image}</span>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 text-sm">{d.name}</h3>
                <p className="text-xs text-neutral-500">{d.ordersCount}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-orange-600">{d.price}</span>
                  <span className="text-xs text-amber-500">★ {d.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
