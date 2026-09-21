"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const MOCK_FOLLOWING = [
  { id: "1", name: "Royal Spice Bistro", handle: "royal-spice", status: "OPEN", freshBatch: "Mutton Dum Biryani hot 4m ago", waitTime: "12 min" },
  { id: "2", name: "Urban Street Tacos", handle: "urban-tacos", status: "BUSY", freshBatch: "Cinnamon Churros ready", waitTime: "20 min" },
];

export default function FollowingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Your Followed Kitchens</h1>
          <p className="text-xs text-neutral-500">Live feeds, fresh batch alerts, and drops from shops you follow</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_FOLLOWING.map((shop) => (
          <div key={shop.id} className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{shop.name}</h2>
                <p className="text-xs text-neutral-500">@{shop.handle} • {shop.waitTime} wait</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={shop.status === "OPEN" ? "success" : "warning"}>{shop.status}</Badge>
                <Link
                  href={`/c/${shop.handle}/menu`}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition"
                >
                  Order →
                </Link>
              </div>
            </div>

            {shop.freshBatch && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex justify-between items-center">
                <span>🔥 {shop.freshBatch}</span>
                <span className="font-bold text-orange-700">Claim Now</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
