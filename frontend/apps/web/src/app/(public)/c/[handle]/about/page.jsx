import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default async function ChannelAboutPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || "demo-restaurant";

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 capitalize">{handle.replace("-", " ")} About & Compliance</h1>
          <p className="text-xs text-neutral-500">Hygiene verification, address, FSSAI license, and opening schedule</p>
        </div>
        <Link href={`/c/${handle}`} className="text-xs font-bold text-orange-600 hover:underline">
          ← Channel
        </Link>
      </div>

      {/* FSSAI Hygiene Badge */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h2 className="font-extrabold text-emerald-900 text-base">FSSAI Hygiene Verified</h2>
          </div>
          <p className="text-xs text-emerald-700">License No: 11223344556677 • Inspection Rating: 4.9/5</p>
        </div>
        <Badge variant="success" size="lg">VERIFIED</Badge>
      </div>

      {/* Details Card */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Address & Location</h3>
          <p className="text-sm text-neutral-700">
            #42, 12th Main Road, 100 Feet Road Junction, Indiranagar, Bengaluru, KA 560038
          </p>
          <div className="text-xs text-neutral-500">Geo Pin: 12.9716° N, 77.5946° E</div>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-100">
          <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Operating Schedule</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
            <div>Monday - Friday: 11:00 AM - 11:00 PM</div>
            <div>Saturday - Sunday: 11:00 AM - 11:30 PM</div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-100">
          <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Contact & Support</h3>
          <p className="text-xs text-neutral-600">Phone: +91 98765 43210 • Email: support@{handle}.com</p>
        </div>
      </div>
    </div>
  );
}
