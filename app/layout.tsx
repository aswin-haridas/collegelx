import type { Metadata } from "next";

import "./globals.css";
import type { ReactNode } from "react";
import { Sidebar } from "@/components";
import { inter } from "@/styles/fonts";

export const metadata: Metadata = {
	title: "CollegeLX",
	description: "Minimal college marketplace for students",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} flex h-screen`}>
				<Sidebar />
				<div className="flex-1 bg-amber-400/10 overflow-auto">
					<main className="rounded-xl m-2 w-full p-8 bg-amber-600/5 min-h-full">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
