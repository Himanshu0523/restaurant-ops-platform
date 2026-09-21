// apps/web/src/app/(customer)/restaurants/page.jsx
import { RestaurantCard } from "@/components/ui/RestaurantCard";

const filters = ["Distance", "Rating", "Cuisine", "Open Now"];

const restaurants = [
  { id: "1", name: "ABC Restaurant", rating: 4.5, cuisine: "Indian",  priceRange: "₹₹", distance: 1.2, open: true },
  { id: "2", name: "FoodHub",        rating: 4.7, cuisine: "Chinese", priceRange: "₹₹", distance: 3.4, open: true },
  { id: "3", name: "Café Mocha",     rating: 4.2, cuisine: "Café",    priceRange: "₹",  distance: 0.8, open: false },
  { id: "4", name: "Pizza Point",    rating: 4.6, cuisine: "Italian", priceRange: "₹₹₹", distance: 2.1, open: true },
  { id: "5", name: "Sushi Zen",      rating: 4.8, cuisine: "Japanese",priceRange: "₹₹₹", distance: 4.7, open: true },
  { id: "6", name: "Tandoori Nights",rating: 4.3, cuisine: "Mughlai", priceRange: "₹₹", distance: 2.9, open: true },
];

export default function RestaurantsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold">Restaurants near you</h1>
        <input
          placeholder="Search restaurants…"
          className="w-full h-11 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-orange-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button key={f} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-neutral-300 bg-white text-sm hover:border-orange-400">
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
      </div>
    </div>
  );
}