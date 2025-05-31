"use client";
import Link from "next/link";
import { styles, playfair } from "@/shared/styles/theme";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import Tagline from "../components/Tagline";
import { supabase } from "@/shared/lib/supabase"; // Verified import path
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "@/types";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email)
        .single();

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        return;
      }

      redirect("/");
    } catch (error: any) {
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Tagline />
      <LoginForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
function LoginForm({
  register,
  handleSubmit,
  onSubmit,
  isSubmitting,
}: FieldValues) {
  return (
    <div className="md:w-1/2 flex items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-md space-y-6 p-8 md:p-10 rounded-xl shadow-lg bg-white">
        <h2
          className={`text-center text-3xl font-bold ${playfair.className}`}
          style={{ color: styles.accent }}
        >
          Sign in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <Input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email address"
              autoComplete="email"
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
            <Button type="submit" isSubmitting={isSubmitting} text="Sign in" />
            <p className="mt-3 text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className={`font-medium text- transition-colors hover:underline`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
