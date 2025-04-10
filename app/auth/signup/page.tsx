"use client";
import Link from "next/link";
import { styles } from "@/shared/lib/styles";
import { playfair } from "@/shared/lib/fonts";
import { useSignup } from "../hooks/useSignup";

/**
 * Create a new user account with basic info
 */
export default function SignupPage() {
  const {
    formData,
    error,
    isLoading,
    departments,
    handleChange,
    handleSubmit,
  } = useSignup();

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
              Create a new account
            </h2>
            <p
              className="mt-3 text-center text-sm"
              style={{ color: styles.warmText }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium hover:text-warmAccentDark transition-colors"
                style={{ color: styles.warmAccent }}
              >
                Sign in
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
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                  style={{ color: styles.warmText }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="appearance-none relative block w-full px-3 py-2 border-2 rounded-md placeholder-warmText/50 focus:outline-none focus:ring-warmAccent focus:border-warmAccent sm:text-sm"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

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
                  autoComplete="new-password"
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
                {isLoading ? "Processing..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
