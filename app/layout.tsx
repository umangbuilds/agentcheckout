/* Root layout — metadata + font setup for AgentCheckout */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
  description:
    "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
  openGraph: {
    title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
    description:
      "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
    description:
      "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
