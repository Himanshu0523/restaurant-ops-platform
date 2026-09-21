"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

const SHOCK_TYPES = [
  { id: "STAFF_SHORTAGE", name: "Staff Shortage", icon: "👨‍🍳", desc: "Auto-disable complex dishes & throttle queue to 8" },
  { id: "INGREDIENT_OUT", name: "Key Ingredient Depleted", icon: "🥦", desc: "Auto-hide dependent menu recipes" },
  { id: "SURGE_FESTIVAL", name: "Festival Surge Wave", icon: "🌊", desc: "Switch to pre-cooked fast batch items only" },
  { id: "POWER_GAS_CUT", name: "Gas / Power Outage", icon: "⚡", desc: "Pause cooked items; accept cold/beverage prep" },
];

export default function ManagerShockModePage() {
  const [activeShock, setActiveShock] = useState(null);

  const handleActivateShock = (shock) => {
    setActiveShock(shock);
    alert(`⚡ SHOCK MODE ACTIVATED: ${shock.name}. Auto-menu and capacity adjustments applied.`);
  };

  const handleDeactivate = () => {
    setActiveShock(null);
    alert("Shock Mode deactivated. Restored normal operations.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Shock Mode Emergency Room</h1>
          <p className="text-xs text-neutral-500">1-click contingency protocols for kitchen disruptions</p>
        </div>
        {activeShock && (
          <button
            onClick={handleDeactivate}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            ✓ Deactivate & Recover Normal Operations
          </button>
        )}
      </div>

      {activeShock ? (
        <div className="p-8 rounded-3xl bg-red-600 text-white space-y-4 shadow-xl text-center">
          <span className="text-6xl">{activeShock.icon}</span>
          <h2 className="text-2xl font-extrabold uppercase">SHOCK MODE ACTIVE: {activeShock.name}</h2>
          <p className="text-sm text-red-100 max-w-md mx-auto">{activeShock.desc}</p>
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md text-xs text-white/90">
            📢 Channel Banner Broadcast Active • Live Customer ETA Adjusted
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHOCK_TYPES.map((st) => (
            <div
              key={st.id}
              className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 hover:border-red-400 hover:shadow-md transition"
            >
              <span className="text-4xl">{st.icon}</span>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">{st.name}</h3>
                <p className="text-xs text-neutral-500">{st.desc}</p>
              </div>
              <button
                onClick={() => handleActivateShock(st)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
              >
                ⚡ Trigger Protocol
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
