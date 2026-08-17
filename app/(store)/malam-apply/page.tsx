// app/(store)/malam-apply/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FileText, Clock, Percent, HelpCircle } from "lucide-react";
import MalamApplicationForm from "./MalamApplicationForm";

export const metadata = {
  title: "Become a Malam Partner | Al-Hikmah Bookstore",
  description:
    "Apply to become a verified teacher partner for eligibility toward Al-Hikmah's partner pricing.",
};

export default async function MalamApplyPage() {
  // Fixed: the form action already requires a session (to avoid creating
  // an unusable "ghost" account with no login credentials). Without this
  // check, an unauthenticated visitor could fill the whole form and
  // upload both documents before discovering they needed to log in first.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login?redirect=malam-apply");
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <nav
          aria-label="Breadcrumb"
          className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-8"
        >
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-fast"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Become a Malam</span>
        </nav>

        <MalamApplicationForm />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-md p-6">
            <FileText className="text-primary h-6 w-6 mb-2" aria-hidden="true" />
            <h3 className="font-bold text-foreground mb-2">
              Simple Application
            </h3>
            <p className="text-xs text-muted-foreground">
              Quick application with document verification. It should only
              take a few minutes to complete.
            </p>
          </div>

          <div className="bg-card border border-border rounded-md p-6">
            <Clock className="text-primary h-6 w-6 mb-2" aria-hidden="true" />
            <h3 className="font-bold text-foreground mb-2">
              Fast Verification
            </h3>
            <p className="text-xs text-muted-foreground">
              Your application will be reviewed within 24–48 hours and you
              will receive a decision.
            </p>
          </div>

          <div className="bg-card border border-border rounded-md p-6">
            <Percent className="text-primary h-6 w-6 mb-2" aria-hidden="true" />
            <h3 className="font-bold text-foreground mb-2">
              Partner Pricing
            </h3>
            <p className="text-xs text-muted-foreground">
              Approved Malam partners can access special pricing on eligible
              books according to the bookstore&apos;s pricing rules.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-card border border-border rounded-md p-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What is the madrasah letter?
              </h3>
              <p className="text-sm text-muted-foreground">
                A letter from your madrasah on their letterhead confirming
                that you teach there. It should be signed by the appropriate
                school or madrasah authority.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Can I resell to students?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. Approved partners can purchase eligible books at the
                applicable partner price and resell them to students,
                madrasah members, or others.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Do I need a minimum order?
              </h3>
              <p className="text-sm text-muted-foreground">
                There is currently no minimum order specified for the
                application itself. Pricing eligibility is handled by the
                bookstore&apos;s pricing rules.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What happens after I apply?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your application and supporting documents are submitted for
                review. Your account remains pending until the application is
                approved or rejected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}