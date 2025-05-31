import { useState, useEffect } from "react";
import { supabase } from "@/shared/lib/supabase";
import useSupabase from "@/shared/hooks/useSupabase";
import { User, Listing } from "@/types";

export function useAdmin() {
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Use useSupabase hooks for data fetching
  const {
    data: users,
    error: usersError,
    loading: usersLoading,
  } = useSupabase<User>("users");
  const {
    data: items,
    error: itemsError,
    loading: itemsLoading,
  } = useSupabase<Listing>("products");
  const {
    data: unlistedItems,
    error: unlistedError,
    loading: unlistedLoading,
  } = useSupabase<Listing>("products", ["*"], "status", "unlisted");

  const isLoading = usersLoading || itemsLoading || unlistedLoading;

  // Set error state if any of the queries fail
  useEffect(() => {
    if (usersError || itemsError || unlistedError) {
      setError(usersError || itemsError || unlistedError);
    }
  }, [usersError, itemsError, unlistedError]);

  // Function to update user
  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (error) throw error;

      showSuccess("User updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
      return false;
    }
  };

  // Function to update item
  const updateItem = async (updatedItem: Listing) => {
    try {
      const { error } = await supabase
        .from("products")
        .update(updatedItem)
        .eq("id", updatedItem.id);

      if (error) throw error;

      showSuccess("Item updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item");
      return false;
    }
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return {
    users: users || [],
    items: items || [],
    unlistedItems: unlistedItems || [],
    isLoading,
    error,
    showSuccessMessage,
    successMessage,
    setShowSuccessMessage,
    updateUser,
    updateItem,
  };
}
