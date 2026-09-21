"use client";

import { Button } from "./Button";

export function DishRow({ dish, onAdd }) {
  if (!dish) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-neutral-200">
      <div className="space-y-1">
        <h4 className="font-semibold text-neutral-900">{dish.name}</h4>
        {dish.description && (
          <p className="text-sm text-neutral-500">{dish.description}</p>
        )}
        <p className="text-sm font-medium text-neutral-800">₹{dish.price}</p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onAdd?.(dish)}
      >
        + Add
      </Button>
    </div>
  );
}