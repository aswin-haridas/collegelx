"use client";
import Link from "next/link";
import { styles, playfair } from "@/shared/lib/styles";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Tagline from "../components/Tagline";
import { supabase } from "@/shared/lib/supabase";
import toast from "react-hot-toast";

const departments = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Business Administration",
  "Economics",
  "Psychology",
];

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    const { data: userData, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", data.email)
      .single();

    if (userData) {
      toast("Email already exists");
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Tagline />
      <SignupForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function SignupForm({
  register,
  handleSubmit,
  onSubmit,
  isSubmitting,
  getValues,
}: FieldValues) {
  return (
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
              {...register("universityNumber")}
              type="text"
              placeholder="University Number"
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

            <Button type="submit" isSubmitting={isSubmitting} text="Sign up" />

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
  );
}
