"use client";
import Link from "next/link";
import { styles, playfair } from "@/shared/lib/styles";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Tagline from "../components/Tagline";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: unknown) => {
    console.log("Form submitted:", data);
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
