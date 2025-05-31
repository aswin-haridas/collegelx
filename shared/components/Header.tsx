"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";
import { playfair, styles } from "@/shared/styles/theme";

const Header = () => {
  const handleLogout = () => {
    localStorage.clear();
    redirect("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <Link href="/browse" className="flex items-center">
              <span
                className={`text-xl font-bold ${playfair.className}`}
                style={{ color: styles.primary_dark }}
              >
                CollegeLX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              href="/browse"
              className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
              title="Browse Products"
            >
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <>
              <Link
                href="/sell"
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                title="Add Product"
              >
                <PlusCircle className="h-6 w-6" />
              </Link>
              <Link
                href="/"
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                title="Profile"
              >
                <UserCircle className="h-6 w-6" />
              </Link>
              <Link
                href="/admin"
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                title="Admin Dashboard"
              >
                <Settings className="h-6 w-6" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </>
            <Link
              href="/login"
              className="flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              <LogIn className="h-5 w-5 mr-1" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
