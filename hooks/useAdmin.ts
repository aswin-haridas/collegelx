import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { User, Item } from "@/lib/types";
import { useState } from "react";

export function useAdmin() {
  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users from Supabase
  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all items from Supabase
  const {
    data: items = [],
    isLoading: isItemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("items").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch unlisted items from Supabase
  const {
    data: unlistedItems = [],
    isLoading: isUnlistedItemsLoading,
    error: unlistedItemsError,
  } = useQuery({
    queryKey: ["unlistedItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("status", "unlisted");
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate overall loading state
  const isLoading = isUsersLoading || isItemsLoading || isUnlistedItemsLoading;

  // Get first error that occurred, if any
  const error =
    usersError?.message ||
    itemsError?.message ||
    unlistedItemsError?.message ||
    null;

  // Mutation for updating user
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (error) throw error;
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("User updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating user:", err);
    },
  });

  // Mutation for updating item
  const updateItemMutation = useMutation({
    mutationFn: async (updatedItem: Item) => {
      const { error } = await supabase
        .from("items")
        .update(updatedItem)
        .eq("id", updatedItem.id);

      if (error) throw error;
      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["unlistedItems"] });
      showSuccess("Item updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating item:", err);
    },
  });

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const updateUser = (user: User) => {
    return updateUserMutation.mutate(user);
  };

  const updateItem = (item: Item) => {
    return updateItemMutation.mutate(item);
  };

  return {
    users,
    items,
    unlistedItems,
    isLoading,
    error,
    showSuccessMessage,
    successMessage,
    setShowSuccessMessage,
    updateUser,
    updateItem,
  };
}
