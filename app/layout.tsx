import type { Metadata } from "next";
import { Inter, Playfair_Display_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CollegeLX",
  description: "Minimal college marketplace for AISAT students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} `}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
