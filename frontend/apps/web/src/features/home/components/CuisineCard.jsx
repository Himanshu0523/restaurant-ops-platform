"use client";

import React from "react";
import Link from "next/link";

export function CuisineCard({ name, icon, count, slug }) {
  return (
    <Link
      href={`/search?cuisine=${slug}`}
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-orange-500 hover:shadow-md transition text-center group"
    >
      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-bold text-neutral-800 group-hover:text-orange-600 transition">
        {name}
      </span>
      {count && (
        <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
          {count} options
        </span>
      )}
    </Link>
  );
}
