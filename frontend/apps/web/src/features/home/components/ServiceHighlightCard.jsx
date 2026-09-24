import React from "react";

export function ServiceHighlightCard({ icon, title, description }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-start gap-4">
      <div className="text-3xl p-2 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-neutral-900">{title}</h4>
        <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
