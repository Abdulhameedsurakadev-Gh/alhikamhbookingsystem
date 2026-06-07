// app/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"; // 🌟 FIXED: Client-side plugin hook

export const authClient = createAuthClient({
  cookiePrefix: "alhikmah", 
  
  // Synchronizes your data objects so 'data.user.role' compiles perfectly in your UI forms
  plugins: [
    adminClient()
  ]
});
