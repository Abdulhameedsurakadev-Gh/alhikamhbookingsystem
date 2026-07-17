// app/(store)/madrasah-apply/page.tsx
import React from "react";
import MadrasahApplicationForm from "./MadrasahApplicationForm";

export const metadata = {
  title: "School Partnership Program | Al-Hikmah Bookstore",
  description: "Register your madrasah to access bulk Islamic book purchases with institutional pricing and special discounts",
};

export default function MadrasahApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb Hierarchy */}
        <nav className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-8 select-none">
          <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-500">School Partnership</span>
        </nav>

        {/* Core Institutional Client Form Area */}
        <div className="w-full">
          <MadrasahApplicationForm />
        </div>

        {/* Info Section Grid Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-emerald-400 text-2xl font-bold mb-2 select-none">📚</div>
            <h3 className="font-bold text-slate-100 mb-2">Bulk Discounts</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Special institutional pricing on books ≥50 GHS. The more you order, the better your margin.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-emerald-400 text-2xl font-bold mb-2 select-none">⏱️</div>
            <h3 className="font-bold text-slate-100 mb-2">Friday Deliveries</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Reliable weekly delivery schedule. Delivered directly to your school in Accra or Kasoa.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-emerald-400 text-2xl font-bold mb-2 select-none">✅</div>
            <h3 className="font-bold text-slate-100 mb-2">Authentic Books</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Real Islamic texts from trusted suppliers. Every book photographed and verified.
            </p>
          </div>
        </div>

        {/* How It Works Section Timeline */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-md">
          <h2 className="text-xl font-bold text-slate-100 mb-6">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-sm select-none">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Submit Application
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Fill the form with your school details, principal name, and upload the madrasah letter.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-sm select-none">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Verification Call
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Abdul calls your school to confirm. Usually happens within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-sm select-none">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Get Approved
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Once verified, you get institutional pricing and a dashboard to place orders.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-sm select-none">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Place Orders
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Browse books at your school price, order any quantity, pay via Paystack or cash on delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-sm select-none">
                  5
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Friday Delivery
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Books delivered to your location every Friday. Track orders in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section Accordion Layout */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-md">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ What is the madrasah letter?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A letter on your school's official letterhead, signed by the principal/director, confirming that your madrasah is an active Islamic school. This helps us verify the institution.
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-4">
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ Is there a minimum order?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No minimum! Order 1 book or 100 books. You get the same institutional pricing regardless of quantity.
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-4">
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ How does payment work?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                For Accra/Kasoa schools, you can pay upfront via Paystack or cash on delivery (Kasoa only). Payment is due before delivery on Friday.
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-4">
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ Can we negotiate bulk pricing?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! Once verified, Abdul will discuss custom pricing based on your school's needs and order volume.
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-4">
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ What if we need books in a different term?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You can place orders whenever needed. Many schools order at term starts, but you can order anytime during the school year.
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-4">
              <h3 className="font-semibold text-slate-200 mb-2">
                ❓ Where are the books from?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Al-Hikmah sources authentic Islamic books from verified suppliers. Every book is real, photographed, and checked for quality.
              </p>
            </div>
          </div>
        </div>

               {/* CTA Section Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-emerald-800 border border-emerald-700 rounded-xl p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-white mb-3">
            Ready to Partner with Al-Hikmah?
          </h2>
          <p className="text-sm text-emerald-100 mb-4 leading-normal">
            Scroll up to submit your school's application. We'll be in touch within 24 hours.
          </p>
          <div className="text-xs text-emerald-200 border border-emerald-800/60 bg-emerald-950/40 rounded-lg px-4 py-2 w-fit mx-auto select-all font-medium">
            Questions? WhatsApp Abdul: 0551-234567
          </div>
        </div>
      </div>
    </div>
  );
}
