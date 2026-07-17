// app/(admin)/verification/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generates a temporary 12-character alphanumeric code for the student or reseller.
 */
function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function approveApplication(userId: string, verificationNotes: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const tempPassword = generateTemporaryPassword();

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: "Abdul (Admin)",
        verificationNotes,
      },
    });

    const roleText = user.role === "MALAM" ? "Teacher Reseller" : "Institution";
    const pricingText = user.role === "MALAM" ? "wholesale pricing" : "institutional catalog pricing";
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    // 🎨 Upgraded Email Template: Translating Design System v1.0 into raw HTML/Inline Styles
    await resend.emails.send({
      from: "alhikmhbookstore93@gmail.com",
      to: user.email!,
      subject: `✅ Application Approved — Al-Hikmah ${roleText} Program`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px; background-color: #F7F4F0; color: #261E1A;">
          <div style="background-color: #F3EFE9; padding: 40px; border-radius: 4px; border: 1px solid #DDD8D1; border-top: 4px solid #6B3522;">
            
            <p style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #261E1A; margin-top: 0; margin-bottom: 24px;">
              Al-Hikmah Islamic Bookstore
            </p>
            
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
              As-salamu alaikum wa rahmatullahi wa barakatuh,
            </p>

            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              We are pleased to inform you that your application to become verified as an Al-Hikmah <strong>${roleText}</strong> has been carefully reviewed and <strong>approved</strong>.
            </p>

            <!-- Credential Box Layer using Canvas/Muted Contrast Rules -->
            <div style="background-color: #F7F4F0; padding: 24px; border-radius: 4px; margin: 24px 0; border: 1px solid #DDD8D1;">
              <h3 style="font-family: Georgia, serif; color: #6B3522; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">Your Access Credentials</h3>
              <p style="font-size: 14px; margin: 8px 0; color: #261E1A;"><strong>Registered Email:</strong> ${user.email}</p>
              <p style="font-size: 14px; margin: 8px 0; color: #261E1A;"><strong>Temporary Password:</strong> <code style="background-color: #F3EFE9; padding: 4px 8px; border: 1px solid #DDD8D1; border-radius: 2px; font-family: monospace; font-weight: bold; color: #6B3522;">${tempPassword}</code></p>
            </div>

            <!-- Restrained Primary Button Call-to-action (Deep Clay) -->
            <div style="margin: 32px 0; text-align: left;">
              <a href="${loginUrl}" style="display: inline-block; background-color: #6B3522; color: #F7F4F0; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 14px; tracking-edge: 0.05em;">
                Log In to Your Account
              </a>
            </div>

            <p style="color: #261E1A; font-size: 14px; font-weight: 600; margin-top: 32px; margin-bottom: 12px;">
              Next Steps for Learning & Sourcing:
            </p>
            <ol style="color: #7D7570; font-size: 14px; line-height: 1.8; margin-top: 0; padding-left: 20px;">
              <li>Click the link above to reach the storefront portal</li>
              <li>Authenticate your login using your temporary credentials</li>
              <li>Update and personalize your account security password immediately</li>
              <li>Begin browsing available volumes with active ${pricingText} applied</li>
            </ol>

            <p style="color: #7D7570; font-size: 13px; margin-top: 32px; line-height: 1.5;">
              <strong>Need Assistance?</strong> Reply directly to this transmission or message our desk via WhatsApp at <strong>+233 20 213 1864</strong>.
            </p>

            <div style="color: #7D7570; font-size: 13px; margin-top: 32px; border-top: 1px solid #DDD8D1; padding-top: 24px; line-height: 1.5;">
              Baarak Allahu feekum,<br/><br/>
              <strong>Abdul</strong><br/>
              <span style="font-size: 11px; text-transform: uppercase; tracking-wider: 0.1em; color: #7D7570;">Al-Hikmah Sourcing & Verification Desk</span>
            </div>
          </div>
        </div>
      `,
    });

    revalidatePath("/admin/verification");

    return {
      success: true,
      message: `${user.name} approved! Credentials sent to ${user.email}`,
    };
  } catch (error: any) {
    console.error("Approval error:", error);
    return {
      success: false,
      error: error.message || "Failed to approve application",
    };
  }
}

export async function rejectApplication(userId: string, reason: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "REJECTED",
        verificationNotes: reason || "Application rejected",
      },
    });

    const roleText = user.role === "MALAM" ? "Teacher Reseller" : "Institution";

    // 🎨 Upgraded Email Template: Swapping out raw Red alerts for disciplined semantic error profiles
    await resend.emails.send({
      from: "alhikmhbookstore93@gmail.com",
      to: user.email!,
      subject: "Application Update — Al-Hikmah Islamic Bookstore",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px; background-color: #F7F4F0; color: #261E1A;">
          <div style="background-color: #F3EFE9; padding: 40px; border-radius: 4px; border: 1px solid #DDD8D1; border-top: 4px solid #9C2E26;">
            
            <p style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #261E1A; margin-top: 0; margin-bottom: 24px;">
              Al-Hikmah Islamic Bookstore
            </p>
            
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
              As-salamu alaikum wa rahmatullahi wa barakatuh,
            </p>

            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              Thank you for your interest in registering for the Al-Hikmah <strong>${roleText}</strong> program.
            </p>

            <!-- Muted, print-style error block avoiding toxic notification tones -->
            <div style="background-color: #F7F4F0; padding: 24px; border-radius: 4px; margin: 24px 0; border: 1px solid #DDD8D1;">
              <p style="color: #9C2E26; font-size: 14px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">
                Application Status Update
              </p>
              <p style="color: #261E1A; margin: 0; font-size: 14px; line-height: 1.6;">
                ${reason || "We were unable to fully verify the structural credentials provided at this stage."}
              </p>
            </div>

            <p style="color: #261E1A; font-size: 14px; font-weight: 600; margin-top: 32px; margin-bottom: 12px;">
              Recommended Verification Steps:
            </p>
            <ul style="color: #7D7570; font-size: 14px; line-height: 1.8; margin-top: 0; padding-left: 20px;">
              <li>Verify that all submitted validation documentation is fully legible.</li>
              <li>Ensure madrasah clearance letters utilize official, stamped institution letterheads.</li>
              <li>Coordinate directly with our administrative desk to reconcile errors.</li>
            </ul>

            <p style="color: #7D7570; font-size: 14px; margin-top: 32px; line-height: 1.6;">
              We look forward to facilitating your curriculum access. Please do not hesitate to contact our verification desk to resolve individual submission data errors.
            </p>

            <div style="color: #7D7570; font-size: 13px; margin-top: 32px; border-top: 1px solid #DDD8D1; padding-top: 24px; line-height: 1.5;">
              Wassalamu alaikum,<br/><br/>
              <strong>Abdul</strong><br/>
              <span style="font-size: 11px; text-transform: uppercase; tracking-wider: 0.1em; color: #7D7570;">Al-Hikmah Sourcing & Verification Desk</span><br/>
              <span style="color: #261E1A; font-weight: 500;">+233 20 213 1864</span>
            </div>
          </div>
        </div>
      `,
    });

        revalidatePath("/admin/verification");

    return {
      success: true,
      message: `${user.name} rejected. Email sent to ${user.email}`,
    };
  } catch (error: any) {
    console.error("Rejection error:", error);
    return {
      success: false,
      error: error.message || "Failed to reject application",
    };
  }
}

