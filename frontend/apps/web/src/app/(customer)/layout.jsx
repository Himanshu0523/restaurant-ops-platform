import Link from "next/link";

export default function CustomerLayout ({children}) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <header>
                <h1>Customer</h1>
            </header>
            {children}
        </div>
    )
}