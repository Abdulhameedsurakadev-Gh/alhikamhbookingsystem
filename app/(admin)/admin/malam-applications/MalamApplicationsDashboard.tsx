"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VerificationStatus } from "@prisma/client";

type MalamApplication = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;

  teachingSubjects: string | null;
  yearsTeaching: string | null;
  madrasahName: string | null;
  madrasahPhone: string | null;

  idProofUrl: string | null;
  letterUrl: string | null;

  verificationStatus: VerificationStatus | null;
  verificationNotes: string | null;
  verifiedAt: Date | null;
  verifiedBy: string | null;

  createdAt: Date;
  updatedAt: Date;
};

interface MalamApplicationsDashboardProps {
  pendingApplications: MalamApplication[];
  approvedApplications: MalamApplication[];
  rejectedApplications: MalamApplication[];
}

type ApplicationTab = "pending" | "approved" | "rejected";

export default function MalamApplicationsDashboard({
  pendingApplications,
  approvedApplications,
  rejectedApplications,
}: MalamApplicationsDashboardProps) {
  const [selectedTab, setSelectedTab] =
    useState<ApplicationTab>("pending");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const applications =
    selectedTab === "pending"
      ? pendingApplications
      : selectedTab === "approved"
        ? approvedApplications
        : rejectedApplications;

  const toggleApplication = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6 overflow-x-auto">
          <TabButton
            active={selectedTab === "pending"}
            onClick={() => {
              setSelectedTab("pending");
              setExpandedId(null);
            }}
            icon={<Clock className="h-4 w-4" />}
            label="Pending"
            count={pendingApplications.length}
          />

          <TabButton
            active={selectedTab === "approved"}
            onClick={() => {
              setSelectedTab("approved");
              setExpandedId(null);
            }}
            icon={<CheckCircle className="h-4 w-4" />}
            label="Approved"
            count={approvedApplications.length}
          />

          <TabButton
            active={selectedTab === "rejected"}
            onClick={() => {
              setSelectedTab("rejected");
              setExpandedId(null);
            }}
            icon={<XCircle className="h-4 w-4" />}
            label="Rejected"
            count={rejectedApplications.length}
          />
        </div>
      </div>

      {/* Application List */}
      {applications.length === 0 ? (
        <EmptyState status={selectedTab} />
      ) : (
        <div className="space-y-3">
          {applications.map((application) => {
            const isExpanded = expandedId === application.id;

            return (
              <div
                key={application.id}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle"
              >
                {/* Application Header */}
                <button
                  type="button"
                  onClick={() => toggleApplication(application.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-semibold text-foreground">
                        {application.name || "Unnamed Applicant"}
                      </h3>

                      <StatusBadge
                        status={application.verificationStatus}
                      />
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{application.email}</span>

                      {application.phone && (
                        <span>{application.phone}</span>
                      )}

                      {application.madrasahName && (
                        <span>{application.madrasahName}</span>
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded Application Details */}
                {isExpanded && (
                  <div className="border-t border-border bg-background/50 p-5">
                    <ApplicationDetails application={application} />

                    {selectedTab === "pending" && (
                      <ReviewSection application={application} />
                    )}

                    {(selectedTab === "approved" ||
                      selectedTab === "rejected") &&
                      application.verificationNotes && (
                        <div className="mt-6 border-t border-border pt-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Verification Notes
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-foreground">
                            {application.verificationNotes}
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tab Button                                                                 */
/* -------------------------------------------------------------------------- */

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition-colors ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
        {count}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: VerificationStatus | null;
}) {
  if (status === VerificationStatus.APPROVED) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">
        <CheckCircle className="h-3 w-3" />
        Approved
      </span>
    );
  }

  if (status === VerificationStatus.REJECTED) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-semibold text-destructive">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-[10px] font-semibold text-warning">
      <Clock className="h-3 w-3" />
      Pending
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Application Details                                                        */
/* -------------------------------------------------------------------------- */

function ApplicationDetails({
  application,
}: {
  application: MalamApplication;
}) {
  return (
    <div className="space-y-6">
      {/* Applicant */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground">
          Applicant Information
        </h4>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Detail label="Full Name" value={application.name} />
          <Detail label="Email" value={application.email} />
          <Detail label="Phone" value={application.phone} />
        </div>
      </div>

      {/* Teaching Profile */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground">
          Teaching Profile
        </h4>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Detail
            label="Teaching Subjects"
            value={application.teachingSubjects}
          />

          <Detail
            label="Teaching Experience"
            value={application.yearsTeaching}
          />

          <Detail
            label="Madrasah"
            value={application.madrasahName}
          />

          <Detail
            label="Madrasah Phone"
            value={application.madrasahPhone}
          />
        </div>
      </div>

      {/* Documents */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground">
          Submitted Documents
        </h4>

        <div className="mt-3 flex flex-wrap gap-3">
          {application.idProofUrl && (
            <DocumentPlaceholder label="National ID" />
          )}

          {application.letterUrl && (
            <DocumentPlaceholder label="Madrasah Letter" />
          )}

          {!application.idProofUrl && !application.letterUrl && (
            <p className="text-sm text-muted-foreground">
              No documents were submitted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Review Section                                                             */
/* -------------------------------------------------------------------------- */

function ReviewSection({
  application,
}: {
  application: MalamApplication;
}) {
  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="rounded-md border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-sm font-semibold text-foreground">
              Application Review
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Review the applicant's information and submitted documents
              before making a verification decision.
            </p>
          </div>
        </div>

        {/* Action controls will be connected to the existing
            auditMalamApplication server action in the next step. */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled
            className="rounded-md bg-success px-4 py-2 text-sm font-semibold text-white opacity-50"
          >
            Approve
          </button>

          <button
            type="button"
            disabled
            className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Document Placeholder                                                       */
/* -------------------------------------------------------------------------- */

function DocumentPlaceholder({
  label,
}: {
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
      <FileText className="h-4 w-4" />
      {label}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail                                                                      */
/* -------------------------------------------------------------------------- */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  status,
}: {
  status: ApplicationTab;
}) {
  const labels = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  return (
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
      <p className="font-serif text-base font-semibold text-foreground">
        No {labels[status]} applications
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        There are currently no Malam applications in this category.
      </p>
    </div>
  );
}