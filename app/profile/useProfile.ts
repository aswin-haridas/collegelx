import { useCallback } from "react";
import { supabase } from "@/shared/lib/supabase";
import { User } from "@/shared/lib/types";

export const useProfile = (userId: string | null) => {
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return null;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    return data;
  }, [userId]);

  // Fetch user items
  const fetchUserItems = useCallback(async () => {
    if (!userId) return [];

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return data || [];
  }, [userId]);

  const fetchUserReviews = useCallback(async () => {
    if (!userId) return [];

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return data || [];
  }, [userId]);

  const fetchUserWishlist = useCallback(async () => {
    if (!userId) return [];

    const { data } = await supabase
      .from("wishlist")
      .select("*, items(*)")
      .eq("user_id", userId);

    // Extract item data from the joined results
    const wishlistData =
      data?.map((item) => ({
        ...item.items,
        wishlist_id: item.id,
      })) || [];

    return wishlistData;
  }, [userId]);

  // Update User Profile
  const updateUserProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!userId) return null;

      const { data } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      return data;
    },
    [userId]
  );

  return {
    fetchUserProfile,
    fetchUserItems,
    fetchUserReviews,
    fetchUserWishlist,
    updateUserProfile,
  };
};

export default useProfile;
