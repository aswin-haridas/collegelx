import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Message } from "@/lib/types";

interface ChatState {
  messages: Message[];
  newMessage: string;
  sending: boolean;
  loading: boolean;
  error: string | null;
}

interface ParticipantInfo {
  sellerName: string | null;
  listingInfo: { title: string; price: number; id: string } | null;
}

export const useChat = (
  buyerId: string | null,
  sellerId: string | null,
  listingId: string | null
) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    newMessage: "",
    sending: false,
    loading: true,
    error: null,
  });

  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    sellerName: null,
    listingInfo: null,
  });

  useEffect(() => {
    if (!buyerId || !sellerId || !listingId) {
      setChatState((prev) => ({
        ...prev,
        error: "Missing required parameters for chat",
      }));
      return;
    }

    // Prevent users from chatting with themselves
    if (buyerId === sellerId) {
      setChatState((prev) => ({
        ...prev,
        error: "You cannot chat with yourself",
        loading: false,
      }));
      return;
    }

    const loadChatData = async () => {
      try {
        setChatState((prev) => ({ ...prev, loading: true }));

        await Promise.all([
          fetchMessages(),
          fetchSellerName(),
          fetchListingInfo(),
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load chat data";
        setChatState((prev) => ({ ...prev, error: errorMessage }));
        console.error("Error loading chat data:", err);
      } finally {
        setChatState((prev) => ({ ...prev, loading: false }));
      }
    };

    const channel = setupRealtimeSubscription();

    loadChatData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buyerId, sellerId, listingId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("product_id", listingId)
        .or(`buyer_id.eq.${buyerId},seller_id.eq.${buyerId}`)
        .or(`buyer_id.eq.${sellerId},seller_id.eq.${sellerId}`)
        .order("sent_at", { ascending: true });

      if (error) throw new Error(error.message);

      const filteredMessages = (data || []).filter(
        (msg) =>
          ((msg.buyer_id === buyerId && msg.seller_id === sellerId) ||
            (msg.buyer_id === sellerId && msg.seller_id === buyerId)) &&
          msg.product_id === listingId
      );

      setChatState((prev) => ({ ...prev, messages: filteredMessages }));
    } catch (err) {
      throw err;
    }
  };

  const fetchSellerName = async () => {
    if (!sellerId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", sellerId)
        .single();

      if (data && !error) {
        setParticipantInfo((prev) => ({ ...prev, sellerName: data.name }));
      }
    } catch (err) {
      console.error("Error fetching seller name:", err);
    }
  };

  const fetchListingInfo = async () => {
    if (!listingId) return;

    try {
      const { data, error } = await supabase
        .from("listings")
        .select("title, price, id")
        .eq("id", listingId)
        .single();

      if (data && !error) {
        setParticipantInfo((prev) => ({ ...prev, listingInfo: data }));
      }
    } catch (err) {
      console.error("Error fetching listing info:", err);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: any) => {
          const newMessage = payload.new as Message;

          // Check if message belongs to current chat conversation
          const isRelevantMessage =
            newMessage.product_id === listingId &&
            ((newMessage.buyer_id === buyerId &&
              newMessage.seller_id === sellerId) ||
              (newMessage.buyer_id === sellerId &&
                newMessage.seller_id === buyerId));

          if (isRelevantMessage) {
            setChatState((prev) => ({
              ...prev,
              messages: [...prev.messages, newMessage],
            }));
          }
        }
      )
      .subscribe();

    return channel;
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !buyerId || !sellerId || !listingId) return;

    try {
      setChatState((prev) => ({ ...prev, sending: true }));

      const messageData = {
        message: message.trim(),
        buyer_id: buyerId,
        seller_id: sellerId,
        sent_at: new Date().toISOString(),
        product_id: listingId,
      };

      const { error } = await supabase.from("messages").insert([messageData]);

      if (error) throw new Error(error.message);

      setChatState((prev) => ({ ...prev, newMessage: "", sending: false }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      console.error("Error sending message:", errorMessage);
      toast.error("Failed to send message. Please try again.");
      setChatState((prev) => ({ ...prev, sending: false }));
    }
  };

  const updateNewMessage = (message: string) => {
    setChatState((prev) => ({ ...prev, newMessage: message }));
  };

  return {
    chatState,
    participantInfo,
    sendMessage,
    updateNewMessage,
  };
};
