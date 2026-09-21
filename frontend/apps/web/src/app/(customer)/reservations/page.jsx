import  { Badge } from "@/components/ui/Badge";

const  reservations = [
    {
        id: 1,
        restaurant: "ABC Restaurant",
        date: "2026-12-25",
        time: "19:00",
        people: 4,
        status: "Confirmed"
    },
    {
        id: 2,
        restaurant: "FoodHub",
        date: "2026-12-26",
        time: "20:00",
        people: 2,
        status: "Confirmed"
    },
    {
        id: 3,
        restaurant: "Café Mocha",
        date: "2026-12-27",
        time: "18:00",
        people: 3,
        status: "Pending"
    },
];


export default function ReservationsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Reservations</h1>
      {reservations.map((r) => (
        <div key={r.id} className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">{r.restaurant}</p>
            <Badge tone={r.status === "Confirmed" ? "green" : "yellow"}>{r.status}</Badge>
          </div>
          <p className="text-sm text-neutral-600">{r.date} • {r.time} • {r.people} guests</p>
          <div className="flex gap-2 pt-2">
            <button className="h-9 px-4 rounded-lg border border-neutral-300 text-sm">View</button>
            <button className="h-9 px-4 rounded-lg border border-red-300 text-red-600 text-sm">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}