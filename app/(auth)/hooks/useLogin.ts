import { supabase } from "@/shared/lib/supabase";

export default async function useLogin(data: any) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", data.email)
    .eq("password", data.password);

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  if (users && users.length > 0) {
    return users[0];
  } else {
    console.log("User not found");
    return null;
  }
}
