"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  User,
  LogOut,
  MessageCircle,
  ClockAlert,
} from "lucide-react";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";

interface NavItemType {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const NavItem = ({
  item,
  isActive,
}: {
  item: NavItemType;
  isActive: boolean;
}) => {
  return (
    <li key={item.name}>
      <Link
        href={item.href}
        className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ${
          isActive ? "bg-opacity-10 font-medium" : ""
        }`}
        style={{
          color: isActive ? styles.warmBorder : styles.warmText,
          backgroundColor: isActive ? styles.warmPrimary : "transparent",
          opacity: isActive ? 1 : 0.8,
        }}
        onMouseOver={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "rgba(184, 110, 84, 0.1)";
          }
        }}
        onMouseOut={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <span
          className="mr-3"
          style={{
            color: isActive ? styles.warmBorder : styles.warmText,
          }}
        >
          {item.icon}
        </span>
        {item.name}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userRole, setUserRole] = useState<string>("user");
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItemType[] = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Sell", href: "/sell", icon: <ShoppingBag size={18} /> },
    { name: "Messages", href: "/chat", icon: <MessageCircle size={18} /> },
    { name: "Profile", href: "/profile", icon: <User size={18} /> },
  ];

  const adminItems: NavItemType[] = [
    { name: "Pending Request", href: "/", icon: <ClockAlert size={18} /> },
  ];

  // Public pages that don't require authentication
  const publicPages = ["/", "/auth/login", "/auth/register"];

  useEffect(() => {
    // Safely access localStorage after component mounts
    setUserRole(localStorage.getItem("userRole") || "user");
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        setIsAuthChecking(true);
        const isAuthenticated = localStorage.getItem("auth") === "true";

        if (isAuthenticated) {
          setUserName(localStorage.getItem("name") || "User");
        } else {
          const currentPath = window.location.pathname;
          const isPublicPage =
            publicPages.includes(currentPath) ||
            currentPath.startsWith("/buy/");

          if (!isPublicPage) {
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsAuthChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Clear all auth data at once
      const itemsToClear = [
        "auth",
        "id",
        "name",
        "role",
        "userRole",
        "userName",
        "userId",
      ];

      itemsToClear.forEach((item) => localStorage.removeItem(item));

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const hoverStyle = {
    onMouseOver: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = "rgba(184, 110, 84, 0.1)";
    },
    onMouseOut: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = "transparent";
    },
  };

  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 z-10 shadow-md flex flex-col py-6 px-4"
      style={{
        backgroundColor: styles.warmBg,
        borderRight: `1px solid ${styles.warmBorder}`,
      }}
    >
      <Link href="/" className="mb-8 px-2 flex items-center">
        <h1
          className={`text-2xl ${playfair.className}`}
          style={{ color: styles.warmPrimary }}
        >
          CollegeLX
        </h1>
      </Link>

      {userName && (
        <div className="mb-6 px-2 py-2 bg-opacity-20 rounded-lg">
          <p style={{ color: styles.warmText }} className="font-medium">
            Hello, {userName}
          </p>
        </div>
      )}

      {userRole === "user" ? (
        <nav className="flex-1">
          <ul className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const requiresAuth =
                item.href !== "/" && !item.href.startsWith("/buy/");
              const linkHref =
                requiresAuth && !userName
                  ? `/auth/login?redirect=${encodeURIComponent(item.href)}`
                  : item.href;

              // Replace the item href for the NavItem component
              const navItem = { ...item, href: linkHref };
              return (
                <NavItem key={item.name} item={navItem} isActive={isActive} />
              );
            })}
          </ul>
        </nav>
      ) : (
        <div
          className="flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 bg-opacity-10 font-medium"
          style={{
            borderColor: styles.warmBorder,
            backgroundColor: styles.warmAccent,
            opacity: 1,
          }}
        >
          <span className="mr-3">{adminItems[0].icon}</span>
          {adminItems[0].name}
        </div>
      )}

      {userName ? (
        <div
          className="mt-4 border-t pt-4"
          style={{ borderColor: styles.warmBorder }}
        >
          <button
            onClick={handleLogout}
            className="flex w-full items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-opacity-10"
            style={{
              color: styles.warmText,
              backgroundColor: "transparent",
            }}
            {...hoverStyle}
          >
            <span className="mr-3">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </div>
      ) : (
        !isAuthChecking && (
          <div
            className="mt-4 border-t pt-4"
            style={{ borderColor: styles.warmBorder }}
          >
            <Link
              href="/auth/login"
              className="flex w-full items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-opacity-10"
              style={{
                color: styles.warmPrimary,
                backgroundColor: "transparent",
                fontWeight: "500",
              }}
              {...hoverStyle}
            >
              <span className="mr-3">
                <User size={18} />
              </span>
              Sign In
            </Link>
          </div>
        )
      )}

      <div
        className="mt-auto px-2 py-4 text-sm text-center"
        style={{ color: styles.warmText }}
      >
        <p>© 2023 CollegeLX</p>
      </div>
    </aside>
  );
};

export default Sidebar;
