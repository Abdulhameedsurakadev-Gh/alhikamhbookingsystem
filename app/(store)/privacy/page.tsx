// app/(store)/privacy/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { LegalPageLayout } from "../../components/legal/LegalPageLayout";
import { LegalSection } from "../../components/legal/LegalSection";
import type { LegalTocItem } from "../../components/legal/LegalTableOfContents";

export const metadata: Metadata = {
  title: "Privacy Policy | Al-Hikmah Islamic Bookstore",
  description:
    "How Al-Hikmah Islamic Bookstore collects, uses, and protects your information.",
};

const tocItems: LegalTocItem[] = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-your-information", label: "How We Use Your Information" },
  { id: "orders-and-payments", label: "Orders and Payments" },
  { id: "whatsapp-and-other-communications", label: "WhatsApp and Other Communications" },
  { id: "sharing-personal-information", label: "Sharing Personal Information" },
  { id: "data-security", label: "Data Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "cookies", label: "Cookies" },
  { id: "your-privacy-rights", label: "Your Privacy Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "third-party-websites", label: "Third-Party Websites" },
  { id: "changes-to-this-policy", label: "Changes to This Policy" },
  { id: "contact-us", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      breadcrumbLabel="Privacy Policy"
      eyebrow="Al-Hikmah Legal & Privacy"
      title="Privacy Policy"
      description="How Al-Hikmah collects, uses, and protects information when you use our website and services."
      lastUpdated="17th August, 2026"
      tocItems={tocItems}
      relatedHref="/terms"
      relatedLabel="Terms & Conditions"
    >
      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        Al-Hikmah Islamic Bookstore ("Al-Hikmah", "we", "us", or "our")
        respects your privacy and is committed to protecting the personal
        information you provide when you use our website, purchase our
        books, contact us, or otherwise interact with our business.
      </p>

      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        This Privacy Policy explains what information we may collect, why we
        collect it, how we use it, when we may share it, and some of the
        rights available to you.
      </p>

      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        Al-Hikmah operates in Ghana and intends to handle personal
        information in accordance with applicable Ghanaian data-protection
        requirements, including the Data Protection Act, 2012 (Act 843).
      </p>

      <LegalSection id="information-we-collect" title="1. Information We Collect">
        <p>
          Depending on how you interact with Al-Hikmah, we may collect
          information such as:
        </p>
        <ul>
          <li>Your name.</li>
          <li>Email address.</li>
          <li>Telephone or WhatsApp number.</li>
          <li>Delivery or collection information.</li>
          <li>Account login information.</li>
          <li>Order and purchase history.</li>
          <li>Books you request or enquire about.</li>
          <li>Information you provide when contacting us.</li>
          <li>Information necessary to process or fulfil an order.</li>
          <li>
            Technical information associated with your use of our website,
            such as browser, device, and basic website activity information.
          </li>
        </ul>
        <p>
          We only seek to collect information that is reasonably relevant to
          the service or transaction involved.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-your-information" title="2. How We Use Your Information">
        <p>We may use your information to:</p>
        <ul>
          <li>Create and maintain your customer account.</li>
          <li>Process and fulfil orders.</li>
          <li>Communicate with you about your orders.</li>
          <li>Arrange delivery or collection.</li>
          <li>Respond to questions, enquiries, and customer-support requests.</li>
          <li>Maintain accurate business and transaction records.</li>
          <li>Improve our website, catalogue, and services.</li>
          <li>Detect, prevent, or investigate fraudulent or unauthorised activity.</li>
          <li>Comply with applicable legal or regulatory obligations.</li>
          <li>Send promotional or business communications where permitted and appropriate.</li>
        </ul>
        <p>
          We will not use your personal information for purposes unrelated
          to the reason it was collected unless permitted by applicable law
          or otherwise explained to you.
        </p>
      </LegalSection>

      <LegalSection id="orders-and-payments" title="3. Orders and Payments">
        <p>
          When you place an order, we may need to collect information
          required to identify you, communicate with you, and fulfil the
          transaction.
        </p>
        <p>
          Payments may be processed through third-party payment providers or
          other payment arrangements. Where a third party processes payment
          information, that provider's own terms and privacy practices may
          also apply.
        </p>
        <p>
          Al-Hikmah does not need to store complete payment-card credentials
          merely to maintain your customer account.
        </p>
      </LegalSection>

      <LegalSection id="whatsapp-and-other-communications" title="4. WhatsApp and Other Communications">
        <p>
          Al-Hikmah may communicate with customers through WhatsApp,
          telephone, email, or other communication channels.
        </p>
        <p>
          If you voluntarily contact us through WhatsApp or another
          platform, information shared through that platform may also be
          subject to the platform provider's own privacy practices.
        </p>
        <p>
          We may use information from these conversations to respond to
          your enquiry, process an order, provide customer support, or
          maintain appropriate business records.
        </p>
      </LegalSection>

      <LegalSection id="sharing-personal-information" title="5. Sharing Personal Information">
        <p>We do not sell your personal information.</p>
        <p>We may share limited information where reasonably necessary to:</p>
        <ul>
          <li>Fulfil an order.</li>
          <li>Arrange delivery.</li>
          <li>Process a payment.</li>
          <li>Provide a technical or hosting service.</li>
          <li>Protect the security of our website or business.</li>
          <li>Comply with a legal obligation.</li>
          <li>Respond to a lawful request from a competent authority.</li>
          <li>
            Protect the rights, property, or safety of Al-Hikmah, our
            customers, or others.
          </li>
        </ul>
        <p>
          Where third-party service providers process personal information
          on our behalf, we expect them to handle that information
          appropriately and only for the purposes for which it was provided.
        </p>
      </LegalSection>

      <LegalSection id="data-security" title="6. Data Security">
        <p>
          We take reasonable technical and organisational measures to
          protect personal information against unauthorised access, loss,
          misuse, alteration, or disclosure.
        </p>
        <p>
          However, no internet-based system can be guaranteed to be
          completely secure. You should therefore avoid sending sensitive
          information through channels that are not intended for it.
        </p>
      </LegalSection>

      <LegalSection id="data-retention" title="7. Data Retention">
        <p>
          We retain personal information only for as long as reasonably
          necessary for the purpose for which it was collected, including
          legitimate business, accounting, legal, security, and
          dispute-resolution requirements.
        </p>
        <p>
          When information is no longer required, we may delete it, securely
          dispose of it, or anonymise it where appropriate.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="8. Cookies and Website Technologies">
        <p>
          Our website may use cookies or similar technologies to maintain
          sessions, remember preferences, support account functionality,
          improve website performance, and understand how the website is
          used.
        </p>
        <p>
          You may be able to control cookies through your browser settings.
          Disabling certain cookies may affect some website functionality.
        </p>
      </LegalSection>

      <LegalSection id="your-privacy-rights" title="9. Your Privacy Rights">
        <p>
          Subject to applicable law, you may have rights relating to your
          personal information, including rights to:
        </p>
        <ul>
          <li>Know how your information is being processed.</li>
          <li>Request access to personal information we hold about you.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Object to certain processing.</li>
          <li>Request that certain processing be stopped where applicable.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>Raise a concern about how your information is handled.</li>
        </ul>
        <p>
          Ghana's Data Protection Commission recognises data-subject rights
          including rights of access, objection, prevention of processing,
          and information under the Data Protection Act 2012.
        </p>
        <p>
          To exercise a privacy-related right or ask a question about your
          information, contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection id="childrens-privacy" title="10. Children's Privacy">
        <p>
          Our website is intended for general customers and is not
          specifically directed at children.
        </p>
        <p>
          We do not knowingly seek to collect unnecessary personal
          information from children.
        </p>
      </LegalSection>

      <LegalSection id="third-party-websites" title="11. Third-Party Websites">
        <p>
          Our website may contain links to third-party websites, services,
          or platforms.
        </p>
        <p>
          We are not responsible for the privacy practices of third-party
          websites. We encourage you to review their privacy policies before
          providing personal information to them.
        </p>
      </LegalSection>

      <LegalSection id="changes-to-this-policy" title="12. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy when our business, website,
          services, or legal obligations change.
        </p>
        <p>
          When we make significant changes, we will update the "Last
          updated" date on this page and, where appropriate, provide
          additional notice.
        </p>
      </LegalSection>

      <LegalSection id="contact-us" title="13. Contact Us">
        <p>
          If you have questions about this Privacy Policy, want to exercise
          a privacy right, or have a concern about how your information is
          handled, please contact:
        </p>

        <div className="!mt-6 grid gap-6 rounded-md border border-border p-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <p className="font-sans text-[11px] font-medium uppercase tracking-wider">
                Email
              </p>
            </div>
            <p className="mt-2 font-sans text-sm text-foreground">
              alhikmahbookstore93@gmail.com
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <p className="font-sans text-[11px] font-medium uppercase tracking-wider">
                WhatsApp
              </p>
            </div>
            <p className="mt-2 font-sans text-sm text-foreground">
              +233 20 213 1864
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <p className="font-sans text-[11px] font-medium uppercase tracking-wider">
                Business location
              </p>
            </div>
            <p className="mt-2 font-sans text-sm text-foreground">
              Kasoa, Ghana
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="!mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors duration-fast hover:bg-primary/90"
        >
          Contact Al-Hikmah
        </Link>
      </LegalSection>

      <p className="!mt-10 border-t border-border pt-6 font-sans text-xs italic leading-6 text-muted-foreground">
        This Privacy Policy is intended to explain Al-Hikmah's current
        data-handling practices. It should be reviewed and updated as the
        website's actual data flows, third-party services, payment
        providers, analytics, and account features are finalised.
      </p>
    </LegalPageLayout>
  );
}