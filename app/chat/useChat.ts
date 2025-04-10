import { useState, useEffect } from "react";
import { supabase } from "@/shared/lib/supabase";
import { Message, Listing } from "@/shared/lib/types";

export function useChat(
  currentUserId: string | null,
  participantId: string | null,
  listingId: string | null
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>("");
  const [listingInfo, setListingInfo] = useState<Listing | null>(null);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!currentUserId || !participantId || !listingId) return;

    async function fetchMessages() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${currentUserId})`
          )
          .eq("listing_id", listingId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Fetch participant info
        const { data: userData } = await supabase
          .from("users")
          .select("name")
          .eq("id", participantId)
          .single();

        setParticipantName(userData?.name || "User");

        // Fetch listing info
        const { data: listingData } = await supabase
          .from("listings")
          .select("id, title, price")
          .eq("id", listingId)
          .single();

        setListingInfo(listingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading messages");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === currentUserId &&
              newMessage.receiver_id === participantId) ||
            (newMessage.sender_id === participantId &&
              newMessage.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, participantId, listingId]);

  // Send message function
  const sendMessage = async (message: string) => {
    if (!currentUserId || !participantId || !listingId || !message.trim())
      return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: currentUserId,
        receiver_id: participantId,
        listing_id: listingId,
        message: message.trim(),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending message");
    } finally {
      setSending(false);
    }
  };

  return {
    chatState: { messages, loading, sending, error },
    participantInfo: { participantName, listingInfo },
    sendMessage,
  };
}
