"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";

export default function ManagerChannelPage() {
  const [handle, setHandle] = useState("royal-spice");
  const [name, setName] = useState("Royal Spice Bistro");
  const [description, setDescription] = useState("Authentic North Indian & Artisanal Dum Biryanis");

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Channel & Printable Standees</h1>
          <p className="text-xs text-neutral-500">Public profile details, handle URL, and generated table QR standee PDF</p>
        </div>
        <button
          onClick={handlePrintStandee}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition"
        >
          🖨️ Print Standee PDF
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Channel Identity</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Kitchen Display Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Channel Handle</label>
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Short Bio</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-medium focus:border-orange-500 outline-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Printable QR Standee Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white text-center space-y-4 shadow-xl">
        <div className="inline-block p-4 rounded-2xl bg-white text-neutral-900 shadow-2xl">
          <div className="w-44 h-44 bg-neutral-900 rounded-xl flex items-center justify-center text-white text-xs font-mono font-bold">
            [QR CODE MATRIX]
          </div>
          <p className="text-[10px] font-bold text-neutral-500 mt-2">Scan for Menu & At-Table Ordering</p>
        </div>
        <div>
          <h3 className="text-xl font-extrabold">{name}</h3>
          <p className="text-xs text-neutral-400">servio.com/c/{handle}</p>
        </div>
      </div>
    </div>
  );
}
