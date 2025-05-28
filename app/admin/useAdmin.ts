import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { User, Listing } from "@/types/index.ts";

// Define column strings for consistency and maintainability
const adminUserColumns = "id, email, username, full_name, college_id, created_at, is_active";
const adminListingColumns = "id, user_id, title, price, status, created_at, condition"; // Added condition

export function useAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Listing[]>([]);
  const [unlistedItems, setUnlistedItems] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true); 
      try {
        // Use Promise.allSettled to ensure all fetches complete, regardless of individual errors
        const results = await Promise.allSettled([
            fetchUsers(), 
            fetchItems(), 
            fetchUnlistedItems()
        ]);
        // Log errors for any failed fetches
        results.forEach(result => {
            if (result.status === 'rejected') {
                console.error("Error in fetchAllData sub-fetch:", result.reason);
                // Optionally set a general error message, or rely on individual fetch errors
            }
        });
      } catch (err) { // This catch might be redundant if all individual fetches handle their errors
        console.error("Error in fetchAllData:", err);
        setError("Failed to load all admin data.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchAllData();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error: fetchError } = await supabase.from("users").select(adminUserColumns); // MODIFIED
      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      // Re-throw to be caught by Promise.allSettled if needed for specific handling
      // throw err; 
    } 
  };

  const fetchItems = async () => {
    try {
      const { data, error: fetchError } = await supabase.from("listings").select(adminListingColumns); // MODIFIED
      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err.message || "Failed to load items");
      // throw err;
    }
  };

  const fetchUnlistedItems = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("listings")
        .select(adminListingColumns) // MODIFIED
        .eq("status", "unlisted");
      if (fetchError) throw fetchError;
      setUnlistedItems(data || []);
    } catch (err: any) {
      console.error("Error fetching unlisted items:", err);
      setError(err.message || "Failed to load unlisted items");
      // throw err;
    }
  };

  const updateUser = async (updatedFields: Partial<User>) => { // Parameter changed to Partial<User>
    setError(null); 
    setShowSuccessMessage(false);
    if (!updatedFields.id) {
        setError("User ID is missing for update.");
        return false;
    }
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update(updatedFields) 
        .eq("id", updatedFields.id)
        .select(adminUserColumns) // Select the updated record with specific columns
        .single();

      if (updateError) throw updateError;

      if (updatedData) {
        setUsers(
          users.map((user) => (user.id === updatedData.id ? { ...user, ...updatedData } : user))
        );
      }
      showSuccess("User updated successfully!");
      return true;
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user");
      return false;
    }
  };

  const updateItem = async (updatedFields: Partial<Listing>, itemId: string) => { 
    setError(null);
    setShowSuccessMessage(false);
    try {
      const { data: updatedData, error: updateError } = await supabase 
        .from("listings")
        .update(updatedFields)
        .eq("id", itemId)
        .select(adminListingColumns) // MODIFIED: Select specific columns for the returned record
        .single();

      if (updateError) throw updateError;

      if (updatedData) {
        setItems(
          items.map((item) => (item.id === itemId ? { ...item, ...updatedData } : item))
        );
        // Consolidate unlisted items logic
        if (updatedData.status === "unlisted") {
            setUnlistedItems(prevUnlisted => {
                const index = prevUnlisted.findIndex(item => item.id === itemId);
                if (index > -1) { // Item exists, update it
                    return prevUnlisted.map(item => item.id === itemId ? updatedData : item);
                }
                // Item does not exist and is unlisted, add it
                return [...prevUnlisted, updatedData];
            });
        } else { // Item is not unlisted (e.g., available, sold), remove from unlistedItems
            setUnlistedItems(prevUnlisted => prevUnlisted.filter((item) => item.id !== itemId));
        }
      }
      showSuccess("Item updated successfully!");
      return true;
    } catch (err: any) {
      console.error("Error updating item:", err);
      setError(err.message || "Failed to update item");
      return false;
    }
  };

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
    updateUser,
    updateItem,
    fetchUsers,
    fetchItems,
    fetchUnlistedItems,
  };
}
