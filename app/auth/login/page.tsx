"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { styles } from "@/lib/styles";
import { supabase } from "@/lib/supabase";
import { playfair } from "@/lib/fonts";

/**
 * Login to an existing account using database authentication
 */
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loginUser = async (email: string, password: string) => {
    // Check email and password against the users table
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError) {
      throw new Error("Invalid email or password");
    }

    // Simple password check (in a real app, you would use encryption)
    if (user && user.password === password) {
      // Store user role and name in sessionStorage for session management
      sessionStorage.setItem("userRole", user.role);
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userId", user.id);

      // Still keep the full user object in localStorage for backward compatibility
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginUser(formData.email, formData.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side with tagline */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="text-center md:text-left w-full max-w-lg">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${playfair.className}`}
            style={{ color: styles.warmPrimary }}
          >
            CollegeLX
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl font-light mb-8"
            style={{ color: styles.warmText }}
          >
            A place you can share your items with ease
          </p>
          <div
            className="hidden md:block h-1 w-20 mb-8 rounded-full"
            style={{ backgroundColor: styles.warmAccent }}
          ></div>
          <p
            className="text-base md:text-lg"
            style={{ color: styles.warmText }}
          >
            Connect with fellow students, share resources, and simplify campus
            life.
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div
          className="w-full max-w-md space-y-6 p-8 md:p-10 rounded-xl shadow-lg"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <h2
              className={`text-center text-3xl font-bold ${playfair.className}`}
              style={{ color: styles.warmPrimary }}
            >
              Sign in to your account
            </h2>
            <p
              className="mt-3 text-center text-sm"
              style={{ color: styles.warmText }}
            >
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium hover:text-warmAccentDark transition-colors"
                style={{ color: styles.warmAccent }}
              >
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: styles.warmText }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                  style={{ color: styles.warmText }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 focus:ring rounded"
                  style={{
                    color: styles.warmAccent,
                    borderColor: styles.warmBorder,
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm"
                  style={{ color: styles.warmText }}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium hover:text-warmAccentDark"
                  style={{ color: styles.warmAccent }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{
                  backgroundColor: isLoading ? "#ccc" : styles.warmPrimary,
                  borderColor: "transparent",
                }}
                onMouseOver={(e) =>
                  !isLoading &&
                  (e.currentTarget.style.backgroundColor =
                    styles.warmPrimaryDark)
                }
                onMouseOut={(e) =>
                  !isLoading &&
                  (e.currentTarget.style.backgroundColor = styles.warmPrimary)
                }
              >
                {isLoading ? "Processing..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
