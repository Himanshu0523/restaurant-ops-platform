"use client";

import React, { useState } from "react";

export default function NotificationSettingsPage() {
  const [freshBatchPush, setFreshBatchPush] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Notification & Alert Settings</h1>
        <p className="text-xs text-neutral-500">Configure per-shop bells, channels, and quiet hours</p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Fresh Batch Push Alerts</h3>
            <p className="text-xs text-neutral-500">Instant push notifications when followed kitchens post fresh batches</p>
          </div>
          <input
            type="checkbox"
            checked={freshBatchPush}
            onChange={(e) => setFreshBatchPush(e.target.checked)}
            className="w-5 h-5 accent-orange-600 rounded"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
          <div>
            <h3 className="font-bold text-sm text-neutral-900">WhatsApp Order Receipts</h3>
            <p className="text-xs text-neutral-500">Receive order status updates and digital tax invoices on WhatsApp</p>
          </div>
          <input
            type="checkbox"
            checked={whatsappAlerts}
            onChange={(e) => setWhatsappAlerts(e.target.checked)}
            className="w-5 h-5 accent-orange-600 rounded"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Enable Quiet Hours (10 PM - 8 AM)</h3>
            <p className="text-xs text-neutral-500">Mute promotional drops during nighttime</p>
          </div>
          <input
            type="checkbox"
            checked={quietHours}
            onChange={(e) => setQuietHours(e.target.checked)}
            className="w-5 h-5 accent-orange-600 rounded"
          />
        </div>
      </div>
    </div>
  );
}
