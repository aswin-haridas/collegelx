"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { styles } from "@/shared/lib/styles";
import { playfair } from "@/shared/lib/fonts";
import { supabase } from "@/shared/lib/supabase";

const Header = () => {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated && userId) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

          if (error) throw error;
          setIsAdmin(data?.role === "admin");
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, userId]);

  const handleLogout = () => {
    // Clear the user session
    sessionStorage.clear();
    // Redirect to home page
    router.push("/auth/login");
    // Refresh the page to update auth state
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center space-x-4">
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
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                    title="Admin Dashboard"
                  >
                    <Settings className="h-6 w-6" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
