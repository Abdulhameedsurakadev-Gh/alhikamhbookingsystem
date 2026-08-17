// app/(admin)/malam-applications/page.tsx

import Link from "next/link";
import { requireAdminUser } from "@/lib/malam/auth-guards";
import { getMalamApplications } from "@/lib/malam/admin-queries";
import { VerificationStatus } from "@prisma/client";
import { ArrowRight, UserRound } from "lucide-react";

export default async function MalamApplicationsPage() {
  // Only authenticated administrators can access this page.
  await requireAdminUser();

  // Fetch each application state separately.
  const [pendingApplications, approvedApplications, rejectedApplications] =
    await Promise.all([
      getMalamApplications(VerificationStatus.PENDING),
      getMalamApplications(VerificationStatus.APPROVED),
      getMalamApplications(VerificationStatus.REJECTED),
    ]);

  return (
    <main className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Malam Applications
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Review and manage teacher reseller applications for Al-Hikmah
          Islamic Bookstore.
        </p>
      </div>

      {/* Application Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {pendingApplications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Approved
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {approvedApplications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Rejected
          </p>
          <p className="mt-2 text-2xl font-bold text-red-400">
            {rejectedApplications.length}
          </p>
        </div>
      </div>

      {/* Pending Applications */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-100">
            Pending Applications
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {pendingApplications.length === 0
              ? "There are currently no pending Malam applications."
              : `${pendingApplications.length} Malam application${
                  pendingApplications.length === 1 ? "" : "s"
                } awaiting review.`}
          </p>
        </div>

        {pendingApplications.length > 0 && (
          <div className="divide-y divide-slate-800">
            {pendingApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Applicant Information */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-100">
                      {application.name || "Unnamed Applicant"}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-400">
                      {application.email}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {application.phone && (
                        <span>{application.phone}</span>
                      )}

                      {application.madrasahName && (
                        <span>{application.madrasahName}</span>
                      )}
                    </div>

                    {application.teachingSubjects && (
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-400">
                          Subjects:
                        </span>{" "}
                        {application.teachingSubjects}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Action */}
                <Link
                  href={`/admin/malam-applications/${application.id}`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-500/40 hover:bg-slate-700 hover:text-emerald-400"
                >
                  Review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}