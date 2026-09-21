import Link from "next/link";


const nav = [
    { href: "/manager/dashboard",    label: "Dashboard",    icon: "📊" },
    { href: "/manager/live-status",  label: "Live Status",  icon: "🟢" },
    { href: "/manager/orders",       label: "Orders",       icon: "📦" },
    { href: "/manager/kitchen",      label: "Kitchen",      icon: "🍳" },
    { href: "/manager/menu",         label: "Menu",         icon: "📋" },
    { href: "/manager/inventory",    label: "Inventory",    icon: "📦" },
    { href: "/manager/tables",       label: "Tables",       icon: "🪑" },
    { href: "/manager/staff",        label: "Staff",        icon: "👥" },
    { href: "/manager/analytics",    label: "Analytics",    icon: "📈" },
    { href: "/manager/ai",           label: "AI",           icon: "🤖" },
    { href: "/manager/settings",     label: "Settings",     icon: "⚙️" },
];


export default function ManagerLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-neutral-50">
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-neutral-200">
            <div className="h-16 flex items-center px-4 font-bold text-orange-600 border-b border-neutral-200">
                Manager
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {nav.map((n) => (
                <Link key={n.href} href={n.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-700">
                <span>{n.icon}</span>{n.label}
                </Link>
            ))}
            </nav>
        </aside>

        <div className="flex-1 flex flex-col">
            <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end gap-2 px-6">
            <button className="p-2 rounded-lg hover:bg-neutral-100">🔔</button>
            <button className="p-2 rounded-lg hover:bg-neutral-100">👤</button>
            </header>
            <main className="flex-1 p-6">{children}</main>
        </div>
        </div>
    );
}