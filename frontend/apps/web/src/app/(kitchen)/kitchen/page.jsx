"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

const INITIAL_TICKETS = [
  {
    id: "TK-101",
    orderNo: "#9901",
    table: "Table 4",
    timer: "04:12",
    slaStatus: "NORMAL", // NORMAL | WARNING | CRITICAL
    items: [
      { name: "1x Hyderabadi Dum Biryani", mods: "Extra spicy" },
      { name: "1x Paneer Butter Masala", mods: "Less oil" },
    ],
    allergens: ["Nuts"],
    status: "NEW", // NEW | PREPARING | READY
  },
  {
    id: "TK-102",
    orderNo: "#9902",
    table: "Pickup #12",
    timer: "11:45",
    slaStatus: "WARNING",
    items: [
      { name: "2x Chicken Malai Seekh", mods: "No dairy" },
    ],
    allergens: ["Dairy"],
    status: "PREPARING",
  },
];

export default function KitchenBoardPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const advanceTicket = (id) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "NEW" ? "PREPARING" : t.status === "PREPARING" ? "READY" : "READY";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 space-y-6 select-none font-sans">
      {/* KDS Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍🍳</span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider">KITCHEN DISPLAY SYSTEM</h1>
            <p className="text-xs text-neutral-400">Station: Main Hot Line • Touch targets 56px+</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
            🟢 ONLINE & SYNCED
          </span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NEW Orders Column */}
        <div className="space-y-4 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <h2 className="font-extrabold text-sm text-neutral-300 tracking-wider">NEW TICKETS</h2>
            <Badge variant="warning">
              {tickets.filter((t) => t.status === "NEW").length}
            </Badge>
          </div>

          {tickets.filter((t) => t.status === "NEW").map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xl font-black text-amber-400">{t.orderNo}</span>
                  <p className="text-xs font-bold text-neutral-400">{t.table}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-950 text-amber-400 font-mono font-bold text-sm border border-amber-800">
                  ⏱️ {t.timer}
                </span>
              </div>

              {t.allergens.length > 0 && (
                <div className="p-2.5 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-2">
                  <span>⚠️ ALLERGY WARNING:</span>
                  <span>{t.allergens.join(", ")}</span>
                </div>
              )}

              <div className="space-y-2 text-sm font-medium">
                {t.items.map((item, idx) => (
                  <div key={idx} className="border-b border-neutral-800/60 pb-1">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-amber-300 font-bold">{item.mods}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => advanceTicket(t.id)}
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider transition shadow-lg"
              >
                Accept & Start Prep →
              </button>
            </div>
          ))}
        </div>

        {/* PREPARING Column */}
        <div className="space-y-4 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <h2 className="font-extrabold text-sm text-neutral-300 tracking-wider">IN PREPARATION</h2>
            <Badge variant="warning">
              {tickets.filter((t) => t.status === "PREPARING").length}
            </Badge>
          </div>

          {tickets.filter((t) => t.status === "PREPARING").map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-neutral-900 border border-orange-500/50 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xl font-black text-orange-400">{t.orderNo}</span>
                  <p className="text-xs font-bold text-neutral-400">{t.table}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-orange-950 text-orange-400 font-mono font-bold text-sm border border-orange-800">
                  ⏱️ {t.timer}
                </span>
              </div>

              {t.allergens.length > 0 && (
                <div className="p-2.5 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-2">
                  <span>⚠️ ALLERGY WARNING:</span>
                  <span>{t.allergens.join(", ")}</span>
                </div>
              )}

              <div className="space-y-2 text-sm font-medium">
                {t.items.map((item, idx) => (
                  <div key={idx} className="border-b border-neutral-800/60 pb-1">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-amber-300 font-bold">{item.mods}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => advanceTicket(t.id)}
                className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider transition shadow-lg"
              >
                Mark Ticket Ready ✓
              </button>
            </div>
          ))}
        </div>

        {/* READY Column */}
        <div className="space-y-4 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <h2 className="font-extrabold text-sm text-neutral-300 tracking-wider">READY FOR PASS</h2>
            <Badge variant="success">
              {tickets.filter((t) => t.status === "READY").length}
            </Badge>
          </div>

          {tickets.filter((t) => t.status === "READY").map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/50 space-y-4 shadow-xl opacity-80">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xl font-black text-emerald-400">{t.orderNo}</span>
                  <p className="text-xs font-bold text-neutral-400">{t.table}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 font-bold text-xs">
                  READY
                </span>
              </div>
              <p className="text-xs text-neutral-400">Order handed over to pass / waiter.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}