import { RestaurantCard } from "@/components/ui/RestaurantCard";

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Favorites</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RestaurantCard restaurant={{ id: "1", name: "ABC Restaurant", rating: 4.5, cuisine: "Indian", priceRange: "₹₹", distance: 1.2, open: true }} />
          <RestaurantCard restaurant={{ id: "2", name: "FoodHub", rating: 4.7, cuisine: "Chinese", priceRange: "₹₹", distance: 3.4, open: true }} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Dishes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Paneer Tikka", "Biryani", "Margherita", "Butter Chicken"].map((d) => (
            <div key={d} className="rounded-xl bg-white border border-neutral-200 p-3">
              <div className="aspect-square rounded-lg bg-orange-100 mb-2" />
              <p className="text-sm font-medium">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}