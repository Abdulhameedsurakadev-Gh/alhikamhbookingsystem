// app/(admin)/malam-applications/[userId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";

import { requireAdminUser } from "@/lib/malam/auth-guards";
import { getMalamApplicationById } from "@/lib/malam/admin-queries";
import { auditMalamApplication } from "../actions";

export default async function MalamApplicationReviewPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdminUser();

  const { userId } = await params;

  const application = await getMalamApplicationById(userId);

  if (!application) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      {/* Back Navigation */}
      <Link
        href="/admin/malam-applications"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Malam Applications
      </Link>

      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">
          Malam Application Review
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          {application.name || "Unnamed Applicant"}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Review the applicant's teacher reseller information before making a
          verification decision.
        </p>
      </div>

      {/* Applicant Identity */}
      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              Applicant Information
            </h2>

            <p className="text-xs text-slate-500">
              Basic contact information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Full Name
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Phone
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Application Status
            </p>
            <p className="mt-1 text-sm font-semibold text-amber-400">
              {application.verificationStatus}
            </p>
          </div>
        </div>
      </section>

      {/* Teaching Information */}
      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="font-semibold text-slate-100">
            Teaching Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Information supplied by the teacher reseller applicant
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Teaching Subjects
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.teachingSubjects || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Years Teaching
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.yearsTeaching || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Madrasah Name
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.madrasahName || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Madrasah Phone
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.madrasahPhone || "Not provided"}
            </p>
          </div>
        </div>
      </section>

      {/* Verification History */}
      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="font-semibold text-slate-100">
            Verification Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Current verification record
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-amber-400">
              {application.verificationStatus}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Verified At
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {application.verifiedAt
                ? application.verifiedAt.toLocaleString()
                : "Not yet reviewed"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Verification Notes
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              {application.verificationNotes || "No verification notes yet."}
            </p>
          </div>
        </div>
      </section>

      {/* Documents — Display Only For Now */}
      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="font-semibold text-slate-100">
            Submitted Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Documents associated with this application
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              ID Proof
            </p>

            <p className="mt-2 text-sm text-slate-300">
              {application.idProofUrl
                ? "Document submitted"
                : "No document submitted"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Madrasah Letter
            </p>

            <p className="mt-2 text-sm text-slate-300">
              {application.letterUrl
                ? "Document submitted"
                : "No document submitted"}
            </p>
          </div>
        </div>
      </section>

      {/* Verification Decision */}
      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="font-semibold text-slate-100">
            Verification Decision
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Approve or reject this Malam partner application.
          </p>
        </div>

        <form action={auditMalamApplication.bind(null, application.id)} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="verificationNotes"
              className="text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Verification Notes
            </label>

            <textarea
              id="verificationNotes"
              name="verificationNotes"
              rows={4}
              placeholder="Enter your verification notes..."
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-600"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              name="status"
              value="REJECTED"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
            >
              Reject Application
            </button>

            <button
              type="submit"
              name="status"
              value="APPROVED"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Approve Application
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}