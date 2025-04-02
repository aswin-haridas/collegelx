import { useState, useEffect } from "react";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status from sessionStorage
    const checkAuth = () => {
      setLoading(true);

      // Get from session storage
      const storedUserId = sessionStorage.getItem("user_id");

      if (storedUserId) {
        setUserId(storedUserId);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }

      setLoading(false);
    };

    // Run initial check
    checkAuth();

    // Set up storage event listener to detect changes in other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user_id") {
        if (event.newValue) {
          setUserId(event.newValue);
          setIsAuthenticated(true);
        } else {
          setUserId(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Helper function to log out
  const logout = () => {
    sessionStorage.removeItem("user_id");
    setUserId(null);
    setIsAuthenticated(false);
  };

  return {
    userId,
    isAuthenticated,
    isLoading,
    logout,
  };
}
