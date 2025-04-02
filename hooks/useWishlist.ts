import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UseWishlistProps {
  userId?: string;
  itemId?: string;
  isAuthenticated?: boolean;
}

export const useWishlist = ({
  userId,
  itemId,
  isAuthenticated,
}: UseWishlistProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if item is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !itemId) return;

      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", userId)
          .eq("item_id", itemId)
          .single();

        if (data) {
          setIsInWishlist(true);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    if (isAuthenticated) {
      checkWishlist();
    }
  }, [userId, itemId, isAuthenticated]);

  const toggleWishlist = async () => {
    if (!userId || !itemId) return;

    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", itemId);

        if (error) throw error;
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlist")
          .insert({ user_id: userId, item_id: itemId })
          .select();

        if (error) throw error;
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isInWishlist, toggleWishlist, loading };
};
