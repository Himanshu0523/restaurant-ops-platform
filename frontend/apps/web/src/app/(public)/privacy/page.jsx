export default function PrivacyNoticePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 pb-16">
      <h1 className="text-3xl font-extrabold text-neutral-900">Privacy Notice & DPDP Compliance</h1>
      <p className="text-xs text-neutral-500">Effective Date: September 2026 • Digital Personal Data Protection Act (DPDP) 2023 Compliant</p>

      <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm text-sm text-neutral-700 leading-relaxed">
        <h2 className="font-bold text-neutral-900 text-base">1. Data Collected</h2>
        <p>
          We collect personal data explicitly provided during account registration, order placement, table reservation, and channel interaction (e.g., name, phone number, delivery address, dietary preferences, allergen exclusions).
        </p>

        <h2 className="font-bold text-neutral-900 text-base">2. Purpose of Collection</h2>
        <p>
          Your data is used solely to process food orders, dispatch notifications, calculate precise kitchen queue wait times, enforce allergen safety checks, and provide personalized discovery.
        </p>

        <h2 className="font-bold text-neutral-900 text-base">3. Your Rights & Data Portability</h2>
        <p>
          You have full rights under DPDP to view your active consents, export a complete JSON archive of your personal data, or permanently delete your account directly via your <a href="/profile/privacy" className="text-orange-600 underline font-semibold">Privacy Settings</a>.
        </p>
      </div>
    </div>
  );
}
