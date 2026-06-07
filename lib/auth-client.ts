// app/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // The client automatically hooks into /api/auth paths natively
  // We mirror your configuration prefix here for security context consistency
  cookiePrefix: "alhikmah", 
});
