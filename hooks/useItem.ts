import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Item } from "@/lib/types";

export function useItem(itemId: string, includeSellerInfo = false) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [seller, setSeller] = useState<any | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!itemId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setItem(data as Item);

          // Fetch seller data if requested
          if (includeSellerInfo) {
            setSellerLoading(true);
            const sellerId =
              data.seller_id || data.user_id || data.sender_id || data.seller;

            if (sellerId) {
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", sellerId)
                .single();

              if (!userError && userData) {
                setSeller(userData);
              }
            }
            setSellerLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch item")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId, includeSellerInfo]);

  return {
    item,
    loading,
    error,
    seller,
    sellerLoading,
  };
}
