"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function OrderTrackingPage({ params }) {
  const orderId = params?.orderId || "ORD-9901";
  const [status, setStatus] = useState("PREPARING"); // ACCEPTED | PREPARING | READY | COMPLETED

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">Order #{orderId}</h1>
            <Badge variant="warning">{status}</Badge>
          </div>
          <p className="text-xs text-neutral-500">Royal Spice Bistro • Indiranagar</p>
        </div>
        <Link href="/orders" className="text-xs font-bold text-orange-600 hover:underline">
          All Orders
        </Link>
      </div>

      {/* ETA Confidence Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 text-white space-y-3 shadow-xl">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-200">Live Kitchen ETA</span>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            High Confidence (94%)
          </span>
        </div>
        <div className="text-4xl font-extrabold">12 - 15 Mins</div>
        <p className="text-xs text-white/80">
          Chef is currently assembling portion #2. Automatic pickup notification will trigger on ready.
        </p>
      </div>

      {/* Isometric / 2D Diorama Fallback */}
      <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-white text-center space-y-3 shadow-inner">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-5xl animate-bounce">
          🍳
        </div>
        <h3 className="font-bold text-base text-neutral-200">Kitchen Diorama Live Status</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Interactive 3D status preview. Sizzling and assembling your order items.
        </p>
      </div>

      {/* Preparation Timeline */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Preparation Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
            <div>
              <p className="text-xs font-bold text-neutral-900">Order Received & Accepted</p>
              <p className="text-[10px] text-neutral-400">10:14 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">●</span>
            <div>
              <p className="text-xs font-bold text-orange-600">Preparing at Kitchen Station #2</p>
              <p className="text-[10px] text-neutral-400">Est. completion in 10 mins</p>
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-40">
            <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-xs flex items-center justify-center font-bold">3</span>
            <div>
              <p className="text-xs font-bold text-neutral-900">Ready for Pickup / Table Serve</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items & Bill */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-sm text-xs">
        <h3 className="font-bold text-neutral-900 text-sm">Order Items</h3>
        <div className="flex justify-between text-neutral-700">
          <span>1x Hyderabadi Dum Biryani</span>
          <span className="font-bold">₹280</span>
        </div>
        <div className="flex justify-between text-neutral-700">
          <span>1x Paneer Butter Masala</span>
          <span className="font-bold">₹240</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-neutral-100 font-extrabold text-sm text-neutral-900">
          <span>Total Paid:</span>
          <span className="text-orange-600">₹546</span>
        </div>
      </div>
    </div>
  );
}