"use client";
import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  PlusCircle,
  MessageCircle,
  UserCircle,
  Settings,
  LogOut,
  LogIn,
  LucideIcon,
} from "lucide-react";
import { playfair } from "../styles/theme";

const handleLogout = (): void => {
  console.log("Logout clicked");
};

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  title,
}) => (
  <Link
    href={href}
    className="flex items-center p-3 rounded-lg hover:bg-amber-50 text-amber-700"
    title={title}
  >
    <Icon className="h-6 w-6 mr-3" />
    {title}
  </Link>
);

const SidebarLogo: React.FC = () => (
  <div className="mb-10 ml-3">
    <Link href="/" className="flex items-center w-full">
      <span className={`text-3xl font-bold ${playfair.className}`}>
        CollegeLX
      </span>
    </Link>
  </div>
);

interface SidebarNavLinksProps {
  isAuthenticated: boolean;
}

const SidebarNavLinks: React.FC<SidebarNavLinksProps> = ({
  isAuthenticated,
}) => (
  <nav className="flex flex-col space-y-4">
    <SidebarItem href="/browse" icon={ShoppingBag} title="Browse Products" />

    {isAuthenticated && (
      <>
        <SidebarItem href="/sell" icon={PlusCircle} title="Add Product" />
        <SidebarItem href="/messages" icon={MessageCircle} title="Messages" />
        <SidebarItem
          href="/" // Assuming this is the profile page for logged-in users
          icon={UserCircle}
          title="Profile"
        />
        <SidebarItem href="/admin" icon={Settings} title="Admin Dashboard" />
      </>
    )}
  </nav>
);

interface SidebarUserActionsProps {
  isAuthenticated: boolean;
}

const SidebarUserActions: React.FC<SidebarUserActionsProps> = ({
  isAuthenticated,
}) => (
  <div className="mt-auto">
    {isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="flex items-center w-full p-3 rounded-lg hover:bg-amber-50 text-amber-700"
        title="Logout"
      >
        <LogOut className="h-6 w-6 mr-3" />
        Logout
      </button>
    ) : (
      <Link
        href="/login"
        className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
      >
        <LogIn className="h-5 w-5 mr-2" />
        Login
      </Link>
    )}
  </div>
);

const Sidebar: React.FC = () => {
  // Replace true with actual authentication status check
  const isAuthenticated: boolean = true;

  return (
    <div className={`h-screen w-64 bg-amber-400/15 flex flex-col p-4`}>
      <SidebarLogo />
      <SidebarNavLinks isAuthenticated={isAuthenticated} />
      <SidebarUserActions isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default Sidebar;
