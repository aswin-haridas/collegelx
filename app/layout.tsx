import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "College Marketplace",
	description: "A marketplace for college students to buy and sell items",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="min-h-screen bg-beige-50">
					<Navigation />
					<div className="container mx-auto px-4 py-8">{children}</div>
				</main>
			</body>
		</html>
	);
}
