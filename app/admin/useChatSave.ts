import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCallback } from "react";

interface ChatSaveParams {
  senderId?: string | null;
  receiverId?: string | null;
  listingId?: string | null;
}

export const useChatSave = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const saveChat = useCallback(
    async ({ senderId, receiverId, listingId }: ChatSaveParams) => {
      if (!senderId || !receiverId || !listingId) {
        setError("Missing required parameters for chat");
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
            buyer_id: senderId,
            seller_id: receiverId,
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
            buyer_id: senderId,
            seller_id: receiverId,
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

  return { saveChat, loading, error, chatId };
};
