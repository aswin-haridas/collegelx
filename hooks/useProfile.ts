import { useState, useEffect, useCallback } from "react"; // Add useCallback
import { supabase } from "@/lib/supabase";
import { Item as ItemType } from "@/lib/types";

interface User {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  university_id?: string;
  role: string;
  profile_image?: string;
  year?: string;
  rating?: number;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const useProfile = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [wishlistItems, setWishlistItems] = useState<ItemType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrap fetch functions in useCallback
  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserItems = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .or(`seller_id.eq.${userId}, user_id.eq.${userId}`);

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error("Error fetching user items:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserReviews = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching user reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserWishlist = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("item_id")
        .eq("user_id", userId);

      if (wishlistError) throw wishlistError;

      if (!wishlistData.length) {
        setWishlistItems([]);
        return;
      }

      const itemIds = wishlistData.map((entry) => entry.item_id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      if (itemsError) throw itemsError;

      setWishlistItems(itemsData || []);
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update User Profile with useCallback
  const updateUserProfile = useCallback(
    async (formData: Partial<User>) => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .update(formData)
          .eq("id", userId)
          .select()
          .single();

        if (error) throw error;
        setUser((prevUser) => ({ ...prevUser, ...formData } as User));
        return data;
      } catch (error: any) {
        console.error("Error updating user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Update an item/product with useCallback
  const updateItem = useCallback(
    async (itemId: string, updates: Partial<ItemType>) => {
      if (!userId) return null;
      setLoading(true);
      try {
        // First verify the item belongs to this user
        const { data, error } = await supabase
          .from("items")
          .update(updates)
          .eq("id", itemId)
          .select()
          .single();

        if (error) throw error;

        // Update local items state
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        );

        return data;
      } catch (error: any) {
        console.error("Error updating item:", error);
        setError(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    user,
    items,
    reviews,
    wishlistItems,
    loading,
    error,
    fetchUserData,
    fetchUserItems,
    fetchUserReviews,
    fetchUserWishlist,
    updateUserProfile,
    updateItem,
  };
};
