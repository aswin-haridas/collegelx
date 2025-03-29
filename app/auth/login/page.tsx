"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password);

      if (error || !data || data.length === 0) {
        throw new Error("Invalid email or password");
      }

      const userData = data[0];

      // Store in localStorage
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userId", userData.id);

      // Also store in localStorage for consistency
      localStorage.setItem("auth", "true");
      localStorage.setItem("id", userData.id);
      localStorage.setItem("name", userData.name);
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Ensure proper redirection
      if (userData.name.toLowerCase() === "admin") {
        router.push("/admin"); // Redirect admin users to "/admin"
      } else {
        router.push("/"); // Redirect regular users to "/"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: styles.warmPrimary }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1
              className={`text-4xl ${playfair.className}`}
              style={{ color: styles.warmPrimary }}
            >
              CollegeLX
            </h1>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: styles.warmText }}
          >
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  color: "#DC2626",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-white flex items-center justify-center"
              style={{ backgroundColor: styles.warmPrimary }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href={`/auth/signup${
                redirect !== "/"
                  ? `?redirect=${encodeURIComponent(redirect)}`
                  : ""
              }`}
              className="font-medium hover:underline"
              style={{ color: styles.warmPrimary }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
