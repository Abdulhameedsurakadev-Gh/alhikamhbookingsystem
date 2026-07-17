import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css"; // Your Tailwind v4 entry file
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// These generate the --font-playfair and --font-inter CSS variables
// that globals.css references. Without this, those variables never
// exist anywhere in the app.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al-Hikmah Bookstore",
  description: "Authentic Islamic Books and Classical Texts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}