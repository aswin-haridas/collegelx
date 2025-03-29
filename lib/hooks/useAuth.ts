import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthData {
  name: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(requireAuth: boolean = true) {
  const [authData, setAuthData] = useState<AuthData>({
    name: null,
    userId: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    // Get auth data from localStorage
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const isAuthenticated = localStorage.getItem("auth") === "true";

    setAuthData({
      name,
      userId,
      role,
      isAuthenticated,
      isLoading: false,
    });

    // Check if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Don't redirect if on public pages
      if (
        !pathname?.includes("/auth") &&
        pathname !== "/" &&
        !pathname?.includes("/buy/")
      ) {
        router.push(
          `/auth/login?redirect=${encodeURIComponent(pathname || "/")}`
        );
      }
    }
  };

  return authData;
}
