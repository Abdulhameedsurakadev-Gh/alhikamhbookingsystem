import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Your Tailwind v4 entry file
import { Navbar } from "./components/navigation/Navbar";
import { Footer } from "./components/navigation/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

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
    <html>
      <body>
          {children}
          <SpeedInsights />
          <Analytics />
      </body>
    </html>
  );
}
