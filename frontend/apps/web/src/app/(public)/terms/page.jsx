export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 pb-16">
      <h1 className="text-3xl font-extrabold text-neutral-900">Terms of Service & Content Policy</h1>
      <p className="text-xs text-neutral-500">Last updated: September 2026</p>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm text-sm text-neutral-700 leading-relaxed">
        <h2 className="font-bold text-neutral-900 text-base">1. Acceptance of Terms</h2>
        <p>
          By creating an account or using Servio food ordering and kitchen discovery services, you agree to comply with all platform rules, restaurant kitchen guidelines, and payment terms.
        </p>

        <h2 className="font-bold text-neutral-900 text-base">2. Ordering & Idempotency</h2>
        <p>
          Orders placed on Servio are processed idempotently using server-side key verification to prevent duplicate payment charges. Kitchen preparation starts immediately upon order confirmation.
        </p>

        <h2 className="font-bold text-neutral-900 text-base">3. Sponsored Content & Verification</h2>
        <p>
          All sponsored kitchen listings are capped and explicitly marked. Hygiene scores are verified independently via official FSSAI certificates.
        </p>
      </div>
    </div>
  );
}
