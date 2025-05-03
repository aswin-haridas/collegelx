import { supabase } from "./supabase";

/**
 * Update user password after verifying the current password
 */
export async function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
) {
  try {
    // First verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}
