import { supabase } from "@/shared/lib/supabase";
import { useEffect } from "react";
import { useUser } from "./useUser";

export const useWishlist = () => {
  const { user } = useUser();

  const handleError = (operation: string, error: any) => {
    console.error(`Error ${operation}:`, error);
    return false;
  };

  const addToWishlist = async (productId: String) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
      return true;
    } catch (error) {
      return handleError("adding to wishlist", error);
    }
  };

  const removeFromWishlist = async (productId: String) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      return true;
    } catch (error) {
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
        .eq("product_id", productId)

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      handleError("checking wishlist", error);
      return false;
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
