import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
  universityNumber: string;
  department: string;
}

export function useSignup() {
  const [formData, setFormData] = useState<FormData>({
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
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    university_id: string;
    department: string;
  }) => {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", userData.email);

    if (existingUser && existingUser.length > 0) {
      throw new Error("Email already in use");
    }

    const userID = crypto.randomUUID();

    // Create user directly in the users table
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userID,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || null,
          university_id: userData.university_id,
          department: userData.department,
          role: "user", // Default role
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    if (newUser && newUser.length > 0) {
      // Store user information
      sessionStorage.setItem("name", newUser[0].name);
      sessionStorage.setItem("user_id", newUser[0].id);
      sessionStorage.setItem("role", newUser[0].role);
      sessionStorage.setItem("isLoggedIn", "true");

      return newUser[0];
    } else {
      throw new Error("Failed to create user account");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        setIsLoading(false);
        return;
      }

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        university_id: formData.universityNumber,
        department: formData.department,
      });

      // Redirect on successful registration
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    departments,
    handleChange,
    handleSubmit,
  };
}
