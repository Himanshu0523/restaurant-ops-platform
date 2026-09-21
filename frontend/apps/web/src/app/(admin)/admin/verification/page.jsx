"use client";

import React, { useState } from "react";

const INITIAL_QUEUE = [
  {
    id: "VER-101",
    tenantName: "Royal Spice Bistro",
    handle: "royal-spice",
    fssaiNo: "11223344556677",
    phone: "+91 98765 43210",
    address: "#42 Indiranagar 100ft Road, Bengaluru",
    geoPin: "12.9716° N, 77.5946° E",
    status: "PENDING",
  },
  {
    id: "VER-102",
    tenantName: "Urban Street Tacos",
    handle: "urban-tacos",
    fssaiNo: "99887766554433",
    phone: "+91 91234 56789",
    address: "#12 Koramangala 5th Block, Bengaluru",
    geoPin: "12.9352° N, 77.6245° E",
    status: "PENDING",
  },
];

export default function AdminVerificationQueuePage() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);

  const handleDecision = (id, decision) => {
    setQueue(queue.filter((q) => q.id !== id));
    alert(`Tenant ${id} ${decision === "APPROVE" ? "APPROVED ✓" : "REJECTED ✕"}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider">FSSAI Verification Queue</h1>
          <p className="text-xs text-neutral-400">Review government license proof, phone verification, and geofence pin</p>
        </div>
      </div>

      <div className="space-y-4">
        {queue.map((item) => (
          <div key={item.id} className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-white">{item.tenantName}</h2>
                <p className="text-xs text-neutral-400">@{item.handle} • ID: {item.id}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 text-xs font-bold border border-amber-800">
                PENDING REVIEW
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
              <div>
                <span className="text-neutral-500 font-bold block">FSSAI License No:</span>
                <span className="font-mono text-emerald-400 font-bold">{item.fssaiNo}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold block">Contact Phone:</span>
                <span className="text-neutral-200">{item.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold block">Geo Coordinates:</span>
                <span className="text-neutral-200">{item.geoPin}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleDecision(item.id, "REJECT")}
                className="px-5 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800 transition"
              >
                Reject Tenant
              </button>
              <button
                onClick={() => handleDecision(item.id, "APPROVE")}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                Approve & Verify FSSAI Badge ✓
              </button>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <div className="p-12 text-center text-neutral-500 text-xs font-bold">
            🎉 All pending tenant verifications are complete!
          </div>
        )}
      </div>
    </div>
  );
}
