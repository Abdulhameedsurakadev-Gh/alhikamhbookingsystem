"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return {
      success: false,
      message: "Please enter your email address.",
    };
  }

  try {
    const { error } = await resend.contacts.create({
      email: cleanEmail,
      unsubscribed: false,
    });

    if (error) {
      console.error("Resend contact creation error:", error);

      return {
        success: false,
        message: "We couldn't subscribe you right now. Please try again.",
      };
    }

    return {
      success: true,
      message: "Mubarak! You have subscribed to catalog arrival alerts.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return {
      success: false,
      message: "We couldn't subscribe you right now. Please try again.",
    };
  }
}