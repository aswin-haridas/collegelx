import { useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ChatSaveParams {
  buyerId?: string | null;
  sellerId?: string | null;
  listingId?: string | null;
}

export const useChatSave = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();

  const saveChat = useCallback(
    async ({ buyerId, sellerId, listingId }: ChatSaveParams) => {
      if (!buyerId || !sellerId || !listingId) {
        setError("Missing required parameters for chat");
        return null;
      }

      // Prevent users from chatting with themselves
      if (buyerId === sellerId) {
        setError("You cannot chat with yourself");
        toast.error("You cannot chat with yourself");
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if a chat already exists between these users for this listing
        const { data: existingChat, error: fetchError } = await supabase
          .from("chats")
          .select("id")
          .match({
            buyer_id: buyerId,
            seller_id: sellerId,
            product_id: listingId,
          })
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "no rows returned"
          throw fetchError;
        }

        // If chat exists, return its ID
        if (existingChat) {
          setChatId(existingChat.id);
          return existingChat.id;
        }

        // Otherwise create a new chat
        const { data, error: insertError } = await supabase
          .from("chats")
          .insert({
            buyer_id: buyerId,
            seller_id: sellerId,
            product_id: listingId,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        setChatId(data.id);
        return data.id;
      } catch (err: any) {
        setError(err.message || "Failed to save chat");
        console.error("Error saving chat:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update navigation function to use seller terminology
  const navigateToChat = useCallback(
    (sellerId: string, listingId: string) => {
      const buyerId = sessionStorage.getItem("user_id");

      // Prevent users from chatting with themselves
      if (buyerId === sellerId) {
        toast.error("You cannot chat with yourself");
        return;
      }

      // Store in session storage before navigation
      sessionStorage.setItem("seller_id", sellerId);
      sessionStorage.setItem("product_id", listingId);

      // Navigate to chat page with query parameters
      router.push(`/chat?sellerId=${sellerId}&listingId=${listingId}`);
    },
    [router]
  );

  return { saveChat, loading, error, chatId, navigateToChat };
};
