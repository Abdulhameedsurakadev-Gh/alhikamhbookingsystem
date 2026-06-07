import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🛡️ v1.0.5 SERVER EXCLUSION LAYER: Prevents Webpack from crawling internal Kysely adapter dependencies
  serverExternalPackages: ["better-auth"],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'octlrqnttziiatgdehmr.supabase.co', // Clean domain extracted from your project ID
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
