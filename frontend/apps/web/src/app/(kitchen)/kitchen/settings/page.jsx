"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function KitchenSettingsPage() {
  const [station, setStation] = useState("MAIN_HOT_LINE");
  const [volume, setVolume] = useState(80);
  const [largeText, setLargeText] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider">KITCHEN DISPLAY SETTINGS</h1>
          <p className="text-xs text-neutral-400">Audio chimes, bump-bar configuration, station assignment</p>
        </div>
        <Link href="/kitchen" className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs">
          ← Back to KDS
        </Link>
      </div>

      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300 uppercase">Assigned Kitchen Station</label>
          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm font-bold outline-none"
          >
            <option value="MAIN_HOT_LINE">Main Hot Line (Grill & Curry)</option>
            <option value="FRYER_STATION">Fryer & Appetizers Station</option>
            <option value="COLD_BAR">Cold Bar & Salads</option>
            <option value="EXPO_PASS">Pass / Expo Final Check</option>
          </select>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-neutral-300 uppercase">Ticket Chime Volume</span>
            <span className="text-orange-400">{volume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
          <div>
            <h3 className="font-bold text-sm text-neutral-200">High Contrast Large-Text Mode</h3>
            <p className="text-xs text-neutral-400">Increased font size for long-distance wall mount monitors</p>
          </div>
          <input
            type="checkbox"
            checked={largeText}
            onChange={(e) => setLargeText(e.target.checked)}
            className="w-5 h-5 accent-orange-500 rounded"
          />
        </div>
      </div>
    </div>
  );
}
