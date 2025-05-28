import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Listing, User } from "@/types/index.ts";

type ListingWithSeller = Listing & {
  seller: User | null;
};

export function useItem(itemId: string, includeSellerInfo = false) {
  const [item, setItem] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchItemAndSeller() {
      if (!itemId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setItem(null);
      setSeller(null);

      try {
        // Define base listing columns to select
        const listingColumns = "id, user_id, category_id, title, description, price, condition, status, images, created_at, updated_at";
        
        let query = supabase
          .from("listings")
          .select(
            includeSellerInfo
              ? `${listingColumns}, seller:users(id, email, username, full_name, profile_picture, college_id, created_at, updated_at, is_active)`
              : listingColumns // Use specific columns when not including seller
          )
          .eq("id", itemId)
          .single();

        const { data, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        if (data) {
          if (includeSellerInfo) {
            const { seller: sellerData, ...listingData } = data as any; // Use 'any' for initial destructure due to dynamic select
            setItem(listingData as Listing);
            setSeller(sellerData as User | null);
          } else {
            setItem(data as Listing);
            setSeller(null);
          }
        } else {
          setItem(null);
          setSeller(null);
        }
      } catch (err) {
        console.error("Error fetching item/seller:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch item data")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItemAndSeller();
  }, [itemId, includeSellerInfo]);

  return {
    item,
    loading,
    error,
    seller,
  };
}
