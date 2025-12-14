import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sist | Generate, Deploy, Preview AI Agents",
  description:
    "Agent Deployment Playground - Create AI agents instantly, deploy to multiple runtimes, and preview their live behavior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${GeistSans.className} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
