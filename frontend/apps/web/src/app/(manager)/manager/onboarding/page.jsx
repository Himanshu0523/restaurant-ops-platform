"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tenantName, setTenantName] = useState("Royal Spice Kitchens");
  const [handle, setHandle] = useState("royal-spice");
  const [cuisine, setCuisine] = useState("North Indian");

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else router.push("/manager/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 pb-16">
      {/* Step Header */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Step {step} of 4</span>
        <h1 className="text-3xl font-extrabold text-neutral-900">
          {step === 1 && "Business Profile & Template"}
          {step === 2 && "Branch & Map Location Pin"}
          {step === 3 && "Operating Hours & Capacity"}
          {step === 4 && "Channel Handle & Launch!"}
        </h1>
        <p className="text-xs text-neutral-500">Go digital in 10 minutes with live kitchen queues</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      {/* Step Content */}
      <div className="p-8 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Business Name</label>
              <Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Primary Cuisine / Category</label>
              <Input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Channel Handle</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">servio.com/c/</span>
                <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs text-center">
              📍 Set map pin location on Bengaluru GIS Grid
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase">Default Kitchen Capacity</h3>
            <p className="text-xs text-neutral-500">Maximum concurrent active orders before auto-throttle triggers</p>
            <Input type="number" defaultValue="20" />
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4 py-4">
            <span className="text-6xl">🚀</span>
            <h2 className="text-xl font-bold text-neutral-900">Your Channel is Ready to Go Live!</h2>
            <p className="text-xs text-neutral-500">
              Printable table QR codes and manager control room are configured.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-neutral-100">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs"
            >
              Back
            </button>
          )}
          <button
            onClick={nextStep}
            className="ml-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            {step === 4 ? "Launch Dashboard 🎉" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
