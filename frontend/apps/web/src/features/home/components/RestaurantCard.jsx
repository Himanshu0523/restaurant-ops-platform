"use client";

import React from "react";
import Link from "next/link";
import { RestaurantBadge } from "./RestaurantBadge";
import { RestaurantMeta } from "./RestaurantMeta";
import { formatCuisines } from "../utils/restaurant-utils";

export function RestaurantCard({ restaurant }) {
  const {
    name,
    handle,
    rating,
    cuisines,
    deliveryTime,
    deliveryFee,
    distance,
    status,
    badges = [],
    freshBatch,
  } = restaurant;

  return (
    <Link
      href={`/c/${handle}`}
      className="group flex flex-col rounded-3xl bg-white border border-neutral-200 overflow-hidden hover:shadow-xl transition duration-300"
    >
      {/* Thumbnail Header */}
      <div className="relative h-44 bg-neutral-100 overflow-hidden flex items-center justify-center">
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
          🍱
        </div>

        {/* Status & Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {status && <RestaurantBadge label={status} />}
          {badges.map((badge) => (
            <RestaurantBadge key={badge} label={badge} />
          ))}
        </div>

        {/* Live Fresh Batch Tag */}
        {freshBatch && (
          <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
            <span className="animate-pulse">🔥</span>
            <span className="truncate">{freshBatch}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-base text-neutral-900 group-hover:text-orange-600 transition">
            {name}
          </h3>
          <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
            {formatCuisines(cuisines)}
          </p>
        </div>

        <RestaurantMeta
          rating={rating}
          deliveryTime={deliveryTime}
          deliveryFee={deliveryFee}
          distance={distance}
        />
      </div>
    </Link>
  );
}
