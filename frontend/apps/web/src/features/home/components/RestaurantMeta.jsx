import React from "react";
import { formatRating } from "../utils/restaurant-utils";

export function RestaurantMeta({ rating, deliveryTime, deliveryFee, distance }) {
  return (
    <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
      <span className="flex items-center gap-1 text-amber-600 font-bold">
        <span>⭐</span> {formatRating(rating)}
      </span>
      <span>•</span>
      <span>◷ {deliveryTime}</span>
      <span>•</span>
      <span>🚲 {deliveryFee}</span>
      {distance && (
        <>
          <span>•</span>
          <span>📍 {distance}</span>
        </>
      )}
    </div>
  );
}
