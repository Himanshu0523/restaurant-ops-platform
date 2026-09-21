import Link from "next/link";
import { DishRow } from "@/components/ui/DishRow";

const menu = {
  Starters: [
    { name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 220 },
    { name: "Veg Spring Roll", description: "Crispy rolls with veggies", price: 180 },
  ],
  "Main Course": [
    { name: "Butter Paneer", description: "Creamy tomato gravy with paneer", price: 280 },
    { name: "Biryani", description: "Fragrant basmati with spices", price: 250 },
  ],
};

export default function RestaurantPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-8 text-white space-y-2">
            <h1 className="text-3xl font-bold">ABC Restaurant</h1>
            <p className="text-sm text-white/90">North Indian • Chinese • Fast Food</p>
            <div className="flex items-center gap-4 text-sm text-white/90 pt-2">
            <span>★ 4.5 (500+ ratings)</span>
            <span>•</span>
            <span>₹200 for two</span>
            <span>•</span>
            <span>1.2 km away</span>
            </div>
        </div>

      {/* Menu */}
        <section id="menu" className="space-y-6">
            {Object.entries(menu).map(([category, dishes]) => (
            <div key={category}>
                <h2 className="text-lg font-semibold mb-3">{category}</h2>
                <div className="grid gap-3">
                {dishes.map((dish) => (
                    <DishRow key={dish.name} dish={dish} />
                ))}
                </div>
            </div>
            ))}
        </section>
    </div>
  );
}