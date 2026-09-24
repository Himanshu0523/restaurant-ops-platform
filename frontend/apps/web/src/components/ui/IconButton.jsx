import React from "react";

export function IconButton({ icon, label, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-full hover:bg-neutral-100 transition flex items-center justify-center text-neutral-600 ${className}`}
    >
      {icon}
    </button>
  );
}
