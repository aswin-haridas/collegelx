"use client";
import {
	LogIn,
	LogOut,
	type LucideIcon,
	MessageCircle,
	PlusCircle,
	Settings,
	ShoppingBag,
	UserCircle,
} from "lucide-react";
import Link from "next/link";
import { playfair } from "../../styles/theme";
import { colors } from "../ui/colors";

const handleLogout = (): void => {
	console.log("Logout clicked");
};

interface SidebarItemProps {
	href: string;
	icon: LucideIcon;
	title: string;
}

function SidebarItem({ href, icon: Icon, title }: SidebarItemProps) {
	return (
		<Link
			href={href}
			className={`flex items-center p-3 rounded-lg ${colors.hover.primary} ${colors.text.primary}`}
			title={title}
		>
			<Icon className="h-6 w-6 mr-3" />
			{title}
		</Link>
	);
}

function SidebarLogo() {
	return (
		<div className="mb-10 ml-3">
			<Link href="/" className="flex items-center w-full">
				<span
					className={`text-3xl font-bold ${playfair.className} ${colors.text.primary}`}
				>
					CollegeLX
				</span>
			</Link>
		</div>
	);
}

interface SidebarNavLinksProps {
	isAuthenticated: boolean;
}

function SidebarNavLinks({ isAuthenticated }: SidebarNavLinksProps) {
	return (
		<nav className="flex flex-col space-y-4">
			<SidebarItem href="/browse" icon={ShoppingBag} title="Browse Products" />

			{isAuthenticated && (
				<>
					<SidebarItem href="/sell" icon={PlusCircle} title="Add Product" />
					<SidebarItem href="/messages" icon={MessageCircle} title="Messages" />
					<SidebarItem href="/" icon={UserCircle} title="Profile" />
					<SidebarItem href="/admin" icon={Settings} title="Admin Dashboard" />
				</>
			)}
		</nav>
	);
}

interface SidebarUserActionsProps {
	isAuthenticated: boolean;
}

function SidebarUserActions({ isAuthenticated }: SidebarUserActionsProps) {
	return (
		<div className="mt-auto">
			{isAuthenticated ? (
				<button
					type="button"
					onClick={handleLogout}
					className={`flex items-center w-full p-3 rounded-lg ${colors.hover.primary} ${colors.text.primary}`}
					title="Logout"
				>
					<LogOut className="h-6 w-6 mr-3" />
					Logout
				</button>
			) : (
				<Link
					href="/login"
					className={`flex items-center justify-center w-full px-4 py-3 rounded-lg ${colors.background.primary} ${colors.text.white} hover:bg-amber-700`}
				>
					<LogIn className="h-5 w-5 mr-2" />
					Login
				</Link>
			)}
		</div>
	);
}

function Sidebar() {
	const isAuthenticated: boolean = true;
	return (
		<div
			className={`h-screen w-64 flex-shrink-0 ${colors.primary["50"]} flex flex-col p-4 border-r ${colors.border.secondary}`}
		>
			<SidebarLogo />
			<SidebarNavLinks isAuthenticated={isAuthenticated} />
			<SidebarUserActions isAuthenticated={isAuthenticated} />
		</div>
	);
}
export default Sidebar;
