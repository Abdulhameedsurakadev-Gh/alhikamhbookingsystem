// app/(admin)/verification/VerificationDashboard.tsx
"use client";

import React, { useState, useTransition } from "react";
import { approveApplication, rejectApplication } from "./actions";
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { UserRole, VerificationStatus } from "@prisma/client";

interface Application {
  id: string;
  name: string | null;
  email: string;
  phone: string;
  role: UserRole;
  verificationStatus: VerificationStatus | null;
  createdAt: Date;
  
  // Malam fields
  teachingSubjects?: string | null;
  yearsTeaching?: string | null;
  madrasahName?: string | null;
  
  // Madrasah fields
  organizationName?: string | null;
  principalName?: string | null;
  studentCount?: number | null;
  location?: string | null;
  
  // Documents
  letterUrl?: string | null;
  idProofUrl?: string | null;

  // Notes field for approved/rejected records
  verificationNotes?: string | null;

  // Catch-all structural map bypass for residual Prisma properties
  [key: string]: any; 
}

interface VerificationDashboardProps {
  pendingApplications: Application[];
  approvedApplications: Application[];
  rejectedApplications: Application[];
}

export default function VerificationDashboard({
  pendingApplications,
  approvedApplications,
  rejectedApplications,
}: VerificationDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleApprove = (userId: string) => {
    if (!notes.trim()) {
      alert("Please add verification notes");
      return;
    }

    startTransition(async () => {
      setActioningId(userId);
      const result = await approveApplication(userId, notes);
      if (result.success) {
        setNotes("");
        setExpandedId(null);
      } else {
        alert(result.error);
      }
      setActioningId(null);
    });
  };

  const handleReject = (userId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    startTransition(async () => {
      setActioningId(userId);
      const result = await rejectApplication(userId, rejectionReason);
      if (result.success) {
        setRejectionReason("");
        setExpandedId(null);
      } else {
        alert(result.error);
      }
      setActioningId(null);
    });
  };

  const getApplications = () => {
    switch (selectedTab) {
      case "approved":
        return approvedApplications;
      case "rejected":
        return rejectedApplications;
      default:
        return pendingApplications;
    }
  };

  const currentApplications = getApplications();
  const isMalamApp = (app: Application) => app.role === "MALAM";

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => {
            setSelectedTab("pending");
            setExpandedId(null);
          }}
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            selectedTab === "pending"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clock className="inline w-4 h-4 mr-2" />
          Pending ({pendingApplications.length})
        </button>
        <button
          onClick={() => {
            setSelectedTab("approved");
            setExpandedId(null);
          }}
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            selectedTab === "approved"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckCircle className="inline w-4 h-4 mr-2" />
          Approved ({approvedApplications.length})
        </button>
        <button
          onClick={() => {
            setSelectedTab("rejected");
            setExpandedId(null);
          }}
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            selectedTab === "rejected"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <XCircle className="inline w-4 h-4 mr-2" />
          Rejected ({rejectedApplications.length})
        </button>
      </div>

      {/* Applications List */}
      {currentApplications.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No {selectedTab} applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentApplications.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="text-left">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-bold text-slate-100">{app.name ?? "Unnamed Applicant"}</h3>
                      <p className="text-xs text-slate-400">
                        {app.email} • {app.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">
                      {isMalamApp(app) ? "MALAM" : "MADRASAH"}
                    </span>
                    {app.role === "MALAM" && app.madrasahName && (
                      <span className="text-[10px] text-slate-400">{app.madrasahName}</span>
                    )}
                    {app.role === "MADRASAH" && app.organizationName && (
                      <span className="text-[10px] text-slate-400">{app.organizationName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.verificationStatus === "APPROVED" && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {app.verificationStatus === "REJECTED" && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  {app.verificationStatus === "PENDING" && (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === app.id && (
                <div className="border-t border-slate-800 px-6 py-4 bg-slate-900/50 space-y-4">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="text-slate-200">{app.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="text-slate-200">{app.phone || "N/A"}</p>
                      </div>

                      {isMalamApp(app) ? (
                        <>
                          <div>
                            <p className="text-slate-500">Teaching Subjects</p>
                            <p className="text-slate-200">{app.teachingSubjects || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Experience</p>
                            <p className="text-slate-200">{app.yearsTeaching || "N/A"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500">Madrasah</p>
                            <p className="text-slate-200">{app.madrasahName || "N/A"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-slate-500">Principal</p>
                            <p className="text-slate-200">{app.principalName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Students</p>
                            <p className="text-slate-200">{app.studentCount ?? 0}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500">Location</p>
                            <p className="text-slate-200">{app.location || "N/A"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Documents</h4>
                    <div className="flex gap-2">
                      {app.letterUrl && (
                        <a
                          href={app.letterUrl}
                           target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-emerald-400 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Letter
                        </a>
                      )}
                      {app.idProofUrl && (
                        <a
                          href={app.idProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-emerald-400 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          {isMalamApp(app) ? "ID" : "Registration"}
                        </a>
                      )}
                      {!app.letterUrl && !app.idProofUrl && (
                        <p className="text-xs text-slate-500 italic">No attachments submitted.</p>
                      )}
                    </div>
                  </div>

                  {/* Action Section - Only for Pending */}
                  {selectedTab === "pending" && (
                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      {/* Verification Notes */}
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          Verification Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g., 'Called madrasah, confirmed teaching. Documents clear.'"
                          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          rows={2}
                        />
                      </div>

                      {/* Rejection Reason */}
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="e.g., 'Could not verify with madrasah. No one by that name teaches there.'"
                          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                          rows={2}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={isPending || actioningId === app.id}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                        >
                          {actioningId === app.id && isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          disabled={isPending || actioningId === app.id}
                          className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                        >
                          {actioningId === app.id && isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Notes for Approved/Rejected */}
                  {(selectedTab === "approved" || selectedTab === "rejected") && (
                    <div className="border-t border-slate-800 pt-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">Notes</p>
                          <p className="text-xs text-slate-300">
                            {app.verificationNotes || "No notes available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
