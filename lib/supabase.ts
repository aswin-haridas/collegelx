import { createClient } from "@supabase/supabase-js";
import { User } from "./types";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to get the current user
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("user")
    .select("*")
    .eq("userid", session.user.id)
    .single();

  return data as User | null;
}

// Helper function to sign out
export async function signOut() {
  return await supabase.auth.signOut();
}

// Helper function to update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
) {
  const { data, error } = await supabase
    .from("user")
    .update(updates)
    .eq("userid", userId);

  return { data, error };
}
