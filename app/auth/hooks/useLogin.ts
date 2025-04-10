import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";

export function useLogin() {
  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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

      // Store user name in sessionStorage
      sessionStorage.setItem("name", userData.name);
      sessionStorage.setItem("user_id", userData.id);
      sessionStorage.setItem("role", userData.role);

      // Redirect based on user role
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

  return {
    collegeId,
    setCollegeId,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
}
