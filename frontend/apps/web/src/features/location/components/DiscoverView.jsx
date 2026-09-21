"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const MOCK_MAP_PINS = [
  { id: "1", name: "Royal Spice Bistro", handle: "royal-spice", status: "OPEN", wait: "10 min", x: 35, y: 40, cuisine: "North Indian", icon: "🍲" },
  { id: "2", name: "Urban Street Tacos", handle: "urban-tacos", status: "BUSY", wait: "22 min", x: 60, y: 25, cuisine: "Mexican", icon: "🌮" },
  { id: "3", name: "Noodle House", handle: "noodle-house", status: "OPEN", wait: "5 min", x: 20, y: 70, cuisine: "Pan Asian", icon: "🍜" },
  { id: "4", name: "Pizza Artisan", handle: "pizza-artisan", status: "PAUSED", wait: "30 min", x: 75, y: 65, cuisine: "Italian", icon: "🍕" },
];

export function DiscoverView() {
  const [viewMode, setViewMode] = useState("map"); // map | list
  const [selectedPin, setSelectedPin] = useState(MOCK_MAP_PINS[0]);
  const [showRankingInfo, setShowRankingInfo] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Nearby Discovery</h1>
          <p className="text-xs text-neutral-500">Live operational status and kitchen queues around your location</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRankingInfo(!showRankingInfo)}
            className="text-xs text-neutral-600 hover:text-orange-600 underline font-medium"
          >
            Why am I seeing this?
          </button>
          <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "map" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-600"
              }`}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "list" ? "bg-white text-orange-600 shadow-sm" : "text-neutral-600"
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>
      </div>

      {/* Ranking explanation sheet modal */}
      {showRankingInfo && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-neutral-700 space-y-2">
          <div className="flex justify-between items-center font-bold text-orange-900">
            <span>ℹ️ Ranking & Recommendation Algorithm</span>
            <button onClick={() => setShowRankingInfo(false)} className="text-neutral-400 hover:text-neutral-700">✕</button>
          </div>
          <p>
            Shops are ordered using distance, real-time prep ETA, fresh batch announcements, verified hygiene score, and customer diet match.
          </p>
        </div>
      )}

      {/* Main Container */}
      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[520px]">
          {/* SVG Map Container */}
          <div className="lg:col-span-2 relative rounded-3xl bg-neutral-900 overflow-hidden border border-neutral-800 shadow-inner flex items-center justify-center">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

            {/* Pins */}
            {MOCK_MAP_PINS.map((pin) => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 ${
                  selectedPin?.id === pin.id ? "z-20 scale-125" : "z-10"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg border ${
                    pin.status === "OPEN"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : pin.status === "BUSY"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-red-600 text-white border-red-400"
                  }`}
                >
                  <span>{pin.icon}</span>
                  <span>{pin.name}</span>
                  <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{pin.wait}</span>
                </div>
              </button>
            ))}

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs border border-white/10">
              📍 Interactive Map Preview (PostGIS Cell Grid)
            </div>
          </div>

          {/* Selected Pin Drawer */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 flex flex-col justify-between shadow-sm">
            {selectedPin ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-4xl">{selectedPin.icon}</span>
                  <Badge variant={selectedPin.status === "OPEN" ? "success" : "warning"}>
                    {selectedPin.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedPin.name}</h3>
                  <p className="text-xs text-neutral-500">{selectedPin.cuisine}</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Est. Prep & Delivery:</span>
                    <span className="font-bold text-neutral-900">{selectedPin.wait}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Walk Distance:</span>
                    <span className="font-bold text-neutral-900">~8 mins walk</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Link
                    href={`/c/${selectedPin.handle}`}
                    className="block w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-center font-bold text-sm shadow-md transition"
                  >
                    View Channel →
                  </Link>
                  <Link
                    href={`/c/${selectedPin.handle}/menu`}
                    className="block w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-center font-semibold text-xs transition"
                  >
                    Open Menu
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Click a pin on the map to inspect details.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_MAP_PINS.map((pin) => (
            <div key={pin.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <span className="text-3xl">{pin.icon}</span>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{pin.name}</h3>
                  <p className="text-xs text-neutral-500">{pin.cuisine} • {pin.wait} wait</p>
                </div>
              </div>
              <Link
                href={`/c/${pin.handle}`}
                className="px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200 hover:bg-orange-100 transition"
              >
                Visit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
