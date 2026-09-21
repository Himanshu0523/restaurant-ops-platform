import { DishRow } from "@/components/ui/DishRow";

const fullMenu = [
  { name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 220 },
  { name: "Veg Spring Roll", description: "Crispy rolls with veggies", price: 180 },
  { name: "Butter Paneer", description: "Creamy tomato gravy with paneer", price: 280 },
  { name: "Biryani", description: "Fragrant basmati with spices", price: 250 },
  { name: "Dal Makhani", description: "Black lentils cooked overnight", price: 210 },
  { name: "Garlic Naan", description: "Freshly baked Indian bread", price: 60 },
];

export default function RestaurantMenuPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Full Menu</h1>
        <p className="text-sm text-neutral-500">Explore all available items.</p>
      </header>

      <div className="grid gap-3">
        {fullMenu.map((dish) => (
          <DishRow key={dish.name} dish={dish} />
        ))}
      </div>
    </div>
  );
}
