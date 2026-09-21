export default function Loading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 text-neutral-500">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
