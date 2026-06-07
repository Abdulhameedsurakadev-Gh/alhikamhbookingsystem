// app/api/auth/[...all]/route.ts
import { auth } from "../../../../lib/auth"; // Ensure this matches your relative path to lib/auth.ts
import { NextRequest } from "next/server";

// 🛡️ MANUAL WRAPPER: Guarantees Next.js always receives an executable function block,
// bypassing the object apply error completely when running external packages.
export async function GET(request: NextRequest) {
  return await auth.handler(request);
}

export async function POST(request: NextRequest) {
  return await auth.handler(request);
}
