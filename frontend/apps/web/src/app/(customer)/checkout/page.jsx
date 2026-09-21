"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState("PICKUP"); // DINE_IN | PICKUP
  const [startCookWhenNear, setStartCookWhenNear] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      router.push("/orders/ORD-9901");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Checkout & Payment</h1>
        <p className="text-xs text-neutral-500">Confirm order options and cook timing schedule</p>
      </div>

      {/* Order Type Toggle */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">1. Fulfillment Mode</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOrderType("PICKUP")}
            className={`p-4 rounded-2xl border text-left font-bold text-xs transition ${
              orderType === "PICKUP"
                ? "border-orange-500 bg-orange-50 text-orange-900"
                : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            🛍️ Pickup / Takeaway
          </button>
          <button
            onClick={() => setOrderType("DINE_IN")}
            className={`p-4 rounded-2xl border text-left font-bold text-xs transition ${
              orderType === "DINE_IN"
                ? "border-orange-500 bg-orange-50 text-orange-900"
                : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            🍽️ At-Table (Dine-in)
          </button>
        </div>

        {/* Cook when 8 min away toggle */}
        {orderType === "PICKUP" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900">Smart Geofence Cooking</p>
              <p className="text-amber-800">Start cooking automatically when I am 8 mins away</p>
            </div>
            <input
              type="checkbox"
              checked={startCookWhenNear}
              onChange={(e) => setStartCookWhenNear(e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded"
            />
          </div>
        )}
      </div>

      {/* Order Summary & Bill */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">2. Payment & Bill Details</h2>
        <div className="space-y-2 text-xs text-neutral-600">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <span className="font-semibold text-neutral-900">₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>GST & Restaurant Tax (5%):</span>
            <span className="font-semibold text-neutral-900">₹{tax}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-neutral-100 text-sm font-extrabold text-neutral-900">
            <span>Total Payable:</span>
            <span className="text-orange-600">₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Placing Order..." : `Pay ₹${total} via UPI / Card →`}
        </button>
      </div>
    </div>
  );
}