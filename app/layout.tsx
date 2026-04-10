import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aria Voice AI - Dashboard",
  description: "Business dashboard for Aria Voice AI phone receptionist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold">Aria Voice AI</h1>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/calls" className="text-sm font-medium text-gray-600 hover:text-gray-900">Calls</a>
              <a href="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
