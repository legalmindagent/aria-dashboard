import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aria Voice AI - Dashboard",
  description: "AI-powered phone receptionist dashboard for local businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
