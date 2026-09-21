"use client";

import React from "react";

export default function ManagerAnalyticsPage() {
  return (
    <div className="space-y-8 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kitchen Analytics & Performance</h1>
          <p className="text-xs text-neutral-500">Revenue, prep time histogram, turnover, and menu engineering matrix</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs">
          📊 Export CSV Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Gross Revenue</span>
          <p className="text-2xl font-extrabold text-neutral-900">₹42,850</p>
          <span className="text-[10px] text-green-600 font-bold">+14% vs yesterday</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Completed Orders</span>
          <p className="text-2xl font-extrabold text-neutral-900">142 Orders</p>
          <span className="text-[10px] text-green-600 font-bold">12m avg prep time</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Avg Order Value (AOV)</span>
          <p className="text-2xl font-extrabold text-neutral-900">₹301.75</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Table Turnover</span>
          <p className="text-2xl font-extrabold text-neutral-900">3.4x / Table</p>
        </div>
      </div>

      {/* Analytics Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Top Performing Dishes</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span>1. Hyderabadi Dum Biryani</span>
              <span className="text-orange-600">64 Orders (₹20,480)</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>2. Paneer Butter Masala</span>
              <span className="text-orange-600">42 Orders (₹10,080)</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>3. Chicken Malai Seekh</span>
              <span className="text-orange-600">28 Orders (₹7,280)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Prep Time Histogram</h2>
          <div className="h-40 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-end justify-between p-4 gap-2 text-[10px] font-bold text-neutral-500">
            <div className="w-full bg-orange-300 h-[30%] rounded-t-lg text-center pt-1">5m</div>
            <div className="w-full bg-orange-600 h-[85%] rounded-t-lg text-center pt-1 text-white">12m</div>
            <div className="w-full bg-orange-400 h-[50%] rounded-t-lg text-center pt-1">18m</div>
            <div className="w-full bg-orange-200 h-[20%] rounded-t-lg text-center pt-1">25m</div>
          </div>
        </div>
      </div>
    </div>
  );
}
