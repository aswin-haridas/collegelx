import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseWishlistProps {
  userId?: string;
  itemId: string;
  isAuthenticated: boolean;
}

async function checkWishlistStatus(
  userId: string,
  itemId: string
): Promise<boolean> {
  if (!userId || !itemId) return false;

  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    console.error("Error checking wishlist status:", error);
  }

  return !!data;
}

async function toggleWishlistItem(
  userId: string,
  itemId: string,
  currentStatus: boolean
): Promise<boolean> {
  if (!userId || !itemId) throw new Error("User ID and Item ID are required");

  if (currentStatus) {
    // Remove from wishlist
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (error) throw error;
    return false;
  } else {
    // Add to wishlist
    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: userId, item_id: itemId });

    if (error) throw error;
    return true;
  }
}

export function useWishlist({
  userId,
  itemId,
  isAuthenticated,
}: UseWishlistProps) {
  const queryClient = useQueryClient();

  const { data: isInWishlist = false, isLoading } = useQuery({
    queryKey: ["wishlist", userId, itemId],
    queryFn: () => checkWishlistStatus(userId!, itemId),
    enabled: !!userId && !!itemId && isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: () => toggleWishlistItem(userId!, itemId, isInWishlist),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(["wishlist", userId, itemId], newStatus);

      // Invalidate user's wishlist to keep it in sync
      queryClient.invalidateQueries({ queryKey: ["userWishlist", userId] });
    },
  });

  const toggleWishlist = () => {
    if (!userId || !isAuthenticated) return;
    mutation.mutate();
  };

  return {
    isInWishlist,
    toggleWishlist,
    loading: isLoading || mutation.isPending,
  };
}
