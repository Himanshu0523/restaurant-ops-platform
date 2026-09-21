"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

export default function ManagerLiveStatusPage() {
  const [status, setStatus] = useState("OPEN"); // OPEN | BUSY | PAUSED | CLOSED
  const [autoThrottle, setAutoThrottle] = useState(true);
  const [capacity, setCapacity] = useState(15);
  const [freshBatchActive, setFreshBatchActive] = useState(false);

  const handleTriggerFreshBatch = () => {
    setFreshBatchActive(true);
    alert("Broadcasted 'Fresh Batch Ready' event to all 420 followers!");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Live Operations Control</h1>
          <p className="text-xs text-neutral-500">Real-time status toggles, auto-throttle capacity, and fresh batch broadcast</p>
        </div>
        <button
          onClick={handleTriggerFreshBatch}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 transition flex items-center gap-2"
        >
          <span>🔥</span>
          <span>Announce Fresh Batch</span>
        </button>
      </div>

      {/* Main Status Switcher */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Kitchen Operating Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "OPEN", label: "🟢 OPEN (Accepting)", color: "border-green-500 bg-green-50 text-green-900" },
            { id: "BUSY", label: "🟡 BUSY (+10m ETA)", color: "border-amber-500 bg-amber-50 text-amber-900" },
            { id: "PAUSED", label: "🟠 PAUSED (Queue Full)", color: "border-orange-500 bg-orange-50 text-orange-900" },
            { id: "CLOSED", label: "🔴 CLOSED", color: "border-red-500 bg-red-50 text-red-900" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatus(st.id)}
              className={`p-4 rounded-2xl border font-bold text-xs transition ${
                status === st.id ? `${st.color} shadow-sm ring-2 ring-orange-500` : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Throttle & Capacity Card */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Smart Auto-Throttle Capacity</h2>
            <p className="text-xs text-neutral-500">Automatically pause digital orders when active kitchen queue exceeds threshold</p>
          </div>
          <input
            type="checkbox"
            checked={autoThrottle}
            onChange={(e) => setAutoThrottle(e.target.checked)}
            className="w-5 h-5 accent-orange-600 rounded"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-neutral-700">Max Queue Threshold:</span>
            <span className="text-orange-600">{capacity} Active Orders</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
        </div>
      </div>
    </div>
  );
}
