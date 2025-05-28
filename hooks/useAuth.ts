import { redirect } from "next/navigation";
import useSupabase from "./useSupabase";
import { supabase } from "@/lib/supabase";

export default function useAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    // redirect("/login");
  }
  const user = supabase.from("users").select("id").eq("token", token).single();

  console.log(user);

  return;
}
