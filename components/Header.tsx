"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";

const Header = () => {
  const { isAuthenticated, userId, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span
                className={`text-xl font-bold ${playfair.className}`}
                style={{ color: styles.warmPrimaryDark }}
              >
                CollegeLX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/products"
              className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
              title="Browse Products"
            >
              <ShoppingBag className="h-6 w-6" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/sell"
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                  title="Add Product"
                >
                  <PlusCircle className="h-6 w-6" />
                </Link>
                <Link
                  href="/messages"
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                  title="Messages"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <Link
                  href="/profile"
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                  title="Profile"
                >
                  <UserCircle className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/sell"
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Product
                  </div>
                </Link>
                <Link
                  href="/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Messages
                  </div>
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <UserCircle className="h-5 w-5 mr-2" />
                    Profile
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Login / Sign Up
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
