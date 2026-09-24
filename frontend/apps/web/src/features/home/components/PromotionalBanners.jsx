"use client";

import React from "react";
import { PromoCard } from "./PromoCard";
import { PROMOTIONS_DATA } from "../data/promotions";

export function PromotionalBanners() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Exclusive Offers</h2>
          <p className="text-xs text-neutral-500">Save big on your next dine-in or delivery order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMOTIONS_DATA.map((promo) => (
          <PromoCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </section>
  );
}
