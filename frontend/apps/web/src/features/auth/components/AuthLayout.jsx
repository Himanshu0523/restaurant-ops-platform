import Link from "next/link";

export default function AuthLayout({ pageTitle, children }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <aside className="flex items-center justify-center p-8 bg-muted">
                <Link href="/" className="text-4xl font-semibold">Restaurant</Link>
            </aside>
            <div className="py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                {pageTitle && <h1 className="mb-6 text-2xl font-bold text-center sm:text-start">{pageTitle}</h1>}
                {children}
            </div>
        </div>
    );
}

export { AuthLayout };