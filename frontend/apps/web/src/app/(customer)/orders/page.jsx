import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const orders = [
  { id: "ORD1023", restaurant: "ABC Restaurant", date: "Today, 1:30 PM", items: "Paneer Tikka × 2, Butter Paneer × 1", total: 796, status: "Preparing" },
  { id: "ORD1020", restaurant: "FoodHub", date: "Yesterday, 8:15 PM", items: "Chilli Paneer × 1, Veg Noodles × 2", total: 540, status: "Delivered" },
  { id: "ORD1015", restaurant: "Pizza Point", date: "20 Dec, 7:00 PM", items: "Margherita Pizza × 1", total: 350, status: "Delivered" },
];

export default function OrdersPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{o.restaurant}</h3>
                <p className="text-xs text-neutral-500">Order #{o.id} • {o.date}</p>
              </div>
              <Badge tone={o.status === "Delivered" ? "green" : "orange"}>{o.status}</Badge>
            </div>
            <p className="text-sm text-neutral-600">{o.items}</p>
            <div className="flex items-center justify-between pt-2 border-t text-sm">
              <span className="font-semibold">Total: ₹{o.total}</span>
              <Link href={`/orders/${o.id}`} className="text-orange-600 font-medium hover:underline">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
