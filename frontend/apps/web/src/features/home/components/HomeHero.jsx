"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LocationSelector } from "./LocationSelector";
import { RestaurantSearch } from "./RestaurantSearch";

const QUICK_CHIPS = [
  { id: "open_now", label: "Open now", icon: "🟢" },
  { id: "fresh_now", label: "Fresh batch now", icon: "🔥" },
  { id: "veg", label: "Veg", icon: "🥬" },
  { id: "under_15", label: "Under 15 min", icon: "⚡" },
];

export function HomeHero() {
  const [activeChip, setActiveChip] = useState("open_now");

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 p-8 sm:p-12 text-white shadow-xl">
      <div className="relative z-10 max-w-2xl space-y-6">
        {/* Top Badges & Location Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span>✨ Live Operations</span>
          </div>
          <LocationSelector />
        </div>

        {/* Hero Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Discover the Best Restaurants Near You
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Delicious food, great vibes, live kitchen updates, and fast delivery at your fingertips.
          </p>
        </div>

        {/* Search Bar */}
        <div className="pt-1">
          <RestaurantSearch />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
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

      {/* Decorative 3D Food Graphic */}
      <div className="absolute right-4 bottom-4 hidden lg:flex items-center justify-center w-72 h-72 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <div className="text-center space-y-2 animate-bounce">
          <span className="text-8xl select-none">🍱</span>
          <div className="text-xs font-bold uppercase tracking-wider text-orange-200">
            Fresh & Delicious
          </div>
        </div>
      </div>
    </section>
  );
}

// Export default and named for backward compatibility
export default HomeHero;
export { HomeHero as HomeView };
