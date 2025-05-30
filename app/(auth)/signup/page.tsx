"use client";
import Link from "next/link";
import { styles, playfair } from "@/shared/styles/theme";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import Tagline from "../components/Tagline";
import { supabase } from "@/shared/lib/supabase";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { departments } from "@/shared/config/constants";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = useForm();

  const onSubmit = async (formData: FieldValues) => {
    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        // You can add options here if needed, like email_confirm: true
      });

      if (authError) {
        toast.error(`Sign up failed: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        toast.error("Sign up successful, but no user data returned. Please try logging in.");
        redirect("/login"); // Or handle as appropriate
        return;
      }

      // Step 2: Insert additional profile information into the public 'users' table
      // Link it using the ID from the authenticated user
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authData.user.id, // Use the ID from the authenticated user
          full_name: formData.name,
          email: formData.email, // email is already in auth.users, but can be duplicated if schema requires
          phone: formData.phone,
          // DO NOT store password here again, especially not plaintext
          college_id: formData.college_id,
          department: formData.department,
          // is_active: true, // Set default status if applicable
          // profile_picture: '', // Default or leave null
        },
      ]);

      if (insertError) {
        // If this fails, you might want to consider what to do.
        // The user is authenticated, but their profile data isn't saved.
        // For now, we'll show an error and let them proceed.
        // Ideally, you might have a more robust error handling or retry mechanism.
        toast.error(`Account created, but failed to save profile details: ${insertError.message}`);
      } else {
        toast.success("Account created successfully! Please check your email to confirm your registration if email confirmation is enabled. You can now login.");
      }

      // Redirect to login page or a page that asks them to confirm their email
      redirect("/login");

    } catch (error: any) {
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Tagline />
      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md space-y-6 p-8 md:p-10 rounded-xl shadow-lg bg-white">
          <h2
            className={`text-center text-3xl font-bold ${playfair.className}`}
            style={{ color: styles.primary }}
          >
            Create a new account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <Input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Full Name"
                autoComplete="name"
              />
              <Input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email address"
                autoComplete="email"
              />
              <Input
                {...register("phone")}
                type="tel"
                placeholder="Phone Number"
              />
              <Input
                {...register("college_id")}
                type="text"
                placeholder="College ID"
              />
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                placeholder="Password"
              />
              <Input
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value: string) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                type="password"
                placeholder="Confirm Password"
              />

              <select
                {...register("department", {
                  required: "Department is required",
                })}
                className="w-full p-3 rounded-md border-2 focus:outline-none"
                style={{ borderColor: styles.primary }}
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <Button
                type="submit"
                isSubmitting={isSubmitting}
                text="Sign up"
              />

              <p className="mt-3 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium hover:text-AccentDark transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
