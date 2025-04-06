"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/atoms/button";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import TextInput from "@/components/atoms/TextInput";
import ErrorAlert from "@/components/atoms/ErrorAlert";

export default function LoginPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [_, setName] = useSessionStorage("name", "");
  const [__, setUserId] = useSessionStorage("user_id", "");
  const [userRole, setRole] = useSessionStorage("role", "");
  const [___, setIsLoggedIn] = useSessionStorage("isLoggedIn", false);

  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("university_id", collegeId)
        .eq("password", password);

      if (error || !data || data.length === 0) {
        throw new Error("Invalid college ID or password");
      }

      const userData = data[0];

      setName(userData.name);
      setUserId(userData.id);
      setRole(userData.role);
      setIsLoggedIn(true);

      if (userData.role === "admin") {
        console.log("Admin logged in");
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: styles.warmPrimary }}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    if (userRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
    return null;
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
            <ErrorAlert message={error} />

            <TextInput
              label="College ID"
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              required
            />

            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button loading={loading} />
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
