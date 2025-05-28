import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Item } from "@/app/lib/types";

export function useAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [unlistedItems, setUnlistedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all items and unlisted items from Supabase
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchItems(), fetchUnlistedItems()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items");
    }
  };

  const fetchUnlistedItems = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "unlisted");

      if (error) throw error;
      setUnlistedItems(data || []);
    } catch (err) {
      console.error("Error fetching unlisted items:", err);
      setError("Failed to load unlisted items");
    }
  };

  // Function to update user
  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      showSuccess("User updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
      return false;
    }
  };

  // Function to update item
  const updateItem = async (updatedItem: Item) => {
    try {
      const { error } = await supabase
        .from("products")
        .update(updatedItem)
        .eq("id", updatedItem.id);

      if (error) throw error;

      // Update local state
      setItems(
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      if (updatedItem.status === "unlisted") {
        setUnlistedItems(
          unlistedItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      } else {
        setUnlistedItems(
          unlistedItems.filter((item) => item.id !== updatedItem.id)
        );
      }
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
