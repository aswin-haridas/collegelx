import { supabase } from "@/shared/lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useWishlist = (productId?: String) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if item is in wishlist on component mount if productId is provided
  useEffect(() => {
    if (productId) {
      checkWishlistStatus();
    }
  }, [productId, user]);

  // Check if the current product is in the user's wishlist
  const checkWishlistStatus = async () => {
    if (productId) {
      const result = await isInWishlist(productId);
      setIsWishlisted(result);
    }
  };

  const handleError = (operation: string, error: any) => {
    console.error(`Error ${operation}:`, error);
    return false;
  };

  const addToWishlist = async (productId: String) => {
    if (!user) return false;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
      if (productId) setIsWishlisted(true);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return handleError("adding to wishlist", error);
    }
  };

  const removeFromWishlist = async (productId: String) => {
    if (!user) return false;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      if (productId) setIsWishlisted(false);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return handleError("removing from wishlist", error);
    }
  };

  const isInWishlist = async (productId: String): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      handleError("checking wishlist", error);
      return false;
    }
  };

  // Toggle function to add/remove from wishlist
  const toggleWishlist = async () => {
    if (!productId || !user) return;

    setLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
    setLoading(false);
  };

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loading,
    isWishlisted,
  };
};
