// app/(store)/madrasah-apply/MadrasahApplicationForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { submitMadrasahApplication } from "./actions";
import { CheckCircle, XCircle, Loader2, Upload } from "lucide-react";

export default function MadrasahApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [letterFileName, setLetterFileName] = useState<string>("");
  const [registrationFileName, setRegistrationFileName] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFeedback(null);
      const result = await submitMadrasahApplication(formData);

      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message || "Application submitted successfully!",
        });

        // ✅ FIXED ARCHITECTURE: Protect native window document access with an explicit client execution guard
        if (typeof window !== "undefined") {
          const form = document.querySelector("form") as HTMLFormElement;
          form?.reset();
        }
        
        setLetterFileName("");
        setRegistrationFileName("");

        // Clear feedback after 5 seconds
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Failed to submit application",
        });
      }
    });
  }

  return (
    <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Al-Hikmah School Partnership Program
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Register your madrasah to access bulk Islamic book purchases with institutional pricing.
        </p>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* School Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            School/Madrasah Name *
          </label>
          <input
            required
            type="text"
            name="organizationName"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g., Al-Nur Islamic Academy"
          />
        </div>

        {/* Principal Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Principal / Director Name *
            </label>
            <input
              required
              type="text"
              name="principalName"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Sheikh Abdurahman"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              School Phone Number *
            </label>
            <input
              required
              type="tel"
              name="phone"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0501-999888"
            />
          </div>
        </div>

        {/* Email & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Contact Email *
            </label>
            <input
              required
              type="email"
              name="email"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="school@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Location *
            </label>
            <select
              required
              name="location"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="">Select location...</option>
              <option value="Accra">Accra</option>
              <option value="Kasoa">Kasoa</option>
              <option value="Other">Other (Ghana)</option>
            </select>
          </div>
        </div>

        {/* Student Count */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Approximate Number of Students *
          </label>
          <input
            required
            type="number"
            min="1"
            name="studentCount"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g., 120"
          />
        </div>

        {/* File Uploads */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Required & Optional Documents
          </h3>

          {/* Madrasah Letter Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Upload Madrasah Letter (JPG, PNG, or PDF) *
            </label>
            <label className="w-full">
              <input
                required
                type="file"
                name="letter"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setLetterFileName(file?.name || "");
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 w-full bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    {letterFileName || "Click to upload Madrasah Letter"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB • JPG, PNG, or PDF</p>
                </div>
              </div>
            </label>
            <p className="text-xs text-slate-400 mt-2">
              Letter should be on school letterhead signed by the principal/director.
            </p>
          </div>

          {/* School Registration Upload (Optional) - ✅ RESTORED & COMPLETED FROM CUTOFF */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              School Registration Certificate / Business ID (Optional)
            </label>
            <label className="w-full">
              <input
                type="file"
                name="idProof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setRegistrationFileName(file?.name || "");
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 w-full bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    {registrationFileName || "Click to upload Certificate"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB • JPG, PNG, or PDF</p>
                </div>
              </div>
            </label>
          </div>
        </div>

               {/* Submit Actions */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer shadow-md"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Application...
            </>
          ) : (
            "Submit Institutional Application"
          )}
        </button>
      </form>
    </div>
  );
}
