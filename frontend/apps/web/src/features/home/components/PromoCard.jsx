"use client";

import React from "react";
import Link from "next/link";

export function PromoCard({ promotion }) {
  const { title, subtitle, description, couponCode, cta, route, bgGradient } = promotion;

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-r ${bgGradient} text-white shadow-lg flex flex-col justify-between space-y-4`}>
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
          {title}
        </span>
        <h3 className="text-2xl font-black">{subtitle}</h3>
        <p className="text-xs text-white/80 max-w-xs">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        {couponCode && (
          <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/20 font-mono text-xs font-bold text-amber-200">
            Use: {couponCode}
          </span>
        )}
        <Link
          href={route || "/search"}
          className="px-4 py-2 rounded-full bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 transition shadow-md"
        >
          {cta || "Order Now →"}
        </Link>
      </div>
    </div>
  );
}
