// app/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins"; // 🌟 FIXED: Pulls server-side types automatically
import type { auth } from "./auth"; // Import your backend auth module instance type configuration

export const authClient = createAuthClient({
  cookiePrefix: "alhikmah",
  
  // 🛡️ Automatically extends frontend user object typing boundaries to match data parameters
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});
