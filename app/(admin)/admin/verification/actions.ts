// app/(admin)/verification/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a simple temporary password
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
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Generate temporary password
    const tempPassword = generateTemporaryPassword();

    // Update user: approved + verified timestamp
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: "Abdul (Admin)",
        verificationNotes,
      },
    });

    // Send approval email with credentials
    const roleText = user.role === "MALAM" ? "Teacher Reseller" : "Institution";
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    await resend.emails.send({
      from: "noreply@alhikmahbookstore.com",
      to: user.email!,
      subject: `✅ Welcome to Al-Hikmah ${roleText} Program!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f8f8;">
          <div style="background: white; padding: 30px; border-radius: 10px; border-left: 4px solid #059669;">
            <h1 style="color: #059669; margin-top: 0;">Alhamdulillah! You're Verified 🎉</h1>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              As-salamu alaikum wa rahmatullahi wa barakatuh,
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Your application to become an Al-Hikmah <strong>${roleText}</strong> has been <strong>approved</strong>!
            </p>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #d1fae5;">
              <h3 style="color: #059669; margin-top: 0;">Your Login Details</h3>
              <p style="color: #333; margin: 8px 0;"><strong>Email:</strong> ${user.email}</p>
              <p style="color: #333; margin: 8px 0;"><strong>Temporary Password:</strong> <code style="background: white; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold;">${tempPassword}</code></p>
            </div>

            <div style="margin: 30px 0;">
              <a href="${loginUrl}" style="display: inline-block; background: #059669; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Log In Now
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Next Steps:</strong>
            </p>
            <ol style="color: #666; font-size: 14px; line-height: 1.8;">
              <li>Click the button above to log in</li>
              <li>Use your email and temporary password</li>
              <li>Change your password on first login</li>
              <li>Start browsing ${roleText === "Teacher Reseller" ? "wholesale pricing" : "institutional pricing"}</li>
            </ol>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Need Help?</strong> Reply to this email or WhatsApp Abdul at 0551-234567
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Baarak Allahu feek,<br/>
              <strong>Abdul</strong><br/>
              Al-Hikmah Islamic Bookstore
            </p>
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
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Update user: rejected
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "REJECTED",
        verificationNotes: reason || "Application rejected",
      },
    });

    // Send rejection email
    const roleText = user.role === "MALAM" ? "Teacher Reseller" : "Institution";

    await resend.emails.send({
      from: "noreply@alhikmahbookstore.com",
      to: user.email!,
      subject: "Application Status Update - Al-Hikmah Bookstore",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f8f8;">
          <div style="background: white; padding: 30px; border-radius: 10px; border-left: 4px solid #dc2626;">
            <h1 style="color: #dc2626; margin-top: 0;">Application Status</h1>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              As-salamu alaikum wa rahmatullahi wa barakatuh,
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for applying to become an Al-Hikmah <strong>${roleText}</strong>.
            </p>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca;">
              <p style="color: #991b1b; margin: 0;">
                <strong>Your application could not be verified at this time.</strong>
              </p>
              <p style="color: #7f1d1d; margin: 10px 0 0 0; font-size: 14px;">
                ${reason || "We were unable to verify the information provided."}
              </p>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.8;">
              <strong>What you can do:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; line-height: 1.8;">
              <li>Review the documents you submitted</li>
              <li>Ensure your madrasah letter is clear and on official letterhead</li>
              <li>Contact Abdul to discuss: 0551-234567</li>
            </ul>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              We'd love to work with you! Feel free to reach out to discuss next steps.
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Wassalamu alaikum,<br/>
              <strong>Abdul</strong><br/>
              Al-Hikmah Islamic Bookstore<br/>
              0551-234567
            </p>
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