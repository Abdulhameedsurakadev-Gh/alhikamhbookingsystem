// app/(admin)/verification/page.tsx
import { prisma } from "@/lib/prisma";
import VerificationDashboard from "./VerificationDashboard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Verification Dashboard | Al-Hikmah Admin",
  description: "Review and approve Malam and Madrasah applications",
};

export default async function VerificationPage() {
  // Check if user is admin
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch all applications
  const [pendingRaw, approvedRaw, rejectedRaw] = await Promise.all([
    prisma.user.findMany({
      where: { verificationStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { verificationStatus: "APPROVED" },
      orderBy: { verifiedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { verificationStatus: "REJECTED" },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Safeguard null phone numbers to prevent TypeScript build compilation errors
  const pending = pendingRaw.map((app) => ({
    ...app,
    phone: app.phone ?? "",
  }));

  const approved = approvedRaw.map((app) => ({
    ...app,
    phone: app.phone ?? "",
  }));

  const rejected = rejectedRaw.map((app) => ({
    ...app,
    phone: app.phone ?? "",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Verification Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review and approve Malam (teacher resellers) and Madrasah (school) applications.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pending.length}</p>
            </div>
            <div className="text-4xl text-amber-400/20">⏳</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Approved</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{approved.length}</p>
            </div>
            <div className="text-4xl text-emerald-400/20">✅</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Rejected</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{rejected.length}</p>
            </div>
            <div className="text-4xl text-red-400/20">❌</div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <VerificationDashboard
          pendingApplications={pending}
          approvedApplications={approved}
          rejectedApplications={rejected}
        />
      </div>

      {/* Info Box */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-400">
          <strong>How to verify:</strong> Click on an application to view details, download documents, call the madrasah if needed, then approve/reject with notes.
        </p>
      </div>
    </div>
  );
}
