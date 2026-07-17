// app/(admin)/malam-apply/page.tsx
import MalamApplicationForm from "./MalamApplicationForm";

export const metadata = {
  title: "Become a Malam Partner | Al-Hikmah Bookstore",
  description: "Apply to become a verified teacher reseller and access wholesale Islamic book prices",
};

export default function MalamApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-8">
          <a href="/" className="hover:text-emerald-400 transition">Home</a>
          <span className="mx-2">/</span>
          <span className="text-slate-500">Become a Malam</span>
        </nav>

        {/* Form */}
        <MalamApplicationForm />

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl font-bold mb-2">📝</div>
            <h3 className="font-bold text-slate-100 mb-2">Simple Application</h3>
            <p className="text-xs text-slate-400">
              Quick form with document verification. Takes just 5 minutes to apply.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl font-bold mb-2">⏱️</div>
            <h3 className="font-bold text-slate-100 mb-2">Fast Verification</h3>
            <p className="text-xs text-slate-400">
              Abdul will verify with your madrasah within 24-48 hours. You'll get an email.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl font-bold mb-2">💰</div>
            <h3 className="font-bold text-slate-100 mb-2">Wholesale Pricing</h3>
            <p className="text-xs text-slate-400">
              Access special teacher prices on books ≥50 GHS. Keep your margin.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ What is the madrasah letter?
              </h3>
              <p className="text-sm text-slate-400">
                A letter from your madrasah on their letterhead confirming you are a qualified Islamic teacher there. It should be signed by the director/principal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ Can I resell to students?
              </h3>
              <p className="text-sm text-slate-400">
                Yes! You get wholesale pricing. You can resell to your students, madrasah, or keep the books for personal use. You keep the profit margin.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ Do I need a minimum order?
              </h3>
              <p className="text-sm text-slate-400">
                No minimum order. You can order 1 book or 100 books. You get the same wholesale price either way.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ How do I get paid?
              </h3>
              <p className="text-sm text-slate-400">
                You pay Abdul upfront via Paystack before delivery. Books are delivered on Fridays. Simple and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 