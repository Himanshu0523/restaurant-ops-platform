import { Button } from "@/components/ui/Button";

export default function ReserveTablePage() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Reserve a Table</h1>
        <p className="text-sm text-neutral-500">Book your table in advance.</p>
      </header>

      <form className="space-y-4 rounded-2xl bg-white border border-neutral-200 p-6">
        <div className="space-y-1">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full h-10 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            className="w-full h-10 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Number of Guests</label>
          <select className="w-full h-10 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-orange-500 bg-white">
            <option>1 Person</option>
            <option>2 People</option>
            <option>3 People</option>
            <option>4 People</option>
            <option>5+ People</option>
          </select>
        </div>

        <Button type="button" className="w-full h-11">
          Confirm Reservation
        </Button>
      </form>
    </div>
  );
}
