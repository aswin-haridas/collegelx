import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase"; 
import { ChatRoom, ChatMessage, User, Listing } from "@/types/index.ts"; 
import { useAuth } from "@/hooks/useAuth"; 

export type AugmentedChatRoom = ChatRoom & {
  listing?: Pick<Listing, "id" | "title" | "images" | "price" | "status"> | null; // MODIFIED: Pick specific Listing fields
  participant?: Pick<User, "id" | "full_name" | "username" | "profile_picture"> | null; // MODIFIED: Pick specific User fields
};

// Define column strings for consistency
const chatRoomColumns = "id, listing_id, buyer_id, seller_id, created_at, last_message_at";
const chatMessageColumns = "id, chat_room_id, sender_id, message, created_at, is_read";
const userPreviewColumns = "id, full_name, username, profile_picture"; // For participants
const listingPreviewColumns = "id, title, images, price, status"; // For linked listing in chat

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [augmentedChats, setAugmentedChats] = useState<AugmentedChatRoom[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { userId: currentUserId } = useAuth(); 

  const fetchAugmentedChatRooms = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: chatRooms, error: chatRoomsError } = await supabase
        .from("chat_rooms")
        .select(`
          ${chatRoomColumns},
          listing:listings (${listingPreviewColumns}),
          buyer:users!chat_rooms_buyer_id_fkey (${userPreviewColumns}),
          seller:users!chat_rooms_seller_id_fkey (${userPreviewColumns})
        `) // MODIFIED: Specific columns
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });

      if (chatRoomsError) throw chatRoomsError;

      if (chatRooms) {
        const augmentedData = chatRooms.map(chat => {
          const participant = chat.buyer_id === userId ? chat.seller : chat.buyer;
          return {
            ...(chat as ChatRoom), // Cast to base ChatRoom
            listing: chat.listing || null,
            participant: participant || null,
          } as AugmentedChatRoom; // Cast to final augmented type
        });
        setAugmentedChats(augmentedData);
      } else {
        setAugmentedChats([]);
      }

    } catch (err: any) {
      console.error("Error fetching augmented chat rooms:", err);
      setError(err.message || "Failed to fetch chat rooms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchAugmentedChatRooms(currentUserId);
    } else {
      setAugmentedChats([]);
      setMessages([]);
      setLoading(false);
    }
  }, [currentUserId, fetchAugmentedChatRooms]);

  const fetchMessagesForChat = useCallback(async (chatRoomId: string) => {
    // No global setLoading here, as this is specific to messages for a selected chat
    setError(null);
    try {
      const { data, error: messagesError } = await supabase
        .from("chat_messages")
        .select(chatMessageColumns) // MODIFIED: Specific columns
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(data || []);
    } catch (err: any) {
      console.error(`Error fetching messages for chat ${chatRoomId}:`, err);
      setError(err.message || "Failed to fetch messages.");
    }
  }, []);
  
  useEffect(() => {
    if (selectedChatId) {
      fetchMessagesForChat(selectedChatId);

      const channel = supabase
        .channel(`chat_room_messages:${selectedChatId}`) 
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `chat_room_id=eq.${selectedChatId}`, 
          },
          (payload) => {
            setMessages((currentMessages) => {
              if (currentMessages.find(msg => msg.id === (payload.new as ChatMessage).id)) {
                return currentMessages;
              }
              return [...currentMessages, payload.new as ChatMessage];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]); 
    }
  }, [selectedChatId, fetchMessagesForChat]);

  const sendMessage = async (messageText: string) => {
    if (!selectedChatId || !currentUserId) {
      setError("Chat room or user not identified.");
      return false;
    }
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("chat_messages")
        .insert({
          chat_room_id: selectedChatId,
          sender_id: currentUserId,
          message: messageText,
        })
        .select(chatMessageColumns) // MODIFIED: Specific columns
        .single();

      if (insertError) throw insertError;
      
      // The subscription should ideally handle adding the new message to the state.
      // If optimistic update is desired, it can be done here:
      // setMessages(prevMessages => [...prevMessages, data as ChatMessage]);

      await supabase
        .from("chat_rooms")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedChatId);
      
      if (currentUserId) fetchAugmentedChatRooms(currentUserId); // Refresh chat list to reorder

      return true;
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message.");
      return false;
    }
  };
  
  const createChatRoom = async ( 
    buyerId: string,
    sellerId: string,
    listingId: string
  ): Promise<ChatRoom | null> => {
    setError(null);
    try {
      const { data: existingRooms, error: existingError } = await supabase
        .from("chat_rooms")
        .select(chatRoomColumns) // MODIFIED: Specific columns
        .eq("listing_id", listingId)
        .eq("buyer_id", buyerId)
        .eq("seller_id", sellerId)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingRooms) { 
        const { data: updatedRoom, error: updateError } = await supabase
          .from("chat_rooms")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", existingRooms.id)
          .select(chatRoomColumns) // MODIFIED: Specific columns
          .single();
        if (updateError) throw updateError;
        if (currentUserId) fetchAugmentedChatRooms(currentUserId); 
        return updatedRoom as ChatRoom;
      }

      const { data, error: insertError } = await supabase
        .from("chat_rooms")
        .insert({
          buyer_id: buyerId,
          seller_id: sellerId,
          listing_id: listingId,
          last_message_at: new Date().toISOString(),
        })
        .select(chatRoomColumns) // MODIFIED: Specific columns
        .single();

      if (insertError) throw insertError;
      if (currentUserId) fetchAugmentedChatRooms(currentUserId); 
      return data as ChatRoom | null;
    } catch (err: any) {
      console.error("Error creating chat room:", err);
      setError(err.message || "Failed to create chat room.");
      return null;
    }
  };

  return {
    messages,
    chats: augmentedChats, 
    loading,
    error,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    createChatRoom, 
    fetchAugmentedChatRooms, 
    fetchMessagesForChat,  
  };
};
