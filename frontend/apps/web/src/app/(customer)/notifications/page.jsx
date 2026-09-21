"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

const MOCK_NOTIFS = [
  { id: "1", title: "Fresh Batch Ready!", body: "Hyderabadi Biryani fresh out of the oven at Royal Spice Bistro.", time: "10 mins ago", read: false },
  { id: "2", title: "Order #ORD-9901 Status", body: "Kitchen started preparing your order.", time: "25 mins ago", read: true },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-xs text-neutral-500">Order updates, fresh batch announcements, and alerts</p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-bold text-orange-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition space-y-1 ${
              n.read ? "bg-white border-neutral-200" : "bg-orange-50 border-orange-200 font-medium"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-neutral-900">{n.title}</h3>
              <span className="text-[10px] text-neutral-400">{n.time}</span>
            </div>
            <p className="text-xs text-neutral-600">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}