// app/(store)/malam-apply/MalamApplicationForm.tsx
"use client";

import React, { useState, useTransition, useRef } from "react";
import { submitMalamApplication } from "./actions";
import { CheckCircle, XCircle, Loader2, Upload, Info } from "lucide-react";

const SUBJECT_OPTIONS = ["Quran", "Tajweed", "Arabic", "Fiqh", "Aqeedah", "Hadith", "Seerah"];

export default function MalamApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [idFileName, setIdFileName] = useState<string>("");
  const [letterFileName, setLetterFileName] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Fixed: document.querySelector("form") could grab the wrong <form> if
  // this page ever renders more than one (a search bar, for instance). A
  // ref always points to this specific form.
  const formRef = useRef<HTMLFormElement>(null);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFeedback(null);

      // Fixed: matches the schema's comment ("Quran, Tajweed, Arabic") —
      // teachingSubjects was previously a single-select, losing data for
      // anyone teaching more than one subject.
      formData.set("teachingSubjects", selectedSubjects.join(", "));

      const result = await submitMalamApplication(formData);

      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message || "Application submitted successfully!",
        });

        formRef.current?.reset();
        setIdFileName("");
        setLetterFileName("");
        setSelectedSubjects([]);

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
    <div className="bg-card p-8 rounded-md border border-border max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-heading font-bold font-serif text-foreground">
          Apply for Al-Hikmah Malam Partnership
        </h1>
        {/* Fixed: "register... to access wholesale pricing" implied
            applying grants access automatically. Reworded so it's clear
            this is an application for consideration, not activation. */}
        <p className="text-sm text-muted-foreground mt-1">
          Apply to become a verified teacher partner. Once your application is reviewed and approved, you&apos;ll gain access to partner pricing on eligible books.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-sm flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="malam-name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              required
              id="malam-name"
              type="text"
              name="fullName"
              disabled={isPending}
              className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              placeholder="e.g., Mallam Ibrahim Saibu"
            />
          </div>

          <div>
            <label htmlFor="malam-phone" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Phone Number *
            </label>
            <input
              required
              id="malam-phone"
              type="tel"
              name="phone"
              disabled={isPending}
              className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              placeholder="0551-234567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="malam-email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input
            required
            id="malam-email"
            type="email"
            name="email"
            disabled={isPending}
            className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            placeholder="mallam@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Teaching Subjects * <span className="normal-case font-normal">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <label key={subject} className="flex items-center gap-2 text-xs text-foreground bg-background border border-border rounded-sm p-2 cursor-pointer hover:border-border-hover transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    disabled={isPending}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  {subject}
                </label>
              ))}
            </div>
            {selectedSubjects.length === 0 && (
              <p className="text-[10px] text-muted-foreground mt-1.5">Select at least one subject.</p>
            )}
          </div>

          <div>
            <label htmlFor="malam-years" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Years Teaching *
            </label>
            <select
              required
              id="malam-years"
              name="yearsTeaching"
              disabled={isPending}
              className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            >
              <option value="">Select experience...</option>
              <option value="Less than 1yr">Less than 1 year</option>
              <option value="1-2yrs">1-2 years</option>
              <option value="2-5yrs">2-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="malam-madrasah" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Madrasah / School Name *
          </label>
          <input
            required
            id="malam-madrasah"
            type="text"
            name="madrasahName"
            disabled={isPending}
            className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            placeholder="e.g., Dar Al-Sunnah Madrasah"
          />
        </div>

        <div className="bg-background p-4 rounded-md border border-border space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Required Documents
          </h3>

          <div>
            <label htmlFor="malam-id" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Upload National ID (JPG, PNG, or PDF) *
            </label>
            <label className="w-full">
              <input
                required
                id="malam-id"
                type="file"
                name="idProof"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setIdFileName(file?.name || "");
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 w-full bg-card border-2 border-dashed border-border rounded-sm p-6 cursor-pointer hover:border-primary transition-colors duration-fast">
                <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {idFileName || "Click to upload National ID"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max 5MB • JPG, PNG, or PDF</p>
                </div>
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="malam-letter" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Upload Madrasah Letter (JPG, PNG, or PDF) *
            </label>
            <label className="w-full">
              <input
                required
                id="malam-letter"
                type="file"
                name="letter"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setLetterFileName(file?.name || "");
                }}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 w-full bg-card border-2 border-dashed border-border rounded-sm p-6 cursor-pointer hover:border-primary transition-colors duration-fast">
                <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {letterFileName || "Click to upload Madrasah Letter"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max 5MB • JPG, PNG, or PDF</p>
                </div>
              </div>
            </label>
          </div>

          <p className="text-xs text-muted-foreground mt-4 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            Letter should be on school letterhead confirming you teach there.
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isPending || selectedSubjects.length === 0}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-sm transition-colors duration-fast ease-standard flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>

        {/* TODO: confirm an actual email notification is wired up for this
            flow before shipping this line — a promised email that never
            sends is the same category of trust issue as any other
            overclaim in the copy. */}
        <p className="text-xs text-muted-foreground text-center">
          We&apos;ll review your application within 24-48 hours and follow up with a decision.
        </p>
      </form>
    </div>
  );
}