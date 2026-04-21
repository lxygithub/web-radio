"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import TopBar from "@/components/TopBar";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Providers>
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <main className="flex-1 ml-0 lg:ml-60 mb-20 pt-14 lg:pt-0 p-6">
            {children}
          </main>
          <Player />
        </Providers>
      </body>
    </html>
  );
}
