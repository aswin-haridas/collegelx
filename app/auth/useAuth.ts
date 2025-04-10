import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Update authentication state based on session storage
    const updateAuthState = () => {
      const storedUserId = sessionStorage.getItem("user_id");
      const storedUserName = sessionStorage.getItem("name");

      setUserId(storedUserId);
      setUserName(storedUserName);
      setIsAuthenticated(!!storedUserId);
      setLoading(false);
    };

    // Initial check
    updateAuthState();

    // Handle storage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user_id" || event.key === "name") {
        updateAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper function to log out
  const logout = () => {
    sessionStorage.clear();
  };

  // Helper function to redirect based on authentication status
  const redirectIfUnauthenticated = (path: string = "/auth/login") => {
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(path);
      }
    }, [isLoading, isAuthenticated]);
  };

  // Helper function to redirect if authenticated
  const redirectIfAuthenticated = (path: string = "/") => {
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        const role = sessionStorage.getItem("role");
        router.push(role === "admin" ? "/admin" : path);
      }
    }, [isLoading, isAuthenticated]);
  };

  return {
    userId,
    userName,
    isAuthenticated,
    isLoading,
    logout,
    redirectIfUnauthenticated,
    redirectIfAuthenticated,
  };
}
