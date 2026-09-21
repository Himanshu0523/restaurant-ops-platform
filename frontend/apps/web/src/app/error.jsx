"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-xl font-bold text-neutral-900">Something went wrong!</h2>
      <p className="text-sm text-neutral-500 max-w-md">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
      >
        Try again
      </button>
    </div>
  );
}
