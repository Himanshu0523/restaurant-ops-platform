"use client";

import React from "react";
import { CuisineCard } from "./CuisineCard";
import { CUISINES_DATA } from "../data/cuisines";

export function CuisineCategories() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">What would you like to eat?</h2>
          <p className="text-xs text-neutral-500">Explore top rated cuisines near your area</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CUISINES_DATA.map((cuisine) => (
          <CuisineCard
            key={cuisine.id}
            name={cuisine.name}
            icon={cuisine.icon}
            count={cuisine.count}
            slug={cuisine.slug}
          />
        ))}
      </div>
    </section>
  );
}
