"use client";

import React from "react";
import Link from "next/link";
import { RestaurantCard } from "./RestaurantCard";
import { useHomeRestaurants } from "../hooks/useHomeRestaurants";

export function FeaturedRestaurants() {
  const { restaurants, isLoading } = useHomeRestaurants();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Featured Restaurants</h2>
          <p className="text-xs text-neutral-500">Live operational kitchens with top ratings</p>
        </div>

        <Link
          href="/discover"
          className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
        >
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
}
