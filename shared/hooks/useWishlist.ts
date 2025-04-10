import { supabase } from "@/shared/lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useWishlist = (productId?: String) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Add state for wishlist items
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (productId) {
      checkWishlistStatus();
    }
  }, [productId, user]);

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

  // New function to fetch all wishlist items for the current user
  const fetchWishlistItems = async () => {
    if (!user) return [];
    setLoading(true);

    try {
      // Join wishlist with products to get product details
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          id,
          product_id,
          products:product_id (
            id,
            title,
            price,
            description,
            category,
            condition,
            status,
            images,
            created_at,
            user_id
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform the data to extract the products
      const items =
        data?.map((item) => ({
          id: item.product_id,
          ...item.products,
        })) || [];

      setWishlistItems(items);
      setLoading(false);
      return items;
    } catch (error) {
      setLoading(false);
      handleError("fetching wishlist items", error);
      return [];
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    fetchWishlistItems,
    wishlistItems,
    loading,
    isWishlisted,
  };
};
