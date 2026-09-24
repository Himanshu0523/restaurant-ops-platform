"use client";

import React from "react";
import { ServiceHighlightCard } from "./ServiceHighlightCard";
import { SERVICE_HIGHLIGHTS_DATA } from "../data/service-highlights";

export function ServiceHighlights() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Why Servio?</h2>
          <p className="text-xs text-neutral-500">Built for seamless restaurant operations and dining</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICE_HIGHLIGHTS_DATA.map((item) => (
          <ServiceHighlightCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
