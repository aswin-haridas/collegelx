import type { Metadata } from "next";

import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { inter } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "CollegeLX",
  description: "Minimal college marketplace for AISAT students",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
        <Sidebar />
        <main className="rounded-lg">{children}</main>
      </body>
    </html>
  );
}
