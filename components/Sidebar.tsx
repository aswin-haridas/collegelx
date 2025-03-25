"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, User, LogOut, MessageCircle } from "lucide-react";

const Sidebar = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get user name from sessionStorage when component mounts
    if (typeof window !== "undefined") {
      const storedUserName = sessionStorage.getItem("userName");
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userId");

    // Clear local storage for backward compatibility
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/auth/login");
  };

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Sell", href: "/sell", icon: <ShoppingBag size={18} /> },
    { name: "Messages", href: "/chat", icon: <MessageCircle size={18} /> },
    { name: "Profile", href: "/profile", icon: <User size={18} /> },
  ];

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
        <div className="mb-6 px-2 py-2 bg-white bg-opacity-20 rounded-lg">
          <p style={{ color: styles.warmText }} className="font-medium">
            Hello, {userName}
          </p>
        </div>
      )}

      <nav className="flex-1">
        <ul className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-opacity-10 font-medium' : ''
                  }`}
                  style={{
                    color: isActive ? styles.warmPrimary : styles.warmText,
                    backgroundColor: isActive ? styles.warmPrimary : "transparent",
                    opacity: isActive ? 1 : 0.8,
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${styles.warmPrimary}`;
                      e.currentTarget.style.backgroundColor = 'rgba(184, 110, 84, 0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="mr-3" style={{ 
                    color: isActive ? styles.warmPrimary : styles.warmText 
                  }}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 border-t pt-4" style={{ borderColor: styles.warmBorder }}>
        <button
          onClick={handleLogout}
          className="flex w-full items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-opacity-10"
          style={{
            color: styles.warmText,
            backgroundColor: "transparent",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(184, 110, 84, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span className="mr-3">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>

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
