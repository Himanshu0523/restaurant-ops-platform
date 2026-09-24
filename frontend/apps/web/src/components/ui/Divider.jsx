import React from "react";

export function Divider({ className = "" }) {
  return <hr className={`border-t border-neutral-200 my-4 ${className}`} />;
}
