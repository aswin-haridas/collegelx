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

    try {
      console.log("Fetching items for user:", userId);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user items:", error);
        return [];
      }

      console.log("User items fetched:", data?.length || 0);
      return (data || []).map((item) => ({
        ...item,
        id: item.id,
        name: item.name || item.title || "Unnamed Item",
        price: item.price || 0,
        status: item.status || "available",
        images: item.images || (item.image ? [item.image] : []),
        image: item.image || item.images?.[0] || null,
      }));
    } catch (err) {
      console.error("Exception fetching user items:", err);
      return [];
    }
  }, [userId]);

  // Fetch user reviews
  const fetchUserReviews = useCallback(async () => {
    if (!userId) return [];

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return data || [];
  }, [userId]);

  // Fetch user wishlist
  const fetchUserWishlist = useCallback(async () => {
    if (!userId) return [];

    try {
      // First, get the wishlist entries for the user
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", userId);

      if (wishlistError) throw wishlistError;
      if (!wishlistData || wishlistData.length === 0) return [];

      // Extract item IDs from wishlist
      const itemIds = wishlistData.map((entry) => entry.product_id);

      // Then, fetch the actual product items using these IDs
      const { data: items, error: itemsError } = await supabase
        .from("products")
        .select("*")
        .in("id", itemIds);

      if (itemsError) throw itemsError;

      // Map the items with necessary transformations
      return (
        items.map((item) => ({
          ...item,
          title: item.name || item.title,
          name: item.name || item.title,
          user_id: item.seller_id || item.user_id,
          seller_id: item.seller_id || item.user_id,
          seller: item.seller_id || item.user_id,
          images: item.images || (item.image ? [item.image] : []),
          image: item.image || item.images?.[0] || null,
          imageUrl: item.image || item.images?.[0] || null,
          wishlist_id: item.id, // Using product ID as wishlist ID for reference
        })) || []
      );
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
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
    [userId],
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
