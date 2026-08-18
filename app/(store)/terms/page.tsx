// app/(store)/terms/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { LegalPageLayout } from "../../components/legal/LegalPageLayout";
import { LegalSection } from "../../components/legal/LegalSection";
import type { LegalTocItem } from "../../components/legal/LegalTableOfContents";

export const metadata: Metadata = {
  title: "Terms & Conditions | Al-Hikmah Islamic Bookstore",
  description:
    "The rules that apply when you use Al-Hikmah and purchase products from us.",
};

const tocItems: LegalTocItem[] = [
  { id: "about-al-hikmah", label: "About Al-Hikmah" },
  { id: "website-use", label: "Website Use" },
  { id: "product-information", label: "Product Information" },
  { id: "prices", label: "Prices" },
  { id: "orders", label: "Orders" },
  { id: "payment", label: "Payment" },
  { id: "delivery-and-collection", label: "Delivery and Collection" },
  { id: "returns-and-refunds", label: "Returns and Refunds" },
  { id: "customer-accounts", label: "Customer Accounts" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "website-availability", label: "Website Availability" },
  { id: "limitation-of-responsibility", label: "Limitation of Responsibility" },
  { id: "privacy", label: "Privacy" },
  { id: "changes-to-these-terms", label: "Changes to These Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      breadcrumbLabel="Terms & Conditions"
      eyebrow="Al-Hikmah Legal & Privacy"
      title="Terms & Conditions"
      description="The rules that apply when you use Al-Hikmah and purchase products from us."
      lastUpdated="17th August, 2026"
      tocItems={tocItems}
      relatedHref="/privacy"
      relatedLabel="Privacy Policy"
    >
      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        Welcome to Al-Hikmah Islamic Bookstore ("Al-Hikmah", "we", "us", or
        "our").
      </p>

      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        These Terms and Conditions govern your use of the Al-Hikmah website and
        your purchase of products through our website or other official sales
        channels.
      </p>

      <p className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
        By using our website or placing an order, you agree to these Terms and
        Conditions. If you do not agree with these terms, please do not use the
        website.
      </p>

      <LegalSection id="about-al-hikmah" title="1. About Al-Hikmah">
        <p>
          Al-Hikmah Islamic Bookstore is a bookselling business specialising in
          Islamic books and related educational materials.
        </p>
        <p>
          The website provides information about available books and, as
          functionality is introduced, may allow customers to create accounts,
          place orders, make payments, and manage their purchases.
        </p>
      </LegalSection>

      <LegalSection id="website-use" title="2. Website Use">
        <p>You agree to use the website lawfully and responsibly.</p>
        <p>You must not:</p>
        <ul>
          <li>Use the website for unlawful purposes.</li>
          <li>
            Attempt to gain unauthorised access to accounts, systems, or
            administrative areas.
          </li>
          <li>Interfere with the operation or security of the website.</li>
          <li>Submit false or misleading information.</li>
          <li>Use the website to commit fraud or abuse.</li>
          <li>
            Copy, scrape, reproduce, or commercially exploit website content
            without permission where such use is not otherwise permitted by law.
          </li>
        </ul>
        <p>
          We may restrict or suspend access where reasonably necessary to
          protect the website, our customers, or our business.
        </p>
      </LegalSection>

      <LegalSection id="product-information" title="3. Product Information">
        <p>
          We make reasonable efforts to ensure that book titles, descriptions,
          authors, images, prices, availability, and other catalogue information
          are accurate.
        </p>
        <p>However:</p>
        <ul>
          <li>Product images may differ slightly from the physical product.</li>
          <li>Book availability may change.</li>
          <li>Prices may change.</li>
          <li>Typographical or catalogue errors may occasionally occur.</li>
          <li>
            Physical editions, publishers, bindings, or volumes may differ where
            the product description clearly identifies the relevant edition or
            format.
          </li>
        </ul>
        <p>
          Where a significant error affects an order, we will communicate with
          the customer before proceeding where reasonably possible.
        </p>
      </LegalSection>

      <LegalSection id="prices" title="4. Prices">
        <p>
          Prices displayed on the website are stated in Ghana cedis (GH₵) unless
          otherwise indicated.
        </p>
        <p>Prices may change without prior notice.</p>
        <p>
          The price applicable to an order will generally be the price presented
          to the customer at the time the order is placed, subject to obvious
          pricing errors or circumstances requiring correction.
        </p>
        <p>
          Any applicable delivery charges or other additional charges will be
          communicated before the customer completes the relevant transaction.
        </p>
      </LegalSection>

      <LegalSection id="orders" title="5. Orders">
        <p>
          Submitting an order constitutes a request to purchase the selected
          products.
        </p>
        <p>
          An order is not necessarily accepted merely because it has been
          submitted.
        </p>
        <p>We may decline or cancel an order where, for example:</p>
        <ul>
          <li>The requested product is unavailable.</li>
          <li>There is an obvious pricing or catalogue error.</li>
          <li>We reasonably suspect fraud or unauthorised activity.</li>
          <li>The order cannot be fulfilled for logistical reasons.</li>
          <li>
            A payment cannot be successfully completed where payment is
            required.
          </li>
        </ul>
        <p>
          Where an order is cancelled after payment has been received, any
          applicable refund will be handled through the relevant payment or
          refund process.
        </p>
      </LegalSection>

      <LegalSection id="payment" title="6. Payment">
        <p>
          Where online payment is available, payment may be processed through
          third-party payment providers.
        </p>
        <p>
          Customers are responsible for providing accurate payment information
          and completing any required payment verification.
        </p>
        <p>
          We may also support other payment arrangements communicated through
          our official sales channels.
        </p>
      </LegalSection>

      <LegalSection
        id="delivery-and-collection"
        title="7. Delivery and Collection"
      >
        <p>
          Delivery and collection arrangements may vary depending on the
          customer's location, product availability, and the delivery method
          selected.
        </p>
        <p>
          Any delivery fees and applicable delivery conditions will be
          communicated during the ordering process or through the relevant
          official communication channel.
        </p>
        <p>
          Delivery estimates are not guaranteed unless expressly stated
          otherwise.
        </p>
        <p>
          A customer is responsible for providing accurate contact and delivery
          information.
        </p>
      </LegalSection>

      <LegalSection
        id="returns-and-refunds"
        title="8. Returns, Refunds, and Damaged Products"
      >
        <p>
          Our return and refund procedures will depend on the nature of the
          issue, including whether a product is defective, damaged, incorrect,
          or otherwise eligible for return.
        </p>
        <p>
          If you receive an incorrect or materially damaged product, contact
          Al-Hikmah as soon as reasonably possible with details of the issue.
        </p>
        <p>
          Any applicable refund or replacement will be handled according to
          Al-Hikmah's return and refund policy and applicable law.
        </p>
        <p className="font-medium text-foreground">
          Specific return/refund rules should be added here once Al-Hikmah's
          operational policy has been finalised.
        </p>
      </LegalSection>

      <LegalSection id="customer-accounts" title="9. Customer Accounts">
        <p>Where account registration is available, you are responsible for:</p>
        <ul>
          <li>Providing accurate information.</li>
          <li>Keeping your login credentials confidential.</li>
          <li>Not allowing unauthorised persons to use your account.</li>
          <li>Informing us if you suspect unauthorised account activity.</li>
        </ul>
        <p>
          You remain responsible for activity conducted through your account
          where you have failed to take reasonable steps to protect your
          credentials.
        </p>
      </LegalSection>

      <LegalSection
        id="intellectual-property"
        title="10. Intellectual Property"
      >
        <p>
          Unless otherwise stated, the Al-Hikmah website and its original
          content, including its branding, layout, graphics, text, and software,
          are owned by or licensed to Al-Hikmah.
        </p>
        <p>You may access and use the website for its intended purpose.</p>
        <p>
          You may not reproduce, modify, distribute, sell, or commercially
          exploit Al-Hikmah's protected content without appropriate permission,
          except where such use is permitted by law.
        </p>
        <p>
          Book titles, author names, publisher information, and other
          third-party intellectual property remain the property of their
          respective owners.
        </p>
      </LegalSection>

      <LegalSection id="third-party-services" title="11. Third-Party Services">
        <p>
          The website may rely on third-party services such as payment
          processors, hosting providers, communication platforms, analytics
          services, delivery providers, or authentication services.
        </p>
        <p>Those services may have their own terms and privacy policies.</p>
        <p>
          Al-Hikmah is not responsible for matters exclusively controlled by
          those third-party providers.
        </p>
      </LegalSection>

      <LegalSection id="website-availability" title="12. Website Availability">
        <p>
          We aim to keep the website available and functional, but we do not
          guarantee uninterrupted or error-free operation.
        </p>
        <p>The website may occasionally be unavailable because of:</p>
        <ul>
          <li>Maintenance.</li>
          <li>Software updates.</li>
          <li>Hosting or network problems.</li>
          <li>Security incidents.</li>
          <li>Third-party service interruptions.</li>
          <li>Circumstances beyond our reasonable control.</li>
        </ul>
      </LegalSection>

      <LegalSection
        id="limitation-of-responsibility"
        title="13. Limitation of Responsibility"
      >
        <p>
          To the extent permitted by applicable law, Al-Hikmah will not be
          responsible for losses arising solely from circumstances outside our
          reasonable control or from a customer's misuse of the website.
        </p>
        <p>
          Nothing in these Terms is intended to exclude or limit any legal right
          or protection that cannot lawfully be excluded or limited.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="14. Privacy">
        <p>
          Your use of the website is also subject to our{" "}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Privacy Policy
          </Link>
          , which explains how Al-Hikmah collects, uses, protects, and handles
          personal information.
        </p>
      </LegalSection>

      <LegalSection
        id="changes-to-these-terms"
        title="15. Changes to These Terms"
      >
        <p>
          We may update these Terms and Conditions as the business, website,
          services, or applicable legal requirements change.
        </p>
        <p>
          Updated terms will be published on this page with a revised "Last
          updated" date.
        </p>
        <p>
          Your continued use of the website after updated terms are published
          constitutes acceptance of the revised terms to the extent permitted by
          applicable law.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="16. Governing Law">
        <p>
          These Terms and Conditions are governed by the laws of the Republic of
          Ghana.
        </p>
        <p>
          Any dispute arising from the use of the website or purchase of
          products will be handled in accordance with applicable Ghanaian law.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="17. Contact">
        <p>
          For questions about these Terms and Conditions, orders, products, or
          customer support, contact:
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
    </LegalPageLayout>
  );
}
