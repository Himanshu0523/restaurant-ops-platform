"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function ChannelHomeView({ handle = "demo-restaurant" }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [shockActive, setShockActive] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Shock Mode Banner if Active */}
      {shockActive && (
        <div className="p-4 rounded-2xl bg-red-600 text-white flex justify-between items-center shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>⚡ SHOCK MODE ACTIVE:</span>
            <span>Surge volume in progress. Kitchen capacity throttle applied.</span>
          </div>
          <button
            onClick={() => setShockActive(false)}
            className="text-xs bg-black/30 px-3 py-1 rounded-lg hover:bg-black/50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍲</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold capitalize">{handle.replace("-", " ")}</h1>
              <span className="text-blue-400 text-lg">✓</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">
              Authentic North Indian & Artisanal Dum Biryanis • FSSAI Verified
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span>📍 Indiranagar, Bengaluru (1.2 km)</span>
              <span>⭐ 4.8 (1,240 reviews)</span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs transition shadow-md ${
                isFollowing ? "bg-neutral-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
            >
              {isFollowing ? "🔔 Following" : "+ Follow Shop"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Operational Status Panel */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Live Status</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-extrabold text-emerald-700 text-sm">ACCEPTING ORDERS</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Est. Wait Time</span>
          <p className="font-extrabold text-neutral-900 text-sm">12 - 16 mins</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Kitchen Crowd</span>
          <Badge variant="warning">Moderate (8 orders queued)</Badge>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">Dine-in Tables</span>
          <p className="font-extrabold text-neutral-900 text-sm">4 Tables Free</p>
        </div>
      </div>

      {/* Action Bar Navigation */}
      <div className="flex border-b border-neutral-200 gap-6 text-sm font-bold text-neutral-600">
        <Link href={`/c/${handle}`} className="pb-3 text-orange-600 border-b-2 border-orange-600">
          Home
        </Link>
        <Link href={`/c/${handle}/menu`} className="pb-3 hover:text-neutral-900">
          Menu & Ordering
        </Link>
        <Link href={`/c/${handle}/about`} className="pb-3 hover:text-neutral-900">
          About & Hygiene
        </Link>
      </div>

      {/* Highlights & Active Drops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h3 className="font-bold text-neutral-900 text-base">Active Fresh Batch</h3>
          </div>
          <p className="text-xs text-neutral-600">
            Special Mutton Dum Biryani cooked 8 minutes ago. Limited 12 portions available!
          </p>
          <Link
            href={`/c/${handle}/menu`}
            className="inline-block px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-700 transition"
          >
            Claim Portion (₹320) →
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-sm">
          <h3 className="font-bold text-neutral-900 text-base">📢 Announcement</h3>
          <p className="text-xs text-neutral-600">
            Enjoy 15% off on all Dine-in table orders scanned via QR code this weekend!
          </p>
        </div>
      </div>
    </div>
  );
}
