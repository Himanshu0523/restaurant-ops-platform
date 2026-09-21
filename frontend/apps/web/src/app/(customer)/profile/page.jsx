"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

const ALLERGEN_OPTIONS = ["Dairy", "Nuts", "Gluten", "Soy", "Eggs", "Shellfish"];

export default function ProfilePage() {
  const [name, setName] = useState("Alex Johnson");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [diet, setDiet] = useState("Veg"); // Veg | Non-Veg | Jain | Vegan | Halal
  const [allergens, setAllergens] = useState(["Nuts"]);

  const toggleAllergen = (item) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter((a) => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Account Profile & Preferences</h1>
          <p className="text-xs text-neutral-500">Dietary rules & allergen exclusions applied across kitchen menus</p>
        </div>
        <Link href="/profile/privacy" className="text-xs font-bold text-orange-600 hover:underline">
          Privacy & Consents →
        </Link>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Personal Details</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Phone Number</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pt-4 border-t border-neutral-100">
          Dietary Preference
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Veg", "Non-Veg", "Jain", "Vegan", "Halal"].map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                diet === d ? "bg-orange-600 text-white shadow-sm" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pt-4 border-t border-neutral-100">
          Allergen Exclusions (Safety Warnings)
        </h2>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => toggleAllergen(item)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                allergens.includes(item)
                  ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {allergens.includes(item) ? "⚠️ " : ""} {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}