"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

const MOCK_STOCK = [
  { id: "1", item: "Paneer (Fresh Cubes)", qty: "14 kg", threshold: "5 kg", daysLeft: "3 days", status: "OK" },
  { id: "2", name: "Basmati Rice (Grade A)", qty: "4 kg", threshold: "10 kg", daysLeft: "1 day", status: "CRITICAL" },
  { id: "3", name: "Cooking Oil (Sunflower)", qty: "8 L", threshold: "8 L", daysLeft: "2 days", status: "LOW" },
];

export default function ManagerInventoryPage() {
  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Inventory & Raw Materials</h1>
          <p className="text-xs text-neutral-500">Live stock tracking, theoretical recipe deduction, and wastage recording</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm">
            + Add Stock Purchase
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Total Tracked Items</span>
          <p className="text-2xl font-extrabold text-neutral-900">32 Items</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase">Low Stock Warnings</span>
          <p className="text-2xl font-extrabold text-amber-900">2 Items</p>
        </div>
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-1">
          <span className="text-xs font-bold text-red-700 uppercase">Critical Depletion</span>
          <p className="text-2xl font-extrabold text-red-900">1 Item</p>
        </div>
      </div>

      {/* Inventory Stock Table */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
              <th className="pb-3">Ingredient / Item</th>
              <th className="pb-3">Current Quantity</th>
              <th className="pb-3">Min Threshold</th>
              <th className="pb-3">Est. Days Left</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {MOCK_STOCK.map((st) => (
              <tr key={st.id} className="hover:bg-neutral-50 transition">
                <td className="py-4 font-bold text-neutral-900">{st.item || st.name}</td>
                <td className="py-4 font-bold text-neutral-800">{st.qty}</td>
                <td className="py-4 text-neutral-500">{st.threshold}</td>
                <td className="py-4 text-neutral-600">{st.daysLeft}</td>
                <td className="py-4">
                  <Badge variant={st.status === "OK" ? "success" : st.status === "LOW" ? "warning" : "danger"}>
                    {st.status}
                  </Badge>
                </td>
                <td className="py-4 text-right space-x-2">
                  <button className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[11px]">
                    Adjust
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px]">
                    Record Wastage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
