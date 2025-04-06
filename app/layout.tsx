"use client";
import { Inter, Playfair_Display_SC } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} `}>
        <Providers>
          <QueryClientProvider client={queryClient}>
            <main>{children}</main>
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}
