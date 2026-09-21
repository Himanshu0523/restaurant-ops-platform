import Link from "next/link";
import { Card } from "./Card";
import { Badge } from "./Badge";

export function RestaurantCard({ restaurant, name, cuisine, rating, priceRange, distance, open, href }) {
  const data = restaurant || {
    id: "1",
    name: name || "Restaurant",
    cuisine: cuisine || "General",
    rating: rating ?? 4.5,
    priceRange: priceRange || "₹₹",
    distance: distance ?? 1.0,
    open: open !== undefined ? open : true,
    href,
  };

  const targetHref = data.href || `/restaurants/${data.id || "1"}`;

  return (
    <Link href={targetHref}>
      <Card className="overflow-hidden hover:shadow-md transition group">
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 flex items-center justify-center text-3xl">
          🍽️
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 truncate">{data.name}</h3>
            <span className="text-sm font-medium text-neutral-700">★ {data.rating}</span>
          </div>
          <p className="text-sm text-neutral-500">
            {data.cuisine} • {data.priceRange}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">{data.distance} km away</span>
            <Badge tone={data.open ? "green" : "red"}>
              {data.open ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}