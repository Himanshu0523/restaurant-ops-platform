export default function KitchenLayout({ children }) {
    return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-800">
        <p className="font-bold"> Kitchen • Zomato Restaurant</p>
        <span className="text-green-400 text-sm">● LIVE</span>
      </header>
      <main className="p-6">{children}</main>
    </div>
    )
}