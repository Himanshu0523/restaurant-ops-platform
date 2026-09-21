import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-4xl font-bold text-neutral-900">404</h2>
      <p className="text-sm text-neutral-500">Page Not Found</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
