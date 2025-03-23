"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { styles } from "@/lib/styles";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    universityNumber: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Business Administration",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Form validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isLogin ? "login" : "signup",
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          universityNumber: formData.universityNumber,
          department: formData.department,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Redirect on success
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row ">
      {/* Left side with tagline */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="text-center md:text-left w-full max-w-lg">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-playfair"
            style={{ color: styles.warmPrimary }}
          >
            CollegeLX
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl font-light mb-8"
            style={{ color: styles.warmText }}
          >
            A place you can share your items in ease
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
              className="text-center text-3xl font-bold font-playfair"
              style={{ color: styles.warmPrimary }}
            >
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
            <p
              className="mt-3 text-center text-sm"
              style={{ color: styles.warmText }}
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium hover:text-warmAccentDark transition-colors"
                style={{ color: styles.warmAccent }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
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
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.warmText }}
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                    style={{
                      borderColor: styles.warmBorder,
                      color: styles.warmText,
                    }}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              )}

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

              {!isLogin && (
                <>
                  <div>
                    <label
                      htmlFor="universityNumber"
                      className="block text-sm font-medium mb-1"
                      style={{ color: styles.warmText }}
                    >
                      University Number
                    </label>
                    <input
                      id="universityNumber"
                      name="universityNumber"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                      style={{
                        borderColor: styles.warmBorder,
                        color: styles.warmText,
                      }}
                      placeholder="University Number"
                      value={formData.universityNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium mb-1"
                      style={{ color: styles.warmText }}
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                      style={{
                        borderColor: styles.warmBorder,
                        color: styles.warmText,
                      }}
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select your department
                      </option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

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
                  autoComplete={isLogin ? "current-password" : "new-password"}
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

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.warmText }}
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                    style={{
                      borderColor: styles.warmBorder,
                      color: styles.warmText,
                    }}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {isLogin && (
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
            )}

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
                {isLoading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
