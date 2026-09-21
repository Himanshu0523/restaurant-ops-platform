"use client";

import React, { useState } from "react";

export default function CustomerPrivacyDataPage() {
  const [consents, setConsents] = useState({
    marketing: true,
    whatsapp: true,
    locationTracking: true,
  });

  const handleExportData = () => {
    alert("Generating JSON data export archive... Download will start shortly.");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to permanently delete your account and remove all personal data?")) {
      alert("Account deletion request initiated under DPDP rules.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Privacy & Data Governance</h1>
        <p className="text-xs text-neutral-500">Manage active consent, export data archive, or request deletion (DPDP)</p>
      </div>

      {/* Active Consents */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Active Consents</h2>

        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-neutral-900">WhatsApp Receipts & Notifications</p>
            <p className="text-neutral-500">Granted on account registration</p>
          </div>
          <button
            onClick={() => setConsents({ ...consents, whatsapp: !consents.whatsapp })}
            className={`px-3 py-1 rounded-lg font-bold ${
              consents.whatsapp ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {consents.whatsapp ? "Active" : "Withdrawn"}
          </button>
        </div>

        <div className="flex justify-between items-center text-xs pt-3 border-t border-neutral-100">
          <div>
            <p className="font-bold text-neutral-900">Real-time Location Discovery</p>
            <p className="text-neutral-500">Used for walk time & cell room matching</p>
          </div>
          <button
            onClick={() => setConsents({ ...consents, locationTracking: !consents.locationTracking })}
            className={`px-3 py-1 rounded-lg font-bold ${
              consents.locationTracking ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {consents.locationTracking ? "Active" : "Withdrawn"}
          </button>
        </div>
      </div>

      {/* Data Export & Deletion */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Data Ownership Actions</h2>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Export My Data Archive</h3>
            <p className="text-xs text-neutral-500">Download all your profile history, saved addresses, and past orders as JSON</p>
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black transition shadow-sm"
          >
            Export JSON
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
          <div>
            <h3 className="font-bold text-sm text-red-600">Delete Account & Erase Data</h3>
            <p className="text-xs text-neutral-500">Permanently erase all personal data from Servio databases</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
