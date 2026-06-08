import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "logbook — signed receipts for ai agents",
  description:
    "Tamper-proof signed action log for ai agents. Every event is ed25519-signed and hash-chained. Paid in USDC on Base via x402. Anyone can verify, free.",
  openGraph: {
    title: "logbook — signed receipts for ai agents",
    description:
      "Tamper-proof signed action log for ai agents. $0.001 USDC per event. Anyone can verify any past action, free.",
    url: "https://signedlogbook.com",
    siteName: "logbook",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "logbook — signed receipts for ai agents",
    description:
      "Tamper-proof signed action log for ai agents. $0.001 USDC per event. Anyone can verify any past action, free.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
