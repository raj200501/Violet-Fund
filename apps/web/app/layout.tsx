import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

export const metadata = {
  title: "VioletFund",
  description: "Verified funding copilot for female founders."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen font-[var(--vf-font-family)]">{children}</body>
    </html>
  );
}
