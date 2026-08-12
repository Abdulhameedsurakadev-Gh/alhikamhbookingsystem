import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🛡️ v1.0.5 SERVER EXCLUSION LAYER: Prevents Webpack from crawling internal Kysely adapter dependencies
  serverExternalPackages: ["better-auth"],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'octlrqnttziiatgdehmr.supabase.co', // Clean domain extracted from your project ID
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 🚀 v2.0 B2B INJECTION: Overrides default 1MB Server Action boundary constraints
  // Allows institutional applicant uploads to pass smoothly up to 10MB
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
