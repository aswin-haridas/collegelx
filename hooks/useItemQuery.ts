import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Item, User } from "@/lib/types";

interface UseItemQueryResult {
  item: Item | null;
  seller: User | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

async function fetchItem(
  itemId: string,
  fetchSeller: boolean = false
): Promise<{ item: Item | null; seller: User | null }> {
  if (!itemId) {
    return { item: null, seller: null };
  }

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    throw new Error(`Error fetching item: ${error.message}`);
  }

  let seller = null;
  if (fetchSeller && item) {
    const sellerId = item.sender_id || item.seller_id || item.user_id;

    if (sellerId) {
      const { data: sellerData, error: sellerError } = await supabase
        .from("users")
        .select("*")
        .eq("id", sellerId)
        .single();

      if (sellerError) {
        console.error("Error fetching seller:", sellerError);
      } else {
        seller = sellerData;
      }
    }
  }

  return { item, seller };
}

export function useItemQuery(
  itemId: string,
  fetchSeller: boolean = false
): UseItemQueryResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetchItem(itemId, fetchSeller),
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    item: data?.item || null,
    seller: data?.seller || null,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
