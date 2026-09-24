import React from "react";

export function RestaurantBadge({ label }) {
  const badgeStyles = {
    OPEN: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    BUSY: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    SPECIAL: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    "TOP RATED": "bg-orange-500/10 text-orange-700 border-orange-500/20",
    "FAST DELIVERY": "bg-blue-500/10 text-blue-700 border-blue-500/20",
    NEW: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  };

  const style = badgeStyles[label] || "bg-neutral-100 text-neutral-700 border-neutral-200";

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${style}`}>
      {label}
    </span>
  );
}
