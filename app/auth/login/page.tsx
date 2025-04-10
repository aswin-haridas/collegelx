"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { styles } from "@/shared/lib/styles";
import { playfair } from "@/shared/lib/fonts";
import { useAuth } from "../hooks/useAuth";
import Loader from "@/shared/components/Atoms/Loading";
import { Loader2 } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    redirectIfAuthenticated,
  } = useAuth();

  // Use the redirect helper function
  redirectIfAuthenticated();

  // Use the login hook
  const {
    collegeId,
    setCollegeId,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLogin();

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
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

          <form onSubmit={handleLogin} className="space-y-4">
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
                College ID
              </label>
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
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
              href="/signup"
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
