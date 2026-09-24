"use client";

import React, { useState } from "react";
import { useHomeLocation } from "../hooks/useHomeLocation";

export function LocationSelector() {
  const { location, setLocation, isDetecting, detectLocation } = useHomeLocation();
  const [isOpen, setIsOpen] = useState(false);

  const CITIES = ["Indiranagar, Bengaluru", "Koramangala, Bengaluru", "Connaught Place, Delhi", "Bandra, Mumbai", "Vijay Nagar, Indore"];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-white hover:bg-white/20 transition border border-white/20"
      >
        <span>📍</span>
        <span>{isDetecting ? "Detecting location..." : location}</span>
        <span className="text-[10px]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white text-neutral-900 shadow-xl border border-neutral-200 z-50 p-2 text-xs">
          <button
            onClick={() => {
              detectLocation();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 font-bold text-orange-600 flex items-center gap-2"
          >
            <span>🎯</span> Use Current Location
          </button>
          <div className="my-1 border-t border-neutral-100" />
          <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Popular Cities
          </div>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => {
                setLocation(city);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
