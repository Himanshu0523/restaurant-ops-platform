import Link from "next/link";


const items = [
    { name: "Paneer Tikka" , price: 220 , qty: 2 },
    { name: "Butter Naan" , price: 120 , qty: 3 },
    { name: "Dal Makhani" , price: 250 , qty: 1 },
    { name: "Chilli Paneer" , price: 270 , qty: 1 },
    { name: "Veg Biryani" , price: 320 , qty: 2 },
    { name: "Gulab Jamun" , price: 150 , qty: 2 }
]

export default function CartPage() {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const delivery = 40;
    const total = subtotal + tax + delivery;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-sm text-neutral-500">ABC Restaurant</p>

        <div className="rounded-2xl bg-white border border-neutral-200 divide-y divide-neutral-100">
            {items.map((i) => (
            <div key={i.name} className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 rounded-lg bg-orange-100 shrink-0" />
                <div className="flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="text-sm text-neutral-500">₹{i.price} × {i.qty}</p>
                </div>
                <p className="font-semibold">₹{i.price * i.qty}</p>
            </div>
            ))}
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-2 text-sm">
            <Row label="Subtotal" value={`₹${subtotal}`} />
            <Row label="Tax" value={`₹${tax}`} />
            <Row label="Delivery" value={`₹${delivery}`} />
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
            <span>Total</span><span>₹{total}</span>
            </div>
        </div>

        <Link href="/checkout" className="block w-full h-12 rounded-xl bg-orange-500 text-white text-center leading-[3rem] font-medium hover:bg-orange-600">
            Proceed to Checkout
        </Link>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}