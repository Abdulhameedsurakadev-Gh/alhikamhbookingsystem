import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create inquiry in database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        category: category || "general",
        message,
        status: "new",
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Inquiry submitted successfully",
        inquiryId: inquiry.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
