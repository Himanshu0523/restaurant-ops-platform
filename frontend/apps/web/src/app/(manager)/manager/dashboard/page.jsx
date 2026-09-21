import { Card } from "@/components/ui/Card"

const stats = [
    { label: "Today's Revenue" , value: "$1245.50", trend: "+12%", tone: "green" },
    { label: "Today's Orders" , value: "24", trend: "+5%", tone: "green" },
    { label: "Avg. Order Value" , value: "$45", trend: "-2%", tone: "red" },
    { label: "Active Tables" , value: "12/15", trend: "+3", tone: "green" },
];

const orders = [
    { id: "#1024", table: "Table 5", status: "completed", time: "10:45 AM", amount: "$85.50"},
    { id: "#1023", table: "Table 2", status: "completed", time: "10:30 AM", amount: "$42.00"},
    { id: "#1022", table: "Table 9", status: "completed", time: "10:15 AM", amount: "$120.00"},
    { id: "#1021", table: "Table 7", status: "pending", time: "10:05 AM", amount: "$65.50"},
    { id: "#1020", table: "Table 3", status: "completed", time: "09:50 AM", amount: "$28.00"},
    { id: "#1019", table: "Table 6", status: "pending", time: "09:45 AM", amount: "$72.50"},
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-neutral-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Revenue (last 7 days)</h2>
        <div className="h-56 flex items-end gap-3">
          {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-300" style={{ height: `${h}%` }} />
              <span className="text-xs text-neutral-500">{["M","T","W","T","F","S","S"][i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Top Selling Dishes</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>1. Biryani</span><span className="font-medium">142</span></li>
            <li className="flex justify-between"><span>2. Paneer Tikka</span><span className="font-medium">118</span></li>
            <li className="flex justify-between"><span>3. Butter Paneer</span><span className="font-medium">96</span></li>
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>New order #ORD1023 placed</li>
            <li>Order #ORD1020 marked ready</li>
            <li>Reservation confirmed for Rahul</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}