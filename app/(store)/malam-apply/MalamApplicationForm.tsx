// app/(store)/malam-apply/MalamApplicationForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { submitMalamApplication } from "./actions";
import { CheckCircle, XCircle, Loader2, Upload } from "lucide-react";

export default function MalamApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [idFileName, setIdFileName] = useState<string>("");
  const [letterFileName, setLetterFileName] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFeedback(null);
      const result = await submitMalamApplication(formData);

      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message || "Application submitted successfully!",
        });

        // Reset form
        const form = document.querySelector("form") as HTMLFormElement;
        form?.reset();
        setIdFileName("");
        setLetterFileName("");

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
          Become an Al-Hikmah Malam Partner
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Register as a verified teacher reseller to access wholesale pricing on Islamic books.
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
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              required
              type="text"
              name="fullName"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Mallam Ibrahim Saibu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Phone Number *
            </label>
            <input
              required
              type="tel"
              name="phone"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0551-234567"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input
            required
            type="email"
            name="email"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="mallam@example.com"
          />
        </div>

        {/* Teaching Subjects & Years */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Teaching Subjects *
            </label>
            <select
              required
              name="teachingSubjects"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select subjects...</option>
              <option value="Quran">Quran</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Arabic">Arabic</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Aqeedah">Aqeedah</option>
              <option value="Hadith">Hadith</option>
              <option value="Seerah">Seerah</option>
              <option value="Multiple">Multiple Subjects</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Years Teaching *
            </label>
            <select
              required
              name="yearsTeaching"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select experience...</option>
              <option value="Less than 1yr">Less than 1 year</option>
              <option value="1-2yrs">1-2 years</option>
              <option value="2-5yrs">2-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        {/* Madrasah Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Madrasah / School Name *
          </label>
          <input
            required
            type="text"
            name="madrasahName"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g., Dar Al-Sunnah Madrasah"
          />
        </div>

        {/* File Uploads */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Required Documents
          </h3>

          {/* National ID Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Upload National ID (JPG, PNG, or PDF) *
            </label>
            <label className="w-full">
              <input
                required
                type="file"
                name="idProof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setIdFileName(file?.name || "");
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 w-full bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    {idFileName || "Click to upload National ID"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB • JPG, PNG, or PDF</p>
                </div>
              </div>
            </label>
          </div>

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
          </div>

          <p className="text-xs text-slate-400 mt-4">
            ℹ️ Letter should be on school letterhead confirming you teach there.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          We'll review your application within 24-48 hours. You'll receive an email once verified.
        </p>
      </form>
    </div>
  );
}