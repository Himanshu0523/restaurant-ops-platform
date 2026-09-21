"use client";

export function Input({ className = "", ...props}) {
    return (
        <input 
            className={`w-full h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${className}`}
            {...props}
        />
    )
}