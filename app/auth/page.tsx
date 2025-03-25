"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect to login page from the main auth route
 */
export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push("/auth/login");
  }, [router]);

  // Return an empty div while redirecting
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      Redirecting...
    </div>
  );
}
